class Enemy {
    constructor(game) {
        this.game = game;
        this.deletionFlag = false;
        this.targetModifier = Math.random() * this.game.player.height;
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
        this.image = new Image();
        this.image.src = "../../assets/entities/enemy_first.png";
        this.baseSpeed = 1;    
        this.offsetX = 5;
        this.offsetW = -5;
        this.offsetY = 0;
        this.offsetH = -0;
        this.setSpawnPoint(Math.random()); 
        this.attackCooldown = 200;
        this.attackTimer = 0;
        this.maxHealth = 50;
        this.health = this.maxHealth;
    }
    setSpawnPoint(areaChance) {
        // left
        if (areaChance < 0.25) {
            this.x = -this.width;
            this.y = Math.random() * this.game.height - this.height;
        }
        //top
        else if (areaChance < 0.5) {
            this.y = -this.height;
            this.x = Math.random() * this.game.width - this.width;
        }
        // right
        else if (areaChance < 0.75) {
            this.x = this.game.width;
            this.y = Math.random() * this.game.height - this.height;
        }
        // bottom
        else {
            this.y = this.game.height;
            this.x = Math.random() * this.game.width - this.width;
        }
    }
    attack(deltatime) {
        if (this.attackTimer > this.attackCooldown) {
            if (this.game.player.health > 0) this.game.player.health -= 1;
            this.attackTimer = 0;
        } else {
            this.attackTimer += deltatime;
        }
    }
    update(deltatime) {
        super.update();
        let dx = (this.game.player.x + this.game.player.width / 2) - (this.x + this.width / 2);
        let dy = (this.game.player.y + this.targetModifier) - (this.y + this.height / 2);
        let dist = Math.sqrt(dx * dx + dy * dy);
        this.speedX = dx / dist * this.baseSpeed;
        this.speedY = dy / dist * this.baseSpeed;
        if (    this.x + this.offsetX + this.width + this.offsetW + this.speedX < this.game.player.x + this.game.player.offsetX ||
                this.x + this.offsetX + this.speedX > this.game.player.x + this.game.player.offsetX + this.game.player.width + this.game.player.offsetW ||
                this.y + this.offsetY + this.height + this.offsetH + this.speedY < this.game.player.y + this.game.player.offsetY ||
                this.y + this.offsetY + this.speedY > this.game.player.y + this.game.player.offsetY + this.game.player.height + this.game.player.offsetH) 
        {
            this.x += this.speedX;
            this.y += this.speedY;
        } else {
            this.attack(deltatime);         
        }
    }
    draw(context) {
        context.fillStyle = '#ff0000';
        context.fillRect(this.x, this.y - 10, this.health, 5);
        context.strokeStyle = '#000000';
        context.strokeRect(this.x, this.y - 9, this.maxHealth, 5)
        context.drawImage(this.image, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}