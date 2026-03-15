let portals = [
  {
    name: "Cave Enterence",
    image: "cave",
    location: { map: "WesternRidges", x: 63, y: 30 },
    timer: 2000,
    destination: { map: "PassageOutpost", x: 23, y: 5 },
    text: "To The Caves Outpost",
  },
];
try {
  module.exports = portals;
} catch (err) {}
