import GameObject from "./gameObject";
import * as PIXI from "pixi.js";

const vector = (x, y) => new PIXI.Point(x, y);

export default class Player extends GameObject {
  constructor(sprite, state, messages, x = 0, y = 0, w = 64, h = 64) {
    super(x, y, w, h);
    this.nextShotIn = 15;
    this.currentShotSpeed = 15;
    this.state = state;
    this.sprite = sprite;
    this.messages = messages;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.position = vector(x, y);
    sprite.width = w;
    sprite.height = h;
  }

  updatePosition() {
    if (this.nextShotIn < 0) {
      this.nextShotIn = this.currentShotSpeed;
      this.messages.createProjectile(this.sprite.x, this.sprite.y - 34);
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

            this.sprite.position = vector(x, y).add(
              vector(endX - startX, endY - startY)
            );
          }
        }
      }
    }
  }
}
