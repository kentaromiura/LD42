import GameObject from "./gameObject";
import * as PIXI from "pixi.js";
import Event from "./event";
import Events from "./events";

const vector = (x, y) => new PIXI.Point(x, y);

export default class Projectile extends GameObject {
  constructor(animatedsprite, x = 0, y = 0, w = 32, h = 32) {
    super(x, y, w, h);
    this.sprite = animatedsprite;
    animatedsprite.loop = true;
    animatedsprite.animationSpeed = 1 / 5;

    animatedsprite.anchor.x = 0.5;
    animatedsprite.anchor.y = 0.5;
    animatedsprite.position = vector(x, y);
    animatedsprite.width = w;
    animatedsprite.height = h;
    animatedsprite.play();
  }

  updatePosition() {
    this.sprite.y -= 20;
    if (this.sprite.y < 0 - 40) {
      this.disabled = true;
      Event.fire(Events.exlosion, { x: this.sprite.x, y: 16 });
      this.sprite.destroy();
    }
  }
}
