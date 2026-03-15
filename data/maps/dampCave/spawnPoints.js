// EVAL CONDITION LOGIC EXAMPLE
// condition: {
//   type: 'eval',
//   logic: 'true',
// },

let spawnPoints = [
  // BEGIN knife training
  {
    location: { map: "DampCave", x: 15, y: 50 },
    respawn: 50,
    radius: 1,
    enemies: [{ id: 15, weight: 100 }],
  },
  {
    location: { map: "DampCave", x: 17, y: 50 },
    respawn: 50,
    radius: 1,
    enemies: [{ id: 15, weight: 100 }],
  },
  {
    location: { map: "DampCave", x: 19, y: 50 },
    respawn: 50,
    radius: 1,
    enemies: [{ id: 15, weight: 100 }],
  },
  {
    location: { map: "DampCave", x: 21, y: 50 },
    respawn: 50,
    radius: 1,
    enemies: [{ id: 15, weight: 100 }],
  },
  // END knife training
  {
    count: 10,
    location: { map: "DampCave", x: 28, y: 38 },
    respawn: 50,
    radius: 40,
    enemies: [{ id: 25, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 4,
    location: { map: "DampCave", x: 51, y: 37 },
    respawn: 150,
    radius: 10,
    enemies: [{ id: 26, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 1,
    location: { map: "DampCave", x: 51, y: 35 },
    respawn: 500,
    radius: 1,
    enemies: [{ id: 27, weight: 100 }],
    magicMods: [{ id: 3, chance: 100 }],
  },
];
module.exports = spawnPoints;
