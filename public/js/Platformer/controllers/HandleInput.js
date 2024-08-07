export class HandleInput {
    constructor() {
        this.keys = {};

        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    isKeyPressed(key) {
        if (key === 'Space') {
            return this.keys['Space'] || this.keys[' '];
        }
        return this.keys[key];
    }
}