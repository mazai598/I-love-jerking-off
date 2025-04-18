export default class StealthEnemy {
    constructor(game) {
        this.game = game;
        this.width = 32;
        this.height = 32;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 1.5;
        this.markedForDeletion = false;
        this.image = game.assets.enemy_stealth;
        this.opacity = 0.5;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) this.markedForDeletion = true;
        if (this.collidesWith(this.game.player)) {
            this.markedForDeletion = true;
            this.game.player.hit();
        }
    }

    draw() {
        this.game.ctx.globalAlpha = this.opacity;
        this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.game.ctx.globalAlpha = 1;
    }

    collidesWith(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }
}