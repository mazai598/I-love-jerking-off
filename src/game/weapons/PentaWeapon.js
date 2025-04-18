export default class PentaWeapon {
    constructor(game) {
        this.game = game;
        this.bullets = [];
        this.image = game.assets.bulletPenta;
    }

    shoot() {
        const angles = [-20, -10, 0, 10, 20];
        angles.forEach(angle => {
            this.bullets.push({
                x: this.game.player.x + this.game.player.width / 2 - 5,
                y: this.game.player.y,
                width: 10,
                height: 20,
                speedX: Math.sin(angle * Math.PI / 180) * 10,
                speedY: -10
            });
        });
    }

    update() {
        this.bullets = this.bullets.filter(b => b.y > -b.height);
        this.bullets.forEach(b => {
            b.x += b.speedX;
            b.y += b.speedY;
            this.game.enemies.forEach(enemy => {
                if (
                    b.x < enemy.x + enemy.width &&
                    b.x + b.width > enemy.x &&
                    b.y < enemy.y + enemy.height &&
                    b.y + b.height > enemy.y
                ) {
                    enemy.hit();
                    b.y = -b.height;
                    this.game.score += 15;
                }
            });
            this.game.ctx.drawImage(this.image, b.x, b.y, b.width, b.height);
        });
    }
}