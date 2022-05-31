let canvas = document.getElementById("draw");

canvas.width = document.body.clientHeight;
canvas.height = document.body.clientHeight;

let rps = new RPS(canvas, {matrixSize: 24, smoothing:false, init_random:false, fps:3});

rps.matrix[0][24 / 2][24 / 2 - 6] = 0;
rps.matrix[0][12-5][24 / 2 + 4] = 1;
rps.matrix[0][12+5][24 / 2 + 4] = 2;

rps.start();
