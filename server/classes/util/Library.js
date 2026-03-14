const _ = require("lodash");
const PF = require("pathfinding");
const Maps = require("../Maps.js");

let SOCKET_LIST = {};
let SPAWN_POINTS = [];
let COLLECTABLE_SPAWNERS = [];
let TILE_SIZE = 32;
let GRAPHICS = [];
let SOUNDS = [];
let OBJECTS = {};
let NOTICES = [];

OBJECTS.PLAYERS = {};
OBJECTS.NPCS = {};
OBJECTS.ENEMIES = {};
OBJECTS.COLLECTABLES = {};
OBJECTS.RECEPTACLES = {};
OBJECTS.PORTALS = {};

module.exports = {
  getTile: function (map, x, y) {
    index = map.x * y + x;
    return map.layout[index];
  },
  getRandomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  clone: function (obj) {
    return Object.create(
      Object.getPrototypeOf(obj),
      Object.getOwnPropertyDescriptors(obj)
    );
  },
  numberWithCommas(x = 0) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  searchTile: function (loc, types = []) {
    let ret = false;
    types.push("portals");
    _.each(types, function (t) {
      _.each(OBJECTS[t.toUpperCase()], function (o) {
        if (
          o.location.x === loc.x &&
          o.location.y === loc.y &&
          o.location.map === loc.map
        ) {
          ret = true;
        }
      });
    });
    return ret;
  },
  getDirection: function (loc1, loc2) {
    let deltaX = loc1.x - loc2.x;
    let deltaY = loc1.y - loc2.y;
    if (deltaX === 0 && deltaY > 0) {
      return 7;
    } else if (deltaX === 0 && deltaY < 0) {
      return 1;
    } else if (deltaX > 0 && deltaY === 0) {
      return 5;
    } else if (deltaX < 0 && deltaY === 0) {
      return 3;
    } else if (deltaX > 0 && deltaY > 0) {
      return 8;
    } else if (deltaX < 0 && deltaY > 0) {
      return 6;
    } else if (deltaX > 0 && deltaY < 0) {
      return 2;
    } else if (deltaX < 0 && deltaY < 0) {
      return 0;
    }
    return false;
  },
  calculatePath: function (loc1, loc2) {
    try {
      let grid = new PF.Grid(Maps[loc1.map].layout);
      let finder = new PF.AStarFinder({
        allowDiagonal: true,
      });
      let path = finder.findPath(loc1.x, loc1.y, loc2.x, loc2.y, grid);
      return path;
    } catch (error) {
      return [];
    }
  },
  trimPath: function (path, point, range) {
    let ret = [];
    _.each(path, function (step) {
      const dist = Math.hypot(step[0] - point.x, step[1] - point.y);
      if (dist < range - 1) {
        ret = step;
        return false;
      }
    });
    return ret;
  },
  encodeHTML(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  },
  shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  },
  mergeStrings(str1, str2) {
    // NEEDS TO MERGE TWO STRINGS 1 CHARACTER AT A TIME
    // EXAMPLE: '12345' + 'abcde' = 1a2b3c4d5e'
    return str1 + str2;
  },
  colorDrop(name, rarity) {
    let color = "inherit";
    switch (rarity) {
      case "magic":
        color = "#104274";
        break;
      case "rare":
        color = "#006546";
        break;
      case "unique":
        color = "#839500";
        break;
    }
    return "<span style='color:" + color + "'>" + name + "</span>";
  },
  attemptAttack: function (attacker, defender) {
    let hit = 0;
    let dodge = 0;
    let chance = 10;
    if (attacker.hashObj.type == "player") {
      hit = attacker.calculatedStats.hit;
    } else {
      hit = attacker.attack.hit;
    }
    if (defender.hashObj.type == "player") {
      dodge = defender.calculatedStats.dodge;
    } else {
      dodge = defender.dodge;
    }
    chance = this.getHitChance(hit, dodge);
    if (chance >= 100) {
      return true;
    } else {
      let roll = this.getRandomInt(0, 100);
      return chance >= roll;
    }
  },
  getHitChance(hit, dodge) {
    let chance = hit - dodge;
    if (chance >= 100) {
      return 100;
    } else if (chance < 10) {
      return 10;
    }
    return chance;
  },
  SOCKET_LIST,
  SPAWN_POINTS,
  TILE_SIZE,
  GRAPHICS,
  SOUNDS,
  COLLECTABLE_SPAWNERS,
  OBJECTS,
  NOTICES,
};
