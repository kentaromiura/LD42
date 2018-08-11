import GameObject from "./gameObject";
import * as PIXI from "pixi.js";

const vector = (x, y) => new PIXI.Point(x, y);

export default class Projectile extends GameObject {
  constructor(animatedsprite, x = 0, y = 0, w = 32, h = 32, messages) {
    super(x, y, w, h);
    this.messages = messages;
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
      this.messages.createExplosion(this.sprite.x, 16);
      this.sprite.destroy();
    }
  }
}
