let portals = [
  {
    name: "Ladder",
    image: "ladder",
    location: { map: "ChurchCeller", x: 13, y: 7 },
    timer: 2000,
    destination: { map: "Church", x: 71, y: 65 },
    text: "To The Church",
  },
];
try {
  module.exports = portals;
} catch (err) {}
