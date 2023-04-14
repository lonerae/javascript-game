import { Standing, Running } from "./playerStates.js";
import { RangedAttack } from "./playerAttack.js";

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
        this.offsetX = 5;
        this.offsetW = -10;
        this.offsetY = 5;
        this.offsetH = -7;
        this.states = [new Standing(this.game), new Running(this.game)];
        this.currentState = null;
        this.attacks = [new RangedAttack(this.game)];
        this.currentAttack = null;
        this.health = 100;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = speed;
        this.currentState.enter();
    }
    attack(targetX, targetY) {
        this.currentAttack.targetX = targetX;
        this.currentAttack.targetY = targetY;
        this.currentAttack.activate();
    }
    update(input) {
        this.currentState.handleInput(input);
    }
    draw(context) {
        context.strokeRect(this.x + this.offsetX, this.y + this.offsetY, this.width + this.offsetW, this.height + this.offsetH);
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}