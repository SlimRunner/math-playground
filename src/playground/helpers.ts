import { ElemRowOp } from "../linear-algebra/Matrix";
import { RowOpType } from "../linear-algebra/Matrix";

function uSubscript(num: number) {
  return num
    .toString()
    .split("")
    .map((n) => String.fromCharCode(0x2080 + parseInt(n)))
    .join("");
}

export function printRowOperations(erops: ElemRowOp[]) {
  const logErop = [];
  for (const op of erops) {
    let n1: string, n2: string, s: string, k: number;
    switch (op.info.type) {
      case RowOpType.ScaleRow:
        n1 = uSubscript(op.info.row + 1);
        k = op.info.scalar;
        s = k >= 0 ? "" : "-";
        k = Math.abs(k);
        logErop.push(`${s}${k !== 1 ? k : ""}R${n1} —→ R${n1}`);
        break;

      case RowOpType.AddRow:
        n1 = uSubscript(op.info.row + 1);
        n2 = uSubscript(op.info.addendRow + 1);
        k = op.info.scalar;
        s = k >= 0 ? "+" : "-";
        k = Math.abs(k);
        logErop.push(`R${n1} ${s} ${k !== 1 ? k : ""}R${n2} —→ R${n1}`);
        break;

      case RowOpType.SwapRow:
        n1 = uSubscript(op.info.rows[0] + 1);
        n2 = uSubscript(op.info.rows[1] + 1);
        logErop.push(`R${n1} ←→ R${n2}`);
        break;

      default:
        break;
    }
  }
  console.log(`%c${logErop.join("\n")}`, "font-size: large");
}

export function* divSet(
  start: number,
  end: number,
  divisor: number,
  offset: number = 0,
) {
  let s = Math.sign(end - start);
  if (start === end) {
    yield start;
    return;
  } else if (divisor === 0) {
    return;
  }
  const mod = (n: number, m: number) => {
    const rem = n % m;
    return n * m >= 0 ? rem : rem ? rem + m : 0;
  };
  const st = Math.abs(divisor);
  const n = mod(offset, st);
  let i = start;
  if (i % st !== n) {
    i += s >= 0 ? st - mod(i - n, st) : -mod(i - n, st);
    if (!(s >= 0 ? i <= end : i >= end)) return;
  }
  while (s >= 0 ? i <= end : i >= end) {
    yield i;
    i += s * st;
  }
}

export function range(count: number): Generator<number, void, unknown>;
export function range(
  start: number,
  end: number,
): Generator<number, void, unknown>;
export function range(
  start: number,
  end: number,
  step: number,
): Generator<number, void, unknown>;
export function* range(
  start: number,
  end: number | null = null,
  step: number = 1,
): Generator<number, void, unknown> {
  if (end == null) {
    [start, end] = [0, start];
  }
  if ((end - start) * step < 0) {
    return;
  } else if (step >= 1) {
    for (let i = start; i < end; i += step) {
      yield i;
    }
  } else {
    for (let i = start; i > end; i += step) {
      yield i;
    }
  }
}

export function* enumerate<T>(
  iter: Iterable<T>,
): Generator<[number, T], void, unknown> {
  let i = 0;
  for (const item of iter) {
    yield [i++, item];
  }
  return;
}
