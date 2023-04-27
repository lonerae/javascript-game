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
        context.shadowColor = 'black';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.restore();
        // health
        context.strokeRect(20,20,301,21);
        context.fillStyle = '#ff0000';
        context.fillRect(20, 20, (this.game.player.health / 100) * 300, 20);
        // psyche
        context.strokeRect(20,50,151,21);
        context.fillStyle = '#00ff00';
        context.fillRect(20, 50, (this.game.player.obsession / 100) * 300, 20);
        // abilities
        this.attackIcons.forEach((icon, index) => {
            context.drawImage(icon, 0, 0, this.attackWidth, this.attackHeight, 
                this.game.width / 2 - (this.attackIcons.length * this.attackWidth + (this.attackIcons.length - 1) * 5) / 2 + index * (this.attackWidth + 5),
                this.game.height - this.attackHeight - 10, this.attackWidth, this.attackHeight);
        });
        this.game.activeAttacks.forEach(attack => {
            if (attack.cooldownTimer < attack.cooldown) {
                context.save();
                context.beginPath();
                context.arc(
                    this.game.width / 2 - (this.attackIcons.length * this.attackWidth + (this.attackIcons.length - 1) * 5) / 2 + this.game.player.attacks.indexOf(attack) * (this.attackWidth + 5) + this.attackWidth / 2, 
                    this.game.height - this.attackHeight - 10 + this.attackHeight / 2, 
                    this.attackWidth / 2 * (attack.cooldownTimer / attack.cooldown),
                    0, 2 * Math.PI, false
                );
                context.fillStyle = 'rgba(0,0,0,0.4)';
                context.fill();
                context.restore();
            }
        });
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