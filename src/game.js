import { Howl, Howler } from "howler";
import Player from "./player";
import Projectile from "./projectile";

const sound = new Howl({ src: ["assets/Orbital_Colossus.mp3"] });

let projectiles = [];

export default class Game {
  constructor(app, state, onReady = () => {}) {
    this.app = app;
    const messages = {
      createProjectile(x, y) {
        const p = new Projectile(state.currentProjectile(), x, y, 32, 32);

        app.stage.addChild(p.sprite);
        projectiles.push(p);
      }
    };

    const initialize = () => {
      // load the texture we need
      PIXI.loader
        .add("fuji", "assets/fuji.jpeg")
        .add("player", "assets/airplane1.png")
        .add("projectile", "assets/test.json")
        .load((loader, resources) => {
          state.currentProjectile = () =>
            new PIXI.extras.AnimatedSprite([
              PIXI.Sprite.fromFrame("shot2-dot-blue.png").texture,
              PIXI.Sprite.fromFrame("shot2-dot.png").texture
            ]);
          const centerX = app.renderer.width / 2;
          const centerY = app.renderer.height / 2;
          const player = new Player(
            new PIXI.Sprite(resources.player.texture),
            state,
            messages,
            centerX,
            centerY
          );
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
          app.stage.addChild(player.sprite);
          // Listen for frame updates
          app.ticker.add(() => {
            player.updatePosition();
            projectiles.forEach(p => p.updatePosition());
            projectiles = projectiles.filter(p => !p.disabled);
          });
          onReady();
        });
    };
    initialize();
  }

  play() {
    this.app.start();
    sound.play();
  }

  pause() {
    this.app.stop();
    sound.pause();
  }
}
