let portals = [
  {
    name: "Chruch Door",
    image: "churchDoor",
    location: { map: "ArchitonOutpost", x: 49, y: 2 },
    timer: 2000,
    destination: { map: "Church", x: 58, y: 102 },
    text: "To The Church",
  },
  {
    name: "Cave Enterence",
    image: "cave",
    location: { map: "ArchitonOutpost", x: 78, y: 20 },
    timer: 2000,
    destination: { map: "DampCave", x: 37, y: 18 },
    text: "To The Damp Cave",
  },
];
try {
  module.exports = portals;
} catch (err) {}
