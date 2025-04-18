import Enemy from './Enemy.js';

export default class StealthEnemy extends Enemy {
    constructor(game) {
        super(game);
        this.image = game.assets.enemyStealth;
        this.alpha = 0.5;
        this.bullets = [];
        this.shootTimer = 0;
        this.shootInterval = 1500;
        this.bulletImage = game.assets.enemyBullet;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) this.markedForDeletion = true;
        if (this.collidesWith(this.game.player)) {
            this.game.player.hit();
            this.markedForDeletion = true;
        }

        this.shootTimer += 16.67;
        if (this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }

        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
        this.bullets.forEach(b => b.update());

        this.game.ctx.globalAlpha = this.alpha;
        this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.game.ctx.globalAlpha = 1;
    }

    shoot() {
        this.bullets.push({
            x: this.x + this.width / 2 - 5,
            y: this.y + this.height,
            width: 10,
            height: 20,
            speed: 4,
            markedForDeletion: false
        });
        this.game.audioEngine.play('shoot');
    }
}

class EnemyBullet {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 20;
        this.speed = 4;
        this.markedForDeletion = false;
        this.game = game;
        this.image = game.assets.enemyBullet;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) this.markedForDeletion = true;
        if (
            this.x < this.game.player.x + this.game.player.width &&
            this.x + this.width > this.game.player.x &&
            this.y < this.game.player.y + this.game.player.height &&
            this.y + this.height > this.game.player.y
        ) {
            this.game.player.hit();
            this.markedForDeletion = true;
        }
        this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

StealthEnemy.prototype.bullets = [];
StealthEnemy.prototype.shoot = function() {
    this.bullets.push(new EnemyBullet(this.x + this.width / 2 - 5, this.y + this.height, this.game));
    this.game.audioEngine.play('shoot');
};