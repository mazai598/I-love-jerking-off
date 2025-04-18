export default class ParticleSystem {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.maxParticles = 100; // Limit the number of particles
    }

    addParticle(x, y, dx, dy, type) {
        if (this.particles.length < this.maxParticles) {
            this.particles.push({ x, y, dx, dy, type, life: 1 });
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.02;
        }
    }

    draw() {
        const ctx = this.game.ctx;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const image = this.game.assets[p.type === 'glow' ? 'glow' : 'particle_trail'];
            if (image && image.complete) {
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
        }
    }
}