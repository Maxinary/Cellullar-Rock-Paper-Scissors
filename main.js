// CONSTANTS

// UTIL FUNCTIONS

// int
function fight(a, b) {
   if (a == -1) return b;

   if (b == -1) return a;

  if (a == b) return a;

  if (a == (b+1)%3) return b;

  return a;
}

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
    red = red(colors[i]) * probabilities[i];
    green = green(colors[i]) * probabilities[i];
    blue = blue(colors[i]) * probabilities[i];
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


// CONSTANTS
let matrixSize = 128;
let scale = windowSize / matrixSize;
let padding = 16;
let matrix = newMatrix([2, matrixSize, matrixSize]);
let matrixIndex = 0;

let rounding = true;

function setup() {

}

function stepdrawing() {

  let otherIndex = matrixIndex ^ 1;
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

function draw() {
  for (var x=0; x<matrixSize; x++) {
    for (var y=0; y<matrixSize; y++) {
      fillGridPoint(getColor(matrix[matrixIndex][x][y]), x, y, scale);
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
  }

  draw();
}

start();
