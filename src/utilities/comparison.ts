import { Arithmetic, Comparable, Congruent } from "../interfaces";

export function isEqual<T extends Comparable<T>>(lhs: T, rhs: T): boolean {
  return lhs.compare(rhs) === 0;
}

export function isGreaterThan<T extends Comparable<T>>(lhs: T, rhs: T): boolean {
  return lhs.compare(rhs) > 0; // lhs - rhs > 0 <=> lhs > rhs
}

export function isLessThan<T extends Comparable<T>>(lhs: T, rhs: T): boolean {
  return lhs.compare(rhs) < 0; // lhs - rhs < 0 <=> lhs < rhs
}

export function inBetween<T extends Comparable<T>>(mid: T, lhs: T, rhs: T): boolean {
  return isLessThan(lhs, mid) && isLessThan(mid, rhs);
}

export function min<T extends Comparable<T>>(...values: T[]) {
  if (values.length === 0) {
    throw SyntaxError("min function must have at least one parameter");
  }
  let smallest: T = values.at(0) as T;
  for (const value of values) {
    if (smallest.compare(value) > 0) {
      smallest = value;
    }
  }
  return smallest;
}

export function max<T extends Comparable<T>>(...values: T[]) {
  if (values.length === 0) {
    throw SyntaxError("max function must have at least one parameter");
  }
  let smallest: T = values.at(0) as T;
  for (const value of values) {
    if (smallest.compare(value) < 0) {
      smallest = value;
    }
  }
  return smallest;
}
