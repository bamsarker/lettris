import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Text {
  constructor({ game, x, y, word }) {
    super(game, x, y, word, config.uiLetterConfig)
    this.anchor.set(0.5)
    this.scale.set(0)
    this.game = game
  }

  // remove() {
  //   this.removalTween = this.game.add.tween(this.scale)
  //     .to({x: 0, y: 0}, 200, Phaser.Easing.Back.In, true)
  //   this.removalTween.onComplete.add(() => this.destroy())
  // }

  enter() {
    this.enterTween = this.game.add
      .tween(this.scale)
      .to({ x: 0.275, y: 0.275 }, 400, Phaser.Easing.Back.Out, true)
  }

  dropTo(y) {
    this.moveTween = this.game.add
      .tween(this)
      .to({ y }, 300, Phaser.Easing.Back.InOut, true)
  }

  update() { }
}
