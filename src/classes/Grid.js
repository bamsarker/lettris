import Phaser from 'phaser'
import config from '../config'

export const coordToPosition = coord => {
  return {
    x: coord.x * config.grid.tileSize.width + config.grid.position.x,
    y: coord.y * config.grid.tileSize.height + config.grid.position.y
  }
}

export default class {
  constructor({ createBackgroundTile }) {
    Phaser.ArrayUtils.numberArray(config.grid.width).map(x => {
      Phaser.ArrayUtils.numberArray(config.grid.height).map(y => {
        createBackgroundTile(coordToPosition({ x, y }))
      })
    })
  }

  update() {}
}
