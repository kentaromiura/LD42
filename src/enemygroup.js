import Event from "./event";
import EVENTS from "./events";

class EnemyGroup {
  constructor() {
    this.enemies = [];
  }

  add(enemy) {
    this.enemies.push(enemy);
    enemy.group = this;
    return this;
  }

  remove(enemyToRemove) {
    this.enemies = this.enemies.filter(enemy => enemy != enemyToRemove);
    if (this.enemies.length === 0) {
      Event.fire(EVENTS.POWER_UP, {
        type: "star",
        x: enemyToRemove.sprite.x,
        y: enemyToRemove.sprite.y
      });

      console.log(
        "LEAVE POWER UP AT POSITION :",
        enemyToRemove.sprite.x,
        enemyToRemove.sprite.y
      );
    }
  }
}

export default EnemyGroup;
