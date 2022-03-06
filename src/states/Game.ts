/* globals __DEV__ */
import Tile from "../sprites/Tile";
import WordResult from "../sprites/WordResult";
import GameOver from "../sprites/GameOver";
import Grid, { checkForWords } from "../classes/Grid";
import Tetramino from "../sprites/Tetramino";
import { randomTIndex } from "../tetraminoes";
import { range, delay, flat } from "../utils";
import config from "../config";
import Points from "../sprites/Points";
import BackgroundFXTile from "../sprites/BackgroundFXTile";
import Title from "/classes/Title";

export default class extends Phaser.State {
  public static key = "Game";
  public static onCreate = new Phaser.Signal();
  placedTetraminoes: Tetramino[];
  wordResults: WordResult[];
  cursors: Phaser.CursorKeys;
  points: Points;
  grid: Grid;
  activeTetramino: Tetramino;
  gameOverMessage: GameOver;
  private title: Title;

  init() {}
  preload() {}

  createTitle() {
    this.title = new Title(this.game);
  }

  createTile(pos, letter) {
    const tile = new Tile({
      game: this.game,
      x: pos.x,
      y: pos.y,
      asset: "tile",
      letter,
    });

    this.game.add.existing(tile);

    return tile;
  }

  createBackgroundTile(pos, i) {
    const tile = new Tile({
      game: this.game,
      x: pos.x,
      y: pos.y,
      asset: "bgTile",
      letter: "",
      alpha: i % 2 ? 0.7 : 0.5,
    });

    this.game.add.existing(tile);

    tile.cacheAsBitmap = true;

    return tile;
  }

  createFXTiles() {
    range(10).forEach((i) => {
      const fxTile = new BackgroundFXTile({
        game: this.game,
        x: 0,
        y: 0,
      });

      this.game.add.existing(fxTile);

      delay(Math.floor(Math.random() * 4000)).then(() => fxTile.loop());
    });
  }

  create() {
    this.createFXTiles();

    let bgRect = new Phaser.Graphics(this.game);
    bgRect.beginFill(config.backgroundColor);
    bgRect.drawRect(
      config.grid.position.x - config.grid.tileSize.width / 2,
      config.grid.position.y - config.grid.tileSize.height / 2,
      config.grid.width * config.grid.tileSize.width,
      config.grid.height * config.grid.tileSize.height
    );
    bgRect.endFill();

    this.game.add.existing(bgRect);

    this.placedTetraminoes = [];
    this.wordResults = [];

    this.createTitle();

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.points = new Points({
      game: this.game,
      x: 400,
      y: 25,
    });
    this.game.add.existing(this.points);

    this.grid = new Grid({
      createBackgroundTile: this.createBackgroundTile.bind(this),
    });

    this.activeTetramino = this.createNewTetramino();
    this.activeTetramino.enter();
  }

  createNewTetramino() {
    const shapeIndex = randomTIndex();
    return new Tetramino(
      {
        x: Math.floor(config.grid.width / 2),
        y: shapeIndex === 4 ? 2 : 1,
        createTile: this.createTile.bind(this),
        shapeIndex,
      },
      {
        canMoveDown: this.tetraminoCanMoveDown.bind(this),
        canMoveLeft: this.tetraminoCanMoveLeft.bind(this),
        canMoveRight: this.tetraminoCanMoveRight.bind(this),
        layoutOverlapsAnything: this.tetraminoLayoutOverlapsAnything.bind(this),
      }
    );
  }

  coordOverlapsWithAnyOtherTet(tets: Tetramino[]) {
    return (coord: { x: number; y: number }) =>
      tets.filter(
        (tet) =>
          tet.layout.filter(
            (c) =>
              c.x + tet.coord.x === coord.x && c.y + tet.coord.y === coord.y
          ).length > 0
      ).length > 0;
  }

  tetraminoIsAtTheBottom(tetramino: Tetramino) {
    return (
      tetramino
        .layoutAsCoords()
        .filter((coord) => coord.y === config.grid.height - 1).length > 0
    );
  }

  tetraminoWouldOverlap(
    tetramino: Tetramino,
    offset: { x: number; y: number }
  ) {
    return (
      tetramino.layout
        .map((coord) => ({
          x: coord.x + tetramino.coord.x + offset.x,
          y: coord.y + tetramino.coord.y + offset.y,
        }))
        .filter(this.coordOverlapsWithAnyOtherTet(this.placedTetraminoes))
        .length > 0
    );
  }

  tetraminoCanMoveLeft(tetramino: Tetramino) {
    return (
      tetramino.layout.filter((offset) => tetramino.coord.x + offset.x <= 0)
        .length === 0 && !this.tetraminoWouldOverlap(tetramino, { x: -1, y: 0 })
    );
  }

  tetraminoCanMoveRight(tetramino: Tetramino) {
    return (
      tetramino.layout.filter(
        (offset) => tetramino.coord.x + offset.x >= config.grid.width - 1
      ).length === 0 && !this.tetraminoWouldOverlap(tetramino, { x: 1, y: 0 })
    );
  }

  tetraminoCanMoveDown(tetramino: Tetramino) {
    return !(
      this.tetraminoIsAtTheBottom(tetramino) ||
      this.tetraminoWouldOverlap(tetramino, { x: 0, y: 1 })
    );
  }

  tetraminoLayoutOverlapsAnything(tetramino: Tetramino) {
    return (
      tetramino.layout.filter((offset) => tetramino.coord.x + offset.x < 0)
        .length > 0 ||
      tetramino.layout.filter(
        (offset) => tetramino.coord.x + offset.x > config.grid.width - 1
      ).length > 0 ||
      this.tetraminoWouldOverlap(tetramino, { x: 0, y: 0 })
    );
  }

  collectPoints(word: string) {
    word.split("").forEach(this.points.collectLetter.bind(this.points));
  }

  createWordResult(word: string) {
    this.collectPoints(word);
    const wordResult = new WordResult({
      game: this.game,
      x: 450,
      y: 50,
      word: word.toUpperCase(),
    });
    wordResult.enter();
    this.game.add.existing(wordResult);
    this.wordResults.unshift(wordResult);
    if (this.wordResults.length > 5) {
      const wr = this.wordResults.pop();
      wr.destroy();
    }

    this.wordResults.forEach((wr, i) => {
      wr.dropTo(i * 100 + 100);
    });
  }

  replaceActiveTetWithNewTet() {
    this.placedTetraminoes.push(this.activeTetramino);
    const currentlyActive = this.activeTetramino;
    currentlyActive.clearHandlers();
    this.activeTetramino = undefined;
    currentlyActive.pulse().then(async () => {
      await this.checkForWordsAndRows();
      if (this.checkForGameOver()) return;
      this.activeTetramino = this.createNewTetramino();
      this.activeTetramino.enter();
    });
  }

  checkForGameOver() {
    const allTileCoords = flat(
      this.placedTetraminoes.map((t) => {
        return t.layoutAsCoords();
      })
    ).filter((coord) => coord.y === 0);

    if (allTileCoords.length > 0) {
      this.gameOver();
      return true;
    }
    return false;
  }

  gameOver() {
    this.gameOverMessage = new GameOver({
      game: this.game,
      x: config.gameWidth - 180,
      y: config.gameHeight / 2 - 50,
      asset: "gameOverBg",
    });
    this.gameOverMessage.enter();
    this.game.add.existing(this.gameOverMessage);
  }

  async checkForWordsAndRows() {
    const coordsToRemove = checkForWords(
      this.placedTetraminoes,
      this.createWordResult.bind(this)
    );

    // remove tiles
    await Promise.all(
      coordsToRemove.map((c, i) => {
        return this.removeBlockAtCoord(c, i * 50);
      })
    );

    await delay(150);

    // move tiles down above these coords
    coordsToRemove.forEach((c) => {
      this.placedTetraminoes.forEach((t) => {
        const tileCoords = t.layoutAsCoords();

        const tileCoordsInColumn = tileCoords.filter(
          (tileCoord) => tileCoord.x === c.x && tileCoord.y < c.y
        );

        tileCoordsInColumn.forEach((tileCoord) => {
          t.moveTileAtCoordDown(tileCoord);
        });
      });
    });

    await delay(150);

    if (coordsToRemove.length > 0) return this.checkForWordsAndRows();
    else return Promise.resolve();
  }

  tetIncludesCoord(tet, coord) {
    return tet
      .layoutAsCoords()
      .map((c) => JSON.stringify(c))
      .includes(JSON.stringify(coord));
  }

  removeBlockAtCoord(coord, removalDelay = this.randomDelay()) {
    return Promise.all(
      this.placedTetraminoes
        .filter((t) => this.tetIncludesCoord(t, coord))
        .map((t) => delay(removalDelay).then(() => t.removeBlockAtCoord(coord)))
    );
  }

  randomDelay() {
    return Math.floor(Math.random() * 150);
  }

  update(game) {
    if (!!this.gameOverMessage) return;
    if (!this.activeTetramino) return;

    this.activeTetramino.update(
      game,
      this.cursors,
      this.replaceActiveTetWithNewTet.bind(this)
    );
  }

  render() {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.mushroom, 32, 32)
    // }
  }
}
