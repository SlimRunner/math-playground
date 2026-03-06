export type Tuple<TItem, TLength extends number> = [TItem, ...TItem[]] & {
  length: TLength;
};

export class MatrixS<R extends number, C extends number> {
  readonly rows: R;
  readonly cols: C;
  readonly entries: Tuple<Tuple<number, C>, R>;

  constructor(rows: R, cols: C);
  constructor(cells: Tuple<Tuple<number, C>, R>);
  constructor(...args: [rows: R, cols: C] | [cells: Tuple<Tuple<number, C>, R>]) {
    if (args.length === 2) {
      const [rows, cols] = args;
      this.rows = rows;
      this.cols = cols;

      this.entries = new Array(this.rows) as Tuple<Tuple<number, C>, R>;
      for (let row = 0; row < this.rows; ++row) {
        this.entries[row] = new Array(this.cols) as Tuple<number, C>;
        for (let col = 0; col < this.cols; ++col) {
          this.entries[row][col] = 0;
        }
      }
    } else {
      const [cells] = args;
      this.rows = cells.length;
      this.cols = cells[0]?.length ?? 0;

      this.entries = new Array(this.rows) as Tuple<Tuple<number, C>, R>;
      for (let row = 0; row < this.rows; ++row) {
        this.entries[row] = new Array(this.cols) as Tuple<number, C>;
        for (let col = 0; col < this.cols; ++col) {
          this.entries[row][col] = cells[row][col];
        }
      }
    }
  }

  size(): [R, C] {
    return [this.rows, this.cols];
  }

  trace(this: MatrixS<R, R>) {
    return this.entries.reduce((prev, cur, idx) => (prev + cur[idx]), 0);
  }

  fixZeroes() {
    const result = new MatrixS(this.entries);
    for (const i of result.entries) {
      for (let j = 0; j < i.length; j++) {
        if (i[j] === 0) {
          i[j] = 0;
        }
      }
    }
    return result;
  }

  transpose(): MatrixS<C, R> {
    const result = new MatrixS(this.cols, this.rows);
    for (let row = 0; row < this.cols; ++row) {
      for (let col = 0; col < this.rows; ++col) {
        result.entries[row][col] = this.entries[col][row];
      }
    }
    return result;
  }

  add(rhs: MatrixS<R, C>) {
    const lhs = new MatrixS(this.entries);
    for (let i = 0; i < lhs.rows; ++i) {
      for (let j = 0; j < lhs.cols; ++j) {
        lhs.entries[i][j] += rhs.entries[i][j];
      }
    }
    return lhs;
  }

  subtract(rhs: MatrixS<R, C>) {
    const lhs = new MatrixS(this.entries);
    for (let i = 0; i < lhs.rows; ++i) {
      for (let j = 0; j < lhs.cols; ++j) {
        lhs.entries[i][j] -= rhs.entries[i][j];
      }
    }
    return lhs;
  }

  multiply<C2 extends number>(rhs: MatrixS<C, C2>): MatrixS<R, C2> {
    const prod = new MatrixS(this.rows, rhs.cols);
    for (let i = 0; i < this.rows; ++i) {
      for (let j = 0; j < rhs.cols; ++j) {
        for (let k = 0; k < this.cols; ++k) {
          prod.entries[i][j] += this.entries[i][k] * rhs.entries[k][j];
        }
      }
    }
    return prod;
  }

  scale(scalar: number) {
    const lhs = new MatrixS(this.entries);
    for (const row of lhs.entries) {
      for (let j = 0; j < lhs.cols; ++j) {
        row[j] *= scalar;
      }
    }
    return lhs;
  }

  rowMatrix(row: number) {
    return new MatrixS<1, C>([this.entries[row]]);
  }

  columnMatrix(column: number) {
    return new MatrixS<R, 1>(
      this.entries.map((r) => [r[column]]) as Tuple<Tuple<number, 1>, R>,
    );
  }

  equals(rhs: MatrixS<R, C>) {
    for (let row = 0; row < this.rows; ++row) {
      for (let col = 0; col < this.cols; ++col) {
        if (this.entries[row][col] !== rhs.entries[row][col]) {
          return false;
        }
      }
    }
    return true;
  }

  at(row: number, col: number) {
    return this.entries[row][col];
  }

  countIf(match: number) {
    let count = 0;
    this.entries.forEach((r) =>
      r.forEach((c) => (c === match ? ++count : count)),
    );
    return count;
  }

  map(pred: (c: number, rc: [number, number]) => number) {
    const res = new MatrixS(this.entries);
    for (let row = 0; row < res.rows; ++row) {
      for (let col = 0; col < res.cols; ++col) {
        res.entries[row][col] = pred(res.entries[row][col], [row, col]);
      }
    }
    return res;
  }
}
