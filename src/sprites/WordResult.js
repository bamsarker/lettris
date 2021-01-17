import Phaser from "phaser";
import config from "../config";

export default class extends Phaser.Text {
  constructor({ game, x, y, word }) {
    super(game, x, y, word, config.uiLetterConfig);
    this.anchor.set(0.5);
    this.scale.set(0);
    this.game = game;
    this.getDefinition(word).then((response) =>
      this.showDefinition(this.limitDefinitionLength(response))
    );
  }

  // remove() {
  //   this.removalTween = this.game.add.tween(this.scale)
  //     .to({x: 0, y: 0}, 200, Phaser.Easing.Back.In, true)
  //   this.removalTween.onComplete.add(() => this.destroy())
  // }

  limitDefinitionLength(string) {
    return string.length < 110 ? string : string.substring(0, 109) + "...";
  }

  getDefinition(word) {
    return fetch(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "wordsapiv1.p.rapidapi.com",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        try {
          return res.results[0].definition;
        } catch (error) {
          return "";
        }
      });
  }

  showDefinition(def) {
    this.definitionText = this.game.add.text(
      0,
      45,
      def,
      config.definitionLetterConfig
    );
    this.definitionText.anchor.x = 0.5;
    this.addChild(this.definitionText);
  }

  enter() {
    this.enterTween = this.game.add
      .tween(this.scale)
      .to({ x: 0.275, y: 0.275 }, 400, Phaser.Easing.Back.Out, true);
  }

  dropTo(y) {
    this.moveTween = this.game.add
      .tween(this)
      .to({ y }, 300, Phaser.Easing.Back.InOut, true);
  }
}
