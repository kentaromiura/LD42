import { Howl, Howler } from "howler";
import Player from "./player";
import Projectile from "./projectile";
import Event from "./event";
import EVENTS from "./events";
import Score from "./score";
import Enemy from "./enemy";
import EnemyGroup from "./enemygroup";
import AABB from "./collision";

const soundsBank = [];

const sound = new Howl({ src: ["assets/Orbital_Colossus.mp3"], volume: 0.1 });
const projectileSFX = new Howl({ src: ["assets/laser.wav"], volume: 0.15 });
const explosionSFX = new Howl({ src: ["assets/explosion.wav"], volume: 0.15 });
const enemyHurtSFX = new Howl({ src: ["assets/enemyhurt.wav"], volume: 0.3 });

soundsBank.push(
  new Promise((ok, ko) => {
    sound.on("load", () => ok());
  }),
  new Promise((ok, ko) => {
    explosionSFX.on("load", () => ok());
  }),
  new Promise((ok, ko) => {
    projectileSFX.on("load", () => ok());
  }),
  new Promise((ok, ko) => {
    enemyHurtSFX.on("load", () => ok());
  })
);

let projectiles = [];
let enemies = [];

const vector = (x, y) => new PIXI.Point(x, y);

export default class Game {
  constructor(app, state, onReady = () => {}) {
    const score = new Score();
    const testEnemyGroup = new EnemyGroup();

    this.app = app;
    this.assetManager = {};

    Event.on(EVENTS.ADD_SCORE, ({ point }) => {
      score.addScore(point);
    });

    Event.on(EVENTS.EXPLOSION, ({ x, y }) => {
      const animatedsprite = this.assetManager.explosion();
      animatedsprite.animationSpeed = 1 / 5;
      animatedsprite.loop = false;
      animatedsprite.anchor.x = 0.5;
      animatedsprite.anchor.y = 0.5;
      animatedsprite.position = vector(x, y);
      animatedsprite.width = 64;
      animatedsprite.height = 64;
      animatedsprite.onComplete = () => {
        animatedsprite.destroy();
        // TODO: update points in the correct place
        Event.fire(EVENTS.ADD_SCORE, { point: 15 });
      };
      app.stage.addChild(animatedsprite);
      animatedsprite.play();
      explosionSFX.fade(0.1, 0, 800, explosionSFX.play());
    });

    Event.on(EVENTS.ENEMY_DIE, () => {
      enemyHurtSFX.fade(0.1, 0, 800, enemyHurtSFX.play());
    });

    Event.on(EVENTS.PROJECTILE, ({ x, y }) => {
      const p = new Projectile(
        this.assetManager.currentProjectile(),
        x,
        y,
        32,
        32
      );

      projectileSFX.fade(0.1, 0, 200, projectileSFX.play());

      app.stage.addChild(p.sprite);
      projectiles.push(p);
    });

    const initialize = () => {
      const playerWidth = 128;
      const playerHeight = 128;
      state.playerDMG = 30;
      state.boundaries = {
        tl: {
          x: playerWidth / 2,
          y: playerHeight / 2
        },
        br: {
          x: app.renderer.width - playerWidth / 2,
          y: app.renderer.height - playerHeight / 2
        }
      };

      // load the texture we need
      PIXI.loader
        .add("fuji", "assets/fuji.jpeg")
        .add("player", "assets/airplane5-dot.png")
        .add("playerTiltLeft", "assets/airplane5-left-dot.png")
        .add("playerTiltRight", "assets/airplane5-right-dot.png")
        .add("projectile", "assets/test.json")
        .add("explosion", "assets/explosion.json")
        .add("enemy", "assets/enemy1.png")
        .load((loader, resources) => {
          this.assetManager.enemy = () =>
            new PIXI.extras.AnimatedSprite([resources.enemy.texture]);

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
            centerY,
            playerWidth,
            playerHeight
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
          let isReady = false;

          const enemy = new Enemy(
            this.assetManager.enemy(),
            state,
            playerWidth,
            playerHeight,
            playerWidth,
            playerHeight
          );
          testEnemyGroup.add(enemy);
          enemies.push(enemy);
          app.stage.addChild(enemy.sprite);

          app.ticker.add(() => {
            if (isReady) {
              player.updatePosition();
              projectiles.forEach(p => p.updatePosition());
              projectiles = projectiles.filter(p => !p.disabled);
              let check;
              enemies.forEach(enemy => {
                enemy.updatePosition(); // TODO: implement it...
                if ((check = AABB(projectiles, enemy))) {
                  check.destroy();
                  enemy.hitBy(state.playerDMG);
                }
              });
              enemies = enemies.filter(p => !p.disabled);
              fuji.tilePosition.y -= 2;
            }
          });

          Promise.all(soundsBank).then(() => {
            onReady();
            isReady = true;
          });
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
