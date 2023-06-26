import { Additive, Multiplicative, Invertible } from "../interfaces";

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
    Additive<RationalNumber>,
    Multiplicative<RationalNumber>,
    Invertible<RationalNumber>
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

  fixSigns() {
    const negative = this.numerator < 0 !== this.denominator < 0;
    const a = Math.abs(this.numerator) * (negative ? -1 : 1);
    const b = Math.abs(this.denominator);
    return new RationalNumber(a, b);
  }
}
