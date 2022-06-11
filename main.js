let canvas = document.getElementById("draw");

canvas.width = document.body.clientHeight;
canvas.height = document.body.clientHeight;

let rps = null;
let recorder = null;
let saveName = null;
let matrixSize = 128;
let preset = "random_three";
// GUI Object
let gui = new guify({
  title: "Rock Paper Scissors",
  open: true
});

function start(saveName) {
//  recorder = new GIF({
//    workers: 2,
//    quality: Math.floor(canvas.height / matrixSize)
//  });

//  recorder.on('finished', function(blob) {
//    window.open(URL.createObjectURL(blob));
//  });
  saves['random_three'](matrixSize)
  rps.play();
}

function getSaveName() {
  let v = window.location.search;
  return v.slice(1);
}


// Set up the user interface for controlling relevant RPS parameters
function configureGUI() {
  gui.Register(
    [
      // Pause the simulation
      {
        type: 'button', label: 'Play / Pause',
        action: () => {
          // Invert the paused variable
          if (rps.paused) {
            rps.start();
          }
          else {
            rps.paused = true;
          }
        }
      },
      // Reset the simulation
      {
        type: 'button', label: 'Reset',
        action: () => {}
      },
      // Smooth between pixels
      {
        type: 'checkbox', label: 'Smoothing',
        onChange: (value) => {}
      },
      // Initialize randomly
      {
        type: 'checkbox', label: 'Random',
        onChange: (value) => {}
      },
      // Frames per second
      { 
        type: 'range', label: 'FPS',
        min: 1, max: 60, step: 1,
        onChange: (value) => {
          rps.max_FPS = value;
        }
      },
      // Attackers
      { 
        type: 'range', label: 'Weapons (?)',
        min: 3, max: 16, step: 1,
        onChange: (value) => {
          // Print
        }
      }
    ]
  );
}

function colorPickers() {
  // Remove any existing color pickers
  gui.Remove();

  // Add the new folder
  gui.Register({
    // Color Picker Folder
    type: 'folder', label: 'Colors', open: true
  });

  // Add the new individual pickers
  for (i = 0; i < rps.competitors.length; i++) {
    gui.Register({
      type: 'color',
      label: 'RGB Color',
      format: 'rgb',
      object: this,
      property: 'rps.competitors[i]'
    });
  }
}

// Start the UI
configureGUI();
// Start the game
start(preset);
// Load the color pickers
colorPickers();
