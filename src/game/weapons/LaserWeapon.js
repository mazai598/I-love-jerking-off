import LaserShot from './LaserShot.js';

export default class LaserWeapon {
    constructor(game) {
        this.game = game;
        this.bullets = [];
    }

    shoot() {
        this.bullets.push(new LaserShot(this.game));
    }

    update() {
        this.bullets = this.bullets.filter(b => !b.markedForDeletion);
        this.bullets.forEach(b => b.update());
    }
}