declare global {
  const GameInstance: Phaser.Game;

  interface Window {
    PIXI: typeof PIXI;
    p2: typeof p2;
    Phaser: typeof Phaser;
    GameInstance: typeof GameInstance;
  }
}

export {};
