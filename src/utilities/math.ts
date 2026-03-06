import { RationalNumber } from "../arithmetic/RationalNumber";

import { Arithmetic } from "../interfaces";

function gcd(a: number, b: number) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b > 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a: number, b: number) {
  return (a * b) / gcd(a, b);
}

export function lcm_Q(a: RationalNumber, b: RationalNumber): RationalNumber {
  const Q = lcm(a.denominator, b.denominator);
  const A = a.scale(Q);
  const B = b.scale(Q);
  const T = lcm(A.toInteger().value, B.toInteger().value);
  return new RationalNumber(T, Q);
}
