export default class HUD {
    constructor(game) {
        this.game = game;
        this.fontSize = 20;
    }

    draw() {
        const ctx = this.game.ctx;
        ctx.fillStyle = 'white';
        ctx.font = `${this.fontSize}px PixelFont`;
        ctx.fillText(`Score: ${this.game.score}`, 10, 30);
        ctx.fillText(`Lives: ${this.game.player.lives}`, 10, 60);
        ctx.fillText(`Energy: ${this.game.player.energy}`, 10, 90);
    }

    resize(width, height) {
        this.fontSize = Math.min(width, height) / 20;
    }
}