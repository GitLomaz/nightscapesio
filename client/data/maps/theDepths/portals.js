let portals = [
  {
    name: "Ladder",
    image: "ladder",
    location: { map: "TheDepths", x: 11, y: 14 },
    timer: 2000,
    destination: { map: "UndergroundPassage", x: 63, y: 47 },
    text: "To The Church",
  },
];
try {
  module.exports = portals;
} catch (err) {}
