let receptacles = [
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "DampCave", x: 25, y: 35 },
    collectionTimer: 500,
    drops: [
      { item: 17, chance: 100, quantity: 15 },
      { item: 19, chance: 100, quantity: 5 },
    ],
  },
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "DampCave", x: 41, y: 18 },
    collectionTimer: 500,
    equipmentDrops: [
      { item: 11, chance: 100 },
      { item: 27, chance: 100 },
    ],
  },
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "DampCave", x: 45, y: 46 },
    collectionTimer: 500,
    drops: [
      { item: 4, chance: 100, quantity: 7 },
      { item: 5, chance: 100, quantity: 2 },
    ],
  },
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "DampCave", x: 47, y: 35 },
    collectionTimer: 500,
    equipmentDrops: [{ item: 7, chance: 100 }],
  },
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "DampCave", x: 49, y: 34 },
    collectionTimer: 500,
    gold: { chance: 100, min: 800, max: 900 },
  },
  {
    name: "Black Chest",
    image: "blackChest",
    radius: 1.5,
    usedImage: "blackChest1",
    location: { map: "DampCave", x: 55, y: 36 },
    collectionTimer: 500,
    equipmentDrops: [
      { item: 1, chance: 100 },
      { item: 3, chance: 100 },
    ],
  },
];
module.exports = receptacles;
