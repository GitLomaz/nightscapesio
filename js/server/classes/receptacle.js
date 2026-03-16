class Receptacle {
  constructor(obj, id) {
    Object.assign(this, obj);
    this.location = new Location(obj.location);
    this.id = id;
    const hashObj = {
      id: this.id,
      type: "receptacle",
    };
    this.hash = objectHash(hashObj);
    this.userList = [];
    OBJECTS.RECEPTACLES[this.hash] = this;
  }

  used(player) {
    return this.userList.includes(player.id) || player.openedReceptacles.includes(this.hash);
  }

  exportObj() {
    return {
      location: this.location,
      image: this.image,
      usedImage: this.usedImage,
      name: this.name,
      title: this.title || "",
      hash: this.hash,
      radius: this.radius,
      collectionTimer: this.collectionTimer,
    };
  }

  open(player) {
    if (!this.used(player)) {
      let that = this;
      player.collectionTimeout = setTimeout(function () {
        let gold = 0;
        if (that.gold && that.gold.chance > getRandomInt(0, 100)) {
          gold = getRandomInt(that.gold.min, that.gold.max);
        }
        if (that.drops && that.drops.length > 0) {
          that.drops.forEach((drop) => {
            let chance = drop.chance;
            if (chance > getRandomInt(0, 100)) {
              player.items[drop.item].increase(drop.quantity);
            }
          });
        }
        if (that.equipmentDrops && that.equipmentDrops.length > 0) {
          that.equipmentDrops.forEach((drop) => {
            let chance = drop.chance;
            if (chance > getRandomInt(0, 100)) {
              const e = new Equipment(equipment[drop.item], player.id, "basic");
              player.equipment.push(e);
              NOTICES.push({
                target: player.id,
                type: "itemGain",
                image:
                  e.slot !== "weapon"
                    ? "itemGainIconArmor"
                    : "itemGainIconWeapon",
                string: colorDrop(e.name, e.type),
              });
              e.removeTemplate();
            }
          });
        }
        player.gainGold(gold);
        that.userList.push(player.id);
        if (!player.openedReceptacles.includes(that.hash)) {
          player.openedReceptacles.push(that.hash);
          player.save(false, true);
        }
        GRAPHICS.push({
          type: "spawn",
          location: that.location,
          tints: [0x00454a, 0x00757d, 0x008d96],
          player: player.id,
        });
      }, this.collectionTimer);
    }
  }

  interrupt() {}
}
