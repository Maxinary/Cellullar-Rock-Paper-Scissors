let canvas = document.getElementById("draw");

canvas.width = document.body.clientHeight;
canvas.height = document.body.clientHeight;

let rps = null;

let recorder = null;
let saveName = null;
let matrixSize = 128;

document.onclick = function() {
  if (!rps.paused)
    rps.pause();
  else
    rps.step();

  //recorder.render();
}

document.onkeypress = function() {
  if (rps.paused)
    rps.start()
}

function start(saveName) {
//  recorder = new GIF({
//    workers: 2,
//    quality: Math.floor(canvas.height / matrixSize)
//  });

//  recorder.on('finished', function(blob) {
//    window.open(URL.createObjectURL(blob));
//  });
  saves[saveName](matrixSize)
  rps.start();
}

function getSaveName() {
  let v = window.location.search;
  return v.slice(1);
}

//canvas.width = canvas.height = matrixSize;
start(getSaveName())
