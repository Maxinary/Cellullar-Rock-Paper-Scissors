// could be made more efficient by caching
// but honestly the efficiency of this function is not important
function newMatrix(dims) {
  if (dims.length == 0) {
    return 0;
  }

  let o = new Array(dims[0]);

  for (let i=0; i<o.length; i++) {
    let m = newMatrix(dims.slice(1));
    o[i] = m;
  }

  return o;
}

function fillGridPoint(ctx, color, x, y, gridElementSize) {
  ctx.fillStyle = color;
  ctx.fillRect(x*gridElementSize, y*gridElementSize, gridElementSize, gridElementSize);
}

function color(r, g, b) {
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

function get_red(c) {
  return dehex(c.slice(1,3));
}

function get_green(c) {
  return dehex(c.slice(3,5));
}

function get_blue(c) {
  return dehex(c.slice(5,7));
}

function mixColors(colors, probabilities) {
  let red = 0;
  let green = 0;
  let blue = 0;

  let gamma = 1/2;

  for (var i=0; i<colors.length; i++) {
    if (gamma == 1) {
      red += get_red(colors[i]) * probabilities[i];
      green += get_green(colors[i]) * probabilities[i];
      blue += get_blue(colors[i]) * probabilities[i];
    } else {
      red += Math.pow(get_red(colors[i])/256, 1/gamma) * probabilities[i];
      green += Math.pow(get_green(colors[i])/256, 1/gamma) * probabilities[i];
      blue += Math.pow(get_blue(colors[i])/256, 1/gamma) * probabilities[i];
    }
  }

  if (gamma == 1)
    return color(red, green, blue);
  else
    return color(256*Math.pow(red, gamma), 256*Math.pow(green, gamma), 256*Math.pow(blue, gamma));
}
