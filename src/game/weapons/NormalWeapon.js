export default class NormalWeapon {
    constructor(game) {
        this.game = game;
        this.bullets = [];
        this.image = game.assets.bullet;
        this.muzzleFlash = game.assets.muzzleFlash;
    }

    shoot() {
        this.bullets.push({
            x: this.game.player.x + this.game.player.width / 2 - 5,
            y: this.game.player.y,
            width: 10,
            height: 20,
            speed: -10
        });
        this.game.ctx.drawImage(
            this.muzzleFlash,
            this.game.player.x + this.game.player.width / 2 - 10,
            this.game.player.y - 10,
            20,
            20
        );
    }

    update() {
        this.bullets = this.bullets.filter(b => b.y > -b.height);
        this.bullets.forEach(b => {
            b.y += b.speed;
            this.game.enemies.forEach(enemy => {
                if (
                    b.x < enemy.x + enemy.width &&
                    b.x + b.width > enemy.x &&
                    b.y < enemy.y + enemy.height &&
                    b.y + b.height > enemy.y
                ) {
                    enemy.hit();
                    b.y = -b.height;
                    this.game.score += 10;
                }
            });
            this.game.ctx.drawImage(this.image, b.x, b.y, b.width, b.height);
        });
    }
}