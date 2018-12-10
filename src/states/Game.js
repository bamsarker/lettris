/* globals __DEV__ */
import Phaser from 'phaser'
import Tile from '../sprites/Tile'
import WordResult from '../sprites/WordResult'
import GameOver from '../sprites/GameOver'
import Grid, { checkForWords, emptyGrid } from '../classes/Grid'
import lang from '../lang'
import Tetramino from '../sprites/Tetramino'
import { randomTIndex } from '../tetraminoes'
import { range, delay, flat } from '../utils'
import config from '../config'
import Points from '../sprites/Points';
import BackgroundFXTile from '../sprites/BackgroundFXTile';

export default class extends Phaser.State {
  init() { }
  preload() { }

  createTitle() {
    this.titleTiles = config.titleLayout.map(pos => this.createTile({
      x: pos.x * 60 + 60,
      y: pos.y * 60 + 60
    }, pos.letter))
    this.titleTiles.forEach(tile => tile.scale.set(0.45))

    const titlePulseLoop = () => {
      Promise.all(this.titleTiles.map((tile, i) => delay(i * 50).then(() => tile.pulse()))).then(() => delay(3000)).then(titlePulseLoop)
    }
    delay(1000).then(titlePulseLoop)
  }

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

  createBackgroundTile(pos, i) {
    const tile = new Tile({
      game: this.game,
      x: pos.x,
      y: pos.y,
      asset: 'bgTile',
      letter: '',
      alpha: i % 2 ? 0.7 : 0.5
    })

    this.game.add.existing(tile)

    return tile
  }

  createFXTiles() {
    range(10)
      .forEach(i => {
        const fxTile = new BackgroundFXTile(
          {
            game: this.game,
            x: 0,
            y: 0
          }
        )

        this.game.add.existing(fxTile)

        delay(Math.floor(Math.random() * 4000))
          .then(() => fxTile.loop())
      })
  }

  create() {

    this.music = game.sound.play('bgLoop');
    this.music.loopFull();

    this.createFXTiles()

    let bgRect = new Phaser.Graphics(this.game)
    bgRect.beginFill(config.backgroundColor);
    bgRect.drawRect(
      config.grid.position.x - config.grid.tileSize.width / 2,
      config.grid.position.y - config.grid.tileSize.height / 2,
      config.grid.width * config.grid.tileSize.width,
      config.grid.height * config.grid.tileSize.height
    );
    bgRect.endFill();

    this.game.add.existing(bgRect)

    this.placedTetraminoes = []
    this.wordResults = []

    this.createTitle()

    this.cursors = game.input.keyboard.createCursorKeys()

    this.points = new Points({
      game: this.game,
      x: config.gameWidth - 185,
      y: 100,
      asset: 'tile'
    })
    this.game.add.existing(this.points)

    let arrowImg = this.add.sprite(config.gameWidth - 320, config.gameHeight - 230, 'arrowKeys')
    arrowImg.scale.set(0.8)

    this.grid = new Grid({
      createBackgroundTile: this.createBackgroundTile.bind(this)
    })

    const shapeIndex = randomTIndex()
    this.activeTetramino = new Tetramino({
      x: Math.floor(config.grid.width / 2),
      y: shapeIndex === 4 ? 2 : 1,
      createTile: this.createTile.bind(this),
      shapeIndex
    })
    this.activeTetramino.enter()
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

  tetraminoWouldOverlap(tetramino, offset) {
    return (
      tetramino.layout
        .map(coord => ({
          x: coord.x + tetramino.coord.x + offset.x,
          y: coord.y + tetramino.coord.y + offset.y
        }))
        .filter(this.coordOverlapsWithAnyOtherTet(this.placedTetraminoes))
        .length > 0
    )
  }

  tetraminoCanMoveLeft(tetramino) {
    return (
      tetramino.layout.filter(offset => tetramino.coord.x + offset.x <= 0)
        .length === 0 && !this.tetraminoWouldOverlap(tetramino, { x: -1, y: 0 })
    )
  }

  tetraminoCanMoveRight(tetramino) {
    return (
      tetramino.layout.filter(
        offset => tetramino.coord.x + offset.x >= config.grid.width - 1
      ).length === 0 && !this.tetraminoWouldOverlap(tetramino, { x: 1, y: 0 })
    )
  }

  tetraminoCanMoveDown(tetramino) {
    return !(
      this.tetraminoIsAtTheBottom(tetramino) ||
      this.tetraminoWouldOverlap(tetramino, { x: 0, y: 1 })
    )
  }

  
  tetraminoLayoutOverlapsAnything(tetramino) {
    return (
      tetramino.layout.filter(offset => tetramino.coord.x + offset.x < 0)
        .length > 0 ||
      tetramino.layout.filter(
        offset => tetramino.coord.x + offset.x > config.grid.width - 1
      ).length > 0 ||
      this.tetraminoWouldOverlap(tetramino, { x: 0, y: 0 })
    )
  }

  collectPoints(word) {
    word.split('').forEach(this.points.collectLetter.bind(this.points))
  }

  createWordResult(word) {
    this.collectPoints(word)
    const wordResult = new WordResult({
      game: this.game,
      x: 195,
      y: 250,
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
      wr.dropTo((i * 100)+ 250)
    })
  }

  replaceActiveTetWithNewTet(previousTetramino) {
    this.placedTetraminoes.push(this.activeTetramino)
    const currentlyActive = this.activeTetramino
    this.activeTetramino = undefined
    currentlyActive.pulse()
      .then(() => {
        this.checkForWordsAndRows()
        if (this.checkForGameOver()) return
        const shapeIndex = randomTIndex()
        this.activeTetramino = new Tetramino({
          x: Math.floor(config.grid.width / 2),
          y: shapeIndex === 4 ? 2 : 1,
          createTile: this.createTile.bind(this),
          shapeIndex
        })
        this.activeTetramino.enter()
      })
  }

  checkForGameOver() {
    const allTileCoords = flat(this.placedTetraminoes
      .map(t => {
        return t.layoutAsCoords()
      })
    )
      .filter(coord => coord.y === 0)

    if (allTileCoords.length > 0) {
      this.gameOver()
      return true
    }
    return false
  }

  gameOver() {
    this.gameOverMessage = new GameOver({
      game: this.game,
      x: config.gameWidth - 180,
      y: (config.gameHeight / 2) - 50,
      asset: 'gameOverBg'
    })
    this.gameOverMessage.enter()
    this.game.add.existing(this.gameOverMessage)
  }

  checkForWordsAndRows() {
    const coordsToRemove = checkForWords(
      this.placedTetraminoes,
      this.createWordResult.bind(this)
    )

    coordsToRemove.forEach((c, i) => {
      this.removeBlockAtCoord(c, i * 50)
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
        delay(
          removalDelay == undefined ? this.randomDelay() : removalDelay
        ).then(() => t.removeBlockAtCoord(coord))
      })
  }

  randomDelay() {
    return Math.floor(Math.random() * 150)
  }

  update(game) {
    if (!!this.gameOverMessage) return;
    if (!this.activeTetramino) return;

    this.activeTetramino.update(
      game,
      this.cursors,
      {
        canMoveDown: this.tetraminoCanMoveDown.bind(this),
        canMoveLeft: this.tetraminoCanMoveLeft.bind(this),
        canMoveRight: this.tetraminoCanMoveRight.bind(this),
        layoutOverlapsAnything: this.tetraminoLayoutOverlapsAnything.bind(this)
      },
      this.replaceActiveTetWithNewTet.bind(this)
    )
  }

  render() {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.mushroom, 32, 32)
    // }
  }
}
