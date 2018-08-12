import { Howl, Howler } from "howler";
import Player from "./player";
import Projectile from "./projectile";
import Event from "./event";
import EVENTS from "./events";

const sound = new Howl({ src: ["assets/Orbital_Colossus.mp3"] });

let projectiles = [];
const vector = (x, y) => new PIXI.Point(x, y);

export default class Game {
  constructor(app, state, onReady = () => {}) {
    this.app = app;
    this.assetManager = {};

    Event.on(EVENTS.EXPLOSION, ({ x, y }) => {
      const animatedsprite = this.assetManager.explosion();
      animatedsprite.animationSpeed = 1 / 5;
      animatedsprite.loop = false;
      animatedsprite.anchor.x = 0.5;
      animatedsprite.anchor.y = 0.5;
      animatedsprite.position = vector(x, y);
      animatedsprite.width = 64;
      animatedsprite.height = 64;
      animatedsprite.onComplete = () => animatedsprite.destroy();
      app.stage.addChild(animatedsprite);
      animatedsprite.play();
    });

    Event.on(EVENTS.PROJECTILE, ({ x, y }) => {
      const p = new Projectile(
        this.assetManager.currentProjectile(),
        x,
        y,
        32,
        32
      );

      app.stage.addChild(p.sprite);
      projectiles.push(p);
    });

    const initialize = () => {
      // load the texture we need
      PIXI.loader
        .add("fuji", "assets/fuji.jpeg")
        .add("player", "assets/airplane5-dot.png")
        .add("playerTiltLeft", "assets/airplane5-left-dot.png")
        .add("playerTiltRight", "assets/airplane5-right-dot.png")
        .add("projectile", "assets/test.json")
        .add("explosion", "assets/explosion.json")
        .load((loader, resources) => {
          this.assetManager.currentProjectile = () =>
            new PIXI.extras.AnimatedSprite([
              PIXI.Sprite.fromFrame("shot2-dot-blue.png").texture,
              PIXI.Sprite.fromFrame("shot2-dot.png").texture
            ]);

          this.assetManager.explosion = () => {
            // TODO: memoize animation
            return new PIXI.extras.AnimatedSprite(
              [
                "explosion1.png",
                "explosion2.png",
                "explosion3.png",
                "explosion4.png",
                "explosion5.png",
                "explosion6.png",
                "explosion7.png",
                "explosion8.png"
              ].map(file => PIXI.Sprite.fromFrame(file).texture)
            );
          };

          const centerX = app.renderer.width / 2;
          const centerY = app.renderer.height / 2;
          const player = new Player(
            new PIXI.extras.AnimatedSprite([
              resources.player.texture,
              resources.playerTiltLeft.texture,
              resources.playerTiltRight.texture
            ]),
            state,
            centerX,
            centerY
          );
          // This creates a texture from a 'fuji.png' image
          var fuji = new PIXI.extras.TilingSprite(
            resources.fuji.texture,
            app.renderer.width,
            app.renderer.height
          );
          // Setup the position of the fuji
          fuji.x = 0;
          fuji.y = 0;
          fuji.tilePosition.x = 0;
          fuji.tilePosition.y = 0;

          // Add the fuji to the scene we are building
          app.stage.addChild(fuji);
          app.stage.addChild(player.sprite);
          // Listen for frame updates
          app.ticker.add(() => {
            player.updatePosition();
            projectiles.forEach(p => p.updatePosition());
            projectiles = projectiles.filter(p => !p.disabled);
            fuji.tilePosition.y -= 2;
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
