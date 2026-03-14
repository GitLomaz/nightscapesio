const Maps = require("./Maps.js");
const Quest = require("./Quest.js");
const Item = require("./Item.js");
const Skill = require("./Skill.js");
const Kill = require("./Kill.js");
const Location = require("./Location.js");
const Receptacle = require("./Receptacle.js");
const Portal = require("./Portal.js");
const Collectable = require("./Collectable.js");
const Equipment = require("./Equipment.js");
const StatusEffect = require("./StatusEffect.js");
const Quests = require("../../client/data/quests.js");
const Items = require("../../client/data/items.js");
const Skills = require("../../client/data/skills.js");
const Animals = require("../../client/data/animals.js");
const Enemies = require("../../client/data/enemies.js");
const Levels = require("../../client/data/levels.js");
const statusEffects = require("../../client/data/statusEffects.js");
const Equipments = require("../../client/data/equipment.js");
const mysql = require("mysql");
const Sql = require("./util/Sql.js");
const Library = require("./util/Library.js");
const hash = require("object-hash");
const _ = require("lodash");
const { PerformanceObserver, performance } = require("perf_hooks");
const { unset } = require("lodash");

const conn = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || "nightscape",
});

class Player {
  constructor(characterId, token, local = false, guest = false) {
    this.id = characterId;
    this.moves = [];
    this.token = token;
    this.guest = guest;
    this.east = true;
    this.tickCount = 0;
    this.attackTickCount = false;
    this.attacking = false;
    this.dead = false;
    this.range = 1.75; //melee
    this.collecting = false;
    this.loaded = false;
    this.direction = 7;
    this.action = false;
    this.queuedAttack = false;
    this.equippedStats = {};
    this.gold = 0;
    this.combatItems = { s0: null, s1: null, s2: null, s3: null };
    this.combatSkills = { s0: null, s1: null, s2: null, s3: null };
    this.questReqString = [];
    this.statusEffects = [];
    this.chats = [];
    this.random = 0;
    this.ticksSinceSave = 0;
    this.equipment = [
      new Equipment(
        {
          id: -1,
          name: "unarmed",
          stats: {
            damageMin: 3,
            damageMax: 6,
            range: 1.75,
            attackSpeed: 60,
          },
          equipped: true,
          slot: "weapon",
        },
        this.id
      ),
    ];
    this.LoadEquipment();
    this.location = new Location({
      x: 0,
      y: 0,
      map: "The Void",
    });
    this.hashObj = {
      id: this.id,
      type: "player",
    };
    this.hash = hash(this.hashObj);

    const that = this;
    this.items = {};
    _.each(Items, function (i) {
      const item = _.cloneDeep(i);
      that.items[item.id] = new Item(item, that.id);
    });
    this.LoadItems();

    this.skills = {};
    _.each(Skills, function (s) {
      const skill = _.cloneDeep(s);
      that.skills[skill.id] = new Skill(skill, that.id);
    });
    this.LoadSkills();

    this.quests = {};
    _.each(Quests, function (q) {
      const quest = _.cloneDeep(q);
      that.quests[quest.id] = new Quest(quest, that.id);
    });
    this.LoadQuests();

    this.kills = {};
    _.each(Enemies, function (e) {
      that.kills[e.id] = new Kill(e.id);
    });
    this.LoadKills();

    // flag set if localhost
    this.local = local;
  }

  tick() {
    if (this.loaded) {
      this.tickCount++;
      this.ticksSinceSave++;
      let that = this;
      _.remove(this.chats, function (n) {
        return that.tickCount > n + 100;
      });
      if (this.attackTickCount !== false) {
        this.attackTickCount = this.attackTickCount + 10;
      }
      if (this.tickCount % this.calculatedStats.regen == 0) {
        this.regenerate();
      }
      if (this.tickCount % this.calculatedStats.moveSpeed == 0) {
        this.walk();
      }
      if (
        this.attackTickCount >= this.calculatedStats.attackSpeed ||
        this.attackTickCount === false
      ) {
        if (this.attackTickCount >= this.calculatedStats.attackSpeed) {
          this.attackTickCount =
            this.attackTickCount - this.calculatedStats.attackSpeed;
        }
        this.attackTarget();
      }
      if (this.tickCount % 50 == 0 && !this.dead) {
        this.restore(
          Math.floor(
            (this.calculatedStats.manaMax * this.calculatedStats.manaRegen) /
              100
          )
        );
      }
      if (this.tickCount % 60 == 0 && !this.dead) {
        this.heal(
          Math.floor(
            (this.calculatedStats.healthMax *
              this.calculatedStats.healthRegen) /
              1000
          )
        );
      }
      this.assessStatusEffects();
      this.checkHealingPool();
    }
  }

  allocateStat(stat) {
    let cost = 0;
    let statName = "";
    switch (stat) {
      case "strPlus":
        statName = "strength";
        break;
      case "intPlus":
        statName = "intelligence";
        break;
      case "vitPlus":
        statName = "vitality";
        break;
      case "agiPlus":
        statName = "agility";
        break;
      case "dexPlus":
        statName = "dexterity";
        break;
      default:
        break;
    }
    if (this.canAffordStat(statName)) {
      this.stats.points =
        this.stats.points - (Math.floor(this.stats[statName] / 10) + 2);
      this.stats[statName]++;
      return true;
    }
    return false;
  }

  canAffordStat(statName) {
    let cost = Math.floor(this.stats[statName] / 10) + 2;
    return this.stats.points >= cost;
  }

  allocateSkill(skillId) {
    this.skills[skillId].levelUp();
  }

  createOrLoadPlayer() {
    let that = this;
    if (!that.id) {
      return;
    }
    let query = "";
    if (this.local) {
      query =
        "SELECT c.*, a.tester FROM `character` c  inner join `account` a on c.account_id = a.index WHERE c.id = " +
        that.id +
        " limit 1;";
    } else if (!that.guest) {
      query =
        "SELECT c.*, a.tester FROM `character` c  inner join `account` a on c.account_id = a.index WHERE c.id = " +
        that.id +
        " AND a.token = '" +
        that.token +
        "';";
    } else {
      query = "SELECT *, 0 as tester FROM `character` where id = -1";
    }
    conn.query(query, function (error, result, fields) {
      if (error) {
        console.log(error);
      } else {
        if (result.length !== 0) {
          that.location = new Location({
            x: result[0].x,
            y: result[0].y,
            map: result[0].map,
          });
          that.tester = result[0].tester;
          that.health = result[0].health;
          that.mana = result[0].mana;
          that.exp = result[0].exp;
          that.level = result[0].level;
          that.expMax = Levels[result[0].level];
          that.loaded = true;
          that.name = result[0].name;
          that.gold = result[0].gold;
          that.class = result[0].class;
          that.combatItems = JSON.parse(result[0].combatItems);
          that.combatSkills = JSON.parse(result[0].combatSkills);
          that.stats = {
            strength: result[0].strength,
            vitality: result[0].vitality,
            agility: result[0].agility,
            dexterity: result[0].dexterity,
            intelligence: result[0].intelligence,
            points: result[0].points,
            skillPoints: result[0].skillPoints,
          };
          let SE = JSON.parse(result[0].statusEffects);
          const now = new Date();
          const secondsSinceEpoch = Math.round(now.getTime() / 1000);
          _.forEach(SE, function (effect) {
            const e = _.cloneDeep(statusEffects[effect.id]);
            that.statusEffects[effect.id] = new StatusEffect(
              Object.assign(e, {
                start: secondsSinceEpoch,
                duration: effect.duration,
              }),
              that.id
            );
          });
          that.setStatusEffectStats();
          if (that.guest) {
            Library.shuffleArray(Animals);
            that.name = "Guest " + Animals[0];
          }
          that.calculateStats();
          that.generateQuestStrings();
          let message = Library.encodeHTML(that.name + " Has Connected.");
          console.log(message);
          let msg = {
            message: message,
            sender: "System",
          };
          _.each(Library.SOCKET_LIST, function (s) {
            s.emit("chatMessage", msg);
          });
          if (Library.SOCKET_LIST[that.id]) {
            Library.SOCKET_LIST[that.id].emit(
              "recievePlayer",
              Object.assign(that.exportObj(), { tester: result[0].tester })
            );
          }
        }
      }
    });
  }

  LoadQuests() {
    let that = this;
    if (!that.id) {
      return;
    }
    conn.query(
      Sql.select("character_quest", { character_id: this.id }),
      function (error, result) {
        if (error) {
          console.log(error);
        } else {
          _.each(result, function (quest) {
            if (that.quests[quest.quest_id]) {
              that.quests[quest.quest_id].step = quest.step;
              that.quests[quest.quest_id].status = quest.status;
              that.quests[quest.quest_id].completed = quest.completed;
              that.quests[quest.quest_id].setProgress(that);
            }
          });
        }
      }
    );
  }

  LoadEquipment() {
    let that = this;
    if (!that.id) {
      return;
    }
    conn.query(
      Sql.select("character_equipment", { character_id: this.id, sold: 0 }),
      function (error, result) {
        if (error) {
          console.log(error);
        } else {
          _.each(result, function (e) {
            that.equipment.push(
              new Equipment(JSON.parse(e.itemString), that.id, "load")
            );
          });
          let i = that.equipment.filter((obj) => {
            return (
              obj.slot === "weapon" && obj.id !== -1 && obj.equipped === true
            );
          });
          if (i.length > 0) {
            let u = that.equipment.filter((obj) => {
              return obj.id === -1;
            })[0];
            u.equipped = false;
          }
          that.migration();
          that.setEquipmentStats();
        }
      }
    );
  }

  LoadItems() {
    let that = this;
    if (!that.id) {
      return;
    }
    let query =
      "SELECT * FROM `character_item` WHERE quantity > 0 and character_id = " +
      (this.guest ? -1 : this.id);
    conn.query(query, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        _.each(result, function (item) {
          if (that.items[item.item_id]) {
            that.items[item.item_id].quantity = item.quantity;
          }
        });
      }
    });
  }

  LoadSkills() {
    let that = this;
    if (!that.id) {
      return;
    }
    let query =
      "SELECT * FROM `character_skill` WHERE character_id = " +
      (this.guest ? -1 : this.id);
    conn.query(query, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        _.each(result, function (skill) {
          that.skills[skill.skill_id].level = skill.level;
        });
      }
    });
  }

  LoadKills() {
    let that = this;
    if (!that.id) {
      return;
    }
    let query =
      "SELECT * FROM `character_kills` WHERE character_id = " + this.id;
    conn.query(query, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        _.each(result, function (kill) {
          if (that.kills[kill.enemy_id]) {
            that.kills[kill.enemy_id].count = kill.quantity;
          }
        });
      }
    });
  }

  save(respawn = true, force = false) {
    if (respawn) {
      this.respawn();
    }
    if (this.ticksSinceSave < 500 && !force) {
      return;
    }
    this.ticksSinceSave = 0;
    let that = this;
    if (that.loaded && !that.guest) {
      let statusEffects = [];
      _.each(that.statusEffects, function (effect) {
        if (effect) {
          statusEffects.push({
            id: effect.id,
            duration: effect.duration,
            type: effect.type,
          });
        }
      });
      let sqln = Sql.update(
        "character",
        {
          map: that.location.map,
          x: that.location.x,
          y: that.location.y,
          health: that.health,
          mana: that.mana,
          level: that.level,
          strength: that.stats.strength,
          vitality: that.stats.vitality,
          agility: that.stats.agility,
          dexterity: that.stats.dexterity,
          intelligence: that.stats.intelligence,
          skillPoints: that.stats.skillPoints,
          points: that.stats.points,
          exp: that.exp,
          gold: that.gold,
          combatItems: JSON.stringify(that.combatItems),
          combatSkills: JSON.stringify(that.combatSkills),
          statusEffects: JSON.stringify(statusEffects),
        },
        { id: that.id }
      );
      conn.query(sqln);
      _.each(that.quests, function (quest) {
        if (quest.status !== 0 || quest.completed > 0) {
          const questObj = {
            character_id: that.id,
            quest_id: quest.id,
            status: quest.status,
            step: quest.step,
            completed: quest.completed,
          };
          conn.query(Sql.upsert("character_quest", questObj));
        }
      });
      _.each(that.kills, function (kill) {
        if (kill.count > 0) {
          const killObj = {
            character_id: that.id,
            enemy_id: kill.id,
            quantity: kill.count,
          };
          conn.query(Sql.upsert("character_kills", killObj));
        }
      });
      _.each(that.items, function (item) {
        if (item.quantity !== -1) {
          const itemObj = {
            character_id: that.id,
            item_id: item.id,
            quantity: item.quantity,
          };
          conn.query(Sql.upsert("character_item", itemObj));
        }
      });
      _.each(that.equipment, function (item) {
        if (item.id !== -1) {
          const itemObj = {
            character_id: that.id,
            item_id: item.id,
            itemString: JSON.stringify(item),
            sold: item.sold || 0,
          };
          conn.query(Sql.upsert("character_equipment", itemObj));
        }
      });
      _.each(that.skills, function (skill) {
        if (skill.level > 0) {
          const itemObj = {
            character_id: that.id,
            skill_id: skill.id,
            level: skill.level,
          };
          conn.query(Sql.upsert("character_skill", itemObj));
        }
      });
    }
  }

  attack() {
    this.attacking = true;
  }

  talk() {
    if (this.location.x < this.target.location.x) {
      this.east = true;
    } else if (this.location.x > this.target.location.x) {
      this.east = false;
    }
    this.target.talk(this);
    // const that = this;
    // _.each(this.getQuests(), function (q) {
    //   q.action("talk", that.target.id);
    //   q.action("return", that.target.id);
    // });
  }

  collect() {
    if (!this.target.collector && !this.collecting) {
      if (this.location.x < this.target.location.x) {
        this.east = true;
      } else if (this.location.x > this.target.location.x) {
        this.east = false;
      }
      this.target.collect(this);
      this.collecting = true;
    }
  }

  open() {
    if (!this.collecting && !this.target.used(this)) {
      if (this.location.x < this.target.location.x) {
        this.east = true;
      } else if (this.location.x > this.target.location.x) {
        this.east = false;
      }
      this.target.open(this);
      this.collecting = true;
    }
  }

  usePortal() {
    if (!this.collecting) {
      if (this.location.x < this.target.location.x) {
        this.east = true;
      } else if (this.location.x > this.target.location.x) {
        this.east = false;
      }
      this.target.movePlayer(this);
      this.collecting = true;
    }
  }

  targetObject(obj) {
    this.interrupt();
    this.target = obj;
  }

  forgetObject() {
    this.interrupt();
    this.target = null;
    this.attacking = false;
    this.queueAction = false;
    this.attackTickCount = false;
  }

  setQueuedAttackItem(itemId) {
    this.queuedAttack = Items[itemId];
    this.queuedAttack.attackType = "item";
  }

  setQueuedAttackSkill(skillId) {
    this.queuedAttack = Skills[skillId];
    this.queuedAttack.attackType = "skill";
  }

  attackTarget() {
    let target = this.target;
    if (
      target &&
      target.type == "enemy" &&
      (this.attacking || this.queuedAttack)
    ) {
      if (this.attackTickCount === false) {
        this.attackTickCount = 0;
      }
      let range = this.range;
      if (this.queuedAttack) {
        range = this.queuedAttack.range;
      }
      if (Math.floor(this.location.getDistance(target.location)) <= range) {
        Library.GRAPHICS.push({
          location: this.location,
          type: "shake",
          targetType: "players",
          target: this.hash,
          value: Library.getDirection(this.location, this.target.location),
        });
        if (this.queuedAttack && this.queuedAttack.type === "combat") {
          if (this.queuedAttack.attackType === "item") {
            if (this.items[this.queuedAttack.id].consume()) {
              // ONLY THROWING KNIVES ATM APPARENTLY!
              Library.GRAPHICS.push({
                type: "arrow",
                location: this.location,
                style: this.queuedAttack.projectile.animation,
                color: this.queuedAttack.projectile.color,
                duration: this.queuedAttack.projectile.speed * 4, //number of tiles
                sender: this.hash,
                senderType: "player",
                reciever: target.hash,
                recieverType: "enemy",
              });
              const that = this;
              const damage = this.queuedAttack.damage;
              setTimeout(function () {
                target.takeDamage(damage, that, "slash2");
              }, that.queuedAttack.projectile.speed * 4);
            }
          } else {
            if (this.skills[this.queuedAttack.id].consume()) {
              // ONLY BASH ATM APPARENTLY!
              if (this.queuedAttack.type2 === "physical") {
                if (Library.attemptAttack(this, this.target)) {
                  let damage = this.skills[this.queuedAttack.id].getValue();
                  this.target.takeDamage(
                    damage,
                    this,
                    this.queuedAttack.hitAnimation
                  );
                } else {
                  Library.GRAPHICS.push({
                    type: "playerMiss",
                    location: this.location,
                  });
                }
              }
            }
          }
          this.queuedAttack = false;
        } else {
          if (this.location.x < this.target.location.x) {
            this.east = true;
            this.target.east = false;
          } else if (this.location.x > this.target.location.x) {
            this.east = false;
            this.target.east = true;
          }
          this.direction = Library.getDirection(
            this.target.location,
            this.location
          );
          this.target.idle = false;
          this.target.targetPlayer(this.id);
          if (Library.attemptAttack(this, this.target)) {
            let damage = this.calculateDamage();
            const crit =
              Library.getRandomInt(0, 100) < this.calculatedStats.critRate;
            if (crit) {
              damage = Math.floor(
                (damage * this.calculatedStats.critMod) / 100
              );
            }
            this.target.takeDamage(damage, this, null, crit);
          } else {
            Library.GRAPHICS.push({
              type: "playerMiss",
              location: this.location,
            });
          }
        }
      }
    }
  }

  calculateDamage() {
    let dmgMin =
      (this.equippedStats.damageMin * this.calculatedStats.attack) / 4;
    let dmgMax =
      (this.equippedStats.damageMax * this.calculatedStats.attack) / 2;
    const diff = dmgMax - dmgMin;
    const percisionBonus = diff * (this.calculatedStats.percision / 100);
    if (percisionBonus > dmgMax) {
      return dmgMax;
    } else {
      return Library.getRandomInt(dmgMin + percisionBonus, dmgMax);
    }
  }

  gainGold(gold) {
    if (gold > 0) {
      this.gold += gold;
      gold = gold.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      Library.NOTICES.push({
        target: this.id,
        type: "itemGain",
        image: "itemGainIconGold",
        string: gold + " Gold ",
      });
    }
  }

  gainExp(exp) {
    this.save();
    this.exp += exp;
    while (this.exp > this.expMax) {
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.calculateStats();
    this.health = this.calculatedStats.healthMax;
    this.mana = this.calculatedStats.manaMax;
    this.exp = this.exp - this.expMax;
    this.expMax = Levels[this.level];
    this.stats.points = this.stats.points + 3 + Math.floor(this.level / 5);
    this.stats.skillPoints++;
    Library.GRAPHICS.push({
      location: this.location,
      type: "levelUp",
      target: this.hash,
    });
  }

  takeDamage(
    damage,
    type = "physical",
    blockable = true,
    interruptible = true
  ) {
    let dead = false;
    if (type === "physical") {
      damage = Math.ceil(
        (damage * (100 - (this.calculatedStats.armor || 0))) / 100 -
          (this.calculatedStats.defense || 0)
      );
    } else if (type === "pure") {
      // poison
    } else {
    }

    if (blockable) {
      let block = Library.getRandomInt(0, 100);
      if (block < this.calculatedStats.block) {
        Library.GRAPHICS.push({
          type: "playerBlock",
          location: this.location,
        });
        return;
      }
    }

    if (damage < 1) {
      damage = 1;
    }

    if (interruptible) {
      this.interrupt();
    }
    this.health = this.health - damage;
    if (this.health <= 0) {
      this.interrupt();
      dead = true;
      this.health = 0;
      this.forgetObject();
      this.moves = [];
      this.statusEffects = [];
      this.dead = true;
      this.exp = this.exp - this.expMax / 20;
      if (this.exp < 0) {
        this.exp = 0;
      }
      Library.GRAPHICS.push({
        type: "grave",
        location: new Location(this.location),
      });
    }
    Library.GRAPHICS.push({
      type: "damage",
      location: this.location,
      style: "enemyDamage",
      value: damage,
      east: !this.east,
    });
    return dead;
  }

  respawn() {
    if (this.dead) {
      if (this.location.map === "WesternRidges") {
        this.location.x = 20;
        this.location.y = 11;
        this.location.map = "PassageOutpost";
      } else {
        this.location.x = 45;
        this.location.y = 32;
        this.location.map = "ArchitonOutpost";
      }

      this.dead = false;
      this.health = Math.floor(this.calculatedStats.healthMax / 2);
    }
  }

  useItem(id) {
    this.items[id].use();
  }

  useSkill(id) {
    this.skills[id].use();
  }

  buyItem(id, qty = 1) {
    if (
      this.target &&
      this.gold >= this.items[id].value * qty &&
      this.target.type === "shop" &&
      this.target.items.includes(id)
    ) {
      this.items[id].increase(qty);
      this.gold -= this.items[id].value * qty;
    }
  }

  sellItem(id, qty) {
    if (
      this.target &&
      this.items[id].quantity > 0 &&
      this.target.type === "shop"
    ) {
      if (this.items[id].quantity < qty) {
        qty = this.items[id].quantity;
      }
      this.items[id].sell(qty);
      this.gold += Math.floor(this.items[id].value / 11) * qty;
    }
  }

  observeItem(id) {
    this.items[id].viewItem();
  }

  buyEquipment(id) {
    const e = new Equipment(Equipments[id], this.id, "basic");
    if (
      this.target &&
      this.gold >= e.cost &&
      this.target.type === "shop" &&
      this.target.equipment.includes(id)
    ) {
      this.equipment.push(e);
      Library.NOTICES.push({
        target: this.id,
        type: "itemGain",
        image: e.slot !== "weapon" ? "itemGainIconArmor" : "itemGainIconWeapon",
        string: Library.colorDrop(e.name, e.type),
      });
      this.gold -= e.cost;
      e.removeTemplate();
    }
  }

  sellEquipment(id, returnValue = false, allowNonShopSale = false) {
    let i = this.equipment.filter((obj) => {
      return obj.id === id;
    })[0];
    if (
      i &&
      ((this.target && this.target.type === "shop") || allowNonShopSale)
    ) {
      let ret = 0;
      if (!returnValue) {
        Library.NOTICES.push({
          target: this.id,
          type: "itemGain",
          image: "itemGainIconGold",
          string: Library.numberWithCommas(Math.floor(i.cost / 11)) + " Gold ",
        });
      } else {
        ret = Math.floor(i.cost / 11);
      }
      this.gold += Math.floor(i.cost / 11);
      this.equipment = this.equipment.filter((obj) => {
        return obj.id !== id;
      });
      if (!this.guest) {
        conn.query(
          "DELETE from character_equipment where character_id = " +
            this.id +
            " AND item_id = " +
            id
        );
      }
      return ret;
    }
  }

  observeEquipment(id) {
    let i = this.equipment.filter((obj) => {
      return obj.id === id;
    })[0];
    i.viewItem();
  }

  moveToTarget() {
    // This is going to require a min range for ranged attacks/skills
    let range = this.range;
    if (this.queuedAttack) {
      range = this.queuedAttack.range;
    }
    if (this.target && !this.dead) {
      let path = Library.calculatePath(this.location, this.target.location);
      let pathNew = [];
      if (path.length < 45 && path.length > 0) {
        const stop = Library.trimPath(path, this.target.location, range);
        this.queueAction = true;
        _.each(path, function (e) {
          pathNew.push({ x: e[0], y: e[1] });
          if (_.isEqual(stop, e)) {
            return false;
          }
        });
        pathNew.shift();
        pathNew.pop();
        this.moves = pathNew;
        this.action = true;
      }
    }
  }

  walk() {
    if (this.moves.length > 0) {
      this.interrupt();
      let newMoves = [];
      for (let i = 0; i < this.moves.length; i++) {
        if (
          JSON.stringify(this.moves[i]) !== JSON.stringify(this.moves[i + 1])
        ) {
          newMoves.push(this.moves[i]);
        }
      }
      this.moves = newMoves;
      const newPos = this.moves.shift();
      if (newPos.x > this.location.x) {
        this.east = true;
      } else if (newPos.x < this.location.x) {
        this.east = false;
      }
      this.direction = Library.getDirection(
        { x: newPos.x, y: newPos.y },
        { x: this.location.x, y: this.location.y }
      );
      this.location.x = newPos.x;
      this.location.y = newPos.y;
      const that = this;
      _.each(this.getQuests(), function (q) {
        q.action("walk", that.location);
      });
    }
    if (this.target) {
      if (this.location.getDistance(this.target.location) > this.range) {
        return;
      }
      if (this.action) {
        switch (this.targetType) {
          case "enemies":
            this.attack();
            break;
          case "npcs":
            this.talk();
            break;
          case "collectables":
            this.collect();
            break;
          case "receptacles":
            this.open();
            break;
          case "portals":
            this.usePortal();
            break;
          default:
            break;
        }
        this.action = false;
      }
    }
  }

  regenerate() {
    if (
      this.health > 0 &&
      !this.target &&
      this.health < this.calculatedStats.healthMax
    ) {
      this.health++;
    }
  }

  heal(amount, showAnimation) {
    if (this.health > 0) {
      this.health += amount;
      if (this.health > this.calculatedStats.healthMax) {
        this.health = this.calculatedStats.healthMax;
      }
      if (showAnimation) {
        Library.GRAPHICS.push({
          type: "heal",
          location: this.location,
          value: amount,
        });
      }
    }
  }

  restore(amount, showAnimation) {
    this.mana += amount;
    if (this.mana > this.calculatedStats.manaMax) {
      this.mana = this.calculatedStats.manaMax;
    }
    if (showAnimation) {
      Library.GRAPHICS.push({
        type: "restore",
        location: this.location,
        value: amount,
      });
    }
  }

  equipCombatItem(id, slot) {
    if ([0, 1, 2, 3].includes(parseInt(slot))) {
      this.combatItems["s" + slot] = parseInt(id);
    }
  }

  equipCombatSkill(id, slot) {
    if ([0, 1, 2, 3].includes(parseInt(slot))) {
      this.combatSkills["s" + slot] = parseInt(id);
    }
  }

  exportObj(activePlayer) {
    let quests = [];
    const items = [];
    let kills = [];
    let skills = [];
    let combatItems = {};
    let combatSkills = {};
    if (activePlayer) {
      this.calculateStats();
      _.each(this.items, function (item) {
        if (item.quantity > 0) {
          items.push({
            id: item.id,
            quantity: item.quantity,
            newItem: item.newItem,
          });
        }
      });
      kills = this.kills;
      skills = this.skills;
      quests = this.questReqString;
      combatItems = JSON.stringify(this.combatItems);
      combatSkills = JSON.stringify(this.combatSkills);
    }

    let image = "fighter";
    let tag = "tags";

    if (parseInt(this.id) === 5) {
      tag = "adminTags";
    } else if (this.tester) {
      tag = "supportTags";
    }

    const ret = {
      id: this.id,
      location: this.location,
      x: this.location.x,
      y: this.location.y,
      east: this.east,
      health: this.health,
      healthMax: this.calculatedStats.healthMax,
      mana: this.mana,
      manaMax: this.calculatedStats.manaMax,
      exp: this.exp,
      expMax: this.expMax,
      level: this.level,
      moves: this.moves,
      dead: this.dead,
      hash: this.hash,
      collecting: this.collecting,
      direction: this.direction,
      quests: quests,
      items: items,
      name: this.name,
      gold: this.gold,
      combatItems: this.combatItems,
      combatSkills: this.combatSkills,
      calculatedStats: this.calculatedStats,
      class: this.class,
      equipment: this.equipment,
      statBonuses: this.equippedStats,
      buffBonuses: this.statusEffectStats,
      kills: kills,
      skills: skills,
      guest: this.guest,
      tester: this.tester,
      image: image,
      tag: tag,
      statusEffects: this.statusEffects,
      rand: this.random,
    };
    if (!activePlayer) {
      delete ret.exp;
      delete ret.expMax;
      delete ret.mana;
      delete ret.manaMax;
      delete ret.quests;
      delete ret.items;
      delete ret.gold;
      delete ret.combatItems;
      delete ret.combatSkills;
      delete ret.moves;
      delete ret.calculatedStats;
      delete ret.equipment;
      delete ret.statBonuses;
      delete ret.buffBonuses;
      delete ret.kills;
      delete ret.guest;
      delete ret.statusEffects;
    }
    return ret;
  }

  getQuests(includeNew = true) {
    const that = this;
    return _.filter(this.quests, function (q) {
      if (includeNew) {
        return q.status !== 2; //  && q.map == that.location.map;
      } else {
        return q.status === 1; //  && q.map == that.location.map;
      }
    });
  }

  interrupt() {
    if (
      this.target &&
      (this.target instanceof Receptacle ||
        this.target instanceof Collectable ||
        this.target instanceof Portal)
    ) {
      this.collecting = false;
      clearTimeout(this.collectionTimeout);
      this.collectionTimeout = null;
      this.target.interrupt(this);
    }
  }

  calculateStats() {
    const str =
      this.stats.strength +
      (this.equippedStats.strength || 0) +
      (this.statusEffectStats.strength || 0);
    const vit =
      this.stats.vitality +
      (this.equippedStats.vitality || 0) +
      (this.statusEffectStats.vitality || 0);
    const dex =
      this.stats.dexterity +
      (this.equippedStats.dexterity || 0) +
      (this.statusEffectStats.dexterity || 0);
    const int =
      this.stats.intelligence +
      (this.equippedStats.intelligence || 0) +
      (this.statusEffectStats.intelligence || 0);
    const agi =
      this.stats.agility +
      (this.equippedStats.agility || 0) +
      (this.statusEffectStats.agility || 0);

    this.calculatedStats = {
      str: this.stats.strength + (this.equippedStats.strength || 0),
      vit: this.stats.vitality + (this.equippedStats.vitality || 0),
      dex: this.stats.dexterity + (this.equippedStats.dexterity || 0),
      int: this.stats.intelligence + (this.equippedStats.intelligence || 0),
      agi: this.stats.agility + (this.equippedStats.agility || 0),
      moveSpeed: 2 + (this.statusEffectStats.moveSpeed || 0),
      attackSpeed:
        this.equippedStats.attackSpeed -
        Math.floor(agi / 2) +
        (this.statusEffectStats.attackSpeed || 0),
      healthMax:
        100 +
        this.level * 20 +
        str * 10 +
        vit * 50 +
        (this.equippedStats.healthMax || 0),
      healthRegen: this.skills[3].getValue(),
      manaMax:
        50 + this.level * 3 + int * 6 + (this.equippedStats.manaMax || 0),
      manaRegen: 1,
      hit: 175 + this.level + dex + +(this.equippedStats.hit || 0),
      dodge: Math.floor(
        100 + this.level + agi * 1.75 + (this.equippedStats.dodge || 0)
      ),
      armor: this.equippedStats.armor || 0,
      attack:
        Math.floor(this.level / 2) +
        str +
        Math.floor(dex / 3) +
        Math.floor(str / 10) * 10,
      critRate: Math.floor(dex / 5) + 2 + (this.equippedStats.critRate || 0),
      critMod:
        Math.floor(str / 5) * 10 + 150 + (this.equippedStats.critMod || 0),
      defense:
        Math.floor((vit + this.level) * 0.85) +
        (this.equippedStats.defense || 0),
      mAttack: Math.floor(this.level / 2) + int + Math.floor(int / 10) * 10,
      percision: Math.floor((dex / 140) * 100),
      block: this.equippedStats.block || 0,
    };
    if (this.mana > this.calculatedStats.manaMax) {
      this.mana = this.calculatedStats.manaMax;
    }
    if (this.health > this.calculatedStats.healthMax) {
      this.health = this.calculatedStats.healthMax;
    }
    this.calculatedStats = Object.assign(
      this.calculatedStats,
      { mana: this.mana, health: this.health, exp: this.exp },
      this.stats
    );
  }

  generateQuestStrings() {
    const that = this;
    that.questReqString = [];
    _.each(that.getQuests(false), function (q) {
      that.questReqString.push(q.getRequirementsString());
    });
  }

  peekQuest(quest) {
    let q = Library.clone(quest);
    let that = this;
    _.each(q.requirements[0].collect, function (item) {
      let qty = that.items[item.id].quantity;
      if (qty < 0) {
        qty = 0;
      }
      if (qty > item.count) {
        qty = item.count;
      }
      if (qty === item.count) {
        item.panelDisplay =
          "<span style='color:#7CFC00;'>" + qty + "/" + item.count + "</span>";
      } else {
        item.panelDisplay = qty + "/" + item.count;
      }
    });
    return q;
  }

  equipItem(itemId) {
    let i = this.equipment.filter((obj) => {
      return obj.id === itemId;
    })[0];
    if (i.slot !== "accessory") {
      _.each(this.equipment, function (equipment) {
        if (equipment.slot === i.slot) {
          equipment.equipped = false;
        }
      });
    } else {
      let first = true;
      _.each(this.equipment, function (equipment) {
        if (equipment.slot === i.slot && equipment.equipped) {
          if (first) {
            first = false;
          } else {
            equipment.equipped = false;
          }
        }
      });
    }
    i.equipped = true;
    this.setEquipmentStats();
  }

  unequipItem(itemId) {
    let i = this.equipment.filter((obj) => {
      return obj.id === itemId;
    })[0];
    i.equipped = false;
    if (i.slot === "weapon") {
      let u = this.equipment.filter((obj) => {
        return obj.id === -1;
      })[0];
      u.equipped = true;
    }
    this.setEquipmentStats();
  }

  setEquipmentStats() {
    const equippedItems = _.filter(this.equipment, function (e) {
      return e.equipped;
    });
    const result = {};
    equippedItems.forEach((item) => {
      if (item.stats) {
        for (let [key, value] of Object.entries(item.stats)) {
          if (result[key]) {
            result[key] += value;
          } else {
            result[key] = value;
          }
        }
      }
    });
    equippedItems.forEach((item) => {
      if (item.bonuses) {
        for (let [key, value] of Object.entries(item.bonuses)) {
          if (result[key]) {
            result[key] += value;
          } else {
            result[key] = value;
          }
        }
      }
    });
    delete result.name;
    delete result.slot;
    this.equippedStats = result;
  }

  setStatusEffectStats() {
    const statusEffects = _.filter(this.statusEffects, function (e) {
      if (e) {
        return e.type === 1;
      }
    });
    const result = {};
    statusEffects.forEach((effect) => {
      if (effect.stats) {
        for (let [key, value] of Object.entries(effect.stats)) {
          if (result[key]) {
            result[key] += value;
          } else {
            result[key] = value;
          }
        }
      }
    });
    this.statusEffectStats = result;
  }

  checkHealingPool() {
    if (this.location.map === "Church") {
      if (
        this.location.x > 85 &&
        this.location.y > 35 &&
        this.location.y < 44
      ) {
        this.healingPool();
      }
    } else if (this.location.map === "UndergroundPassage") {
      if (
        this.location.y < 12 &&
        this.location.x > 117 &&
        this.location.x < 128
      ) {
        this.healingPool();
      }
    } else if (this.location.map === "DampCave") {
      if (this.location.y < 24 && this.location.x < 28) {
        this.healingPool();
      }
    }
  }

  healingPool() {
    if (this.statusEffects[3] && this.statusEffects[3].duration <= 2) {
      this.statusEffects[3].duration = 3;
    } else if (!this.statusEffects[3]) {
      const now = new Date();
      const secondsSinceEpoch = Math.round(now.getTime() / 1000);
      const e = _.cloneDeep(statusEffects[3]);
      this.statusEffects[3] = new StatusEffect(
        Object.assign(e, {
          start: secondsSinceEpoch,
          duration: 3,
        }),
        this.id
      );
    }
  }

  assessStatusEffects() {
    let nullIndex = [];
    _.each(this.statusEffects, function (effect) {
      if (effect) {
        if (effect.expire() !== -1) {
          effect.assess();
        }
      }
    });
    let reassess = false;
    _.remove(this.statusEffects, function (effect, index) {
      if (effect) {
        if (effect.duration <= 0) {
          reassess = true;
          nullIndex.push(index);
        }
        return false;
      }
    });
    let that = this;
    _.each(nullIndex, function (index) {
      that.statusEffects[index] = null;
    });
    if (reassess) {
      this.setStatusEffectStats();
    }
  }

  migration() {
    // SHOULD ONLY RUN WHEN TRANSFERIUNG FROM 8 to 9, REMOVE AFTER
    let that = this;
    _.each(this.equipment, function (e, index) {
      if (e.stats && e.stats.attackSpeed && e.stats.attackSpeed <= 10) {
        that.equipment[index].stats.attackSpeed = e.stats.attackSpeed * 10;
      }
    });
  }
}

module.exports = Player;
