const states = {
    STANDING: 0,
    RUNNING: 1
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
        // horizontal movement
        if (input.includes('d')) this.game.player.x += this.game.player.speedX;
        else if (input.includes('a')) this.game.player.x += -this.game.player.speedX;
        // vertical movement
        if (input.includes('w')) this.game.player.y += -this.game.player.speedY;
        else if (input.includes('s')) this.game.player.y += this.game.player.speedY;
        if (input.length === 0) {
            this.game.player.setState(states.STANDING, 0);
        }
    }
}