class PlayerAttack {
    constructor(game) {
        this.game = game;
        this.activated = false;
        this.cast = false;
    }
    activate() {
        this.activated = true;
        this.cast = true;
        this.cooldownTimer = 0;
        if (!this.game.activeAttacks.includes(this)) this.game.activeAttacks.push(this);
    }
    calculateBoundaries() {
        let aboveMain = (this.targetY - this.game.player.y - (this.game.player.height / this.game.player.width) * (this.targetX - this.game.player.x)) < 0;
        let aboveSec = (this.targetY - this.game.player.y + (this.game.player.height / this.game.player.width) * (this.targetX - this.game.player.x - this.game.player.width)) < 0;
        if (aboveMain && !aboveSec) {
            this.game.player.frameY = 0;
            return 'RIGHT';
        }
        if (!aboveMain && aboveSec) {
            this.game.player.frameY = 1;
            return 'LEFT';
        }
        if (aboveMain && aboveSec) {
            this.game.player.frameY = 2;
            return 'TOP';
        }
        if (!aboveMain && !aboveSec) {
            this.game.player.frameY = 3;
            return 'BOTTOM';
        }
        return 'ERROR';
    }
    update() {}
    draw() {}
}

export class CloseAttack extends PlayerAttack {
    constructor(game, weapon) {
        super(game);
        this.type = "Weapon";
        this.weapon = weapon;
        this.cooldown = this.weapon.cooldown;
        this.cooldownTimer = this.cooldown;
        this.continuous = true;
    }
    activate() {
        if (this.cooldownTimer >= this.weapon.cooldown) {
            super.activate();  
            this.weapon.setVisuals(this, super.calculateBoundaries());
        }
    }
    update(attack, deltatime) {
        if (this.activated) {
            this.weapon.updateVisuals(attack, deltatime);
            this.game.enemies.forEach(enemy => {
                this.weapon.checkCollision(this,enemy);
            });
        }      
        if (this.cooldownTimer < this.weapon.cooldown) this.cooldownTimer += deltatime;
    }
    draw(context) {
        this.weapon.draw(context,this);       
    }
}

export class RangedAttack extends PlayerAttack {
    constructor(game, obsession) {
        super(game);
        this.type = "Obsession";
        this.obsession = obsession;
        this.cooldown = this.obsession.cooldown;
        this.cooldownTimer = this.cooldown;
        this.continuous = this.obsession.continuous;
    }
    activate() {
        if (this.cooldownTimer >= this.obsession.cooldown && (this.game.player.obsession - this.obsession.cost >= 0)) {
            super.activate();
            super.calculateBoundaries();
            this.obsession.setVisuals(this);
        }
    }
    update(attack, deltatime) {
        if (this.activated) {
            this.obsession.updateVisuals(attack);
            this.game.enemies.forEach(enemy => {
                this.obsession.checkCollision(this, enemy);
            });
        }
        if (this.cast) this.obsession.updateCasting(attack, deltatime);
        if (this.cooldownTimer < this.cooldown) this.cooldownTimer += deltatime;
    }
    draw(context) {
        this.obsession.draw(context);
    }
}