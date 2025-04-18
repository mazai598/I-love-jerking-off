export default class WeaponSystem {
    constructor(game) {
        this.game = game;
        this.bullets = [];
        this.currentWeapon = 'normal';
        this.shootTimer = 0;
        this.shootInterval = 200;
    }

    setWeapon(type) {
        this.currentWeapon = type;
        this.shootInterval = type === 'laser' ? 500 : 200;
    }

    shoot() {
        this.shootTimer += 16.67;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            switch (this.currentWeapon) {
                case 'normal':
                    this.bullets.push({
                        x: this.game.player.x + this.game.player.width / 2 - 2,
                        y: this.game.player.y,
                        width: 4,
                        height: 10,
                        speed: -5,
                        image: this.game.assets.bullet
                    });
                    this.game.audioEngine.play('shoot');
                    break;
                case 'laser':
                    this.bullets.push({
                        x: this.game.player.x + this.game.player.width / 2 - 5,
                        y: this.game.player.y,
                        width: 10,
                        height: 20,
                        speed: -7,
                        image: this.game.assets.bullet_laser
                    });
                    this.game.audioEngine.play('laser');
                    break;
                case 'penta':
                    for (let i = -2; i <= 2; i++) {
                        this.bullets.push({
                            x: this.game.player.x + this.game.player.width / 2 - 2,
                            y: this.game.player.y,
                            width: 4,
                            height: 10,
                            speed: -5,
                            dx: i * 1,
                            image: this.game.assets.bullet_penta
                        });
                    }
                    this.game.audioEngine.play('penta');
                    break;
                case 'wave':
                    this.bullets.push({
                        x: this.game.player.x + this.game.player.width / 2 - 5,
                        y: this.game.player.y,
                        width: 10,
                        height: 10,
                        speed: -5,
                        amplitude: 20,
                        frequency: 0.05,
                        image: this.game.assets.bullet_wave,
                        time: 0
                    });
                    this.game.audioEngine.play('wave');
                    break;
            }
        }
    }

    update() {
        this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.y += bullet.speed;
            if (bullet.y < 0) bullet.markedForDeletion = true;

            if (this.currentWeapon === 'wave') {
                bullet.time += 1;
                bullet.x += bullet.dx || Math.sin(bullet.time * bullet.frequency) * bullet.amplitude;
            } else if (this.currentWeapon === 'penta') {
                bullet.x += bullet.dx || 0;
            }

            for (let j = 0; j < this.game.enemies.length; j++) {
                const enemy = this.game.enemies[j];
                if (
                    bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y
                ) {
                    bullet.markedForDeletion = true;
                    enemy.hit();
                    this.game.score += 10;
                }
            }
        }
    }

    draw() {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            this.game.ctx.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }
}