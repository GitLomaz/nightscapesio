// EVAL CONDITION LOGIC EXAMPLE
// condition: {
//   type: 'eval',
//   logic: 'true',
// },

let spawnPoints = [
  {
    count: 5,
    location: { map: "WesternRidges", x: 11, y: 44 },
    respawn: 10,
    radius: 15,
    enemies: [{ id: 32, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 5,
    location: { map: "WesternRidges", x: 12, y: 62 },
    respawn: 10,
    radius: 15,
    enemies: [{ id: 32, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 5,
    location: { map: "WesternRidges", x: 39, y: 58 },
    respawn: 10,
    radius: 15,
    enemies: [{ id: 32, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },

  {
    count: 7,
    location: { map: "WesternRidges", x: 13, y: 6 },
    respawn: 10,
    radius: 15,
    enemies: [
      { id: 29, weight: 75 },
      { id: 30, weight: 75 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },

  {
    count: 7,
    location: { map: "WesternRidges", x: 38, y: 6 },
    respawn: 10,
    radius: 15,
    enemies: [
      { id: 29, weight: 75 },
      { id: 30, weight: 75 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },

  {
    count: 7,
    location: { map: "WesternRidges", x: 55, y: 36 },
    respawn: 10,
    radius: 15,
    enemies: [
      { id: 29, weight: 75 },
      { id: 30, weight: 75 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },

  {
    count: 7,
    location: { map: "WesternRidges", x: 4, y: 22 },
    respawn: 10,
    radius: 15,
    enemies: [
      { id: 29, weight: 75 },
      { id: 30, weight: 75 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },

  {
    count: 7,
    location: { map: "WesternRidges", x: 36, y: 30 },
    respawn: 10,
    radius: 75,
    enemies: [{ id: 33, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },

  {
    count: 12,
    location: { map: "WesternRidges", x: 36, y: 30 },
    respawn: 10,
    radius: 75,
    enemies: [{ id: 31, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },

  {
    count: 4,
    location: { map: "WesternRidges", x: 30, y: 13 },
    respawn: 10,
    radius: 10,
    enemies: [{ id: 31, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },

  {
    location: { map: "WesternRidges", x: 13, y: 20 },
    respawn: 100,
    radius: 3,
    enemies: [{ id: 34, weight: 75 }],
    magicMods: [{ id: 3, chance: 50 }],
  },
];
module.exports = spawnPoints;
