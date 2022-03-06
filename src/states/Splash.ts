import { centerGameObjects } from "../utils";

export default class extends Phaser.State {
  public static key = "Splash";
  public static onCreate = new Phaser.Signal();
  private loaderBg: Phaser.Sprite;
  private loaderBar: Phaser.Sprite;

  init() {}

  preload() {
    this.loaderBg = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      "loaderBg"
    );
    this.loaderBar = this.add.sprite(
      this.game.world.centerX,
      this.game.world.centerY,
      "loaderBar"
    );
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);
    //
    // load your assets
    //
    this.load.image("tile", "./images/tile.png");
    this.load.image("bgTile", "./images/bgTile.png");
    this.load.image("gameOverBg", "./images/gameOverBg.png");
    this.load.image("buttonBg", "./images/buttonBg.png");
  }

  create() {
    this.state.start("Game");
  }
}
