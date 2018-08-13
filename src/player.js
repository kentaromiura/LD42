import GameObject from "./gameObject";
import * as PIXI from "pixi.js";
import Event from "./event";
import EVENTS from "./events";

const vector = (x, y) => new PIXI.Point(x, y);
const clamp = (point, boundary) => {
  if (point.x < boundary.tl.x) {
    point.x = boundary.tl.x;
  }
  if (point.y < boundary.tl.y) {
    point.y = boundary.tl.y;
  }
  if (point.x > boundary.br.x) {
    point.x = boundary.br.x;
  }
  if (point.y > boundary.br.y) {
    point.y = boundary.br.y;
  }
  return point;
};

export default class Player extends GameObject {
  constructor(sprite, spritepowered, state, x = 0, y = 0, w = 128, h = 128) {
    super(x, y, w, h);
    this.nextShotIn = 15;
    this.currentShotSpeed = 15;
    this.state = state;
    this.sprite = sprite;
    this.basesprite = sprite;

    this.powered = spritepowered;
    this.powered.animationSpeed = 1 / 5;

    this.isPowered = false;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    this.powered.anchor.x = 0.5;
    this.powered.anchor.y = 0.5;
    sprite.position = vector(x, y);

    sprite.width = w;
    sprite.height = h;
    this.powered.width = w;
    this.powered.height = h;
  }

  powerUp() {
    this.isPowered = true;
    const { x, y } = this.sprite.position;
    Event.fire(EVENTS.EXIT_STAGE, { sprite: this.sprite });

    this.sprite = this.powered;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    Event.fire(EVENTS.ENTER_STAGE, { sprite: this.sprite });
    this.sprite.play();
  }

  hit() {
    let isAlive = true;
    if (!this.isPowered) {
      isAlive = false;
      this.sprite.destroy();
    } else {
      this.powerDown();
    }
    return isAlive;
  }

  powerDown() {
    this.isPowered = false;
    const { x, y } = this.sprite.position;
    Event.fire(EVENTS.EXIT_STAGE, { sprite: this.sprite });
    this.sprite = this.basesprite;
    this.sprite.position.x = x;
    this.sprite.position.y = y;
    Event.fire(EVENTS.ENTER_STAGE, { sprite: this.sprite });
  }

  updatePosition() {
    if (this.nextShotIn < 0) {
      this.nextShotIn = this.currentShotSpeed;
      Event.fire(EVENTS.PROJECTILE, {
        x: this.sprite.x,
        y: this.sprite.y - 34
      });
    } else {
      this.nextShotIn--;
    }

    const state = this.state;
    if (state.lastTouchCoords) {
      const startX = state.lastTouchCoords.clientX;
      const startY = state.lastTouchCoords.clientY;
      if (state.lastTouchMoveCoords) {
        const endX = state.lastTouchMoveCoords.clientX;
        const endY = state.lastTouchMoveCoords.clientY;

        state.lastTouchCoords = {
          clientX: state.lastTouchMoveCoords.clientX,
          clientY: state.lastTouchMoveCoords.clientY
        };

        if (endX && endY) {
          if (startX !== endX || startY !== endY) {
            const x = this.sprite.x;
            const y = this.sprite.y;
            const orientation = endX - startX;
            this.sprite.rotation = (Math.PI / 2) * Math.sin(orientation / 100);
            if (orientation > 0.5) {
              this.sprite.gotoAndStop(2);
            } else if (orientation < 0.5) {
              this.sprite.gotoAndStop(1);
            } else {
              this.sprite.gotoAndStop(0);
            }

            this.sprite.position = clamp(
              vector(x, y).add(vector(endX - startX, endY - startY)),
              state.boundaries
            );
            this.x = this.sprite.x;
            this.y = this.sprite.y;
          }
        }
      }
    }
  }
}
