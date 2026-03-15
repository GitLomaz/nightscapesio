let SOCKET_LIST = {};
let SPAWN_POINTS = [];
let COLLECTABLE_SPAWNERS = [];
// let TILE_SIZE = 32;
let GRAPHICS = [];
let SOUNDS = [];
let OBJECTS = {};
let NOTICES = [];
var io; // Use 'var' so it's accessible on window object - will be set by SocketAdapter

// Initialize LocalSocketServer for singleplayer mode
// This will be set by SocketAdapter when game initializes

if (typeof LocalSocketServer !== 'undefined') {
  console.log('[Library] LocalSocketServer is available, will wait for game to initialize io');
} else {
  console.warn('[Library] LocalSocketServer not available - make sure LocalSocket.js is loaded first');
}

OBJECTS.PLAYERS = {};
OBJECTS.NPCS = {};
OBJECTS.ENEMIES = {};
OBJECTS.COLLECTABLES = {};
OBJECTS.RECEPTACLES = {};
OBJECTS.PORTALS = {};

function getTile(map, x, y) {
  index = map.x * y + x;
  return map.layout[index];
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clone(obj) {
  return Object.create(
    Object.getPrototypeOf(obj),
    Object.getOwnPropertyDescriptors(obj)
  );
}
function numberWithCommas(x = 0) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function searchTile(loc, types = []) {
  let ret = false;
  types.push("portals");
  types.forEach((t) => {
    Object.values(OBJECTS[t.toUpperCase()]).forEach((o) => {
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
}
function getDirection(loc1, loc2) {
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
}
function calculatePath(loc1, loc2) {
  try {
    let grid = new PF.Grid(Maps[loc1.map].layout);
    let finder = new PF.AStarFinder({
      allowDiagonal: true,
    });
    let path = finder.findPath(loc1.x, loc1.y, loc2.x, loc2.y, grid);
    return path;
  } catch (error) {
    console.log('error')
    console.log(error)
    return [];
  }
}
function trimPath (path, point, range) {
  let ret = [];
  path.forEach((step) => {
    const dist = Math.hypot(step[0] - point.x, step[1] - point.y);
    if (dist < range - 1) {
      ret = step;
      return false;
    }
  });
  return ret;
}
function encodeHTML(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
function mergeStrings(str1, str2) {
  // NEEDS TO MERGE TWO STRINGS 1 CHARACTER AT A TIME
  // EXAMPLE: '12345' + 'abcde' = 1a2b3c4d5e'
  return str1 + str2;
}
function colorDrop(name, rarity) {
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
}
function attemptAttack(attacker, defender) {
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
}
function getHitChance(hit, dodge) {
  let chance = hit - dodge;
  if (chance >= 100) {
    return 100;
  } else if (chance < 10) {
    return 10;
  }
  return chance;
}