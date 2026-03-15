class Collectable {
  constructor(obj, spawnPoint, loc = null) {
    Object.assign(this, obj);
    this.spawnPoint = spawnPoint;
    this.location = new Location(loc);
    const hashObj = {
      id: this.id,
      spawnPoint: this.spawnPoint.id,
      type: "collectable",
      location: this.location,
    };
    this.collecter = null;
    this.hash = objectHash(hashObj);
    OBJECTS.COLLECTABLES[this.hash] = this;
    GRAPHICS.push({
      type: "spawn",
      location: this.location,
      tints: [0x00454a, 0x00757d, 0x008d96],
    });
  }

  exportObj() {
    return {
      location: this.location,
      image: this.image,
      name: this.name,
      title: this.title || "",
      hash: this.hash,
      radius: this.radius,
      collectionTimer: this.collectionTimer,
    };
  }

  collect(player) {
    this.collecter = player;
    let that = this;
    this.collectionTimeout = setTimeout(function () {
      if (that.drops && that.drops.length > 0) {
        that.drops.forEach((drop) => {
          let chance = drop.chance;
          if (chance > getRandomInt(0, 100)) {
            player.items[drop.item].increase();
          }
        });
      }
      if (that.equipmentDrops && that.equipmentDrops.length > 0) {
        that.questDrops.forEach((drop) => {
          if (player.quests[drop.questId].status === 1) {
            let reqirements =
              player.quests[drop.questId].requirements[
                player.quests[drop.questId].step
              ].collect;
            reqirements.forEach((req) => {
              if (
                req.id === drop.item &&
                player.items[req.id].quantity < (req.count || 0)
              ) {
                let chance = drop.chance;
                if (chance > getRandomInt(0, 100)) {
                  player.items[drop.item].increase();
                }
              }
            });
          }
        });
      }
      delete that.spawnPoint.collectableList[that.hash];
      delete OBJECTS.COLLECTABLES[that.hash];
    }, this.collectionTimer);
  }

  interrupt() {
    clearTimeout(this.collectionTimeout);
    this.collecter = null;
  }
}