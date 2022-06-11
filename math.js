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

/* This converts to a hex string
 *
 */
function arrToNibbleString(arr) {
  let nibbleString = "";
  for (let i=0; i<arr.length; i++) {
    for (let j=0; j<arr[i].length;) {
      let m=0;
      for (;m<16*16; m++) {
        if (arr[i][j+m] != arr[i][j])
          break;
      }

      if (m < 4) {
        nibbleString.push(hex(arr[i], 1));
      } else {

      }
    }
  }
}

function arrFromNibbleString() {

}
