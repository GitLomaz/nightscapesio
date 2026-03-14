const statusEffects = [
  {
    id: 0,
    name: "Poison",
    description: "Lose 1% of your health per second.",
    image: "images/sprites/effects/poison.png",
    showRemaining: true,
    type: 0,
  },
  {
    id: 1,
    name: "Toxins",
    description: "Lose 10% of your health per second.",
    image: "images/sprites/effects/toxins.png",
    showRemaining: true,
    type: 0,
  },
  {
    id: 2,
    name: "Healing",
    description: "Gain 15 health per second.",
    image: "images/sprites/effects/heart_1.png",
    showRemaining: true,
    type: 0,
  },
  {
    id: 3,
    name: "Healing Pool",
    description: "Regain life as long as you're in the pool.",
    image: "images/sprites/effects/heal_1.png",
    showRemaining: false,
    type: 0,
  },
  {
    id: 4,
    name: "Haste",
    description: "25% increased movement speed",
    image: "images/sprites/effects/haste_1.png",
    showRemaining: true,
    type: 1,
    stats: {
      moveSpeed: -1,
    },
  },
  {
    id: 5,
    name: "Focus",
    description: "A small increase to attack speed",
    image: "images/sprites/effects/focus_1.png",
    showRemaining: true,
    type: 1,
    stats: {
      attackSpeed: -5,
    },
  },
  {
    id: 6,
    name: "Dex 1",
    description: "+1 Dexterity",
    image: "images/sprites/effects/dex.png",
    showRemaining: true,
    type: 1,
    stats: {
      dexterity: 1,
    },
  },
  {
    id: 7,
    name: "Str 1",
    description: "+1 Strength",
    image: "images/sprites/effects/str.png",
    showRemaining: true,
    type: 1,
    stats: {
      strength: 1,
    },
  },
  {
    id: 8,
    name: "Int 1",
    description: "+1 Intelligence",
    image: "images/sprites/effects/int.png",
    showRemaining: true,
    type: 1,
    stats: {
      intelligence: 1,
    },
  },
  {
    id: 9,
    name: "Agi 1",
    description: "+1 Agility",
    image: "images/sprites/effects/agi.png",
    showRemaining: true,
    type: 1,
    stats: {
      agility: 1,
    },
  },
  {
    id: 10,
    name: "Vit 1",
    description: "+1 Vitality",
    image: "images/sprites/effects/vit.png",
    showRemaining: true,
    type: 1,
    stats: {
      vitality: 1,
    },
  },
];
try {
  module.exports = statusEffects;
} catch (err) {}
