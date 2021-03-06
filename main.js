let canvas = document.getElementById("draw");

canvas.width = document.body.clientHeight;
canvas.height = document.body.clientHeight;

let rps = null;
let recorder = null;
let saveName = null;
let matrixSize = 128;
let preset = Object.keys(saves)[0];
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

let guiFeatures = structuredClone(defaultFeatures);
guiFeatures.locked = true;

// Set up the user interface for controlling relevant RPS parameters
function configureGUI() {
  gui.Register(
    [
      {
        type: 'title',
        label: 'Simulation'
      },
      // Preset selector
      {
        type: 'select',
        label: 'Preset',
        options: Object.keys(saves),
        onChange: (value) => {
          // Update preset
          preset = value;
          // Pause; start; reinit color pickers
          rps.pause();
          start(value);
          colorPickers();
          // Load the existing non-competitor properties if not locked
          if (guiFeatures.locked) {
            // Overwrite
            rps.features.smoothing = guiFeatures.smoothing;
            rps.features.fps = guiFeatures.fps;
            rps.features.ifdead = guiFeatures.ifdead;
          }
        }
      },
      // Pause the simulation
      {
        type: 'button', label: 'Play / Pause',
        action: () => {
          // Invert the paused variable
          if (rps.paused) { rps.play(); }
          else { rps.pause(); }
        }
      },
      // Reset the simulation
      {
        type: 'button', label: 'Reset',
        action: () => {
          // Pause
          rps.pause();
          rps.matrixIndex = 0;

          // If the matrix is initialized randomly
          if (rps.features.init_random) {
            rps.randomizeMatrix();
          }
          // If there is an initial state
          else {
            rps.matrix[0] = structuredClone(rps.features.initial_matrix);
          }
          // Resume
          rps.play();
        }
      },
      // Step the simulation
      {
        type: 'button', label: 'Step',
        action: () => { rps.step(); }
      },
      {
        type: 'title',
        label: 'Rendering'
      },
      // Lock the relevant parameters
      {
        type: 'checkbox', label: 'Locked',
        object: guiFeatures,
        property: 'locked'
      },
      // Smooth between pixels
      {
        type: 'checkbox', label: 'Smoothing',
        object: guiFeatures,
        property: 'smoothing',
        onChange: (value) => {
          rps.features.smoothing = value;
        }
      },
      // Initialize randomly
      {
        type: 'checkbox', label: 'Border',
        object: guiFeatures,
        property: 'ifdead',
        onChange: (value) => {
          rps.features.ifdead = value;
        }
      },
      // Frames per second
      {
        type: 'range', label: 'FPS',
        min: 1, max: 60, step: 1,
        initial: 24,
        object: guiFeatures,
        property: 'fps',
        onChange: (value) => {
          rps.features.fps = value;
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
  for (let i = 0; i < rps.features.competitors.length; i++) {
    gui.Register({
      type: 'color',
      label: 'Color ' + (i+1),
      format: 'hex',
      initial: rps.features.competitors[i],
      folder: 'Colors',
      onChange: (value) => {
        // Update the value of the competitor
        rps.features.competitors[i] = value;
      }
    });
  }
}

// Start the game then load the colors
start(preset).then(configureGUI).then(colorPickers);