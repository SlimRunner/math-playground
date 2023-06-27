import { Matrix } from "../src/linear-algebra/Matrix";

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
