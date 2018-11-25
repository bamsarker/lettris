import Phaser from 'phaser'
import config from '../config'
import { range } from '../utils';

export const coordToPosition = coord => {
  return {
    x: coord.x * config.grid.tileSize.width + config.grid.position.x,
    y: coord.y * config.grid.tileSize.height + config.grid.position.y
  }
}

export default class {
  constructor({ createBackgroundTile }) {
    range(config.grid.width).map(x => {
      range(config.grid.height).map(y => {
        createBackgroundTile(coordToPosition({ x, y }))
      })
    })
  }

  update() {}
}
