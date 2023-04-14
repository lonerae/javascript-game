class Attack {
    constructor(game) {
        this.game = game;
    }
    activate() {
        this.activated = true;
        this.cooldownTimer = 0;
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

export class RangedAttack extends Attack {
    constructor(game) {
        super(game);
        this.image = fire;
        this.width = 25;
        this.height = 25;
        this.baseSpeed = 10;
        this.activated = false;
        this.cooldown = 100;
        this.cooldownTimer = 0;
    }
    activate() {
        if (this.cooldownTimer >= this.cooldown) {
            super.activate();
            this.x = this.game.player.x + this.game.player.width / 2;
            this.y = this.game.player.y + this.game.player.height / 3;
            let dx = this.x - this.targetX;
            let dy = this.y - this.targetY;
            let dist = Math.sqrt(dx * dx + dy * dy);
            this.speedX = dx / dist * this.baseSpeed;
            this.speedY = dy / dist * this.baseSpeed;
        }
    }
    update(deltatime) {
        super.update();
        if (this.activated) {
            this.x -= this.speedX;
            this.y -= this.speedY;
        } else {
            if (this.cooldownTimer < this.cooldown) this.cooldownTimer += deltatime;
        }
    }
    draw(context) {
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}