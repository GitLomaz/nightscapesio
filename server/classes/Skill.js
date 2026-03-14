const Library = require("./util/Library.js");
const _ = require("lodash");

class Skill {
  constructor(obj, playerId, level = 0) {
    Object.assign(this, obj);
    this.disabled = false;
    this.playerId = playerId;
    this.level = level;
  }

  equip() {}

  unequip() {}

  levelUp() {
    const socket = Library.SOCKET_LIST[this.playerId];
    if (socket && socket.player) {
      const player = socket.player;
      if (this.level !== this.levels && player.stats.skillPoints > 0) {
        this.level++;
        player.stats.skillPoints--;
      }
    }
  }

  consume() {
    const player = Library.SOCKET_LIST[this.playerId].player;
    if (this.disabled || player.mana < this.getCost()) {
      return false;
    } else {
      player.mana = player.mana - this.getCost();
      return true;
    }
  }

  use() {
    const player = Library.SOCKET_LIST[this.playerId].player;
    if (this.disabled || !this.cost || player.mana < this.getCost()) {
      return;
    } else {
      player.mana = player.mana - this.getCost();
    }
    const that = this;
    switch (this.id) {
      case 1:
        const effect = Math.floor(
          this.getValue() * (1 + player.calculatedStats.int / 50)
        );
        player.heal(effect, true);
        setTimeout(function () {
          that.enable();
        }, this.cooldown);
        break;

      default:
        console.log("skill not implamented yet!");
        break;
    }
  }

  enable() {
    this.disabled = false;
  }

  getValue() {
    let min = this.value.base.min + this.value.adder.min * this.level;
    let max = this.value.base.max + this.value.adder.max * this.level;
    return Library.getRandomInt(min, max);
  }

  getCost() {
    return this.cost.base + this.cost.adder * this.level;
  }
}
module.exports = Skill;
