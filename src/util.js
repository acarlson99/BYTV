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

module.exports = { binarySearchArr, logErr };
