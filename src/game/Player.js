export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 64;
        this.height = 64;
        this.x = game.canvas.width / 2 - this.width / 2;
        this.y = game.canvas.height - this.height - 20;
        this.speed = 5;
        this.frame = 0;
        this.frameTimer = 0;
        this.frameInterval = 100;
        this.image = game.assets.playerSheet;
        this.thrusterImage = game.assets.thruster;
        this.lives = 3;
        this.energy = 100;
    }

    update() {
        const inputs = this.game.inputHandler.inputs;
        if (inputs.left && this.x > 0) this.x -= this.speed;
        if (inputs.right && this.x < this.game.canvas.width - this.width) this.x += this.speed;
        if (inputs.up && this.y > 0) this.y -= this.speed;
        if (inputs.down && this.y < this.game.canvas.height - this.height) this.y += this.speed;

        this.frameTimer += 16.67;
        if (this.frameTimer > this.frameInterval) {
            this.frame = inputs.left ? 1 : inputs.right ? 2 : 0;
            this.frameTimer = 0;
        }

        if (inputs.shoot) {
            this.game.weaponSystem.shoot();
            this.game.particleSystem.addParticle(
                this.x + this.width / 2,
                this.y,
                0,
                -2,
                'glow'
            );
        }

        if (inputs.laser && this.energy >= 10) {
            this.game.weaponSystem.setWeapon('laser');
            this.energy -= 10;
        }

        this.game.particleSystem.addParticle(
            this.x + this.width / 2,
            this.y + this.height,
            0,
            1,
            'trail'
        );
    }

    draw() {
        this.game.ctx.drawImage(
            this.image,
            this.frame * 128, 0, 128, 128,
            this.x, this.y, this.width, this.height
        );
        this.game.ctx.drawImage(
            this.thrusterImage,
            this.x + this.width / 2 - 10,
            this.y + this.height,
            20,
            20
        );
    }

    resize(width, height) {
        this.x = width / 2 - this.width / 2;
        this.y = height - this.height - 20;
    }

    hit() {
        this.lives--;
        if (this.lives <= 0) this.game.endGame();
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

    addEnergy(amount) {
        this.energy = Math.min(100, this.energy + amount);
    }
}