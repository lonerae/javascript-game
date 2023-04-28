/** @type {HTMLCanvasElement} */
import Player from "./player.js";
import InputHandler from "./input.js";
import { Zombie } from "./enemy.js";
import { UI } from "./ui.js";

window.addEventListener('load', function() {
    const canvas = this.document.getElementById('canvas1');
    const bounds = { 
        'TOP': canvas.getBoundingClientRect().top,
        'LEFT': canvas.getBoundingClientRect().left
    }
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    class Game {
        constructor(width, height, bounds) {
            this.width = width;
            this.height = height;
            this.bounds = bounds;
            this.enemySpawn = 100;
            this.enemyTimer = 0;
            this.enemies = [];
            this.maxEnemies = 10;
            this.activeAttacks = [];
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.playerInfo = new UI(this);
            // initial state is STANDING
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
            // initial attack is CLOSE
            this.player.currentAttack = this.player.attacks[0];
            this.floatingMessages = [];
        }
        update(deltatime) {
            // handle player
            this.player.update(this.input.keys);
            // handle attacks
            this.player.currentAttack.update(deltatime);
            this.activeAttacks.forEach(attack => {
                if (attack !== this.player.currentAttack) attack.update(deltatime);
            });
            // handle enemies
            if (this.enemyTimer > this.enemySpawn && this.enemies.length < this.maxEnemies) {
                this.enemies.push(new Zombie(this));
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltatime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltatime);
            });
            // handle floating messages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            
            this.enemies = this.enemies.filter(enemy => !enemy.deletionFlag);
            this.activeAttacks = this.activeAttacks.filter(attack => attack.visible || attack.cooldownTimer <= attack.cooldown);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }
        draw(context) {
            // handle player
            this.player.draw(context);
            // handle attacks
            this.activeAttacks.forEach(attack => {
                if (attack.visible) attack.draw(context);
            });
            // handle enemies
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            // handle floating messages
            this.floatingMessages.forEach((message) => {
                message.draw(context);
            });
            // handle ui
            this.playerInfo.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height, bounds);

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