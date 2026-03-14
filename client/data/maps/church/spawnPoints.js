// EVAL CONDITION LOGIC EXAMPLE
// condition: {
//   type: 'eval',
//   logic: 'true',
// },

let spawnPoints = [
  {
    // graveyard Necromancer
    location: { map: "Church", x: 10, y: 59 },
    respawn: 2000,
    radius: 0,
    enemies: [{ id: 3, weight: 100 }],
    magicMods: [{ id: 3, chance: 100 }],
  },
  // BEGIN trap room spawns
  {
    location: { map: "Church", x: 43, y: 8 },
    respawn: 2400,
    radius: 0,
    enemies: [{ id: 8, weight: 100 }],
    condition: {
      type: "location",
      location: { map: "Church", x: 48, y: 13 },
      radius: 2,
    },
    magicMods: [
      { id: 0, chance: 4000 },
      { id: 1, chance: 4000 },
      { id: 2, chance: 4000 },
      { id: 3, chance: 100 },
    ],
  },
  {
    location: { map: "Church", x: 52, y: 8 },
    respawn: 2400,
    radius: 0,
    enemies: [{ id: 8, weight: 100 }],
    condition: {
      type: "location",
      location: { map: "Church", x: 48, y: 13 },
      radius: 2,
    },
    magicMods: [
      { id: 0, chance: 4000 },
      { id: 1, chance: 4000 },
      { id: 2, chance: 4000 },
      { id: 3, chance: 100 },
    ],
  },
  {
    location: { map: "Church", x: 52, y: 18 },
    respawn: 2400,
    radius: 0,
    enemies: [{ id: 8, weight: 100 }],
    condition: {
      type: "location",
      location: { map: "Church", x: 48, y: 13 },
      radius: 2,
    },
    magicMods: [
      { id: 0, chance: 4000 },
      { id: 1, chance: 4000 },
      { id: 2, chance: 4000 },
      { id: 3, chance: 100 },
    ],
  },
  {
    location: { map: "Church", x: 43, y: 18 },
    respawn: 2400,
    radius: 0,
    enemies: [{ id: 8, weight: 100 }],
    condition: {
      type: "location",
      location: { map: "Church", x: 48, y: 13 },
      radius: 2,
    },
    magicMods: [
      { id: 0, chance: 4000 },
      { id: 1, chance: 4000 },
      { id: 2, chance: 4000 },
      { id: 3, chance: 100 },
    ],
  },
  {
    location: { map: "Church", x: 53, y: 13 },
    respawn: 2400,
    radius: 0,
    enemies: [{ id: 8, weight: 100 }],
    condition: {
      type: "location",
      location: { map: "Church", x: 48, y: 13 },
      radius: 2,
    },
    magicMods: [
      { id: 0, chance: 4000 },
      { id: 1, chance: 4000 },
      { id: 2, chance: 4000 },
      { id: 3, chance: 100 },
    ],
  },
  {
    location: { map: "Church", x: 42, y: 13 },
    respawn: 2400,
    radius: 0,
    enemies: [{ id: 8, weight: 100 }],
    condition: {
      type: "location",
      location: { map: "Church", x: 48, y: 13 },
      radius: 2,
    },
    magicMods: [
      { id: 0, chance: 4000 },
      { id: 1, chance: 4000 },
      { id: 2, chance: 4000 },
      { id: 3, chance: 100 },
    ],
  },
  // END trap room spawns
  // BEGIN graveyard skeletons
  {
    count: 5,
    location: { map: "Church", x: 37, y: 89 },
    respawn: 300,
    enemies: [
      { id: 2, weight: 100 },
      { id: 4, weight: 100 },
    ],
    radius: 12,
    magicMods: [
      { id: 0, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 3,
    location: { map: "Church", x: 42, y: 74 },
    respawn: 300,
    enemies: [
      { id: 2, weight: 100 },
      { id: 4, weight: 100 },
    ],
    radius: 12,
    magicMods: [
      { id: 0, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 4,
    location: { map: "Church", x: 12, y: 71 },
    respawn: 300,
    enemies: [
      { id: 2, weight: 100 },
      { id: 4, weight: 100 },
    ],
    radius: 12,
    magicMods: [
      { id: 0, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  // END graveyard skeletons
  // BEGIN beholders
  {
    count: 1,
    location: { map: "Church", x: 70, y: 51 },
    respawn: 140,
    radius: 1,
    enemies: [{ id: 28, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "Church", x: 85, y: 51 },
    respawn: 140,
    radius: 1,
    enemies: [{ id: 28, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "Church", x: 85, y: 58 },
    respawn: 140,
    radius: 1,
    enemies: [{ id: 28, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "Church", x: 70, y: 58 },
    respawn: 140,
    radius: 1,
    enemies: [{ id: 28, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "Church", x: 77, y: 54 },
    respawn: 140,
    radius: 1,
    enemies: [{ id: 28, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 4,
    location: { map: "Church", x: 57, y: 39 },
    respawn: 140,
    radius: 10,
    enemies: [{ id: 28, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 4,
    location: { map: "Church", x: 70, y: 39 },
    respawn: 140,
    radius: 10,
    enemies: [{ id: 28, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  // END beholders
  // BEGIN mimics
  {
    count: 8,
    location: { map: "Church", x: 75, y: 8 },
    respawn: 10,
    radius: 16,
    enemies: [{ id: 1, weight: 100 }],
    magicMods: [
      { id: 1, chance: 600 },
      { id: 3, chance: 75 },
    ],
  },
  // END mimics
  // BEGIN grand hall
  {
    count: 5,
    location: { map: "Church", x: 20, y: 20 },
    respawn: 100,
    radius: 12,
    enemies: [
      { id: 10, weight: 100 },
      { id: 11, weight: 20 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 5,
    location: { map: "Church", x: 20, y: 30 },
    respawn: 100,
    radius: 12,
    enemies: [
      { id: 10, weight: 100 },
      { id: 11, weight: 20 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 3,
    location: { map: "Church", x: 20, y: 40 },
    respawn: 100,
    radius: 6,
    enemies: [
      { id: 10, weight: 100 },
      { id: 11, weight: 20 },
    ],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  // END grand hall
  // BEGIN golems
  {
    count: 2,
    location: { map: "Church", x: 57, y: 62 },
    respawn: 100,
    radius: 30,
    enemies: [{ id: 8, weight: 20 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 3,
    location: { map: "Church", x: 57, y: 83 },
    respawn: 100,
    radius: 30,
    enemies: [{ id: 8, weight: 20 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 3,
    location: { map: "Church", x: 57, y: 37 },
    respawn: 100,
    radius: 130,
    enemies: [{ id: 8, weight: 20 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  // END golems
  // BEGIN acolites
  {
    count: 5,
    location: { map: "Church", x: 57, y: 37 },
    respawn: 100,
    radius: 130,
    enemies: [{ id: 0, weight: 20 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  // END acolites
];
module.exports = spawnPoints;
