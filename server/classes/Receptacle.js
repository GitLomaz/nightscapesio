const Location = require("./Location.js");
const Equipment = require("./Equipment.js");
const Library = require("./util/Library.js");
const Equipments = require("../../client/data/equipment.js");
const hash = require("object-hash");
const _ = require("lodash");

class Receptacle {
  constructor(obj, id) {
    Object.assign(this, obj);
    this.location = new Location(obj.location);
    this.id = id;
    const hashObj = {
      id: this.id,
      type: "receptacle",
    };
    this.hash = hash(hashObj);
    this.userList = [];
    Library.OBJECTS.RECEPTACLES[this.hash] = this;
  }

  used(player) {
    return this.userList.includes(player.id);
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
        if (that.gold && that.gold.chance > Library.getRandomInt(0, 100)) {
          gold = Library.getRandomInt(that.gold.min, that.gold.max);
        }
        _.each(that.drops, function (drop) {
          let chance = drop.chance;
          if (chance > Library.getRandomInt(0, 100)) {
            player.items[drop.item].increase(drop.quantity);
          }
        });
        _.each(that.equipmentDrops, function (drop) {
          let chance = drop.chance;
          if (chance > Library.getRandomInt(0, 100)) {
            const e = new Equipment(Equipments[drop.item], player.id, "basic");
            player.equipment.push(e);
            Library.NOTICES.push({
              target: player.id,
              type: "itemGain",
              image:
                e.slot !== "weapon"
                  ? "itemGainIconArmor"
                  : "itemGainIconWeapon",
              string: Library.colorDrop(e.name, e.type),
            });
            e.removeTemplate();
          }
        });
        player.gainGold(gold);
        that.userList.push(player.id);
        Library.GRAPHICS.push({
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

module.exports = Receptacle;
