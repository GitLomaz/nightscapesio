let collectableSpawners = [
  {
    location: { map: "DampCave", x: 25, y: 41 },
    respawn: 1,
    radius: 40,
    collectables: [
      { id: 4, weight: 10 }, // Remedy
      { id: 5, weight: 6 }, // Heal
      { id: 6, weight: 4 }, // Mana
      { id: 7, weight: 8 }, // Poison
      { id: 8, weight: 2 }, // Bad Poison
      { id: 9, weight: 2 }, // Heal over time
    ],
    limit: 7,
  },
];
module.exports = collectableSpawners;
