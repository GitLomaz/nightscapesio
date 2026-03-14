// IMPORTED RESOURCES
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const Player = require("./classes/Player.js");
const equipment = require("../client/data/equipment.js");
const enemies = require("../client/data/enemies.js");
const Equipment = require("./classes/Equipment.js");
const Library = require("./classes/util/Library.js");
const Creds = require("./classes/util/Creds.js");
const mysql = require("mysql");
const _ = require("lodash");
const SpawnPoint = require("./classes/SpawnPoint.js");

// SERVER AND DB CONFIG
const options = {
  key: fs.readFileSync(
    process.env.NIGHTSCAPE_PRIVATE_KEY_FILE ||
      "/etc/letsencrypt/live/nightscapes.io/privkey.pem"
  ),
  cert: fs.readFileSync(
    process.env.NIGHTSCAPE_PUBLIC_KEY_FILE ||
      "/etc/letsencrypt/live/nightscapes.io/fullchain.pem"
  ),
};
const serv = require("https").Server(options, app);
const conn = mysql.createPool({
  connectionLimit: 10,
  host: Creds.NIGHTSCAPE_DB_HOST,
  user: Creds.NIGHTSCAPE_DB_USER,
  password: Creds.NIGHTSCAPE_DB_PASSWORD,
  database: Creds.NIGHTSCAPE_DB_DATABASE,
});
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

serv.listen(4040);
let io = require("socket.io")(serv, {});
console.log("========== Nightscape Running ==========");

for (let enemyIndex = 0; enemyIndex < enemies.length; ) {
  let p;
  // In localhost console:
  // socket = io(":4040"); tp connect
  // io.sockets.on("connection", function (socket) {
  socketId = 5;
  p = new Player(socketId, null, true);
  p.save = function () {};
  p.stats = {
    strength: 1,
    vitality: 1,
    agility: 1,
    dexterity: 1,
    intelligence: 1,
    points: 0,
    skillPoints: 0,
  };
  let socket = {};
  socket.player = p;
  Library.SOCKET_LIST[socketId] = socket;
  p.setStatusEffectStats();
  p.setEquipmentStats();
  p.calculateStats();
  // p.createOrLoadPlayer();
  p.loaded = true;

  pl = new Player(socketId, null, true);
  pl.save = function () {};
  pl.stats = {
    strength: 1,
    vitality: 1,
    agility: 1,
    dexterity: 1,
    intelligence: 1,
    points: 0,
    skillPoints: 0,
  };
  pl.setStatusEffectStats();
  pl.setEquipmentStats();
  pl.calculateStats();
  // p.createOrLoadPlayer();

  // Main server loop
  let counter = 0;
  if (p && p.loaded) {
    // console.log('loaded: ' + enemyIndex)
    if (enemies[enemyIndex].balanced) {
      let today = new Date();
      let time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      console.log("enemy " + enemies[enemyIndex].id + " balanced:" + time);
      enemyIndex++;
      continue;
    }
    let sp = new SpawnPoint({
      location: { map: "Church", x: 57, y: 95 },
      respawn: 300,
      enemies: [{ id: 13, weight: 100 }],
    });
    let kills = 0;
    let combatLengths = [];
    let killCounts = [];
    let successCount = 0;
    setLevel(pl, enemies[enemyIndex].level);
    setEquipment(pl);
    allocateStats(pl);
    pl.setEquipmentStats();
    pl.calculateStats();
    let health = Library.getRandomInt(
      pl.level * 75 - 70,
      pl.calculatedStats.healthMax * 10
    );
    let damage = Library.getRandomInt(
      pl.level,
      pl.calculatedStats.healthMax / 3
    );
    let speed = Library.getRandomInt(3, 20);
    let hit = Library.getRandomInt(
      pl.calculatedStats.dodge + 30,
      pl.calculatedStats.dodge + 130
    );
    let dodge = Library.getRandomInt(
      pl.calculatedStats.hit - 110,
      pl.calculatedStats.hit - 10
    );
    let def = Library.getRandomInt(0, pl.calculatedStats.attack / 2);
    let armor = Library.getRandomInt(0, 70);

    // let health = 15 //Library.getRandomInt(10, p.calculatedStats.healthMax / 3);
    // let damage = 2 //Library.getRandomInt(1, p.calculatedStats.healthMax / 3);
    // let speed = 24 //Library.getRandomInt(1, 30);
    // let hit = 194 //Library.getRandomInt(150, 230);
    // let dodge = 72 //Library.getRandomInt(50, 150);
    // let def = 2 //Library.getRandomInt(0, 15);
    // let armor = 9 //Library.getRandomInt(0, 60);

    // health: 40,
    // attack: { damage: 1, speed: 15, range: 2, hit: -200 },
    // dodge: 20,
    // defense: {armor: 5, def: 1},

    for (let buildCount = 0; buildCount < 10; buildCount++) {
      // SET PLAYER LEVEL HERE VVV

      // STILL INCREASES THE HEAP SLOWLY
      setLevel(p, enemies[enemyIndex].level);
      setEquipment(p);
      allocateStats(p);
      p.setEquipmentStats();
      p.calculateStats();
      p.location.map = "Church";
      p.location.x = 57;
      p.location.y = 95;
      p.save();

      for (let testCount = 0; testCount < 10; testCount++) {
        p.setEquipmentStats();
        p.calculateStats();
        p.health = p.calculatedStats.healthMax;
        p.dead = false;
        for (let enemyCount = 0; enemyCount < 100; enemyCount++) {
          p.exp = 0;
          Library.GRAPHICS = [];
          Library.NOTICES = [];
          sp.spawnEnemy();
          sp.enemy.maxHealth = health;
          sp.enemy.health = health;
          sp.enemy.attack = {
            damage: damage,
            speed: speed,
            range: 2,
            hit: hit,
          };
          sp.enemy.dodge = dodge;
          sp.enemy.defense = { armor: armor, def: def };
          sp.enemy.experence = 0;

          p.target = sp.enemy;
          p.attacking = true;
          p.attackTickCount = 0;

          for (let index = 0; index < p.level * 100; index++) {
            // console.log('player: ' + p.health + ', enemy: ' + sp.enemy.health)
            sp.enemy.tick();
            p.tick();
            if (!sp.enemy) {
              combatLengths.push(index);
              kills++;
              break;
            }
            if (p.health < 1) {
              break;
            }
            if (index === 99) {
              p.health = 0;
            }
          }
          if (p.health < 1) {
            killCounts.push(enemyCount);
            break;
          }
        }
      }

      let avg1 = combatLengths.length > 0 ? combatLengths[0] : 0;
      if (combatLengths.length > 1) {
        avg1 = combatLengths.reduce((a, b) => a + b) / combatLengths.length;
      }

      let avg2 = killCounts.length > 0 ? killCounts[0] : 0;
      if (killCounts.length > 1) {
        avg2 = killCounts.reduce((a, b) => a + b) / killCounts.length;
      }
      counter++;
      if (avg2 > 7 && avg2 < 12) {
        // Adjust difficulty here
        successCount++;
      }

      if (successCount > 9) {
        let hitP = Library.getHitChance(hit, p.calculatedStats.dodge);
        let dodgeP = Library.getHitChance(p.calculatedStats.hit, dodge);

        // console.log(
        //   "well, it took " +
        //     counter +
        //     " tries, but it found an enemy a level " +
        //     p.level +
        //     " person should fight:"
        // );
        enemies[enemyIndex].health = health;
        enemies[enemyIndex].attack.damage = damage;
        enemies[enemyIndex].attack.speed = speed;
        enemies[enemyIndex].attack.hit = hit;
        enemies[enemyIndex].dodge = dodge;
        enemies[enemyIndex].defense.armor = armor;
        enemies[enemyIndex].defense.def = def;
        enemies[enemyIndex].balanced = true;
        // console.log("health: " + health);
        // console.log("damage: " + damage);
        // console.log("speed: " + speed);
        // console.log("hit: " + hit + " (chance to hit player: " + hitP + "%)");
        // console.log(
        //   "dodge: " + dodge + " (chance for player to hit: " + dodgeP + "%)"
        // );
        // console.log("def: " + def);
        // console.log("armor: " + armor);
        // console.log(
        //   "player died after killing on average " +
        //     Math.floor(avg2 * 10) / 10 +
        //     ", each combat took on ave: " +
        //     Math.floor(avg1) / 10 +
        //     " seconds."
        // );
        // console.log("=============================================");
        console.log(enemies[enemyIndex]);
        console.log(",");
      }
    }
  }
}
console.log("DONE!");
console.log(enemies);

function setEquipment(p) {
  _.each(p.equipment, function (e) {
    if (e.equipped && e.id !== -1) {
      p.unequipItem(e.id);
    }
    if (e.id !== -1) {
      p.sellEquipment(e.id, false, true);
    }
  });

  let filtered = _.filter(equipment, function (e) {
    return e.level <= p.level + 4 && e.drop > 0;
  });
  let slots = [
    "helm",
    "armor",
    "weapon",
    "offhand",
    "glove",
    "boot",
    "accessory",
    "accessory",
  ];
  let sorted = _.orderBy(filtered, ["level"], ["desc"]);
  _.each(sorted, function (e) {
    let d = _.cloneDeep(equipment[e.id]);
    let eq = new Equipment(d, p.id, "new", 5); // set gear quality here
    index = slots.indexOf(eq.slot);
    if (index > -1) {
      slots.splice(index, 1);

      p.equipment.push(eq);
      p.equipItem(eq.id);
    }
  });
  Library.GRAPHICS = [];
  Library.NOTICES = [];
}

function setLevel(p, level) {
  p.level = 1;
  p.exp = 0;
  p.stats = {
    strength: 1,
    vitality: 1,
    agility: 1,
    dexterity: 1,
    intelligence: 1,
    points: 0,
    skillPoints: 0,
  };
  for (let i = 0; i < level - 1; i++) {
    p.levelUp();
    p.exp = 0;
  }
  Library.GRAPHICS = [];
  Library.NOTICES = [];
}

function allocateStats(p) {
  let ableToAlocate = true;
  do {
    roll = Library.getRandomInt(0, 180);
    if (roll < 10) {
      p.allocateStat("intPlus");
    } else if (roll < 40) {
      p.allocateStat("vitPlus");
    } else if (roll < 80) {
      p.allocateStat("agiPlus");
    } else if (roll < 120) {
      p.allocateStat("dexPlus");
    } else {
      p.allocateStat("strPlus");
    }
    ableToAlocate =
      p.canAffordStat("strength") ||
      p.canAffordStat("intelligence") ||
      p.canAffordStat("vitality") ||
      p.canAffordStat("agility") ||
      p.canAffordStat("dexterity");
  } while (ableToAlocate);
}

function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
}
