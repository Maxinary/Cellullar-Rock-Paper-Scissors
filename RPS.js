const defaultFeatures = {
  'smoothing': false,
  'init_random': true,
  'matrixSize': 32,
  'matrixCount': 2,
  'fps': 24,
  'initial_matrix': null,
  'competitors': [
    color(247,  64, 117),
    color( 21, 197, 100),
    color( 70,  95, 217)
  ],
  'ifdead': false,
  'minDefeaters': 2,
  'jumps': [1]
};

function combineFeatures(f1, f2) {
  // Obtain the combined list of unique keys in both feature sets
  let union = Array.from(new Set([...Object.keys(f1), ...Object.keys(f2)]));
  // Create a new Object to keep the new values
  let newFeatures = {};
  // For each key available
  union.forEach((key, _) => {
    newFeatures[key] = key in f1 ? f1[key] : f2[key];
  });
  return newFeatures;
}

// This handles the logic and drawing for RPS
class RPS {
  constructor(canvas, features) {
    if (features === undefined)
      features = {};

    // Save the features
    this.features = combineFeatures(features, defaultFeatures);

    // DERIVED VARIABLES
    this.matrixIndex = 0;
    let windowSize = canvas.height;

    this.scale = windowSize / this.features.matrixSize;

    this.competitorCount = this.features.competitors.length;

    this.matrix = newMatrix([this.features.matrixCount, this.features.matrixSize, this.features.matrixSize]);

    // persistent loop variables
    this.prevLoopTime = Date.now();

    this.matrixProbMap = new Array(this.features.matrixCount).fill(1 / this.features.matrixCount);
    this.matrixValueMap = new Array(this.features.matrixCount);

    this.context = canvas.getContext("2d");

    // Start all values as empty
    this.emptyMatrix();

    // If we were given an initial matrix
    if (this.features.initial_matrix !== null)
      this.matrix[0] = structuredClone(this.features.initial_matrix);

    // If we want a random initialization
    if (this.features.init_random) {
      this.randomizeMatrix();
    }
  }

  // Set a given pixel to a given value
  set(x,y,v) {
    this.matrix[this.matrixIndex][x][y] = v;
  }

  // Get the color of a competitor type (ie. rock, paper, scissors...)
  getColor(p) {
    if (p > -1 && p < this.features.competitors.length)
      return this.features.competitors[p];
    return color(180, 180, 180);
  }

  // Move the simulation forward a single clock tick
  stepSimulation() {
    let otherIndex = (this.matrixIndex + 1)%this.features.matrixCount;
    let counts = new Array(this.competitorCount);
    for (let x=0; x<this.features.matrixSize; x++) {
      for (let y=0; y<this.features.matrixSize; y++) {
        for (let i=0; i<counts.length; i++)
          counts[i] = 0;

        for (let xd = -1; xd < 2; xd++) {
          for (let yd = -1; yd < 2; yd++) {
            if (xd != 0 || yd != 0) {
              let xf = x+xd;
              let yf = y+yd;


              if (xf > -1 && yf > -1 && xf < this.features.matrixSize && yf < this.features.matrixSize) {
                let v = this.matrix[this.matrixIndex][xf][yf];
                if (v < this.competitorCount)
                  counts[v]++;
              }
            }
          }
        }

        let defeaterSet = (this.matrix[this.matrixIndex][x][y] + 1)%(this.competitorCount);
        if (this.matrix[this.matrixIndex][x][y] >= this.competitorCount) {
          let maxind = argmax(counts);
          if (counts[maxind] > 0)
            this.matrix[otherIndex][x][y] = maxind;
          else
            this.matrix[otherIndex][x][y] = -1;
        } else {
          for (let d=0; d<this.features.jumps.length; d++) {
            let defeaterIndex = (this.matrix[this.matrixIndex][x][y] + this.features.jumps[d])%(this.competitorCount);
            if(counts[defeaterIndex] > this.features.minDefeaters) {
              this.matrix[otherIndex][x][y] = defeaterIndex;
              break;
            } else {
              this.matrix[otherIndex][x][y] = this.matrix[this.matrixIndex][x][y];
            }
          }
        }
      }
    }
    this.matrixIndex = otherIndex;
  }

  emptyMatrix() {
    for (var m=0; m<this.features.matrixCount; m++) {
      for (var x=0; x<this.features.matrixSize; x++) {
        for (var y=0; y<this.features.matrixSize; y++) {
          this.matrix[m][x][y] = -1;
        }
      }
    }
  }

  randomizeMatrix() {
    for (var x=0; x<this.features.matrixSize; x++) {
      for (var y=0; y<this.features.matrixSize; y++) {
        let v = Math.floor( this.competitorCount * Math.random() );
        this.matrix[0][x][y] = v;
      }
    }
  }

  draw() {
    for (var x=0; x<this.features.matrixSize; x++) {
      for (var y=0; y<this.features.matrixSize; y++) {
        let localColor = "";
        if (this.features.smoothing) {
          for (let m=0; m<this.features.matrixCount; m++)
            this.matrixValueMap[m] = this.getColor(this.matrix[m][x][y]);
          localColor = mixColors(this.matrixValueMap, this.matrixProbMap);
        } else {
          localColor = this.getColor(this.matrix[this.matrixIndex][x][y]);
        }

        if (this.features.ifdead) {
          localColor = this.getColor(this.matrix[this.matrixIndex][x][y]);
          for (var m=0; m<this.features.matrixCount-1; m++) {
            if (this.matrix[this.matrixIndex][x][y] !=
                this.matrix[(this.matrixIndex+m+1)%this.features.matrixCount][x][y])
                localColor = color(0,0,0);
            }
        }
        fillGridPoint(this.context, localColor, x, y, this.scale);
      }
    }
  }

  // START
  play() {
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

    // get time dif from last call
    let curTime = Date.now();
    let dt = curTime - this.prevLoopTime;

    // if time dif is smaller than max fps, don't update logic
    if (dt > 1000/this.features.fps) {
      this.stepSimulation();
      this.prevLoopTime = curTime;
    }
    this.draw();
  }
}

// This scales the RPS canvas
// (and will eventually be used as a handler for recording the canvas)
class RPSCanvasWrapper extends RPS {
  constructor(canvas, features) {
    let matrixSize = features.matrixSize;
    let intermediateCanvas = new OffscreenCanvas(matrixSize, matrixSize);
    super(intermediateCanvas, features);
    this.intermediateCanvas = intermediateCanvas;
    this.matrixSize = matrixSize;
    this.targetCanvas = canvas;
    this.targetContext = canvas.getContext('2d');
    this.targetContext.imageSmoothingEnabled = false;
  }

  loop() {
    this.targetContext.drawImage(this.intermediateCanvas,
                                 0, 0,
                                 this.targetCanvas.width,
                                 this.targetCanvas.height);
    super.loop();
  }
}
