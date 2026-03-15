// EVAL CONDITION LOGIC EXAMPLE
// condition: {
//   type: 'eval',
//   logic: 'true',
// },

let spawnPoints = [
  // BEGIN rats
  {
    count: 3,
    location: { map: "ChurchCeller", x: 15, y: 15 },
    respawn: 100,
    radius: 8,
    enemies: [{ id: 12, weight: 100 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 2,
    location: { map: "ChurchCeller", x: 24, y: 13 },
    respawn: 100,
    radius: 8,
    enemies: [{ id: 12, weight: 100 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 2,
    location: { map: "ChurchCeller", x: 39, y: 14 },
    respawn: 100,
    radius: 8,
    enemies: [
      { id: 12, weight: 75 },
      { id: 13, weight: 25 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 2,
    location: { map: "ChurchCeller", x: 38, y: 24 },
    respawn: 100,
    radius: 8,
    enemies: [
      { id: 12, weight: 75 },
      { id: 13, weight: 25 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 2,
    location: { map: "ChurchCeller", x: 34, y: 34 },
    respawn: 100,
    radius: 8,
    enemies: [
      { id: 12, weight: 50 },
      { id: 13, weight: 50 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 2,
    location: { map: "ChurchCeller", x: 25, y: 36 },
    respawn: 100,
    radius: 8,
    enemies: [
      { id: 12, weight: 25 },
      { id: 13, weight: 75 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 2,
    location: { map: "ChurchCeller", x: 24, y: 24 },
    respawn: 100,
    radius: 8,
    enemies: [
      { id: 12, weight: 25 },
      { id: 13, weight: 75 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 2,
    location: { map: "ChurchCeller", x: 13, y: 24 },
    respawn: 100,
    radius: 8,
    enemies: [{ id: 13, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 2,
    location: { map: "ChurchCeller", x: 11, y: 36 },
    respawn: 100,
    radius: 8,
    enemies: [{ id: 13, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "ChurchCeller", x: 13, y: 39 },
    respawn: 400,
    radius: 0,
    enemies: [{ id: 14, weight: 75 }],
  },
  // END rats
];
module.exports = spawnPoints;
