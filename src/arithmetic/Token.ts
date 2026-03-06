/*
expression [relation expression] ...
- expression: a mathematical construct which can be evaluated
  to a constant once all its dependent values have been
  resolved to a constant.
- relation: an operator that establishes a mathematical
  relation between two expressions.

expression := [operator]token [operator functor(token, token, ...)]...
- token: a mathematical construct that has meaning on its own.
  It may not be deconstructible into smaller parts.
- operator: a unary or binary operator which acts upon tokens.
- functor: an operation of n-arity which operates on n tokens.

naming conventions
- names of non-constant tokens may be any combination of
  alphanumeric characters with the restriction that the first
  character must be a letter
- the only symbol allowed is the underscore (it can be first)
- case sensitive
 */

function oneTruth(...impl: boolean[]): boolean {
  let count = 0;
  for (const bit of impl) {
    if (bit) ++count;
  }
  return count === 1;
}

export interface operators {
  
}

export class Token {

}
