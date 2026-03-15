

class Enemy {
  constructor(
    obj,
    spawnPoint,
    loc = null,
    parent = null,
    minionIndex = null,
    magicMod = null
  ) {
    Object.assign(this, obj);
    if (magicMod !== null) {
      this.setMagicStatus(magicMod);
    }
    this.type = "enemy";
    this.spawnPoint = spawnPoint;
    if (loc) {
      this.location = new Location(loc);
    } else {
      this.location = new Location(spawnPoint.location);
    }
    this.targetLocation = new Location(this.location);
    this.maxHealth = this.health;
    this.idle = true;
    this.east = true;
    this.tickCount = getRandomInt(1, 100);
    this.minions = {};
    this.minionIndex = minionIndex;
    this.parent = parent;
    this.damageTaken = {};
    this.currentImage = 0;
    this.auras = {};
    this.hashObj = {
      id: this.minionIndex,
      parent: this.parent,
      spawnPoint: this.spawnPoint.id,
      type: "enemy",
    };
    this.hash = objectHash(this.hashObj);
    OBJECTS.ENEMIES[this.hash] = this;
    GRAPHICS.push({
      type: "spawn",
      location: this.location,
      tints: [0xb366ff, 0x8668fd, 0xc666ff],
    });
  }

  tick() {
    this.tickCount++;
    if (
      this.tickCount % this.movement.idle == 0 &&
      this.idle &&
      this.tickCount > 10
    ) {
      this.waunder();
      this.swapImage();
    }

    if (this.tickCount % 10 == 0 && this.idle && this.aggressive) {
      this.findTarget();
    }

    if (this.tickCount % this.movement.chase == 0 && this.target) {
      this.hunt();
      this.swapImage();
    }

    if (this.tickCount % this.attack.speed == 0 && this.target) {
      this.chooseAttack();
      this.swapImage();
    }

    if (this.tickCount % 5 == 0) {
      this.fireAuras();
    }

    Object.values(this.minions).forEach(function (minion) {
      minion.tick();
    });
  }

  waunder() {
    let newLocation = new Location(this.location);
    if (
      this.location.getDistance(this.spawnPoint.location) <
      10 + this.spawnPoint.radius
    ) {
      if (this.location.x === this.targetLocation.x && this.location.y === this.targetLocation.y && this.location.map === this.targetLocation.map) {
        // THIS MAY NOT BE SCALABLE!!
        shuffleArray(this.spawnPoint.walkableTiles);
        let counter = 5;
        this.targetLocation = false;
        while (!this.targetLocation) {
          let dist = this.location.getDistance(
            this.spawnPoint.walkableTiles[counter - 5]
          );
          if (dist <= counter) {
            this.targetLocation = new Location(
              this.spawnPoint.walkableTiles[counter - 5]
            );
          }
          counter++;
        }
      }
    }
    if (!(this.location.x === this.targetLocation.x && this.location.y === this.targetLocation.y && this.location.map === this.targetLocation.map)) {
      let step = calculatePath(this.location, this.targetLocation);
      newLocation.x = step[1][0];
      newLocation.y = step[1][1];
      if (newLocation.x > this.location.x) {
        this.east = true;
      } else if (newLocation.x < this.location.x) {
        this.east = false;
      }
    }
    this.move(newLocation);
  }

  findTarget() {
    let targets = [];
    for (let i in SOCKET_LIST) {
      let socket = SOCKET_LIST[i];
      let player = socket.player;
      if (this.location.getDistance(player.location) > 15 || player.dead) {
        continue;
      }
      let stepCheck = calculatePath(this.location, player.location);
      let stepCheck2 = calculatePath(
        this.location,
        this.spawnPoint.location
      );
      if (
        stepCheck.length > 0 &&
        stepCheck.length < this.aggressive &&
        stepCheck2.length < 10 + this.attack.range + this.spawnPoint.radius &&
        player.health > 0
      ) {
        targets[stepCheck.length] = player.id;
      }
    }
    targets = targets.reverse();
    for (let i in targets) {
      this.targetPlayer(targets[i]);
    }
  }

  hunt() {
    let player = SOCKET_LIST[this.target].player;
    if (this.location.getDistance(player.location) < this.attack.range) {
    } else if (this.location.getDistance(player.location) > this.visionRange) {
      this.forgetPlayer();
    } else {
      let step = calculatePath(this.location, player.location);
      if (!step[1]) {
        this.forgetPlayer();
        return;
      }
      let newLocation = new Location(this.location);
      newLocation.x = step[1][0];
      newLocation.y = step[1][1];
      if (newLocation.x > this.location.x) {
        this.east = true;
      } else if (newLocation.x < this.location.x) {
        this.east = false;
      }
      this.move(newLocation);
    }
  }

  chooseAttack() {
    let action = "attack";
    if (
      this.location.x == SOCKET_LIST[this.target].player.location.x &&
      this.location.y == SOCKET_LIST[this.target].player.location.y
    ) {
      this.waunder();
    }
    let remainingLife = (this.health / this.maxHealth) * 100;
    const that = this;
    if (this.skills && this.skills.length > 0) {
      this.skills.forEach(function (skill) {
        if (skill.currentCooldown == 0) {
          if (
            skill.minHealth <= remainingLife &&
            skill.maxHealth >= remainingLife &&
            getRandomInt(0, 100) < skill.chance
          ) {
            skill.currentCooldown = skill.cooldown;
            that.useSkill(skill);
            action = "skill";
          }
        } else {
          skill.currentCooldown--;
        }
      });
    }
    if (action == "attack") {
      this.basicAttack();
    }
  }

  move(newLocation) {
    this.location = newLocation;
    let that = this;
    Object.values(SOCKET_LIST).forEach((socket) => {
      if (socket.player.target === that) {
        if (socket.player.moves.length > 0) {
          socket.player.moveToTarget();
        }
      }
    });
  }

  basicAttack() {
    let player = SOCKET_LIST[this.target].player;
    if (this.location.getDistance(player.location) < this.attack.range) {
      if (player.location.x > this.location.x) {
        this.east = true;
      } else if (player.location.x < this.location.x) {
        this.east = false;
      }
      GRAPHICS.push({
        location: this.location,
        type: "shake",
        targetType: "enemies",
        target: this.hash,
        value: getDirection(this.location, player.location),
      });
      if (player.health <= 0) {
        this.forgetPlayer();
        return;
      }
      if (attemptAttack(this, player)) {
        let damage = this.calculateDamage();
        if (!this.attack.projectile) {
          const dead = player.takeDamage(damage, true, true);
          if (dead) {
            this.forgetPlayer();
          }
        } else {
          GRAPHICS.push({
            type: "projectile",
            location: this.location,
            style: this.attack.projectile.animation,
            color: this.attack.projectile.color,
            duration: this.attack.projectile.speed * 4, //number of tiles
            sender: this.hash,
            senderType: "enemy",
            reciever: player.hash,
            recieverType: "player",
          });
          const that = this;
          setTimeout(function () {
            player.takeDamage(damage);
            if (player.health <= 0) {
              that.forgetPlayer();
            }
          }, that.attack.projectile.speed * 4);
        }
      } else {
        if (!this.attack.projectile) {
          GRAPHICS.push({
            type: "enemyMiss",
            location: this.location,
          });
        } else {
          GRAPHICS.push({
            type: "projectile",
            location: this.location,
            style: this.attack.projectile.animation,
            color: this.attack.projectile.color,
            duration: this.attack.projectile.speed * 4, //number of tiles
            sender: this.hash,
            senderType: "enemy",
            reciever: player.hash,
            recieverType: "player",
          });
          const that = this;
          setTimeout(function () {
            GRAPHICS.push({
              type: "enemyMiss",
              location: that.location,
            });
          }, that.attack.projectile.speed * 4);
        }
      }
    }
  }

  takeDamage(damage, player, damageType = "slash1", critical = false) {
    if (!critical) {
      damage = Math.ceil(
        (damage * (100 - (this.defense.armor || 0))) / 100 -
          (this.defense.def || 0)
      );
    }
    if (damage < 1) {
      damage = 1;
    }
    if (!this.target) {
      this.targetPlayer(player.id);
    }
    if (this.damageTaken[player.id]) {
      this.damageTaken[player.id].damage += damage;
    } else {
      this.damageTaken[player.id] = { damage: damage, player: player };
    }
    this.health = this.health - damage;
    GRAPHICS.push({
      location: this.location,
      type: "takeDamage",
      damageType: damageType,
      east: !this.east,
    });
    GRAPHICS.push({
      type: "damage",
      location: this.location,
      style: "damage",
      value: damage + (critical ? "!" : ""),
      east: !this.east,
    });
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.splitLoot();
    GRAPHICS.push({
      type: "ghost",
      location: this.location,
    });
    delete OBJECTS.ENEMIES[this.hash];
    if (!this.parent) {
      this.spawnPoint.enemy = null;
    } else {
      delete SPAWN_POINTS[this.parent].enemy.minions[
        this.minionIndex.toString()
      ];
    }
    Object.values(this.minions).forEach(function (minion) {
      delete OBJECTS.ENEMIES[minion.hash];
      GRAPHICS.push({
        type: "ghost",
        location: minion.location,
      });
    });
  }

  splitLoot() {
    const enemy = this;
    const closePlayers = [];
    Object.values(this.damageTaken).forEach(function (obj) {
      if (obj) {
        let player = obj.player;
        if (player.location.getDistance(enemy.location) < 30) {
          closePlayers.push(player);
        }
      }
    });
    closePlayers.forEach(function (player) {
      player.kills[enemy.id].count++;
      player.getQuests().forEach(function (q) {
        q.action("kill", enemy.id);
      });
      let exp = enemy.experence;
      if (player.kills[enemy.id].count > 1000) {
        exp = Math.floor(exp * 1.15);
      }
      let gold = 0;
      if (
        enemy.gold &&
        enemy.gold.chance * (enemy.dropRate || 1) > getRandomInt(0, 100)
      ) {
        gold = getRandomInt(enemy.gold.min, enemy.gold.max);
      }
      if (player.kills[enemy.id].count > 250) {
        gold = Math.floor(gold * 1.2);
      }
      if (closePlayers.length > 1) {
        exp = enemy.experence * (1 / closePlayers.length) * 1.3;
        if (gold > 0) {
          gold = Math.floor(
            getRandomInt(enemy.gold.min, enemy.gold.max) *
              (1 / closePlayers.length) *
              1.3
          );
        }
      }
      enemy.drops.forEach(function (drop) {
        let chance = drop.chance * (enemy.dropRate || 1);
        if (closePlayers.length > 1) {
          chance = chance * (1 / closePlayers.length) * 1.3;
        }
        if (player.kills[enemy.id].count > 500) {
          chance = Math.floor(chance * 1.1);
        }
        if (chance > getRandomInt(0, 10000)) {
          player.items[drop.item].increase();
        }
      });

      enemy.questDrops.forEach(function (drop) {
        if (player.quests[drop.questId].status === 1) {
          let reqirements =
            player.quests[drop.questId].requirements[
              player.quests[drop.questId].step
            ].collect;
          reqirements.forEach(function (req) {
            if (
              req.id === drop.item &&
              player.items[req.id].quantity < (req.count || 0)
            ) {
              let chance = drop.chance * (enemy.dropRate || 1);
              if (closePlayers.length > 1) {
                chance = chance * (1 / closePlayers.length) * 1.3;
              }
              if (chance > getRandomInt(0, 10000)) {
                player.items[drop.item].increase();
              }
            }
          });
        }
      });

      const equipDrops = enemy.getEquipmentDrops();
      equipDrops.forEach(function (drop) {
        let chance = (drop.drop || 1) * (enemy.dropRate || 1);
        if (closePlayers.length > 1) {
          chance = chance * (1 / closePlayers.length) * 1.3;
        }
        if (player.kills[enemy.id].count > 500) {
          chance = Math.floor(chance * 1.1);
        }
        if (chance > getRandomInt(0, 10000)) {
          const d = structuredClone(drop);
          const e = new Equipment(d, player.id, "new");
          player.equipment.push(e);
          NOTICES.push({
            target: player.id,
            type: "itemGain",
            image:
              e.slot !== "weapon" ? "itemGainIconArmor" : "itemGainIconWeapon",
            string: colorDrop(e.gainOne, e.type),
          });
          e.removeTemplate();
        }
      });

      player.gainExp(exp);
      player.gainGold(gold);
      player.forgetObject();
    });
  }

  targetPlayer(player) {
    this.target = player;
    this.idle = false;
  }

  forgetPlayer() {
    this.target = null;
    this.idle = true;
    Object.values(this.minions).forEach(function (minion) {
      minion.target = null;
      minion.idle = true;
    });
  }

  calculateDamage() {
    return getRandomInt(
      this.attack.damage * 0.8,
      this.attack.damage * 1.2
    );
  }

  exportObj() {
    return {
      x: this.location.x,
      y: this.location.y,
      ea: this.east,
      h: this.health,
      m: this.maxHealth,
      l: this.level,
      i: this.image[this.currentImage],
      n: this.name,
      e: this.experence,
      id: this.spawnPoint.id,
      hash: this.hash,
      magic: this.magic,
      mid: this.id,
      auras: Object.keys(this.auras),
      effect: this.effect,
    };
  }

  useSkill(skill) {
    this.skillAnimation();
    switch (skill.name) {
      case "castAura":
        this.auras[skill.auraName] = skill;
        break;
      case "heal":
        this.health = this.health + skill.value;
        if (this.health > this.maxHealth) {
          this.health = this.maxHealth;
        }
        GRAPHICS.push({
          type: "heal",
          location: this.location,
          value: skill.value,
        });
        break;
      case "spawnMinions":
        if (Object.keys(this.minions).length <= this.maxMinions) {
          for (let i = 0; i < skill.value; i++) {
            let loc = new Location({
              x: this.location.x,
              y: this.location.y,
              map: this.location.map,
            });
            const x = this.location.x;
            const y = this.location.y;
            let check = true;
            let counter = 0;
            while (check) {
              loc.x = getRandomInt(x - skill.radius, x + skill.radius);
              loc.y = getRandomInt(y - skill.radius, y + skill.radius);
              if (
                loc.isWalkable() &&
                loc.isConnected(this.location) &&
                !(loc.x === this.location.x && loc.y === this.location.y && loc.map === this.location.map) &&
                !searchTile(loc, ["enemies"])
              ) {
                check = false;
              }
              counter++;
              if (counter > 1000) {
                console.log("counter > 1000, Enemy:487");
                return false;
              }
            }
            const e = new Enemy(
              enemies[skill.enemyId],
              this,
              loc,
              this.spawnPoint.id,
              Object.keys(this.minions).length
            );
            e.targetPlayer(this.target);
            this.minions[Object.keys(this.minions).length] = e;
          }
        }
        break;
      default:
        break;
    }
  }

  swapImage() {
    this.currentImage++;
    if (this.currentImage === this.image.length) {
      this.currentImage = 0;
    }
  }

  getEquipmentDrops() {
    const levelMin = this.level - 5;
    const levelMax = this.level + 5;
    return equipment.filter(function (e) {
      return e.level >= levelMin && e.level <= levelMax && e.drop > 0;
    });
  }

  fireAuras() {
    let that = this;
    Object.values(that.auras).forEach(function (aura) {
      let targets = [];
      switch (aura.auraTarget) {
        case "players":
          for (let i in SOCKET_LIST) {
            let socket = SOCKET_LIST[i];
            let player = socket.player;
            if (
              that.location.getDistance(player.location) < aura.radius &&
              !player.dead
            ) {
              targets.push(player);
            }
          }
          break;
        default:
          break;
      }
      switch (aura.type) {
        case "damage":
          targets.forEach(function (target) {
            target.takeDamage(
              getRandomInt(aura.damageMin, aura.damageMax)
            );
          });
          break;

        default:
          break;
      }
    });
  }

  setMagicStatus(modId) {
    try {
      let mod = magicEnemies[modId];
      if (mod.modifiers.attack) {
        this.attack.damage = this.attack.damage * mod.modifiers.attack;
      }
      if (mod.modifiers.experence) {
        this.experence = this.experence * mod.modifiers.experence;
      }
      if (mod.modifiers.gold && this.gold) {
        this.gold.min = this.gold.min * mod.modifiers.gold;
        this.gold.max = this.gold.max * mod.modifiers.gold;
      }
      if (mod.modifiers.aspd) {
        this.attack.speed = Math.floor(this.attack.speed * mod.modifiers.aspd);
      }
      if (mod.modifiers.health) {
        this.health = Math.floor(this.health * mod.modifiers.health);
      }
      if (mod.modifiers.dropRate) {
        this.dropRate = (this.dropRate || 0) + mod.modifiers.dropRate;
      }
      if (mod.modifiers.dropRarity) {
        this.dropRarity = (this.dropRarity || 0) + mod.modifiers.dropRarity;
      }

      this.magic = mod;
    } catch (error) {
      console.log(error);
      console.log("could not set mod: " + modId + " on enemy: ");
      console.log(this);
    }
  }

  skillAnimation() {
    GRAPHICS.push({
      type: "enemySkill",
      location: this.location,
    });
  }
}