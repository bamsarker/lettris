import Phaser from 'phaser'
import config from '../config'
import tetraminoes, { arrayToCoord } from '../tetraminoes'
import { coordToPosition } from '../classes/Grid'
import { randomLetter } from '../letters'
import { delay } from '../utils'

export default class {
  constructor({ x, y, createTile, shapeIndex }) {
    this.coord = { x, y }
    this.shapeIndex = shapeIndex
    this.poseIndex = 0
    this.setLayout(this.shapeIndex, this.poseIndex)
    this.tiles = this.layout
      .map(coord => ({
        x: coord.x + this.coord.x,
        y: coord.y + this.coord.y
      }))
      .map(coord => {
        return createTile(coordToPosition(coord), randomLetter())
      })
    this.updateDelay = 1000
    this.previousUpdate = undefined
  }

  pulse() {
    return Promise.all(
      this.tiles
        .concat()
        .sort((a, b) => a.x - b.x + (a.y - b.y))
        .map((t, i) => delay(i * 50).then(() => t.pulse()))
    )
  }

  enter() {
    return Promise.all(
      this.tiles
        .concat()
        .sort((a, b) => a.x - b.x + (a.y - b.y))
        .map(t => {
          t.scale.set(0)
          return t
        })
        .map((t, i) => delay(i * 50).then(() => t.enter()))
    )
  }

  getLetters() {
    return this.tiles.map(t => t.letterValue)
  }

  getCoordsTilesAndLetters() {
    const letters = this.getLetters()
    return this.layoutAsCoords().map((coord, i) =>
      Object.assign(coord, { letter: letters[i], tile: this.tiles[i] })
    )
  }

  removeBlockAtCoord(coord) {
    this.layoutAsCoords().forEach((c, i) => {
      if (c.x !== coord.x || c.y !== coord.y) return
      this.tiles[i].remove()
      this.tiles[i].destroyed = true
      this.layout[i].destroyed = true
    })
    this.tiles = this.tiles.filter(t => !t.destroyed)
    this.layout = this.layout.filter(l => !l.destroyed)
  }

  layoutAsCoords() {
    return this.layout.map(offset => {
      return {
        x: this.coord.x + offset.x,
        y: this.coord.y + offset.y
      }
    })
  }

  setLayout(index, poseIndex) {
    this.layout = tetraminoes.shapes[index].poses[poseIndex].map(arrayToCoord)
  }

  nextPose() {
    this.poseIndex = this.poseIndex === 3 ? 0 : this.poseIndex + 1
  }

  updateTilePositions() {
    this.tiles.forEach((tile, i) => {
      const position = coordToPosition({
        x: this.coord.x + this.layout[i].x,
        y: this.coord.y + this.layout[i].y
      })
      tile.position.x = position.x
      tile.position.y = position.y
    })
  }

  update(
    { time },
    cursors,
    { canMoveLeft, canMoveRight, canMoveDown, layoutOverlapsAnything },
    createNewTetramino
  ) {
    if (this.previousUpdate === undefined) this.previousUpdate = time.time

    if (time.time > this.previousUpdate + this.updateDelay) {
      if (canMoveDown(this)) {
        this.coord.y += 1
        this.previousUpdate = time.time
      } else {
        createNewTetramino(this)
      }
    }

    if (cursors.left.justDown && canMoveLeft(this)) {
      this.coord.x -= 1
    } else if (cursors.right.justDown && canMoveRight(this)) {
      this.coord.x += 1
    }
    if (cursors.down.isDown && canMoveDown(this)) {
      this.coord.y += 1
    }

    if (cursors.up.justDown) {
      this.nextPose()
      this.setLayout(this.shapeIndex, this.poseIndex)
      while(layoutOverlapsAnything(this)) {
        this.nextPose()
        this.setLayout(this.shapeIndex, this.poseIndex)
      }
    }

    this.updateTilePositions()
  }
}
