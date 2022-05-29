// INPUT FLAGS
let SMOOTHING = true;

// INPUT CONSTANTS
let matrixSize = 128;
let matrixCount = 5;

// DERIVED VARIABLES
let matrixIndex = 0;
let scale = windowSize / matrixSize;

if (SMOOTHING == false)
  matrixCount = 2;

let matrix = newMatrix([matrixCount, matrixSize, matrixSize]);


// integer list
let competitors = [
  color(247,  64, 117),
  color( 21, 197, 100),
  color( 70,  95, 217)
];

function getColor(p) {
  if (p > -1 && p < competitors.length)
    return competitors[p];
  return color(180, 180, 180);
}

//
function mixColors(colors, probabilities) {
  let red = 0;
  let green = 0;
  let blue = 0;

  for (var i=0; i<colors.length; i++) {
    red += get_red(colors[i]) * probabilities[i];
    green += get_green(colors[i]) * probabilities[i];
    blue += get_blue(colors[i]) * probabilities[i];
  }

  return color(red, green, blue);
}

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


function stepdrawing() {

  let otherIndex = (matrixIndex + 1)%matrixCount;
  let counts = [0,0,0];
  for (let x=0; x<matrixSize; x++) {
    for (let y=0; y<matrixSize; y++) {
      counts[0] = 0;
      counts[1] = 0;
      counts[2] = 0;
      for (let xd = -1; xd < 2; xd++) {
        for (let yd = -1; yd < 2; yd++) {
          if (xd != 0 || yd != 0) {
            let xf = x+xd;
            let yf = y+yd;


            if (xf > -1 && yf > -1 && xf < matrixSize && yf < matrixSize) {
              let v = matrix[matrixIndex][xf][yf];
              if (v != -1)
                counts[v]++;
            }
          }
        }
      }

      let defeaterIndex = (matrix[matrixIndex][x][y] + 1)%3;
      if (matrix[matrixIndex][x][y] == -1) {
        let maxind = argmax(counts);
        if (counts[maxind] > 0)
          matrix[otherIndex][x][y] = maxind;
        else
          matrix[otherIndex][x][y] = -1;
      } else if(counts[defeaterIndex] > 2) {
        matrix[otherIndex][x][y] = defeaterIndex;
      } else {
        matrix[otherIndex][x][y] = matrix[matrixIndex][x][y];
      }
    }
  }
  matrixIndex = otherIndex;
}

let prevLoopTime = 0;

let matrixProbMap = new Array(matrixCount).fill(1/matrixCount);
let matrixValueMap = new Array(matrixCount);
function draw(intermediate) {
  for (var x=0; x<matrixSize; x++) {
    for (var y=0; y<matrixSize; y++) {
      let localColor = "";
      if (intermediate) {
        for (let m=0; m<matrixCount; m++)
          matrixValueMap[m] = getColor(matrix[m][x][y]);
        localColor = mixColors(matrixValueMap, matrixProbMap);
      } else {
        localColor = getColor(matrix[matrixIndex][x][y]);
      }

      fillGridPoint(localColor, x, y, scale);
    }
  }
}

// START
function start() {
  initGraphics();

  for (var x=0; x<matrixSize; x++) {
    for (var y=0; y<matrixSize; y++) {
      let v = Math.floor( 3 * Math.random() );
      matrix[0][x][y] = v;
    }
  }

  for (var m=1; m<matrixCount; m++) {
    for (var x=0; x<matrixSize; x++) {
      for (var y=0; y<matrixSize; y++) {
        matrix[m][x][y] = color(0,0,0);
      }
    }
  }

  prevLoopTime = Date.now();

  loop();
}

// LOOP
function loop() {
  requestAnimationFrame(loop);

  let curTime = Date.now();
  let dt = curTime - prevLoopTime;
  prevLoopTime = curTime;

  if (dt > 1000/40) {
    stepdrawing();
    draw(SMOOTHING && true);
  } else {
    draw(true);
  }

}

start();
