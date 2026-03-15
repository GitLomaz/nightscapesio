const magicEnemies = [
  {
    id: 0,
    prefix: "Deadly ",
    hue: 0xff311a,
    modifiers: {
      attack: 2.5,
      experence: 3,
      gold: 1.5,
      dropRate: 4,
      dropRarity: 1.5,
    },
  },
  {
    id: 1,
    prefix: "Swift ",
    hue: 0x0082ff,
    modifiers: {
      aspd: 0.5,
      experence: 2.5,
      gold: 1.5,
      dropRate: 3,
      dropRarity: 1.5,
    },
  },
  {
    id: 2,
    prefix: "Healthy ",
    hue: 0x6bd930,
    modifiers: {
      health: 3,
      experence: 3,
      gold: 1.5,
      dropRate: 3,
      dropRarity: 1.5,
    },
  },
  {
    id: 3,
    prefix: "Wealthy ",
    hue: 0xd59c4a,
    modifiers: {
      attack: 1.25,
      health: 1.25,
      experence: 2,
      gold: 5.5,
      dropRate: 8,
      dropRarity: 3,
    },
  },
];
try {
  module.exports = magicEnemies;
} catch (err) {}
