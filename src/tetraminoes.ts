const config: { shapes: { poses: [number, number][][] }[] } = {
  shapes: [
    {
      poses: [
        [
          [0, -1],
          [-1, 0],
          [0, 0],
          [1, 0],
        ],
        [
          [1, 0],
          [0, -1],
          [0, 0],
          [0, 1],
        ],
        [
          [0, 1],
          [1, 0],
          [0, 0],
          [-1, 0],
        ],
        [
          [-1, 0],
          [0, 1],
          [0, 0],
          [0, -1],
        ],
      ],
    },
    {
      poses: [
        [
          [0, -1],
          [0, 0],
          [0, 1],
          [1, 1],
        ],
        [
          [1, 0],
          [0, 0],
          [-1, 0],
          [-1, 1],
        ],
        [
          [0, 1],
          [0, 0],
          [0, -1],
          [-1, -1],
        ],
        [
          [-1, 0],
          [0, 0],
          [1, 0],
          [1, -1],
        ],
      ],
    },
    {
      poses: [
        [
          [0, -1],
          [0, 0],
          [0, 1],
          [-1, 1],
        ],
        [
          [1, 0],
          [0, 0],
          [-1, 0],
          [-1, -1],
        ],
        [
          [0, 1],
          [0, 0],
          [0, -1],
          [1, -1],
        ],
        [
          [-1, 0],
          [0, 0],
          [1, 0],
          [1, 1],
        ],
      ],
    },
    {
      poses: [
        [
          [0, 0],
          [1, 0],
          [1, -1],
          [0, -1],
        ],
        [
          [0, -1],
          [0, 0],
          [1, 0],
          [1, -1],
        ],
        [
          [1, -1],
          [0, -1],
          [0, 0],
          [1, 0],
        ],
        [
          [1, 0],
          [1, -1],
          [0, -1],
          [0, 0],
        ],
      ],
    },
    {
      poses: [
        [
          [0, 1],
          [0, 0],
          [0, -1],
          [0, -2],
        ],
        [
          [-1, 0],
          [0, 0],
          [1, 0],
          [2, 0],
        ],
        [
          [0, -2],
          [0, -1],
          [0, 0],
          [0, 1],
        ],
        [
          [2, 0],
          [1, 0],
          [0, 0],
          [-1, 0],
        ],
      ],
    },
    {
      poses: [
        [
          [1, 0],
          [0, 0],
          [0, -1],
          [-1, -1],
        ],
        [
          [0, 1],
          [0, 0],
          [1, 0],
          [1, -1],
        ],
        [
          [-1, 0],
          [0, 0],
          [0, 1],
          [1, 1],
        ],
        [
          [0, -1],
          [0, 0],
          [-1, 0],
          [-1, 1],
        ],
      ],
    },
    {
      poses: [
        [
          [1, 0],
          [0, 0],
          [0, 1],
          [-1, 1],
        ],
        [
          [0, 1],
          [0, 0],
          [-1, 0],
          [-1, -1],
        ],
        [
          [-1, 0],
          [0, 0],
          [0, -1],
          [1, -1],
        ],
        [
          [0, -1],
          [0, 0],
          [1, 0],
          [1, 1],
        ],
      ],
    },
  ],
};

export default config;

export const tupleToCoord = (
  array: [number, number]
): { x: number; y: number } => ({ x: array[0], y: array[1] });
export const randomTIndex = (): number =>
  Math.floor(Math.random() * config.shapes.length);