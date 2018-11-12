export default {
  gameWidth: 1200,
  gameHeight: 800,
  localStorageName: 'lettris',
  webfonts: ['Cabin'],
  backgroundColor: 0x123123,
  tileLetterConfig: {
    font: '100px Cabin',
    fill: '#FFFFFF',
    smoothed: true
  },
  grid: {
    position: {
      x: 400,
      y: 20
    },
    tileSize: {
      width: 36,
      height: 36
    },
    width: 10,
    height: 20
  }
}
