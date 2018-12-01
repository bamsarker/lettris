import Phaser from 'phaser'
import config from '../config'
import { range, flat } from '../utils'
import { wordList } from '../../assets/js/words'

export const coordToPosition = coord => {
  return {
    x: coord.x * config.grid.tileSize.width + config.grid.position.x,
    y: coord.y * config.grid.tileSize.height + config.grid.position.y
  }
}

export const emptyGrid = () => {
  const grid = []
  range(config.grid.height).forEach(y => {
    range(config.grid.width).forEach(x => {
      grid.push({
        x,
        y,
        letter: ' '
      })
    })
  })
  return grid
}

export const checkForRows = placedTetraminoes => {
  let coords = flat([...placedTetraminoes.map(t => t.layoutAsCoords())])
  const coordsToRemove = []
  range(config.grid.height)
    .map(i => i + 1)
    .forEach(y => {
      const coordsOnRow = coords.filter(c => c.y === y)
      if (coordsOnRow.length < config.grid.width) return

      coordsOnRow.map(c => coordsToRemove.push(c))
    })
  return coordsToRemove
}

export const checkForWords = (placedTetraminoes, createWordResult) => {
  let grid = emptyGrid()

  let coordsTilesAndLetters = flat(
    placedTetraminoes
      .map(t => t.getCoordsTilesAndLetters())
  )

  grid = grid.map(
    coord =>
      coordsTilesAndLetters.find(
        obj => obj.x === coord.x && obj.y === coord.y
      ) || coord
  )

  const rowsOfLetters = range(config.grid.height).map(y =>
    grid.filter(c => c.y === y)
  )
  const columnsOfLetters = range(config.grid.width).map(x =>
    grid.filter(c => c.x === x)
  )
  let linesOfLetters = rowsOfLetters.concat(columnsOfLetters)

  const bigStringOfGrid = flat(linesOfLetters)
    .map(c => c.letter)
    .join('')
    .toLowerCase()
  const allFoundWords = wordList
    .filter(w => bigStringOfGrid.includes(w))
    .sort((a, b) => {
      return b.length - a.length
    })
  const coordsToRemove = []

  if (allFoundWords.length === 0) return coordsToRemove

  linesOfLetters.forEach(line => {
    const joined = line
      .map(obj => obj.letter)
      .join('')
      .toLowerCase()
    const found = allFoundWords.find(w => joined.includes(w))
    if (!found) return

    console.log(found)
    createWordResult(found)

    const index = joined.indexOf(found)

    found.split('').forEach((char, i) => {
      const coordToRemove = { x: line[index + i].x, y: line[index + i].y }
      coordsToRemove.push(coordToRemove)
    })
  })
  return coordsToRemove
}

export default class {
  constructor({ createBackgroundTile }) {
    range(config.grid.width).map(x => {
      range(config.grid.height).map(y => {
        createBackgroundTile(coordToPosition({ x, y }), x)
      })
    })
  }

  update() { }
}
