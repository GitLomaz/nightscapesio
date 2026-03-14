let collectableSpawners = [
  // BEGIN flowers
  {
    location: { map: "ArchitonOutpost", x: 25, y: 11 },
    respawn: 10,
    radius: 6,
    collectables: [
      { id: 0, weight: 100 },
      { id: 1, weight: 100 },
    ],
    limit: 2,
  },
  {
    location: { map: "ArchitonOutpost", x: 33, y: 14 },
    respawn: 10,
    radius: 6,
    collectables: [{ id: 1, weight: 100 }],
    limit: 2,
  },
  {
    location: { map: "ArchitonOutpost", x: 30, y: 12 },
    respawn: 10,
    radius: 9,
    collectables: [{ id: 0, weight: 100 }],
    limit: 2,
  },
  // END flowers
];
module.exports = collectableSpawners;
