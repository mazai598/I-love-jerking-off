export default class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 32;
        this.height = 32;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 2;
        this.markedForDeletion = false;
        this.image = this.game.assets.enemySmall;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) this.markedForDeletion = true;
        if (this.collidesWith(this.game.player)) {
            this.game.player.hit();
            this.markedForDeletion = true;
        }
        this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collidesWith(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }

    hit() {
        this.markedForDeletion = true;
        this.game.audioEngine.play('explosion');
        for (let i = 0; i < 5; i++) {
            this.game.particleSystem.addParticle(
                this.x + this.width / 2,
                this.y + this.height / 2,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                'glow'
            );
        }
    }
}