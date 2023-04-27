import { Standing, Running } from "./playerStates.js";
import { CloseAttack, RangedAttack } from "./playerAttack.js";
import Inventory from "./inventory.js";

export default class Player {
    constructor(game) {
        this.game = game;
        this.image = player;
        this.width = 50;
        this.height = 150;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height / 2 - this.height / 2;
        this.speedX = 0;
        this.speedY = this.speedX;
        this.offsetX = 5;
        this.offsetW = -10;
        this.offsetY = 5;
        this.offsetH = -7;
        this.states = [new Standing(this.game), new Running(this.game)];
        this.currentState = null;
        this.inventory = new Inventory();
        this.attacks = [new CloseAttack(this.game, this.inventory.weapon), new RangedAttack(this.game)];
        this.currentAttack = null;
        this.health = 100;
        this.obsession = 50;
        this.flipped = false;
    }
    setState(state, speed) {
        this.currentState = this.states[state];
        this.speedX = this.speedY = speed;
        this.currentState.enter();
    }
    setAttack(attack) {
        this.currentAttack = this.attacks[attack];
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
        if (this.flipped) {
            context.scale(-1, 1);
            context.drawImage(this.image, 0, 0, this.width, this.height, -this.x - this.width, this.y, this.width, this.height);
            context.scale(-1, 1);    
        }
        else {
            context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
    }
}