
export class Expression<T> {
  tokens: T[];

  constructor(expression: string) {
    this.tokens = [];
  }
}
