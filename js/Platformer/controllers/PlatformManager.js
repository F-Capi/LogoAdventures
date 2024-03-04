import { Platform } from "../models/Platform.js";
export class PlatformManager {
    constructor() {
        this.platforms = [];
        this.originalPlatforms = [];
        this.lineWidth = 5;
        this.originalLineWidth = this.lineWidth;
    }
    addPlatform(x1, y1, x2, y2) {
        const platform = new Platform(x1, y1, x2, y2);
        this.platforms.push(platform);
        this.originalPlatforms.push({ x1, y1, x2, y2 });
    }
    scalePlatforms(scaleFactor) {
        this.platforms = this.originalPlatforms.map(p =>
            new Platform(p.x1 * scaleFactor, p.y1 * scaleFactor, p.x2 * scaleFactor, p.y2 * scaleFactor));
    }
    getPlatforms() {
        return this.platforms;
    }
}
