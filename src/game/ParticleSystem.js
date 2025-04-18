export default class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
    }

    addParticle(x, y, dx, dy, type) {
        this.particles.push({ x, y, dx, dy, type, life: 1 });
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.02;
        });
    }

    draw() {
        const ctx = this.game.ctx;
        this.particles.forEach(p => {
            const image = this.game.assets[p.type === 'glow' ? 'glow' : 'particle_trail'];
            if (image && image.complete) { // Ensure image is loaded
                ctx.globalAlpha = p.life;
                ctx.drawImage(
                    image,
                    p.x - 5,
                    p.y - 5,
                    10,
                    10
                );
                ctx.globalAlpha = 1;
            } else {
                console.warn(`Particle image for type ${p.type} not loaded`);
            }
        });
    }
}