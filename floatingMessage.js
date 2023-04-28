export class FloatingMessage {
    constructor(value, x, y, targetX, targetY) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.markedForDeletion = false;
        this.timer = 0;
        this.maxTime = 30;
    }
    update() {
        this.x += (this.targetX - this.x) * 0.05;
        this.y += (this.targetY - this.y) * 0.05;
        this.timer++;
        if (this.timer > this.maxTime) this.markedForDeletion = true;
    }
    draw(context) {
        context.font = '20px Helvetica';
        context.fillStyle = 'red';
        context.fillText(this.value, this.x, this.y);
        context.fillStyle = 'black';
        context.fillText(this.value, this.x + 1, this.y + 1);
    }
}