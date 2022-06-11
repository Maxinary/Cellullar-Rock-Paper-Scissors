// default

/*
smoothing = true;
matrixSize = 128;
matrixCount = 2;
competitors = [
      color(247,  64, 117),
      color( 21, 197, 100),
      color( 70,  95, 217)
    ];
*/

class RPSCanvasWrapper {
  constructor(canvas, features) {
    this.matrixSize = features.matrixSize = 'matrixSize' in features ? features.matrixSize : 32;
    features.autoloop = false;

    this.targetCanvas = canvas;
    this.targetContext = canvas.getContext('2d');
    this.targetContext.imageSmoothingEnabled = false;

    this.intermediateCanvas = new OffscreenCanvas(this.matrixSize, this.matrixSize);
    this.rps = new RPS(this.intermediateCanvas, features)

    this.gifrecorder = null;
  }

  startGifRecording() {

  }

  stopGifRecording() {

  }

  saveGifRecording() {

  }

  set(x, y, v) {
    this.rps.set(x, y, v);
  }

  start() {
    this.paused = false;
    this.loop();
  }

  pause() {
    this.paused = true;
  }

  step() {
    this.paused = true;

    this.loop();
  }

  loop() {
    if (!this.paused) requestAnimationFrame(() => this.loop());

    this.rps.step();

    this.targetContext.drawImage(this.intermediateCanvas,
                                 0, 0,
                                 this.targetCanvas.width,
                                 this.targetCanvas.height)
  }
}

class RPS {
  constructor(canvas, features) {
    if (features === undefined)
      features = {};
    // INPUT FLAGS
    this.SMOOTHING = 'smoothing' in features ? features.smoothing : false;
    this.INIT_RANDOM = 'init_random' in features ? features.init_random : true;

    // INPUT CONSTANTS
    this.matrixSize = 'matrixSize' in features ? features.matrixSize : 32;
    this.matrixCount = 'matrixCount' in features ? features.matrixCount : 2;

    this.max_FPS = 'fps' in features ? features.fps : 24;

    let initial_matrix = 'initial_matrix' in features ? features.initial_matrix : null;

    this.competitors = 'competitors' in features ? features.competitors :
        [
          color(247,  64, 117),
          color( 21, 197, 100),
          color( 70,  95, 217)
        ];

    this.ifdead = 'ifdead' in features ? features.ifdead : false;

    this.autoloop = 'autoloop' in features ? features.autoloop : true;

    this.minDefeaters = 'minDefeaters' in features ? features.minDefeaters : 2;

    // DERIVED VARIABLES
    this.matrixIndex = 0;
    let windowSize = canvas.height;

    this.scale = windowSize / this.matrixSize;

    this.competitorCount = this.competitors.length;

    //if (this.SMOOTHING == false)
    //  this.matrixCount = 2;

    this.matrix = newMatrix([this.matrixCount, this.matrixSize, this.matrixSize]);


    // persistent loop variables
    this.prevLoopTime = Date.now();

    this.matrixProbMap = new Array(this.matrixCount).fill(1 / this.matrixCount);
    this.matrixValueMap = new Array(this.matrixCount);

    this.context = canvas.getContext("2d");

    // initialize
    for (var m=0; m<this.matrixCount; m++) {
      for (var x=0; x<this.matrixSize; x++) {
        for (var y=0; y<this.matrixSize; y++) {
          this.matrix[m][x][y] = -1;
        }
      }
    }

    if (initial_matrix !== null)
      this.matrix[0] = initial_matrix;

    if (this.INIT_RANDOM) {
      for (var x=0; x<this.matrixSize; x++) {
        for (var y=0; y<this.matrixSize; y++) {
          let v = Math.floor( this.competitorCount * Math.random() );
          this.matrix[0][x][y] = v;
        }
      }
    }
  }

  set(x,y,v) {
    this.matrix[this.matrixIndex][x][y] = v;
  }

  getColor(p) {
    if (p > -1 && p < this.competitors.length)
      return this.competitors[p];
    return color(180, 180, 180);
  }

  stepdrawing() {
    let otherIndex = (this.matrixIndex + 1)%this.matrixCount;
    let counts = new Array(this.competitorCount);
    for (let x=0; x<this.matrixSize; x++) {
      for (let y=0; y<this.matrixSize; y++) {
        for (let i=0; i<counts.length; i++)
          counts[i] = 0;

        for (let xd = -1; xd < 2; xd++) {
          for (let yd = -1; yd < 2; yd++) {
            if (xd != 0 || yd != 0) {
              let xf = x+xd;
              let yf = y+yd;


              if (xf > -1 && yf > -1 && xf < this.matrixSize && yf < this.matrixSize) {
                let v = this.matrix[this.matrixIndex][xf][yf];
                if (v != -1)
                  counts[v]++;
              }
            }
          }
        }

        let defeaterIndex = (this.matrix[this.matrixIndex][x][y] + 1)%(this.competitorCount);
        if (this.matrix[this.matrixIndex][x][y] == -1) {
          let maxind = argmax(counts);
          if (counts[maxind] > 0)
            this.matrix[otherIndex][x][y] = maxind;
          else
            this.matrix[otherIndex][x][y] = -1;
        } else if(counts[defeaterIndex] > this.minDefeaters) {
          this.matrix[otherIndex][x][y] = defeaterIndex;
        } else {
          this.matrix[otherIndex][x][y] = this.matrix[this.matrixIndex][x][y];
        }
      }
    }
    this.matrixIndex = otherIndex;
  }

  draw(intermediate) {
    for (var x=0; x<this.matrixSize; x++) {
      for (var y=0; y<this.matrixSize; y++) {
        let localColor = "";
        if (intermediate) {
          for (let m=0; m<this.matrixCount; m++)
            this.matrixValueMap[m] = this.getColor(this.matrix[m][x][y]);
          localColor = mixColors(this.matrixValueMap, this.matrixProbMap);
        } else {
          localColor = this.getColor(this.matrix[this.matrixIndex][x][y]);
        }

        if (this.ifdead) {
          localColor = this.getColor(this.matrix[this.matrixIndex][x][y]);
          for (var m=0; m<this.matrixCount-1; m++) {
            if (this.matrix[this.matrixIndex][x][y] !=
                this.matrix[(this.matrixIndex+m+1)%this.matrixCount][x][y])
                localColor = color(0,0,0);
            }
        }

        fillGridPoint(this.context, localColor, x, y, this.scale);
      }
    }
  }

  // START
  start() {
    this.paused = false;

    this.loop();
  }

  step() {
    this.paused = true;

    this.loop();
  }


  pause() {
    this.paused = true;
  }


  // LOOP
  loop() {
    if (!this.paused) requestAnimationFrame(()=>this.loop());

    let curTime = Date.now();
    let dt = curTime - this.prevLoopTime;

    if (dt > 1000/this.max_FPS) {
//      console.log(1000/dt)
      this.stepdrawing();
//      recorder.addFrame(canvas, {copy: true, delay:1000/this.max_FPS});
      this.prevLoopTime = curTime;

//      recorder.addFrame(canvas, {copy: true, delay:1000/this.max_FPS});
    }
    this.draw();
  }
}