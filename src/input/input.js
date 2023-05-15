export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.validInputs = ['w','a','s','d','i','1','2'];
        this.keys = [];
        window.addEventListener('keydown', e => {
            if (this.validInputs.includes(e.key) && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            } 
        });
        window.addEventListener('click', e => {
            this.game.player.attack(e.offsetX - this.game.normaliseFactors.X, e.offsetY - this.game.normaliseFactors.Y);
        })
        window.addEventListener('keyup', e => {
            if (this.validInputs.includes(e.key)) {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}