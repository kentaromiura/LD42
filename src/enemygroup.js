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
      console.log(
        "LEAVE POWER UP AT POSITION :",
        enemyToRemove.sprite.x,
        enemyToRemove.sprite.y
      );
    }
  }
}

export default EnemyGroup;
