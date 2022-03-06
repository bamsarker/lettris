/* globals __DEV__ */
import Tile from "../sprites/Tile";
import { delay } from "../utils";
import config from "../config";

export default class {
  titleTiles: Tile[];

  constructor(game) {
    this.titleTiles = config.titleLayout.map((pos) =>
      this.createTile(
        game,
        {
          x: pos.x * 50 + 30,
          y: pos.y * 50 + 35,
        },
        pos.letter
      )
    );
    this.titleTiles.forEach((tile) => tile.scale.set(0.38));

    const titlePulseLoop = () => {
      Promise.all(
        this.titleTiles.map((tile, i) => delay(i * 50).then(() => tile.pulse()))
      )
        .then(() => delay(3000))
        .then(titlePulseLoop);
    };
    delay(1000).then(titlePulseLoop);
  }

  createTile(game, pos, letter) {
    const tile = new Tile({
      game: game,
      x: pos.x,
      y: pos.y,
      asset: "tile",
      letter,
    });

    game.add.existing(tile);

    return tile;
  }
}
