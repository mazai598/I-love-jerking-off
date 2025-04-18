import NormalWeapon from './NormalWeapon.js';
import LaserWeapon from './LaserWeapon.js';
import PentaWeapon from './PentaWeapon.js';
import WaveWeapon from './WaveWeapon.js';

export default class WeaponSystem {
    constructor(game) {
        this.game = game;
        this.weapons = {
            normal: new NormalWeapon(game),
            laser: new LaserWeapon(game),
            penta: new PentaWeapon(game),
            wave: new WaveWeapon(game)
        };
        this.currentWeapon = this.weapons.normal;
        this.shootTimer = 0;
        this.shootInterval = 200;
    }

    setWeapon(type) {
        if (this.weapons[type]) {
            this.currentWeapon = this.weapons[type];
            this.game.audioEngine.play(type);
        }
    }

    shoot() {
        this.shootTimer += 16.67;
        if (this.shootTimer > this.shootInterval) {
            this.currentWeapon.shoot();
            this.shootTimer = 0;
            this.game.audioEngine.play('shoot');
        }
    }

    update() {
        this.currentWeapon.update();
    }
}