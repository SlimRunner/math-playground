import { Arithmetic, Comparable, Congruent } from "../interfaces";

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
