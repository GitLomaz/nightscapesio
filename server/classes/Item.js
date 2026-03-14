const Library = require("./util/Library.js");
const equipment = require("../../client/data/equipment.js");
const Equipment = require("./Equipment.js");
const StatusEffect = require("./StatusEffect.js");
const _ = require("lodash");
const statusEffects = require("../../client/data/statusEffects.js");

class Item {
  constructor(obj, playerId, quantity = -1) {
    Object.assign(this, obj);
    this.playerId = playerId;
    this.quantity = quantity;
    this.disabled = false;
  }

  increase(quantity = 1, notify = true, assess = true) {
    if (this.type === "kill") {
      notify = false;
    } else if (this.quantity <= 0) {
      this.newItem = true;
    }
    const socket = Library.SOCKET_LIST[this.playerId];
    if (socket && socket.player) {
      const player = socket.player;
      if (this.quantity === -1) {
        this.quantity = quantity;
      } else {
        this.quantity = this.quantity + quantity;
      }
      if (assess) {
        _.each(player.getQuests(), function (q) {
          q.setProgress(player);
          q.assess();
        });
      }
      if (notify) {
        let string = quantity + "x";
        if (quantity > 1) {
          string = string + this.gainMany;
        } else {
          string = string + this.gainOne;
        }
        Library.NOTICES.push({
          target: this.playerId,
          type: "itemGain",
          image: this.dropImage,
          string: string,
        });
      }
    }
  }

  viewItem() {
    this.newItem = false;
  }

  consume() {
    if (this.quantity >= 1 && !this.disabled) {
      this.quantity--;
      const that = this;
      setTimeout(function () {
        that.enable();
      }, this.cooldown);
      Library.SOCKET_LIST[this.playerId].emit("disableItem", { id: that.id });
      return true;
    } else {
      return false;
    }
  }

  sell(qty) {
    if (this.quantity >= qty && !this.disabled) {
      this.quantity = this.quantity - qty;
      Library.NOTICES.push({
        target: this.playerId,
        type: "itemGain",
        image: "itemGainIconGold",
        string:
          Library.numberWithCommas(Math.floor(this.value / 11) * qty) +
          " Gold ",
      });
    }
  }

  use() {
    if (this.quantity >= 1 && !this.disabled) {
      const player = Library.SOCKET_LIST[this.playerId].player;
      const that = this;
      let effect = 0;
      this.quantity--;
      let potionModifier = 1 + player.skills[2].getValue() / 100;
      switch (this.useType) {
        case 1:
          // Heal
          effect = Math.floor(
            Library.getRandomInt(this.useValueMin, this.useValueMax) *
              (1 + (player.calculatedStats.vit / 50) * potionModifier)
          );
          player.heal(effect, true);
          Library.GRAPHICS.push({
            type: "useItem",
            location: player.location,
          });
          break;
        case 2:
          // Mana
          effect = Math.floor(
            Library.getRandomInt(this.useValueMin, this.useValueMax) *
              (1 + (player.calculatedStats.int / 50) * potionModifier)
          );
          player.restore(effect, true);
          Library.GRAPHICS.push({
            type: "useItem",
            location: player.location,
          });
          break;
        case 3:
          // gift box
          if (this.items) {
            let itemCount = Library.getRandomInt(
              this.items.count.min,
              this.items.count.max
            );
            let items = _.cloneDeep(this.items.item);
            Library.shuffleArray(items);
            for (let i = 0; i < itemCount; i++) {
              if (items[i].type === "item") {
                player.items[items[i].id].increase(items[i].count, true, false);
              } else {
                const d = _.cloneDeep(equipment[items[i].id]);
                const e = new Equipment(d, player.id, "new", items[i].rarity);
                player.equipment.push(e);
                Library.NOTICES.push({
                  target: player.id,
                  type: "itemGain",
                  image:
                    e.slot !== "weapon"
                      ? "itemGainIconArmor"
                      : "itemGainIconWeapon",
                  string: Library.colorDrop(e.gainOne, e.type),
                });
                e.removeTemplate();
              }
            }
          }
          break;
        case 4:
          // remove status effects
          _.each(that.useValues, function (value) {
            if (player.statusEffects[value]) {
              player.statusEffects[value].duration = 0;
            }
          });
          if ([24, 33].includes(this.id)) {
            Library.GRAPHICS.push({
              type: "remedy",
              location: player.location,
            });
          } else {
            Library.GRAPHICS.push({
              type: "useItem",
              location: player.location,
            });
          }
          break;
        case 5:
          // trigger status effect
          const now = new Date();
          const secondsSinceEpoch = Math.round(now.getTime() / 1000);
          _.each(that.useEffects, function (effect) {
            if (
              player.statusEffects[effect.id] &&
              player.statusEffects[effect.id].duration <= that.useDuration
            ) {
              player.statusEffects[effect.id].duration = that.useDuration;
            } else {
              const e = _.cloneDeep(statusEffects[effect.id]);
              player.statusEffects[effect.id] = new StatusEffect(
                Object.assign(e, {
                  start: secondsSinceEpoch,
                  duration: effect.duration,
                }),
                player.id
              );
            }
          });
          if ([27, 28].includes(this.id)) {
            Library.GRAPHICS.push({
              type: "poison",
              location: player.location,
            });
          } else {
            Library.GRAPHICS.push({
              type: "useItem",
              location: player.location,
            });
          }
          player.setStatusEffectStats();
          break;
        default:
          console.log("item not added yet: " + this.useType);
          break;
      }
      this.disabled = true;
      setTimeout(function () {
        that.enable();
      }, this.cooldown);
    }
  }
  enable() {
    this.disabled = false;
  }
}
module.exports = Item;
