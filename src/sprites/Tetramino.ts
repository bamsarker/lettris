import tetraminoes, { tupleToCoord } from "../tetraminoes";
import { coordToPosition, worldXToGridX } from "../classes/Grid";
import { randomLetter } from "../letters";
import { delay } from "../utils";
import Tile from "./Tile";
import { Input } from "phaser-ce";
import config from "/config";

export default class Tetramino {
  public coord: { x: number; y: number };
  private shapeIndex: number;
  private poseIndex: number;
  private tiles: Tile[];
  public layout: { x: number; y: number; destroyed: boolean }[];
  private updateDelay: number;
  private previousUpdate: number;
  canMoveLeft: (tet: Tetramino) => boolean;
  canMoveRight: (tet: Tetramino) => boolean;
  canMoveDown: (tet: Tetramino) => boolean;
  layoutOverlapsAnything: (tet: Tetramino) => boolean;
  startY: number;

  constructor(
    { x, y, createTile, shapeIndex },
    { canMoveLeft, canMoveRight, canMoveDown, layoutOverlapsAnything }
  ) {
    this.coord = { x, y };
    this.shapeIndex = shapeIndex;
    this.poseIndex = 0;
    this.setLayout(this.shapeIndex, this.poseIndex);
    this.tiles = this.layout
      .map((coord) => ({
        x: coord.x + this.coord.x,
        y: coord.y + this.coord.y,
      }))
      .map((coord) => {
        return createTile(coordToPosition(coord), randomLetter());
      });
    this.updateDelay = 1000;
    this.previousUpdate = undefined;

    this.canMoveLeft = canMoveLeft;
    this.canMoveRight = canMoveRight;
    this.canMoveDown = canMoveDown;
    this.layoutOverlapsAnything = layoutOverlapsAnything;

    GameInstance.input.addMoveCallback(this.handlePointerMove, this);
    GameInstance.input.onTap.add(this.handlePointerTap);

    GameInstance.input.onDown.add(this.handlePointerDown);
    GameInstance.input.onUp.add(this.handlePointerUp);
  }

  handlePointerTap = () => {
    const endY = GameInstance.input.worldY;
    if (endY - this.startY > 50) return;

    this.handleUp();
  };

  handlePointerUp = () => {
    const endY = GameInstance.input.worldY;

    if (endY - this.startY > 50 && this.canMoveDown(this)) {
      for (let index = 0; index < config.grid.height; index++) {
        this.handleDown();
      }
    }
  };

  handlePointerDown = () => {
    this.startY = GameInstance.input.worldY;
  };

  handlePointerMove = (pointer: Phaser.Pointer) => {
    if (pointer.isDown) {
      const newX = worldXToGridX(pointer.worldX);
      if (newX > this.coord.x) {
        while (this.canMoveRight(this) && newX > this.coord.x) {
          this.handleRight();
        }
      } else if (newX < this.coord.x) {
        while (this.canMoveLeft(this) && newX < this.coord.x) {
          this.handleLeft();
        }
      }
    }
  };

  pulse() {
    return Promise.all(
      this.tiles
        .concat()
        .sort((a, b) => a.x - b.x + (a.y - b.y))
        .map((t, i) => delay(i * 50).then(() => t.pulse()))
    );
  }

  enter() {
    return Promise.all(
      this.tiles
        .concat()
        .sort((a, b) => a.x - b.x + (a.y - b.y))
        .map((t) => {
          t.scale.set(0);
          return t;
        })
        .map((t, i) => delay(i * 50).then(() => t.enter()))
    );
  }

  getLetters() {
    return this.tiles.map((t) => t.letterValue);
  }

  getCoordsTilesAndLetters() {
    const letters = this.getLetters();
    return this.layoutAsCoords().map((coord, i) =>
      Object.assign(coord, { letter: letters[i], tile: this.tiles[i] })
    );
  }

  removeBlockAtCoord(coord: { x: number; y: number }) {
    this.layoutAsCoords().forEach((c, i) => {
      if (c.x !== coord.x || c.y !== coord.y) return;
      this.tiles[i].remove();
      this.tiles[i].destroyed = true;
      this.layout[i].destroyed = true;
    });
    this.tiles = this.tiles.filter((t) => !t.destroyed);
    this.layout = this.layout.filter((l) => !l.destroyed);
  }

  moveTileAtCoordDown(tileCoord: { x: number; y: number }) {
    const coordIndex = this.layoutAsCoords().findIndex(
      (coord) => coord.x === tileCoord.x && coord.y === tileCoord.y
    );

    const localCoord = this.layout[coordIndex];

    localCoord.y += 1;

    this.updateTilePositions();
  }

  layoutAsCoords(): { x: number; y: number }[] {
    return this.layout.map((offset) => {
      return {
        x: this.coord.x + offset.x,
        y: this.coord.y + offset.y,
      };
    });
  }

  setLayout(index: number, poseIndex: number) {
    this.layout = tetraminoes.shapes[index].poses[poseIndex]
      .map(tupleToCoord)
      .map((coord) => ({ ...coord, destroyed: false }));
  }

  nextPose() {
    this.poseIndex = this.poseIndex === 3 ? 0 : this.poseIndex + 1;
  }

  updateTilePositions() {
    this.tiles.forEach((tile, i) => {
      const position = coordToPosition({
        x: this.coord.x + this.layout[i].x,
        y: this.coord.y + this.layout[i].y,
      });
      tile.position.x = position.x;
      tile.position.y = position.y;
    });
  }

  handleLeft() {
    if (!this.canMoveLeft(this)) return;

    this.coord.x -= 1;
  }

  handleRight() {
    if (!this.canMoveRight(this)) return;

    this.coord.x += 1;
  }

  handleUp() {
    this.nextPose();
    this.setLayout(this.shapeIndex, this.poseIndex);
    while (this.layoutOverlapsAnything(this)) {
      this.nextPose();
      this.setLayout(this.shapeIndex, this.poseIndex);
    }
  }

  handleDown() {
    if (!this.canMoveDown(this)) return;

    this.coord.y += 1;
  }

  update({ time }, cursors: Phaser.CursorKeys, createNewTetramino: () => void) {
    if (this.previousUpdate === undefined) this.previousUpdate = time.time;

    if (time.time > this.previousUpdate + this.updateDelay) {
      if (this.canMoveDown(this)) {
        this.coord.y += 1;
        this.previousUpdate = time.time;
      } else {
        createNewTetramino();
      }
    }

    if (cursors.left.justDown) {
      this.handleLeft();
    } else if (cursors.right.justDown) {
      this.handleRight();
    }
    if (cursors.down.isDown) {
      this.handleDown();
    }

    if (cursors.up.justDown) {
      this.handleUp();
    }

    this.updateTilePositions();
  }

  clearHandlers = () => {
    GameInstance.input.onDown.remove(this.handlePointerDown);
    GameInstance.input.onUp.remove(this.handlePointerUp);
    GameInstance.input.onTap.remove(this.handlePointerTap);
  };
}
