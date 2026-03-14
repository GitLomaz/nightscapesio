const Enemy = require("./Enemy.js");
const Location = require("./Location.js");
const Library = require("./util/Library.js");
const enemies = require("../../client/data/enemies.js");
const _ = require("lodash");
const fs = require("fs");

class SpawnPoint {
  static walkableTileLibrary = [];
  constructor(obj, id) {
    Object.assign(this, obj);
    this.id = id;
    this.location = new Location(obj.location);
    this.tickCount = Library.getRandomInt(1, 100);
    let fileKey =
      "./cache/sp-" +
      this.location.map +
      "-" +
      this.location.x +
      "-" +
      this.location.y +
      "-" +
      this.radius +
      ".txt";
    if (!fs.existsSync(fileKey)) {
      this.walkableTiles = this.location.getWalkableTiles(this.radius);
      fs.writeFileSync(fileKey, JSON.stringify(this.walkableTiles));
    } else {
      this.walkableTiles = JSON.parse(fs.readFileSync(fileKey));
    }

    if (this.walkableTiles.length === 0) {
      console.log(this);
    }
    Library.SPAWN_POINTS[this.id] = this;
  }

  tick() {
    this.tickCount++;
    if (!this.enemy) {
      if (!this.spawnCounter || this.spawnCounter <= 0) {
        let spawnEnemy = false;
        if (this.condition) {
          switch (this.condition.type) {
            case "eval":
              spawnEnemy = eval(this.condition);
              break;
            case "location":
              let that = this;
              _.each(Library.SOCKET_LIST, function (socket) {
                if (
                  socket.player &&
                  socket.player.location.getDistance(that.condition.location) <
                    that.condition.radius
                ) {
                  spawnEnemy = true;
                }
              });
              break;
            default:
              break;
          }
        } else {
          spawnEnemy = true;
        }
        if (spawnEnemy) {
          this.spawnEnemy();
          this.spawnCounter = this.respawn;
        }
      } else {
        this.spawnCounter--;
      }
    } else {
      this.enemy.tick();
    }
  }

  spawnEnemy() {
    let totalWeight = _.sumBy(this.enemies, function (e) {
      return e.weight;
    });
    let se;
    const n = Library.getRandomInt(1, totalWeight);
    _.each(this.enemies, function (e) {
      totalWeight -= e.weight;
      if (totalWeight < n && se == null) {
        se = e;
      }
    });
    Library.shuffleArray(this.walkableTiles);
    let loc = Library.clone(this.walkableTiles[0]);
    for (let i = 0; i < this.walkableTiles.length; i++) {
      loc = new Location(this.walkableTiles[i]);
      if (
        !Library.searchTile(loc, [
          "collectables",
          "enemies",
          "npcs",
          "receptacles",
        ])
      ) {
        break;
      }
    }
    let magicMod = null;
    _.each(_.shuffle(this.magicMods), function (mod) {
      if (mod.chance >= Library.getRandomInt(0, 10000)) {
        magicMod = mod.id;
      }
    });
    this.enemy = new Enemy(
      _.cloneDeep(enemies[se.id]),
      this,
      loc,
      null,
      null,
      magicMod
    );
  }
}

module.exports = SpawnPoint;
