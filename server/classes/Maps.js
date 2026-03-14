const Church = require("../../client/json/church.json");
const ChurchCeller = require("../../client/json/churchCeller.json");
const UndergroundPassage = require("../../client/json/undergroundPassage.json");
const TheDepths = require("../../client/json/theDepths.json");
const WesternRidges = require("../../client/json/westernRidges.json");
const ArchitonOutpost = require("../../client/json/architonOutpost.json");
const DampCave = require("../../client/json/dampCave.json");
const PassageOutpost = require("../../client/json/passageOutpost.json");
const _ = require("lodash");

wallLayer1 = "";

_.each(Church.layers, function (layer) {
  if (layer.name === "walls") {
    wallLayer1 = layer;
  }
});

wallLayer2 = "";

_.each(ChurchCeller.layers, function (layer) {
  if (layer.name === "walls") {
    wallLayer2 = layer;
  }
});

wallLayer3 = "";

_.each(UndergroundPassage.layers, function (layer) {
  if (layer.name === "walls") {
    wallLayer3 = layer;
  }
});

wallLayer4 = "";

_.each(TheDepths.layers, function (layer) {
  if (layer.name === "walls") {
    wallLayer4 = layer;
  }
});

wallLayer5 = "";

_.each(WesternRidges.layers, function (layer) {
  if (layer.name === "walls") {
    wallLayer5 = layer;
  }
});

wallLayer6 = "";

_.each(ArchitonOutpost.layers, function (layer) {
  if (layer.name === "walls") {
    wallLayer6 = layer;
  }
});

wallLayer7 = "";

_.each(DampCave.layers, function (layer) {
  if (layer.name === "walls") {
    wallLayer7 = layer;
  }
});

wallLayer8 = "";

_.each(PassageOutpost.layers, function (layer) {
  if (layer.name === "walls") {
    wallLayer8 = layer;
  }
});

Church.flat = listToMatrix(wallLayer1.data, Church.width);
ChurchCeller.flat = listToMatrix(wallLayer2.data, ChurchCeller.width);
UndergroundPassage.flat = listToMatrix(
  wallLayer3.data,
  UndergroundPassage.width
);
TheDepths.flat = listToMatrix(wallLayer4.data, TheDepths.width);
WesternRidges.flat = listToMatrix(wallLayer5.data, WesternRidges.width);
ArchitonOutpost.flat = listToMatrix(wallLayer6.data, ArchitonOutpost.width);
DampCave.flat = listToMatrix(wallLayer7.data, DampCave.width);
PassageOutpost.flat = listToMatrix(wallLayer8.data, PassageOutpost.width);

function listToMatrix(list, elementsPerSubArray) {
  let matrix = [],
    i,
    k;
  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }
    if (list[i] === 2) {
      matrix[k].push(1);
    } else {
      matrix[k].push(0);
    }
    list[i];
  }
  return matrix;
}

module.exports = {
  Church: {
    x: Church.width,
    y: Church.height,
    map: "church",
    layout: Church.flat,
    spawn: { x: 57, y: 93 },
  },
  ChurchCeller: {
    x: ChurchCeller.width,
    y: ChurchCeller.height,
    map: "churchCeller",
    layout: ChurchCeller.flat,
    spawn: { x: 4, y: 4 },
  },
  UndergroundPassage: {
    x: UndergroundPassage.width,
    y: UndergroundPassage.height,
    map: "undergroundPassage",
    layout: UndergroundPassage.flat,
    spawn: { x: 137, y: 8 },
  },
  TheDepths: {
    x: TheDepths.width,
    y: TheDepths.height,
    map: "theDepths",
    layout: TheDepths.flat,
    spawn: { x: 137, y: 8 },
  },
  WesternRidges: {
    x: WesternRidges.width,
    y: WesternRidges.height,
    map: "westernRidges",
    layout: WesternRidges.flat,
    spawn: { x: 137, y: 8 },
  },
  ArchitonOutpost: {
    x: ArchitonOutpost.width,
    y: ArchitonOutpost.height,
    map: "architonOutpost",
    layout: ArchitonOutpost.flat,
    spawn: { x: 137, y: 8 },
  },
  DampCave: {
    x: DampCave.width,
    y: DampCave.height,
    map: "dampCave",
    layout: DampCave.flat,
    spawn: { x: 137, y: 8 },
  },
  PassageOutpost: {
    x: PassageOutpost.width,
    y: PassageOutpost.height,
    map: "passageOutpost",
    layout: PassageOutpost.flat,
    spawn: { x: 137, y: 8 },
  },
};
