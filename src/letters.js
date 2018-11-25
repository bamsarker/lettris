export const lettersWithQuantities = {
  'A': 9,
  'B': 2,
  'C': 2,
  'D': 4,
  'E': 12,
  'F': 2,
  'G': 3,
  'H': 2,
  'I': 9,
  'J': 1,
  'K': 1,
  'L': 4,
  'M': 2,
  'N': 6,
  'O': 8,
  'P': 2,
  'Q': 1,
  'R': 6,
  'S': 4,
  'T': 6,
  'U': 4,
  'V': 2,
  'W': 2,
  'X': 1,
  'Y': 2,
  'Z': 1
}

export const letters = Object.keys(lettersWithQuantities)

export const distributedLetters = letters.reduce((arr, letter) => {
  arr = [...arr, ...Array(lettersWithQuantities[letter]).fill(letter)]
  return arr
}, [])

export const randomLetter = () => distributedLetters[Math.floor(Math.random() * distributedLetters.length)]