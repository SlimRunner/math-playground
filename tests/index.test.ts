import { Matrix } from "../src/linear-algebra/Matrix";
import { RationalNumber } from "../src/arithmetic/RationalNumber";
import assert from "assert";
// import { RealNumber } from "../src/arithmetic/RationalNumber";

describe('Matrix class', () => {
  test('construction of empty Matrix', () => {
    const obj = new Matrix([[]]);
    expect(obj.columns).toBe(0);
    expect(obj.rows).toBe(1); // since entries are [[]]
    expect(obj.erops.length).toBe(0);
    expect(obj.pivots.length).toBe(0);
    expect(obj.entries.length).toBe(1);
    expect(obj.entries.at(0)?.length).toBe(0);
  });

  test('construction of 1x1 Matrix', () => {
    const n = Math.random();
    const obj = new Matrix([[n]]);
    expect(obj.columns).toBe(1);
    expect(obj.rows).toBe(1);
    expect(obj.entries.at(0)?.at(0)).toBe(n);
  });
});

describe('RationalNumber class', () => {
  test('construction of non simplified fraction', () => {
    const factor = 2 * 3 * 5 * 7 * 2;
    const obj = new RationalNumber(factor, factor * 5);
    expect(obj.numerator).toBe(1);
    expect(obj.denominator).toBe(5);
  });
  
  test('modulo of rational numbers', () => {
    const a = new RationalNumber(123456789, 32547);
    const b = new RationalNumber(33, 105);
    const obj = a.modulo(b);
    expect(obj.numerator).toBe(26814);
    expect(obj.denominator).toBe(379715);
  });

  test('conversion of rational to integer', () => {
    const base = 12;
    const factor = 7 * 5;
    const denomSign = -1;
    const obj = new RationalNumber(base * factor, denomSign * factor);
    expect(obj.numerator).toBe(base);
    expect(obj.denominator).toBe(denomSign);
    expect(obj.toInteger().value).toBe(base * denomSign);
  });

  test('failed conversion of rational to integer', () => {
    const a = 4 * 3;
    const b = -7 * 5;
    const obj = new RationalNumber(a, b);
    expect(obj.isInteger()).toBe(false);
    expect(() => {obj.toInteger()}).toThrowError(TypeError);
  });
});