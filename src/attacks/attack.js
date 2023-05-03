import { FloatingMessage } from "../ui/floatingMessage.js";

class Attack {
    constructor(name) {
        this.name = name;
    }
    doDamage(attack, enemy) {
        attack.activated = false;
        enemy.health -= this.damage;
        attack.game.floatingMessages.push(new FloatingMessage('-' + this.damage, enemy.x, enemy.y, enemy.x - enemy.speedX * 20, enemy.y - 20));
        if (enemy.health <= 0) enemy.deletionFlag = true;
    }
}

export class Obsession extends Attack {
    constructor(name) {
        super(name);
    }
}

export class Weapon extends Attack {
    constructor(name) {
        super(name);
        this.cost = 0;
        this.icon = new Image();
        this.icon.src = "../../../assets/ui/close_ui.png";
    }
}