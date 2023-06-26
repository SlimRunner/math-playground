import { RationalNumber } from "./arithmetic/RationalNumber";
import { Matrix } from "./linear-algebra/Matrix";
import { Vector } from "./linear-algebra/Vector";
import { printRowOperations } from "./utilities";

/*
You might want to create unit tests to aid the refactor
https://www.testim.io/blog/typescript-unit-testing-101/

Otherwise, this is going to be a hell.
 */

const ctab = (s:any) => {
  if (s instanceof Matrix || s instanceof Vector) {
    console.table(s.entries);
  } else {
    console.table(s);
  }
};
const clog = console.log;

const chm = {
  0:  [[0,0,-2,0,7,12],[2,4,-10,6,12,28],[2,4,-5,6,-5,-1]],
  1:  [[2,-1,8],[-3,2,-11],[-2,1,-3]],
  2:  [[4,-7,0,-4,-1,-5],[1,2,1,6,3,1]],
  3:  [[1,1,0,0,1000],[0,1,1,0,1000],[0,0,1,1,700],[1,0,0,1,700]],
  4:  [[2,1,-1,8],[-3,-1,2,-11],[-2,1,2,-3]],
  5:  [[1,-1,0,-1,0,0,0],[-1,1,0,0,0,1,0],[0,0,1,0,1,-1,0],[0,0,-3,0,2,0,1],[0,-1,1,0,0,0,0],[2,2,0,0,0,0,1]],
  6:  [[1,1,2,8],[-1,-2,3,1],[3,-7,4,10]],
  7:  [[1,-1,2,-1,-1],[2,1,-2,-2,-2],[-1,2,-4,1,1],[3,0,0,-3,-3]],
  8:  [[2,1,3,1],[1,0,1,1],[0,2,1,0],[0,1,2,3]],
  9:  [[1,3,1,5,3],[-2,-7,0,-4,2],[0,0,1,0,1],[0,0,2,1,1],[0,0,0,1,1]],
  10: [[1,2,3,1,0,0],[2,5,3,0,1,0],[1,0,8,0,0,1]],
  11: [[1,1,1,1,3],[1,2,4,8,-2],[1,3,9,27,-5],[1,4,16,64,0]],
  12: [[3,4,-6,9,-3,-3,-4,2],[4,1,7,-3,1,2,4,1],[3,1,7,2,-3,1,-6,7],[7,-4,-2,7,3,-2,8,5],
      [7,4,-4,3,-4,3,-1,-3],[-4,2,-1,1,-4,8,2,5],[-7,-4,6,-3,9,-2,-4,-6],[3,8,9,9,-9,3,-8,9]],
  13: [[3,0,0],[-4,1,0],[1.3,0,1]],
  14: [[1,0,2],[-3,4,6],[-1,-2,3]],
  100:[[1,0,-3,-2],[3,1,-2,5],[2,2,1,4]],
  104:[[2,1,3,1,0,0],[1,5,4,0,1,0],[1,1,1,0,0,1]],
  105:[[2,3,1,1,0,0],[3,3,1,0,1,0],[2,4,1,0,0,1]],
  106:[[1,0,0,-1,100],[1,-1,0,0,-100],[0,1,-1,0,-100],[0,0,1,-1,300]]
}


const x = [
  new Vector([1,2,-1]),
  new Vector([2,-2,3]),
  new Vector([-1,-2,4]),
]
const b = new Vector([-7,-8,8]);
const A = Matrix.fromColVectors(x);
const [A1, A2, A3] = [0,1,2].map(n => Matrix.fromColVectors(x.map((v, i) => i === n ? b : v)));

ctab([A, A1, A2, A3].map(m => m.determinant()));

const M = new Matrix(chm[12]);
const E = M.transpose().rref().fixZeroes();

printRowOperations(E.erops);
ctab(M)
ctab(E);

const n1 = new RationalNumber(-1, 21);
const n2 = new RationalNumber(3, -7);
ctab(n1);
ctab(n2);
ctab(n1.add(n2).fixSigns());
ctab(n1.subtract(n2).fixSigns());
