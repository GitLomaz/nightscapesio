// Global maps object that will be initialized asynchronously
var Maps = {};
var mapsLoaded = false;

// Helper function to load JSON files
async function loadJSON(url) {
  const response = await fetch(url);
  return await response.json();
}

// Helper function to find wall layer
function findWallLayer(mapData) {
  let wallLayer = null;
  mapData.layers.forEach(function (layer) {
    if (layer.name === "walls") {
      wallLayer = layer;
    }
  });
  return wallLayer;
}

// Convert list to matrix
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
  }
  return matrix;
}

// Initialize all maps
async function initializeMaps() {
  try {
    // Load all JSON files
    const [
      Church,
      ChurchCeller,
      UndergroundPassage,
      TheDepths,
      WesternRidges,
      ArchitonOutpost,
      DampCave,
      PassageOutpost
    ] = await Promise.all([
      loadJSON('./json/church.json'),
      loadJSON('./json/churchCeller.json'),
      loadJSON('./json/undergroundPassage.json'),
      loadJSON('./json/theDepths.json'),
      loadJSON('./json/westernRidges.json'),
      loadJSON('./json/architonOutpost.json'),
      loadJSON('./json/dampCave.json'),
      loadJSON('./json/passageOutpost.json')
    ]);

    // Find wall layers
    const wallLayer1 = findWallLayer(Church);
    const wallLayer2 = findWallLayer(ChurchCeller);
    const wallLayer3 = findWallLayer(UndergroundPassage);
    const wallLayer4 = findWallLayer(TheDepths);
    const wallLayer5 = findWallLayer(WesternRidges);
    const wallLayer6 = findWallLayer(ArchitonOutpost);
    const wallLayer7 = findWallLayer(DampCave);
    const wallLayer8 = findWallLayer(PassageOutpost);

    // Convert to matrices
    Church.flat = listToMatrix(wallLayer1.data, Church.width);
    ChurchCeller.flat = listToMatrix(wallLayer2.data, ChurchCeller.width);
    UndergroundPassage.flat = listToMatrix(wallLayer3.data, UndergroundPassage.width);
    TheDepths.flat = listToMatrix(wallLayer4.data, TheDepths.width);
    WesternRidges.flat = listToMatrix(wallLayer5.data, WesternRidges.width);
    ArchitonOutpost.flat = listToMatrix(wallLayer6.data, ArchitonOutpost.width);
    DampCave.flat = listToMatrix(wallLayer7.data, DampCave.width);
    PassageOutpost.flat = listToMatrix(wallLayer8.data, PassageOutpost.width);

    // Populate the global Maps object
    Maps = {
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

    mapsLoaded = true;
    console.log('Maps loaded successfully');
    return Maps;
  } catch (error) {
    console.error('Error loading maps:', error);
    throw error;
  }
}

// Auto-initialize when script loads (returns a promise)
var mapsPromise = initializeMaps();
