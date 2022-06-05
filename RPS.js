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

    // DERIVED VARIABLES
    this.matrixIndex = 0;
    let windowSize = canvas.clientHeight;

    this.scale = windowSize / this.matrixSize;

    //if (this.SMOOTHING == false)
    //  this.matrixCount = 2;

    this.matrix = newMatrix([this.matrixCount, this.matrixSize, this.matrixSize]);


    // persistent loop variables
    this.prevLoopTime = 0;

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
          let v = Math.floor( 3 * Math.random() );
          this.matrix[0][x][y] = v;
        }
      }
    }
  }


  getColor(p) {
    if (p > -1 && p < this.competitors.length)
      return this.competitors[p];
    return color(180, 180, 180);
  }

  stepdrawing() {
    let otherIndex = (this.matrixIndex + 1)%this.matrixCount;
    let counts = [0,0,0];
    for (let x=0; x<this.matrixSize; x++) {
      for (let y=0; y<this.matrixSize; y++) {
        counts[0] = 0;
        counts[1] = 0;
        counts[2] = 0;
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

        let defeaterIndex = (this.matrix[this.matrixIndex][x][y] + 1)%3;
        if (this.matrix[this.matrixIndex][x][y] == -1) {
          let maxind = argmax(counts);
          if (counts[maxind] > 0)
            this.matrix[otherIndex][x][y] = maxind;
          else
            this.matrix[otherIndex][x][y] = -1;
        } else if(counts[defeaterIndex] > 2) {
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
    this.prevLoopTime = Date.now();
    this.paused = false;

    this.loop();
  }

  step() {
//    this.prevLoopTime = Date.now();
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
      this.stepdrawing();
      this.draw(this.SMOOTHING && true);
      this.prevLoopTime = curTime;

      recorder.addFrame(canvas, {copy: true, delay:1000/this.max_FPS});
    }
  }
}
