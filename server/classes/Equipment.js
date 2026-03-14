const Library = require("./util/Library.js");
const affixes = require("../../client/data/affixes.js");
const equipmentClass = require("../../client/data/equipmentClass.js");
const rareNames = require("../../client/data/rareNames.js");
const _ = require("lodash");

class Equipment {
  constructor(obj, playerId, status = "existing", dropRarity = 1) {
    Object.assign(this, obj);
    this.playerId = playerId;
    if (status !== "existing" && status !== "load") {
      this.templateId = obj.id;
      this.newItem = true;
      Object.assign(this, _.cloneDeep(equipmentClass[this.class]));
      this.evaluateEquipment();
    }
    if (status === "new") {
      this.id = Library.getRandomInt(500, 100000000);
      this.generate(dropRarity);
    }
    if (status === "questReward" || status === "basic") {
      if (status === "basic") {
        this.type = "normal";
      }
      this.id = Library.getRandomInt(500, 100000000);
      switch (this.type) {
        case "unique":
          this.rarity = 1;
          break;
        default:
          this.rarity = 4;
          break;
      }
    }
  }

  viewItem() {
    this.newItem = false;
  }

  generate(dropRarity) {
    const roll = Library.getRandomInt(0, 100);
    if (!this.bonuses) {
      this.bonuses = {};
    }
    this.rarity = 4;
    if (roll < 3 * dropRarity && this.uniques && this.uniques.length > 0) {
      this.generateUnique();
      this.rarity = 1;
    } else if (roll < 10 * dropRarity) {
      this.generateRare();
      this.rarity = 2;
    } else if (roll < 40 * dropRarity) {
      this.generateMagic();
      this.rarity = 3;
    } else {
      this.type = "normal";
    }
    this.gainOne = " " + this.name;
    this.equipped = false;
  }

  generateUnique() {
    const unique =
      this.uniques[Math.floor(Math.random() * this.uniques.length)];
    this.cost = Math.floor(this.cost * unique.cost);
    this.image = unique.image;
    this.script = unique.script;
    this.name = unique.name;
    let that = this;
    _.forOwn(unique.uniqueBonuses, function (value, key) {
      const bonus = Library.getRandomInt(value.min, value.max);
      that.bonuses[key] = (that.bonuses[key] || 0) + bonus;
    });
    this.type = "unique";
  }

  generateRare() {
    this.affixPool = [];
    this.generateAffixPool();
    let modCount = Math.floor(Math.sqrt(Library.getRandomInt(100, 180)) / 3);
    Library.shuffleArray(this.affixPool);
    if (modCount > this.affixPool.length) {
      modCount = this.affixPool.length;
    }
    for (let index = 0; index < modCount; index++) {
      const affix = this.affixPool[index];
      let that = this;
      _.forOwn(affix.stat, function (value, key) {
        const bonus = Library.getRandomInt(value.min, value.max);
        that.bonuses[key] = (that.bonuses[key] || 0) + bonus;
      });
      that.cost = that.cost * (affix.costModifier * 2);
    }
    this.name = this.generateRareName();
    this.type = "rare";
  }

  generateMagic() {
    this.affixPool = [];
    this.generateAffixPool();
    const modCount =
      Math.floor(Math.sqrt(Library.getRandomInt(100, 180)) / 3) - 2;
    Library.shuffleArray(this.affixPool);
    let affixName = "";
    for (let index = 0; index < modCount; index++) {
      const affix = this.affixPool[index];
      affixName = affix.name;
      let that = this;
      _.forOwn(affix.stat, function (value, key) {
        const bonus = Math.ceil(
          Library.getRandomInt(value.min, value.max * that.affixModifier)
        );
        that.bonuses[key] = (that.bonuses[key] || 0) + bonus;
      });
      that.cost = that.cost * affix.costModifier;
    }
    this.name = affixName + " " + this.name;
    this.type = "magic";
  }

  generateRareName() {
    Library.shuffleArray(rareNames);
    return rareNames[0] + " " + rareNames[1];
  }

  removeTemplate() {
    delete this.affixes;
    delete this.uniques;
    delete this.gainOne;
    delete this.dropImage;
    delete this.level;
    delete this.templateId;
    delete this.playerId;
    delete this.drop;
    delete this.affixPool;
  }

  generateAffixPool() {
    let that = this;
    _.each(affixes, function (affix, key) {
      let counter = 0;
      if (that.affixes && that.affixes.includes(key)) {
        _.each(affix.tiers, function (a, name) {
          that.affixPool.push({
            name: name,
            stat: a,
            costModifier: affix.costModifier,
          });
          counter++;
          if (counter >= Math.floor(that.level / 8)) {
            return false;
          }
        });
      }
    });
  }

  evaluateEquipment() {
    if (this.cost && this.cost.includes("{level}")) {
      this.cost = this.cost.replace(/{level}/g, this.level);
      this.cost = eval(this.cost);
    }
    if (
      this.stats &&
      this.stats.damageMin &&
      this.stats.damageMin.includes("{level}")
    ) {
      this.stats.damageMin = this.stats.damageMin.replace(
        /{level}/g,
        this.level
      );
      this.stats.damageMin = eval(this.stats.damageMin);
    }
    if (
      this.stats &&
      this.stats.damageMax &&
      this.stats.damageMax.includes("{level}")
    ) {
      this.stats.damageMax = this.stats.damageMax.replace(
        /{level}/g,
        this.level
      );
      this.stats.damageMax = eval(this.stats.damageMax);
    }
    if (
      this.stats &&
      this.stats.armor &&
      this.stats.armor.includes("{level}")
    ) {
      this.stats.armor = this.stats.armor.replace(/{level}/g, this.level);
      this.stats.armor = eval(this.stats.armor);
    }
    if (
      this.stats &&
      this.stats.block &&
      this.stats.block.includes("{level}")
    ) {
      this.stats.block = this.stats.block.replace(/{level}/g, this.level);
      this.stats.block = eval(this.stats.block);
    }
  }
}
module.exports = Equipment;
