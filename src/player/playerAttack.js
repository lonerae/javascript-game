class PlayerAttack {
    constructor(game) {
        this.game = game;
        this.visible = false;
        this.flipsPlayer = false;
    }
    activate() {
        this.activated = true;
        this.cooldownTimer = 0;
        if (!this.game.activeAttacks.includes(this)) this.game.activeAttacks.push(this);
    }
    calculateBoundaries() {
        let aboveMain = (this.targetY - this.game.player.y - (this.game.player.height / this.game.player.width) * (this.targetX - this.game.player.x)) < 0;
        let aboveSec = (this.targetY - this.game.player.y + (this.game.player.height / this.game.player.width) * (this.targetX - this.game.player.x - this.game.player.width)) < 0;
        if (aboveMain && aboveSec) return 'TOP';
        if (!aboveMain && !aboveSec) return 'BOTTOM';
        if (aboveMain && !aboveSec) return 'RIGHT';
        if (!aboveMain && aboveSec) return 'LEFT';
        return 'ERROR';
    }
    update() {
        if (    this.x > this.game.width || 
                this.x < -this.width ||
                this.y > this.game.height ||
                this.y < -this.height) 
        {
            this.activated = false;
        }
    }
    draw() {}
}

export class CloseAttack extends PlayerAttack {
    constructor(game, weapon) {
        super(game);
        this.type = "Weapon";
        this.weapon = weapon;
        this.activated = false;
        this.flipped = false;
        this.cooldown = this.weapon.cooldown;
        this.cooldownTimer = this.cooldown;
        this.visibilityTimer = 0;
    }
    activate() {
        if (this.cooldownTimer >= this.weapon.cooldown) {
            super.activate();  
            this.weapon.setVisuals(this, super.calculateBoundaries());
        }
    }
    update(deltatime) {
        super.update();
        if (this.activated) {
            this.visible = true;
            this.game.enemies.forEach(enemy => {
                this.weapon.checkCollision(this,enemy);
            });
        }   
        if (this.visible)  {
            this.weapon.updateVisuals(this);
            this.visibilityTimer += deltatime;
            if (this.visibilityTimer >= this.weapon.visibilityTime) {
                this.visible = false;
                this.visibilityTimer = 0;
            }
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
        this.activated = false;
        this.cooldown = this.obsession.cooldown;
        this.cooldownTimer = this.cooldown;
    }
    activate() {
        if (this.cooldownTimer >= this.obsession.cooldown && (this.game.player.obsession - this.obsession.cost >= 0)) {
            super.activate();
            this.obsession.setVisuals(this);
        }
    }
    update(deltatime) {
        super.update();
        this.visible = this.activated;
        if (this.activated) {
            this.game.enemies.forEach(enemy => {
                this.obsession.checkCollision(this, enemy);
            });
            this.obsession.updateVisuals();
        }
        if (this.cooldownTimer < this.cooldown) this.cooldownTimer += deltatime;
    }
    draw(context) {
        this.obsession.draw(context);
    }
}