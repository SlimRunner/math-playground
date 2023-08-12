import { ElemRowOp } from "../linear-algebra/Matrix";
import { RowOpType } from "../linear-algebra/Matrix";

function uSubscript(num: number) {
  return num
    .toString()
    .split("")
    .map(n => String.fromCharCode(0x2080 + parseInt(n)))
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

export function* range(start:number, end:number, step:number, offset:number = 0) {
  if (start === end) {
    yield start;
    return;
  }
  const mod = (n:number, m:number) => (n * m >= 0 ? n % m : n % m + m);
  let i = start;
  let n = mod(offset, step);
  let s = Math.sign(end - start);
  if (i % step !== n) {
    i += (s >= 0 ? step - mod(i - n, step) : -mod(i - n, step));
    if (!(s >= 0 ? (i <= end) : (i >= end))) return;
  }
  while ((s >= 0 ? (i <= end) : (i >= end))) {
    yield i;
    i += s * step;
  }
}
