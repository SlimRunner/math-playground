export interface MathOperations<T> {
  add(rhs: T): T;
  subtract(rhs: T): T;
  multiply(rhs: T): T;
  // divide(rhs: T): T;
}