import config from "./config";

export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const range = (max) => [...Array(max).keys()]

export const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))

export const randomXPos = () => Math.floor(Math.random() * config.gameWidth)
export const randomYPos = () => Math.floor(Math.random() * config.gameHeight)

export const flat = arr => arr.reduce((acc, val) => acc.concat(val), [])