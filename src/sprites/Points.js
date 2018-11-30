import Phaser from 'phaser'
import config from '../config'
import { letterToPoint } from '../letters';

export default class extends Phaser.Text {
  constructor({ game, x, y }) {
    super(game, x, y, 'SCORE: 0', config.uiLetterConfig)
    this.anchor.set(0.5)
    this.scale.set(0.5)
    this.game = game
    this.total = 0
  }

  updateDisplay() {
    this.setText(`SCORE: ${this.total}`)
  }

  collectLetter(letter) {
    this.total += letterToPoint(letter)
    this.updateDisplay()
  }

  update() { }
}
