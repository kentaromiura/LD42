import * as PIXI from "pixi.js";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
onload = function() {
  document.getElementById("target").appendChild(app.view);
  start();
};

const start = () => {
  // load the texture we need
  PIXI.loader.add("fuji", "assets/fuji.jpeg").load((loader, resources) => {
    // This creates a texture from a 'fuji.png' image
    const fuji = new PIXI.Sprite(resources.fuji.texture);

    // Setup the position of the fuji
    fuji.x = app.renderer.width / 2;
    fuji.y = app.renderer.height / 2;

    // Rotate around the center
    fuji.anchor.x = 0.5;
    fuji.anchor.y = 0.5;

    // Add the fuji to the scene we are building
    app.stage.addChild(fuji);

    // Listen for frame updates
    app.ticker.add(() => {
      // each frame we spin the fuji around a bit
      fuji.rotation += 0.01;
    });
  });
};
