let npcs = [
  {
    id: 4,
    location: { map: "DampCave", x: 13, y: 42 },
    type: "quest",
    radius: 3,
    name: "Fredric Redrook",
    title: "Trainer",
    image: "player_93",
    questIds: [7],
    noActions: "Great job, not much else I can teach you..",
  },
  {
    id: 5,
    location: { map: "DampCave", x: 32, y: 26 },
    type: "quest",
    radius: 3,
    name: "Conrad Clayhanger",
    title: "Researcher",
    image: "player_77",
    questIds: [8, 9, 10],
    noActions: "We've done good work here friend, I thank you.",
  },
];
try {
  module.exports = npcs;
} catch (err) {}
