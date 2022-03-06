import config from "./config";

export const centerGameObjects = (objects: Phaser.Sprite[]) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5);
  });
};

export const range = (max: number): number[] => [...Array(max).keys()];

export const delay = (time: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time));

export const randomXPos = (): number =>
  Math.floor(Math.random() * config.gameWidth);
export const randomYPos = (): number =>
  Math.floor(Math.random() * config.gameHeight);

export const flat = <T>(arr: T[]) =>
  arr.reduce((acc, val) => acc.concat(val), []);
