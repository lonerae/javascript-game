 const states = {
    STANDING: 0,
    RUNNING: 1,
    HIT: 2
}

class State {
    constructor(game, state) {
        this.game = game;
        this.state = state;
    }
}

export class Standing extends State {
    constructor(game) {
        super(game, 'STANDING');
    }
    enter() {

    }
    handleInput(input) {
        if (input.includes('w') ||
            input.includes('a') ||
            input.includes('s') ||
            input.includes('d')) {
            this.game.player.setState(states.RUNNING, 1);
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
        let movFlag = true;
        // horizontal movement
        if (input.includes('d')) {
            for (let i = 0; i < this.game.enemies.length ; ++i) {
                if (!this.checkX(this.game.enemies[i], 1)) {
                    movFlag = false;
                    break;
                }
            };
            if (movFlag) this.game.player.x += this.game.player.speedX;
        } 
        else if (input.includes('a')) {
            for (let i = 0; i < this.game.enemies.length ; ++i) {
                if (!this.checkX(this.game.enemies[i], -1)) {
                    movFlag = false;
                    break;
                }
            };
            if (movFlag) this.game.player.x += -this.game.player.speedX;
        }
        movFlag = true;
        // vertical movement
        if (input.includes('w')) {
            for (let i = 0; i < this.game.enemies.length ; ++i) {
                if (!this.checkY(this.game.enemies[i], -1)) {
                    movFlag = false;
                    break;
                }
            };
            if (movFlag) this.game.player.y += -this.game.player.speedY;
        }
        else if (input.includes('s')) {
            for (let i = 0; i < this.game.enemies.length ; ++i) {
                for (let i = 0; i < this.game.enemies.length ; ++i) {
                    if (!this.checkY(this.game.enemies[i], 1)) {
                        movFlag = false;
                        break;
                    }
                };
            }
            if (movFlag) this.game.player.y += this.game.player.speedY;
        }
        if (input.length === 0) {
            this.game.player.setState(states.STANDING, 0);
        }
    }
    checkX(enemy, direction) {
        if (this.game.player.x + this.game.player.offsetX + this.game.player.width + this.game.player.offsetW + direction * this.game.player.speedX > enemy.x + enemy.offsetX &&
            this.game.player.x + this.game.player.offsetX + direction * this.game.player.speedX < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW &&
            this.game.player.y + this.game.player.offsetY + this.game.player.height + this.game.player.offsetH > enemy.y + enemy.offsetY &&
            this.game.player.y + this.game.player.offsetY < enemy.y + enemy.offsetY + enemy.height + enemy.offsetH) {      
            return false;
        }
        return true;
    }
    checkY(enemy, direction) {
        if (this.game.player.x + this.game.player.offsetX + this.game.player.width + this.game.player.offsetW > enemy.x + enemy.offsetX &&
            this.game.player.x + this.game.player.offsetX < enemy.x + enemy.offsetX + enemy.width + enemy.offsetW  &&
            this.game.player.y + this.game.player.offsetY + this.game.player.height + this.game.player.offsetH + direction * this.game.player.speedY > enemy.y &&
            this.game.player.y + this.game.player.offsetY + direction * this.game.player.speedY < enemy.y + enemy.offsetY + enemy.height + enemy.offsetH) {   
            return false;
        }
        return true;
    }
}