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
      ],
      jumps: [1,2]
    },
    "random_six": {
        matrixSize: 128,
        smoothing:false,
        init_random:true,
        fps:24,
        matrixCount:2,
        ifdead:false,
        minDefeaters:2,
        competitors: [
          color(230,50,50),
          color(180,180,50),
          color(50,230,50),
          color(50,180,180),
          color(50,50,230),
          color(255,255,255)
        ],
        jumps: [1,2]
      },

      "random_seven_max": {
          matrixSize: 128,
          smoothing:false,
          init_random:true,
          fps:24,
          matrixCount:2,
          ifdead:false,
          minDefeaters:1,
          competitors: [
            color(230,50,50),
            color(180,180,50),
            color(50,230,50),
            color(50,180,180),
            color(50,50,230),
            color(255,255,255),
            color(50,50,50)
          ],
          jumps: [1,2,3]
        },
        "random_eight_onejump": {
            matrixSize: 128,
            smoothing:false,
            init_random:true,
            fps:24,
            matrixCount:2,
            ifdead:false,
            minDefeaters:2,
            competitors: [
              "#d91111",
              "#e4ff76",
              "#5af297",
              "#2c6ccb",
              "#8000a2",
              color(255,255,255),
              color(50,50,50),
            ],
            jumps: [1]
          },
          "random_eight_twojump_1": {
              matrixSize: 128,
              smoothing:false,
              init_random:true,
              fps:24,
              matrixCount:2,
              ifdead:false,
              minDefeaters:2,
              competitors: [
                "#d91111",
                "#e4ff76",
                "#5af297",
                "#2c6ccb",
                "#8000a2",
                color(255,255,255),
                color(50,50,50),
              ],
              jumps: [1,2]
            },
            "random_eight_twojump_2": {
                matrixSize: 128,
                smoothing:false,
                init_random:true,
                fps:24,
                matrixCount:2,
                ifdead:false,
                minDefeaters:2,
                competitors: [
                  "#d91111",
                  "#e4ff76",
                  "#5af297",
                  "#2c6ccb",
                  "#8000a2",
                  color(255,255,255),
                  color(50,50,50),
                ],
                jumps: [1,3]
              },
            "random_eight_threejump": {
                matrixSize: 128,
                smoothing:false,
                init_random:true,
                fps:24,
                matrixCount:2,
                ifdead:false,
                minDefeaters:2,
                competitors: [
                  "#d91111",
                  "#e4ff76",
                  "#5af297",
                  "#2c6ccb",
                  "#8000a2",
                  color(255,255,255),
                  color(50,50,50),
                ],
                jumps: [1,2,3]
              },
    "random_seven_vera": {
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
        color(50,50,230),
        '#d100ff',
        color(255,255,230)
      ],
      minDefeaters: 1,
      jumps: [2, 3]
    }
};

async function readNibbleFile(name) {
  let path = `presets/${name}.nbl`;

  return fetch(path).then(function(res){return res.text();}).then(x=>nibbleStringToArr(x));
}
