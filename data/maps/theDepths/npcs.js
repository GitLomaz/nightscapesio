let npcs = [
  {
    id: 17,
    location: { map: "TheDepths", x: 66, y: 41 },
    type: "quest",
    radius: 3,
    name: "Emery Taillepied",
    title: "Collector",
    image: "player_199",
    questIds: [16],
    noActions: "",
  },
  {
    id: 18,
    location: { map: "TheDepths", x: 9, y: 15 },
    type: "quest",
    radius: 3,
    name: "Asher Newman",
    title: "Fallen Knight",
    image: "player_53",
    questIds: [28, 29, 30],
    noActions: "The depths have been purged.",
  },
];
try {
  module.exports = npcs;
} catch (err) {}
