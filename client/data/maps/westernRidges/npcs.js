let npcs = [
  {
    id: 19,
    location: { map: "WesternRidges", x: 54, y: 45 },
    type: "quest",
    radius: 3,
    name: "Emery Taillepied",
    title: "Collector",
    image: "player_199",
    questIds: [17],
    noActions: "",
  },
  {
    id: 20,
    location: { map: "WesternRidges", x: 50, y: 20 },
    type: "quest",
    radius: 3,
    name: "Issac Hamilton",
    title: "Hermit",
    image: "player_163",
    questIds: [32, 33, 34],
    noActions: "Thank you, I am finally safe.",
  },
  {
    id: 21,
    location: { map: "WesternRidges", x: 32, y: 41 },
    type: "quest",
    radius: 3,
    name: "Aidan Byrne",
    title: "Explorer",
    image: "player_103",
    questIds: [31],
    noActions: "",
  },
];
try {
  module.exports = npcs;
} catch (err) {}
