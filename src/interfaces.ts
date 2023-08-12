/*
getZero and getUnity might be better implemented like this
https://stackoverflow.com/a/43674389 as static members,
but that looks a little too busy. If current approach
proves impractical, I will cosider a refactor.
*/

export interface HasZero<T> {
  getZero(): T;
}

export interface HasUnit<T> {
  getUnity(): T;
}

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

export interface Comparable<T> {
  compare(rhs: T): number;
}

export interface Arithmetic<T>
  extends Additive<T>,
    Multiplicative<T>,
    Divisible<T>,
    Scalable<T>,
    HasZero<T>,
    HasUnit<T> {}
