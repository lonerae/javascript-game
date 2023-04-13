class Enemy {
    constructor(game) {
        this.game = game;
        this.deletionFlag = false;
    }
    update() {
        if (    this.x > this.game.width || 
                this.x < -this.width ||
                this.y > this.game.height ||
                this.y < -this.height
            ) {
            this.deletionFlag = true;  
        }
    }
   
}

export class Zombie extends Enemy {
    constructor(game) {
        super(game);
        this.width = 50;
        this.height = 50;
        this.image = zombie;
        this.baseSpeed = 1.5;    
        this.setSpawnPoint(Math.random()); 
        this.slope = 0;
        this.attackCooldown = 200;
        this.attackTimer = 0;
    }
    update() {
        super.update();
        let targetX = this.game.player.x + this.game.player.width / 2 + this.width / 2;
        let targetY = this.game.player.y + this.game.player.height / 2 - this.height / 2;
        if (targetX != this.x) {
            this.slope = (targetY - this.y) / (targetX - this.x);
            this.x += (1 / Math.sqrt(1 + Math.pow(this.slope,2))) * this.speedX;
            this.y += Math.sqrt(Math.pow(this.slope,2) / (1 + Math.pow(this.slope,2))) * this.speedY;
            this.speedX = this.baseSpeed * (Math.abs(this.x - targetX) / (targetX - this.x));
            this.speedY = this.baseSpeed * (Math.abs(this.y - targetY) / (targetY - this.y));
        }
    }
    draw(context) {
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
    setSpawnPoint(chance) {
        if (chance < 0.5) {
            this.x = Math.random() * this.game.width - this.width;
            this.y = Math.random() < 0.5 ? -this.height : this.game.height;
            this.speedX = Math.random() < 0.5 ? this.baseSpeed : -this.baseSpeed;
            this.speedY = this.y < 0 ? this.baseSpeed : -this.baseSpeed;
        } else {
            this.y = Math.random() * this.game.height - this.height;
            this.x = Math.random() < 0.5 ? -this.width : this.game.width;
            this.speedY = Math.random() < 0.5 ? this.baseSpeed : -this.baseSpeed;
            this.speedX = this.x < 0 ? this.baseSpeed : -this.baseSpeed;
        }       
    }
    attack(deltatime) {
        if (this.attackTimer > this.attackCooldown) {
            this.game.player.health -= 1;
            this.attackTimer = 0;
        } else {
            this.attackTimer += deltatime;
        }
    }
}