export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown', e => {
            if ((   e.key === 'w' ||
                    e.key === 'a' ||
                    e.key === 's' ||
                    e.key === 'd' ||
                    e.key === 'i' ||
                    e.key === '1' ||
                    e.key === '2'
                )   && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            } 
        });
        window.addEventListener('click', e => {
            this.game.player.attack(e.x - this.game.bounds['LEFT'], e.y - this.game.bounds['TOP']);
        })
        window.addEventListener('keyup', e => {
            if (   e.key === 'w' ||
                   e.key === 'a' ||
                   e.key === 's' ||
                   e.key === 'd' ||
                   e.key === 'i' ||
                   e.key === '1' ||
                   e.key === '2'
                ) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}