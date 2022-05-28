let canvas = document.getElementById("draw");
let context = canvas.getContext("2d");

let windowSize = 512;

// could be made more efficient by caching
// but honestly the efficiency of this function is not important
function newMatrix(dims) {
  if (dims.length == 0) {
    return 0;
  }

  let o = new Array(dims[0]);

  for (let i=0; i<o.length; i++) {
    let m = newMatrix(dims.slice(1));
    o[i] = m;
  }

  return o;
}

function initGraphics() {
  canvas.width = windowSize;
  canvas.height = windowSize;
  clearScreen();
}

function clearScreen() {
  context.fillStyle = "#eee";
  context.fillRect(0,0,windowSize,windowSize);
}

function fillGridPoint(color, x, y, gridElementSize) {
  context.fillStyle = color;
  context.fillRect(x*gridElementSize, y*gridElementSize, gridElementSize, gridElementSize);
}

function hex(number) {
  number = Math.floor(number);

  return number.toString(16).padStart(2, '0');
}

function dehex(hex) {
  return parseInt(hex, 16);
}

function color(r, g, b) {
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

function red(c) {
  return dehex(c.slice(1,3));
}

function green(c) {
  return dehex(c.slice(3,5));
}

function blue(c) {
  return dehex(c.slice(5,7));
}
