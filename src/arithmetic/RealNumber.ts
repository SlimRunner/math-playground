import { Arithmetic, Comparable, Congruent } from "../interfaces";
import { RationalNumber } from "./RationalNumber";

/**
 * Wraps regular js numbers to allow having a regular interface for all types of tokens
 */
export class RealNumber
  implements
  Arithmetic<RealNumber>,
  Comparable<RealNumber>,
  Congruent<RealNumber>
{
  value: number;

  constructor(value: number) {
    this.value = value;
  }

  add(rhs: RealNumber) {
    const a = this.value;
    const b = rhs.value;
    return new RealNumber(a + b);
  }

  subtract(rhs: RealNumber) {
    const a = this.value;
    const b = rhs.value;
    return new RealNumber(a - b);
  }

  multiply(rhs: RealNumber) {
    const a = this.value;
    const b = rhs.value;
    return new RealNumber(a * b);
  }

  divide(rhs: RealNumber) {
    const a = this.value;
    const b = rhs.value;
    return new RealNumber(a / b);
  }

  scale(rhs: number) {
    return new RealNumber(this.value * rhs);
  }

  abs() {
    return Math.abs(this.value);
  }

  mod(rhs: RealNumber) {
    const residue = this.value % rhs.value;
    if (this.value * rhs.value >= 0) {
      return new RealNumber(residue);
    } else if (residue === 0) {
      return new RealNumber(0 * rhs.value);
    }
    return new RealNumber(residue + rhs.value);
  }

  modulo(rhs: RealNumber) {
    // TODO: add custom modulo function
    const a = this.value;
    const b = rhs.value;
    return new RealNumber(a % b);
  }

  compare(rhs: RealNumber): number {
    return this.value - rhs.value;
  }

  toRational() {
    if (!Number.isInteger(this.value)) {
      throw TypeError("Rational number operands must be integral.");
    }
    return new RationalNumber(this.value, 1);
  }

  toString() {
    return this.value.toString();
  }

  toLatex() {
    return this.value.toString();
  }

  getZero(): RealNumber {
    return new RealNumber(0);
  }

  getUnity(): RealNumber {
    return new RealNumber(1);
  }
}
