export default class LaserShot {
    constructor(game) {
        this.game = game;
        this.x = game.player.x + game.player.width / 2 - 5;
        this.y = game.player.y;
        this.width = 10;
        this.height = 30;
        this.speed = -15;
        this.markedForDeletion = false;
        this.image = game.assets.laser;
    }

    update() {
        this.y += this.speed;
        if (this.y < -this.height) this.markedForDeletion = true;
        this.game.enemies.forEach(enemy => {
            if (
                this.x < enemy.x + enemy.width &&
                this.x + this.width > enemy.x &&
                this.y < enemy.y + enemy.height &&
                this.y + this.height > enemy.y
            ) {
                enemy.hit();
                this.markedForDeletion = true;
                this.game.score += 20;
            }
        });
        this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}