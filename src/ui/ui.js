export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Helvetica';
        this.attackWidth = 70;
        this.attackHeight = 70;
        this.attackIcons = [this.game.player.equipment.weapon.meleeIcon];
        this.game.player.psyche.activeObsessions.forEach(obsession => this.attackIcons.push(obsession.icon))
        // equipment
        this.equipment = new Image();
        this.equipment.src = "../assets/ui/settings/equipment.png";
        this.equipmentWidth = 40;
        this.equipmentHeight = 40;   
        this.weaponLocationX = 213;
        this.weaponLocationY = 95;
        this.showWeapon = false;
        this.obsessionLocationX = 31;
        this.obsessionLocationY = 209;
        this.showObsession = [false, false, false, false]; // 4 active obsessions at a time
    }
    draw(context) {
        // health
        context.strokeRect(20,this.game.height - 60,301,21);
        context.fillStyle = '#ff0000';
        context.fillRect(20, this.game.height - 60, (this.game.player.health / 100) * 300, 20);
        // obsession
        context.strokeRect(20,this.game.height - 30,151,21);
        context.fillStyle = '#00ff00';
        context.fillRect(20, this.game.height - 30, (this.game.player.obsession / 100) * 300, 20);
        // abilities
        this.attackIcons.forEach((icon, index) => {
            context.drawImage(icon, 0, 0, this.attackWidth, this.attackHeight, 
                this.game.width / 2 - (this.attackIcons.length * this.attackWidth + (this.attackIcons.length - 1) * 5) / 2 + index * (this.attackWidth + 5),
                this.game.height - this.attackHeight - 10, this.attackWidth, this.attackHeight);
        });
        this.updateSkillBar(context);
        // settings
        if (this.game.player.equipment.isOpen) {
            this.drawEquipment(context);
            if (this.showWeapon) {
                this.drawFurtherInfo(context, this.weaponLocationX, this.weaponLocationY, this.equipmentWidth, 150, 5, [this.game.player.equipment.weapon.name, 'DMG: ' + this.game.player.equipment.weapon.damage]);
            } else if (this.showObsession.includes(true)) {
                let index = this.showObsession.indexOf(true);
                if (index < this.game.player.psyche.activeObsessions.length) this.drawFurtherInfo(context, this.obsessionLocationX + 78 * index, this.obsessionLocationY, this.attackWidth, 100, 0, [this.game.player.psyche.activeObsessions[index].name, 'DMG: ' + this.game.player.psyche.activeObsessions[index].damage, 'COST: ' + this.game.player.psyche.activeObsessions[index].cost]);
            }
        }
    }
    updateSkillBar(context) {
        context.save();
        context.fillStyle = 'rgba(0,0,0,0.4)';
        // update cooldowns
        this.game.activeAttacks.forEach(attack => {
            if (!(attack.type === "Obsession" && attack.obsession.cost > this.game.player.obsession)) {
                if (attack.cooldownTimer < attack.cooldown) {
                    context.beginPath();
                    context.arc(
                        this.game.width / 2 - (this.attackIcons.length * this.attackWidth + (this.attackIcons.length - 1) * 5) / 2 + this.game.player.attacks.indexOf(attack) * (this.attackWidth + 5) + this.attackWidth / 2, 
                        this.game.height - this.attackHeight - 10 + this.attackHeight / 2, 
                        this.attackWidth / 2 * (attack.cooldownTimer / attack.cooldown),
                        0, 2 * Math.PI, false
                    );
                    context.fill();
                }
            }
        });
        // disable obsessions
        this.game.player.attacks.forEach(attack => {
            if (attack.type === "Obsession" && attack.obsession.cost > this.game.player.obsession) {
                context.beginPath();
                context.arc(
                    this.game.width / 2 - (this.attackIcons.length * this.attackWidth + (this.attackIcons.length - 1) * 5) / 2 + this.game.player.attacks.indexOf(attack) * (this.attackWidth + 5) + this.attackWidth / 2, 
                    this.game.height - this.attackHeight - 10 + this.attackHeight / 2, 
                    this.attackWidth / 2,
                    0, 2 * Math.PI, false
                );
                context.fill();
            }
        })
        // highlight current attack
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
    drawEquipment(context) {
        context.save();
        context.drawImage(this.equipment, 20, 20, this.game.player.equipment.width, this.game.player.equipment.height);
        context.drawImage(this.game.player.equipment.weapon.icon, this.weaponLocationX, this.weaponLocationY, this.equipmentWidth, this.equipmentHeight);
        let i = 1;
        while (i < this.attackIcons.length) {
            context.drawImage(this.attackIcons[i], this.obsessionLocationX + 78 * (i - 1), this.obsessionLocationY, this.attackWidth - 3, this.attackHeight - 3);
            ++i;
        }
        context.restore();
    }
    drawFurtherInfo(context, x, y, width, height, offset, text) {
        context.fillStyle = 'rgba(0,0,0)';
        context.strokeRect(x + width + offset, y - 3, 101, height + 1);
        context.fillStyle = 'rgba(0,0,0,0.4)';
        context.fillRect(x + width + offset, y - 3, 100, height);
        context.fillStyle = 'white';
        context.font = '16px ' + this.fontFamily;
        let i = 0;
        while (i < text.length) {
            context.fillText(text[i], x + width + 10, y + 15 + 30 * i);
            ++i;
        }
    }
    addListeners(canvas) {
        canvas.onmousemove =  e => {
            if (this.game.player.equipment.isOpen) {
                // weapon info
                this.showWeapon = e.offsetX  > this.weaponLocationX && e.offsetX < this.weaponLocationX + this.equipmentWidth &&
                    e.offsetY > this.weaponLocationY && e.offsetY < this.weaponLocationY + this.equipmentHeight;
                // obsession info
                let i = 0
                while (i < 4) {
                    this.showObsession[i] = e.offsetX  > this.obsessionLocationX + 78 * i && e.offsetX < this.obsessionLocationX + this.attackWidth + 78 * i && e.offsetY > this.obsessionLocationY && e.offsetY < this.obsessionLocationY + this.attackHeight;
                    i++;
                }
            }
        };
    }
}