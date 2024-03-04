import { GameObject } from "./GameObject.js";
export class Interactive extends GameObject {
    constructor(x, y, sprite, sizeX, sizeY, event) {
        super(x, y, sprite, sizeX, sizeY);
        this.event = event;
        this.interaction = false;
    }
    checkCollision(x, y) {
        let difX = x - this.x;
        let difY = y - this.y;
        let distance = Math.sqrt(difX * difX + difY * difY);
        if (distance <= this.radius * 2) { this.interaction = true } else { this.interaction = false; }
        return distance <= this.radius * 2;
    }
}