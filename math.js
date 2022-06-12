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

function hex(number, padding) {
  if (padding === undefined) padding = 2;
  number = Math.floor(number);

  return number.toString(16).padStart(padding, '0');
}

function dehex(hex) {
  return parseInt(hex, 16);
}

/* This converts to a hex string
 *
 */
function arrToNibbleString(arr) {
  let nibbleString = `${hex(arr.length)}x${hex(arr[0].length)}\n`;
  for (let i=0; i<arr.length; i++) {
    for (let j=0; j<arr[i].length;) {
      let m=1;
      for (;m<16*16; m++) {
        if (arr[i][j+m] != arr[i][j])
          break;
      }

      if (m < 4) {
        for (var k = 0; k < m; k++)
          nibbleString += hex(arr[i][j+k], 1);
      } else {
        nibbleString += hex(arr[i][j],1)+"x"+hex(m, 2);
      }

      j += m;
    }
    nibbleString += "\n";
  }
  return nibbleString;
}

function nibbleStringToArr(nibbleString) {
  let dims = [0,0];

  let a = 0;
  let z = 0;
  while (nibbleString[z] != 'x')
    z++;

  dims[0] = dehex(nibbleString.slice(a, z));

  z++;
  a = z;
  while (nibbleString[z] != '\n')
    z++;
  dims[1] = dehex(nibbleString.slice(a, z));

  z++;

  let arr = newMatrix(dims);
  let row = 0;
  let col = 0;

  for (; z < nibbleString.length;) {
    // read hex val
    let v = nibbleString[z];
    z++;

    if (v == '\n') {
      col = 0;
      row++;
    } else {
      let number = dehex(v);
      // if next is an X
      if (nibbleString[z] == 'x') {
        z++;
        // get next two and convert
        let count = dehex(nibbleString.slice(z,z+2));
        z += 2;

        // add to list
        for (let k = 0; k < count; k++) {
          arr[row][col] = number;
          col++;
        }
      } else {
        arr[row][col] = number;
        col++;
      }
    }
  }

  return arr;
}
