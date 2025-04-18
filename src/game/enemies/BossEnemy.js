export default class BossEnemy {
    constructor(game) {
        this.game = game;
        this.width = 128;
        this.height = 128;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = -this.height;
        this.speed = 0.5;
        this.markedForDeletion = false;
        this.image = game.assets.boss_final;
        this.health = 50;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) this.markedForDeletion = true;
        if (this.collidesWith(this.game.player)) {
            this.game.player.hit();
        }
    }

    draw() {
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
        this.health--;
        if (this.health <= 0) {
            this.markedForDeletion = true;
            this.game.score += 100;
        }
        this.game.audioEngine.play('explosion');
        for (let i = 0; i < 10; i++) {
            this.game.particleSystem.addParticle(
                this.x + this.width / 2,
                this.y + this.height / 2,
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.5) * 5,
                'glow'
            );
        }
    }
}