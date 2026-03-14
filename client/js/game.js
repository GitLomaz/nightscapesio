$(document).ready(function () {
  if (window.location.href.includes("guest")) {
    socket = io({ secure: true, query: "guest=1" });
  } else if (window.location.href.includes("dev")) {
    socket = io(":2000", {
      secure: true,
      query: "token=" + token + "&id=" + char,
    });
  } else if (window.location.href.includes("localhost")) {
    if (!window.location.href.includes("other")) {
      socket = io({ secure: true, query: "localhost=true&id=5" });
    } else {
      socket = io({ secure: true, query: "localhost=true&id=1203" });
    }
  } else {
    socket = io({
      secure: true,
      query: "token=" + token + "&id=" + char,
    });
  }

  socket.on("failedToLoad", function (data) {
    console.log("failed to load?");
    window.location.replace("https://www.nightscapes.io");
  });

  socket.on("recievePlayer", function (data) {
    if (window.location.href.includes("dev") && data.tester === 0) {
      window.location.replace("https://www.nightscapes.io");
    } else {
      playerData = data;
      startGame();
    }
  });

  $(window).blur(function () {
    windowFocused = false;
  });
  $(window).focus(function () {
    windowFocused = true;
  });

  $("#respawnBtn").on("click", function () {
    socket.emit("respawn");
  });

  $("#menuBtn").on("click", function () {
    window.location.replace("https://www.nightscapes.io");
  });

  $("#menuRespawnBtn").on("click", function () {
    window.location.replace("https://www.nightscapes.io");
  });

  $("#bestiaryPageLock").on("click", function () {
    $(this).toggleClass("selected");
  });

  $("#bestiaryPagePrev").on("click", function () {
    changeBestiaryPage(true);
  });

  $("#bestiaryPageNext").on("click", function () {
    changeBestiaryPage();
  });

  $("#questRewards > .itemSlot, #questReqs > .itemSlot").on({
    mouseenter: function (obj) {
      let tipDiv = generateTooltip(
        $(this).attr("itemId"),
        $(this).attr("type")
      );
      $(this).append(tipDiv);
    },
    mouseleave: function () {
      $("#tooltip").remove();
    },
  });

  $("#questBtn1").on("click", function (e) {
    socket.emit("updateQuestFromNPC");
    $("#questPanel").fadeOut(200);
  });

  $("#questBtn2").on("click", function (e) {
    $("#questPanel").fadeOut(200);
  });

  $(".checkbox").on("click", function (e) {
    $(this).toggleClass("selected");
    if (typeof Storage !== "undefined") {
      localStorage.setItem($(this).attr("id"), $(this).hasClass("selected"));
    }
  });

  $("#chkCursor").on("click", function (e) {
    const r = document.querySelector(":root");
    if ($(this).hasClass("selected")) {
      r.style.setProperty("--sword", 'url("../images/cursor-sword.png"), auto');
      r.style.setProperty(
        "--cursor",
        'url("../images/cursor-pointer-c.png"), auto'
      );
      r.style.setProperty(
        "--cursor-active",
        'url("../images/cursor-pointer-b.png"), auto'
      );
    } else {
      r.style.setProperty("--sword", "default");
      r.style.setProperty("--cursor", "default");
      r.style.setProperty("--cursor-active", "pointer");
    }
  });

  $("#guestWarning").on("click", function (e) {
    $("#register").fadeIn(200);
  });

  $(".itemFilterIcon").on("click", function (e) {
    $(".itemFilterIcon").removeClass("selected");
    $(this).addClass("selected");
    populateInventory($(this).attr("type"));
  });

  $("#statsButton").on({
    mouseenter: function (obj) {
      let tipDiv = generateSimpleTooltip("Stats [C]");
      $(this).append(tipDiv);
    },
    mouseleave: function () {
      $("#tooltip").remove();
      $(this).removeClass("selected");
    },
    click: function (obj) {
      $("#statNotice").hide();
      if (!$("#stats").is(":visible")) {
        $(this).addClass("open");
        populateStatPanel();
        $("#stats").css("top", "216px");
        $("#stats").css("left", "405px");
        $("#stats").fadeIn(200);
      } else {
        $(this).removeClass("open");
        $("#stats").fadeOut(200);
      }
    },
  });

  $("#equipmentButton").on({
    mouseenter: function (obj) {
      let tipDiv = generateSimpleTooltip("Equipment [T]");
      $(this).append(tipDiv);
    },
    mouseleave: function () {
      $("#tooltip").remove();
      $(this).removeClass("selected");
    },
    click: function (obj) {
      if (!$("#equipment").is(":visible")) {
        $(this).addClass("open");
        populateEquipmentPanel();
        $("#equipment").css("top", "216px");
        $("#equipment").css("left", "430px");
        $("#equipment").fadeIn(200);
      } else {
        $(this).removeClass("open");
        $("#equipment").fadeOut(200);
      }
    },
  });

  $("#inventoryButton").on({
    mouseenter: function (obj) {
      let tipDiv = generateSimpleTooltip("Inventory [I]");
      $(this).append(tipDiv);
    },
    mouseleave: function () {
      $("#tooltip").remove();
      $(this).removeClass("selected");
    },
    click: function (obj) {
      if (!$("#inventory").is(":visible")) {
        $(this).addClass("open");
        populateInventory($(".selected").attr("type"));
        $("#inventory").css("top", "216px");
        $("#inventory").css("left", "430px");
        $("#inventory").fadeIn(200);
      } else {
        $(this).removeClass("open");
        $("#inventory").fadeOut(200);
      }
    },
  });

  $("#skillsButton").on({
    mouseenter: function (obj) {
      let tipDiv = generateSimpleTooltip("Skills [S]");
      $(this).append(tipDiv);
    },
    mouseleave: function () {
      $("#tooltip").remove();
      $(this).removeClass("selected");
    },
    click: function (obj) {
      $("#skillsNotice").hide();
      if (!$("#skills").is(":visible")) {
        $(this).addClass("open");
        populateSkillPanel();
        $("#skills").css("top", "216px");
        $("#skills").css("left", "230px");
        $("#skills").fadeIn(200);
      } else {
        $(this).removeClass("open");
        $("#skills").fadeOut(200);
      }
    },
  });

  $("#chatButton").on({
    mouseenter: function (obj) {
      let tipDiv = generateSimpleTooltip("Chat [Enter]");
      $(this).append(tipDiv);
    },
    mouseleave: function () {
      $("#tooltip").remove();
      $(this).removeClass("selected");
    },
    click: function (obj) {
      if (!$("#chat").is(":visible")) {
        $(this).addClass("open");
        $("#chat").fadeIn(200);
        $("#chatText").focus();
        $("#chatNotice").hide();
        var objDiv = document.getElementById("chatLog");
        objDiv.scrollTop = objDiv.scrollHeight;
      } else {
        $(this).removeClass("open");
        $("#chat").fadeOut(200);
      }
    },
  });

  $("#mainMenuButton").on({
    mouseenter: function (obj) {
      let tipDiv = generateSimpleTooltip("Menu [Esc]");
      $(this).append(tipDiv);
    },
    mouseleave: function () {
      $("#tooltip").remove();
      $(this).removeClass("selected");
    },
    click: function (obj) {
      if (!$("#mainMenu").is(":visible")) {
        $(this).addClass("open");
        $("#mainMenu").css("top", "250px");
        $("#mainMenu").css("left", "530px");
        $("#mainMenu").fadeIn(200);
      } else {
        $(this).removeClass("open");
        $("#mainMenu").fadeOut(200);
      }
    },
  });

  $("#helpBtn").on("click", function (e) {
    if (!$("#help").is(":visible")) {
      $("#mainMenu").fadeOut(200);
      $("#mainMenuButton").removeClass("open");
      $("#help").fadeIn(200);
      $("#help").css("top", "166px");
      $("#help").css("left", "390px");
    } else {
      $("#help").fadeOut(200);
    }
  });

  $("#creditsBtn").on("click", function (e) {
    if (!$("#credits").is(":visible")) {
      $("#mainMenu").fadeOut(200);
      $("#mainMenuButton").removeClass("open");
      $("#credits").fadeIn(200);
      $("#credits").css("top", "166px");
      $("#credits").css("left", "390px");
    } else {
      $("#credits").fadeOut(200);
    }
  });

  $("#optionsBtn").on("click", function (e) {
    if (!$("#options").is(":visible")) {
      $("#mainMenu").fadeOut(200);
      $("#mainMenuButton").removeClass("open");
      $("#options").fadeIn(200);
      $("#options").css("top", "250px");
      $("#options").css("left", "530px");
    } else {
      $("#options").fadeOut(200);
    }
  });

  $("#versionBtn").on("click", function (e) {
    if (!$("#notes").is(":visible")) {
      $("#mainMenu").fadeOut(200);
      $("#mainMenuButton").removeClass("open");
      $("#notes").fadeIn(200);
      $("#notes").css("top", "166px");
      $("#notes").css("left", "390px");
    } else {
      $("#notes").fadeOut(200);
    }
  });

  $("#bestiaryButton").on({
    mouseenter: function (obj) {
      let tipDiv = generateSimpleTooltip("Bestiary [B]");
      $(this).append(tipDiv);
    },
    mouseleave: function () {
      $("#tooltip").remove();
      $(this).removeClass("selected");
    },
    click: function (obj) {
      if (!$("#bestiary").is(":visible")) {
        $(this).addClass("open");
        $("#bestiary").fadeIn(200);
        $("#bestiary").css("top", "80px");
        $("#bestiary").css("left", "20px");
      } else {
        $(this).removeClass("open");
        $("#bestiary").fadeOut(200);
      }
    },
  });

  $("#bestiaryStar, .statTip").on({
    mouseenter: function (obj) {
      if ($(this).attr("toolTip")) {
        let tipDiv = generateTooltip($(this).attr("toolTip"));
        $(this).append(tipDiv);
      }
    },
    mouseleave: function () {
      $("#tooltip").remove();
    },
  });

  $("#bulkCommon").on("click", function (e) {
    if (!$(this).hasClass("disabled")) {
      socket.emit("sellAll", 4);
      _.each(player.equipment, function (equip) {
        if (!equip.equipped) {
          if (equip.rarity === 4) {
            equip.deleted = true;
          }
        }
      });
      populateInventory();
      populateShopPrompt();
    }
  });

  $("#bulkMagic").on("click", function (e) {
    if (!$(this).hasClass("disabled")) {
      socket.emit("sellAll", 3);
      _.each(player.equipment, function (equip) {
        if (!equip.equipped) {
          if (equip.rarity === 3) {
            equip.deleted = true;
          }
        }
      });
      populateInventory();
      populateShopPrompt();
    }
  });

  $(".plus").on("click", function (e) {
    if (!$(this).hasClass("disabled")) {
      $("#statNotice").hide();
      socket.emit("allocateStat", {
        id: $(this).attr("id"),
      });
    }
  });

  $("#inventoryPagePrev").on("click", function () {
    const ipn = $("#inventoryPageNumber");
    current = parseInt(ipn.attr("current"));
    last = parseInt(ipn.attr("last"));
    if (current === 1) {
      current = last;
    } else {
      current--;
    }
    ipn.attr("current", current);
    populateInventory(ipn.attr("tab"));
  });

  $("#inventoryPageNext").on("click", function () {
    const ipn = $("#inventoryPageNumber");
    current = parseInt(ipn.attr("current"));
    last = parseInt(ipn.attr("last"));
    if (current === last) {
      current = 1;
    } else {
      current++;
    }
    ipn.attr("current", current);
    populateInventory(ipn.attr("tab"));
  });

  $("#tipPagePrev").on("click", function () {
    $("#tip").attr(
      "index",
      parseInt($("#tip").attr("index")) - 1 > 0
        ? parseInt($("#tip").attr("index")) - 1
        : protips.length
    );
    showProtip();
  });

  $("#tipPageNext").on("click", function () {
    $("#tip").attr("index", parseInt($("#tip").attr("index")) + 1);
    showProtip();
  });

  $("#chatSubmit").on("click", submitMessage);

  $(".close").on("click", function (e) {
    $("#" + $(this).parent().attr("id") + "Button").removeClass("open");
    $(this).parent().fadeOut(200);
    if ($(this).parent().attr("id") === "inventory") {
      $("#shopPanel").fadeOut(200);
    }
  });

  $("#registerBtn").on("click", function (e) {
    let valid = true;
    if ($("#pass").val() !== $("#repass").val()) {
      showMessage("passwords do not match", "red");
      valid = false;
      $("#pass").focus();
    }
    if ($("#pass").val().length < 8) {
      showMessage("password must be at least 8 characters", "red");
      valid = false;
      $("#pass").focus();
    }
    if ($("#repass").val() === "") {
      showMessage("field is required", "red");
      valid = false;
      $("#repass").focus();
    }
    if ($("#pass").val() === "") {
      showMessage("field is required", "red");
      valid = false;
      $("#pass").focus();
    }
    if ($("#user").val() === "") {
      showMessage("field is required", "red");
      valid = false;
      $("#user").focus();
    }
    if (valid) {
      socket.emit("register", {
        username: $("#user").val(),
        password: $("#pass").val(),
      });
    }
  });

  $("body").on("keyup", function (e) {
    if (e.keyCode === 17) {
      if ($("#shopPanel").is(":visible")) {
        shopObject.ctrl = false;
        populateShopPrompt(shopObject);
      }
    }
  });

  $("body").on("keydown", function (e) {
    if (
      (!$("#chatText").is(":focus") &&
        !$("#user").is(":focus") &&
        !$("#pass").is(":focus") &&
        !$("#repass").is(":focus")) ||
      e.keyCode === 27
    ) {
      if (e.keyCode === 73) {
        // I
        $("#inventoryButton").trigger("click");
      } else if (e.keyCode === 84) {
        // T
        $("#equipmentButton").trigger("click");
      } else if (e.keyCode === 66) {
        // B
        $("#bestiaryButton").trigger("click");
      } else if (e.keyCode === 67) {
        // C
        $("#statsButton").trigger("click");
      } else if (e.keyCode === 83) {
        // S
        $("#skillsButton").trigger("click");
      } else if (e.keyCode === 72) {
        // H
        $("#helpButton").trigger("click");
      } else if (e.keyCode === 17) {
        // CTRL
        if ($("#shopPanel").is(":visible") && !shopObject.ctrl) {
          shopObject.ctrl = true;
          populateShopPrompt(shopObject);
        }
      } else if (e.keyCode === 27) {
        // ESC
        if (
          $("#stats").is(":visible") ||
          $("#bestiary").is(":visible") ||
          $("#equipment").is(":visible") ||
          $("#inventory").is(":visible") ||
          $("#chat").is(":visible") ||
          $("#help").is(":visible") ||
          $("#credits").is(":visible") ||
          $("#options").is(":visible") ||
          $("#notes").is(":visible") ||
          $("#tips").is(":visible") ||
          $("#skills").is(":visible")
        ) {
          $("#tips").fadeOut(200);
          $("#stats").fadeOut(200);
          $("#skills").fadeOut(200);
          $("#bestiary").fadeOut(200);
          $("#equipment").fadeOut(200);
          $("#inventory").fadeOut(200);
          $("#chat").fadeOut(200);
          $("#help").fadeOut(200);
          $("#credits").fadeOut(200);
          $("#options").fadeOut(200);
          $("#notes").fadeOut(200);
          $("#shopPanel").fadeOut(200);
          $("#statsButton").removeClass("open");
          $("#bestiaryButton").removeClass("open");
          $("#equipmentButton").removeClass("open");
          $("#chatButton").removeClass("open");
          $("#inventoryButton").removeClass("open");
          $("#helpButton").removeClass("open");
        } else {
          $("#mainMenuButton").trigger("click");
        }
      } else if ([49, 50, 51, 52].includes(e.keyCode)) {
        // combat items (1-4)
        playerItem = player.combatItems["s" + (e.keyCode - 49)];
        if (playerItem && playerItem !== -1) {
          const qty = player.items[playerItem]
            ? player.items[playerItem].quantity
            : 0;
          if (
            qty > 0 &&
            $(".combatItemSlot[itemId=" + playerItem + "]").find(".coverItem")
              .length === 0
          ) {
            if (items[playerItem].type !== "combat") {
              socket.emit("useItem", {
                id: playerItem,
              });
              player.items[playerItem].quantity--;
              populateInventory();
              populateCombatItemPanel();
              $('div[itemId="' + playerItem + '"]').each(function () {
                const cover = $(document.createElement("div"));
                cover.addClass("coverItem");
                $(this).append(cover);
                cover.animate(
                  { height: "0px" },
                  items[playerItem].cooldown * 1.1,
                  "linear",
                  function () {
                    this.remove();
                  }
                );
              });
            } else {
              if (player.target && player.target.type === "enemies") {
                socket.emit("useCombatItem", {
                  id: playerItem,
                });
              } else {
                queuedAction = { type: "item", id: playerItem };
                $('div[itemId="' + playerItem + '"]').each(function () {
                  $(this).addClass("queued");
                });
              }
            }
          }
        }
      } else if ([81, 87, 69, 82].includes(e.keyCode)) {
        // combat skills (Q,W,E,R)
        value = player.combatSkills["s" + [81, 87, 69, 82].indexOf(e.keyCode)];
        if (value !== null && value !== -1) {
          cost =
            player.skills[value].cost.base +
            player.skills[value].cost.adder * player.skills[value].level;
          if (
            cost <= player.mana &&
            $(".combatSkillSlot[skillId=" + value + "]").find(".coverItem")
              .length === 0
          ) {
            if (player.skills[value].type !== "combat") {
              socket.emit("useSkill", {
                id: value,
              });
              player.mana = player.mana - cost;
              populateCombatSkillPanel();
              $('div[skillId="' + value + '"]').each(function () {
                const cover = $(document.createElement("div"));
                cover.addClass("coverItem");
                $(this).append(cover);
                cooldown =
                  player.skills[value].cooldown.base +
                  player.skills[value].cooldown.adder *
                    player.skills[value].level;
                cover.animate(
                  { height: "0px" },
                  cooldown * 1.1,
                  "linear",
                  function () {
                    this.remove();
                  }
                );
              });
            } else {
              if (player.target && player.target.type === "enemies") {
                socket.emit("useCombatSkill", {
                  id: value,
                });
              } else {
                queuedAction = { type: "skill", id: value };
                $('div[skillId="' + value + '"]').each(function () {
                  $(this).addClass("queued");
                });
              }
            }
          } else {
            // NOT ENOUGH MANA OR COOLDOWN
            console.log("not enough mana or cooling down");
          }
        }
        return;
      } else if (e.keyCode === 13) {
        // ENTER
        $("#chat").fadeIn(200);
        $("#chatNotice").hide();
        $("#chatText").focus();
        $("#chatButton").addClass("open");
      }
    } else {
      if (e.keyCode === 13) {
        // ENTER
        if ($("#chatText").val().length !== 0) {
          submitMessage();
        } else {
          $("#chat").fadeOut(200);
          $("#chatButton").removeClass("open");
        }
      }
    }
  });

  if (typeof Storage !== "undefined") {
    if (localStorage.getItem("chkActions") === "true") {
      $("#chkActions").addClass("selected");
    } else if (localStorage.getItem("chkActions") === "false") {
      $("#chkActions").removeClass("selected");
    }

    if (localStorage.getItem("chkProtips") === "true") {
      $("#chkProtips").addClass("selected");
    } else if (localStorage.getItem("chkProtips") === "false") {
      $("#chkProtips").removeClass("selected");
    }

    if (localStorage.getItem("musicVol")) {
      musicVol = localStorage.getItem("musicVol");
      $("#musicVol").val(musicVol);
      if (musicVol === "0") {
        $("#chkMusicVol").removeClass("selected");
      }
    }

    if (localStorage.getItem("sfxVol")) {
      sfxVol = localStorage.getItem("sfxVol");
      $("#sfxVol").val(sfxVol);
      if (sfxVol === "0") {
        $("#chkSfxVol").removeClass("selected");
      }
    }

    if (localStorage.getItem("chkCursor") === "true") {
      $("#chkCursor").addClass("selected");
    } else if (localStorage.getItem("chkCursor") === "false") {
      $("#chkCursor").removeClass("selected");
      const r = document.querySelector(":root");
      r.style.setProperty("--sword", "default");
      r.style.setProperty("--cursor", "default");
      r.style.setProperty("--cursor-active", "pointer");
    }
  }

  $("#musicVol").on("change", function () {
    if ($(this).val() === "0") {
      $("#chkMusicVol").removeClass("selected");
    } else {
      $("#chkMusicVol").addClass("selected");
    }
    localStorage.setItem("musicVol", $("#musicVol").val());
    gameSceneObj.music.setVolume(parseInt($("#musicVol").val()) / 100);
  });

  $("#chkMusicVol").on("click", function () {
    if ($("#musicVol").val() === "0") {
      $("#musicVol").val("40");
      $("#chkMusicVol").addClass("selected");
    } else {
      $("#musicVol").val("0");
      $("#chkMusicVol").removeClass("selected");
    }
    localStorage.setItem("musicVol", $("#musicVol").val());
    gameSceneObj.music.setVolume(parseInt($("#musicVol").val()) / 100);
  });

  $("#sfxVol").on("change", function () {
    if ($(this).val() === "0") {
      $("#chkSfxVol").removeClass("selected");
    } else {
      $("#chkSfxVol").addClass("selected");
    }
    localStorage.setItem("sfxVol", $("#sfxVol").val());
    gameSceneObj.soundController.setGlobalVolume(
      parseInt($("#sfxVol").val()) / 100
    );
  });

  $("#chkSfxVol").on("click", function () {
    if ($("#sfxVol").val() === "0") {
      $("#sfxVol").val("40");
      $("#chkSfxVol").addClass("selected");
    } else {
      $("#sfxVol").val("0");
      $("#chkSfxVol").removeClass("selected");
    }
    localStorage.setItem("sfxVol", $("#sfxVol").val());
    gameSceneObj.soundController.setGlobalVolume(
      parseInt($("#sfxVol").val()) / 100
    );
  });

  // maybe make a 'draggable' class?
  dragElement(document.getElementById("bestiary"));
  dragElement(document.getElementById("inventory"));
  dragElement(document.getElementById("stats"));
  dragElement(document.getElementById("equipment"));
  dragElement(document.getElementById("notes"));
  dragElement(document.getElementById("help"));
  dragElement(document.getElementById("credits"));
  dragElement(document.getElementById("mainMenu"));
  dragElement(document.getElementById("tips"));
  dragElement(document.getElementById("skills"));
  changeBestiaryPage();
});

function showMessage(text, color = "red") {
  window.clearTimeout(registerMessageTimeout);
  $("#regText").show();
  $("#regText").html(text.toUpperCase());
  $("#regText").css("color", color);
  registerMessageTimeout = setTimeout(function () {
    $("#regText").fadeOut(300);
  }, 4000);
}

function submitMessage() {
  const msg = $("#chatText").val();
  if (msg.length > 0) {
    $("#chatText").val("");
    if (msg !== "/clear") {
      socket.emit("chat", msg);
    } else {
      $("#chatLog").html("");
    }
  }
}

function startGame() {
  if (!game) {
    game = new Phaser.Game(config);
  }
}

function targetObject(pointer, obj, event) {
  // SHOULD BE A CLASS, MAYBE SAME AS DRAGGABLE?
  if (
    $(".npcPanel:hover").length +
      $("#inventory:hover").length +
      $("#equipment:hover").length +
      $("#quickButtons:hover").length +
      $("#chat:hover").length +
      $("#stats:hover").length !==
    0
  ) {
    return;
  }
  event.stopPropagation();
  $("#questPanel").fadeOut(200);
  if ($("#shopPanel").is(":visible")) {
    $("#inventory").fadeOut(200);
    $("#shopPanel").fadeOut(200);
    hidePanels();
  }
  if (
    player.target ===
    objects[obj.parentContainer.type][obj.parentContainer.hash]
  ) {
    if (queuedAction && obj.parentContainer.type === "enemies") {
      if (queuedAction.type === "item") {
        socket.emit("useCombatItem", {
          id: queuedAction.id,
        });
      } else {
        socket.emit("useCombatSkill", {
          id: queuedAction.id,
        });
      }
    } else {
      socket.emit("moveToTarget");
    }
  } else {
    player.target = objects[obj.parentContainer.type][obj.parentContainer.hash];
    targetSprite.destroy();
    targetSprite = gameSceneObj.add.sprite(0, 0, "selecter");
    targetSprite.visible = true;
    targetSprite.flashTween = gameSceneObj.tweens.add({
      targets: targetSprite,
      alphaTopLeft: 0.6,
      alphaTopRight: 0.6,
      duration: 1000,
      ease: "Linear",
      repeat: -1,
      yoyo: true,
    });
    if (obj.parentContainer.type !== "enemies") {
      targetSprite.tint = 0x00ff00;
    } else {
      targetSprite.tint = 0xff0000;
      populateBestiary(player.target.id);
    }
    if (targetSprite.parentContainer) {
      targetSprite.parentContainer.remove(targetSprite);
    }

    player.target.add(targetSprite);
    showTargetPanel();
    socket.emit("targetObject", {
      type: obj.parentContainer.type,
      hash: obj.parentContainer.hash,
      id: obj.parentContainer.id,
      spawn_id: player.target.spawn_id,
      parent_id: player.target.parent_id,
    });
    if ($("#chkActions").hasClass("selected")) {
      if (queuedAction && obj.parentContainer.type === "enemies") {
        if (queuedAction.type === "item") {
          socket.emit("useCombatItem", {
            id: queuedAction.id,
          });
        } else {
          socket.emit("useCombatSkill", {
            id: queuedAction.id,
          });
        }
      } else {
        socket.emit("moveToTarget");
      }
    } else {
      if (queuedAction && obj.parentContainer.type === "enemies") {
        if (queuedAction.type === "item") {
          socket.emit("useCombatItem", {
            id: queuedAction.id,
          });
        } else {
          socket.emit("useCombatSkill", {
            id: queuedAction.id,
          });
        }
      }
    }
  }
  $(".queued").removeClass("queued");
  queuedAction = null;
}

function forgetTarget() {
  player.target = null;
  targetSprite.visible = false;
  hidetargetPanel();
  socket.emit("forgetTarget");
}

function adjustStatus() {
  if (
    player.exp / player.expMax != statusBarM.list[1].scaleX &&
    !isNaN(player.exp / player.expMax)
  ) {
    statusBarM.list[1].tween = menuSceneObj.tweens.add({
      targets: statusBarM.list[1],
      scaleX: player.exp / player.expMax,
      duration: 75,
      ease: "Circ.easeOut",
    });
  }

  if (
    player.health / player.healthMax != statusBarL.list[1].scaleX &&
    !isNaN(player.health / player.healthMax)
  ) {
    statusBarL.list[1].tween = menuSceneObj.tweens.add({
      targets: statusBarL.list[1],
      scaleX: player.health / player.healthMax,
      duration: 75,
      ease: "Circ.easeOut",
    });
  }

  if (
    player.mana / player.manaMax != statusBarR.list[1].scaleX &&
    !isNaN(player.mana / player.manaMax)
  ) {
    statusBarR.list[1].tween = menuSceneObj.tweens.add({
      targets: statusBarR.list[1],
      scaleX: player.mana / player.manaMax,
      duration: 75,
      ease: "Circ.easeOut",
    });
  }
}

function showTargetPanel() {
  targetPanel.list[3].setTexture(player.target.sprite.texture.key);
  targetPanel.list[3].setPosition(0, 0);
  targetPanel.list[4].text = player.target.name;
  if (player.target.type == "enemies") {
    targetPanel.list[5].text = "Level: " + player.target.level;
  } else if (player.target.type == "players") {
    targetPanel.list[3].setFrame(4);
    targetPanel.list[3].setPosition(11, 11);
    targetPanel.list[5].text =
      "Level " + player.target.level + " " + player.target.class;
  } else {
    targetPanel.list[5].text = player.target.title;
  }
  if (player.target.type == "portals") {
    targetPanel.list[3].x = 3;
    targetPanel.list[3].y = 4;
  } else if (player.target.type !== "players") {
    targetPanel.list[3].x = 3;
    targetPanel.list[3].y = 0;
  }
  targetPanel.tween = menuSceneObj.tweens.add({
    targets: targetPanel,
    x: 0,
    duration: 300,
    ease: "Linear",
  });
}

function hidetargetPanel() {
  targetPanel.tween = menuSceneObj.tweens.add({
    targets: targetPanel,
    x: -250,
    duration: 300,
    ease: "Linear",
  });
}

function attemptDestroy(obj) {
  try {
    obj.destroy();
    obj = null;
  } catch (error) {}
}

function showCollectionBar() {
  if (player.target) {
    collectionPanel = menuSceneObj.add.sprite(-77, -75, "collectionPanel");
    collectionGrad = menuSceneObj.add.sprite(-75, -73, "collectionGrad");
    collectionPanel.setOrigin(0, 0);
    collectionGrad.setOrigin(0, 0);
    collectionGrad.scaleX = 0;
    if (collectionGrad.tween) {
      collectionGrad.tween.stop();
      delete collectionGrad.tween;
    }
    collectionGrad.tween = menuSceneObj.tweens.add({
      targets: collectionGrad,
      scaleX: 1,
      duration: player.target.collectionTimer,
      ease: "Linear",
      onComplete: function () {
        hideCollectionBar();
        forgetTarget();
        player.collecting = false;
      },
    });
    player.add(collectionPanel);
    player.add(collectionGrad);
  }
}

function hideCollectionBar() {
  if (collectionGrad.tween) {
    collectionGrad.tween.stop();
    delete collectionGrad.tween;
  }
  collectionPanel.destroy();
  collectionGrad.destroy();
}

function populateQuestPanel(questObj) {
  attemptDestroy(questText);
  attemptDestroy(questBG);
  let text = [];
  _.each(questObj, function (quest) {
    text.push("");
    text.push(quest.name);
    _.each(quest.requirements, function (r) {
      let verb = "";
      let action = "";
      switch (r.type) {
        case "talk":
          verb = "talk to";
          break;
        case "return":
          verb = "return to";
          break;
        default:
          verb = r.type;
          action = "(" + r.progress + " / " + r.count + ")";
          break;
      }

      text.push(titleCase(" - " + verb + " " + r.name + " " + action));
    });
  });
  if (text.length > 0) {
    questText = menuSceneObj.add.text(
      1275,
      -10,
      text.join("\n"),
      styles["quests"]
    );
    questText.setOrigin(1, 0);
    questText.setScrollFactor(0, 0);
    questBG = menuSceneObj.add.rectangle(
      questText.x - 5 - questText.width,
      0,
      800,
      questText.height + 10,
      0x000000,
      0.6
    );
    questBG.setOrigin(0, 0);
    questBG.setDepth(1);
    questText.setDepth(2);
  }
}

function equipItem(item) {
  socket.emit("equipItem", { id: item.id });
  if (item.slot !== "accessory") {
    _.each(player.equipment, function (equipment) {
      if (equipment.slot === item.slot) {
        equipment.equipped = false;
      }
    });
  } else {
    let first = true;
    _.each(player.equipment, function (equipment) {
      if (equipment.slot === item.slot && equipment.equipped) {
        if (first) {
          first = false;
        } else {
          equipment.equipped = false;
        }
      }
    });
  }
  item.equipped = true;
}

function unequipItem(item) {
  socket.emit("unequipItem", { id: item.id });
  item.equipped = false;
}

function refreshScene() {
  removeGameSockets();
  forgetTarget();
  objects.players = {};
  objects.npcs = {};
  objects.enemies = {};
  objects.collectables = {};
  objects.receptacles = {};
  objects.portals = {};
  playerData = player;
  firstFrame = true;
  gameSceneObj.cameras.main.flash();
  $("#respawnPanel").hide();
  gameSceneObj.music.stop();
  gameSceneObj.scene.start("gameScene");
}
