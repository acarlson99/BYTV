// f => 0 == good
//     -1 == too low
//      1 == too high
// e.g. binarySearchArr([0,1,2,3,4,5], (x) => 3-x)
//   => 3
const binarySearchArr = (arr, f) => {
  let start = 0;
  let end = arr.length - 1;
  let mid;

  while (start <= end) {
    mid = Math.floor((start + end) / 2);
    const res = f(arr[mid]);
    if (res === 0) return mid;
    else if (res > 0) start = mid + 1;
    else end = mid - 1;
  }
  return mid;
};

const logErr = (...args) => {
  console.log("BYTV log:", ...args);
};

// call f(o) for every `o` matching path
//
// switch (typeof path)
//   case "function":
//     all children for whom `f` is true
//   case "object":
//     all values in obj
//   case "boolean":
//     everything if true, nothing if false
//   default:
//     string/int/other; just use as single non-branching index
const traverseObj = (f, obj, ...path) => {
  for (let i in path) {
    if (!Number.isFinite(Number(i))) continue;
    i = Number(i); // fkme.js

    const p = path[i];
    switch (typeof p) {
      case "function":
        // recurse for all objs for which function `p` is true
        for (const j of obj) {
          try {
            if (p(j)) {
              traverseObj(f, j, ...path.slice(i + 1));
            }
          } catch (err) {}
        }
        return;
      case "object":
        // recurse for obj[j] for every value `j` in `p`
        for (const j of p) {
          if (obj[j]) {
            try {
              traverseObj(f, obj[j], ...path.slice(i + 1));
            } catch (err) {}
          }
        }
        return;
      case "boolean":
        if (p) {
          for (const j of obj) {
            try {
              traverseObj(f, j, ...path.slice(i + 1));
            } catch (err) {}
          }
        }
        return;
      default:
        obj = obj[p];
    }
  }
  if (obj) {
    f(obj);
  }
};

module.exports = { binarySearchArr, logErr, traverseObj };
