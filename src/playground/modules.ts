import { Arithmetic, Comparable } from "../interfaces";

function min<T extends Comparable<T>>(...values: T[]) {
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

function max<T extends Comparable<T>>(...values: T[]) {
  if (values.length === 0) {
    throw SyntaxError("min function must have at least one parameter");
  }
  let smallest: T = values.at(0) as T;
  for (const value of values) {
    if (smallest.compare(value) < 0) {
      smallest = value;
    }
  }
  return smallest;
}

export function getHSVfromRGB<T extends Arithmetic<T> & Comparable<T>>(red: T, green: T, blue: T) {
  const value: T = max(red, green, blue);
  const range: T = value.subtract(min(red, green, blue));
  const zero = value.getZero();
  const one = value.getUnity();
  
  const sat: T = (value.compare(zero) === 0) ? zero : range.divide(value);
  let hue: T = zero;
  
  if (range.compare(zero) === 0) hue = zero;
  else if (value.compare(red) === 0) hue = green.subtract(blue).scale(60).divide(range);
  else if (value.compare(green) === 0) hue = blue.subtract(red).divide(range).add(one.scale(2)).scale(60);
  else if (value.compare(blue) === 0) hue = red.subtract(green).divide(range).add(one.scale(4)).scale(60);

  return [hue, sat, value];
}
