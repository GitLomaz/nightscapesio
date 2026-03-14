const Location = require("./Location.js");
const Library = require("./util/Library.js");
const hash = require("object-hash");
const _ = require("lodash");

class Portal {
  constructor(obj, id) {
    Object.assign(this, obj);
    this.location = new Location(obj.location);
    this.destination = new Location(obj.destination);
    this.teleportTimeouts = [];
    this.id = id;
    const hashObj = {
      id: this.id,
      type: "Portal",
    };
    this.hash = hash(hashObj);
    Library.OBJECTS.PORTALS[this.hash] = this;
  }

  movePlayer(player) {
    let that = this;
    let oldLocation = new Location(player.location);
    this.teleportTimeouts[player.id] = setTimeout(function () {
      player.location = new Location(that.destination);
      player.save();
      Library.GRAPHICS.push({
        type: "hidePlayer",
        location: oldLocation,
        tints: [0x00454a, 0x00757d, 0x008d96],
      });
    }, this.timer);
  }

  exportObj() {
    return {
      location: this.location,
      hash: this.hash,
      id: this.id,
      image: this.image,
      name: this.name,
      text: this.text,
      collectionTimer: this.timer,
    };
  }

  interrupt(player) {
    clearTimeout(this.teleportTimeouts[player.id]);
  }
}

module.exports = Portal;
