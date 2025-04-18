export const translations = {
    zh: {
        'game-title': '我爱打飞机',
        'start-game': '开始游戏',
        'continue-game': '继续游戏',
        'leaderboard': '排行榜',
        'help': '帮助',
        'about': '关于',
        'settings': '设置',
        'exit': '退出',
        'install': '安装游戏',
        'settings-title': '设置',
        'sound-volume-label': '音量',
        'sound-toggle-label': '音效',
        'graphics-quality-label': '画质',
        'language-label': '语言',
        'key-up-label': '上移',
        'key-down-label': '下移',
        'key-left-label': '左移',
        'key-right-label': '右移',
        'key-shoot-label': '射击',
        'key-laser-label': '激光',
        'save-settings': '保存',
        'close-settings': '关闭',
        'game-over-text': '游戏结束',
        'restart-game': '重新开始',
        'return-menu': '返回菜单',
        'pause-text': '暂停',
        'resume-game': '继续',
        'leaderboard-text': '暂无排行榜数据',
        'help-text': '使用箭头键移动，空格键射击，Shift 键发射激光。',
        'about-text': '我爱打飞机 - 一款太空射击游戏'
    },
    en: {
        'game-title': 'I Love Shooting Planes',
        'start-game': 'Start Game',
        'continue-game': 'Continue',
        'leaderboard': 'Leaderboard',
        'help': 'Help',
        'about': 'About',
        'settings': 'Settings',
        'exit': 'Exit',
        'install': 'Install Game',
        'settings-title': 'Settings',
        'sound-volume-label': 'Volume',
        'sound-toggle-label': 'Sound Effects',
        'graphics-quality-label': 'Graphics Quality',
        'language-label': 'Language',
        'key-up-label': 'Move Up',
        'key-down-label': 'Move Down',
        'key-left-label': 'Move Left',
        'key-right-label': 'Move Right',
        'key-shoot-label': 'Shoot',
        'key-laser-label': 'Laser',
        'save-settings': 'Save',
        'close-settings': 'Close',
        'game-over-text': 'Game Over',
        'restart-game': 'Restart',
        'return-menu': 'Main Menu',
        'pause-text': 'Paused',
        'resume-game': 'Resume',
        'leaderboard-text': 'No leaderboard data yet',
        'help-text': 'Use arrow keys to move, Space to shoot, Shift for laser.',
        'about-text': 'I Love Shooting Planes - A space shooter game'
    }
};

export function updateLanguage(lang) {
    Object.keys(translations[lang]).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = translations[lang][id];
    });
    const inputs = {
        'key-up': lang === 'zh' ? '↑' : 'Arrow Up',
        'key-down': lang === 'zh' ? '↓' : 'Arrow Down',
        'key-left': lang === 'zh' ? '←' : 'Arrow Left',
        'key-right': lang === 'zh' ? '→' : 'Arrow Right',
        'key-shoot': lang === 'zh' ? '空格' : 'Space',
        'key-laser': lang === 'zh' ? 'Shift' : 'Shift'
    };
    Object.entries(inputs).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.value = value;
    });
}