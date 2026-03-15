let npcs = [
  {
    id: 7,
    location: { map: "PassageOutpost", x: 16, y: 11 },
    type: "shop",
    radius: 3,
    name: "Adam Howell",
    title: "Potion Master",
    image: "player_169",
    items: [35, 36, 37, 38, 39, 40],
    text: ["Need a boost?", "How about a pick-me-up?"],
  },
  {
    id: 8,
    location: { map: "PassageOutpost", x: 28, y: 11 },
    type: "shop",
    radius: 3,
    name: "Isaac Kleiner",
    title: "Weapon Merchent",
    image: "player_177",
    equipment: [13, 15, 16, 18],

    text: ["The finest wares in the land!", "You need it? I got it!"],
  },
  {
    id: 9,
    location: { map: "PassageOutpost", x: 21, y: 13 },
    type: "shop",
    radius: 3,
    name: "Gorgo Rant",
    title: "Medicine Man",
    image: "player_69",
    items: [4, 5, 19, 33],
    text: [
      "There's nothing the right potion can't cure!",
      "How about something for those cuts?",
    ],
  },
];
try {
  module.exports = npcs;
} catch (err) {}
