import { Arithmetic, Comparable } from "../interfaces";
import { RealNumber } from "./RealNumber";

function gcd(a: number, b: number) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b > 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export class RationalNumber
  implements
  Arithmetic<RationalNumber>,
  Comparable<RationalNumber>
{
  numerator: number;
  denominator: number;

  constructor(numerator: number, denominator: number) {
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
      throw TypeError("Rational number operands must be integral.");
    }

    const commonDenom = gcd(numerator, denominator);

    this.numerator = numerator / commonDenom;
    this.denominator = denominator / commonDenom;
  }

  add(rhs: RationalNumber) {
    const commonDenom = gcd(this.denominator, rhs.denominator);
    const leastMult = (this.denominator * rhs.denominator) / commonDenom;
    const a = (this.numerator * rhs.denominator) / commonDenom;
    const b = (rhs.numerator * this.denominator) / commonDenom;
    return new RationalNumber(a + b, leastMult);
  }

  subtract(rhs: RationalNumber) {
    const commonDenom = gcd(this.denominator, rhs.denominator);
    const leastMult = (this.denominator * rhs.denominator) / commonDenom;
    const a = (this.numerator * rhs.denominator) / commonDenom;
    const b = (rhs.numerator * this.denominator) / commonDenom;
    return new RationalNumber(a - b, leastMult);
  }

  multiply(rhs: RationalNumber) {
    return new RationalNumber(
      this.numerator * rhs.numerator,
      this.denominator * rhs.denominator
    );
  }

  divide(rhs: RationalNumber) {
    return new RationalNumber(
      this.numerator * rhs.denominator,
      this.denominator * rhs.numerator
    );
  }

  abs() {
    return new RationalNumber(
      Math.abs(this.numerator),
      Math.abs(this.denominator)
    );
  }

  modulo(rhs: RationalNumber) {
    let a = this.numerator * rhs.denominator;
    let b = this.denominator * rhs.numerator;
    let factor = Math.trunc(Math.abs(a / b));
    const offset = rhs.multiply(new RationalNumber(factor, 1));
    return this.subtract(offset);
  }

  scale(factor: number) {
    if (!Number.isInteger(factor)) {
      throw TypeError("Rational number operands must be integral.");
    }
    return new RationalNumber(this.numerator * factor, this.denominator);
  }

  compare(rhs: RationalNumber): number {
    return (this.numerator / this.denominator) - (rhs.numerator / rhs.denominator);
  }

  isInteger() {
    return Math.abs(this.denominator) == 1;
  }

  toInteger() {
    if (!this.isInteger()) {
      throw TypeError("Cannot be converted to integer.");
    }
    return new RealNumber(this.numerator * this.denominator);
  }

  toRealNumber() {
    return new RealNumber(this.numerator / this.denominator);
  }

  fixSigns() {
    const negative = this.numerator < 0 !== this.denominator < 0;
    const a = Math.abs(this.numerator) * (negative ? -1 : 1);
    const b = Math.abs(this.denominator);
    return new RationalNumber(a, b);
  }

  toString() {
    return `${this.numerator.toString()} / ${this.denominator.toString()}`;
  }

  toLatex() {
    return String.raw`\frac{${this.numerator.toString()}}{${this.denominator.toString()}}`;
  }

  getZero(): RationalNumber {
    return new RationalNumber(0, 1);
  }

  getUnity(): RationalNumber {
    return new RationalNumber(1, 1);
  }
}
