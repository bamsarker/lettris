export default {
  gameWidth: 550,
  gameHeight: 800,
  localStorageName: "lettris",
  webfonts: ["Cabin:700"],
  backgroundColor: 0x127475,
  titleLayout: [
    {
      x: 0,
      y: 0,
      letter: "L",
    },
    {
      x: 1,
      y: 0,
      letter: "E",
    },
    {
      x: 2,
      y: 0,
      letter: "T",
    },
    {
      x: 2,
      y: 1,
      letter: "T",
    },
    {
      x: 3,
      y: 1,
      letter: "R",
    },
    {
      x: 4,
      y: 1,
      letter: "I",
    },
    {
      x: 4,
      y: 2,
      letter: "S",
    },
  ],
  tileLetterConfig: {
    font: "105px Cabin",
    fill: "#644e27",
    smoothed: true,
  },
  uiLetterConfig: {
    font: "60px Cabin",
    fill: "#ffffff",
    smoothed: true,
  },
  definitionLetterConfig: {
    font: "60px Cabin",
    fill: "#ffffff",
    smoothed: true,
    boundsAlignH: "center",
    wordWrap: true,
    wordWrapWidth: 900,
    align: "center",
  },
  grid: {
    position: {
      x: 30,
      y: 140,
    },
    tileSize: {
      width: 37,
      height: 37,
    },
    width: 9,
    height: 18,
  },
};
