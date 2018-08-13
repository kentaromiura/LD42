import { Howl, Howler } from "howler";
import Player from "./player";
import Projectile from "./projectile";
import Event from "./event";
import EVENTS from "./events";
import Score from "./score";
import GameOver from "./gameOver";
import Enemy from "./enemy";
import Boss from "./boss";
import PowerUP from "./powerUp";
import { BulgePinchFilter } from "@pixi/filter-bulge-pinch";

import Transition from "./transition";
import Equations from "./equations";

import EnemyGroup from "./enemygroup";
import AABB from "./collision";
import { ESRCH } from "constants";

const soundsBank = [];

const sound = new Howl({ src: ["assets/Orbital_Colossus.mp3"], volume: 0.1 });
const projectileSFX = new Howl({ src: ["assets/laser.wav"], volume: 0.15 });
const explosionSFX = new Howl({ src: ["assets/explosion.wav"], volume: 0.15 });
const enemyHurtSFX = new Howl({ src: ["assets/enemyhurt.wav"], volume: 0.3 });
const powerUpSFX = new Howl({ src: ["assets/powerup.wav"], volume: 0.15 });

const promiseFromSFX = sfx =>
  new Promise((ok, ko) => {
    sfx.on("load", () => ok());
  });

soundsBank.push(
  promiseFromSFX(sound),
  promiseFromSFX(explosionSFX),
  promiseFromSFX(projectileSFX),
  promiseFromSFX(enemyHurtSFX),
  promiseFromSFX(powerUpSFX)
);

let projectiles = [];
let enemyprojectiles = [];
let powerUps = [];
let enemies = [];

const vector = (x, y) => new PIXI.Point(x, y);

export default class Game {
  constructor(app, state, onReady = () => {}) {
    const score = new Score();
    const gameOver = new GameOver();
    const testEnemyGroup = new EnemyGroup();

    this.app = app;
    this.assetManager = {};

    Event.on(EVENTS.ADD_SCORE, ({ point }) => {
      score.addScore(point);
    });

    Event.on(EVENTS.ENTER_STAGE, ({ sprite }) => app.stage.addChild(sprite));
    Event.on(EVENTS.EXIT_STAGE, ({ sprite }) => app.stage.removeChild(sprite));

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

    Event.on(EVENTS.POWER_UP, ({ x, y, type }) => {
      const p = new PowerUP(this.assetManager.powerUp(), type, x, y);
      app.stage.addChild(p.sprite);
      powerUps.push(p);
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

    Event.on(EVENTS.BOSS_PROJECTILE, ({ x, y }) => {
      const p = new Projectile(
        this.assetManager.bossProjectile(),
        x,
        y,
        32,
        32,
        +20,
        app.renderer.height
      );
      enemyprojectiles.push(p);
      app.stage.addChild(p.sprite);
      p.sprite.play();
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
        .add("bossProjectile", "assets/enemy-cross4.png")
        .add("projectile", "assets/test.json")
        .add("explosion", "assets/explosion.json")
        .add("boss", "assets/enemy-rotate.json")
        .add("enemy", "assets/enemy1.png")
        .add("star", "assets/star-dot.png")
        .add("star2", "assets/star-dot2.png")
        .add("powered", "assets/airplane-power.json")
        .add("singularity", "assets/singularity.png")
        .load((loader, resources) => {
          this.assetManager.singularity = () => {
            const res = new PIXI.Sprite(resources.singularity.texture);
            new Transition(3000, Equations.bounce, delta => {
              res.filters = [
                new BulgePinchFilter(
                  vector(0.5, 0.5),
                  Math.max(res.height, res.width),
                  delta
                ),
                new BulgePinchFilter(vector(delta, delta), res.height, -1),
                new BulgePinchFilter(vector(1 - delta, delta), res.height, -1)
              ];
            }).loop();
            return res;
          };

          this.assetManager.powerUp = () =>
            new PIXI.extras.AnimatedSprite([
              resources.star.texture,
              resources.star2.texture
            ]);

          this.assetManager.enemy = () =>
            new PIXI.extras.AnimatedSprite([resources.enemy.texture]);

          this.assetManager.currentProjectile = () =>
            new PIXI.extras.AnimatedSprite([
              PIXI.Sprite.fromFrame("shot2-dot-blue.png").texture,
              PIXI.Sprite.fromFrame("shot2-dot.png").texture
            ]);

          this.assetManager.airplanePowered = () => {
            // TODO: memoize animation
            const res = new PIXI.extras.AnimatedSprite(
              [
                "airplane5-dot-1.png",
                "airplane5-dot-2.png",
                "airplane5-dot-3.png",
                "airplane5-dot-4.png",
                "airplane5-dot-5.png"
              ].map(file => PIXI.Sprite.fromFrame(file).texture)
            );

            return res;
          };

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
          this.assetManager.boss = () => {
            return new PIXI.extras.AnimatedSprite(
              [
                "enemy1-dot-1.png",
                "enemy1-dot-2.png",
                "enemy1-dot-3.png",
                "enemy1-dot-4.png",
                "enemy1-dot-5.png",
                "enemy1-dot-6.png",
                "enemy1-dot-7.png",
                "enemy1-dot-8.png",
                "enemy1-dot-9.png",
                "enemy1-dot-10.png",
                "enemy1-dot-11.png"
              ].map(file => PIXI.Sprite.fromFrame(file).texture)
            );
          };
          this.assetManager.bossProjectile = () =>
            new PIXI.extras.AnimatedSprite([resources.bossProjectile.texture]);

          const centerX = app.renderer.width / 2;
          const centerY = app.renderer.height / 2;
          const player = new Player(
            new PIXI.extras.AnimatedSprite([
              resources.player.texture,
              resources.playerTiltLeft.texture,
              resources.playerTiltRight.texture
            ]),
            this.assetManager.airplanePowered(),
            state,
            centerX,
            centerY,
            playerWidth,
            playerHeight
          );

          Event.on(EVENTS.POWERUP_COLLECTED, () => {
            player.powerUp();
          });

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

          // TEST BOSS
          const boss = new Boss(this.assetManager.boss(), state, 400, 400);
          app.stage.addChild(boss.sprite);
          boss.sprite.play();

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

          const blackHole = this.assetManager.singularity();
          blackHole.x = 0;
          blackHole.height = 64;
          blackHole.y = app.renderer.height - blackHole.height;
          blackHole.width = app.renderer.width;
          state.boundaries.br.y -= 64;

          app.stage.addChild(blackHole);

          Event.on(EVENTS.INCREASE_BLACKHOLE, ({ amount }) => {
            blackHole.height += amount;
            blackHole.y = app.renderer.height - blackHole.height;
            state.boundaries.br.y -= amount;
            player.fixPosition(state.boundaries.br.y);
          });

          // TODO: use real logic.
          setInterval(() => {
            Event.fire(EVENTS.INCREASE_BLACKHOLE, { amount: 10 });
          }, 500);

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

              enemyprojectiles.forEach(p => p.updatePosition());
              enemyprojectiles = enemyprojectiles.filter(p => !p.disabled);
              if ((check = AABB(enemyprojectiles, player))) {
                check.destroy();

                const isAlive = player.hit();
                if (!isAlive) {
                  explosionSFX.play();
                  gameOver.showGameOver();
                }
                //player.sprite.destroy();
              }

              powerUps.forEach(p => p.updatePosition());
              powerUps = powerUps.filter(p => !p.disabled);
              if ((check = AABB(powerUps, player))) {
                check.collected();
                powerUpSFX.play();
                // TODO: start power up effect.
              }

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
