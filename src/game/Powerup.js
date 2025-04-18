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
        this.image = game.assets[`powerup${type.charAt(0).toUpperCase() + type.slice(1)}`];
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

    applyEffect() {
        this.game.audioEngine.play('powerup');
        switch (this.type) {
            case 'life':
                this.game.player.lives++;
                break;
            case 'energy':
                this.game.player.addEnergy(20);
                break;
            default:
                this.game.weaponSystem.setWeapon(this.type);
        }
    }
}