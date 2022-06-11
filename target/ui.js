let MODES = {"Browse":1, "Edit":2, "View":3};

let current_mode = MODES.View;

// Ahhh I miss developing using an integrated environment
let MODE_ELEMENTS = {};
MODE_ELEMENTS[MODES.Browse] = document.getElementsByClassName("browse");
MODE_ELEMENTS[MODES.Edit] = document.getElementsByClassName("edit");
MODE_ELEMENTS[MODES.View] = document.getElementsByClassName("view");

function setMode(mode) {
  // clear current elements
  for(var i=0; i<MODE_ELEMENTS[current_mode].length; i++) {
    MODE_ELEMENTS[current_mode].hidden = true;
  }

  current_mode = mode;

  for(var i=0; i<MODE_ELEMENTS[current_mode].length; i++) {
    MODE_ELEMENTS[current_mode].hidden = false;
  }
}
