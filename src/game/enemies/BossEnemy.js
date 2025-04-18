export default class BossEnemy {
    constructor(game) {
        this.game = game;
        this.width = 128;
        this.height = 128;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = -this.height;
        this.speed = 1;
        this.health = 50;
        this.markedForDeletion = false;
        this.missileTimer = 0;
        this.missileInterval = 2000;
        this.missiles = [];
        this.image = this.game.assets.bossFinal;
        this.missileImage = this.game.assets.bossMissile;
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height / 4) this.y = this.game.canvas.height / 4;
        if (this.health <= 0) {
            this.markedForDeletion = true;
            this.game.score += 100;
            this.game.audioEngine.play('explosion');
        }
        if (this.collidesWith(this.game.player)) {
            this.game.player.hit();
            this.markedForDeletion = true;
        }

        this.missileTimer += 16.67;
        if (this.missileTimer > this.missileInterval) {
            this.shootMissile();
            this.missileTimer = 0;
        }

        this.missiles = this.missiles.filter(m => !m.markedForDeletion);
        this.missiles.forEach(m => m.update());

        this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    shootMissile() {
        this.missiles.push({
            x: this.x + this.width / 2 - 10,
            y: this.y + this.height,
            width: 20,
            height: 40,
            speed: 3,
            markedForDeletion: false
        });
        this.game.audioEngine.play('missile');
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

class BossMissile {
    constructor(x, y, game) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 40;
        this.speed = 3;
        this.markedForDeletion = false;
        this.game = game;
        this.image = game.assets.bossMissile;
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

BossEnemy.prototype.missiles = [];
BossEnemy.prototype.shootMissile = function() {
    this.missiles.push(new BossMissile(this.x + this.width / 2 - 10, this.y + this.height, this.game));
    this.game.audioEngine.play('missile');
};