// EVAL CONDITION LOGIC EXAMPLE
// condition: {
//   type: 'eval',
//   logic: 'true',
// },

let spawnPoints = [
  {
    count: 7,
    location: { map: "ArchitonOutpost", x: 24, y: 28 },
    radius: 12,
    respawn: 10,
    enemies: [{ id: 9, weight: 100 }],
    magicMods: [
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    // tutorial blob
    location: { map: "ArchitonOutpost", x: 41, y: 57 },
    respawn: 30,
    radius: 0,
    enemies: [{ id: 5, weight: 100 }],
  },
  // BEGIN center blobs
  {
    count: 2,
    location: { map: "ArchitonOutpost", x: 25, y: 60 },
    respawn: 50,
    radius: 12,
    enemies: [{ id: 5, weight: 100 }],
    magicMods: [{ id: 3, chance: 50 }],
  },
  {
    count: 2,
    location: { map: "ArchitonOutpost", x: 18, y: 62 },
    respawn: 50,
    radius: 12,
    enemies: [
      { id: 5, weight: 100 },
      { id: 6, weight: 100 },
    ],
    magicMods: [{ id: 3, chance: 50 }],
  },
  {
    count: 2,
    location: { map: "ArchitonOutpost", x: 23, y: 57 },
    respawn: 50,
    radius: 12,
    enemies: [{ id: 6, weight: 100 }],
    magicMods: [{ id: 3, chance: 50 }],
  },
  {
    count: 2,
    location: { map: "ArchitonOutpost", x: 19, y: 53 },
    respawn: 50,
    radius: 12,
    enemies: [
      { id: 5, weight: 100 },
      { id: 6, weight: 100 },
    ],
    magicMods: [{ id: 3, chance: 50 }],
  },
  // END center blobs
  // BEGIN hornets
  {
    count: 3,
    location: { map: "ArchitonOutpost", x: 50, y: 68 },
    respawn: 100,
    radius: 10,
    enemies: [{ id: 7, weight: 100 }],
    magicMods: [
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 3,
    location: { map: "ArchitonOutpost", x: 84, y: 68 },
    respawn: 100,
    radius: 10,
    enemies: [{ id: 7, weight: 100 }],
    magicMods: [
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  {
    count: 3,
    location: { map: "ArchitonOutpost", x: 69, y: 38 },
    respawn: 100,
    radius: 10,
    enemies: [{ id: 7, weight: 100 }],
    magicMods: [
      { id: 1, chance: 200 },
      { id: 2, chance: 200 },
      { id: 3, chance: 50 },
    ],
  },
  // END hornets
];
module.exports = spawnPoints;
