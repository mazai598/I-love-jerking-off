export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.inputs = {
            left: false,
            right: false,
            up: false,
            down: false,
            shoot: false,
            laser: false
        };
        this.setupKeyboard();
        this.setupVirtualControls();
    }

    setupKeyboard() {
        window.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') this.inputs.left = true;
            if (e.key === 'ArrowRight') this.inputs.right = true;
            if (e.key === 'ArrowUp') this.inputs.up = true;
            if (e.key === 'ArrowDown') this.inputs.down = true;
            if (e.key === ' ') this.inputs.shoot = true;
            if (e.key === 'Shift') this.inputs.laser = true;
            if (e.key === 'Escape') this.game.togglePause();
        });
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowLeft') this.inputs.left = false;
            if (e.key === 'ArrowRight') this.inputs.right = false;
            if (e.key === 'ArrowUp') this.inputs.up = false;
            if (e.key === 'ArrowDown') this.inputs.down = false;
            if (e.key === ' ') this.inputs.shoot = false;
            if (e.key === 'Shift') this.inputs.laser = false;
        });
    }

    setupVirtualControls() {
        const buttons = {
            'virtual-left': 'left',
            'virtual-right': 'right',
            'virtual-up': 'up',
            'virtual-down': 'down',
            'virtual-shoot': 'shoot',
            'virtual-laser': 'laser'
        };
        for (const [id, input] of Object.entries(buttons)) {
            const btn = document.getElementById(id);
            btn.addEventListener('touchstart', e => {
                e.preventDefault();
                this.inputs[input] = true;
            });
            btn.addEventListener('touchend', () => this.inputs[input] = false);
            btn.addEventListener('mousedown', () => this.inputs[input] = true);
            btn.addEventListener('mouseup', () => this.inputs[input] = false);
        }
    }
}