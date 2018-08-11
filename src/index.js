import * as PIXI from "pixi.js";
import Game from "./game";
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application({autostart: false});

// globals
const keyStatus = {};
const state = {};

onload = function() {
  // get global target canvas
  const target = document.getElementById("target");
  target.appendChild(app.view);

  const game = new Game(app, state, () => {
    // this is only to always show the first frame.
    game.play();
    requestAnimationFrame(() => {
      game.pause();

      // Define touch events
      const eventHandlers = {
        touchstart(evt) {
          const {screenX, screenY} = evt.touches[0];
          state.lastTouchCoords = {screenX, screenY};
          game.play();
        },
        touchend(evt){
          game.pause();
        },
        touchmove(evt){
          const {screenX, screenY} = evt.touches[0];
          state.lastTouchMoveCoords = {screenX, screenY};
        }
      }

      // Adding all touch events here
      for (let evt in eventHandlers) {
        target.addEventListener(evt, eventHandlers[evt]);
      }

      // basic keyboard support
      const keyEvents = {
        keydown(evt) {
          keyStatus[evt.keyCode] = true;
          game.play();
        },
        keyup(evt) {
          delete keyStatus[evt.keyCode];
          if (Object.keys(keyStatus).length === 0) game.pause();
        }
      };

      for (let evt in keyEvents) {
        document.addEventListener(evt, keyEvents[evt]);
      }

    });
  });
};
