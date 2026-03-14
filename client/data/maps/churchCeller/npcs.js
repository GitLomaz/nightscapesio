let npcs = [
  {
    id: 6,
    location: { map: "ChurchCeller", x: 9, y: 9 },
    type: "quest",
    radius: 3,
    name: "Reverend Green",
    title: "Reverend",
    image: "player_153",
    questIds: [12, 18, 19],
    noActions: "Great job, that should help with the rat population for a bit!",
  },
];
try {
  module.exports = npcs;
} catch (err) {}
