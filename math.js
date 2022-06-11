// Find the maximal value of an array
function argmax(arr) {
  let maxind = 0;
  let maxval = arr[0];
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > maxval) {
      maxind = i;
      maxval = arr[i];
    }
  }
  return maxind;
}
