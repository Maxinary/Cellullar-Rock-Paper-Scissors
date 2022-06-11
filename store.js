let saves = {
"triangleGrow":function(matrixSize) {
  if (matrixSize === undefined)
    matrixSize = 128;
  let triangleSize = 2;

  rps = new RPSCanvasWrapper(canvas, {
    matrixSize: matrixSize,
    smoothing:false,
    init_random:false,
    fps:24
  });


  rps.set(Math.floor(matrixSize / 2), Math.floor(matrixSize / 2 - triangleSize * Math.sqrt(3) / 4), 0);
  rps.set(Math.floor(matrixSize / 2 - triangleSize / 2), Math.floor(matrixSize / 2 + triangleSize * Math.sqrt(3) / 4), 1);
  rps.set(Math.floor(matrixSize / 2 + triangleSize / 2), Math.floor(matrixSize / 2 + triangleSize * Math.sqrt(3) / 4), 2);


  running = true;

},
"triangleFill": function(matrixSize) {
  if (matrixSize === undefined)
    matrixSize = 128;

    rps = new RPSCanvasWrapper(canvas, {
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

        rps.set(x, y, v);
      }
    }

    running = true;

  },
  "steadyState": function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;

    rps = new RPSCanvasWrapper(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:false,
      fps:40
    });

    let mid = matrixSize / 2 + 1/2;
    for (var x = 0 ; x < matrixSize; x++) {
      for (var y = 0 ; y < matrixSize; y++) {
        let v = 2;

        rps.set(x, y, v);
      }
    }

    rps.set(-1, 0, 0);
    rps.set(-2, 0, 0);
    rps.set(-1, 1, 0);

    running = true;
    rps.draw(false);
  },
  "invasion": function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;

    rps = new RPSCanvasWrapper(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:false,
      fps:40
    });

    let mid = matrixSize / 2 + 1/2;
    for (var x = 0 ; x < matrixSize; x++) {
      for (var y = 0 ; y < matrixSize; y++) {
        let v = 2;

        rps.set(x, y, v);
      }
    }

//  top right

    rps.set(-1, 0, 0);
    rps.set(-2, 0, 0);
    rps.set(-3, 0, 0);

    rps.set(-1, 0, 0)
    rps.set(-1, 1, 0);
    rps.set(-1, 2, 0);


//  bot lef
    rps.set(0, -1, 0);
    rps.set(0, -2, 0);
    rps.set(0, -3, 0);

    rps.set(0, -1, 0);
    rps.set(1, -1, 0);
    rps.set(2, -1, 0);


    //  top lef
    rps.set(0, 0, 0);
    rps.set(0, 1, 0);
    rps.set(0, 2, 0);

    rps.set(0, 0, 0);
    rps.set(1, 0, 0);
    rps.set(2, 0, 0);

    //  bot lef
    rps.set(-1, -1, 0);
    rps.set(-1, -2, 0);
    rps.set(-1, -3, 0);

    rps.set(-1, -1, 0);
    rps.set(-2, -1, 0);
    rps.set(-3, -1, 0);

    running = true;

  },
  "inversecircle": function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;
    let radius = 63;

    rps = new RPSCanvasWrapper(canvas, {
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

        rps.set(x, y, v);
      }
    }

    running = true;

  },
  "random_three":function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;

    rps = new RPSCanvasWrapper(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:true,
      fps:30,
      matrixCount:2,
      ifdead:false,
      /*competitors: [
        color(180,180,180),
        color(180,180,180),
        color(180,180,180)
      ]*/
    });
  },
  "random_four":function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;

    rps = new RPSCanvasWrapper(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:true,
      fps:24,
      matrixCount:2,
      ifdead:false,
      competitors: [
        color(255,255,50),
        color(50,255,255),
        color(255,50,255),
        color(50,50,50)
      ]
    });
  },
  "squarefill":function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;

    rps = new RPSCanvasWrapper(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:true,
      fps:24,
      matrixCount:2,
      ifdead:false,
      competitors: [
        color(255,30,50),
        color(180,150,50),
        color(50,230,50),
        color(50,180,180)
      ]
    });
  },
  "random_five":function(matrixSize) {
    if (matrixSize === undefined)
      matrixSize = 128;

    rps = new RPSCanvasWrapper(canvas, {
      matrixSize: matrixSize,
      smoothing:false,
      init_random:true,
      fps:24,
      matrixCount:2,
      ifdead:false,
      competitors: [
        color(230,50,50),
        color(180,180,50),
        color(50,230,50),
        color(50,180,180),
        color(50,50,230)
      ]
    });
  }
};
