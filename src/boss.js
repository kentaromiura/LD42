// This is just like an enemy, but it shoots back at us.
import GameObject from "./gameObject";
import * as PIXI from "pixi.js";
import Event from "./event";
import EVENTS from "./events";
const vector = (x, y) => new PIXI.Point(x, y);

export default class Boss extends GameObject {
  constructor(sprite, state, x = 0, y = 0, w = 256, h = 256, hp, group = null) {
    super(x, y, w, h);
    this.hp = 30;
    this.state = state;
    this.sprite = sprite;
    this.disabled = false;
    this.group = group;

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.position = vector(x, y);
    sprite.width = w;
    sprite.height = h;

    // fix size for collision check
    this.w = 64;
    this.h = 256 - 64;
    this.interval = setInterval(() => {
      Event.fire(EVENTS.BOSS_PROJECTILE, {
        x: this.sprite.x,
        y: this.sprite.y
      });
    }, 1000);
  }

  hitBy(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) {
      clearInterval(this.interval);
      this.disabled = true;
      if (this.group) this.group.remove(this);

      this.sprite.destroy();
      Event.fire(EVENTS.ENEMY_DIE);
    }
  }

  updatePosition() {
    if (this.disabled) return;
    // TODO: movement pattern
  }
}
