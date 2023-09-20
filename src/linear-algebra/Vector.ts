import { Matrix } from "./Matrix";
import { VectorError } from "../utilities/error";

export class Vector {
  size: number;
  entries: number[];

  constructor(source: number[] | Matrix) {
    if (source instanceof Matrix) {
      if (source.rows !== 1 && source.columns !== 1) {
        throw new VectorError(
          `Argument Error`,
          /*expected */ `a column or a row matrix`,
          /*, but instead got */ `a ${source.rows}⨯${source.columns} matrix`
        );
      }
      this.entries = source.entries.flatMap((e) => e);
      this.size = Math.max(source.rows, source.columns);
    } else if (source instanceof Array) {
      this.entries = source.map((e) => e);
      this.size = this.entries.length;
    } else {
      throw new VectorError(
        `Type Error`,
        /*expected */ `a an array of numbers or a matrix`,
        /*, but instead got */ `${source}`
      );
    }
  }

  magnitude() {
    return Math.hypot(...this.entries);
  }

  normalized() {
    const norm = Math.hypot(...this.entries);
    return new Vector(this.entries.map((ve) => ve / norm));
  }

  add(rhs: Vector) {
    const lhs = new Vector(this.entries);
    if (lhs.size !== rhs.size) {
      throw new VectorError(
        `Argument Error`,
        /*expected */ `vectors of equal dimensions`,
        /*, but instead got */ `${this.size}-vector and a ${rhs.size}-vector`
      );
    }
    for (let i = 0; i < lhs.size; ++i) {
      lhs.entries[i] += rhs.entries[i];
    }
    return lhs;
  }

  subtract(rhs: Vector) {
    const lhs = new Vector(this.entries);
    if (lhs.size !== rhs.size) {
      throw new VectorError(
        `Argument Error`,
        /*expected */ `vectors of equal dimensions`,
        /*, but instead got */ `${this.size}-vector and a ${rhs.size}-vector`
      );
    }
    for (let i = 0; i < lhs.size; ++i) {
      lhs.entries[i] -= rhs.entries[i];
    }
    return lhs;
  }

  multiply(rhs: Vector | Matrix) {
    const lhs = new Vector(this.entries);
    if (rhs instanceof Matrix) {
      if (lhs.size !== rhs.rows) {
        throw new VectorError(
          `Argument Error`,
          /*expected */ `vector and matrix of compatible dimensions`,
          /*, but instead got */ `${this.size}-vector and a ${rhs.rows}⨯${rhs.columns} matrix`
        );
      }
      const prod: number[] = [];
      for (let j = 0; j < rhs.columns; ++j) {
        prod.push(0);
        for (let k = 0; k < lhs.size; ++k) {
          prod[j] += lhs.entries[k] * rhs.entries[k][j];
        }
      }
      return new Vector(prod);
    } else {
      // memberwise multiplication ¯\_(ツ)_/¯
      if (lhs.size !== rhs.size) {
        throw new VectorError(
          `Argument Error`,
          /*expected */ `vectors of equal dimensions`,
          /*, but instead got */ `${this.size}-vector and a ${rhs.size}-vector`
        );
      }
      for (let i = 0; i < lhs.size; ++i) {
        lhs.entries[i] *= rhs.entries[i];
      }
      return lhs;
    }
  }

  scale(scalar: number) {
    const lhs = new Vector(this.entries);
    for (let i = 0; i < lhs.size; ++i) {
      lhs.entries[i] *= scalar;
    }
    return lhs;
  }

  dot(rhs: Vector) {
    if (rhs instanceof Vector) {
      if (this.size !== rhs.size) {
        throw new VectorError(
          `Argument Error`,
          /*expected */ `vectors of equal dimensions`,
          /*, but instead got */ `${this.size}-vector and a ${rhs.size}-vector`
        );
      }
      let result = 0;
      for (let i = 0; i < this.size; ++i) {
        result += this.entries[i] * rhs.entries[i];
      }
      return result;
    }
    throw new VectorError(
      `Type Error`,
      /*expected */ `a vector on the right hand side`,
      /*, but instead got */ `${rhs}`
    );
  }

  cross(rhs: Vector) {
    if (rhs instanceof Vector) {
      if (this.size !== rhs.size) {
        throw new VectorError(
          `Argument Error`,
          /*expected */ `vectors of equal dimensions`,
          /*, but instead got */ `${this.size}-vector and a ${rhs.size}-vector`
        );
      }
      if (this.size != 3) {
        throw new VectorError(
          `Argument Error`,
          /*expected */ `a vector or dimension 3`,
          /*, but instead got */ `${this.size}-vector for both inputs`
        );
      }
      let result = [0, 0, 0];
      result[2] =
        this.entries[0] * rhs.entries[1] - this.entries[1] * rhs.entries[0];
      if (this.size === 3) {
        result[0] =
          this.entries[1] * rhs.entries[2] - this.entries[2] * rhs.entries[1];
        result[1] = -(
          this.entries[0] * rhs.entries[2] -
          this.entries[2] * rhs.entries[0]
        );
      } else {
        result[0] = 0;
        result[1] = 0;
      }
      return new Vector(result);
    }
    throw new VectorError(
      `Type Error`,
      /*expected */ `a vector on the right hand side`,
      /*, but instead got */ `${rhs}`
    );
  }

  project(a: Vector) {
    const numerator = this.dot(a);
    const denominator = a.entries.reduce((p, c) => p + c * c, 0);
    return a.scale(numerator / denominator);
  }

  getColumnMatrix() {
    return new Matrix(this.entries.map((n) => [n]));
  }

  getRowMatrix() {
    return new Matrix([this.entries]);
  }

  static add(lhs: Vector, rhs: Vector) {
    return lhs.add(rhs);
  }

  static subtract(lhs: Vector, rhs: Vector) {
    return lhs.subtract(rhs);
  }

  static multiply(lhs: Vector, rhs: Vector | Matrix) {
    return lhs.multiply(rhs);
  }

  static scale(vec: Vector, scalar: number) {
    return vec.scale(scalar);
  }

  static dot(lhs: Vector, rhs: Vector) {
    return lhs.dot(rhs);
  }

  static cross(lhs: Vector, rhs: Vector) {
    return lhs.cross(rhs);
  }
}
