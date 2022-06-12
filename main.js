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
  open: true,
  panelOverflowBehavior: 'overflow'
});

async function start(saveName) {
//  recorder = new GIF({
//    workers: 2,
//    quality: Math.floor(canvas.height / matrixSize)
//  });

//  recorder.on('finished', function(blob) {
//    window.open(URL.createObjectURL(blob));
//  });
  if (saves[saveName]["init_random"] == false &&
      saves[saveName]['initial_matrix'] == undefined)
  {
      saves[saveName]['initial_matrix'] = await readNibbleFile(saveName);
  }
  rps = new RPSCanvasWrapper(canvas, saves[saveName]);

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
      // Preset selector
      {
        type: 'select',
        label: 'Preset',
        options: Object.keys(saves),
        onChange: (value) => {
          console.log(value);
          // If we're not already paused, do that
          if (!rps.paused) { rps.paused = true; }
          start(value);
          colorPickers();
        }
      },
      // Pause the simulation
      {
        type: 'button', label: 'Play / Pause',
        action: () => {
          // Invert the paused variable
          if (rps.paused) {
            rps.play();
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
        onChange: (value) => {
          rps.SMOOTHING = value;
        }
      },
      // Initialize randomly
      {
        type: 'checkbox', label: 'Random',
        initial: true,
        onChange: (value) => {
          rps.INIT_RANDOM = value;
        }
      },
      // Frames per second
      {
        type: 'range', label: 'FPS',
        min: 1, max: 60, step: 1,
        initial: 24,
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

let removableFolder = null;
function colorPickers() {
  // If there's an existing set of color pickers
  if (removableFolder != null) {
    // Remove them
    gui.Remove(removableFolder);
  }

  // Add the new folder
  removableFolder = gui.Register({
    // Color Picker Folder
    type: 'folder', label: 'Colors', open: true
  });

  // Add the new individual pickers
  for (let i = 0; i < rps.competitors.length; i++) {
    gui.Register({
      type: 'color',
      label: 'Color ' + (i+1),
      format: 'hex',
      initial: rps.competitors[i],
      folder: 'Colors',
      onChange: (value) => {
        // Update the value of the competitor
        rps.competitors[i] = value;
      }
    });
  }
}

// Start the UI
configureGUI();
// Start the game
start(preset);
// Load the color pickers
colorPickers();
