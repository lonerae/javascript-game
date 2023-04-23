class Attack {
    constructor(game) {
        this.game = game;
        this.flipsPlayer = false;
    }
    activate() {
        this.activated = true;
        this.cooldownTimer = 0;
        if (!this.game.activeAttacks.includes(this)) this.game.activeAttacks.push(this);
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
    constructor(game, weapon) {
        super(game);
        this.weapon = weapon;
        this.activated = false;
        this.flipped = false;
        this.cooldownTimer = this.weapon.cooldown;
    }
    activate() {
        if (this.cooldownTimer >= this.weapon.cooldown) {
            super.activate();  
            this.weapon.setVisuals(this, super.calculateBoundaries());
        }
    }
    update(deltatime) {
        super.update();
        this.game.enemies.forEach(enemy => {
            if (this.activated) {
                this.weapon.checkCollision(this,enemy);
            } 
        });
        if (this.activated) {
            this.weapon.updateVisuals(this);
        } else {
            if (this.cooldownTimer < this.weapon.cooldown) this.cooldownTimer += deltatime;
        }      
    }
    draw(context) {
        this.weapon.draw(context,this);
        
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
            }
        }
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}