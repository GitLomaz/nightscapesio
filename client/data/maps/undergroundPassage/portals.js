let portals = [
  {
    name: "Ladder",
    image: "ladder",
    location: { map: "UndergroundPassage", x: 137, y: 4 },
    timer: 2000,
    destination: { map: "Church", x: 5, y: 59 },
    text: "To The Church",
  },
  {
    name: "Ladder",
    image: "caveLadder",
    location: { map: "UndergroundPassage", x: 63, y: 45 },
    timer: 2000,
    destination: { map: "TheDepths", x: 11, y: 17 },
    text: "To The Depths",
  },
  {
    name: "Ladder",
    image: "ladder",
    location: { map: "UndergroundPassage", x: 20, y: 79 },
    timer: 2000,
    destination: { map: "PassageOutpost", x: 26, y: 14 },
    text: "To The Passage Outpost",
  },
];
try {
  module.exports = portals;
} catch (err) {}
