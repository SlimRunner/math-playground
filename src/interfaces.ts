/*
getZero and getUnity might be better implemented like this
https://stackoverflow.com/a/43674389 as static members,
but that looks a little too busy. If current approach
proves impractical, I will cosider a refactor.
*/

export interface Additive<T> {
  add(rhs: T): T;
  subtract(rhs: T): T;
}

export interface Multiplicative<T> {
  multiply(rhs: T): T;
}

export interface Scalable<T> {
  scale(factor: number): T;
}

export interface Divisible<T> {
  divide(rhs: T): T;
}

export interface Congruent<T> {
  mod(rhs: T): T;
}

export interface Equatable<T> {
  equal(rhs: T): boolean;
}

export interface Comparable<T> extends Equatable<T> {
  compare(rhs: T): number;
}

export interface Arithmetic<T>
  extends Additive<T>,
    Multiplicative<T>,
    Divisible<T>,
    Scalable<T> {}

export interface ArithmeticIdentities<T> {
  ZERO: T;
  ONE: T;
}

export interface Tabular<T> {
  entries: T[] | T[][];
}

export interface DiscreteDiscernible<T> {
  isInteger(): boolean;
}
