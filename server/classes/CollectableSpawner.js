const Library = require("./util/Library.js");
const Location = require("./Location.js");
const Collectable = require("./Collectable.js");
const collectables = require("../../client/data/collectables.js");
const _ = require("lodash");
const fs = require("fs");

class CollectableSpawner {
  constructor(obj, id) {
    Object.assign(this, obj);
    this.id = id;
    this.location = new Location(obj.location);
    this.tickCount = 0;
    this.collectableList = [];
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
    Library.COLLECTABLE_SPAWNERS[this.id] = this;
  }

  tick() {
    this.tickCount++;
    if (
      this.tickCount % this.respawn == 0 &&
      Object.keys(this.collectableList).length != this.limit
    ) {
      this.spawnCollectable();
    }
  }

  spawnCollectable() {
    let totalWeight = _.sumBy(this.collectables, function (e) {
      return e.weight;
    });
    let se;
    const n = Library.getRandomInt(1, totalWeight);
    _.each(this.collectables, function (e) {
      totalWeight -= e.weight;
      if (totalWeight < n && se == null) {
        se = e;
      }
    });

    Library.shuffleArray(this.walkableTiles);
    let loc = Library.clone(this.location);
    for (let i = 0; i < this.walkableTiles.length; i++) {
      loc = new Location(this.walkableTiles[i]);
      if (
        !Library.searchTile(loc, [
          "collectables",
          "receptacles",
          "npcs",
          "portals",
        ])
      ) {
        break;
      }
    }
    const collectable = new Collectable(collectables[se.id], this, loc);
    this.collectableList[collectable.hash] = collectable;
  }
}

module.exports = CollectableSpawner;
