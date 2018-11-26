/* globals __DEV__ */
import Phaser from 'phaser'
import Tile from '../sprites/Tile'
import WordResult from '../sprites/WordResult'
import Grid, { checkForWords, emptyGrid } from '../classes/Grid'
import lang from '../lang'
import Tetramino from '../sprites/Tetramino'
import { randomTIndex } from '../tetraminoes'
import { range, delay } from '../utils'
import config from '../config'

export default class extends Phaser.State {
  init() {}
  preload() {}

  createTile(pos, letter) {
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

  createBackgroundTile(pos) {
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

  create() {
    this.placedTetraminoes = []
    this.wordResults = []

    this.cursors = game.input.keyboard.createCursorKeys()

    let banner = this.add.text(180, 80, 'LETTRIS', {
      font: '80px Cabin',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    this.grid = new Grid({
      createBackgroundTile: this.createBackgroundTile.bind(this)
    })

    this.activeTetramino = new Tetramino({
      x: 5,
      y: 1,
      createTile: this.createTile.bind(this),
      shapeIndex: randomTIndex()
    })
  }

  coordOverlapsWithAnyOtherTet(tets) {
    return coord =>
      tets.filter(
        tet =>
          tet.layout.filter(
            c => c.x + tet.coord.x === coord.x && c.y + tet.coord.y === coord.y
          ).length > 0
      ).length > 0
  }

  tetraminoIsAtTheBottom(tetramino) {
    return (
      tetramino
        .layoutAsCoords()
        .filter(coord => coord.y === config.grid.height - 1).length > 0
    )
  }

  tetraminoWouldOverlap(tetramino) {
    return (
      tetramino.layout
        .map(coord => ({
          x: coord.x + tetramino.coord.x,
          y: coord.y + tetramino.coord.y + 1
        }))
        .filter(this.coordOverlapsWithAnyOtherTet(this.placedTetraminoes))
        .length > 0
    )
  }

  tetraminoCanMoveDown(tetramino) {
    return !(
      this.tetraminoIsAtTheBottom(tetramino) ||
      this.tetraminoWouldOverlap(tetramino)
    )
  }

  createWordResult(word) {
    const wordResult = new WordResult({
      game: this.game,
      x: 195,
      y: (this.wordResults.length * 50) + 200,
      word: word.toUpperCase(),
      asset: 'tile'
    })
    wordResult.enter()
    this.game.add.existing(wordResult)
    this.wordResults.unshift(wordResult)
    if (this.wordResults.length > 5) {
      const wr = this.wordResults.pop()
      wr.destroy()
    }
    
    this.wordResults.forEach((wr, i) => {
        wr.dropTo((i * 50) + 200)
    })
  }

  replaceActiveTetWithNewTet(previousTetramino) {
    this.placedTetraminoes.push(this.activeTetramino)
    this.activeTetramino = new Tetramino({
      x: 5,
      y: 1,
      createTile: this.createTile.bind(this),
      shapeIndex: randomTIndex()
    })
    this.checkForWordsAndRows()
  }

  checkForWordsAndRows() {

    const coordsToRemove = checkForWords(
      this.placedTetraminoes,
      this.createWordResult.bind(this)
    )

    coordsToRemove.forEach((c, i) => {
      this.removeBlockAtCoord(c, i * 30)
    })
  }

  tetIncludesCoord(tet, coord) {
    return tet
      .layoutAsCoords()
      .map(c => JSON.stringify(c))
      .includes(JSON.stringify(coord))
  }

  removeBlockAtCoord(coord, removalDelay) {
    this.placedTetraminoes
      .filter(t => this.tetIncludesCoord(t, coord))
      .forEach(t => {
        delay(removalDelay == undefined ? this.randomDelay() : removalDelay).then(() => t.removeBlockAtCoord(coord))
      })
  }

  randomDelay() {
    return Math.floor(Math.random() * 150)
  }

  update(game) {
    this.activeTetramino.update(
      game,
      this.cursors,
      this.tetraminoCanMoveDown.bind(this),
      this.replaceActiveTetWithNewTet.bind(this)
    )
  }

  render() {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.mushroom, 32, 32)
    // }
  }
}
