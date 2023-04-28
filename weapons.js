import { FloatingMessage } from "./floatingMessage.js";

class Weapon {
    constructor(name) {
        this.name = name;   
    }
    prepareTop() {}
    prepareBottom() {}
    prepareRight() {}
    prepareLeft() {}
}

export class Sword extends Weapon {
    constructor(name) {
        super(name);
        this.image = sword;
        this.width = 50;
        this.height = 50;
        this.cooldown = 200;
        this.damage = 10;
        this.verticalSpeed = 10;
        this.initAngle = 45;
        this.angleBaseSpeed = 0.2;
        this.visibilityTime = 200;
    }
    setVisuals(attack, area) {
        this.area = area;
        if (area === 'TOP') {
            this.prepareTop(attack);
        }
        else if (area === 'BOTTOM') {
            this.prepareBottom(attack);
        }
        else if (area === 'RIGHT') {
            this.prepareRight(attack);
        }
        else if (area === 'LEFT') {
            this.prepareLeft(attack);
        }           
        else attack.activated = false;
    }
    prepareTop(attack) {
        attack.flipped = false;
        attack.flipsPlayer = false;
        this.visibilityTime = 100;
        this.x = attack.game.player.x - 10;
        this.y = attack.game.player.y + this.height / 2;
        this.angleSpeed = 0;
        this.closeSpeedY = -this.verticalSpeed;
    }
    prepareBottom(attack) {
        attack.flipped = false;
        attack.flipsPlayer = false;
        this.visibilityTime = 100;
        this.x = attack.game.player.x + 10;
        this.y = attack.game.player.y + attack.game.player.height - this.height;
        this.angleSpeed = 0;
        this.closeSpeedY = this.verticalSpeed;
    }
    prepareRight(attack) {
        attack.game.player.flipped = false;
        attack.flipped = false;
        attack.flipsPlayer = true;
        this.visibilityTime = 200;
        this.x = attack.game.player.x + attack.game.player.width;
        this.y = attack.game.player.y + attack.game.player.height / 3;
        this.angle = -this.initAngle;
        this.angleSpeed = this.angleBaseSpeed;
        this.maxAngle = this.angle + 2;
        this.closeSpeedY = 0;
        this.cx = attack.game.player.x + attack.game.player.width / 2;
        this.cy = attack.game.player.y + attack.game.player.height / 2;
    }
    prepareLeft(attack) {
        attack.game.player.flipped = true;
        attack.flipped = true;
        attack.flipsPlayer = true;
        this.visibilityTime = 200;
        this.x = attack.game.player.x;
        this.y = attack.game.player.y + attack.game.player.height / 3;
        this.angle = this.initAngle;
        this.angleSpeed = -this.angleBaseSpeed;
        this.maxAngle = this.angle - 2;
        this.closeSpeedY = 0;
        this.cx = attack.game.player.x + attack.game.player.width / 2;
        this.cy = attack.game.player.y + attack.game.player.height / 2;
    }  
    checkCollision(attack,enemy) {
        if (this.area === 'TOP' || this.area === 'BOTTOM') {
            this.checkCollisionVertical(attack,enemy);
        }
        if (this.area === 'RIGHT' || this.area === 'LEFT') {
            this.checkCollisionHorizontal(attack, enemy);
        }      
    }
    checkCollisionVertical(attack, enemy) {
        if (
            this.x + this.width > enemy.x + enemy.offsetX &&
            this.x < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW &&
            this.y + this.height > enemy.y + enemy.offsetY &&
            this.y < enemy.y + enemy.offsetY + enemy.height + enemy.offsetH
        ) {
            this.doDamage(attack, enemy);
        }
    }
    checkCollisionHorizontal(attack, enemy) {
        if (!attack.flipped) {
            if (
                this.x + this.width > enemy.x + enemy.offsetX &&
                this.x < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW &&
                attack.game.player.y + attack.game.player.offsetY + attack.game.player.height + attack.game.player.offsetH + 20 > enemy.y + enemy.offsetY + enemy.height + enemy.offsetH &&
                attack.game.player.y + attack.game.player.offsetY < enemy.y + enemy.offsetY + enemy.height + enemy.offsetH
            ) {
                this.doDamage(attack, enemy);
            }
        } else {
            if (
                this.x - this.width < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW &&
                this.x > enemy.x + enemy.offsetX &&
                attack.game.player.y + attack.game.player.offsetY + attack.game.player.height + attack.game.player.offsetH + 20 > enemy.y + enemy.offsetY + enemy.height + enemy.offsetH &&
                attack.game.player.y + attack.game.player.offsetY < enemy.y + enemy.offsetY + enemy.height + enemy.offsetH
            ) {
                this.doDamage(attack, enemy);
            }
        }
    } 
    doDamage(attack, enemy) {
        attack.activated = false;
        enemy.health -= this.damage;
        attack.game.floatingMessages.push(new FloatingMessage('-' + this.damage, enemy.x, enemy.y, enemy.x - enemy.speedX * 20, enemy.y - 20));
        if (enemy.health <= 0) enemy.deletionFlag = true;
    }
    updateVisuals(attack) {
        if (this.angleSpeed != 0) {
            this.angle += this.angleSpeed;
            if (
                (this.angleSpeed > 0 && this.angle > this.maxAngle) ||
                (this.angleSpeed < 0 && this.angle < this.maxAngle)
            ) attack.activated = false;
        } else {
            this.y += this.closeSpeedY;
            if (
                (this.closeSpeedY < 0 && this.y < attack.game.player.y  - this.height / 2) ||
                (this.closeSpeedY > 0 && this.y > attack.game.player.y + 20)
            ) attack.activated = false;
        }
    }
    draw(context,attack) {
        context.save();
        if (this.area === 'RIGHT' || this.area === 'LEFT') {
            context.translate(this.cx, this.cy);
            context.rotate(this.angle);
            context.translate(-this.cx, -this.cy);
        }
        if (attack.flipped) {
            context.scale(-1, 1);
            context.drawImage(this.image, 0, 0, this.width, this.height, -this.x, this.y, this.width, this.height);
            context.scale(-1, 1);
        } else {
            context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        context.restore();
    }
}