export const translations = {
    zh: {
        gameTitle: '我爱打飞机',
        startGame: '开始游戏',
        continueGame: '继续游戏',
        leaderboard: '排行榜',
        help: '帮助',
        about: '关于',
        settings: '设置',
        exit: '退出',
        install: '安装游戏',
        settingsTitle: '设置',
        soundVolume: '音量',
        soundToggle: '音效',
        graphicsQuality: '画质',
        language: '语言',
        keyUp: '上移',
        keyDown: '下移',
        keyLeft: '左移',
        keyRight: '右移',
        keyShoot: '射击',
        keyLaser: '激光',
        save: '保存',
        close: '关闭',
        leaderboardText: '暂无排行榜数据',
        helpText: '使用箭头键移动，空格键射击，Shift 键发射激光。',
        aboutText: '我爱打飞机 - 一款太空射击游戏',
        gameOver: '游戏结束',
        restartGame: '重新开始',
        returnMenu: '返回菜单',
        pause: '暂停',
        resumeGame: '继续'
    },
    en: {
        gameTitle: 'I Love Shooting',
        startGame: 'Start Game',
        continueGame: 'Continue Game',
        leaderboard: 'Leaderboard',
        help: 'Help',
        about: 'About',
        settings: 'Settings',
        exit: 'Exit',
        install: 'Install Game',
        settingsTitle: 'Settings',
        soundVolume: 'Volume',
        soundToggle: 'Sound',
        graphicsQuality: 'Graphics Quality',
        language: 'Language',
        keyUp: 'Move Up',
        keyDown: 'Move Down',
        keyLeft: 'Move Left',
        keyRight: 'Move Right',
        keyShoot: 'Shoot',
        keyLaser: 'Laser',
        save: 'Save',
        close: 'Close',
        leaderboardText: 'No leaderboard data available',
        helpText: 'Use arrow keys to move, Space to shoot, Shift to fire laser.',
        aboutText: 'I Love Shooting - A space shooter game',
        gameOver: 'Game Over',
        restartGame: 'Restart Game',
        returnMenu: 'Return to Menu',
        pause: 'Paused',
        resumeGame: 'Resume'
    }
};

export function updateLanguage(lang) {
    const elements = document.querySelectorAll('[id]');
    elements.forEach(el => {
        const key = el.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}