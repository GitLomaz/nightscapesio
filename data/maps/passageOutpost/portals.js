let portals = [
  {
    name: "Ladder",
    image: "ladder",
    location: { map: "PassageOutpost", x: 23, y: 3 },
    timer: 2000,
    destination: { map: "WesternRidges", x: 63, y: 32 },
    text: "To The Western Ridges",
  },
  {
    name: "Floor Hatch",
    image: "hatch",
    location: { map: "PassageOutpost", x: 26, y: 16 },
    timer: 2000,
    destination: { map: "UndergroundPassage", x: 20, y: 81 },
    text: "To Underground Passage",
  },
];
try {
  module.exports = portals;
} catch (err) {}
