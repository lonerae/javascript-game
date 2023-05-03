import { Obsession } from "../attack.js";

export class Shout extends Obsession {
    constructor() {
        super("Shout");
        this.image = new Image();
        this.image.src = "../../../assets/obsessions/ranged_first.png";
        this.icon = new Image();
        this.icon.src = "../../../assets/ui/ranged_ui.png";
        this.width = 25;
        this.height = 25;
        this.baseSpeed = 10;
        this.activated = false;
        this.cooldown = 1000;
        this.cooldownTimer = this.cooldown;
        this.damage = 20;
        this.cost = 5;
    }
    setVisuals(attack) {
        attack.game.player.obsession -= this.cost;
        this.x = attack.game.player.x + attack.game.player.width / 2;
        this.y = attack.game.player.y + attack.game.player.height / 3;
        let dx = this.x - attack.targetX;
        let dy = this.y - attack.targetY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        this.rangedSpeedX = dx / dist * this.baseSpeed;
        this.rangedSpeedY = dy / dist * this.baseSpeed;
    }
    checkCollision(attack,enemy) {
        if (this.x + this.width > enemy.x + enemy.offsetX &&
            this.x < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW &&
            this.y + this.height > enemy.y + enemy.offsetY &&
            this.y < enemy.y + enemy.offsetY + enemy.height + enemy.offsetH)  
        {
            this.doDamage(attack, enemy);
        }  
    }
    updateVisuals() {
        this.x -= this.rangedSpeedX;
        this.y -= this.rangedSpeedY;
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}