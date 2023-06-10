import { resourceUsage } from "process";
import { Vector } from "./Vector";

class MatrixError extends Error {
  /* Source
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
  */
  constructor(msg: string) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(msg);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MatrixError);
    }
      
    this.name = "MatrixError";
  }
}

export enum RowOpType {
  AddRow,
  ScaleRow,
  SwapRow
}

interface RowOpAdd {
  type: RowOpType.AddRow;
  row: number;
  addendRow: number;
  scalar: number;
}

interface RowOpScale {
  type: RowOpType.ScaleRow;
  row: number;
  scalar: number;
}

interface RowOpSwap {
  type: RowOpType.SwapRow;
  rows: number[];
}

export interface ElemRowOp {
  info: RowOpAdd | RowOpScale | RowOpSwap;
  factor: number;
}

export interface MatrixEntry {
  row: number;
  column: number;
}

export class Matrix {
  rows: number;
  columns: number;
  erops: ElemRowOp[];
  pivots: MatrixEntry[];
  entries: number[][];

  constructor(cells: number[][]) {
    if (!(cells instanceof Array)) {
      throw new MatrixError(`${typeof cells} type not supported to initialize Matrix`);
    }
    const ROWS = cells.length;
    const COLS = Math.max.apply(Math, cells.map(c => c.length));
    this.columns = COLS;
    this.rows = ROWS;

    this.erops = [];
    this.pivots = [];

    this.entries = [];
    for (let row = 0; row < ROWS; ++row) {
      this.entries.push([]);
      for (let col = 0; col < COLS; ++col) {
        if (col < cells[row].length) {
          this.entries[row].push(cells[row][col]);
        } else {
          this.entries[row].push(0);
        }
      }
    }
  }

  size() {
    return {
      rows: this.rows,
      columns: this.columns
    }
  }

  isSquare() {
    return this.rows === this.columns;
  }

  trace() {
    if (this.isSquare()) {
      return this.entries.reduce((prev, cur, idx) => (prev + cur[idx]), 0);
    }
    return undefined;
  }

  determinant() {
    if (!this.isSquare()) return undefined;
    const mtemp = this.ref();
    return mtemp.entries.reduce(
      (prod, fact, idx) => prod * fact[idx], 1
    ) / mtemp.erops.reduce(
      (prod, fact) => prod * fact.factor, 1
    );
  }

  inverse() {
    if (!this.isSquare()) {
      return undefined;
    }
    let mtx = new Matrix(this.entries);
    let mtxInv = Matrix.getIdentity(this.rows);
    mtx = mtx.rref({preferInt: false});
    // do not use pivots because you need the full diagonal
    const isSingular = mtx.entries.reduce((prev, cur, i) => prev * cur[i], 1) === 0;
    if (isSingular) {
      return undefined;
    }
    mtx.erops.forEach(rowop => {
      switch (rowop.info.type) {
        case RowOpType.ScaleRow:
          mtxInv = mtxInv.scaleRow(rowop.info.row, rowop.info.scalar);
          break;
      
        case RowOpType.AddRow:
          mtxInv = mtxInv.addRow(rowop.info.row, rowop.info.addendRow, rowop.info.scalar);
          break;
      
        case RowOpType.SwapRow:
          mtxInv = mtxInv.swapRows(rowop.info.rows[0], rowop.info.rows[1]);
          break;
      
        default:
          break;
      }
    });
    return mtxInv;
  }

  ref({unitPivots = false, preferInt = true} = {}) {
    let result = Matrix.copy(this);
    const gcd = (a: number, b: number) => {
      a = Math.abs(a);
      b = Math.abs(b);
      while (b > 0) {
        [a, b] = [b, a % b];
      }
      return a;
    }

    const pivots: MatrixEntry[] = [];
    let pivotRow = 0;
    let col = 0, row = 0;
    // infinite do-loop
    do {
      // seek for non zero leading entry
      while (col < result.columns && pivotRow < result.rows && result.entries[row][col] === 0) {
        ++row;
        if (row >= result.rows) {
          row = pivotRow;
          ++col;
        }
      }
      
      // exit point
      if (col >= result.columns || pivotRow >= result.rows) {
        if (unitPivots) {
          for (const piv of pivots) {
            const pinv = 1 / result.entries[piv.row][piv.column];
            result = result.scaleRow(piv.row, pinv);
          }
        }
        result.pivots = pivots;
        return result;
      }
      
      if (row !== pivotRow) {
        result = result.swapRows(row, pivotRow);
        row = pivotRow;
      }
      
      pivots.push({
        row: pivotRow,
        column: col
      });

      // zero out entries below pivot entry
      for (let i = row + 1; i < result.rows; ++i) {
        if (result.entries[i][col] !== 0) {
          let [a, b] = [result.entries[i][col], result.entries[row][col]];
          if (preferInt && Number.isInteger(a) && Number.isInteger(b)) {
            const fact = gcd(a, b);
            a /= fact;
            b /= fact;
            result = result.addRow(i, row, -a, b);
          } else {
            result = result.addRow(i, row, -a / b);
          }
        }
      }

      ++pivotRow;
      row = pivotRow;
      ++col;
    } while (true);
  }

  rref({preferInt = true, bypassREF = false} = {}) {
    let result = Matrix.copy(this);
    if (!bypassREF) {
      /**
       * this gives the option to not re-compute a Gaussian
       * elimination if had already been performed with ref()
       */
      result = result.ref({unitPivots: true, preferInt: preferInt});
    }
    const pivots = result.pivots;
    /**
     * I cannot reverse pivots because ref() returns them
     * in ascending order (ltr) and I do not see the need
     * to reverse twice while a regular for-loop works
     * around this issue.
     */
    for (let idx = pivots.length - 1; idx >= 0; --idx) {
      const piv = pivots[idx];
      for (let row = 0; row < piv.row; ++row) {
        if (result.entries[row][piv.column] !== 0) {
          // this assumes all pivots are 1
          result = result.addRow(row, piv.row, -result.entries[row][piv.column]);
        }
      }
    }
    return result;
  }

  swapRows(row1: number, row2: number) {
    const result = Matrix.copy(this);
    if (row1 === row2) return result;
    const temp = result.entries[row1];
    result.entries[row1] = result.entries[row2];
    result.entries[row2] = temp;

    result.erops.push({
      info: {
        type: RowOpType.SwapRow,
        rows: [row1, row2]
      },
      factor: -1
    });
    return result;
  }

  addRow(rowTo: number, rowFrom: number, kFrom: number, kTo: number = 1) {
    const result = Matrix.copy(this);
    if (kFrom === 0 && kTo === 1) return result;
    for (let j = 0; j < result.columns; ++j) {
      result.entries[rowTo][j] = kTo * result.entries[rowTo][j] + kFrom * result.entries[rowFrom][j];
    }
    if (kTo !== 1) {
      result.erops.push({
        info: {
          type: RowOpType.ScaleRow,
          row: rowTo,
          scalar: kTo
        },
        factor: kTo
      });
    }
    result.erops.push({
      info: {
        type: RowOpType.AddRow,
        row: rowTo,
        addendRow: rowFrom,
        scalar: kFrom
      },
      factor: 1
    });
    return result;
  }

  scaleRow(row: number, k: number) {
    const result = Matrix.copy(this);
    if (k === 1) return result;
    for (let col = 0; col < result.columns; ++col) {
      result.entries[row][col] *= k;
    }

    result.erops.push({
      info: {
        type: RowOpType.ScaleRow,
        row: row,
        scalar: k
      },
      factor: k
    });
    return result;
  }

  fixZeroes() {
    const result = Matrix.copy(this);
    for (const row of result.entries) {
      for (let j = 0; j < row.length; j++) {
        if (row[j] === 0) {
          row[j] = 0;
        }
      }
    }
    return result;
  }

  transpose() {
    const result = new Matrix(this.entries);
    const entries: number[][] = [];
    for (const row of result.entries) {
      if (entries.length) {
        row.forEach((entry, idx) => entries[idx].push(entry));
      } else {
        entries.push(...result.entries[0].map(c => [c]))
      }
    }
    result.entries = entries;
    [result.rows, result.columns] = [result.columns, result.rows];
    return result;
  }

  add(rhs: Matrix) {
    const lhs = new Matrix(this.entries);
    if (lhs.rows !== rhs.rows || lhs.columns !== rhs.columns) {
      throw new MatrixError("Matices have incompatible sizes for addition");
    }
    for (let i = 0; i < lhs.rows; ++i) {
      for (let j = 0; j < lhs.columns; ++j) {
        lhs.entries[i][j] += rhs.entries[i][j];
      }
    }
    return lhs;
  }

  subtract(rhs: Matrix) {
    const lhs = new Matrix(this.entries);
    if (lhs.rows !== rhs.rows || lhs.columns !== rhs.columns) {
      throw new MatrixError("Matices have incompatible sizes for subtraction");
    }
    for (let i = 0; i < lhs.rows; ++i) {
      for (let j = 0; j < lhs.columns; ++j) {
        lhs.entries[i][j] -= rhs.entries[i][j];
      }
    }
    return lhs;
  }

  multiply(rhs: Matrix | Vector) {
    // => matrix * rhs
    const lhs = new Matrix(this.entries);
    if (rhs instanceof Matrix) {
      if (lhs.columns !== rhs.rows) {
        throw new MatrixError("Matices have incompatible sizes for multiplication");
      }
      const prod: number[][] = [];
      for (let i = 0; i < lhs.rows; ++i) {
        prod.push([]);
        for (let j = 0; j < rhs.columns; ++j) {
          prod[i].push(0);
          for (let k = 0; k < lhs.columns; ++k) {
            prod[i][j] += lhs.entries[i][k] * rhs.entries[k][j];
          }
        }
      }
      return new Matrix(prod);
    } else {
      if (lhs.columns !== rhs.size) {
        throw new MatrixError("Matrix columns and Vector size have incompatible dimensions");
      }
      const prod = [];
      for (let i = 0; i < lhs.rows; ++i) {
        prod.push(0);
        for (let k = 0; k < lhs.columns; ++k) {
          prod[i] += lhs.entries[i][k] * rhs.entries[k];
        }
      }
      return new Vector(prod);
    }
  }

  scale(scalar: number) {
    const lhs = new Matrix(this.entries);
    for (const row of lhs.entries) {
      for (let j = 0; j < lhs.columns; ++j) {
        row[j] *= scalar;
      }
    }
    return lhs;
  }

  rowMatrix(row: number) {
    return new Matrix([this.entries[row]]);
  }

  columnMatrix(column: number) {
    return new Matrix([this.entries.map(r => r[column])]);
  }

  submatrix(atRow: number, atColumn: number) {
    const entries: number[][] = [];
    for (let i = 0; i < this.rows; ++i) {
      if (i === atRow) continue;
      entries.push([]);
      for (let j = 0; j < this.rows; ++j) {
        if (j === atColumn) continue;
        entries[entries.length - 1].push(this.entries[i][j]);
      }
    }
    return new Matrix(entries);
  }

  minor(atRow: number, atColumn: number) {
    if (this.isSquare()) {
      return this.submatrix(atRow, atColumn).determinant() as number;
    }
    throw new MatrixError("Only square matrices have minors");
  }

  cofactor(atRow = 0, atColumn = 0) {
    if (this.isSquare()) {
      return ((atRow + atColumn) % 2 ? -1 : 1) * this.minor(atRow, atColumn);
    }
    throw new MatrixError("Only square matrices have cofactors");
  }

  comatrix() {
    // this is a really bad idea
    // this code is not optimized at all
    return new Matrix(this.entries.map((r, i) => (r.map((c, j) => this.cofactor(i, j)))));
  }

  adjoint() {
    if (this.isSquare()) {
      const M = this.rref();
      const I = Matrix.getIdentity(this.rows);
      const isSingular = M.entries.reduce((prev, cur, i) => prev * cur[i], 1) === 0;
      if (isSingular) {
        // this is extremely inefficient
        const adj = this.comatrix();
        adj.transpose();
        return adj;
      }
      let detInv = 1;
      let emtx = I;
      M.erops.forEach(rowop => {
        detInv *= rowop.factor;
        switch (rowop.info.type) {
          case RowOpType.ScaleRow:
            emtx = emtx.scaleRow(rowop.info.row, rowop.info.scalar);
            break;
        
          case RowOpType.AddRow:
            emtx = emtx.addRow(rowop.info.row, rowop.info.addendRow, rowop.info.scalar);
            break;
        
          case RowOpType.SwapRow:
            emtx = emtx.swapRows(rowop.info.rows[0], rowop.info.rows[1]);
            break;
        
          default:
            break;
        }
      });
      return emtx.scale(1 / detInv);
    }
  }

  augment(mtx: Matrix) {
    const result = new Matrix(this.entries);
    if (result.rows !== mtx.rows) {
      throw new MatrixError("Cannot augment with a matrix of mismatched rows.");
    } else {
      const newColumns = Math.max.apply(Math, mtx.entries.map(r => r.length));
      for (let i = 0; i < result.rows; ++i) {
        for (let j = 0; j < newColumns; ++j) {
          result.entries[i].push(mtx.entries[i][j] ?? 0);
        }
      }
    }
    result.columns = result.entries[0].length;
    return result;
  }

  sliceColumns(from: number, to: number) {
    if (from >= 0 && from < this.columns && to >= 0 && to < this.columns) {
      if (from > to) [from, to] = [to, from];
      const newColumns = this.entries.map(r => r.slice(from, to + 1));
      const M = new Matrix(newColumns)
      return M;
    }
    throw new MatrixError("Slice limits are out of range");
  }

  static copy(mtx: Matrix) {
    const result = new Matrix(mtx.entries);
    result.erops = mtx.erops.map(n => n);
    result.pivots = mtx.pivots.map(n => n);
    return result;
  }

  static getREF(mtx: Matrix, {unitPivots = false, preferInt = true} = {}) {
    return mtx.ref({unitPivots, preferInt});
  }

  static getRREF(mtx: Matrix, {preferInt = true} = {}) {
    return mtx.rref({preferInt});
  }

  static getIdentity(rank: number) {
    let arr: number[][] = [];
    for (let i = 0; i < rank; ++i) {
      arr.push([]);
      for (let j = 0; j < rank; ++j) {
        arr[i].push((i === j ? 1 : 0));
      }
    }
    return new Matrix(arr);
  }

  static getZero(rows: number, cols: number) {
    let arr: number[][] = [];
    for (let i = 0; i < rows; ++i) {
      arr.push([]);
      for (let j = 0; j < cols; ++j) {
        arr[i].push(0);
      }
    }
    return new Matrix(arr);
  }

  static fromRowVectors(vectors: Vector[]) {
    return new Matrix(vectors.map(v => v.entries));
  }

  static fromColVectors(vectors: Vector[]) {
    const entries: number[][] = [];
      for (let i = 0; i < vectors[0].size; ++i) {
        entries.push([]);
        for (let j = 0; j < vectors.length; ++j) {
          entries[i].push(vectors[j].entries[i]);
        }
      }
      return new Matrix(entries);
  }

  static transpose(mtx: Matrix) {
    return mtx.transpose();
  }

  static add(lhs: Matrix, rhs: Matrix) {
    return lhs.add(rhs);
  }

  static subtract(lhs: Matrix, rhs: Matrix) {
    return lhs.subtract(rhs);
  }

  static multiply(lhs: Matrix, rhs: Matrix | Vector) {
    return lhs.multiply(rhs);
  }

  static scale(mtx: Matrix, scalar: number) { 
    return mtx.scale(scalar);
  }

  static augment(mtx: Matrix, ntx: Matrix) {
    return mtx.augment(ntx);
  }
}