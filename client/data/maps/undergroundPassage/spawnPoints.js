// EVAL CONDITION LOGIC EXAMPLE
// condition: {
//   type: 'eval',
//   logic: 'true',
// },

let spawnPoints = [
  // BEGIN underground cave
  {
    count: 1,
    location: { map: "UndergroundPassage", x: 129, y: 43 },
    respawn: 40,
    radius: 0,
    enemies: [{ id: 16, weight: 75 }],
    magicMods: [
      { id: 1, chance: 1000 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "UndergroundPassage", x: 121, y: 83 },
    respawn: 40,
    radius: 3,
    enemies: [{ id: 16, weight: 75 }],
    magicMods: [
      { id: 1, chance: 1000 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 4,
    location: { map: "UndergroundPassage", x: 67, y: 69 },
    respawn: 300,
    radius: 8,
    enemies: [{ id: 17, weight: 75 }],
    magicMods: [
      { id: 1, chance: 1000 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "UndergroundPassage", x: 66, y: 20 },
    respawn: 400,
    radius: 5,
    enemies: [{ id: 17, weight: 75 }],
    magicMods: [
      { id: 1, chance: 1000 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "UndergroundPassage", x: 23, y: 48 },
    respawn: 40,
    radius: 3,
    enemies: [{ id: 16, weight: 75 }],
    magicMods: [
      { id: 1, chance: 1000 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "UndergroundPassage", x: 92, y: 45 },
    respawn: 40,
    radius: 3,
    enemies: [{ id: 16, weight: 75 }],
    magicMods: [
      { id: 1, chance: 1000 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 12,
    location: { map: "UndergroundPassage", x: 81, y: 55 },
    respawn: 40,
    radius: 100,
    enemies: [{ id: 19, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 12,
    location: { map: "UndergroundPassage", x: 81, y: 55 },
    respawn: 40,
    radius: 100,
    enemies: [{ id: 20, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 12,
    location: { map: "UndergroundPassage", x: 81, y: 55 },
    respawn: 40,
    radius: 100,
    enemies: [{ id: 21, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 8,
    location: { map: "UndergroundPassage", x: 66, y: 20 },
    respawn: 2400,
    radius: 6,
    enemies: [
      { id: 2, weight: 100 },
      { id: 4, weight: 100 },
    ],
    condition: {
      type: "location",
      location: { map: "UndergroundPassage", x: 66, y: 20 },
      radius: 7,
    },
    magicMods: [
      { id: 0, chance: 4000 },
      { id: 1, chance: 4000 },
      { id: 2, chance: 4000 },
      { id: 3, chance: 100 },
    ],
  },
  // END underground cave
];
module.exports = spawnPoints;
