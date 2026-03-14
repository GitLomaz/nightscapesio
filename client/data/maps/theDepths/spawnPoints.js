// EVAL CONDITION LOGIC EXAMPLE
// condition: {
//   type: 'eval',
//   logic: 'true',
// },

let spawnPoints = [
  // BEGIN the depths
  {
    count: 5,
    location: { map: "TheDepths", x: 35, y: 42 },
    respawn: 1,
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
    count: 8,
    location: { map: "TheDepths", x: 35, y: 42 },
    respawn: 1,
    radius: 100,
    enemies: [{ id: 22, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 10,
    location: { map: "TheDepths", x: 35, y: 42 },
    respawn: 1,
    radius: 100,
    enemies: [{ id: 23, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "TheDepths", x: 10, y: 31 },
    respawn: 1,
    radius: 20,
    enemies: [{ id: 20, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 2,
    location: { map: "TheDepths", x: 10, y: 31 },
    respawn: 1,
    radius: 20,
    enemies: [{ id: 22, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 3,
    location: { map: "TheDepths", x: 10, y: 31 },
    respawn: 1,
    radius: 20,
    enemies: [{ id: 23, weight: 75 }],
    magicMods: [
      { id: 0, chance: 200 },
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "TheDepths", x: 52, y: 18 },
    respawn: 100,
    radius: 10,
    enemies: [{ id: 24, weight: 75 }],
    magicMods: [{ id: 3, chance: 150 }],
  },
  // END the depths
];
module.exports = spawnPoints;
