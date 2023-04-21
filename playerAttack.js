class Attack {
    constructor(game) {
        this.game = game;
    }
    activate() {
        this.activated = true;
        this.cooldownTimer = 0;
        if (!this.game.activeAttacks.includes(this)) this.game.activeAttacks.push(this);
    }
    update() {
        if (    this.x > this.game.width || 
                this.x < -this.width ||
                this.y > this.game.height ||
                this.y < -this.height) 
        {
            this.activated = false;
        }
    }
        draw() {}
    }

export class CloseAttack extends Attack {
    constructor(game) {
        super(game);
        this.image = sword;
        this.width = 50;
        this.height = 50;
        this.activated = false;
        this.flipped = false;
        this.cooldown = 20;
        this.cooldownTimer = this.cooldown;
        this.closeSpeedY = 0;
    }
    activate() {
        if (this.cooldownTimer >= this.cooldown) {
            super.activate();  
            let area = this.calculateBoundaries();
            if (area === 'TOP') {
                this.flipped = false;
                this.vertical = true;
                this.x = this.game.player.x - 10;
                this.y = this.game.player.y  + this.height / 2;
                this.angleSpeed = 0;
                this.closeSpeedY = -10;
            }
            else if (area === 'BOTTOM') {
                this.flipped = false;
                this.vertical = true;
                this.x = this.game.player.x + 10;
                this.y = this.game.player.y + this.game.player.height - this.height;
                this.angleSpeed = 0;
                this.closeSpeedY = 10;
            }
            else if (area === 'RIGHT') {
                this.game.player.flipped = false;
                this.flipped = false;
                this.vertical = false;
                this.x = this.game.player.x + this.game.player.width;
                this.y = this.game.player.y + this.game.player.height / 3;
                this.angle = -45;
                this.angleSpeed = 0.2;
                this.maxAngle = this.angle + 2;
                this.closeSpeedY = 0;
                this.cx = this.game.player.x + this.game.player.width / 2;
                this.cy = this.game.player.y + this.game.player.height / 2;
            }
            else if (area === 'LEFT') {
                this.game.player.flipped = true;
                this.flipped = true;
                this.vertical = false;
                this.x = this.game.player.x;
                this.y = this.game.player.y + this.game.player.height / 3;
                this.angle = 45;
                this.angleSpeed = -0.2;
                this.maxAngle = this.angle - 2;
                this.closeSpeedY = 0;
                this.cx = this.game.player.x + this.game.player.width / 2;
                this.cy = this.game.player.y + this.game.player.height / 2;
            }           
            else this.activated = false;
        }
    }
    calculateBoundaries() {
        let aboveMain = (this.targetY - this.game.player.y - (this.game.player.height / this.game.player.width) * (this.targetX - this.game.player.x)) < 0;
        let aboveSec = (this.targetY - this.game.player.y + (this.game.player.height / this.game.player.width) * (this.targetX - this.game.player.x - this.game.player.width)) < 0;
        if (aboveMain && aboveSec) return 'TOP';
        if (!aboveMain && !aboveSec) return 'BOTTOM';
        if (aboveMain && !aboveSec) return 'RIGHT';
        if (!aboveMain && aboveSec) return 'LEFT';
        return 'ERROR';
    }
    update(deltatime) {
        super.update();
        this.game.enemies.forEach(enemy => {
            if (this.activated) {
                if (!this.vertical) {
                    if (    (
                                (!this.flipped && this.x + this.width > enemy.x + enemy.offsetX) ||
                                (this.flipped && this.x - this.width < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW)
                            ) &&
                            (   (!this.flipped && this.x < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW) ||
                                (this.flipped && this.x > enemy.x + enemy.offsetX) 
                            ) &&
                            this.game.player.y + this.game.player.offsetY + this.game.player.height + this.game.player.offsetH + 20 > enemy.y + enemy.offsetY + enemy.height + enemy.offsetH &&
                            this.game.player.y + this.game.player.offsetY < enemy.y + enemy.offsetY + enemy.height + enemy.offsetH)  
                    {
                        setTimeout(() => {
                            this.activated = false;
                        }, 100);
                        enemy.deletionFlag = true;
                    }
                } else {
                    if (
                        this.x + this.width > enemy.x + enemy.offsetX &&
                        this.x < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW &&
                        this.y + this.height > enemy.y + enemy.offsetY &&
                        this.y < enemy.y + enemy.offsetY + enemy.height + enemy.offsetH
                    ) {
                        setTimeout(() => {
                            this.activated = false;
                        }, 100);
                        enemy.deletionFlag = true;
                    }
                }
            } 
        });
        if (this.activated) {
            if (this.angleSpeed != 0) {
                this.angle += this.angleSpeed;
                if (
                    (this.angleSpeed > 0 && this.angle > this.maxAngle) ||
                    (this.angleSpeed < 0 && this.angle < this.maxAngle)
                ) this.activated = false;
            } else {
                this.y += this.closeSpeedY;
                if (
                    (this.closeSpeedY < 0 && this.y < this.game.player.y  - this.height / 2) ||
                    (this.closeSpeedY > 0 && this.y > this.game.player.y + this.game.player.height)
                ) this.activated = false;
            }
        } else {
            if (this.cooldownTimer < this.cooldown) this.cooldownTimer += deltatime;
        }      
    }
    draw(context) {
        context.save();
        if (this.angleSpeed != 0) {
            context.translate(this.cx, this.cy);
            context.rotate(this.angle);
            context.translate(-this.cx, -this.cy);
        }
        if (this.flipped) {
            context.scale(-1, 1);
            context.drawImage(this.image, 0, 0, this.width, this.height, -this.x, this.y, this.width, this.height);
            context.scale(-1, 1);
        } else {
            context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        }
        context.restore();
    }
}

export class RangedAttack extends Attack {
    constructor(game) {
        super(game);
        this.image = fire;
        this.width = 25;
        this.height = 25;
        this.baseSpeed = 10;
        this.activated = false;
        this.cooldown = 500;
        this.cooldownTimer = this.cooldown;
    }
    activate() {
        if (this.cooldownTimer >= this.cooldown) {
            super.activate();
            this.x = this.game.player.x + this.game.player.width / 2;
            this.y = this.game.player.y + this.game.player.height / 3;
            let dx = this.x - this.targetX;
            let dy = this.y - this.targetY;
            let dist = Math.sqrt(dx * dx + dy * dy);
            this.rangedSpeedX = dx / dist * this.baseSpeed;
            this.rangedSpeedY = dy / dist * this.baseSpeed;
        }
    }
    update(deltatime) {
        super.update();
        this.game.enemies.forEach(enemy => {
            if (this.activated) {
                if (    this.x + this.width > enemy.x + enemy.offsetX &&
                        this.x < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW &&
                        this.y + this.height > enemy.y + enemy.offsetY &&
                        this.y < enemy.y + enemy.offsetY + enemy.height + enemy.offsetH)  
                {
                    this.activated = false;
                    enemy.deletionFlag = true;
                }
            }
        });
        if (this.activated) {
            this.x -= this.rangedSpeedX;
            this.y -= this.rangedSpeedY;
        } else {
            if (this.cooldownTimer < this.cooldown) {
                this.cooldownTimer += deltatime;
                console.log(this.cooldownTimer);
            }
        }
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}