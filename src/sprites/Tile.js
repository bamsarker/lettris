import Phaser from 'phaser'
import config from '../config'
import { letterToPoint } from '../letters';

export default class extends Phaser.Sprite {
  constructor({ game, x, y, asset, letter, alpha }) {
    super(game, x, y, asset)
    this.letter = game.add.text(0, 0, letter, config.tileLetterConfig)
    this.letter.anchor.set(0.5)
    this.letter.scale.set(0.85)
    this.addChild(this.letter)
    this.anchor.set(0.5)
    this.scale.set(0.275)
    this.alpha = alpha || 1
    this.game = game
    this.letterValue = letter
    if (letter) {
      this.pointsValue = letterToPoint(letter).toString()
      this.addPointLabel(this.pointsValue)
    }
  }

  addPointLabel(points) {
    this.pointLabel = game.add.text(50, 60, points, config.tileLetterConfig)
    this.pointLabel.anchor.set(1)
    this.pointLabel.scale.set(0.35)
    this.addChild(this.pointLabel)
  }

  remove() {
    this.removalTween = this.game.add.tween(this.scale)
      .to({ x: 0, y: 0 }, 200, Phaser.Easing.Back.In, true)
    this.removalTween.onComplete.add(() => this.destroy())
  }

  update() {

  }
}
