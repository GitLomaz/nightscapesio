class StatusEffect {
  constructor(obj, playerId) {
    Object.assign(this, obj);
    this.playerId = playerId;
    this.counter = 0;
  }

  expire() {
    const socket = SOCKET_LIST[this.playerId];
    const player = socket.player;
    this.counter++;
    if (this.counter % 10 === 0) {
      const now = new Date();
      const secondsSinceEpoch = Math.round(now.getTime() / 1000);
      let diff = secondsSinceEpoch - this.start;
      this.start = this.start + diff;
      this.duration = this.duration - diff;
      player.random = Math.random();
      if (this.duration <= 0) {
        return -1;
      }
    }
  }

  assess() {
    if (this.type !== 0) {
      return;
    }
    const socket = SOCKET_LIST[this.playerId];
    const player = socket.player;
    switch (this.id) {
      case 0:
        // basic poison
        if (this.counter % 10 === 0) {
          if (player.health > player.calculatedStats.healthMax / 10) {
            let damage = Math.ceil(player.health / 100);
            player.takeDamage(damage, "pure", false, false);
          }
        }
        break;
      case 1:
        // toxins
        if (this.counter % 2 === 0) {
          if (player.health > player.calculatedStats.healthMax / 10) {
            let damage = Math.ceil(player.health / 20);
            player.takeDamage(damage, "pure", false, false);
          }
        }
        break;
      case 2:
        // simple heal
        if (
          this.counter % 10 === 0 &&
          player.health < player.calculatedStats.healthMax
        ) {
          player.heal(15, true);
        }
        break;
      case 3:
        // healing pool
        if (
          this.counter % 30 === 0 &&
          player.health < player.calculatedStats.healthMax
        ) {
          const effect = getRandomInt(
            player.calculatedStats.healthMax / 30,
            player.calculatedStats.healthMax / 27
          );
          player.heal(effect, true);
        }
        break;
      default:
        break;
    }
  }
}