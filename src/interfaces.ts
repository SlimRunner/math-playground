export interface Additive<T> {
  add(rhs: T): T;
  subtract(rhs: T): T;
}

export interface Multiplicative<T> {
  multiply(rhs: T): T;
}

export interface Invertible<T> {
  divide(rhs: T): T;
}