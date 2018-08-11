export default class Game {

  constructor(app, onReady = () => {}) {
    this.app = app;
    const initialize = () => {
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
        onReady();
        //this.pause();
      });
    }
    initialize();
  }

  play () {
    this.app.start();
  }

  pause() {
    this.app.stop();
  }
}
