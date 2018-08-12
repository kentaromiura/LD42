import * as PIXI from "pixi.js";

// Add some utils...
PIXI.Point.prototype.add = function(point) {
  this.set(this.x + point.x, this.y + point.y);
  return this;
};

// disable to be able to test with chrome.
PIXI.accessibility.AccessibilityManager.prototype.createTouchHook = () => {};

import connect from "./p2p";

import Game from "./game";
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application(window.innerWidth, window.innerHeight, {
  autostart: false
});

// storing app as a global only for test purpose.
new Function("return this")().app = app;

onload = function() {
  // globals
  const keyStatus = {};
  const state = {};

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
          const { clientX, clientY } = evt.touches[0];
          state.lastTouchCoords = { clientX, clientY };
          game.play();
        },
        touchend(evt) {
          game.pause();
          state.lastTouchCoords = null;
        },
        touchmove(evt) {
          //console.log(evt);
          const { clientX, clientY } = evt.touches[0];
          state.lastTouchMoveCoords = { clientX, clientY };
        }
      };

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
        // document.addEventListener(evt, keyEvents[evt]);
      }
    });
  });
};

// TODO: plz use for communication to each other.
connect().then(client => {
  // register callback to receive data from other.
  client.on('message', (data, from) => {
    console.log(data, from);
  });
  client.on('disconnected', (id) => {
    console.log(id);
  });
  client.on('new-attendee', (id) => {
    console.log(id);
  });
  client.on('leave-attendee', (id) => {
    console.log(id);
  });

  // Send message to specific user
  client.to('xxxxxx', { gameis: 'fun'})

  // Get number of connections
  client.size();

  // send message to other player.
  client.emit({ foo: "bar" });
});
