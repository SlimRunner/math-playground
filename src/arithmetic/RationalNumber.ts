import { Arithmetic, Comparable, Congruent } from "../interfaces";
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
  Comparable<RationalNumber>,
  Congruent<RationalNumber>
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
    // you might want to compute the GDC before to prevent oveflow
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

  mod(rhs: RationalNumber) {
    // https://www.desmos.com/calculator/lcxu6dlrim
    const num = this.numerator * rhs.denominator;
    const denom = this.denominator * rhs.numerator;
    const ratio = num / denom;
    const factor = Math.abs(ratio);
    if (ratio >= 0) {
      return this.subtract((rhs.scale(Math.floor(factor))));
    } else {
      return this.add((rhs.scale(Math.ceil(factor))));
    }
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
