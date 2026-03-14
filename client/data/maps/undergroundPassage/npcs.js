let npcs = [
  {
    id: 14,
    location: { map: "UndergroundPassage", x: 124, y: 21 },
    type: "quest",
    radius: 3,
    name: "Emery Taillepied",
    title: "Collector",
    image: "player_199",
    questIds: [15],
    noActions: "",
  },
  {
    id: 15,
    location: { map: "UndergroundPassage", x: 77, y: 20 },
    type: "quest",
    radius: 3,
    name: "Arnald Pippery",
    title: "Monk",
    image: "player_91",
    questIds: [25, 26],
    noActions: "You have done a great service for good this day.",
  },
  {
    id: 16,
    location: { map: "UndergroundPassage", x: 50, y: 48 },
    type: "quest",
    radius: 3,
    name: "Tyler Ward",
    title: "Mushroom Hunter",
    image: "player_171",
    questIds: [27],
    noActions: "",
  },
];
try {
  module.exports = npcs;
} catch (err) {}
