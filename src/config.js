export default {
  gameWidth: 1200,
  gameHeight: 800,
  localStorageName: 'lettris',
  webfonts: ['Cabin:700'],
  backgroundColor: 0x273f64,
  tileLetterConfig: {
    font: '100px Cabin',
    fill: '#644e27',
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
