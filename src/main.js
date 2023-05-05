/** @type {HTMLCanvasElement} */
import Player from "./player/player.js";
import InputHandler from "./input/input.js";
import { Zombie } from "./enemies/enemy.js";
import { UI } from "./ui/ui.js";

window.addEventListener('load', function() {
    const loading = this.document.getElementById('loading');
    loading.style.display = 'none';
    
    const canvas = this.document.getElementById('canvasMain');
    const bounds = { 
        'TOP': canvas.getBoundingClientRect().top,
        'LEFT': canvas.getBoundingClientRect().left
    }
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    class Game {
        constructor(width, height, bounds) {
            // bg
            // this.level = {
            //     "test_area" : ["../assets/background/test.png"]
            // };
            // this.currentLevel = "test_area";
            // this.background = [];
            // this.level[this.currentLevel].forEach(path => {
            //     let img = new Image();
            //     img.src = path;
            //     this.background.push(img);
            // })
            this.bg = bg;
            this.bgW = 5120;
            this.bgH = 2880;
            //
            this.width = width;
            this.height = height;
            this.bounds = bounds;
            this.enemySpawn = 100;
            this.enemyTimer = 0;
            this.enemies = [];
            this.maxEnemies = 1;
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
            // initial camera coordinates
            this.normaliseFactors = {
                "X": this.width / 2 - this.player.width / 2 - this.player.x,
                "conditionX": this.player.x + this.player.width / 2 >= this.width / 2 && this.player.x + this.player.width / 2 <= this.bgW - this.width / 2,
                "Y": this.height / 2 - this.player.height / 2 - this.player.y,
                "conditionY": this.player.y + this.player.height / 2 >= this.height / 2 && this.player.y + this.player.height / 2 <= this.bgH - this.height / 2
            }
        }
        update(deltatime) {
            // set new camera coordinates
            this.normaliseFactors.conditionX = this.player.x + this.player.width / 2 >= this.width / 2 && this.player.x + this.player.width / 2 <= this.bgW - this.width / 2;
            this.normaliseFactors.conditionY = this.player.y + this.player.height / 2 >= this.height / 2 && this.player.y + this.player.height / 2 <= this.bgH - this.height / 2;
            if (this.normaliseFactors.conditionX) this.normaliseFactors.X = this.width / 2 - this.player.width / 2 - this.player.x;
            if (this.normaliseFactors.conditionY) this.normaliseFactors.Y = this.height / 2 - this.player.height / 2 - this.player.y;
            // handle player
            this.player.update(this.input.keys);
            // handle attacks
            // this.player.currentAttack.update(this.player.currentAttack, deltatime);
            this.activeAttacks.forEach(attack => {
                attack.update(attack, deltatime);
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
            this.activeAttacks = this.activeAttacks.filter(attack => attack.activated || attack.cast || attack.cooldownTimer <= attack.cooldown);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }
        draw(context) {
            context.save();
            context.translate(this.normaliseFactors.X, this.normaliseFactors.Y);
            // handle background
            // context.drawImage(this.background[0], 0, 0, 5120, 2880, 0, 0, 5120, 2880);
            context.drawImage(this.bg, 0, 0, this.bgW, this.bgH, 0, 0, this.bgW, this.bgH);
            // handle player
            this.player.draw(context);
            // handle attacks
            this.activeAttacks.forEach(attack => {
                if (attack.activated) attack.draw(context);
            });
            // handle enemies
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            // handle floating messages
            this.floatingMessages.forEach((message) => {
                message.draw(context);
            });
            context.restore();
            // handle ui
            this.playerInfo.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height, bounds);
    game.playerInfo.addListeners(canvas);

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