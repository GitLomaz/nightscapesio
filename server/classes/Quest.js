const equipment = require("../../client/data/equipment.js");
const Quests = require("../../client/data/quests.js");
const items = require("../../client/data/items.js");
const Maps = require("./Maps.js");
const Library = require("./util/Library.js");
const _ = require("lodash");
const Equipment = require("./Equipment.js");

let NPCs = [];
_.each(Maps, function (map) {
  try {
    mapNPCs = require("../../client/data/maps/" + map.map + "/npcs.js");
    NPCs = NPCs.concat(mapNPCs);
  } catch (error) {}
});
let sortedNPCs = [];
_.each(NPCs, function (npc) {
  sortedNPCs[npc.id] = npc;
});
NPCs = sortedNPCs;

class Quest {
  // status:
  // 0 - Not started
  // 1 - In Progress
  // 2 - Completed

  constructor(obj, playerId, status = 0, step = 0, completed = 0) {
    Object.assign(this, obj);
    this.playerId = playerId;
    this.status = status;
    this.step = step;
    this.completed = completed;
  }

  setProgress(player) {
    const currentStep = this.requirements[this.step];
    if (currentStep && currentStep.collect) {
      _.each(currentStep.collect, function (k) {
        if (player.items[k.id].quantity > 0) {
          k.progress = player.items[k.id].quantity;
        }
      });
    }
  }

  getRequirementsString() {
    const ret = {};
    ret.name = this.name;
    ret.status = this.status;
    ret.step = this.step;
    ret.requirements = [];
    let currentStep = this.requirements[this.step];
    if (!currentStep) {
      this.reset();
      return ret;
    }
    _.each(currentStep.collect, function (k) {
      if (items[k.id].type === "kill") {
        ret.requirements.push({
          type: "kill",
          name: items[k.id].name,
          count: k.count,
          progress: k.progress || 0,
        });
      } else {
        ret.requirements.push({
          type: "collect",
          name: items[k.id].name,
          count: k.count,
          progress: k.progress || 0,
        });
      }
    });
    _.each(currentStep.talk, function (k) {
      ret.requirements.push({
        type: "talk",
        name: NPCs[k.id].name,
        progress: k.progress || 0,
      });
    });
    _.each(currentStep.return, function (k) {
      ret.requirements.push({
        type: "return",
        name: NPCs[k.id].name,
        progress: k.progress || 0,
      });
    });
    return ret;
  }

  assess() {
    const socket = Library.SOCKET_LIST[this.playerId];
    const player = socket.player;
    let that = this;
    if (this.status == 0) {
      if (this.completeStep("triggers")) {
        if (this.triggers.talk) {
          socket.emit("questPos", {
            text: "Quest Started\n(" + this.name + ")",
            color: "#3792cb",
          });
        } else {
          socket.emit("questPos", {
            text: "Quest Triggered\n(" + this.name + ")",
            color: "#3792cb",
          });
        }
        this.step = 0;
        this.status = 1;
        _.each(player.items, function (item) {
          if (item.quantity > 0) {
            that.action("collect", item.id, item.quantity);
          }
        });
      }
    } else if (this.status == 1) {
      if (this.completeStep()) {
        this.step++;
        if (!this.requirements[this.step]) {
          socket.emit("questPos", {
            text: "Quest Complete\n(" + this.name + ")",
            color: "#006A4E",
          });
          this.awardRewards(player);
          if (!this.repeatable) {
            this.status = 2;
          } else {
            this.reset();
          }
        }
      }
    }
    player.generateQuestStrings();
  }

  completeStep(type = "requirements") {
    let ret = true;
    let currentStep;
    if (type == "requirements") {
      currentStep = this.requirements[this.step];
    } else {
      currentStep = this.triggers;
    }
    _.each(currentStep.kill, function (k) {
      if (!k.progress || k.count != k.progress) {
        ret = false;
      }
    });
    _.each(currentStep.quest, function (k) {
      if (!k.progress || k.count != k.progress) {
        ret = false;
      }
    });
    _.each(currentStep.collect, function (k) {
      if (!k.progress || k.count > k.progress) {
        ret = false;
      }
    });
    _.each(currentStep.talk, function (k) {
      if (!k.progress || k.count != k.progress) {
        ret = false;
      }
    });
    _.each(currentStep.return, function (k) {
      if (!k.progress || k.count != k.progress) {
        ret = false;
      }
    });
    _.each(currentStep.walk, function (k) {
      ret = false;
    });
    return ret;
  }

  action(type, id, quantity = 1) {
    if (this.status === 1) {
      const rec = _.filter(this.requirements[this.step][type], function (r) {
        return r.id == id && (r.progress || 0) < r.count;
      });
      _.each(rec, function (r) {
        if (!r.progress) {
          r.progress = quantity;
        } else {
          r.progress = r.progress + quantity;
        }
      });
      if (rec && rec.length > 0) {
        this.assess();
      }
    } else if (this.status == 0) {
      const rec = _.filter(this.triggers[type], function (r) {
        if (type !== "walk") {
          return r.id == id && (r.progress || 0) < r.count;
        } else {
          return id.x >= r.x1 && id.x <= r.x2 && id.y >= r.y1 && id.y <= r.y2;
        }
      });
      if (type !== "walk") {
      }
      _.each(rec, function (r) {
        if (!r.progress) {
          r.progress = quantity;
        } else {
          r.progress = r.progress + quantity;
        }
      });
      if (rec && rec.length > 0) {
        this.assess();
      }
    }
  }

  awardRewards(player) {
    let rewards = this.rewards;
    if (rewards.gold) {
      player.gainGold(rewards.gold);
    }
    if (rewards.exp) {
      player.gainExp(rewards.exp);
    }
    _.each(rewards.items, function (item) {
      if (item.count > 0) {
        player.items[item.id].increase(item.count, true, false);
      } else {
        player.items[item.id].increase(item.count, false, false);
      }
    });
    _.each(rewards.equipment, function (item) {
      const e = new Equipment(equipment[item], player.id, "questReward");
      player.equipment.push(e);
      Library.NOTICES.push({
        target: player.id,
        type: "itemGain",
        image: e.slot !== "weapon" ? "itemGainIconArmor" : "itemGainIconWeapon",
        string: Library.colorDrop(e.name, e.type),
      });
      e.removeTemplate();
    });
    player.save();
  }

  reset() {
    let playerId = this.playerId;
    const q = _.cloneDeep(Quests[this.id]);
    Object.assign(this, q);
    this.playerId = playerId;
    this.step = 0;
    this.status = 0;
    this.completed++;
  }
}

module.exports = Quest;
