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

        // Initialize dynamic background video
        this.backgroundVideo = document.createElement('video');
        this.backgroundVideo.src = './assets/videos/menu_starfield.mp4';
        this.backgroundVideo.muted = true;
        this.backgroundVideo.loop = true;
        this.backgroundVideo.autoplay = true;
        this.backgroundVideo.playsInline = true;
    }

    start() {
        this.backgroundVideo.play();
        this.animate();
    }

    animate() {
        if (!this.paused && !this.gameOver) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Draw dynamic video background
            this.ctx.drawImage(this.backgroundVideo, 0, 0, this.canvas.width, this.canvas.height);
            this.player.update();
            this.player.draw();
            this.spawnEnemies();
            this.spawnPowerups();
            this.spawnBoss();
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.enemies.forEach(enemy => enemy.update());
            this.powerups = this.powerups.filter(powerup => !powerup.markedForDeletion);
            this.powerups.forEach(powerup => powerup.update());
            this.weaponSystem.update();
            this.particleSystem.update();
            this.particleSystem.draw();
            this.hud.draw();
            requestAnimationFrame(() => this.animate());
        }
    }

    spawnEnemies() {
        this.spawnTimer += 16.67;
        if (this.spawnTimer > this.spawnInterval) {
            const enemyTypes = [Enemy, StealthEnemy];
            const EnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            this.enemies.push(new EnemyType(this));
            this.spawnTimer = 0;
            this.spawnInterval = Math.max(500, this.spawnInterval - 50); // Gradually increase difficulty
        }
    }

    spawnPowerups() {
        this.powerupTimer += 16.67;
        if (this.powerupTimer > this.powerupInterval) {
            const types = ['energy', 'laser', 'life', 'penta', 'wave'];
            const type = types[Math.floor(Math.random() * types.length)];
            this.powerups.push(new Powerup(this, type));
            this.powerupTimer = 0;
        }
    }

    spawnBoss() {
        this.bossTimer += 16.67;
        if (this.bossTimer > this.bossInterval) {
            this.enemies.push(new BossEnemy(this));
            this.audioEngine.play('bossWarning');
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
            this.backgroundVideo.pause();
        } else {
            this.backgroundVideo.play();
        }
    }

    endGame() {
        this.gameOver = true;
        this.backgroundVideo.pause();
        document.getElementById('game-over').style.display = 'flex';
    }
}