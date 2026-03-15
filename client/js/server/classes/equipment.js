class Equipment {
  constructor(obj, playerId, status = "existing", dropRarity = 1) {
    Object.assign(this, obj);
    this.playerId = playerId;
    if (status !== "existing" && status !== "load") {
      this.templateId = obj.id;
      this.newItem = true;
      Object.assign(this, JSON.parse(JSON.stringify(equipmentClass[this.class])));
      this.evaluateEquipment();
    }
    if (status === "new") {
      this.id = getRandomInt(500, 100000000);
      this.generate(dropRarity);
    }
    if (status === "questReward" || status === "basic") {
      if (status === "basic") {
        this.type = "normal";
      }
      this.id = getRandomInt(500, 100000000);
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
    const roll = getRandomInt(0, 100);
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
    Object.keys(unique.uniqueBonuses).forEach((key) => {
      const value = unique.uniqueBonuses[key];
      const bonus = getRandomInt(value.min, value.max);
      this.bonuses[key] = (this.bonuses[key] || 0) + bonus;
    });
    this.type = "unique";
  }

  generateRare() {
    this.affixPool = [];
    this.generateAffixPool();
    let modCount = Math.floor(Math.sqrt(getRandomInt(100, 180)) / 3);
    shuffleArray(this.affixPool);
    if (modCount > this.affixPool.length) {
      modCount = this.affixPool.length;
    }
    for (let index = 0; index < modCount; index++) {
      const affix = this.affixPool[index];
      Object.keys(affix.stat).forEach((key) => {
        const value = affix.stat[key];
        const bonus = getRandomInt(value.min, value.max);
        this.bonuses[key] = (this.bonuses[key] || 0) + bonus;
      });
      this.cost = this.cost * (affix.costModifier * 2);
    }
    this.name = this.generateRareName();
    this.type = "rare";
  }

  generateMagic() {
    this.affixPool = [];
    this.generateAffixPool();
    const modCount =
      Math.floor(Math.sqrt(getRandomInt(100, 180)) / 3) - 2;
    shuffleArray(this.affixPool);
    let affixName = "";
    for (let index = 0; index < modCount; index++) {
      const affix = this.affixPool[index];
      affixName = affix.name;
      Object.keys(affix.stat).forEach((key) => {
        const value = affix.stat[key];
        const bonus = Math.ceil(
          getRandomInt(value.min, value.max * this.affixModifier)
        );
        this.bonuses[key] = (this.bonuses[key] || 0) + bonus;
      });
      this.cost = this.cost * affix.costModifier;
    }
    this.name = affixName + " " + this.name;
    this.type = "magic";
  }

  generateRareName() {
    shuffleArray(rareNames);
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
    Object.keys(affixes).forEach((key) => {
      const affix = affixes[key];
      let counter = 0;
      if (this.affixes && this.affixes.includes(key)) {
        for (const name in affix.tiers) {
          const a = affix.tiers[name];
          this.affixPool.push({
            name: name,
            stat: a,
            costModifier: affix.costModifier,
          });
          counter++;
          if (counter >= Math.floor(this.level / 8)) {
            break;
          }
        }
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