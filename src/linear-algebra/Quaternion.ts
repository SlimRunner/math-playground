import { Arithmetic, ArithmeticIdentities, Equatable } from "../interfaces";
import { QuaternionError, formatType } from "../utilities/error";

// this library is meant to be standalone hence why it does not use any
// of the other libraries.

export class Quaternion
  implements Arithmetic<Quaternion>, Equatable<Quaternion>
{
  readonly real: number;
  readonly imag_i: number;
  readonly imag_j: number;
  readonly imag_k: number;

  constructor(a: number, b: number, c: number, d: number) {
    this.real = a;
    this.imag_i = b;
    this.imag_j = c;
    this.imag_k = d;
  }

  add(rhs: Quaternion): Quaternion {
    return new Quaternion(
      this.real + rhs.real,
      this.imag_i + rhs.imag_i,
      this.imag_j + rhs.imag_j,
      this.imag_k + rhs.imag_k
    );
  }

  subtract(rhs: Quaternion): Quaternion {
    return new Quaternion(
      this.real - rhs.real,
      this.imag_i - rhs.imag_i,
      this.imag_j - rhs.imag_j,
      this.imag_k - rhs.imag_k
    );
  }

  scale(factor: number): Quaternion {
    return new Quaternion(
      factor * this.real,
      factor * this.imag_i,
      factor * this.imag_j,
      factor * this.imag_k
    );
  }

  multiply(rhs: Quaternion): Quaternion {
    return new Quaternion(
      this.real * rhs.real -
        this.imag_i * rhs.imag_i -
        this.imag_j * rhs.imag_j -
        this.imag_k * rhs.imag_k,
      this.real * rhs.imag_i +
        this.imag_i * rhs.real +
        this.imag_j * rhs.imag_k -
        this.imag_k * rhs.imag_j,
      this.real * rhs.imag_j -
        this.imag_i * rhs.imag_k +
        this.imag_j * rhs.real +
        this.imag_k * rhs.imag_i,
      this.real * rhs.imag_k +
        this.imag_i * rhs.imag_j -
        this.imag_j * rhs.imag_i +
        this.imag_k * rhs.real
    );
  }

  divide(rhs: Quaternion): Quaternion {
    const [a, b, c, d] = [
      this.real * rhs.real +
        this.imag_i * rhs.imag_i +
        this.imag_j * rhs.imag_j +
        this.imag_k * rhs.imag_k,
      -this.real * rhs.imag_i +
        this.imag_i * rhs.real -
        this.imag_j * rhs.imag_k +
        this.imag_k * rhs.imag_j,
      -this.real * rhs.imag_j +
        this.imag_i * rhs.imag_k +
        this.imag_j * rhs.real -
        this.imag_k * rhs.imag_i,
      -this.real * rhs.imag_k -
        this.imag_i * rhs.imag_j +
        this.imag_j * rhs.imag_i +
        this.imag_k * rhs.real,
    ];
    const denom =
      rhs.real * rhs.real +
      rhs.imag_i * rhs.imag_i +
      rhs.imag_j * rhs.imag_j +
      rhs.imag_k * rhs.imag_k;
    return new Quaternion(a / denom, b / denom, c / denom, d / denom);
  }

  conjugate() {
    return new Quaternion(this.real, -this.imag_i, -this.imag_j, -this.imag_k);
  }

  normSq() {
    // TODO: hard code
    return (
      this.real * this.real +
      this.imag_i * this.imag_i +
      this.imag_j * this.imag_j +
      this.imag_k * this.imag_k
    );
  }

  norm() {
    // hypot is more numerically stable but slower
    return Math.sqrt(
      this.real * this.real +
        this.imag_i * this.imag_i +
        this.imag_j * this.imag_j +
        this.imag_k * this.imag_k
    );
  }

  normalized() {
    return this.scale(1 / this.norm());
  }

  equal(rhs: Quaternion): boolean {
    return (
      this.real === rhs.real &&
      this.imag_i === rhs.imag_i &&
      this.imag_j === rhs.imag_j &&
      this.imag_k === rhs.imag_k
    );
  }

  toArray() {
    return [this.real, this.imag_i, this.imag_j, this.imag_k];
  }

  static readonly ZERO = new Quaternion(0, 0, 0, 0);
  static readonly ONE = new Quaternion(1, 0, 0, 0);
}

Quaternion satisfies ArithmeticIdentities<Quaternion>;
