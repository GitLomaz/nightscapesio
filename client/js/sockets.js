function addGameSockets() {
  removeGameSockets();
  socket.on("questPos", function (data) {
    textQueue.push({ data: data.text, color: data.color });
  });

  socket.on("playerPositions", function (data) {
    let updatedPlayers = {};
    _.each(data, function (p) {
      if (
        objects.players[p.hash] &&
        objects.players[p.hash].list &&
        objects.players[p.hash].list.length === 0
      ) {
        objects.players[p.hash] = null;
      }
      if (
        typeof objects.players[p.hash] === "undefined" ||
        objects.players[p.hash] === null
      ) {
        let newp = gameSceneObj.add.container(0, 0);
        newp.sprite = gameSceneObj.add.sprite(0, 0, p.image).setInteractive();
        newp.add(newp.sprite);
        newp.direction = 7;
        newp.tint = Math.random() * 0xffffff;
        newp.type = "players";
        newp.hash = p.hash;
        newp.name = p.name;
        newp.tester = p.tester;
        text = gameSceneObj.add.text(20, 20, p.name, styles[p.tag]);
        text.y = -35;
        text.x = 0;
        text.setOrigin(0.5, 0);
        newp.add(text);
        objects.players[p.hash] = newp;
        setDepth();
        spawnAnimation(
          {
            x: p.location.x * TILE_SIZE + TILE_SIZE / 2,
            y: p.location.y * TILE_SIZE + TILE_SIZE / 2,
          },
          [0x1338be, 0x48aaad, 0x0492c2]
        );
      } else {
        if (objects.players[p.hash].map !== player.map) {
          delete objects.players[p.hash];
        }
      }

      objects.players[p.hash].moves = p.moves;
      objects.players[p.hash].direction = p.direction;
      objects.players[p.hash].level = p.level;
      objects.players[p.hash].health = p.health;
      objects.players[p.hash].healthMax = p.healthMax;
      objects.players[p.hash].mana = p.mana;
      objects.players[p.hash].manaMax = p.manaMax;
      objects.players[p.hash].exp = p.exp;
      objects.players[p.hash].expMax = p.expMax;
      objects.players[p.hash].class = p.class;
      objects.players[p.hash].map = p.location.map;

      if (
        objects.players[p.hash].x !==
          p.location.x * TILE_SIZE + TILE_SIZE / 2 ||
        objects.players[p.hash].y !== p.location.y * TILE_SIZE + TILE_SIZE / 2
      ) {
        gameSceneObj.soundController.walk(
          p.location.x * TILE_SIZE + TILE_SIZE / 2,
          p.location.y * TILE_SIZE + TILE_SIZE / 2
        );
      }

      if (player.id === p.id) {
        if (p.guest) {
          $("#guestWarning").show();
        } else {
          $("#guestWarning").hide();
        }
        if (player.zone !== p.location.map) {
          if (player.zone) {
            // Zone change, re-start scene?
            player.zone = p.location.map;
            player.location = p.location;
            refreshScene();
            return;
          } else {
            textQueue.push({
              data: zoneNames[p.location.map],
              color: "#3C1361",
            });
          }
          player.zone = p.location.map;
          player.location = p.location;
        }
        if (p.dead) {
          player.visible = false;
          $("#respawnPanel").show();
        } else if (!p.dead && !player.visible) {
          player.visible = true;
          gameSceneObj.cameras.main.flash();
          gameSceneObj.cameras.main.centerOnX(
            p.location.x * TILE_SIZE + TILE_SIZE / 2
          );
          gameSceneObj.cameras.main.centerOnY(
            p.location.y * TILE_SIZE + TILE_SIZE / 2
          );
          $("#respawnPanel").hide();
        }
        if (p.collecting && !player.collecting) {
          showCollectionBar();
          player.collecting = true;
        }
        if (!p.collecting && player.collecting) {
          hideCollectionBar();
          player.collecting = false;
        }
        player.quests = p.quests;
        player.items = {};
        _.each(p.items, function (index) {
          player.items[index.id] = index;
        });
        player.gold = p.gold;
        player.combatItems = p.combatItems;
        player.combatSkills = p.combatSkills;
        player.equipment = p.equipment;
        player.statBonuses = p.statBonuses;
        player.buffBonuses = p.buffBonuses;
        player.kills = p.kills;
        player.skills = p.skills;
        $("#inventoryGold").html("Gold: " + numberWithCommas(player.gold));
        if (
          player.calculatedStats &&
          p.calculatedStats.points > player.calculatedStats.points
        ) {
          $("#statNotice").show();
        }
        if (
          player.calculatedStats &&
          p.calculatedStats.skillPoints > player.calculatedStats.skillPoints
        ) {
          $("#skillsNotice").show();
        }
        if (!_.isEqual(player.calculatedStats, p.calculatedStats)) {
          player.calculatedStats = p.calculatedStats;
          populateStatPanel();
          populateSkillPanel();
        }

        if (
          $("#shopPanel").is(":visible") &&
          $("#shopPanel").css("opacity") === 1
        ) {
          populateShopPrompt();
        }
        populateInventory();
        populateEquipmentPanel();
        populateCombatItemPanel();
        populateCombatSkillPanel();
        populateQuestPanel(p.quests); // Stuff like this, maybe only re-run if different?
        populateBestiary();
        populateStatusEffects(p.statusEffects);
      } else {
        if (p.dead) {
          objects.players[p.hash].visible = false;
        } else if (!p.dead && !objects.players[p.hash].visible) {
          objects.players[p.hash].visible = true;
        }
      }
      objects.players[p.hash].x = p.location.x * TILE_SIZE + TILE_SIZE / 2;
      objects.players[p.hash].y = p.location.y * TILE_SIZE + TILE_SIZE / 2;
      facePlayer(objects.players[p.hash]);
      updatedPlayers[p.hash] = objects.players[p.hash];
    });
    if (!_.isEqual(updatedPlayers, objects.players)) {
      _.each(objects.players, function (p, index) {
        if (typeof updatedPlayers[index] === "undefined") {
          if (player.target && player.target.hash == p.hash) {
            forgetTarget();
            hidetargetPanel();
          }
          p.destroy();
          delete objects.players[index];
        }
      });
    }
  });

  socket.on("enemyPositions", function (data) {
    let updatedEnemies = {};
    _.each(data, function (enemy) {
      if (typeof objects.enemies[enemy.hash] === "undefined") {
        let newEnemy = gameSceneObj.add.container(
          enemy.x * TILE_SIZE + TILE_SIZE / 2,
          enemy.y * TILE_SIZE + TILE_SIZE / 2
        );
        let enemySprite = gameSceneObj.add
          .sprite(0, 0, enemy.i)
          .setInteractive();
        enemySprite.on("pointerover", function () {
          $("body").css("cursor", "var(--sword)");
        });
        enemySprite.on("pointerout", function () {
          $("body").css("cursor", "var(--cursor)");
        });
        let auraContainer = gameSceneObj.add.container();
        newEnemy.add(auraContainer);
        newEnemy.auraContainer = auraContainer;
        newEnemy.name = enemy.n;
        if (enemy.magic) {
          let enemySpriteShadowBack = gameSceneObj.add
            .sprite(0, 0, enemy.i)
            .setInteractive();
          enemySpriteShadowBack.setTintFill(enemy.magic.hue);
          enemySpriteShadowBack.setScale(1.4, 1.4);
          enemySpriteShadowBack.setAlpha(0.5);
          newEnemy.add(enemySpriteShadowBack);
          newEnemy.spriteShadowBack = enemySpriteShadowBack;

          let enemySpriteShadow = gameSceneObj.add
            .sprite(0, 0, enemy.i)
            .setInteractive();
          enemySpriteShadow.tint = enemy.magic.hue;
          enemySpriteShadow.setScale(1.4, 1.4);
          enemySpriteShadowBack.setAlpha(0.5);
          newEnemy.add(enemySpriteShadow);
          newEnemy.spriteShadow = enemySpriteShadow;
          newEnemy.name = enemy.magic.prefix + newEnemy.name;

          gameSceneObj.tweens.add({
            targets: [enemySpriteShadow, enemySpriteShadowBack],
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 2000,
            ease: "Linear",
            repeat: -1,
            yoyo: true,
          });
        }

        newEnemy.add(enemySprite);
        newEnemy.sprite = enemySprite;
        group4.add(newEnemy);

        newEnemy.id = enemy.mid;
        newEnemy.level = enemy.l;
        newEnemy.east = enemy.ea;
        newEnemy.maxHealth = enemy.m;
        newEnemy.health = enemy.h;
        newEnemy.spawn_id = enemy.id;
        newEnemy.parent_id = enemy.parent_id;
        newEnemy.hash = enemy.hash;
        newEnemy.type = "enemies";
        newEnemy.alpha = 0.1;
        gameSceneObj.tweens.add({
          targets: newEnemy,
          alpha: 1,
          duration: 150,
          ease: "Power2",
          repeat: 0,
        });
        objects.enemies[enemy.hash] = newEnemy;
        setDepth();
      } else {
        objects.enemies[enemy.hash].east = enemy.ea;
        objects.enemies[enemy.hash].health = enemy.h;
        objects.enemies[enemy.hash].x = enemy.x * TILE_SIZE + TILE_SIZE / 2;
        objects.enemies[enemy.hash].y = enemy.y * TILE_SIZE + TILE_SIZE / 2;
        objects.enemies[enemy.hash].sprite.setTexture(enemy.i);
        if (objects.enemies[enemy.hash].spriteShadow) {
          objects.enemies[enemy.hash].spriteShadow.setTexture(enemy.i);
        }
        faceEast(objects.enemies[enemy.hash]);
      }
      updatedEnemies[enemy.hash] = objects.enemies[enemy.hash];
      updateAuras(objects.enemies[enemy.hash].auraContainer, enemy.auras);
      updateAuras(objects.enemies[enemy.hash].auraContainer, [enemy.effect]);
    });
    if (!_.isEqual(updatedEnemies, objects.enemies)) {
      _.each(objects.enemies, function (enemy, index) {
        if (typeof updatedEnemies[index] === "undefined") {
          if (player.target && player.target.hash == enemy.hash) {
            forgetTarget();
            hidetargetPanel();
          }
          if (
            Phaser.Geom.Rectangle.Contains(
              enemy.getBounds(),
              game.input.mousePointer.worldX,
              game.input.mousePointer.worldY
            )
          ) {
            $("body").css("cursor", "var(--cursor)");
          }
          _.each(objects.enemies[index].auraContainer.list, function (c) {
            _.each(gameSceneObj.tweens.getTweensOf(c.list), function (t) {
              t.remove();
            });
          });
          enemy.destroy();
          delete objects.enemies[index];
        }
      });
    }
  });

  socket.on("NPCs", function (data) {
    _.each(data, function (npc) {
      const punc = npc.punctionation;
      npc = npc.npc;
      if (typeof objects.npcs[npc.hash] === "undefined") {
        let NPC = gameSceneObj.add.container(
          npc.location.x * TILE_SIZE + TILE_SIZE / 2,
          npc.location.y * TILE_SIZE + TILE_SIZE / 2
        );
        let NPCSprite = gameSceneObj.add
          .sprite(0, 0, npc.image)
          .setInteractive();
        NPCSprite.on("pointerover", function () {
          $("body").css("cursor", "var(--cursor-active)");
        });
        NPCSprite.on("pointerout", function () {
          $("body").css("cursor", "var(--cursor)");
        });
        NPC.add(NPCSprite);
        NPC.sprite = NPCSprite;
        NPC.text = gameSceneObj.add.text(20, 20, "", styles["NPC"]);
        NPC.text.y = -45;
        NPC.text.x = 0;
        NPC.text.setOrigin(0.5, 0);
        NPC.text.flashTween = gameSceneObj.tweens.add({
          targets: NPC.text,
          alpha: 0.6,
          duration: 1000,
          ease: "Linear",
          repeat: -1,
          yoyo: true,
        });
        NPC.add(NPC.text);
        group5.add(NPC);
        NPC.name = npc.name;
        NPC.title = npc.title;
        NPC.type = "npcs";
        NPC.inputEnabled = true;
        NPC.id = npc.id;
        NPC.hash = npc.hash;
        NPC.radius = npc.radius;
        objects.npcs[npc.hash] = NPC;
        setDepth();
      }
      objects.npcs[npc.hash].text.text = punc;
    });
  });

  socket.on("receptacles", function (data) {
    _.each(data, function (rec) {
      if (typeof objects.receptacles[rec.hash] === "undefined") {
        let img = rec.image;
        if (rec.used) {
          img = rec.usedImage;
        }

        let receptacle = gameSceneObj.add.container(
          rec.location.x * TILE_SIZE + TILE_SIZE / 2,
          rec.location.y * TILE_SIZE + TILE_SIZE / 2
        );
        let receptacleSprite = gameSceneObj.add
          .sprite(0, 0, img)
          .setInteractive();
        receptacleSprite.on("pointerover", function () {
          $("body").css("cursor", "var(--cursor-active)");
        });
        receptacleSprite.on("pointerout", function () {
          $("body").css("cursor", "var(--cursor)");
        });
        receptacle.add(receptacleSprite);
        receptacle.sprite = receptacleSprite;
        group5.add(receptacle);
        receptacle.name = rec.name;
        receptacle.title = rec.title;
        receptacle.type = "receptacles";
        receptacle.inputEnabled = true;
        receptacle.collectionTimer = rec.collectionTimer;
        receptacle.id = rec.id;
        receptacle.hash = rec.hash;
        receptacle.radius = rec.radius;
        receptacle.used = rec.used || false;
        objects.receptacles[rec.hash] = receptacle;
        setDepth();
      } else {
        if (objects.receptacles[rec.hash].used !== (rec.used || false)) {
          objects.receptacles[rec.hash].title = rec.title;
          objects.receptacles[rec.hash].used = rec.used;
          objects.receptacles[rec.hash].list[0].setTexture(rec.usedImage);
        }
      }
    });
  });

  socket.on("portals", function (data) {
    _.each(data, function (rec) {
      if (typeof objects.portals[rec.hash] === "undefined") {
        let img = rec.image;
        let portal = gameSceneObj.add.container(
          rec.location.x * TILE_SIZE + TILE_SIZE / 2,
          rec.location.y * TILE_SIZE + TILE_SIZE / 2
        );
        let portalSprite = gameSceneObj.add.sprite(0, 0, img).setInteractive();
        portalSprite.on("pointerover", function () {
          $("body").css("cursor", "var(--cursor-active)");
        });
        portalSprite.on("pointerout", function () {
          $("body").css("cursor", "var(--cursor)");
        });
        portal.add(portalSprite);
        portal.sprite = portalSprite;
        group5.add(portal);
        portal.name = rec.name;
        portal.title = rec.text;
        portal.type = "portals";
        portal.inputEnabled = true;
        portal.collectionTimer = rec.collectionTimer;
        portal.id = rec.id;
        portal.hash = rec.hash;
        portal.radius = 1.5;
        objects.portals[rec.hash] = portal;
        setDepth();
      }
    });
  });

  socket.on("collectables", function (data) {
    let updatedCollectables = {};
    _.each(data, function (newCol) {
      if (typeof objects.collectables[newCol.hash] === "undefined") {
        let col = gameSceneObj.add.container(
          newCol.location.x * TILE_SIZE + TILE_SIZE / 2,
          newCol.location.y * TILE_SIZE + TILE_SIZE / 2
        );
        let newColSprite = gameSceneObj.add
          .sprite(0, 0, newCol.image)
          .setInteractive();
        newColSprite.on("pointerover", function () {
          $("body").css("cursor", "var(--cursor-active)");
        });
        newColSprite.on("pointerout", function () {
          $("body").css("cursor", "var(--cursor)");
        });
        col.add(newColSprite);
        col.sprite = newColSprite;
        group5.add(col);
        col.name = newCol.name;
        col.title = newCol.title;
        col.type = "collectables";
        col.hash = newCol.hash;
        col.radius = newCol.radius;
        col.collectionTimer = newCol.collectionTimer;
        col.inputEnabled = true;
        objects.collectables[col.hash] = col;
        setDepth();
      }
      updatedCollectables[newCol.hash] = objects.collectables[newCol.hash];
    });
    if (!_.isEqual(updatedCollectables, objects.collectables)) {
      _.each(objects.collectables, function (col, index) {
        if (typeof updatedCollectables[index] === "undefined") {
          if (player.target && player.target.hash == col.hash) {
            forgetTarget();
            hidetargetPanel();
          }
          if (
            Phaser.Geom.Rectangle.Contains(
              col.getBounds(),
              game.input.mousePointer.worldX,
              game.input.mousePointer.worldY
            )
          ) {
            $("body").css("cursor", "var(--cursor)");
          }
          col.destroy();
          delete objects.collectables[index];
        }
      });
    }
  });

  socket.on("graphics", function (data) {
    if (windowFocused || true) {
      _.each(data, function (graphic) {
        let sender,
          reciever = null;
        switch (graphic.type) {
          case "ghost":
            let ghostSprite = gameSceneObj.add.sprite(
              graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
              graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              "ghost"
            );
            ghostSprite.alpha = 0.8;
            ghostSprite.flashTween = gameSceneObj.tweens.add({
              targets: ghostSprite,
              y: "-=50",
              alpha: 0,
              duration: 1500,
              ease: "Quad.easeOut",
              onComplete: function () {
                this.targets[0].destroy();
              },
            });
            break;
          case "grave":
            let grave = gameSceneObj.add.sprite(
              graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
              graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              "grave"
            );
            setTimeout(function () {
              grave.tween = gameSceneObj.tweens.add({
                targets: grave,
                ease: "Quad.easeInOut",
                alpha: 0,
                duration: 10000,
                onComplete: function () {
                  this.targets[0].destroy();
                },
              });
            }, 3000);
            break;
          case "damage":
            showDamage(
              numberWithCommas(graphic.value),
              graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
              graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              styles[graphic.style],
              graphic.east
            );
            break;
          case "playerMiss":
            miss(
              graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
              graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              styles["enemyDamage"]
            );
            break;
          case "enemyMiss":
            miss(
              graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
              graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              styles["damage"]
            );
            break;
          case "playerBlock":
            block(
              graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
              graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              styles["damage"]
            );
            break;
          case "projectile":
            if (graphic.senderType == "enemy") {
              sender = objects.enemies[graphic.sender];
            } else {
              sender = objects.players[graphic.sender];
            }
            if (graphic.recieverType == "player") {
              reciever = objects.players[graphic.reciever];
            } else {
              reciever = objects.enemies[graphic.reciever];
            }
            shootEnergyBlast(sender, reciever, graphic.duration, graphic.color);
            break;
          case "arrow":
            if (graphic.senderType == "enemy") {
              sender = objects.enemies[graphic.sender];
            } else {
              sender = objects.players[graphic.sender];
            }
            if (graphic.recieverType == "player") {
              reciever = objects.players[graphic.reciever];
            } else {
              reciever = objects.enemies[graphic.reciever];
            }
            shootProjectile(sender, reciever, graphic.duration, graphic.color);
            break;
          case "spawn":
            spawnAnimation(
              {
                x: graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
                y: graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              },
              graphic.tints
            );
            break;
          case "hidePlayer":
            despawnAnimation(
              {
                x: graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
                y: graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              },
              graphic.tints
            );
            break;
          case "useItem":
          case "enemySkill":
            skillItemAnimation(
              {
                x: graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
                y: graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              },
              [0x00454a, 0x00757d, 0x008d96]
            );
            break;
          case "heal":
            healAnimation(
              {
                x: graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
                y: graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              },
              graphic.value,
              [0x458b00, 0x66cd00, 0x78ab46]
            );
            break;
          case "restore":
            healAnimation(
              {
                x: graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
                y: graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              },
              graphic.value,
              [0x1261a0, 0x3895d3, 0x58cced],
              "restore"
            );
            break;
          case "poison":
            healAnimation(
              {
                x: graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
                y: graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              },
              null,
              [0x3d34a5, 0x376d03, 0x6ab417]
            );
            break;
          case "remedy":
            healAnimation(
              {
                x: graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
                y: graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              },
              null,
              [0x25e2cd, 0x0a98ac, 0x005280]
            );
            break;
          case "levelUp":
            levelUp(objects.players[graphic.target]);
            break;
          case "takeDamage":
            playHitAnimation(
              {
                x: graphic.location.x * TILE_SIZE + TILE_SIZE / 2,
                y: graphic.location.y * TILE_SIZE + TILE_SIZE / 2,
              },
              {
                type: graphic.damageType,
                east: graphic.east,
              }
            );
            break;
          case "shake":
            shakeSprite(
              objects[graphic.targetType][graphic.target],
              graphic.value
            );
            break;
          default:
            console.log("graphic not implamented:");
            console.log(graphic.type);
            break;
        }
      });
    }
  });

  socket.on("notices", function (data) {
    if ($("#itemGainList").css("height") === "0px") {
      $("#itemGainList").html("");
    }
    _.each(data, function (item) {
      let id = makeid(8);
      let str = '<div id="' + id + '" class="border itemGainPanel">';
      str += '<div class="itemGainIcon ' + item.image + '"></div>';
      str += '<span class="itemGainText">' + item.string + "</span></div>";
      $("#itemGainList").append(str);
      setTimeout(function () {
        $("#" + id).fadeOut("slow");
      }, 4000);
    });
  });

  socket.on("promptQuest", function (data) {
    populateQuestPrompt(data);
  });

  socket.on("promptShop", function (data) {
    populateShopPrompt(data);
  });

  socket.on("chatMessage", function (data) {
    const chatDiv = $(document.createElement("div"));
    chatDiv.addClass("chatMessage");
    chatDiv.html(
      '<span class="' +
        data.tag +
        '">' +
        data.sender +
        ":</span> " +
        data.message
    );
    if (data.sender === "System") {
      chatDiv.addClass("systemMessage");
    } else if (data.sender === player.name) {
      chatDiv.addClass("selfMessage");
    }
    const chatLog = $("#chatLog div");
    if (chatLog.length === 400) {
      $("#chatLog").find("div:first").remove();
    }
    $("#chatLog").append(chatDiv);
    if (!$("#chat").is(":visible")) {
      $("#chatNotice").show();
    }
    var objDiv = document.getElementById("chatLog");
    objDiv.scrollTop = objDiv.scrollHeight;
  });

  socket.on("disableItem", function (data) {
    player.items[data.id].quantity--;
    populateInventory();
    $('div[itemId="' + data.id + '"]').each(function () {
      const cover = $(document.createElement("div"));
      cover.addClass("coverItem");
      $(this).append(cover);
      cover.animate(
        { height: "0px" },
        items[data.id].cooldown * 1.1,
        "linear",
        function () {
          this.remove();
        }
      );
    });
  });

  socket.on("registerFailure", function (data) {
    showMessage(data.error);
  });

  socket.on("registerSuccess", function (data) {
    window.location.replace(window.location.origin + "/?logout=2");
  });

  socket.on("disconnect", function () {
    removeGameSockets();
    window.location.replace(window.location.origin + "/?logout=3");
  });
}

function removeGameSockets() {
  socket.off("disableItem");
  socket.off("chatMessage");
  socket.off("promptQuest");
  socket.off("notices");
  socket.off("graphics");
  socket.off("collectables");
  socket.off("portals");
  socket.off("receptacles");
  socket.off("NPCs");
  socket.off("enemyPositions");
  socket.off("questPos");
  socket.off("playerPositions");
}
