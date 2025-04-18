export default class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.trailImage = game.assets.particleTrail;
        this.glowImage = game.assets.glow;
    }

    addParticle(x, y, vx, vy, type = 'trail') {
        this.particles.push({ x, y, vx, vy, life: 100, type });
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 1;
        });
    }

    draw() {
        const ctx = this.game.ctx;
        this.particles.forEach(p => {
            if (p.type === 'trail') {
                ctx.drawImage(this.trailImage, p.x, p.y, 5, 5);
            } else if (p.type === 'glow') {
                ctx.drawImage(this.glowImage, p.x - 5, p.y - 5, 10, 10);
            }
        });
    }
}