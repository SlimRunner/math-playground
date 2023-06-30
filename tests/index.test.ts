import { Matrix } from "../src/linear-algebra/Matrix";
import { RationalNumber } from "../src/arithmetic/RationalNumber";

describe('Testing Matrix class', () => {
  test('Construction of empty Matrix', () => {
    const obj = new Matrix([[]]);
    expect(obj.columns).toBe(0);
    expect(obj.rows).toBe(1); // since entries are [[]]
    expect(obj.erops.length).toBe(0);
    expect(obj.pivots.length).toBe(0);
    expect(obj.entries.length).toBe(1);
    expect(obj.entries.at(0)?.length).toBe(0);
  });

  test('Construction of 1x1 Matrix', () => {
    const n = Math.random();
    const obj = new Matrix([[n]]);
    expect(obj.columns).toBe(1);
    expect(obj.rows).toBe(1);
    expect(obj.entries.at(0)?.at(0)).toBe(n);
  });
});

describe('Testing RationalNumber class', () => {
  test('Construction non simplified fraction', () => {
    const factor = 2 * 3 * 5 * 7 * 2;
    const obj = new RationalNumber(factor, factor * 5);
    expect(obj.numerator).toBe(1);
    expect(obj.denominator).toBe(5);
  });
  
  test('Modulo of rational numbers', () => {
    const a = new RationalNumber(123456789, 32547);
    const b = new RationalNumber(33, 105);
    const obj = a.modulo(b);
    expect(obj.numerator).toBe(26814);
    expect(obj.denominator).toBe(379715);
  });
});