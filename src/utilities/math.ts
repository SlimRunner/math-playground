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

export function lcm_Q(a: RationalNumber, b: RationalNumber): number {
  const Q = lcm(a.denominator, b.denominator);
  const A = a.scale(Q).toInteger().value;
  const B = b.scale(Q).toInteger().value;
  const T = lcm(A, B);
  if (T % Q !== 0) {
    throw EvalError("Assertion failed: T % Q == 0");
  }
  return T / Q;
}
