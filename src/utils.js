export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const range = (max) => [...Array(max).keys()]

export const delay = (time) => new Promise((resolve) => setTimeout(resolve, time))