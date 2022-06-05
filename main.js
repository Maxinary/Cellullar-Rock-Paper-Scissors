let canvas = document.getElementById("draw");

canvas.width = document.body.clientHeight;
canvas.height = document.body.clientHeight;

let rps = null;

let saves = {
"triangleGrow":function(matrixSize) {
  if (matrixSize === undefined)
    matrixSize = 128;
  let triangleSize = 2;

  rps = new RPS(canvas, {
    matrixSize: matrixSize,
    smoothing:false,
    init_random:false,
    fps:24
  });


  rps.matrix[0][Math.floor(matrixSize / 2)][Math.floor(matrixSize / 2 - triangleSize * Math.sqrt(3) / 4)] = 0;
  rps.matrix[0][Math.floor(matrixSize / 2 - triangleSize / 2)][Math.floor(matrixSize / 2 + triangleSize * Math.sqrt(3) / 4)] = 1;
  rps.matrix[0][Math.floor(matrixSize / 2 + triangleSize / 2)][Math.floor(matrixSize / 2 + triangleSize * Math.sqrt(3) / 4)] = 2;


  running = true;
  rps.start();
},
"triangleFill": function(matrixSize) {
  if (matrixSize === undefined)
    matrixSize = 128;

    rps = new RPS(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:false,
      fps:40
    });

    let mid = matrixSize / 2 + 1/2;
    for (var x = 0 ; x < matrixSize; x++) {
      for (var y = 0 ; y < matrixSize; y++) {
        let v = -1;
        let angy = Math.atan2(x - mid, y - mid);
        if (angy < -Math.PI/3)
          v = 0
        else if(angy < Math.PI/3)
          v = 1
        else
          v = 2

        rps.matrix[0][x][y] = v;
      }
    }

    running = true;
    rps.start();
  },
  "steadyState": function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;

    rps = new RPS(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:false,
      fps:40
    });

    let mid = matrixSize / 2 + 1/2;
    for (var x = 0 ; x < matrixSize; x++) {
      for (var y = 0 ; y < matrixSize; y++) {
        let v = 2;

        rps.matrix[0][x][y] = v;
      }
    }

    rps.matrix[0][matrixSize-1][0] = 0;
    rps.matrix[0][matrixSize-2][0] = 0;
    rps.matrix[0][matrixSize-1][1] = 0;


    running = true;
    rps.draw(false);
  },
  "invasion": function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;

    rps = new RPS(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:false,
      fps:40
    });

    let mid = matrixSize / 2 + 1/2;
    for (var x = 0 ; x < matrixSize; x++) {
      for (var y = 0 ; y < matrixSize; y++) {
        let v = 2;

        rps.matrix[0][x][y] = v;
      }
    }

//  top right

    rps.matrix[0][matrixSize-1][0] = 0;
    rps.matrix[0][matrixSize-2][0] = 0;
    rps.matrix[0][matrixSize-3][0] = 0;

    rps.matrix[0][matrixSize-1][0] = 0;
    rps.matrix[0][matrixSize-1][1] = 0;
    rps.matrix[0][matrixSize-1][2] = 0;


//  bot lef
    rps.matrix[0][0][matrixSize-1] = 0;
    rps.matrix[0][0][matrixSize-2] = 0;
    rps.matrix[0][0][matrixSize-3] = 0;

    rps.matrix[0][0][matrixSize-1] = 0;
    rps.matrix[0][1][matrixSize-1] = 0;
    rps.matrix[0][2][matrixSize-1] = 0;


    //  top lef
    rps.matrix[0][0][0] = 0;
    rps.matrix[0][0][1] = 0;
    rps.matrix[0][0][2] = 0;

    rps.matrix[0][0][0] = 0;
    rps.matrix[0][1][0] = 0;
    rps.matrix[0][2][0] = 0;


    //  bot lef
    rps.matrix[0][matrixSize-1][matrixSize-1] = 0;
    rps.matrix[0][matrixSize-1][matrixSize-2] = 0;
    rps.matrix[0][matrixSize-1][matrixSize-3] = 0;

    rps.matrix[0][matrixSize-1][matrixSize-1] = 0;
    rps.matrix[0][matrixSize-2][matrixSize-1] = 0;
    rps.matrix[0][matrixSize-3][matrixSize-1] = 0;


    running = true;
    rps.start();
  },
  "inversecircle": function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;
    let radius = 63;

    rps = new RPS(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:false,
      fps:24
    });

    let mid = matrixSize / 2;

    for (var x = 0 ; x < matrixSize; x++) {
      for (var y = 0 ; y < matrixSize; y++) {
        let v = 2;

        if ((x-mid)*(x-mid)+(y-mid)*(y-mid) < radius*radius)
          v = 1;

        rps.matrix[0][x][y] = v;
      }
    }

    running = true;
    rps.start();
  },
  "randy":function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;

    rps = new RPS(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:true,
      fps:24,
      matrixCount:9,
      ifdead:false,
      /*competitors: [
        color(180,180,180),
        color(180,180,180),
        color(180,180,180)
      ]*/
    });

    rps.start();
  }
};

let recorder = null;
let saveName = null;
let matrixSize = 64;

document.onclick = function() {
  if (!rps.paused)
    rps.pause();
  else
    rps.step();

  recorder.render();
}

document.onkeypress = function() {
  if (rps.paused)
    rps.start()
}

function start() {
  recorder = new GIF({
    workers: 2,
    quality: Math.floor(canvas.height / matrixSize)
  });

  recorder.on('finished', function(blob) {
    window.open(URL.createObjectURL(blob));
  });
  saves[saveName](matrixSize)
}


canvas.width = canvas.height = matrixSize;
saveName = "randy";
start(saveName)
