export class Loader {
    constructor() {
        this.images = {};
        this.imageUrls = [];
        this.imagesLoaded = 0;
    }

    addImage(name, url) {
        this.imageUrls.push({ name, url });
    }

    loadAll(callback) {
        if (this.imageUrls.length === 0) {
            callback();
        }

        this.imageUrls.forEach(({ name, url }) => {
            const img = new Image();
            img.onload = () => {
                this.images[name] = img;
                this.imagesLoaded++;
                if (this.imagesLoaded === this.imageUrls.length) {
                    callback();
                }
            };
            img.onerror = () => {
                console.error(`Error al cargar la imagen: ${url}`);
            };
            img.src = url;
        });
    }

    getImage(name) {
        return this.images[name];
    }
}
