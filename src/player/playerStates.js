 const states = {
    STANDING: 0,
    RUNNING: 1
}

class State {
    constructor(game, state) {
        this.game = game;
        this.state = state;
        this.settingsLock = false;
    }
    handleInput(input) {
        if (input.includes('1')) {
            this.game.player.setAttack(0);
        }
        else if (input.includes('2')) {
            this.game.player.setAttack(1);
        }    
        if (input.includes('i')) {
            if (!this.settingsLock) {
                this.settingsLock = true;
                this.game.player.equipment.isOpen = !this.game.player.equipment.isOpen;
                setTimeout(() => { this.settingsLock = false; }, 100);
            }
        }
    }
}

export class Standing extends State {
    constructor(game) {
        super(game, 'STANDING');
    }
    enter() {
    }
    handleInput(input) {
        super.handleInput(input);
        if (input.includes('w') ||
            input.includes('a') ||
            input.includes('s') ||
            input.includes('d')) {
            this.game.player.setState(states.RUNNING, 1.5);
        }
    }
}

export class Running extends State {
    constructor(game) {
        super(game, 'RUNNING');
    }
    enter() {
    }
    handleInput(input) {
        super.handleInput(input);
        // horizontal movement
        if (input.includes('d')) {
            if (!this.game.player.currentAttack.cast) this.game.player.frameY = 0;
            if (this.checkX(1) &&
                this.game.player.x + this.game.player.width < this.game.bgW) {
                this.game.player.x += this.game.player.speedX;
            }
        } 
        else if (input.includes('a')) {
            if (!this.game.player.currentAttack.cast) this.game.player.frameY = 1;
            if (this.checkX(-1) &&
                this.game.player.x > 0) {
                this.game.player.x += -this.game.player.speedX;
            }
        } 
        // vertical movement
        if (input.includes('w')) {
            if (!this.game.player.currentAttack.cast) this.game.player.frameY = 2;
            if (this.checkY(-1) &&
                this.game.player.y > 0) {
                this.game.player.y += -this.game.player.speedY;
            }
        }
        else if (input.includes('s')) {
            if (!this.game.player.currentAttack.cast) this.game.player.frameY = 3;
            if (this.checkY(1) &&
                this.game.player.y + this.game.player.height < this.game.bgH) {
                this.game.player.y += this.game.player.speedY;
            }
        }
        if (!(input.includes('w') || input.includes('a') || input.includes('s') || input.includes('d'))) {
            this.game.player.setState(states.STANDING, 0);
        }
    }
    // check if player can move to direction
    checkX(direction) {
        let moveHorizontal = true;
        for (let i = 0; i < this.game.enemies.length; ++i) {
            if ((this.game.player.x + this.game.player.offsetX + this.game.player.width + this.game.player.offsetW + direction * this.game.player.speedX > this.game.enemies[i].x + this.game.enemies[i].offsetX &&
                this.game.player.x + this.game.player.offsetX + direction * this.game.player.speedX < this.game.enemies[i].x + this.game.enemies[i].offsetX + this.game.enemies[i].width + this.game.enemies[i].offsetW &&
                this.game.player.y + this.game.player.offsetY + this.game.player.height + this.game.player.offsetH > this.game.enemies[i].y + this.game.enemies[i].offsetY &&
                this.game.player.y + this.game.player.offsetY < this.game.enemies[i].y + this.game.enemies[i].offsetY + this.game.enemies[i].height + this.game.enemies[i].offsetH)) 
            {
                moveHorizontal = false;
                break;
            }
        } 
        return moveHorizontal;
    }
    checkY(direction) {
        let moveVertical = true;
        for (let i = 0; i < this.game.enemies.length; ++i) {
            if (this.game.player.x + this.game.player.offsetX + this.game.player.width + this.game.player.offsetW > this.game.enemies[i].x + this.game.enemies[i].offsetX &&
                this.game.player.x + this.game.player.offsetX < this.game.enemies[i].x + this.game.enemies[i].offsetX + this.game.enemies[i].width + this.game.enemies[i].offsetW  &&
                this.game.player.y + this.game.player.offsetY + this.game.player.height + this.game.player.offsetH + direction * this.game.player.speedY > this.game.enemies[i].y &&
                this.game.player.y + this.game.player.offsetY + direction * this.game.player.speedY < this.game.enemies[i].y + this.game.enemies[i].offsetY + this.game.enemies[i].height + this.game.enemies[i].offsetH)
            {
                moveVertical = false;
                break;
            }
        }
        return moveVertical;
    }
}