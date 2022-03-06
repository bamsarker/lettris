import WebFont from "webfontloader";
import config from "../config";

export default class extends Phaser.State {
  public static key = "Boot";
  public static onCreate = new Phaser.Signal();
  private fontsReady: boolean;

  init() {
    this.stage.backgroundColor = config.backgroundColor;
    this.fontsReady = false;
    this.fontsLoaded = this.fontsLoaded.bind(this);
  }

  preload() {
    if (config.webfonts.length) {
      WebFont.load({
        google: {
          families: config.webfonts,
        },
        active: this.fontsLoaded,
      });
    }

    let text = this.add.text(
      this.world.centerX,
      this.world.centerY,
      "loading fonts",
      { font: "16px Arial", fill: "#dddddd", align: "center" }
    );
    text.anchor.setTo(0.5, 0.5);

    this.load.image("loaderBg", "/images/loader-bg.png");
    this.load.image("loaderBar", "/images/loader-bar.png");
  }

  render() {
    if (config.webfonts.length && this.fontsReady) {
      this.state.start("Splash");
    }
    if (!config.webfonts.length) {
      this.state.start("Splash");
    }
  }

  fontsLoaded() {
    this.fontsReady = true;
  }
}
