const Location = require("./Location.js");
const Maps = require("./Maps.js");
const Library = require("./util/Library.js");
const hash = require("object-hash");
const _ = require("lodash");
const { connectLogger } = require("log4js");

let NPCs = [];
_.each(Maps, function (map) {
  try {
    mapNPCs = require("../client/data/maps/" + map.map + "/npcs.js");
    NPCs = NPCs.concat(mapNPCs);
  } catch (error) {}
});

class NPC {
  constructor(obj) {
    Object.assign(this, obj);
    this.location = new Location(obj.location);
    console.log("generating NPC ID: " + this.id);
    const hashObj = {
      id: this.id,
      type: "NPC",
    };
    this.hash = hash(hashObj);
    Library.OBJECTS.NPCS[this.hash] = this;
  }

  getQuestPunctuation(player) {
    let ret = "";
    if (this.type === "quest") {
      let questId = this.getFirstValidQuestId(player);
      if (questId !== false) {
        if (player.quests[questId].status === 0) {
          ret = "?";
        } else {
          if (
            player.quests[questId].requirements[player.quests[questId].step]
              .return
          ) {
            ret = "!";
          }
        }
      }
    }
    return ret;
  }

  getFirstValidQuestId(player) {
    let ret = false;
    _.each(this.questIds, function (questId) {
      if (player.quests[questId].status !== 2) {
        ret = questId;
        return false;
      }
    });
    return ret;
  }

  talk(player) {
    if (this.type === "quest") {
      let questId = this.getFirstValidQuestId(player);
      if (questId !== false) {
        let status = player.quests[questId].status;
        Library.SOCKET_LIST[player.id].emit("promptQuest", {
          status: status,
          quest: player.peekQuest(player.quests[questId]),
        });
      } else {
        Library.SOCKET_LIST[player.id].emit("promptQuest", {
          status: 2,
          quest: { doneText: this.noActions, name: this.name },
        });
      }
    } else if (this.type === "shop") {
      Library.shuffleArray(this.text);
      Library.SOCKET_LIST[player.id].emit("promptShop", {
        items: this.items,
        equipment: this.equipment,
        text: this.text[0],
      });
    }
  }

  sellItem(player, item) {}
}

module.exports = NPC;
