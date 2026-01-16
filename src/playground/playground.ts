import { RationalNumber } from "../arithmetic/RationalNumber";
import { Matrix } from "../linear-algebra/Matrix";
import { Vector } from "../linear-algebra/Vector";
import { printRowOperations, divSet } from "./helpers";
import { rgb2hsv, hsv2rgb } from "../utilities/color";
import { RealNumber } from "../arithmetic/RealNumber";
import { VectorError, MatrixError } from "../utilities/error";
import { lcm_Q } from "../utilities/math";
import { Quaternion } from "../linear-algebra/Quaternion";

const ctab = (s: any) => {
  if (s instanceof Matrix || s instanceof Vector) {
    console.table(s.entries);
  } else if (s instanceof RationalNumber) {
    console.log(`${s.numerator}/${s.denominator}`);
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
