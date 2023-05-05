import { Weapon } from "../attack.js";

export class Sword extends Weapon {
    constructor(name) {
        super(name);
        this.icon = new Image();
        this.icon.src = "../../../assets/weapons/sword_icon.png";
        this.anim = new Image();
        this.anim.src = "../../../assets/weapons/sword.png";
        this.width = 72;
        this.height = 72;
        this.frameX = 0;
        this.maxFrameX = 2;
        this.frameY = 0;
        this.frameTime = 30;
        this.frameTimer = 0;
        this.cooldown = 200;
        this.damage = 10;
    }
    setVisuals(attack, area) {
        this.area = area;
        switch (this.area) {
            case "RIGHT":
                this.prepareRight(attack);
                break;
            case "LEFT":
                this.prepareLeft(attack);
                break;
            case "TOP":
                this.prepareTop(attack);
                break;
            case "BOTTOM":
                this.prepareBottom(attack);
                break;
            default:
                attack.activated = false;
        }
    }
    prepareRight(attack) {
        this.frameY = 0;
        this.x = attack.game.player.x + attack.game.player.width - 15;
        this.y = attack.game.player.y + 40;
    }
    prepareLeft(attack) {
        this.frameY = 1;
        this.x = attack.game.player.x - this.width + 15;
        this.y = attack.game.player.y + 40;
    }  
    prepareTop(attack) {
        this.frameY = 2;
        this.x = attack.game.player.x - 10;
        this.y = attack.game.player.y - this.height + 20;
    }
    prepareBottom(attack) {
        this.frameY = 3;
        this.x = attack.game.player.x - 10;
        this.y = attack.game.player.y + attack.game.player.height - 20;
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
    updateVisuals(attack, deltatime) {
        this.frameTimer += deltatime;
        if (this.frameTimer > this.frameTime) {
            if (this.frameX < this.maxFrameX) this.frameX++;
            else {
                this.frameX = 0;
                attack.activated = false;
                attack.cast = false;
            }
            this.frameTimer = 0;
        }
    }
    draw(context) {
        context.drawImage(this.anim, this.width * this.frameX, this.height * this.frameY, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}