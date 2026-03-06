import { RationalNumber } from "../arithmetic/RationalNumber";
import { Matrix } from "../linear-algebra/Matrix";
import { Vector } from "../linear-algebra/Vector";
import { printRowOperations, divSet, range } from "./helpers";
import { rgb2hsv, hsv2rgb } from "../utilities/color";
import { RealNumber } from "../arithmetic/RealNumber";
import { VectorError, MatrixError } from "../utilities/error";
import { lcm_Q } from "../utilities/math";
import { Quaternion } from "../linear-algebra/Quaternion";
import { MatrixS } from "../linear-algebra/MatrixS";

const ctab = (s: any) => {
  if (s instanceof Matrix || s instanceof Vector) {
    console.table(s.entries);
  } else if (s instanceof RationalNumber) {
    console.log(`${s.numerator}/${s.denominator}`);
  } else if (s instanceof MatrixS) {
    console.table(s.entries);
  } else {
    console.table(s);
  }
};
const clog = console.log;
const plog = (...s: Array<any>) => {
  if (s.length > 0 && s.every((e) => e instanceof RationalNumber)) {
    clog(...s.map((e) => e.toString()));
  } else {
    clog(...s);
  }
};

// const q1 = new Quaternion(0, 2, 3, 4).normalized();
// const q2 = new Quaternion(0, 4, -3, 2).normalized();

// const q3 = q1.divide(q2);
// const q4 = q1
//   .multiply(q2.conjugate())
//   .scale(1 / q2.multiply(q2.conjugate()).real);
// const q5 = q3.subtract(q4);
// ctab(q5);

// ctab(q1);
// ctab(q2);
// ctab(q1.multiply(q2).multiply(q1.conjugate()));

// const theta = 1.235;
// const s = Math.sin(theta / 2);
// const w = Math.cos(theta / 2);
// const v = new Vector([4, 3, -5]);
// const [x, y, z] = v.normalized().entries.map(n => n * s);

// const q = new Quaternion(w, x, y, z);

// ctab(Quaternion.ONE.divide(q));
// ctab(q.conjugate());


let w = new MatrixS([[0, 0, 0]]).transpose();
const x = new MatrixS([
  [1, 1, 0],
  [1, 2, -1],
  [1, 5, -3],
  [1, 3, -1],
  [1, 0, 0],
]).transpose();
const yt = new MatrixS([[1, 1, -1, 1, 1]]);
const y = yt.transpose();
const sgn = (n: number) => (n > 0 ? 1 : -1);

ctab(w.transpose().multiply(x).map(sgn));

for (const e of range(2)) {
  let updates = 0;
  for (const i of range(x.cols)) {
    const xi = x.columnMatrix(i);
    const output = w.transpose().multiply(xi);

    if (y.at(i, 0) !== sgn(output.at(0, 0))) {
      w = w.add(xi.scale(y.at(i, 0)));
      ++updates;
      clog(`out: ${sgn(output.at(0, 0))} (x)`);
    } else {
      clog(`out: ${sgn(output.at(0, 0))} (=)`);
    }
  }

  const yp = w.transpose().multiply(x).map(sgn);
  const matches = yp.subtract(yt).countIf(0);
  clog(`\nEPOCH ${e + 1}`);
  clog(`updates: ${updates}`);
  clog("prediction")
  ctab(yp)
  clog(`matches: ${matches}, misses: ${yp.cols - matches}`);
  ctab(w);
}
