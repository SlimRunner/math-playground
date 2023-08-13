import { Matrix } from "../src/linear-algebra/Matrix";
import { RationalNumber } from "../src/arithmetic/RationalNumber";
import { RealNumber } from "../src/arithmetic/RealNumber";

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
    const ansNum = [26814, 18505, -18505, -26814];
    const ansDen = [379715, 75943, 75943, 379715];
    for (const m of [1, -1]) {
      for (const n of [1, -1]) {
        const obj = a.scale(n).mod(b.scale(m));
        expect(obj.numerator).toBe(ansNum.shift());
        expect(obj.denominator).toBe(ansDen.shift());
      }
    }
  });

  test('edge cases of modulo', () => {
    const a = new RationalNumber(33, 105);
    for (const m of [1, -1]) {
      for (const n of [1, -1]) {
        const obj = a.scale(n).mod(a.scale(m));
        expect(obj.toRealNumber().value).toBe(0);
      }
    }
  })

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

describe('RealNumber class', () => {
  test('modulo of real numbers', () => {
    // prepared with https://www.desmos.com/calculator/0tcz1qjdla
    const a = new RealNumber(7.625);
    const b = new RealNumber(0.5);
    const answers = [0.125, 0.375, -0.375, -0.125];
    for (const m of [1, -1]) {
      for (const n of [1, -1]) {
        const obj = a.scale(n).mod(b.scale(m));
        expect(obj.value).toBe(answers.shift());
      }
    }
  })

  test('edge cases of modulo', () => {
    const a = new RealNumber(7);
    const answers = [0, 0, -0, -0];
    for (const m of [1, -1]) {
      for (const n of [1, -1]) {
        const obj = a.scale(n).mod(a.scale(m));
        expect(obj.value).toBe(answers.shift());
      }
    }
  })
});
