class soundController {
  constructor(globalVolume, scene) {
    this.globalVolume = globalVolume;
    this.scene = scene;
    this.library = {};
    this.defaultVolumes = {};
  }

  setGlobalVolume(globalVolume) {
    this.globalVolume = globalVolume;
  }

  addSound(key, volume) {
    this.library[key] = this.scene.sound.add(key, { volume: volume });
    this.defaultVolumes[key] = volume;
  }

  play(key, volume = 1, location) {
    let volumeMod = 1;
    if (location) {
      let dist = Math.hypot(player.x - location.x, player.y - location.y) * 2;
      if (dist > 200 && dist <= 800) {
        volumeMod = 1 - (this.getBaseLog(10, dist) - 2);
      } else if (dist > 800) {
        return;
      }
    }
    if (!this.library[key]) {
      console.log("Sound not in library");
      return;
    }
    this.library[key].volume =
      volume * volumeMod * this.globalVolume * this.defaultVolumes[key];
    if (this.library[key].volume < 0.05) {
      return;
    }
    this.library[key].play();
  }

  walk(x, y) {
    let activeTiles = [];
    _.each(gameSceneObj.map.layers, function (layer) {
      if (layer.name !== "walls") {
        let tile = gameSceneObj.map.getTileAtWorldXY(
          x,
          y,
          undefined,
          undefined,
          layer.name
        );
        if (tile) {
          activeTiles.push(tile.index);
        }
      }
    });

    let tileFloor = [165, 166, 167, 168, 125, 126, 127, 128, 129, 130];
    let stone = [75, 76, 77, 78, 79, 80, 81, 82];
    let sound = null;

    if (activeTiles.filter((x) => tileFloor.includes(x)).length > 0) {
      let sounds = [
        "FootstepFloor1",
        "FootstepFloor2",
        "FootstepFloor3",
        "FootstepFloor4",
      ];
      sound = sounds[Math.floor(Math.random() * sounds.length)];
    } else if (activeTiles.filter((x) => stone.includes(x)).length > 0) {
      let sounds = [
        "FootstepStone1",
        "FootstepStone2",
        "FootstepStone3",
        "FootstepStone4",
      ];
      sound = sounds[Math.floor(Math.random() * sounds.length)];
    } else {
      let sounds = [
        "FootstepStone1",
        "FootstepStone2",
        "FootstepStone3",
        "FootstepStone4",
      ];
      sound = sounds[Math.floor(Math.random() * sounds.length)];
    }
    this.play(sound, undefined, { x: x, y: y });
  }

  getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }
}
