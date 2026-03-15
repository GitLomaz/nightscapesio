let receptacles = [
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "ArchitonOutpost", x: 66, y: 43 },
    collectionTimer: 500,
    gold: { chance: 100, min: 120, max: 200 },
  },
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "ArchitonOutpost", x: 23, y: 6 },
    collectionTimer: 500,
    gold: { chance: 100, min: 120, max: 200 },
  },
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "ArchitonOutpost", x: 47, y: 64 },
    collectionTimer: 500,
    gold: { chance: 100, min: 1200, max: 2000 },
  },
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "ArchitonOutpost", x: 27, y: 44 },
    collectionTimer: 1500,
    drops: [
      { item: 31, chance: 100, quantity: 1 },
      { item: 30, chance: 100, quantity: 1 },
      { item: 32, chance: 100, quantity: 1 },
    ],
  },
];
module.exports = receptacles;
