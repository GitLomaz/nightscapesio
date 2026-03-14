function flyTitle() {
  text = textQueue.shift();
  titleDisplaying = true;
  let style = styles["titles"];
  style.stroke = text.color;
  let titleText = menuSceneObj.add.text(640, -175, text.data, style);
  titleText.fixedToCamera = true;
  titleText.setOrigin(0.5, 1);
  titleText.setScrollFactor(0, 0);
  titleText.tweenIn = menuSceneObj.tweens.add({
    targets: titleText,
    y: 175,
    duration: 800,
    ease: "Expo.easeOut",
    onComplete: function () {
      titleText.tweenHold = menuSceneObj.tweens.add({
        targets: titleText,
        y: 175,
        duration: 1000,
        ease: "Expo.easeOut",
        onComplete: function () {
          titleText.tweenOut = menuSceneObj.tweens.add({
            targets: titleText,
            alpha: 0,
            duration: 800,
            ease: "Expo.easeIn",
            onComplete: function () {
              titleDisplaying = false;
              this.targets[0].destroy();
            },
          });
        },
      });
    },
  });
}
function populateSkillPanel() {
  $("#skillList").html("");
  _.each(skills, function (skill) {
    let hide = skill.requirements.length !== 0;
    let disabled = skill.requirements.length !== 0;
    _.each(skill.requirements, function (req) {
      if (player.skills[req.id].level > 0) {
        hide = false;
      }
      if (player.skills[req.id].level >= req.level) {
        disabled = false;
      }
    });
    if (hide) {
      return;
    }
    let div = $(document.createElement("div"));
    div.html(
      "<div class='itemSlotOverlay' style='background-image:none'></div>"
    );
    div.addClass("itemSlot");
    div.addClass(skill.type);
    div.addClass("shopRowIcon");
    div.attr("type", "item");
    div.css("display", "block");
    div.html(
      "<div class='itemSlotOverlay' style='background-image: url(\"" +
        skill.image +
        "\")'></div>"
    );
    div.on({
      mouseenter: function (obj) {
        let tipDiv = generateSkillTooltip(skill, true, disabled);
        $(this).append(tipDiv);
      },
      mouseleave: function () {
        $("#tooltip").remove();
        $(this).removeClass("selected");
      },
      click: function (obj) {
        if ($(this).hasClass("selected")) {
          $(this).removeClass("selected");
          socket.emit("useSkill", {
            id: skill.id,
          });
        } else {
          $(this).addClass("selected");
        }
      },
    });
    let skillRow = $(document.createElement("div"));
    if (disabled) {
      skillRow.addClass("locked");
    }
    skillRow.addClass("skillRow");
    skillRow.append(div);
    let right =
      '<div class="skillRowRight"><div class="shopRowText">' +
      skill.name +
      '</div><div class="shopRowValue">' +
      player.skills[skill.id].level +
      " / " +
      skill.levels +
      "</div></div>";
    skillRow.append(right);
    if (player.skills[skill.id].level !== skill.levels) {
      let plus = $(document.createElement("div"));
      plus.addClass("skillPlus border");
      if (player.calculatedStats.skillPoints === 0 || disabled) {
        plus.addClass("disabled");
      } else {
        plus.on({
          click: function () {
            socket.emit("allocateSkill", {
              id: skill.id,
            });
          },
        });
      }
      skillRow.append(plus);
    }
    $("#skillList").append(skillRow);
    $("#skillPoints").html(
      "Skill Points: " + player.calculatedStats.skillPoints
    );
  });
}

function populateShopPrompt(shopObj = shopObject) {
  shopObject = shopObj;
  ctrl = shopObject.ctrl;
  $("#shopItems").html("");
  $("#shopText").html(shopObj.text);
  if (!shopObj.items) {
    $("#shopCtrlClick").hide();
  } else {
    $("#shopCtrlClick").show();
  }
  _.each(shopObj.items, function (id) {
    let div = $(document.createElement("div"));
    let item = items[id];
    div.html(
      "<div class='itemSlotOverlay' style='background-image:none'></div>"
    );
    div.addClass("itemSlot");
    div.addClass(item.type);
    div.addClass("shopRowIcon");
    div.attr("type", "item");
    div.css("display", "block");
    div.html(
      "<div class='itemSlotOverlay' style='background-image: url(\"" +
        item.image +
        "\")'>" +
        (ctrl ? "10" : "") +
        "</div>"
    );
    div.on({
      mouseenter: function (obj) {
        let tipDiv = generateTooltip(id, "item", true);
        $(this).append(tipDiv);
      },
      mouseleave: function () {
        $("#tooltip").remove();
        $(this).removeClass("selected");
      },
      click: function (obj) {
        if ($(this).hasClass("selected")) {
          $(this).removeClass("selected");
          socket.emit("buyItem", {
            id: id,
            qty: ctrl ? 10 : 1,
          });
        } else {
          $(this).addClass("selected");
        }
      },
    });
    let shopRow = $(document.createElement("div"));
    shopRow.addClass("shopRow");
    shopRow.append(div);
    const cantAfford =
      (ctrl ? item.value * 10 : item.value) > player.gold ? "pricy" : "";
    shopRow.append(
      '<div class="shopRowRight"><div class="shopRowText">' +
        item.name +
        '</div><div class="shopRowValue ' +
        cantAfford +
        '">' +
        numberWithCommas(ctrl ? item.value * 10 : item.value) +
        " Gold</div></div>"
    );
    $("#shopItems").append(shopRow);
  });

  let magicTotal = 0;
  let commonTotal = 0;

  _.each(player.equipment, function (equip) {
    if (!equip.equipped) {
      if (equip.rarity === 4 && !equip.deleted) {
        commonTotal = commonTotal + Math.floor(equip.cost / 11);
      } else if (equip.rarity === 3 && !equip.deleted) {
        magicTotal = magicTotal + Math.floor(equip.cost / 11);
      }
    }
  });

  $("#bulkCommon").addClass("disabled");
  $("#bulkMagic").addClass("disabled");

  $("#bulkCommonGold").html(numberWithCommas(commonTotal));
  $("#bulkMagicGold").html(numberWithCommas(magicTotal));

  if (commonTotal > 0) {
    $("#bulkCommon").removeClass("disabled");
  }
  if (magicTotal > 0) {
    $("#bulkMagic").removeClass("disabled");
  }

  _.each(shopObj.equipment, function (id) {
    let div = $(document.createElement("div"));
    let item = equipment[id];
    item = evaluateEquipment(Object.assign(item, equipmentClass[item.class]));
    div.html(
      "<div class='itemSlotOverlay' style='background-image:none'></div>"
    );
    div.addClass("itemSlot");
    div.addClass("itemSlotEquiment");
    div.addClass("normal");
    div.attr("type", "item");
    div.attr("itemId", item.id);
    div.attr("itemClass", item.type);
    div.html(
      "<div class='itemSlotOverlay' style='background-image: url(\"" +
        item.image +
        "\")'></div>"
    );
    div.on({
      mouseenter: function (obj) {
        let tipDiv = generateEquipmentTooltip(item, true);
        $(this).append(tipDiv);
      },
      mouseleave: function () {
        $("#tooltip").remove();
        $(this).removeClass("selected");
      },
      click: function (obj) {
        if ($(this).hasClass("selected")) {
          $(this).removeClass("selected");
          socket.emit("buyEquipment", {
            id: id,
          });
          populateShopPrompt();
        } else {
          $(this).addClass("selected");
        }
      },
    });
    let shopRow = $(document.createElement("div"));
    shopRow.addClass("shopRow");
    shopRow.append(div);
    const cantAfford = item.cost > player.gold ? "pricy" : "";
    shopRow.append(
      '<div class="shopRowRight"><div class="shopRowText">' +
        item.name +
        '</div><div class="shopRowValue ' +
        cantAfford +
        '">' +
        numberWithCommas(item.cost) +
        " Gold</div></div>"
    );
    $("#shopItems").append(shopRow);
  });
  $("#shopPanel").fadeIn(200);
  $("#inventory").fadeIn(200);
}

function populateQuestPrompt(questObj) {
  let quest = questObj.quest;
  let status = questObj.status;
  let script = "";
  $("#questBtn1").hide();
  $(".hiddenWhenNoAction").hide();
  if (status === 2) {
    script = quest.doneText;
    $("#questTitle").html(quest.name);
    $("#questScript").html(script);
  } else {
    $(".hiddenWhenNoAction").show();
    if (status === 0) {
      script = quest.texts.startText;
      $("#questBtn1").html("ACCEPT");
      $("#questBtn1").show();
    } else if (status === 1) {
      if (quest.requirements[quest.step].return) {
        script = quest.texts.completeText;
        $("#questBtn1").html("COMPLETE");
        $("#questBtn1").show();
      } else {
        script = quest.texts.progressText;
      }
    }
    $("#questTitle").html(quest.name);
    $("#questScript").html(script);

    let slotCount = 0;

    $('[id^="questRew-"]').hide();
    _.each(quest.rewards.equipment, function (item) {
      const equip = equipment[item];
      questRow = $("#questRew-" + slotCount);
      questRow.removeClass();
      questRow.addClass("questItem");
      questRow.addClass("itemSlot");
      questRow.addClass(equip.type);
      questRow.attr("type", "equip");
      questRow.attr("itemId", item);
      questRow.attr("itemClass", equip.type);
      html =
        "<div class='itemSlotOverlay' style='background-image: url(\"" +
        equip.image +
        "\")'></div>";
      questRow.html(html);
      questRow.show();
      slotCount++;
    });
    _.each(quest.rewards.items, function (item) {
      if (item.count > 0) {
        questRow = $("#questRew-" + slotCount);
        questRow.removeClass();
        questRow.addClass("questItem");
        questRow.addClass("itemSlot");
        questRow.addClass(items[item.id].type);
        questRow.attr("type", "item");
        questRow.attr("itemId", item.id);
        html =
          "<div class='itemSlotOverlay' style='background-image: url(\"" +
          items[item.id].image +
          "\")'>" +
          item.count +
          "</div>";
        questRow.html(html);
        questRow.show();
        slotCount++;
      }
    });
    if (quest.rewards.gold) {
      questRow = $("#questRew-" + slotCount);
      questRow.removeClass();
      questRow.addClass("questItem");
      questRow.addClass("itemSlot");
      questRow.addClass("gold");
      questRow.attr("type", "gold");
      questRow.attr("itemId", quest.rewards.gold);
      html =
        "<div class='itemSlotOverlay' style='background-image: url(\"./images/sprites/items/material_123.png\")'>" +
        numberWithCommas(quest.rewards.gold) +
        "</div>";
      questRow.html(html);
      questRow.show();
      slotCount++;
    }
    if (quest.rewards.exp) {
      questRow = $("#questRew-" + slotCount);
      questRow.removeClass();
      questRow.addClass("questItem");
      questRow.addClass("itemSlot");
      questRow.addClass("exp");
      questRow.attr("type", "exp");
      questRow.attr("itemId", quest.rewards.exp);
      html =
        "<div class='itemSlotOverlay' style='background-image: url(\"./images/sprites/items/skill_212.png\")'>" +
        quest.rewards.exp +
        "</div>";
      questRow.html(html);
      questRow.show();
      slotCount++;
    }

    slotCount = 0;
    $('[id^="questReq-"]').hide();
    _.each(quest.requirements[0].collect, function (item) {
      questRow = $("#questReq-" + slotCount);
      questRow.removeClass();
      questRow.addClass("questItem");
      questRow.addClass("itemSlot");
      questRow.addClass(items[item.id].type);
      questRow.attr("type", "item");
      questRow.attr("itemId", item.id);
      html =
        "<div class='itemSlotOverlay' style='background-image: url(\"" +
        items[item.id].image +
        "\")'>" +
        item.count +
        "</div>";
      questRow.html(html);
      questRow.show();
      slotCount++;
    });
  }
  $("#questPanel").fadeIn(200);
}

function generateTooltip(id, type = "default", vendor = false) {
  if (type !== "equip") {
    ret = "";
    switch (type) {
      case "item":
        ret =
          "<div style='text-align: center'><strong>" +
          items[id].name +
          "</strong></div><br/>";
        let script = "";
        if (items[id].type !== "kill") {
          script = items[id].script;
          ret +=
            "<strong>Type:</strong> " + capitalize(items[id].type) + "<br/>";
          if (items[id].type !== "quest") {
            ret +=
              "<strong>Value:</strong> " +
              Math.floor(items[id].value / 11) +
              "<br/>";
          }
        } else {
          if (items[id].level) {
            ret += "<strong>Level:</strong> " + items[id].level + "<br/>";
          }
          script = _.result(
            _.find(enemies, function (enemy) {
              return enemy.name === items[id].name;
            }),
            "description"
          );
        }
        ret += "<br/><span style='font-style:italic;'>" + script + "</span>";
        if (items[id].value) {
          if (vendor) {
            ret +=
              '<sub style="font-size:10px;float:right;margin-top:18px">' +
              numberWithCommas(items[id].value) +
              " Gold</sub>";
          } else {
            ret +=
              '<sub style="font-size:10px;float:right;margin-top:18px">' +
              numberWithCommas(Math.floor(items[id].value / 11)) +
              " Gold</sub>";
          }
        }
        break;
      case "gold":
        ret =
          "<strong>Gold:</strong> " +
          id +
          "<br/><br/><span style='font-style:italic;'>A handful of shiny gold!</span>";
        break;
      case "exp":
        exp = Math.floor((id / player.expMax) * 100);
        ret =
          "<strong>Experience:</strong> " +
          id +
          "<br/><br/><span style='font-style:italic;'>Roughly a " +
          exp +
          "% increase at your current level!</span>";
        break;
      default:
        ret = id;
        break;
    }
    let tipDiv = $(document.createElement("div"));
    tipDiv.attr("id", "tooltip");
    tipDiv.addClass("tooltip border");
    tipDiv.html(ret);
    tipDiv.on({
      mouseenter: function (obj) {
        $(this).remove();
      },
    });
    return tipDiv;
  } else {
    return generateEquipmentTooltip(equipment[id]);
  }
}

function generateEquipmentTooltip(item, vendor = false) {
  $("#tooltip").remove();
  ret =
    "<div style='text-align: center; margin-bottom: 5px;'><strong>" +
    colorName(item.name, item.type) +
    "</strong></div>";
  ret += "<strong>Type:</strong> " + capitalize(item.slot) + "<br/>";
  if (item.slot === "weapon") {
    ret +=
      "<strong>Damage: </strong>" +
      item.stats.damageMin +
      " - " +
      item.stats.damageMax +
      "<br/>";
    ret +=
      "<strong>Attack Speed: </strong>" +
      (150 - item.stats.attackSpeed) +
      "<br/>";
  } else {
    if (item.stats.armor) {
      ret += "<strong>Armor:</strong> " + item.stats.armor + "<br/>";
    }
    if (item.stats.block) {
      ret += "<strong>Block:</strong> " + item.stats.block + "%<br/>";
    }
  }
  ret += "<br/>";
  _.each(item.bonuses, function (bonus, key) {
    ret += generateStatString(key, bonus) + "<br/>";
  });
  if (item.type === "unique") {
    ret += "<br/>" + item.script + "<br/>";
  }
  if (!vendor) {
    ret +=
      '<sub style="font-size:10px;float:right;margin-top:10px">' +
      numberWithCommas(Math.floor(item.cost / 11)) +
      " Gold</sub>";
  } else {
    ret +=
      '<sub style="font-size:10px;float:right;margin-top:10px">' +
      numberWithCommas(item.cost) +
      " Gold</sub>";
  }

  let tipDiv = $(document.createElement("div"));
  tipDiv.attr("id", "tooltip");
  tipDiv.addClass("tooltip border");
  tipDiv.html(ret);
  tipDiv.on({
    mouseenter: function (obj) {
      $(this).remove();
    },
  });
  return tipDiv;
}

function generateSimpleTooltip(text) {
  let ret =
    "<div style='text-align: center'><strong>" + text + "</strong></div>";
  let tipDiv = $(document.createElement("div"));
  tipDiv.attr("id", "tooltip");
  tipDiv.addClass("tooltip border");
  tipDiv.html(ret);
  tipDiv.on({
    mouseenter: function (obj) {
      $(this).remove();
    },
  });
  return tipDiv;
}

function generateSkillTooltip(skill, detail = false, showRequirements = false) {
  playerSkill = player.skills[skill.id];
  ret =
    "<div style='text-align: center'><strong>" +
    skill.name +
    "</strong></div><br/>";
  if (!detail) {
    ret +=
      "<strong>" +
      skill.verb +
      ": </strong>" +
      getSkillValueString(skill, playerSkill.level) +
      "<br/>";
    ret +=
      "<br/><span style='font-style:italic;'>" + skill.description + "</span>";
  } else {
    if (playerSkill.level > 0) {
      ret += "<strong>Current Level: </strong><br/>";
      ret +=
        "<strong>" +
        skill.verb +
        ": </strong>" +
        getSkillValueString(skill, playerSkill.level) +
        "<br/>";
      if (skill.type !== "passive") {
        ret +=
          "<strong>Cost: </strong>" +
          getSkillCostString(skill, playerSkill.level) +
          " Mana<br/><br/>";
      }
    }
    if (playerSkill.level !== skill.levels) {
      ret += "<strong>Next Level: </strong><br/>";
      ret +=
        "<strong>" +
        skill.verb +
        ": </strong>" +
        getSkillValueString(skill, playerSkill.level + 1) +
        "<br/>";
      if (skill.type !== "passive") {
        ret +=
          "<strong>Cost: </strong>" +
          getSkillCostString(skill, playerSkill.level + 1) +
          " Mana<br/><br/>";
      }
    }
    ret +=
      "<br/><span style='font-style:italic;'>" + skill.description + "</span>";
    if (showRequirements) {
      ret +=
        "<br/><br/><span style='font-style:italic; color:#A30000'>Requires:<br/>";
      _.each(skill.requirements, function (r) {
        if (r.level > player.skills[r.id].level) {
          ret += "Level " + r.level + " " + skills[r.id].name;
        }
      });
      ret += "</span>";
    }
  }

  let tipDiv = $(document.createElement("div"));
  tipDiv.attr("id", "tooltip");
  tipDiv.addClass("tooltip border");
  tipDiv.html(ret);
  tipDiv.on({
    mouseenter: function (obj) {
      $(this).remove();
    },
  });
  return tipDiv;
}

function generateEffectTooltip(effect) {
  ret =
    "<div style='text-align: center'><strong>" +
    effect.name +
    "</strong></div><br/>";
  ret += effect.description;
  if (effect.showRemaining) {
    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    let time = timestampDifference(
      effect.start,
      secondsSinceEpoch - effect.duration
    );
    ret += '<div style="position:absolute; bottom:2px;">' + time + "</div>";
  }

  let tipDiv = $(document.createElement("div"));
  tipDiv.attr("id", "tooltip");
  tipDiv.addClass("tooltip border");
  tipDiv.html(ret);
  tipDiv.on({
    mouseenter: function (obj) {
      $(this).remove();
    },
  });
  return tipDiv;
}

function hidePanels() {
  if ($(".npcPanel").is(":visible")) {
    $("#inventory").fadeOut(200);
  }
  $(".npcPanel").fadeOut(200);
  $("#combatSelect").fadeOut(200);
}

function generateInventory() {
  for (let i = 0; i < 32; i++) {
    let div = $(document.createElement("div"));
    div.addClass("itemSlotEmpty");
    div.html(
      "<div class='itemSlotOverlay' style='background-image:none'></div>"
    );
    $("#inventoryItems").append(div);
  }
}

function generateCombatSelect() {
  let removeDiv = $(document.createElement("div"));
  removeDiv.addClass("itemSlot");
  removeDiv.addClass("itemSlotCombatSelect");
  removeDiv.attr("type", "item");
  removeDiv.attr("itemId", -1);
  removeDiv.html(
    "<div class='itemSlotOverlay' style='background-image: url(\"../images/removeItem.png\")'></div>"
  );
  removeDiv.on({
    mouseenter: function () {
      let html =
        "<div id='tooltip' class='tooltip border' style='left:-30px;'>Remove Equipped Combat Item</div>";
      $(this).append(html);
    },
    mouseleave: function () {
      $("#tooltip").remove();
      $(this).removeClass("selected");
    },
    click: function () {
      $("#combatSelect").fadeOut(200);
      socket.emit("equipConbatItem", {
        id: -1,
        slot: $("#combatSelect").attr("index"),
      });
      player.combatItems["s" + $("#combatSelect").attr("index")] = -1;
      populateCombatItemPanel();
    },
  });
  $("#combatSelect").append(removeDiv);
  _.each(items, function (item) {
    if ((item.type == "usable" && item.equippable) || item.type == "combat") {
      let div = $(document.createElement("div"));
      div.addClass("itemSlot");
      div.addClass("itemSlotCombatSelect");
      div.addClass(item.type);
      div.attr("type", "item");
      div.attr("itemId", item.id);
      div.attr("itemClass", item.type);
      div.html(
        "<div class='itemSlotOverlay' style='background-image: url(\"" +
          item.image +
          "\")'></div>"
      );
      div.on({
        mouseenter: function (obj) {
          let tipDiv = generateTooltip(
            $(this).attr("itemId"),
            $(this).attr("type")
          );
          $(this).append(tipDiv);
        },
        mouseleave: function () {
          $("#tooltip").remove();
          $(this).removeClass("selected");
        },
        click: function (obj) {
          $("#combatSelect").fadeOut(200);
          socket.emit("equipConbatItem", {
            id: $(this).attr("itemId"),
            slot: $("#combatSelect").attr("index"),
          });
          player.combatItems["s" + $("#combatSelect").attr("index")] = parseInt(
            $(this).attr("itemId")
          );
          populateCombatItemPanel();
        },
      });
      $("#combatSelect").append(div);
    }
  });
}

function generateCombatSkillSelect() {
  let removeDiv = $(document.createElement("div"));
  removeDiv.addClass("itemSlot");
  removeDiv.addClass("skillSlotCombatSelect");
  removeDiv.attr("type", "skill");
  removeDiv.attr("skillId", -1);
  removeDiv.html(
    "<div class='itemSlotOverlay' style='background-image: url(\"../images/removeSkill.png\")'></div>"
  );
  removeDiv.on({
    mouseenter: function () {
      let html =
        "<div id='tooltip' class='tooltip border' style='left:-30px;'>Remove Equipped Combat Skill</div>";
      $(this).append(html);
    },
    mouseleave: function () {
      $("#tooltip").remove();
      $(this).removeClass("selected");
    },
    click: function () {
      $("#combatSkillSelect").fadeOut(200);
      socket.emit("equipConbatSkill", {
        id: -1,
        slot: $("#combatSkillSelect").attr("index"),
      });
      player.combatSkills["s" + $("#combatSkillSelect").attr("index")] = -1;
      populateCombatSkillPanel();
    },
  });
  $("#combatSkillSelect").append(removeDiv);
  _.each(skills, function (skill) {
    if (skill.type == "self" || skill.type == "combat") {
      let div = $(document.createElement("div"));
      div.addClass("itemSlot");
      div.addClass("skillSlotCombatSelect");
      div.addClass(skill.type);
      div.attr("type", "skill");
      div.attr("skillId", skill.id);
      div.attr("skillClass", skill.type);
      div.html(
        "<div class='itemSlotOverlay' style='background-image: url(\"" +
          skill.image +
          "\")'></div>"
      );
      div.on({
        mouseenter: function (obj) {
          let tipDiv = generateSkillTooltip(skill);
          $(this).append(tipDiv);
        },
        mouseleave: function () {
          $("#tooltip").remove();
          $(this).removeClass("selected");
        },
        click: function (obj) {
          $("#combatSkillSelect").fadeOut(200);
          socket.emit("equipConbatSkill", {
            id: $(this).attr("skillId"),
            slot: $("#combatSkillSelect").attr("index"),
          });
          player.combatSkills["s" + $("#combatSkillSelect").attr("index")] =
            parseInt($(this).attr("skillId"));
          populateCombatSkillPanel();
        },
      });
      $("#combatSkillSelect").append(div);
    }
  });
}

function generateCombatItemPanel() {
  for (let index = 0; index < 4; index++) {
    let emptyDiv = $(document.createElement("div"));
    emptyDiv.addClass("combatItemSlot");
    emptyDiv.addClass("combatItemSlotEmpty");
    emptyDiv.attr("itemId", -1);
    emptyDiv.attr("index", index);
    emptyDiv.html(
      "<div class='cisAmount'></div><div class='cisKey'>" +
        (index + 1) +
        "</div>"
    );
    emptyDiv.on({
      click: function () {
        populateCombatSelect();
        $("#combatSelect").fadeToggle(200);
        $("#combatSelect").attr("index", $(this).attr("index"));
      },
    });
    $("#combatItems").append(emptyDiv);

    _.each(items, function (item) {
      if (item.type == "usable" || item.type == "combat") {
        let div = $(document.createElement("div"));
        div.addClass("combatItemSlot");
        div.addClass("itemSlot");
        div.addClass(item.type);
        div.attr("type", "item");
        div.attr("itemId", item.id);
        div.attr("itemClass", item.type);
        div.attr("index", index);
        div.css("display", "none");
        div.html(
          "<div class='itemSlotOverlay' style='background-image: url(\"" +
            item.image +
            "\")'></div>"
        );
        div.on({
          mouseenter: function (obj) {
            let tipDiv = generateTooltip(
              $(this).attr("itemId"),
              $(this).attr("type")
            );
            $(this).append(tipDiv);
          },
          mouseleave: function () {
            $("#tooltip").remove();
            $(this).removeClass("selected");
          },
          click: function (obj) {
            populateCombatSelect();
            $("#combatSelect").fadeIn(200);
            $("#combatSelect").attr("index", $(this).attr("index"));
          },
        });
        $("#combatItems").append(div);
      }
    });
  }
  populateCombatItemPanel();
}

function generateCombatSkillPanel() {
  for (let index = 0; index < 4; index++) {
    let emptyDiv = $(document.createElement("div"));
    emptyDiv.addClass("combatSkillSlot");
    emptyDiv.addClass("combatSkillSlotEmpty");
    emptyDiv.attr("skillId", -1);
    emptyDiv.attr("index", index);
    let keys = ["Q", "W", "E", "R"];
    emptyDiv.html(
      "<div class='cisAmount'></div><div class='cisKey'>" +
        keys[index] +
        "</div>"
    );
    emptyDiv.on({
      click: function () {
        populateCombatSkillSelect();
        $("#combatSkillSelect").fadeToggle(200);
        $("#combatSkillSelect").attr("index", $(this).attr("index"));
      },
    });
    $("#combatSkills").append(emptyDiv);

    _.each(skills, function (skill) {
      if (skill.type == "self" || skill.type == "combat") {
        let div = $(document.createElement("div"));
        div.addClass("combatSkillSlot");
        div.addClass("itemSlot");
        div.addClass(skill.type);
        div.attr("type", "skill");
        div.attr("skillId", skill.id);
        div.attr("skillClass", skill.type);
        div.attr("index", index);
        div.css("display", "none");
        div.html(
          "<div class='itemSlotOverlay' style='background-image: url(\"" +
            skill.image +
            "\")'></div>"
        );
        div.on({
          mouseenter: function (obj) {
            let tipDiv = generateSkillTooltip(skill);
            $(this).append(tipDiv);
          },
          mouseleave: function () {
            $("#tooltip").remove();
            $(this).removeClass("selected");
          },
          click: function (obj) {
            populateCombatSkillSelect();
            $("#combatSkillSelect").fadeIn(200);
            $("#combatSkillSelect").attr("index", $(this).attr("index"));
          },
        });
        $("#combatSkills").append(div);
      }
    });
  }
  populateCombatSkillPanel();
}

function populateInventory(type) {
  let selectedDiv = $(".itemSlotInventory.selected");
  if (!type) {
    type = $(".itemFilterIcon.selected").attr("type");
  }
  $("#tooltip").remove();
  $(":hover").last().mouseenter();
  const showItems = [];
  let currentPage = 1;
  if (type !== "equip") {
    _.each(player.items, function (item) {
      if (item.quantity > 0 && items[item.id].type === type) {
        showItems.push(item);
      }
    });
  } else {
    player.equipment.sort(function (a, b) {
      if (a.rarity === b.rarity) {
        if (a.slot === b.slot) {
          if (a.cost > b.cost) return -1;
          if (a.cost < b.cost) return 1;
        }
        if (a.slot < b.slot) return -1;
        if (a.slot > b.slot) return 1;
      }
      if (a.rarity < b.rarity) return -1;
      if (a.rarity > b.rarity) return 1;
      return 0;
    });
    _.each(player.equipment, function (item) {
      if (!item.equipped && item.name !== "unarmed" && !item.deleted) {
        showItems.push(item);
      }
    });
  }
  if (showItems.length > 32) {
    $("#inventoryPages").show();
    $("#inventoryPageNumber").attr("last", Math.ceil(showItems.length / 32));
    if ($("#inventoryPageNumber").attr("tab") !== type) {
      $("#inventoryPageNumber").attr("tab", type);
      $("#inventoryPageNumber").attr("current", 1);
    } else {
      currentPage = $("#inventoryPageNumber").attr("current");
    }
    $("#inventoryPageNumber").html(
      currentPage + " / " + $("#inventoryPageNumber").attr("last")
    );
  } else {
    $("#inventoryPages").hide();
  }
  showItems.splice(0, (currentPage - 1) * 32);
  for (let i = 0; i < 32; i++) {
    const ele = $("#inventoryItems > div").eq(i);
    ele.off();
    ele.attr("class", "itemSlotEmpty");
    ele.attr("type", null);
    ele.attr("itemId", null);
    ele.attr("itemClass", null);
    const itemOverlay = ele.find(".itemSlotOverlay");
    itemOverlay.css("background-image", "none");
    itemOverlay.html("");
    if (showItems.length > 0) {
      const item = showItems.shift();
      ele.addClass("itemSlotInventory");
      ele.removeClass("itemSlotEmpty");
      ele.addClass("itemSlot");
      if (type !== "equip") {
        const itemTemplate = items[item.id];
        ele.addClass(type);
        ele.attr("type", "item");
        ele.attr("itemId", item.id);
        ele.attr("itemClass", itemTemplate.type);
        itemOverlay.css(
          "background-image",
          'url("' + itemTemplate.image + '")'
        );
        itemOverlay.html(item.quantity);
        if (item.newItem) {
          itemOverlay.append(
            '<div class="dot" style="margin-right: 2px; margin-top: 2px;"></div>'
          );
        }
        ele.on({
          mouseenter: function () {
            $(this).append(generateTooltip($(this).attr("itemId"), "item"));
            if (item.newItem) {
              delete item.newItem;
              itemOverlay.html(item.quantity);
              evaluateInventoryNotices();
              socket.emit("observeItem", {
                id: item.id,
              });
            }
          },
          mouseleave: function () {
            $("#tooltip").remove();
            $(this).removeClass("selected");
          },
          click: function () {
            if ($("#shopPanel").is(":visible")) {
              if ($(this).hasClass("selected")) {
                let qty = shopObject.ctrl ? 10 : 1;
                $(this).removeClass("selected");
                socket.emit("sellItem", {
                  id: item.id,
                  qty: qty,
                });
                player.items[item.id].quantity =
                  player.items[item.id].quantity - qty;
                populateInventory();
                populateShopPrompt();
              } else {
                $(this).addClass("selected");
              }
            } else {
              if (type === "usable") {
                if ($(this).hasClass("selected")) {
                  const itemId = $(this).attr("itemId");
                  socket.emit("useItem", {
                    id: itemId,
                  });
                  player.items[itemId].quantity--;
                  populateInventory();
                  if (player.items[itemId].quantity > 0) {
                    $('div[itemId="' + $(this).attr("itemId") + '"]').each(
                      function () {
                        const cover = $(document.createElement("div"));
                        cover.addClass("coverItem");
                        $(this).append(cover);
                        cover.animate(
                          { height: "0px" },
                          items[itemId].cooldown * 1.1,
                          "linear",
                          function () {
                            this.remove();
                          }
                        );
                      }
                    );
                  }
                  $(this).removeClass("selected");
                } else if ($(this).find(".coverItem").length === 0) {
                  $(this).addClass("selected");
                }
              }
            }
          },
        });
      } else {
        ele.addClass("itemSlotEquipment");
        ele.addClass(item.type);
        ele.attr("type", "item");
        ele.attr("itemId", item.id);
        ele.attr("itemClass", item.type);
        itemOverlay.css("background-image", 'url("' + item.image + '")');
        if (item.newItem) {
          itemOverlay.html(
            '<div class="dot" style="margin-right: 2px; margin-top: 2px;"></div>'
          );
        }

        ele.on({
          mouseenter: function () {
            if (item.newItem) {
              delete item.newItem;
              itemOverlay.html("");
              evaluateInventoryNotices();
              socket.emit("observeEquipment", {
                id: item.id,
              });
            }
            let tipDiv = generateEquipmentTooltip(item);
            $(this).append(tipDiv);
          },
          mouseleave: function () {
            $("#tooltip").remove();
            $(this).removeClass("selected");
          },
          click: function () {
            if ($("#shopPanel").is(":visible")) {
              if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
                socket.emit("sellEquipment", {
                  id: item.id,
                });
                item.deleted = true;
                populateInventory("equip");
                populateShopPrompt();
              } else {
                $(this).addClass("selected");
              }
            } else {
              if ($(this).hasClass("selected")) {
                equipItem(item);
                populateInventory("equip");
                populateEquipmentPanel();
                $(this).removeClass("selected");
              } else if ($(this).find(".coverItem").length === 0) {
                $(this).addClass("selected");
              }
            }
          },
        });
      }
    }
  }
  selectedDiv.addClass("selected");
  evaluateInventoryNotices();
}

function populateEquipmentPanel() {
  $("#tooltip").remove();
  $(":hover").last().mouseenter();
  $(".equipmentName").each(function () {
    $(this).html($(this).attr("default"));
  });
  $(".equipmentIcon").each(function () {
    $(this).html("");
    $(this).attr("itemId", null);
    stripItemClasses($(this));
  });
  let first = true;
  _.each(player.equipment, function (item) {
    if (item.name !== "unarmed" && item.equipped) {
      let string = "";
      if (item.slot === "accessory" && first) {
        string = "1";
        first = false;
      } else if (item.slot === "accessory") {
        string = "2";
      }
      const div = $("#" + item.slot + "Slot" + string + " > .equipmentIcon");
      stripItemClasses(div);
      $("#" + item.slot + "Slot" + string + " > .equipmentName").html(
        item.name
      );
      div.addClass(item.type);
      div.attr("itemId", item.id);
      div.html(
        "<div class='itemSlotOverlay' style='background-image: url(\"" +
          item.image +
          "\")'></div>"
      );
      div.off();
      div.on({
        mouseenter: function () {
          let tipDiv = generateEquipmentTooltip(item);
          $(this).append(tipDiv);
        },
        mouseleave: function () {
          $("#tooltip").remove();
          $(this).removeClass("selected");
        },
        click: function () {
          if ($(this).hasClass("selected")) {
            unequipItem(item);
            populateEquipmentPanel();
            stripItemClasses(div);
            div.attr("itemId", null);
            div.html("");
            populateInventory();
            $(this).removeClass("selected");
            $(this).off();
          } else if ($(this).find(".coverItem").length === 0) {
            $(this).addClass("selected");
          }
        },
      });
    }
  });
}

function populateCombatItemPanel() {
  $(".combatItemSlot").hide();
  $(".combatItemSlot").each(function (index) {
    const that = $(this);
    _.each(player.combatItems, function (value, index) {
      index = index.split("s")[1];
      if (!value) {
        value = -1;
      }
      if ($(that).attr("index") === index && $(that).attr("itemId") == value) {
        $(that).show();
        const qty = player.items[value] ? player.items[value].quantity : 0;
        $(that)
          .find(".itemSlotOverlay")
          .html(
            "<div class='cisAmount'>" +
              qty +
              "</div><div class='cisKey'>" +
              (parseInt(index) + 1) +
              "</div>"
          );
      }
    });
  });
}

function populateCombatSkillPanel() {
  let keys = ["Q", "W", "E", "R"];
  $(".combatSkillSlot").hide();
  $(".combatSkillSlot").each(function (index) {
    const that = $(this);
    _.each(player.combatSkills, function (value, index) {
      index = index.split("s")[1];
      value = value == null ? -1 : value;
      if ($(that).attr("index") === index && $(that).attr("skillId") == value) {
        $(that).show();
        cost =
          value !== -1
            ? player.skills[value].cost.base +
              player.skills[value].cost.adder * player.skills[value].level
            : "";
        $(that)
          .find(".itemSlotOverlay")
          .html(
            "<div class='cisCost'>" +
              cost +
              "</div><div class='cisKey'>" +
              keys[parseInt(index)] +
              "</div>"
          );
      }
    });
  });
}

function populateCombatSelect() {
  $(".itemSlotCombatSelect").hide();
  $(".itemSlotCombatSelect").each(function (index) {
    itemId = parseInt($(this).attr("itemid"));
    if (itemId === -1) {
      $(this).show();
    } else {
      const qty = player.items[itemId] ? player.items[itemId].quantity : 0;
      if (qty > 0) {
        $(this).show();
      }
    }
  });
}

function populateCombatSkillSelect() {
  $(".skillSlotCombatSelect").hide();
  $(".skillSlotCombatSelect").each(function (index) {
    skillId = parseInt($(this).attr("skillId"));
    if (skillId === -1 || player.skills[skillId].level > 0) {
      $(this).show();
    }
  });
}

function populateStatPanel() {
  $("#pointValue").html(player.calculatedStats.points);
  $("#statHeader").html(
    player.name + ", Level " + player.level + " " + player.class
  );

  $("#strValue").html(
    player.calculatedStats.strength +
      (player.statBonuses.strength || player.buffBonuses.strength
        ? " (+" +
          ((player.statBonuses.strength || 0) +
            (player.buffBonuses.strength || 0)) +
          ")"
        : "")
  );
  let cost = Math.floor(player.calculatedStats.strength / 10) + 2;
  $("#strCost").html(cost);
  if (cost > player.calculatedStats.points) {
    $("#strPlus").addClass("disabled");
  } else {
    $("#strPlus").removeClass("disabled");
  }

  $("#intValue").html(
    player.calculatedStats.intelligence +
      (player.statBonuses.intelligence || player.buffBonuses.intelligence
        ? " (+" +
          ((player.statBonuses.intelligence || 0) +
            (player.buffBonuses.intelligence || 0)) +
          ")"
        : "")
  );
  cost = Math.floor(player.calculatedStats.intelligence / 10) + 2;
  $("#intCost").html(cost);
  if (cost > player.calculatedStats.points) {
    $("#intPlus").addClass("disabled");
  } else {
    $("#intPlus").removeClass("disabled");
  }

  $("#vitValue").html(
    player.calculatedStats.vitality +
      (player.statBonuses.vitality || player.buffBonuses.vitality
        ? " (+" +
          ((player.statBonuses.vitality || 0) +
            (player.buffBonuses.vitality || 0)) +
          ")"
        : "")
  );
  cost = Math.floor(player.calculatedStats.vitality / 10) + 2;
  $("#vitCost").html(cost);
  if (cost > player.calculatedStats.points) {
    $("#vitPlus").addClass("disabled");
  } else {
    $("#vitPlus").removeClass("disabled");
  }

  $("#agiValue").html(
    player.calculatedStats.agility +
      (player.statBonuses.agility || player.buffBonuses.agility
        ? " (+" +
          ((player.statBonuses.agility || 0) +
            (player.buffBonuses.agility || 0)) +
          ")"
        : "")
  );
  cost = Math.floor(player.calculatedStats.agility / 10) + 2;
  $("#agiCost").html(cost);
  if (cost > player.calculatedStats.points) {
    $("#agiPlus").addClass("disabled");
  } else {
    $("#agiPlus").removeClass("disabled");
  }

  $("#dexValue").html(
    player.calculatedStats.dexterity +
      (player.statBonuses.dexterity || player.buffBonuses.dexterity
        ? " (+" +
          (player.statBonuses.dexterity ||
            0 + player.buffBonuses.dexterity ||
            0) +
          ")"
        : "")
  );
  cost = Math.floor(player.calculatedStats.dexterity / 10) + 2;
  $("#dexCost").html(cost);
  if (cost > player.calculatedStats.points) {
    $("#dexPlus").addClass("disabled");
  } else {
    $("#dexPlus").removeClass("disabled");
  }

  $("#statHealth").html(
    numberWithCommas(player.calculatedStats.health) +
      "/" +
      numberWithCommas(player.calculatedStats.healthMax)
  );
  $("#statMana").html(
    numberWithCommas(player.calculatedStats.mana) +
      "/" +
      numberWithCommas(player.calculatedStats.manaMax)
  );
  $("#statFlee").html(numberWithCommas(player.calculatedStats.dodge));
  $("#statAspd").html(150 - player.calculatedStats.attackSpeed);
  $("#statHit").html(numberWithCommas(player.calculatedStats.hit));
  $("#statAtk").html(numberWithCommas(player.calculatedStats.attack));
  $("#statMatk").html(numberWithCommas(player.calculatedStats.mAttack));
  $("#statDef").html(numberWithCommas(player.calculatedStats.defense));
  $("#statArmor").html(numberWithCommas(player.calculatedStats.armor));
  $("#statPer").html(numberWithCommas(player.calculatedStats.percision));
  $("#statCrit").html(numberWithCommas(player.calculatedStats.critRate));
  $("#statMod").html(numberWithCommas(player.calculatedStats.critMod));
}

function changeBestiaryPage(down = false) {
  targetId = $("#bestiary").attr("selectedEnemy");
  let enemy = enemies[targetId];
  let foundEnemyArray = [];
  let currentEnemy = 1;
  _.each(player.kills, function (k) {
    if (k.count > 0) {
      foundEnemyArray.push(k.id);
    }
    if (k.id === enemy.id) {
      currentEnemy = foundEnemyArray.length;
    }
  });

  if (down) {
    if (currentEnemy === 1) {
      currentEnemy = foundEnemyArray.length;
    } else {
      currentEnemy--;
    }
  } else {
    if (currentEnemy === foundEnemyArray.length) {
      currentEnemy = 1;
    } else {
      currentEnemy++;
    }
  }
  populateBestiary(foundEnemyArray[currentEnemy - 1], true);
  return foundEnemyArray[currentEnemy - 1];
}

function populateBestiary(targetId, lockOverride = false) {
  if (
    $("#bestiary").attr("selectedEnemy") === "-1" &&
    player.kills &&
    !targetId
  ) {
    $("#bestiary").attr("selectedEnemy", 0);
    targetId = changeBestiaryPage();
  } else if (!$("#bestiary").is(":visible")) {
    return;
  }

  if (
    (!$("#bestiaryPageLock").hasClass("selected") || lockOverride) &&
    targetId
  ) {
    $("#bestiary").attr("selectedEnemy", targetId);
  } else {
    targetId = $("#bestiary").attr("selectedEnemy");
  }

  let oldKills = $("#bestiary").attr("kills");
  let killCount = player.kills[targetId].count;

  if (oldKills !== killCount) {
    let enemy = enemies[targetId];
    let foundEnemies = 0;
    let currentEnemy = 1;
    _.each(player.kills, function (k) {
      if (k.count > 0) {
        foundEnemies++;
      }
      if (k.id === enemy.id) {
        currentEnemy = foundEnemies;
      }
    });

    if (killCount > 0) {
      $("#bLevel").html(enemy.level);
      $("#bestiaryIcon").css(
        "background-image",
        'url("../images/sprites/enemies/monster_' + enemy.image[0] + '.png"'
      );
      $("#bestiaryName").html(enemy.name);
      $("#bestiaryPageNumber").html(currentEnemy + " / " + foundEnemies);
    } else {
      $("#bLevel").html("??");
      $("#bestiaryIcon").css("background-image", 'url("../images/help.png"');
      $("#bestiaryName").html("??");
      $("#bestiaryPageNumber").html("? / " + foundEnemies);
    }
    if (killCount >= 10) {
      $("#bHealth").html(enemy.health);
    } else {
      $("#bHealth").html("??");
    }
    if (killCount >= 50) {
      $("#bAttack").html(enemy.attack.damage);
      $("#bDef").html(enemy.defense.def);
      $("#bArmor").html(enemy.defense.armor);
    } else {
      $("#bAttack").html("??");
      $("#bDef").html("??");
      $("#bArmor").html("??");
    }
    if (killCount >= 100) {
      $("#bHitRate").html(
        calculateHitRate(player.calculatedStats.hit, enemy.dodge) + "%"
      );
      $("#bDodgeRate").html(
        100 -
          calculateHitRate(enemy.attack.hit, player.calculatedStats.dodge) +
          "%"
      );
    } else {
      $("#bHitRate").html("??");
      $("#bDodgeRate").html("??");
    }
    $("#bestiaryStar").removeClass();
    $("#bestiaryStar").attr("toolTip", "");
    if (killCount >= 1000) {
      $("#bestiaryStar").addClass("gold");
      $("#bestiaryStar").attr(
        "toolTip",
        "+20% Gold Drops<br/>+10% Item Drops<br/>+15% Experence Gain"
      );
    } else if (killCount >= 500) {
      $("#bestiaryStar").addClass("silver");
      $("#bestiaryStar").attr("toolTip", "+20% Gold Drops<br/>+10% Item Drops");
    } else if (killCount >= 250) {
      $("#bestiaryStar").addClass("bronze");
      $("#bestiaryStar").attr("toolTip", "+20% Gold Drops");
    }
    $("#bKills").html(killCount);
  }
}

function stripItemClasses(div) {
  div.removeClass("normal");
  div.removeClass("usable");
  div.removeClass("magic");
  div.removeClass("rare");
  div.removeClass("unique");
}

function colorName(name, rarity) {
  let color = "inherit";
  switch (rarity) {
    case "magic":
      color = "#104274";
      break;
    case "rare":
      color = "#006546";
      break;
    case "unique":
      color = "#839500";
      break;
  }
  return "<span style='color:" + color + "'>" + name + "</span>";
}

function showProtip() {
  if (!$("#tips").is(":visible")) {
    $("#tips").fadeIn(200);
  }
  index =
    parseInt($("#tip").attr("index")) ||
    Math.floor(Math.random() * protips.length + 1);
  $("#tip").attr("index", index);
  $("#tip").html("Protip: " + protips[(index - 1) % protips.length]);
}

function generateStatString(key, bonus) {
  switch (key) {
    case "damageMax":
      key = " Max Damage";
      break;
    case "healthMax":
      key = " Max Health";
      break;
    case "manaMax":
      key = " Max Mana";
      break;
    case "damageMin":
      key = " Min Damage";
      break;
    case "critRate":
      key = "% Critical Chance";
      break;
    case "critMod":
      key = "% Critical Damage";
      break;
    default:
      if (isNaN(key)) {
        key = " " + key.charAt(0).toUpperCase() + key.slice(1);
      } else {
        key = " Unknown";
      }

      break;
  }
  return "+" + bonus + key;
}

function getSkillValueString(skill, level) {
  let min = skill.value.base.min + skill.value.adder.min * level;
  let max = skill.value.base.max + skill.value.adder.max * level;
  return (
    (min === max
      ? Math.round(min * 10) / 10
      : Math.round(min * 10) / 10 + " - " + Math.round(max * 10) / 10) +
    (skill.value.suffix ? skill.value.suffix : "")
  );
}

function getSkillCostString(skill, level) {
  return skill.cost.base + skill.cost.adder * level;
}

function populateStatusEffects(effects) {
  $("#statusEffectBar").html("");
  _.each(effects, function (effect) {
    if (effect) {
      const now = new Date();
      const secondsSinceEpoch = Math.round(now.getTime() / 1000);
      if (
        effect.start > secondsSinceEpoch - effect.duration ||
        !effect.showRemaining
      ) {
        effect = Object.assign(effect, statusEffects[effect.id]);
        let div = $(document.createElement("div"));
        div.addClass("statusEffect");
        div.css("background-image", ' url("' + effect.image + '"');
        div.off();
        div.on({
          mouseenter: function () {
            let tipDiv = generateEffectTooltip(effect);
            $(this).append(tipDiv);
          },
          mouseleave: function () {
            $("#tooltip").remove();
          },
        });
        $("#statusEffectBar").append(div);
      }
    }
  });
  if ($(":hover").last().attr("id") === "statusEffectBar") {
    $(":hover").last().mouseenter();
  }
}

function timestampDifference(t1, t2) {
  diff = t1 - t2;
  var minutesDifference = Math.floor(diff / 60);
  diff -= minutesDifference * 60;
  var secondsDifference = Math.floor(diff);
  return (
    minutesDifference.toString().padStart(2, "0") +
    ":" +
    secondsDifference.toString().padStart(2, "0")
  );
}

function setDepth() {
  try {
    _.each(objects.collectables, function (obj) {
      obj.setDepth(1);
    });
    _.each(objects.receptacles, function (obj) {
      obj.setDepth(1);
    });
    _.each(objects.enemies, function (obj) {
      obj.setDepth(2);
    });
    _.each(objects.npcs, function (obj) {
      obj.setDepth(3);
    });
    _.each(objects.portals, function (obj) {
      obj.setDepth(4);
    });
    _.each(objects.players, function (obj) {
      obj.setDepth(5);
    });
  } catch (error) {}
}

function evaluateEquipment(equip) {
  if (
    equip.cost &&
    typeof equip.cost === "string" &&
    equip.cost.includes("{level}")
  ) {
    equip.cost = equip.cost.replace(/{level}/g, equip.level);
    equip.cost = eval(equip.cost);
  }
  if (
    equip.stats &&
    equip.stats.damageMin &&
    typeof equip.stats.damageMin === "string" &&
    equip.stats.damageMin.includes("{level}")
  ) {
    equip.stats.damageMin = equip.stats.damageMin.replace(
      /{level}/g,
      equip.level
    );
    equip.stats.damageMin = eval(equip.stats.damageMin);
  }
  if (
    equip.stats &&
    equip.stats.damageMax &&
    typeof equip.stats.damageMax === "string" &&
    equip.stats.damageMax.includes("{level}")
  ) {
    equip.stats.damageMax = equip.stats.damageMax.replace(
      /{level}/g,
      equip.level
    );
    equip.stats.damageMax = eval(equip.stats.damageMax);
  }
  if (
    equip.stats &&
    equip.stats.armor &&
    typeof equip.stats.armor === "string" &&
    equip.stats.armor.includes("{level}")
  ) {
    equip.stats.armor = equip.stats.armor.replace(/{level}/g, equip.level);
    equip.stats.armor = eval(equip.stats.armor);
  }
  if (
    equip.stats &&
    equip.stats.block &&
    typeof equip.stats.block === "string" &&
    equip.stats.block.includes("{level}")
  ) {
    equip.stats.block = equip.stats.block.replace(/{level}/g, equip.level);
    equip.stats.block = eval(equip.stats.block);
  }
  return equip;
}

function evaluateInventoryNotices() {
  $("#usableNotice").hide();
  $("#combatNotice").hide();
  $("#equipNotice").hide();
  $("#questNotice").hide();
  $("#miscNotice").hide();
  $("#inventoryNotice").hide();

  _.each(player.equipment, function (e) {
    if (e.newItem) {
      $("#equipNotice").show();
      $("#inventoryNotice").show();
    }
  });

  _.each(player.items, function (i) {
    if (i.newItem) {
      $("#" + items[i.id].type + "Notice").show();
      $("#inventoryNotice").show();
    }
  });
}
