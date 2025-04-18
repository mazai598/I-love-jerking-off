export default class Powerup {
    constructor(game, type) {
        this.game = game;
        this.type = type;
        this.width = 20;
        this.height = 20;
        this.x = Math.random() * (game.canvas.width - this.width);
        this.y = -this.height;
        this.speed = 1;
        this.markedForDeletion = false;
        this.image = game.assets[`powerup_${this.type}`];
        if (!this.image) console.warn(`Powerup image for type ${this.type} not loaded`);
    }

    update() {
        this.y += this.speed;
        if (this.y > this.game.canvas.height) this.markedForDeletion = true;
        if (this.collidesWith(this.game.player)) {
            this.applyEffect();
            this.markedForDeletion = true;
        }
    }

    draw() {
        if (this.image && this.image.complete) {
            this.game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    collidesWith(player) {
        return (
            this.x < player.x + player.width &&
            this.x + this.width > player.x &&
            this.y < player.y + player.height &&
            this.y + this.height > player.y
        );
    }

    applyEffect() {
        console.log(`Applying powerup effect: ${this.type}`);
        this.game.audioEngine.play('powerup');
        for (let i = 0; i < 5; i++) {
            this.game.particleSystem.addParticle(
                this.x + this.width / 2,
                this.y + this.height / 2,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                'glow'
            );
        }

        switch (this.type) {
            case 'life':
                this.game.player.lives++;
                break;
            case 'energy':
                this.game.player.addEnergy(20);
                break;
            case 'laser':
                this.game.weaponSystem.setWeapon('laser');
                this.game.player.addEnergy(10);
                break;
            case 'penta':
                this.game.weaponSystem.setWeapon('penta');
                break;
            case 'wave':
                this.game.weaponSystem.setWeapon('wave');
                break;
            default:
                console.warn(`Unknown powerup type: ${this.type}`);
        }
    }
}