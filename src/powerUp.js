import GameObject from "./gameObject";
import * as PIXI from "pixi.js";
import Event from "./event";
import EVENTS from "./events";

const vector = (x, y) => new PIXI.Point(x, y);

export default class PowerUP extends GameObject {
  constructor(sprite, type, x = 0, y = 0, w = 128, h = 128) {
    super(x, y, w, h);
    this.sprite = sprite;
    this.disabled = false;
    this.type = type;
    sprite.animationSpeed = 1 / 5;

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.position = vector(x, y);
    sprite.width = w;
    sprite.height = h;
    sprite.play();
    // fix size for collision check
    // this.w = 32;
    // this.h = 128 - 32;
  }

  collected() {
    this.disabled = true;
    this.sprite.destroy();
    Event.fire(EVENTS.POWERUP_COLLECTED, {
      type: this.type
    });
  }

  updatePosition() {
    if (this.disabled) return;
  }
}
