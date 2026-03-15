let portals = [
  {
    name: "Floor Hatch",
    image: "hatch",
    location: { map: "Church", x: 70, y: 64 },
    timer: 2000,
    destination: { map: "ChurchCeller", x: 13, y: 9 },
    text: "To The Church Celler",
  },
  {
    name: "Ladder",
    image: "graveLadder",
    location: { map: "Church", x: 4, y: 58 },
    timer: 2000,
    destination: { map: "UndergroundPassage", x: 137, y: 6 },
    text: "To Underground Passage",
  },
  {
    name: "Chruch Door",
    image: "churchDoor",
    location: { map: "Church", x: 58, y: 104 },
    timer: 2000,
    destination: { map: "ArchitonOutpost", x: 49, y: 5 },
    text: "To Architon Outpost",
  },
];
try {
  module.exports = portals;
} catch (err) {}
