class Enemy {
    constructor(game) {
        this.game = game;
        this.deletionFlag = false;
        this.targetModifier = Math.random() * this.game.player.height;
    }
    update() {
        // if (    this.x > this.game.width || 
        //         this.x < -this.width ||
        //         this.y > this.game.height ||
        //         this.y < -this.height
        //     ) {
        //     this.deletionFlag = true;  
        // }
    }
   
}

export class Zombie extends Enemy {
    constructor(game) {
        super(game);
        this.width = 50;
        this.height = 50;
        this.image = new Image();
        this.image.src = "../../assets/entities/zombie.png";
        this.baseSpeed = 2;    
        this.offsetX = 5;
        this.offsetW = -5;
        this.offsetY = 0;
        this.offsetH = -0;
        this.setSpawnPoint(); 
        this.attackCooldown = 200;
        this.attackTimer = 0;
        this.maxHealth = 50;
        this.health = this.maxHealth;
        this.frames = {
            "horizontal": 2,
            "vertical": 1
        }
        this.maxFrameX;
        this.frameX = 0;
        this.frameY = 0;
        this.frameTime = 50;
        this.frameTimer = 0;
    }
    setSpawnPoint() {
        let area = [0, 1, 2, 3];
        if (this.game.player.x <= this.game.width / 2) {
            area.splice(area.indexOf(0), 1);
        }
        if (this.game.player.x >= this.game.bgW - this.game.width / 2) {
            area.splice(area.indexOf(1), 1);
        }
        if (this.game.player.y <= this.game.height / 2) {
            area.splice(area.indexOf(2), 1);
        }
        if (this.game.player.y >= this.game.bgH - this.game.height / 2) {
            area.splice(area.indexOf(3), 1);
        }
        let randomElement = area[Math.floor(Math.random() * area.length)];
        // left
        if (randomElement === 0) {
            if (area.indexOf(1) != -1) this.x = this.game.player.x + this.game.player.width / 2 - this.game.width - this.width;
            else this.x = this.game.bgW - this.game.width - this.width;
            this.y = Math.random() * this.game.height + (this.game.player.y - this.game.height / 2);
        }
        // right
        else if (randomElement === 1) {
            if (area.indexOf(0) != -1) this.x = this.game.player.x + this.game.player.width / 2 + this.game.width / 2 + this.width;
            else this.x = this.game.width;
            this.y = Math.random() * this.game.height + (this.game.player.y - this.game.height / 2);
        }
        //top
        else if (randomElement === 2) {
            if (area.indexOf(3) != -1) this.y = this.game.player.y + this.game.player.height / 2 - this.game.height / 2 - this.height;
            else this.y = this.game.bgH - this.game.height - this.height;
            this.x = Math.random() * this.game.width + (this.game.player.x - this.game.width / 2);
        }
        // bottom
        else {
            if (area.indexOf(2) != -1) this.y = this.game.player.y + this.game.player.height / 2 + this.game.height / 2 + this.height;
            else this.y = this.game.height + this.height;
            this.x = Math.random() * this.game.width + (this.game.player.x - this.game.width / 2);
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
        this.frameTimer += deltatime;
        if (this.frameTimer > this.frameTime) {
            if (this.frameX < this.maxFrameX) this.frameX++;
            else this.frameX = 0;
            this.frameTimer = 0;
        }
        let dx = (this.game.player.x + this.game.player.width / 2) - (this.x + this.width / 2);
        let dy = (this.game.player.y + this.targetModifier) - (this.y + this.height / 2);
        let dist = Math.sqrt(dx * dx + dy * dy);
        this.speedX = dx / dist * this.baseSpeed;
        if (Math.abs(this.speedX) > 1) {
            this.maxFrameX = this.frames.horizontal;
            if (this.speedX > 0) this.frameY = 0;
            else if (this.speedX < 0) this.frameY = 1;
        } else {
            this.maxFrameX = this.frames.vertical;
            if (this.frameX === 2) this.frameX = 0;
            if (this.speedY > 0) this.frameY = 2;
            else this.frameY = 3;
        }
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
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
}