function gcd(a: number, b: number) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b > 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export class RationalNumber {
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

}