const Library = require("./util/Library.js");
const _ = require("lodash");

class Kill {
  constructor(id, count = 0) {
    this.id = id;
    this.count = count;
  }
}

module.exports = Kill;
