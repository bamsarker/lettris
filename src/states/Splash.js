import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init() { }

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.audio('bgLoop', 'assets/audio/bgLoop.wav')
    this.load.image('tile', 'assets/images/tile.png')
    this.load.image('bgTile', 'assets/images/bgTile.png')
    this.load.image('gameOverBg', 'assets/images/gameOverBg.png')
    this.load.image('buttonBg', 'assets/images/buttonBg.png')
    this.load.image('arrowKeys', 'assets/images/arrowKeys.png')
  }

  create() {
    this.state.start('Game')
  }
}
