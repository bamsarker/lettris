import Phaser from 'phaser'
import config from '../config'

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset }) {
    super(game, x, y, asset)
    this.game = game
    this.createGameOverText()
    this.createButton()
    this.anchor.set(0.5)
  }

  createGameOverText() {
    this.gameOverText = this.game.add.text(0, - this.height / 6, 'GAME OVER', config.uiLetterConfig)
    this.gameOverText.anchor.set(0.5)
    this.addChild(this.gameOverText)
  }

  createButton() {
    const onClick = () => {
      window.location.reload()
    }
    const ogButtonScale = 0.7

    this.button = this.game.add.button(0, this.height / 6, 'buttonBg', onClick)
    this.button.anchor.set(0.5)
    this.button.scale.set(ogButtonScale)
    
    this.buttonText = this.game.add.text(0, 0, 'PLAY AGAIN', config.uiLetterConfig)
    this.buttonText.anchor.set(0.5)
    this.button.addChild(this.buttonText)
    
    this.addChild(this.button)


    this.button.onInputOver.add(() => this.button.scale.set(ogButtonScale * 1.05), this);
    this.button.onInputOut.add(() => this.button.scale.set(ogButtonScale * 1), this);
    this.button.onInputDown.add(() => this.button.scale.set(ogButtonScale * 0.95), this);
    this.button.onInputUp.add(() => this.button.scale.set(ogButtonScale * 1), this);
  }

  // remove() {
  //   this.removalTween = this.game.add.tween(this.scale)
  //     .to({x: 0, y: 0}, 200, Phaser.Easing.Back.In, true)
  //   this.removalTween.onComplete.add(() => this.destroy())
  // }

  enter() {
    this.scale.set(0)
    this.game.add.tween(this.scale)
      .to({x: 0.5, y: 0.5}, 500, Phaser.Easing.Back.Out, true)
  }

  update () {

  }
}
