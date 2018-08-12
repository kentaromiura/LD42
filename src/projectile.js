import GameObject from "./gameObject";
import * as PIXI from "pixi.js";
import Event from "./event";
import EVENTS from "./events";

const vector = (x, y) => new PIXI.Point(x, y);

export default class Projectile extends GameObject {
  constructor(
    animatedsprite,
    x = 0,
    y = 0,
    w = 32,
    h = 32,
    direction = -20,
    maxHeight = +Infinity
  ) {
    super(x, y, w, h);
    this.sprite = animatedsprite;
    this.direction = direction;
    this.maxHeight = maxHeight;
    animatedsprite.loop = true;
    animatedsprite.animationSpeed = 1 / 5;

    animatedsprite.anchor.x = 0.5;
    animatedsprite.anchor.y = 0.5;
    animatedsprite.position = vector(x, y);
    animatedsprite.width = w;
    animatedsprite.height = h;
    animatedsprite.play();
  }

  destroy() {
    this.disabled = true;
    Event.fire(EVENTS.EXPLOSION, { x: this.sprite.x, y: this.sprite.y });
    this.sprite.destroy();
  }

  updatePosition() {
    if (this.disabled) return;
    this.sprite.y += this.direction;
    if (this.direction > 0) {
      this.sprite.rotation = (Math.PI / 2) * Math.sin(this.sprite.y / 100);
    }
    this.y = this.sprite.y;
    if (this.sprite.y < 0 - 40) {
      this.disabled = true;
      this.sprite.destroy();
      return;
    }

    if (this.sprite.y > this.maxHeight) {
      this.disabled = true;
      this.sprite.destroy();
    }
  }
}
