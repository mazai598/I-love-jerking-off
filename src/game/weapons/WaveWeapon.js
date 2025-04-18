export default class WaveWeapon {
    constructor(game) {
        this.game = game;
        this.bullets = [];
        this.image = game.assets.bulletWave;
    }

    shoot() {
        this.bullets.push({
            x: this.game.player.x + this.game.player.width / 2 - 10,
            y: this.game.player.y,
            width: 20,
            height: 20,
            speed: -12,
            phase: 0
        });
    }

    update() {
        this.bullets = this.bullets.filter(b => b.y > -b.height);
        this.bullets.forEach(b => {
            b.y += b.speed;
            b.phase += 0.1;
            b.x += Math.sin(b.phase) * 5;
            this.game.enemies.forEach(enemy => {
                if (
                    b.x < enemy.x + enemy.width &&
                    b.x + b.width > enemy.x &&
                    b.y < enemy.y + enemy.height &&
                    b.y + b.height > enemy.y
                ) {
                    enemy.hit();
                    b.y = -b.height;
                    this.game.score += 25;
                }
            });
            this.game.ctx.drawImage(this.image, b.x, b.y, b.width, b.height);
        });
    }
}