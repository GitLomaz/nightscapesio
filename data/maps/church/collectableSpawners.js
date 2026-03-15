let collectableSpawners = [
  // BEGIN bones
  {
    location: { map: "Church", x: 11, y: 72 },
    respawn: 100,
    radius: 9,
    collectables: [
      { id: 3, weight: 10 },
      { id: 2, weight: 10 },
    ],
    limit: 6,
  },
  {
    location: { map: "Church", x: 35, y: 85 },
    respawn: 100,
    radius: 9,
    collectables: [
      { id: 3, weight: 10 },
      { id: 2, weight: 10 },
    ],
    limit: 8,
  },
  // END bones
];
module.exports = collectableSpawners;
