/** @type {HTMLCanvasElement} */
import Player from "./player.js";
import InputHandler from "./input.js";
import { Zombie } from "./enemy.js";
import { UI } from "./ui.js";

window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.enemySpawn = 100;
            this.enemyTimer = 0;
            this.enemies = [];
            this.maxEnemies = 10;
            this.player = new Player(this);
            this.input = new InputHandler();
            this.playerInfo = new UI(this);
            // initial state is STANDING
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltatime) {
            // handle player
            this.player.update(this.input.keys, deltatime);
            // handle enemies
            if (this.enemyTimer > this.enemySpawn && this.enemies.length < this.maxEnemies) {
                this.enemies.push(new Zombie(this));
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltatime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(this.player.x, this.player.y);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.deletionFlag);
        }
        draw(context) {
            // handle player
            this.player.draw(context);
            this.playerInfo.draw(context);
            // handle enemies
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            })
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;
    function animate(timestamp) {
        let deltatime = timestamp - lastTime;
        lastTime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltatime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate(0);
});