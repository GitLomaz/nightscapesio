var game, socket, playerData;

let TILE_SIZE = 32;
let GAME_WIDTH = 1280;
let GAME_HEIGHT = 720;

let gameSceneObj;
let menuSceneObj;

let walkInterval = null;

let player = {};
player.zone = "";

let objects = {};
objects.players = {};
objects.npcs = {};
objects.enemies = {};
objects.collectables = {};
objects.receptacles = {};
objects.portals = {};

let textQueue = [];
let titleDisplaying = false;
let disconnectPanel;
let collectionPanel;
let collectionGrad;
let menuContainer;
let tooltip;
let windowFocused = true;
let currentHover = false;

let queuedAction = null;

let protips = [
  "Check an enemy's level before deciding if you want to attack em!",
  "Having difficulty with an enemy? maybe farm some better gear from a lower level zone!",
  "Fighting enemies with other players can significantly reduce your risk of death.",
  "Running away from enemies can often be safer than fighting them, when trying to conserve health.",
  "Use potions liberally for more difficult fights, potions are easier to accrue than they seem initially.",
  "Pay close attention to equipment drops, an upgrade could be around the corner!",
  "Not all mushrooms are healthy.",
  "Don't stand too close to a fire totem unless you want to be cooked alive.",
  "Some quests are repeatable.",
  "Have you visited the local shops? there can be items you can't find elswhere there.",
  "Keep an eye on beholders.",
];

let showProtips = true;

let styles = [];
styles["tags"] = { font: "16px tf", fill: "#DCDCDC", align: "center" };
styles["targetPanel"] = { font: "14px tf", fill: "#DCDCDC", align: "center" };
styles["adminTags"] = { font: "16px tf", fill: "#D4AF39", align: "center" };
styles["supportTags"] = { font: "16px tf", fill: "#228C22", align: "center" };
styles["quests"] = { font: "16px tf", fill: "#DCDCDC", align: "left" };
styles["level"] = { font: "24px tf", fill: "#DCDCDC", align: "center" };
styles["enemyDamage"] = { font: "22px tf", fill: "#B3000C", align: "center" };
styles["damage"] = { font: "22px tf", fill: "#f7f7f7", align: "center" };
styles["heal"] = { font: "22px tf", fill: "#66CD00", align: "center" };
styles["restore"] = { font: "22px tf", fill: "#3895D3", align: "center" };
styles["NPC"] = { font: "28px tf", fill: "#0080ff", align: "center" };
styles["hotkey"] = { font: "14px tf", fill: "#2C7CFF", align: "left" };
styles["titles"] = {
  font: "36px tf",
  fill: "#DCDCDC",
  align: "center",
  strokeThickness: 3,
};

let zoneNames = [];
zoneNames["Church"] = "Church";
zoneNames["ChurchCeller"] = "Church Cellar";
zoneNames["UndergroundPassage"] = "Church Caves";
zoneNames["TheDepths"] = "The Depths";
zoneNames["WesternRidges"] = "The Western Ridges";
zoneNames["ArchitonOutpost"] = "Architon Outpost";
zoneNames["DampCave"] = "Damp Cave";
zoneNames["PassageOutpost"] = "Passage Outpost";

let gameTick = 0;
let walkCells = [];
let map;

let group5;
let group4;
let group3;
let group2;
let group1;

let statusBarL;
let statusBarM;
let statusBarR;
let targetPanel;
let firstFrame = true;
let questText;
let questBG;
let particles;

let shadowCounter = 0;
let targetSprite;

let inventoryMessageTimeout;
let registerMessageTimeout;

let shopObject;

// http://phaser.io/examples/v3/view/tweens/ease-equations

let tweenList = [
  "Circ.easeIn",
  "Circ.easeOut",
  "Circ.easeInOut",
  "Cubic.easeIn",
  "Cubic.easeOut",
  "Cubic.easeInOut",
  "Linear",
  "Linear",
  "Linear",
  "Linear",
  "Linear",
];

// No longer using URL params for auth/character selection
// Characters are now auto-created and stored in localStorage
// let params = new URLSearchParams(window.location.search);
// let token = params.get("token");
// let char = params.get("id");

class gameScene extends Phaser.Scene {
  constructor() {
    super({ key: "gameScene", active: true });
  }

  preload() {
    gameSceneObj = game.scene.getScene("gameScene");
    this.load.tilemapTiledJSON("Church", "./json/church.json");
    this.load.tilemapTiledJSON("ChurchCeller", "./json/churchCeller.json");
    this.load.tilemapTiledJSON(
      "UndergroundPassage",
      "./json/undergroundPassage.json"
    );
    this.load.tilemapTiledJSON("TheDepths", "./json/theDepths.json");
    this.load.tilemapTiledJSON("WesternRidges", "./json/westernRidges.json");
    this.load.tilemapTiledJSON(
      "ArchitonOutpost",
      "./json/architonOutpost.json"
    );
    this.load.tilemapTiledJSON("DampCave", "./json/dampCave.json");
    this.load.tilemapTiledJSON("PassageOutpost", "./json/passageOutpost.json");

    this.load.audio("Church", ["audio/church.mp3"]);
    this.load.audio("ChurchCeller", ["audio/church.mp3"]);
    this.load.audio("TheDepths", ["audio/church.mp3"]);
    this.load.audio("ArchitonOutpost", ["audio/church.mp3"]);
    this.load.audio("UndergroundPassage", ["audio/church.mp3"]);
    this.load.audio("WesternRidges", ["audio/church.mp3"]);
    this.load.audio("DampCave", ["audio/church.mp3"]);
    this.load.audio("PassageOutpost", ["audio/church.mp3"]);

    this.load.audio("FootstepFloor1", ["audio/sounds/FootstepFloor1.mp3"]);
    this.load.audio("FootstepFloor2", ["audio/sounds/FootstepFloor2.mp3"]);
    this.load.audio("FootstepFloor3", ["audio/sounds/FootstepFloor3.mp3"]);
    this.load.audio("FootstepFloor4", ["audio/sounds/FootstepFloor4.mp3"]);
    this.load.audio("FootstepStone1", ["audio/sounds/FootstepStone1.mp3"]);
    this.load.audio("FootstepStone2", ["audio/sounds/FootstepStone2.mp3"]);
    this.load.audio("FootstepStone3", ["audio/sounds/FootstepStone3.mp3"]);
    this.load.audio("FootstepStone4", ["audio/sounds/FootstepStone3.mp3"]);
    this.load.audio("Thunder1", ["audio/sounds/Thunder1.mp3"]);
    this.load.audio("Thunder2", ["audio/sounds/Thunder2.mp3"]);
    this.load.audio("Thunder3", ["audio/sounds/Thunder3.mp3"]);
    this.load.audio("Thunder4", ["audio/sounds/Thunder4.mp3"]);

    // Random junk
    this.load.spritesheet("slash1", "images/slash1.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("slash2", "images/slash2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("torch", "images/sprites/objects/torch.png", {
      frameWidth: 34,
      frameHeight: 34,
    });
    this.load.spritesheet("campfire", "images/sprites/objects/campfire.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("knight", "images/sprites/players/knight.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("assassin", "images/sprites/players/assassin.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("fighter", "images/sprites/players/fighter.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("wizard", "images/sprites/players/wizard.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image("ghost", "./images/sprites/objects/ghost.png");
    this.load.image("grave", "./images/sprites/objects/grave.png");
    this.load.image("flower1", "./images/sprites/objects/flower1.png");
    this.load.image("flower2", "./images/sprites/objects/flower2.png");
    this.load.image("blackChest", "./images/sprites/objects/blackChest.png");
    this.load.image("blackChest1", "./images/sprites/objects/blackChest1.png");
    this.load.image("tiles", "./images/mapTiles/tiles-ex.png");
    this.load.image("walls", "./images/mapTiles/walls-ex.png");
    this.load.image("blank", "./images/blank.png");
    this.load.image("empty", "./images/empty.png");

    // Enemies
    let that = this;
    _.each(enemies, function (enemy) {
      _.each(enemy.image, function (image) {
        that.load.image(
          image,
          "./images/sprites/enemies/monster_" + image + ".png"
        );
      });
    });

    // Collectables
    _.each(collectables, function (collectable) {
      that.load.image(
        collectable.image,
        "./images/sprites/objects/" + collectable.image + ".png"
      );
    });

    // Portals
    _.each(images, function (image) {
      that.load.image(image.image, image.path);
    });

    // More random junk
    this.load.image("selecter", "./images/selecter.png");
    this.load.image("pixel1", "./images/pixel1.png");
    this.load.image("pixel2", "./images/pixel2.png");
    this.load.image("pixel3", "./images/pixel3.png");
    this.load.image("rain", "./images/rain.png");
    this.load.image("plus", "./images/plus.png");
  }

  create() {
    this.sound.pauseOnBlur = false;
    map = this.make.tilemap({ key: playerData.location.map });
    this.map = map;
    let tiles = map.addTilesetImage("tiles", "tiles", 32, 32, 1, 2);
    let walls = map.addTilesetImage("walls", "walls", 32, 32, 1, 2);
    map.createStaticLayer("walls", walls, 0, 0);
    this.music = this.sound.add(playerData.location.map, {
      volume: parseInt($("#musicVol").val()) / 100,
      loop: true,
    });
    this.music.play();

    this.soundController = new soundController(
      parseInt($("#sfxVol").val()) / 100,
      this
    );
    this.soundController.addSound("FootstepFloor1", 0.05);
    this.soundController.addSound("FootstepFloor2", 0.05);
    this.soundController.addSound("FootstepFloor3", 0.05);
    this.soundController.addSound("FootstepFloor4", 0.05);
    this.soundController.addSound("FootstepStone1", 0.05);
    this.soundController.addSound("FootstepStone2", 0.05);
    this.soundController.addSound("FootstepStone3", 0.05);
    this.soundController.addSound("FootstepStone4", 0.05);
    this.soundController.addSound("Thunder1", 0.15);
    this.soundController.addSound("Thunder2", 0.15);
    this.soundController.addSound("Thunder3", 0.15);
    this.soundController.addSound("Thunder4", 0.15);

    _.each(map.layers, function (layer) {
      if (layer.name !== "walls") {
        map.createStaticLayer(layer.name, tiles, 0, 0);
      }
    });

    this.input.on("pointerdown", function (pointer) {
      hidePanels();
      targetSprite.visible = false;
      if (player.target) {
        player.target = null;
        hidetargetPanel();
        socket.emit("forgetTarget");
      } else {
        socket.emit("pushLocation", {
          x: Math.floor(pointer.worldX / TILE_SIZE),
          y: Math.floor(pointer.worldY / TILE_SIZE),
        });
        if (walkInterval === null) {
          walkInterval = setInterval(function () {
            if (pointer.isDown) {
              socket.emit("pushLocation", {
                x: Math.floor(pointer.worldX / TILE_SIZE),
                y: Math.floor(pointer.worldY / TILE_SIZE),
              });
            } else {
              clearInterval(walkInterval);
              walkInterval = null;
            }
          }, 100);
        }
      }
      $(".queued").removeClass("queued");
    });

    this.input.on("gameobjectdown", targetObject);

    group5 = this.add.group(); // collectables
    group4 = this.add.group(); // enemies
    group3 = this.add.group(); // other players
    group2 = this.add.group(); // player
    group1 = this.add.group(); // animations and such

    player = this.add.container(300, 100);
    player.setDepth(1);
    player.sprite = this.add.sprite(0, 0, playerData.image);
    player.add(player.sprite);
    group2.add(player);
    player.moves = [];
    player.image = playerData.image;
    player.id = playerData.id;
    player.hash = playerData.hash;
    player.health = playerData.health;
    player.mana = playerData.mana;
    player.exp = playerData.exp;
    player.healthMax = playerData.healthMax;
    player.manaMax = playerData.manaMax;
    player.expMax = playerData.expMax;
    player.level = playerData.level;
    player.tag = playerData.tag;
    player.x = playerData.location.x * TILE_SIZE + TILE_SIZE / 2;
    player.y = playerData.location.y * TILE_SIZE + TILE_SIZE / 2;
    player.name = playerData.name;
    player.type = "players";
    objects.players[player.hash] = player;

    this.cameras.main.startFollow(player, false, 0.06, 0.06);
    this.cameras.main.setDeadzone(15, 15);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    walkCells = [];
    for (let i = 0; i < 50; i++) {
      let walkCell = this.add.sprite(300, 100, "blank");
      walkCell.setOrigin(0.5, 0.5);
      walkCells.push(walkCell);
    }

    this.anims.create({
      key: "slash1",
      frames: this.anims.generateFrameNumbers("slash1"),
      frameRate: 20,
      repeat: 0,
    });

    this.anims.create({
      key: "slash2",
      frames: this.anims.generateFrameNumbers("slash2"),
      frameRate: 20,
      repeat: 0,
    });

    particles = this.add.particles("pixel2");
    addGameSockets();

    this.anims.create({
      key: "burn",
      frames: this.anims.generateFrameNumbers("torch"),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "campfire",
      frames: this.anims.generateFrameNumbers("campfire"),
      frameRate: 10,
      repeat: -1,
    });

    targetSprite = this.add.sprite(0, 0, "selecter");
    targetSprite.visible = false;
    targetSprite.flashTween = this.tweens.add({
      targets: targetSprite,
      alpha: 0.6,
      duration: 1000,
      ease: "Linear",
      repeat: -1,
      yoyo: true,
    });
  }

  update() {
    gameTick++;
    if (firstFrame) {
      socket.emit("loaded");
      let text = this.add.text(20, 18, player.name, styles[player.tag]);
      text.y = -35;
      text.x = 0;
      text.setOrigin(0.5, 0);
      player.add(text);
      spawnAnimation(
        {
          x: player.x,
          y: player.y,
        },
        [0x1338be, 0x48aaad, 0x0492c2]
      );
      if ($("#chkProtips").hasClass("selected") && showProtips) {
        showProtip();
        showProtips = false;
      }

      firstFrame = false;
    }

    if (textQueue.length > 0 && !titleDisplaying) {
      flyTitle();
    }

    if (gameTick % 4 == 0 && player.collecting && player.target) {
      let x = Phaser.Math.Between(player.target.x - 15, player.target.x + 15);
      let y = Phaser.Math.Between(player.target.y - 15, player.target.y + 15);
      let image = "pixel2";
      let at = gameSceneObj.add.sprite(x, y, image);
      let tints = [0x00454a, 0x00757d, 0x008d96];
      at.tint = tints[Phaser.Math.Between(0, 2)];
      at.downTween = gameSceneObj.tweens.add({
        targets: at,
        y: y - 45,
        alpha: 0.2,
        duration: 500,
        ease: "Cubic.easeIn",
        onComplete: function () {
          this.targets[0].destroy();
        },
      });
      group5.add(at);
    }

    if (gameTick % 8 === 0 && windowFocused) {
      shadowCounter++;
      if (shadowCounter > 2) {
        shadowCounter = 0;
      }

      let textBoxes = _.find(map.objects, function (obj) {
        return obj.name == "textBoxes";
      });
      let lights = _.find(map.objects, function (obj) {
        return obj.name == "lights";
      });
      let pixels = _.find(map.objects, function (obj) {
        return obj.name == "pixels";
      });
      let rain = _.find(map.objects, function (obj) {
        return obj.name == "rain";
      });
      let lightning = _.find(map.objects, function (obj) {
        return obj.name == "lightning";
      });

      if (textBoxes && textBoxes.objects.length > 0) {
        textBoxes.objects.forEach(function (shape) {
          if (
            player.x > shape.x &&
            player.x < shape.x + shape.width &&
            player.y > shape.y &&
            player.y < shape.y + shape.height
          ) {
            if (!shape.text) {
              shape.text = gameSceneObj.add.text(
                shape.properties[2].value,
                shape.properties[3].value,
                shape.properties[1].value,
                styles["tags"]
              );
              shape.text.alpha = 0.1;
              shape.text.setOrigin(0.5, 0.5);
            }
            let a = player.x - shape.text.x;
            let b = player.y - shape.text.y;
            let c = Math.sqrt(a * a + b * b);
            c = Math.round((c / shape.properties[0].value) * 100) / 100 - 0.2;
            if (c > 1) {
              c = 1;
            }
            if (c != shape.text.alpha) {
              gameSceneObj.tweens.add({
                targets: shape.text,
                alpha: c,
                duration: 200,
                ease: "Power2",
                repeat: 0,
              });
            }
          } else {
            gameSceneObj.tweens.add({
              targets: shape.text,
              alpha: 0,
              duration: 2000,
              ease: "Power2",
              repeat: 0,
            });
          }
        });
      }

      if (lights && lights.objects.length > 0) {
        lights.objects.forEach(function (shape) {
          let x = Math.floor(shape.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
          let y = Math.floor(shape.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
          if (!shape.image) {
            shape.spriteObj = gameSceneObj.add.sprite(
              x,
              y,
              shape.properties[2].value
            );
            shape.spriteObj.play(
              shape.properties[3] ? shape.properties[2].value : "burn",
              false,
              Math.floor(Math.random() * 8)
            );

            group1.add(shape.spriteObj);
            shape.image = [];
            shape.image[0] = gameSceneObj.add.circle(x, y, 80, 0xffffff, 0.05);
            shape.image[1] = gameSceneObj.add.circle(x, y, 80, 0xffffff, 0.05);
            shape.image[2] = gameSceneObj.add.circle(x, y, 80, 0xffffff, 0.05);
          } else {
            shape.image[shadowCounter].destroy();
            let min = 200;
            let max = 220;
            if (shape.properties) {
              max = shape.properties[0].value;
              min = shape.properties[1].value;
            }
            shape.image[shadowCounter] = gameSceneObj.add.circle(
              x,
              y,
              Phaser.Math.Between(min, max),
              0xffffff,
              0.05
            );
            shape.image[shadowCounter].setDepth(6);
          }
        });
      }

      if (pixels && pixels.objects.length > 0) {
        pixels.objects.forEach(function (shape) {
          let x = Math.floor(Math.random() * shape.width) + shape.x;
          let y = Math.floor(Math.random() * shape.height) + shape.y;
          let fadeHeight = Math.floor(Math.random() * 40) - 30;
          let image = "pixel3";
          let at = gameSceneObj.add.sprite(x, y, image);
          let tints = eval(shape.properties[0].value);
          at.tint = tints[Phaser.Math.Between(0, tints.length - 1)];
          gameSceneObj.tweens.add({
            targets: at,
            ease: "Cubic.easeIn",
            y: y - 45 - fadeHeight,
            alpha: 0.2,
            duration: 500,
            onComplete: function () {
              this.targets[0].destroy();
            },
          });
        });
      }

      if (rain && rain.objects.length > 0) {
        rain.objects.forEach(function (shape) {
          let x = Math.floor(Math.random() * shape.width) + shape.x;
          let y = Math.floor(Math.random() * shape.height) + shape.y;
          let fadeHeight = Math.floor(Math.random() * 40) - 30;
          let image = "rain";
          let at = gameSceneObj.add.sprite(x, y, image);
          let tints = eval(shape.properties[0].value);
          at.tint = tints[Phaser.Math.Between(0, tints.length - 1)];
          at.alpha = 0.05;
          gameSceneObj.tweens.add({
            targets: at,
            ease: "Linear",
            y: y + 120 - fadeHeight,
            x: x + 60,
            duration: 200,
            onComplete: function () {
              this.targets[0].destroy();
            },
          });
          gameSceneObj.tweens.add({
            targets: at,
            ease: "Sine.easeOut",
            alpha: 1,
            duration: 100,
            yoyo: true,
          });
        });
      }
      if (lightning && lightning.objects.length > 0) {
        lightning.objects.forEach(function (shape) {
          if (
            player.x > shape.x &&
            player.y > shape.y &&
            player.x < shape.x + shape.width &&
            player.y < shape.y + shape.height
          ) {
            if (Math.floor(Math.random() * 100) === 4) {
              flashLightning();
            }
          }
        });
      }
    }

    $.each(walkCells, function (index, value) {
      walkCells[index].x = -100;
      walkCells[index].y = -100;
    });
    $.each(player.moves, function (index, value) {
      if (
        !(
          player.x == value.x * TILE_SIZE + TILE_SIZE / 2 &&
          player.y == value.y * TILE_SIZE + TILE_SIZE / 2 &&
          index == 0
        )
      ) {
        walkCells[index].x = value.x * TILE_SIZE + TILE_SIZE / 2;
        walkCells[index].y = value.y * TILE_SIZE + TILE_SIZE / 2;
      }
    });

    try {
      // THIS SHOULD BE ON THE SERVER SIDE
      if (
        Phaser.Math.distance(
          player.x,
          player.y,
          player.target.x,
          player.target.y
        ) > 1050
      ) {
        forgetTarget();
      }
    } catch (error) {}
  }
}

class menuScene extends Phaser.Scene {
  constructor() {
    super({ key: "menuScene", active: true });
  }

  preload() {
    menuSceneObj = game.scene.getScene("menuScene");
    this.load.image("emptyItem", "images/emptyItem.png");
    this.load.image("emptySkill", "images/emptySkill.png");
    this.load.image("iconTemplate", "./images/iconTemplate.png");
    this.load.image("resourceBar", "./images/Bar.png");
    this.load.image("expBar", "./images/exp_bar.png");
    this.load.image("expGrad", "./images/exp_grad.png");
    this.load.image("healthGrad", "./images/healthGrad.png");
    this.load.image("manaGrad", "./images/manaGrad.png");
    this.load.image("statusBackgroundL", "./images/statPanelL.png");
    this.load.image("statusBackgroundM", "./images/statPanelM.png");
    this.load.image("statusBackgroundR", "./images/statPanelR.png");
    this.load.image("collectionGrad", "./images/collectionGrad.png");
    this.load.image("collectionPanel", "./images/collectionPanel.png");
    this.load.image("respawnPanel", "./images/respawnPanel.png");
    this.load.image("targetPanel", "./images/targetPanel.png");
    this.load.image("enemyHealth", "./images/enemyHealth.png");
    this.load.image("itemContainer", "./images/itemContainer.png");
    this.load.image("drops_16", "./images/sprites/items/drops_16.png");
    this.load.image("drops_17", "./images/sprites/items/drops_17.png");
    this.load.image("potion_41", "./images/sprites/items/potion_41.png");
  }

  create() {
    // Left Bar Panel
    statusBarL = this.add.container(0, GAME_HEIGHT);
    let bg = this.add.sprite(0, 0, "statusBackgroundL");
    bg.setOrigin(0, 1);
    bg.setInteractive();
    statusBarL.add(bg);
    let healthGrad = this.add.sprite(292, -69, "healthGrad");
    healthGrad.scaleX = 0;
    healthGrad.setOrigin(1, 1);
    let resourceBar1 = this.add.sprite(20, -69, "resourceBar");
    resourceBar1.setOrigin(0, 1);
    statusBarL.add(healthGrad);
    statusBarL.add(resourceBar1);
    statusBarL.setScrollFactor(0, 0);

    // Middle Bar Panel
    statusBarM = this.add.container(337, GAME_HEIGHT);
    bg = this.add.sprite(0, 0, "statusBackgroundM");
    bg.setOrigin(0, 1);
    bg.setInteractive();
    statusBarM.add(bg);
    let expGrad = this.add.sprite(3, -25, "expGrad");
    expGrad.scaleX = 0;
    statusBarM.add(expGrad);
    let expBar = this.add.sprite(3, -25, "expBar");
    statusBarM.add(expBar);
    expGrad.setOrigin(0, 0);
    expBar.setOrigin(0, 0);
    statusBarM.setScrollFactor(0, 0);

    // Right Bar Panel
    statusBarR = this.add.container(337 + 606, GAME_HEIGHT);
    bg = this.add.sprite(0, 0, "statusBackgroundR");
    bg.setOrigin(0, 1);
    bg.setInteractive();
    statusBarR.add(bg);
    let manaGrad = this.add.sprite(35, -69, "manaGrad");
    manaGrad.scaleX = 0;
    statusBarR.add(manaGrad);
    let resourceBar2 = this.add.sprite(20, -69, "resourceBar");
    statusBarR.add(resourceBar2);
    manaGrad.setOrigin(0, 1);
    resourceBar2.setOrigin(0, 1);
    statusBarR.setScrollFactor(0, 0);

    // Target Panel
    targetPanel = this.add.container(-250, 15);
    bg = this.add.sprite(0, 0, "targetPanel");
    bg.setInteractive();
    bg.setOrigin(0, 0);
    targetPanel.add(bg);
    targetPanel.setScrollFactor(0, 0);
    let enemyHealth = this.add.sprite(0, 2, "enemyHealth");
    enemyHealth.setOrigin(0, 0);
    targetPanel.add(enemyHealth);
    let enemyIconTemplate = this.add.sprite(3, 5, "iconTemplate");
    enemyIconTemplate.setOrigin(0, 0);
    targetPanel.add(enemyIconTemplate);
    let enemyIcon = this.add.sprite(3, 5, "crab");
    enemyIcon.setOrigin(0, 0);
    targetPanel.add(enemyIcon);
    let nameText = this.add.text(142, 12, "", styles["tags"]);
    nameText.setOrigin(0.5, 0);
    targetPanel.add(nameText);
    let levelText = this.add.text(142, 32, "Level: ", styles["targetPanel"]);
    levelText.setOrigin(0.5, 0);
    targetPanel.add(levelText);

    menuContainer = this.add.dom(0, 0, "#menuContainer");
    menuContainer.setScrollFactor(0, 0);
    generateInventory();
    generateCombatSelect();
    generateCombatSkillSelect();
    generateCombatItemPanel();
    generateCombatSkillPanel();
  }

  update() {
    if (player.target) {
      if (player.target.type == "enemies") {
        targetPanel.list[1].leftTween = gameSceneObj.tweens.add({
          targets: targetPanel.list[1],
          ease: "Circ.easeOut",
          scaleX: player.target.health / player.target.maxHealth,
          duration: 75,
        });
      } else {
        targetPanel.list[1].scaleX = 0;
      }
    }
    adjustStatus();
  }
}

let config = {
  parent: "wrapper",
  dom: { createContainer: true },
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scene: [gameScene, menuScene],
  scale: {
    parent: "wrapper",
    mode: Phaser.Scale.FIT,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  fps: { panicMax: 0 },
};
