let canvas = document.getElementById("draw");

canvas.width = document.body.clientHeight;
canvas.height = document.body.clientHeight;

let rps = new RPS(canvas, {matrixSize: 96});

rps.start();
