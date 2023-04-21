export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
        this.attackWidth = 70;
        this.attackHeight = 70;
        this.attackIcons = [closeui, rangedui];
    }
    draw(context) {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;
        // health
        context.fillText('Health: ' + this.game.player.health, 20, 50);
        context.restore();
        // abilities
        this.attackIcons.forEach((icon, index) => {
            context.drawImage(icon, 0, 0, this.attackWidth, this.attackHeight, 
                this.game.width / 2 - (this.attackIcons.length * this.attackWidth + (this.attackIcons.length - 1) * 5) / 2 + index * (this.attackWidth + 5),
                this.game.height - this.attackHeight - 10, this.attackWidth, this.attackHeight);
        })
        context.save();
        context.beginPath();
        context.arc(
            this.game.width / 2 - (this.attackIcons.length * this.attackWidth + (this.attackIcons.length - 1) * 5) / 2 + this.game.player.attacks.indexOf(this.game.player.currentAttack) * (this.attackWidth + 5) + this.attackWidth / 2, 
            this.game.height - this.attackHeight - 10 + this.attackHeight / 2, 
            this.attackWidth / 2,
            0, 2 * Math.PI, false
        );
        context.lineWidth = 5;
        context.strokeStyle = '#ffff00';
        context.stroke();
        context.restore();
    }
}