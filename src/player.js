import GameObject from "./gameObject"
import * as PIXI from "pixi.js";

const vector = (x, y) => new PIXI.Point(x, y);

export default class Player extends GameObject {

  constructor(sprite, state, x = 0, y = 0 , w = 64, h = 64) {
    super(x, y, w, h);
    this.state = state;
    this.sprite = sprite;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.position = vector(x, y);
    sprite.width = w;
    sprite.height = h;
  }

  updatePosition() {
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
            this.sprite.position = vector(x, y).add(
              vector(
                endX - startX,
                endY - startY
              )
            );
          }
        }
      }
    }
  }
}
