import Player from './Player.js';
import Enemy from './enemies/Enemy.js';
import BossEnemy from './enemies/BossEnemy.js';
import StealthEnemy from './enemies/StealthEnemy.js';
import Powerup from './Powerup.js';
import WeaponSystem from './weapons/WeaponSystem.js';
import InputHandler from '../utils/InputHandler.js';
import HUD from '../ui/HUD.js';
import ParticleSystem from './ParticleSystem.js';

export default class Game {
    constructor(canvas, assets, audioEngine) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.assets = assets;
        this.audioEngine = audioEngine;
        this.inputHandler = new InputHandler(this);
        this.player = new Player(this);
        this.weaponSystem = new WeaponSystem(this);
        this.particleSystem = new ParticleSystem(this);
        this.enemies = [];
        this.powerups = [];
        this.hud = new HUD(this);
        this.score = 0;
        this.paused = false;
        this.gameOver = false;
        this.spawnTimer = 0;
        this.spawnInterval = 2000;
        this.powerupTimer = 0;
        this.powerupInterval = 5000;
        this.bossTimer = 0;
        this.bossInterval = 30000;
        this.backgroundY = 0;
        this.backgroundSpeed = 1;
        this.lastFrameTime = performance.now();
    }

    start() {
        this.animate();
    }

    animate() {
        if (!this.paused && !this.gameOver) {
            const currentTime = performance.now();
            const deltaTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.backgroundY += this.backgroundSpeed * (deltaTime / 16.67);
            if (this.backgroundY >= this.canvas.height) this.backgroundY = 0;
            this.ctx.drawImage(this.assets.background, 0, this.backgroundY, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.assets.background, 0, this.backgroundY - this.canvas.height, this.canvas.width, this.canvas.height);

            this.player.update();
            this.player.draw();
            this.spawnEnemies(deltaTime);
            this.spawnPowerups(deltaTime);
            this.spawnBoss(deltaTime);
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            for (let i = 0; i < this.enemies.length; i++) {
                this.enemies[i].update();
            }
            this.powerups = this.powerups.filter(powerup => !powerup.markedForDeletion);
            for (let i = 0; i < this.powerups.length; i++) {
                this.powerups[i].update();
            }
            this.weaponSystem.update();
            this.particleSystem.update();
            this.particleSystem.draw();
            this.hud.draw();
            requestAnimationFrame(() => this.animate());
        }
    }

    spawnEnemies(deltaTime) {
        this.spawnTimer += deltaTime;
        if (this.spawnTimer > this.spawnInterval) {
            const enemyTypes = [Enemy, StealthEnemy];
            const EnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            this.enemies.push(new EnemyType(this));
            this.spawnTimer = 0;
            this.spawnInterval = Math.max(500, this.spawnInterval - 50);
        }
    }

    spawnPowerups(deltaTime) {
        this.powerupTimer += deltaTime;
        if (this.powerupTimer > this.powerupInterval) {
            const types = ['energy', 'laser', 'life', 'penta', 'wave'];
            const type = types[Math.floor(Math.random() * types.length)];
            this.powerups.push(new Powerup(this, type));
            this.powerupTimer = 0;
        }
    }

    spawnBoss(deltaTime) {
        this.bossTimer += deltaTime;
        if (this.bossTimer > this.bossInterval) {
            this.enemies.push(new BossEnemy(this));
            this.audioEngine.play('boss_warning');
            this.bossTimer = 0;
        }
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.player.resize(width, height);
        this.hud.resize(width, height);
    }

    togglePause() {
        this.paused = !this.paused;
        document.getElementById('pause-menu').style.display = this.paused ? 'flex' : 'none';
        if (this.paused) {
            this.saveProgress();
        }
    }

    endGame() {
        this.gameOver = true;
        document.getElementById('game-over').style.display = 'flex';
        localStorage.removeItem('gameProgress');
    }

    saveProgress() {
        const progress = {
            score: this.score,
            lives: this.player.lives,
            energy: this.player.energy,
            position: { x: this.player.x, y: this.player.y }
        };
        localStorage.setItem('gameProgress', JSON.stringify(progress));
    }

    loadProgress(progress) {
        this.score = progress.score;
        this.player.lives = progress.lives;
        this.player.energy = progress.energy;
        this.player.x = progress.position.x;
        this.player.y = progress.position.y;
    }
}