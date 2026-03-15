class CollectableSpawner {
  constructor(obj, id) {
    Object.assign(this, obj);
    this.id = id;
    this.location = new Location(obj.location);
    this.tickCount = 0;
    this.collectableList = [];
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
      console.warn(`Cache miss for collectable spawner: ${cacheKey}`);
    }

    if (this.walkableTiles.length === 0) {
      console.log(this);
    }
    COLLECTABLE_SPAWNERS[this.id] = this;
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
    let totalWeight = this.collectables.reduce((sum, e) => sum + e.weight, 0);
    let se;
    const n = getRandomInt(1, totalWeight);
    this.collectables.forEach((e) => {
      totalWeight -= e.weight;
      if (totalWeight < n && se == null) {
        se = e;
      }
    });

    shuffleArray(this.walkableTiles);
    let loc = clone(this.location);
    for (let i = 0; i < this.walkableTiles.length; i++) {
      loc = new Location(this.walkableTiles[i]);
      if (
        !searchTile(loc, [
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