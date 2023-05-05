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
        this.castTime = 500;
        this.castTimer = 0;
        this.damage = 20;
        this.cost = 5;
        this.continuous = false;
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
    updateVisuals(attack) {
        this.x -= this.rangedSpeedX;
        this.y -= this.rangedSpeedY;
        if (this.outOfCameraGeneral(attack) || this.outOfCameraLimit(attack)) attack.activated = false;        
    }
    // on general occasions aka the player is centered
    outOfCameraGeneral(attack) {
        return (
            attack.game.player.x + attack.game.normaliseFactors.X === attack.game.width / 2 - attack.game.player.width / 2 &&
            attack.game.player.y + attack.game.normaliseFactors.Y === attack.game.height / 2 - attack.game.player.height / 2 &&
            (   this.x > attack.game.player.x + attack.game.player.width / 2 + attack.game.width / 2 || 
                this.x < attack.game.player.x + attack.game.player.width / 2 - attack.game.width / 2 ||
                this.y > attack.game.player.y + attack.game.player.height / 2 + attack.game.height / 2 ||
                this.y < attack.game.player.y + attack.game.player.height / 2 - attack.game.height / 2
            )
        );
    }
    // the camera doesn't move aka the player is near the boundaries
    outOfCameraLimit(attack) {
        return (
            this.x > attack.game.player.x + attack.game.player.width / 2 + attack.game.width || 
            this.x < attack.game.player.x + attack.game.player.width / 2 - attack.game.width ||
            this.y > attack.game.player.y + attack.game.player.height / 2 + attack.game.height ||
            this.y < attack.game.player.y + attack.game.player.height / 2 - attack.game.height);
    }
    updateCasting(attack, deltatime) {
        this.castTimer += deltatime;
        if (this.castTimer > this.castTime) {
            attack.cast = false;
            this.castTimer = 0;
        }
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}