import { Interactive } from "../models/Interactive.js";

export class InteractionController {
    constructor(canvas, gameObjects, player, globo) {
        this.canvas = canvas;
        this.interactives = gameObjects.filter(obj => obj instanceof Interactive);
        this.player = player;
        this.globo = globo;
    }

    checkCollisions() {
        this.globo.visible = false;
        this.interactives.forEach(interactive => {
            if (interactive.checkCollision(this.player.x, this.player.y)) {
                console.log("has collided");
                this.globo.x = interactive.x;
                this.globo.y = interactive.y - interactive.radius - interactive.radius / 1.2;
                this.globo.visible = true;
            }
        });
    }

}