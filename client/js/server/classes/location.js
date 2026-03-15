// const Maps = require("./Maps.js");
// const Library = require("./util/Library.js");

class Location {
  constructor(obj) {
    Object.assign(this, obj);
  }

  getDistance(location) {
    if (this.map == location.map) {
      let deltaX = Math.abs(this.x - location.x);
      let deltaY = Math.abs(this.y - location.y);
      return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }
    return 9999;
  }

  isWalkable() {
    try {
      return !Maps[this.map].layout[this.y][this.x];
    } catch (error) {
      return false;
    }
  }

  isConnected(location) {
    if (
      this.x >= Maps[this.map].x ||
      this.x < 0 ||
      this.y >= Maps[this.map].y ||
      this.y < 0 ||
      this.map != location.map
    ) {
      return false;
    }
    let grid = new PF.Grid(Maps[this.map].layout);
    let finder = new PF.AStarFinder({
      allowDiagonal: false,
    });

    let path = finder.findPath(this.x, this.y, location.x, location.y, grid);
    return path.length > 0;
  }

  countSteps(location) {
    if (
      this.x >= Maps[this.map].x ||
      this.x < 0 ||
      this.y >= Maps[this.map].y ||
      this.y < 0 ||
      this.map != location.map
    ) {
      return false;
    }
    let grid = new PF.Grid(Maps[this.map].layout);
    let finder = new PF.AStarFinder({
      allowDiagonal: true,
    });

    let path = finder.findPath(this.x, this.y, location.x, location.y, grid);
    return path.length;
  }

  getWalkableTiles(radius = 1) {
    let walkableTiles = [];
    for (let x = this.x - radius; x <= this.x + radius; x++) {
      for (let y = this.y - radius; y <= this.y + radius; y++) {
        let loc = new Location({ x: x, y: y, map: this.map });
        if (loc.isWalkable() && loc.isConnected(this)) {
          const dist = loc.countSteps(this);
          if (dist <= radius + 1 && !searchTile(loc, ["receptacles"])) {
            walkableTiles.push(loc);
          }
        }
      }
    }
    return walkableTiles;
  }

  readable() {
    return "Map:'" + this.map + "', x:" + this.x + ", Y:" + this.y;
  }
}
