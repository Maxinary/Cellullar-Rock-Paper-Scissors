let saves = {
  "triangleGrow": {
    matrixSize: 128,
    smoothing:false,
    init_random:false,
    fps:24
  },
  "triangleFill": {
      matrixSize: 128,
      smoothing:false,
      init_random:false,
      fps:40
  },
  "inversecircle": {
      matrixSize: 128,
      smoothing:false,
      init_random:false,
      fps:24
  },
  "random_three": {
      matrixSize: 128,
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
  },
  "random_four": {
      matrixSize: 128,
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
      ],
      minDefeaters: 2
  },
  "squarefill": {
      matrixSize: 128,
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
      ],
      minDefeaters: 1
    },
  "random_five": {
      matrixSize: 128,
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
    }
};

async function readNibbleFile(name) {
  let path = `presets/${name}.nbl`;

  return fetch(path).then(function(res){return res.text();}).then(x=>nibbleStringToArr(x));
}
