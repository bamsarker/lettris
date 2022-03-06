import config from "../config";
import { letterToPoint } from "../letters";

export default class extends Phaser.Sprite {
  private size = 0.285;

  private letter: Phaser.Text;

  letterValue: string;
  private pointsValue: string;
  private pointLabel: Phaser.Text;
  private removalTween: Phaser.Tween;

  public destroyed: boolean = false;

  constructor({ game, x, y, asset, letter, alpha = 1 }) {
    super(game, x, y, asset);
    this.letter = game.add.text(0, 0, letter, config.tileLetterConfig);
    this.letter.anchor.set(0.5);
    this.letter.scale.set(0.85);
    this.addChild(this.letter);
    this.anchor.set(0.5);
    this.scale.set(this.size);
    this.alpha = alpha || 1;
    this.game = game;
    this.letterValue = letter;
    if (letter) {
      this.pointsValue = letterToPoint(letter).toString();
      this.addPointLabel(this.pointsValue);
    }
  }

  addPointLabel(points) {
    this.pointLabel = GameInstance.add.text(
      50,
      60,
      points,
      config.tileLetterConfig
    );
    this.pointLabel.anchor.set(1);
    this.pointLabel.scale.set(0.35);
    this.addChild(this.pointLabel);
  }

  pulse() {
    const scale = this.scale.x;
    const targetScale = scale * 1.2;
    const duration = 200;
    return new Promise((resolve) =>
      this.game.add
        .tween(this.scale)
        .to(
          { x: targetScale, y: targetScale },
          duration / 2,
          Phaser.Easing.Quadratic.In,
          true
        )
        .onComplete.add(() =>
          this.game.add
            .tween(this.scale)
            .to(
              { x: scale, y: scale },
              duration / 2,
              Phaser.Easing.Quadratic.Out,
              true
            )
            .onComplete.add(resolve)
        )
    );
  }

  remove() {
    this.removalTween = this.game.add
      .tween(this.scale)
      .to({ x: 0, y: 0 }, 200, Phaser.Easing.Back.In, true);
    this.removalTween.onComplete.add(() => this.destroy());
  }

  enter() {
    return new Promise((resolve) =>
      this.game.add
        .tween(this.scale)
        .to({ x: this.size, y: this.size }, 200, Phaser.Easing.Back.Out, true)
        .onComplete.add(resolve)
    );
  }
}
