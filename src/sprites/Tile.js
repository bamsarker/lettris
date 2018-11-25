import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, letter, alpha }) {
    super(game, x, y, asset)
    this.letter = game.add.text(0, 0, letter, config.tileLetterConfig)
    this.letter.anchor.set(0.5)
    this.addChild(this.letter)
    this.anchor.set(0.5)
    this.scale.set(0.275)
    this.alpha = alpha || 1
    this.game = game
    this.letterValue = letter
  }

  remove() {
    this.removalTween = this.game.add.tween(this.scale)
      .to({x: 0, y: 0}, 200, Phaser.Easing.Back.In, true)
    this.removalTween.onComplete.add(() => this.destroy())
  }

  update () {

  }
}
