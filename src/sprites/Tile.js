import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset, letter, alpha }) {
    super(game, x, y, asset)
    this.letter = game.add.text(this.width / 2, this.height / 2, letter, config.tileLetterConfig)
    this.letter.anchor.set(0.5)
    this.addChild(this.letter)
    this.scale.set(0.275)
    this.alpha = alpha || 1
  }

  update () {

  }
}
