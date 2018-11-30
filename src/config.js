export default {
  gameWidth: 1200,
  gameHeight: 800,
  localStorageName: 'lettris',
  webfonts: ['Cabin:700'],
  backgroundColor: 0x273f64,
  titleLayout: [
    {
      x: 0,
      y: 0,
      letter: 'L'
    },
    {
      x: 1,
      y: 0,
      letter: 'E'
    },
    {
      x: 2,
      y: 0,
      letter: 'T'
    },
    {
      x: 2,
      y: 1,
      letter: 'T'
    },
    {
      x: 3,
      y: 1,
      letter: 'R'
    },
    {
      x: 4,
      y: 1,
      letter: 'I'
    },
    {
      x: 4,
      y: 2,
      letter: 'S'
    }
  ],
  tileLetterConfig: {
    font: '100px Cabin',
    fill: '#644e27',
    smoothed: true
  },
  uiLetterConfig: {
    font: '100px Cabin',
    fill: '#ffffff',
    smoothed: true
  },
  grid: {
    position: {
      x: 400,
      y: 50
    },
    tileSize: {
      width: 36,
      height: 36
    },
    width: 10,
    height: 20
  }
}
