export class Resizer {
    constructor(canvas, player, platformManager, gameObjects) {
        this.canvas = canvas;
        this.player = player;
        this.platformManager = platformManager;
        this.gameObjects = gameObjects;

        this.originalPlayer = JSON.parse(JSON.stringify(player));
        this.originalPlatforms = JSON.parse(JSON.stringify(platformManager.platforms));
        this.baseWidth = 1024;
        this.baseHeight = 576;
        this.scaleRatio = 1;
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas(); // Inicializar el tamaño al cargar
    }

    calculateScaleFactor() {
        const scaleRatioWidth = this.canvas.width / this.baseWidth;
        const scaleRatioHeight = this.canvas.height / this.baseHeight;
        return Math.min(scaleRatioWidth, scaleRatioHeight);
    }

    resetToOriginalSizes() {
        this.platformManager.platforms.forEach((platform, index) => {
            const original = this.originalPlatforms[index];
            platform.x1 = original.x1;
            platform.y1 = original.y1;
            platform.x2 = original.x2;
            platform.y2 = original.y2;
        });
        Object.assign(this.player, this.originalPlayer);
        this.platformManager.lineWidth = this.platformManager.originalLineWidth;
    }

    scaleGameElements() {
        const scaleFactor = this.calculateScaleFactor();

        let currentPlayerX = this.player.x / this.scaleRatio;
        let currentPlayerY = this.player.y / this.scaleRatio;

        this.gameObjects.forEach(object => {

            object.x = object.originalX * scaleFactor;
            object.y = object.originalY * scaleFactor;
            object.radius = object.originalRadius * scaleFactor;

        });

        this.resetToOriginalSizes();

        // Escalar plataformas
        this.platformManager.platforms.forEach(platform => {
            platform.x1 *= scaleFactor;
            platform.y1 *= scaleFactor;
            platform.x2 *= scaleFactor;
            platform.y2 *= scaleFactor;
        });

        // Escalar propiedades del jugador
        this.player.x = currentPlayerX * scaleFactor;
        this.player.y = currentPlayerY * scaleFactor;
        this.player.radius *= scaleFactor;
        this.player.speed *= scaleFactor;
        this.player.gravity *= scaleFactor;
        this.player.jumpForce *= scaleFactor;
        this.scaleRatio = scaleFactor;
        this.platformManager.lineWidth *= scaleFactor;
    }

    resizeCanvas() {
        let newWidth = Math.max(window.innerWidth, 350);
        newWidth = Math.min(newWidth, this.baseWidth);

        const aspectRatio = this.baseHeight / this.baseWidth;
        let newHeight = newWidth * aspectRatio;

        this.canvas.width = newWidth;
        this.canvas.height = newHeight;

        this.scaleGameElements();
    }

}
