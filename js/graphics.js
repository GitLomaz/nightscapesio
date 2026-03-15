function faceEast(sprite) {
  if (sprite.east) {
    sprite.scaleX = -1;
  } else {
    sprite.scaleX = 1;
  }
}

function facePlayer(container) {
  container.sprite.setFrame(container.direction);
}

function shakeSprite(sprite, direction = "N") {
  if (!sprite) {
    return;
  }
  let x = sprite.x;
  let y = sprite.y;
  switch (direction) {
    case 1:
      y = y + 4;
      break;
    case 7:
      y = y - 4;
      break;
    case 5:
      x = x - 4;
      break;
    case 3:
      x = x + 4;
      break;
    case 2:
      y = y + 2;
      x = x - 2;
      break;
    case 0:
      y = y + 2;
      x = x + 2;
      break;
    case 8:
      y = y - 2;
      x = x - 2;
      break;
    case 6:
      y = y - 2;
      x = x + 2;
      break;
  }
  gameSceneObj.tweens.add({
    targets: sprite,
    x: x,
    y: y,
    duration: 100,
    ease: "Linear",
    yoyo: true,
  });
}

function levelUp(sprite) {
  let x = 0;
  let intervalID = setInterval(function () {
    let height = Phaser.Math.Between(-20, 10);
    let at = gameSceneObj.add.sprite(
      sprite.x - 15,
      sprite.y + height,
      "pixel3"
    );
    tints = [0xffc90e, 0xffd542, 0xffe27d];
    at.tint = tints[Phaser.Math.Between(0, 2)];

    at.leftTween = gameSceneObj.tweens.add({
      targets: at,
      ease: "Back.easeInOut",
      x: sprite.x + 15,
      duration: 500,
    });
    at.downTween = gameSceneObj.tweens.add({
      targets: at,
      y: sprite.y + height + 5,
      duration: 250,
      ease: "Linear",
      yoyo: true,
      onComplete: function () {
        this.targets[0].destroy();
      },
    });

    if (++x === 80) {
      clearInterval(intervalID);
    }
  }, 5);
}

function shootProjectile(
  from = { x: player.x, y: player.y },
  to = { x: player.x + 250, y: player.y + 250 },
  duration = 500,
  color = 0x123123
) {
  p1 = gameSceneObj.add.sprite(from.x, from.y, "pixel3");
  effect1 = Math.floor(Math.random() * 11);
  effect2 = Math.floor(Math.random() * 11);

  p1.emitter = particles.createEmitter({
    follow: p1,
    lifespan: 200,
    speed: { min: 20, max: 40 },
  });

  p1.tween = gameSceneObj.tweens.add({
    targets: p1,
    y: to.y,
    x: to.x,
    duration: duration,
    ease: "Linear",
    onComplete: function () {
      this.targets[0].emitter.explode(6, to.x, to.y);
      this.targets[0].emitter.stop();
      this.targets[0].destroy();
    },
  });
}

function shootEnergyBlast(
  from = { x: player.x, y: player.y },
  to = { x: player.x + 250, y: player.y + 250 },
  duration = 500,
  color = 0x123123
) {
  p1 = gameSceneObj.add.sprite(from.x, from.y, "pixel3");
  effect1 = Math.floor(Math.random() * 11);
  effect2 = Math.floor(Math.random() * 11);

  p1.emitter = particles.createEmitter({
    follow: p1,
    lifespan: 200,
    speed: { min: 50, max: 100 },
  });
  p1.emitter.tint.onChange(color);

  p1.leftTween = gameSceneObj.tweens.add({
    targets: p1,
    ease: tweenList[effect1],
    x: to.x,
    duration: duration,
  });
  p1.downTween = gameSceneObj.tweens.add({
    targets: p1,
    y: to.y,
    duration: duration,
    ease: tweenList[effect2],
    onComplete: function () {
      this.targets[0].emitter.explode(15, to.x, to.y);
      this.targets[0].emitter.stop();
      this.targets[0].destroy();
    },
  });
}

function spawnAnimation(
  location = { x: 200, y: 200 },
  tints = [0x00454a, 0x00757d, 0x008d96]
) {
  let x = 0;
  let intervalID = setInterval(function () {
    let height = Phaser.Math.Between(-10, -20);
    let left = Phaser.Math.Between(-15, 15);
    let at = gameSceneObj.add.sprite(
      location.x - left,
      location.y + height,
      "pixel2"
    );
    at.tint = tints[Phaser.Math.Between(0, 2)];

    at.downTween = gameSceneObj.tweens.add({
      targets: at,
      y: location.y + 15,
      duration: 350,
      ease: "Linear",
      onComplete: function () {
        this.targets[0].destroy();
      },
    });

    if (++x === 50) {
      clearInterval(intervalID);
    }
  }, 5);
}

function despawnAnimation(
  location = { x: 200, y: 200 },
  tints = [0x00454a, 0x00757d, 0x008d96]
) {
  let x = 0;
  let intervalID = setInterval(function () {
    let height = Phaser.Math.Between(-10, -20);
    let left = Phaser.Math.Between(-15, 15);
    let at = gameSceneObj.add.sprite(
      location.x - left,
      location.y + 15,
      "pixel2"
    );
    at.tint = tints[Phaser.Math.Between(0, 2)];

    at.downTween = gameSceneObj.tweens.add({
      targets: at,
      y: location.y + height,
      duration: 350,
      ease: "Linear",
      onComplete: function () {
        this.targets[0].destroy();
      },
    });

    if (++x === 50) {
      clearInterval(intervalID);
    }
  }, 5);
}

function skillItemAnimation(
  location = { x: 200, y: 200 },
  tints = [0x00454a, 0x00757d, 0x008d96]
) {
  let x = 0;
  let intervalID = setInterval(function () {
    let height = Phaser.Math.Between(-10, -20);
    let left = Phaser.Math.Between(-15, 15);
    let at = gameSceneObj.add.sprite(
      location.x - left,
      location.y + 15,
      "pixel2"
    );
    at.tint = tints[Phaser.Math.Between(0, 2)];

    at.downTween = gameSceneObj.tweens.add({
      targets: at,
      y: location.y + height,
      duration: 350,
      ease: "Linear",
      onComplete: function () {
        this.targets[0].destroy();
      },
    });

    if (++x === 20) {
      clearInterval(intervalID);
    }
  }, 5);
}

function healAnimation(
  location = { x: 200, y: 200 },
  value,
  tints = [0x458b00, 0x66cd00, 0x78ab46],
  style = "heal"
) {
  let x = 0;
  let intervalID = setInterval(function () {
    let height = Phaser.Math.Between(-15, 15);
    let fadeHeight = Phaser.Math.Between(-30, 10);
    let image = "pixel2";
    if (Phaser.Math.Between(0, 8) == 8) {
      image = "plus";
    }
    let at = gameSceneObj.add.sprite(
      location.x + height,
      location.y + 20,
      image
    );
    at.tint = tints[Phaser.Math.Between(0, 2)];
    at.upTween = gameSceneObj.tweens.add({
      targets: at,
      y: location.y - 45 - fadeHeight,
      alpha: 0.2,
      duration: 500,
      ease: "Cubic.easeIn",
      onComplete: function () {
        this.targets[0].destroy();
      },
    });
    if (++x === 50) {
      clearInterval(intervalID);
    }
  }, 5);

  if (value) {
    let text = gameSceneObj.add.text(
      location.x,
      location.y - 20,
      value,
      styles[style]
    );
    text.setOrigin(0.5, 0.5);
    text.upTween = gameSceneObj.tweens.add({
      targets: text,
      y: "-=80",
      alpha: 0,
      duration: 1200,
      ease: "Expo.easeIn",
      onComplete: function () {
        this.targets[0].destroy();
      },
    });
  }
}

function showDamage(number, x, y, style, east) {
  if (east) {
    let dtext = gameSceneObj.add.text(x, y - 10, number, style);
    dtext.rightTween = gameSceneObj.tweens.add({
      targets: dtext,
      x: "+=70",
      duration: 1000,
      alpha: 0,
      ease: "Linear",
    });
    dtext.upTween = gameSceneObj.tweens.add({
      targets: dtext,
      y: "-=50",
      duration: 1000,
      ease: "Back.easeOut",
      onComplete: function () {
        this.targets[0].destroy();
      },
    });
  } else {
    let dtext = gameSceneObj.add.text(x - 10, y - 10, number, style);

    dtext.leftTween = gameSceneObj.tweens.add({
      targets: dtext,
      x: "-=70",
      duration: 1000,
      alpha: 0,
      ease: "Linear",
    });
    dtext.upTween = gameSceneObj.tweens.add({
      targets: dtext,
      y: "-=50",
      duration: 1000,
      ease: "Back.easeOut",
      onComplete: function () {
        this.targets[0].destroy();
      },
    });
  }
}

function miss(x, y, style) {
  let dtext = gameSceneObj.add.text(x - 20, y - 30, "miss", style);
  dtext.upTween = gameSceneObj.tweens.add({
    targets: dtext,
    y: "-=50",
    alpha: 0,
    duration: 1000,
    ease: "Linear",
    onComplete: function () {
      this.targets[0].destroy();
    },
  });
}

function block(x, y, style) {
  let dtext = gameSceneObj.add.text(x - 45, y - 30, "blocked!", style);
  dtext.upTween = gameSceneObj.tweens.add({
    targets: dtext,
    y: "-=50",
    alpha: 0,
    duration: 1000,
    ease: "Linear",
    onComplete: function () {
      this.targets[0].destroy();
    },
  });
}

function playHitAnimation(location, style) {
  let spr = gameSceneObj.add.sprite(location.x, location.y, style.type);
  if (style.east) {
    spr.setFlipX(true);
  }
  spr.setDepth(10);
  spr.anims.play("slash1", true);
  spr.on(
    "animationcomplete",
    function () {
      spr.destroy();
    },
    spr
  );
}

function updateAuras(auraContainer, auras) {
  _.each(auras, function (aura) {
    let newAura = true;
    _.each(auraContainer.list, function (activeAura) {
      if (activeAura.name === aura) {
        newAura = false;
      }
    });
    if (newAura) {
      auraContainer.add(generateAura(aura));
    }
  });
}

function flashLightning() {
  image = gameSceneObj.add.sprite(0, 0, "pixel3");
  image.setScale(1000);
  image.alpha = 0;
  image.setScrollFactor(0);
  gameSceneObj.tweens.add({
    targets: image,
    duration: Math.floor(Math.random() * 31) + 50,
    alpha: 0.35,
    ease: "Linear",
    yoyo: true,
    onComplete: function () {
      this.targets[0].destroy();
    },
  });
  setTimeout(function () {
    sounds = ["Thunder1", "Thunder2", "Thunder3", "Thunder4"];
    gameSceneObj.soundController.play(
      sounds[Math.floor(Math.random() * sounds.length)]
    );
  }, Math.floor(Math.random()) * 2000 + 500);
}

function generateAura(type) {
  aura = gameSceneObj.add.container();
  aura.name = type;
  switch (type) {
    case "armor":
      circle1 = gameSceneObj.add.circle(0, 16, 5);
      circle1.setStrokeStyle(3, 0x626e8e, 1);
      circle1.scaleY = 0.5;
      circle2 = gameSceneObj.add.circle(0, 16, 15);
      circle2.setStrokeStyle(3, 0x626e8e, 1);
      circle2.scaleY = 0.5;
      aura.tweens = [];
      aura.tweens.push(
        gameSceneObj.tweens.add({
          targets: circle1,
          radius: 15,
          duration: 5000,
          ease: "Linear",
          repeat: -1,
        })
      );
      aura.tweens.push(
        gameSceneObj.tweens.add({
          targets: circle2,
          radius: 25,
          duration: 5000,
          ease: "Linear",
          repeat: -1,
        })
      );
      aura.tweens.push(
        gameSceneObj.tweens.add({
          targets: circle2,
          alpha: 0,
          duration: 5000,
          ease: "Sine.easeIn",
          repeat: -1,
        })
      );
      aura.add([circle1, circle2]);
      break;
    case "blazeAura":
      let x = 0;
      let intervalID = setInterval(function () {
        if (x % 4 == 0) {
          let height = Phaser.Math.Between(5, 10);
          let x = Phaser.Math.Between(15, 19);
          let at = gameSceneObj.add.sprite(-x, height, "pixel3");
          tints = [0xffc90e, 0xffd542, 0xffe27d];
          at.tint = tints[Phaser.Math.Between(0, 2)];

          at.leftTween = gameSceneObj.tweens.add({
            targets: at,
            ease: "Back.easeInOut",
            x: x,
            duration: 1000,
            repeat: -1,
          });
          at.downTween = gameSceneObj.tweens.add({
            targets: at,
            y: height + 20,
            duration: 500,
            ease: "Linear",
            repeat: -1,
            yoyo: true,
          });
          aura.add([at]);
        }
        if (++x === 200) {
          clearInterval(intervalID);
        }
      }, 5);
      break;
    default:
      break;
  }
  return aura;
}
