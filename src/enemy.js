import GameObject from "./gameObject";
import * as PIXI from "pixi.js";
import Event from "./event";
import EVENTS from "./events";

const vector = (x, y) => new PIXI.Point(x, y);

export default class Player extends GameObject {
  constructor(sprite, state, x = 0, y = 0, w = 128, h = 128, hp, group = null) {
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
    this.w = 32;
    this.h = 128 - 32;
  }

  hitBy(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.disabled = true;
      if (this.group) this.group.remove(this);

      this.sprite.destroy();
      Event.fire(EVENTS.ENEMY_DIE);
    }
  }

  updatePosition() {
    if (this.disabled) return;
  }
}
