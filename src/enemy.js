import GameObject from "./gameObject";
import * as PIXI from "pixi.js";
import Event from "./event";
import EVENTS from "./events";

const vector = (x, y) => new PIXI.Point(x, y);

export default class Player extends GameObject {
  constructor(sprite, state, x = 0, y = 0, w = 128, h = 128) {
    super(x, y, w, h);

    this.state = state;
    this.sprite = sprite;

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.position = vector(x, y);
    sprite.width = w;
    sprite.height = h;

    // fix size for collision check
    this.w = 32;
    this.h = 128 - 32;
  }

  updatePosition() {}
}
