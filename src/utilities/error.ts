// Define a class factory function
function createError(name: string) {
  // Define a dynamic class using a class expression
  class CustomError<T, S> extends Error {
    expected: T;
    received: S;
    /* Source
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
     */
    constructor(msg: string, expected: T, received: S) {
      // Pass remaining arguments (including vendor specific ones) to parent constructor
      super(msg);

      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }

      this.name = name;
      this.expected = expected;
      this.received = received;
    }

    what(): string {
      return this.name +
        `[${this.message}]: ` + 
        `expected ${this.expected}` +
        `, but instead got ${this.received}`;
    }
  }

  return CustomError;
}

// function courtesy of chat gpt
function hasToStringProperty(obj: any): obj is { toString: () => string } {
  return typeof obj === "object" && typeof obj.toString === "function";
}

export function formatType(input: any) {
  if (input instanceof Array) {
    return JSON.stringify(input);
  } else if (hasToStringProperty(input)) {
    return input.toString();
  } else {
    return "unknown";
  }
}

export const MatrixError = createError("MatrixError");
export const VectorError = createError("VectorError");
