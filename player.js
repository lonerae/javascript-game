import { Standing, Running } from "./playerStates.js";

export default class Player {
    constructor(game) {
        this.game = game;
        this.image = player;
        this.width = 50;
        this.height = 150;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height / 2 - this.height / 2;
        this.speedX = 2;
        this.speedY = this.speedX;
        this.states = [new Standing(this.game), new Running(this.game)];
        this.currentState = null;
        this.health = 100;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = speed;
        this.currentState.enter();
    }
    update(input, deltatime) {
        this.checkCollision(deltatime);
        this.currentState.handleInput(input);
    }
    draw(context) {
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    checkCollision(deltatime) {
        this.game.enemies.forEach(enemy => {
            if (    enemy.x < this.x + this.width &&
                    enemy.x + enemy.width > this.x &&
                    enemy.y < this.y + this.height &&
                    enemy.y + enemy.height > this.y
                ) {
                    if (this.health > 0) enemy.attack(deltatime);
                }           
        });
    }
}