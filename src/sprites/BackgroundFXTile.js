import Phaser from 'phaser'
import config from '../config'
import { randomXPos, randomYPos } from '../utils'

export default class extends Phaser.Sprite {
  constructor({ game, x, y }) {
    super(game, x, y, 'tile')

    this.anchor.set(0.5)
    this.scale.set(0.275)
    this.alpha = 0
    this.game = game
    this.setRotationSpeed()
  }

  setRotationSpeed() {
    this.rotationSpeed = (Math.random() * 1) - 0.5
  }

  loop() {
    this.x = randomXPos()
    this.y = randomYPos()
    this.scale.set(0.2)
    const targetScale = 0.4
    const targetAlpha = 0.5
    const duration = Math.floor(Math.random() * 5000) + 5000
    this.setRotationSpeed()
    Promise.all([
      new Promise(resolve =>
        this.game.add
          .tween(this.scale)
          .to(
            { x: targetScale, y: targetScale },
            duration,
            Phaser.Easing.Linear.None,
            true
          )
          .onComplete.add(resolve)
      ),
      new Promise(resolve =>
        this.game.add
          .tween(this)
          .to({ alpha: targetAlpha }, duration / 2, Phaser.Easing.Linear.None, true)
          .onComplete.add(() =>
            this.game.add
              .tween(this)
              .to({ alpha: 0 }, duration / 2, Phaser.Easing.Linear.None, true)
              .onComplete.add(resolve)
          )
      )
    ]).then(() => this.loop())
  }

  update() {
    this.angle += this.rotationSpeed
  }
}
