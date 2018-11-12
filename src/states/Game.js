/* globals __DEV__ */
import Phaser from 'phaser'
import Tile from '../sprites/Tile'
import Grid from '../classes/Grid'
import lang from '../lang'
import Tetramino from '../sprites/Tetramino'
import { randomTIndex } from '../tetraminoes';

export default class extends Phaser.State {
  init() {}
  preload() {}

  create() {
    this.cursors = game.input.keyboard.createCursorKeys()

    const bannerText = lang.text('welcome')
    let banner = this.add.text(180, 80, 'LETTRIS', {
      font: '80px Cabin',
      fill: '#77BFA3',
      smoothed: false
    })

    const createBackgroundTile = pos => {
      const tile = new Tile({
        game: this.game,
        x: pos.x,
        y: pos.y,
        asset: 'tile',
        letter: '',
        alpha: 0.2
      })

      this.game.add.existing(tile)

      return tile
    }

    const createTile = (pos, letter) => {
      const tile = new Tile({
        game: this.game,
        x: pos.x,
        y: pos.y,
        asset: 'tile',
        letter
      })

      this.game.add.existing(tile)

      return tile
    }

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    this.grid = new Grid({
      createBackgroundTile
    })

    this.activeTetramino = new Tetramino({
      x: 5,
      y: 1,
      createTile,
      shapeIndex: randomTIndex()
    })
  }

  update(game) {
    this.activeTetramino.update(game, this.cursors)
  }

  render() {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.mushroom, 32, 32)
    // }
  }
}
