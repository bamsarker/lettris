import lettrisConfig from "./config";
import "./global";
import Boot from "./states/Boot";
import Game from "./states/Game";
import Splash from "./states/Splash";

// Hot module replacement init
if (module.hot) {
  module.hot.dispose(destroyGame);
  module.hot.accept(() => console.log("[HMR]", "Accept"));
}

// Entry point
!(async () => {
  if (!window.GameInstance) {
    const game = (window.GameInstance = await startGameAsync());

    game.state.add(Splash.key, Splash);
    game.state.add(Game.key, Game);

    Boot.onCreate.addOnce(() => {
      game.state.start(Splash.key);
    });

    Splash.onCreate.addOnce(() => {
      game.state.start(Game.key);
    });
  }
})();

async function startGameAsync() {
  return new Promise<Phaser.Game>((resolve) => {
    Phaser.Device.whenReady((device: Phaser.Device) => {
      console.log("Device Ready");
      const isOffline = location.protocol === "file:";

      const config: Phaser.IGameConfig = {
        renderer: device.ie || isOffline ? Phaser.CANVAS : Phaser.AUTO, // IE cannot play videos in WebGL. Browsers may emit CORS errors if using WebGL offline.
        parent: document.querySelector<HTMLDivElement>("#content"),
        width: lettrisConfig.gameWidth,
        height: lettrisConfig.gameHeight,
        antialias: true,
        resolution: 1,
        maxPointers: 1,
        backgroundColor: lettrisConfig.backgroundColor,
        state: Boot,
      };

      const game = new Phaser.Game(config);

      resolve(game);
    });
  });
}

// Hot module replacement disposal
function destroyGame() {
  console.log("[HMR]", "Destroy Game");
  window.GameInstance.destroy();
  delete window.GameInstance;
}
