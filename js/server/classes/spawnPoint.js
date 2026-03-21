class SpawnPoint {
  static walkableTileLibrary = [];
  constructor(obj, id) {
    Object.assign(this, obj);
    this.id = id;
    this.location = new Location(obj.location);
    this.tickCount = getRandomInt(1, 100);
    const cacheKey =
      this.location.map +
      "-" +
      this.location.x +
      "-" +
      this.location.y +
      "-" +
      this.radius;
    
    if (CACHE[cacheKey]) {
      this.walkableTiles = CACHE[cacheKey];
    } else {
      this.walkableTiles = this.location.getWalkableTiles(this.radius);
      console.warn(`Cache miss for spawn point: ${cacheKey}`);
    }

    if (this.walkableTiles.length === 0) {
      console.log(this);
    }
    SPAWN_POINTS[this.id] = this;
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
              Object.values(SOCKET_LIST).forEach((socket) => {
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
          // console.warn("Spawning enemy at spawn point " + this.id);
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
    if (!this.enemies) return;
    let totalWeight = this.enemies.reduce((sum, e) => sum + e.weight, 0);
    let se;
    const n = getRandomInt(1, totalWeight);
    this.enemies.forEach((e) => {
      totalWeight -= e.weight;
      if (totalWeight < n && se == null) {
        se = e;
      }
    });
    shuffleArray(this.walkableTiles);
    let loc = clone(this.walkableTiles[0]);
    for (let i = 0; i < this.walkableTiles.length; i++) {
      loc = new Location(this.walkableTiles[i]);
      if (
        !searchTile(loc, [
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
    if (this.magicMods) {
      [...this.magicMods].sort(() => Math.random() - 0.5).forEach(function (mod) {
        if (mod.chance >= getRandomInt(0, 10000)) {
          magicMod = mod.id;
        }
      });
    }
    this.enemy = new Enemy(
      structuredClone(enemies[se.id]),
      this,
      loc,
      null,
      null,
      magicMod
    );
  }
}
