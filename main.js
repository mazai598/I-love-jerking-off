import Game from './src/game/Game.js';
import { translations, updateLanguage } from './src/utils/Translations.js';
import AudioEngine from './src/utils/AudioEngine.js';

const canvas = document.getElementById('game-canvas');
const menuContainer = document.querySelector('.menu-container');
const loadingScreen = document.getElementById('loading-screen');
const gameOverScreen = document.getElementById('game-over');
const pauseMenu = document.getElementById('pause-menu');
const virtualControls = document.querySelector('.virtual-controls');
let game, audioEngine;

function init() {
    audioEngine = new AudioEngine();
    const savedLang = localStorage.getItem('language') || 'zh';
    updateLanguage(savedLang);
    document.getElementById('language').value = savedLang;
    loadAssets().then(assets => {
        // Preload audio into audioEngine
        Object.keys(assets).forEach(key => {
            if (key.includes('bgm') || key.includes('Warning') || key.includes('Sound')) {
                audioEngine.loadSound(key, assets[key]);
            }
        });
        game = new Game(canvas, assets, audioEngine);
        setupEventListeners();
        loadingScreen.style.display = 'none';
        menuContainer.style.display = 'block';
        resizeCanvas();
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
}

function loadAssets() {
    const assets = {};
    const promises = [
        // Images
        loadImage('./assets/images/background.png').then(img => assets.background = img),
        loadImage('./assets/images/boss_final.png').then(img => assets.bossFinal = img),
        loadImage('./assets/images/boss_mid.png').then(img => assets.bossMid = img),
        loadImage('./assets/images/boss_mini.png').then(img => assets.bossMini = img),
        loadImage('./assets/images/boss_missile.png').then(img => assets.bossMissile = img),
        loadImage('./assets/images/bullet.png').then(img => assets.bullet = img),
        loadImage('./assets/images/bullet_laser.png').then(img => assets.bulletLaser = img),
        loadImage('./assets/images/bullet_penta.png').then(img => assets.bulletPenta = img),
        loadImage('./assets/images/bullet_wave.png').then(img => assets.bulletWave = img),
        loadImage('./assets/images/enemy_bullet.png').then(img => assets.enemyBullet = img),
        loadImage('./assets/images/enemy_large.png').then(img => assets.enemyLarge = img),
        loadImage('./assets/images/enemy_medium.png').then(img => assets.enemyMedium = img),
        loadImage('./assets/images/enemy_small.png').then(img => assets.enemySmall = img),
        loadImage('./assets/images/enemy_stealth.png').then(img => assets.enemyStealth = img),
        loadImage('./assets/images/explosion.png').then(img => assets.explosion = img),
        loadImage('./assets/images/glow.png').then(img => assets.glow = img),
        loadImage('./assets/images/laser.png').then(img => assets.laser = img),
        loadImage('./assets/images/muzzle_flash.png').then(img => assets.muzzleFlash = img),
        loadImage('./assets/images/particle_trail.png').then(img => assets.particleTrail = img),
        loadImage('./assets/images/player_sheet.png').then(img => assets.playerSheet = img),
        loadImage('./assets/images/powerup_energy.png').then(img => assets.powerupEnergy = img),
        loadImage('./assets/images/powerup_laser.png').then(img => assets.powerupLaser = img),
        loadImage('./assets/images/powerup_life.png').then(img => assets.powerupLife = img),
        loadImage('./assets/images/powerup_penta.png').then(img => assets.powerupPenta = img),
        loadImage('./assets/images/powerup_wave.png').then(img => assets.powerupWave = img),
        loadImage('./assets/images/thruster.png').then(img => assets.thruster = img),
        loadImage('./assets/images/weapon_normal.png').then(img => assets.weaponNormal = img),
        // Sounds
        loadAudio('./assets/sounds/bgm.mp3').then(audio => assets.bgm = audio),
        loadAudio('./assets/sounds/boss_warning.mp3').then(audio => assets.bossWarning = audio),
        loadAudio('./assets/sounds/click.mp3').then(audio => assets.click = audio),
        loadAudio('./assets/sounds/explosion.mp3').then(audio => assets.explosion = audio),
        loadAudio('./assets/sounds/laser.mp3').then(audio => assets.laser = audio),
        loadAudio('./assets/sounds/missile.mp3').then(audio => assets.missile = audio),
        loadAudio('./assets/sounds/penta.mp3').then(audio => assets.penta = audio),
        loadAudio('./assets/sounds/powerup.mp3').then(audio => assets.powerup = audio),
        loadAudio('./assets/sounds/shoot.mp3').then(audio => assets.shoot = audio),
        loadAudio('./assets/sounds/wave.mp3').then(audio => assets.wave = audio)
    ];
    return Promise.all(promises).then(() => assets);
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

function loadAudio(src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = reject;
    });
}

function setupEventListeners() {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('settings').addEventListener('click', () => {
        document.querySelector('.settings-menu').style.display = 'block';
        audioEngine.play('click');
    });
    document.getElementById('close-settings').addEventListener('click', () => {
        document.querySelector('.settings-menu').style.display = 'none';
        audioEngine.play('click');
    });
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    document.getElementById('resume-game').addEventListener('click', () => {
        pauseMenu.style.display = 'none';
        game.togglePause();
        audioEngine.play('click');
    });
    document.getElementById('return-menu').addEventListener('click', returnToMenu);
    document.getElementById('restart-game').addEventListener('click', () => {
        gameOverScreen.style.display = 'none';
        startGame();
        audioEngine.play('click');
    });
    document.getElementById('leaderboard').addEventListener('click', () => {
        document.getElementById('leaderboard-modal').style.display = 'flex';
        audioEngine.play('click');
    });
    document.getElementById('help').addEventListener('click', () => {
        document.getElementById('help-modal').style.display = 'flex';
        audioEngine.play('click');
    });
    document.getElementById('about').addEventListener('click', () => {
        document.getElementById('about-modal').style.display = 'flex';
        audioEngine.play('click');
    });
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
            audioEngine.play('click');
        });
    });
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
}

function startGame() {
    menuContainer.style.display = 'none';
    canvas.style.display = 'block';
    virtualControls.style.display = 'flex';
    game = new Game(canvas, game.assets, audioEngine);
    game.start();
    audioEngine.play('bgm', true);
    audioEngine.play('click');
}

function returnToMenu() {
    pauseMenu.style.display = 'none';
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'none';
    virtualControls.style.display = 'none';
    menuContainer.style.display = 'block';
    audioEngine.stop('bgm');
    audioEngine.play('click');
}

function saveSettings() {
    const lang = document.getElementById('language').value;
    localStorage.setItem('language', lang);
    updateLanguage(lang);
    audioEngine.volume = parseFloat(document.getElementById('sound-volume').value);
    audioEngine.soundToggle = document.getElementById('sound-toggle').value;
    localStorage.setItem('soundVolume', audioEngine.volume);
    localStorage.setItem('soundToggle', audioEngine.soundToggle);
    audioEngine.play('click');
}

function resizeCanvas() {
    const isLandscape = window.innerWidth > window.innerHeight;
    const aspectRatio = 16 / 9;
    let width, height;
    if (isLandscape) {
        height = window.innerHeight;
        width = height * aspectRatio;
        if (width > window.innerWidth) {
            width = window.innerWidth;
            height = width / aspectRatio;
        }
    } else {
        width = window.innerWidth;
        height = width / aspectRatio;
        if (height > window.innerHeight) {
            height = window.innerHeight;
            width = height * aspectRatio;
        }
    }
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    if (game) game.resize(canvas.width, canvas.height);
    virtualControls.style.flexDirection = isLandscape ? 'row' : 'column';
}

init();