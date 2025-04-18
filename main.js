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

    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
        document.getElementById('continue-game').disabled = false;
    }

    loadAssets().then(assets => {
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
    }).catch(error => {
        console.error('Failed to load assets:', error);
        loadingScreen.innerHTML = '加载失败，请刷新页面重试。';
    });

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        const installButton = document.getElementById('install');
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
                installButton.style.display = 'none';
            });
        });
    });
}

function loadAssets() {
    const assets = {};
    const promises = [
        loadImage('./assets/images/background.png').then(img => assets.background = img),
        loadImage('./assets/images/boss_final.png').then(img => assets.boss_final = img),
        loadImage('./assets/images/boss_mid.png').then(img => assets.boss_mid = img),
        loadImage('./assets/images/boss_mini.png').then(img => assets.boss_mini = img),
        loadImage('./assets/images/boss_missile.png').then(img => assets.boss_missile = img),
        loadImage('./assets/images/bullet.png').then(img => assets.bullet = img),
        loadImage('./assets/images/bullet_laser.png').then(img => assets.bullet_laser = img),
        loadImage('./assets/images/bullet_penta.png').then(img => assets.bullet_penta = img),
        loadImage('./assets/images/bullet_wave.png').then(img => assets.bullet_wave = img),
        loadImage('./assets/images/enemy_bullet.png').then(img => assets.enemy_bullet = img),
        loadImage('./assets/images/enemy_large.png').then(img => assets.enemy_large = img),
        loadImage('./assets/images/enemy_medium.png').then(img => assets.enemy_medium = img),
        loadImage('./assets/images/enemy_small.png').then(img => assets.enemy_small = img),
        loadImage('./assets/images/enemy_stealth.png').then(img => assets.enemy_stealth = img),
        loadImage('./assets/images/explosion.png').then(img => assets.explosion = img),
        loadImage('./assets/images/glow.png').then(img => assets.glow = img),
        loadImage('./assets/images/laser.png').then(img => assets.laser = img),
        loadImage('./assets/images/loading_bg.png').then(img => assets.loading_bg = img),
        loadImage('./assets/images/muzzle_flash.png').then(img => assets.muzzle_flash = img),
        loadImage('./assets/images/particle_trail.png').then(img => assets.particle_trail = img),
        loadImage('./assets/images/player_sheet.png').then(img => assets.player_sheet = img),
        loadImage('./assets/images/powerup_energy.png').then(img => assets.powerup_energy = img),
        loadImage('./assets/images/powerup_laser.png').then(img => assets.powerup_laser = img),
        loadImage('./assets/images/powerup_life.png').then(img => assets.powerup_life = img),
        loadImage('./assets/images/powerup_penta.png').then(img => assets.powerup_penta = img),
        loadImage('./assets/images/powerup_wave.png').then(img => assets.powerup_wave = img),
        loadImage('./assets/images/thruster.png').then(img => assets.thruster = img),
        loadImage('./assets/images/weapon_normal.png').then(img => assets.weapon_normal = img),
        loadAudio('./assets/sounds/bgm.mp3').then(audio => assets.bgm = audio),
        loadAudio('./assets/sounds/boss_warning.mp3').then(audio => assets.boss_warning = audio),
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
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
}

function loadAudio(src) {
    return new Promise((resolve, reject) => {
        const audio = new Audio(src);
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = () => reject(new Error(`Failed to load audio: ${src}`));
    });
}

function setupEventListeners() {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('continue-game').addEventListener('click', continueGame);
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
    document.getElementById('exit').addEventListener('click', () => {
        window.close();
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

function continueGame() {
    const savedProgress = localStorage.getItem('gameProgress');
    if (savedProgress) {
        menuContainer.style.display = 'none';
        canvas.style.display = 'block';
        virtualControls.style.display = 'flex';
        game = new Game(canvas, game.assets, audioEngine);
        game.loadProgress(JSON.parse(savedProgress));
        game.start();
        audioEngine.play('bgm', true);
        audioEngine.play('click');
    }
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