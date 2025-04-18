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

        window.addEventListener('keydown', e => this.handleKey(e, true));
        window.addEventListener('keyup', e => this.handleKey(e, false));
        this.setupVirtualControls();
    }

    handleKey(e, state) {
        switch (e.key) {
            case 'ArrowLeft':
                this.inputs.left = state;
                break;
            case 'ArrowRight':
                this.inputs.right = state;
                break;
            case 'ArrowUp':
                this.inputs.up = state;
                break;
            case 'ArrowDown':
                this.inputs.down = state;
                break;
            case ' ':
                this.inputs.shoot = state;
                break;
            case 'Shift':
                this.inputs.laser = state;
                break;
            case 'Escape':
                if (state) this.game.togglePause();
                break;
        }
    }

    setupVirtualControls() {
        document.getElementById('virtual-left').addEventListener('touchstart', () => this.inputs.left = true);
        document.getElementById('virtual-left').addEventListener('touchend', () => this.inputs.left = false);
        document.getElementById('virtual-right').addEventListener('touchstart', () => this.inputs.right = true);
        document.getElementById('virtual-right').addEventListener('touchend', () => this.inputs.right = false);
        document.getElementById('virtual-up').addEventListener('touchstart', () => this.inputs.up = true);
        document.getElementById('virtual-up').addEventListener('touchend', () => this.inputs.up = false);
        document.getElementById('virtual-down').addEventListener('touchstart', () => this.inputs.down = true);
        document.getElementById('virtual-down').addEventListener('touchend', () => this.inputs.down = false);
        document.getElementById('virtual-shoot').addEventListener('touchstart', () => this.inputs.shoot = true);
        document.getElementById('virtual-shoot').addEventListener('touchend', () => this.inputs.shoot = false);
        document.getElementById('virtual-laser').addEventListener('touchstart', () => this.inputs.laser = true);
        document.getElementById('virtual-laser').addEventListener('touchend', () => this.inputs.laser = false);
    }
}