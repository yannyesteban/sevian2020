export class Arrow {
    constructor(option) {
        this.map = null;
        this.width = null;
        this.height = null;
        this.size = 36;
        this.data = null;
        this.context = null;
        this.rgb = [255, 165, 62];
        this.center = [255, 165, 62];
        this.color = "#09F";
        this.border = "white";
        this.borderWidth = 2;
        for (let x in option) {
            this[x] = option[x];
        }
        this.width = this.width || this.size;
        this.height = this.height || this.size;
        this.data = new Uint8Array(this.width * this.height * 4);
    }
    onAdd() {
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
    }
    draw(context) {
        let duration = 1000;
        let t = (performance.now() % duration) / duration;
        const deltaW = this.width * 0.0;
        context.fillStyle = this.color;
        context.strokeStyle = this.border;
        context.beginPath();
        context.moveTo(this.width / 2, 0);
        context.lineTo(this.width - deltaW, this.height);
        context.lineTo(this.width / 2, this.height * 0.9);
        context.lineTo(deltaW, this.height);
        //ctx.lineTo(100,75);
        //ctx.lineTo(100,25);
        context.lineWidth = this.borderWidth; //2 + 4 * (1 - t);
        context.closePath();
        context.fill();
        context.stroke();
    }
    render() {
        const context = this.context;
        this.draw(context);
        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;
        // continuously repaint the map, resulting in the smooth animation of the dot
        this.map.triggerRepaint();
        // return `true` to let the map know that the image was updated
        return true;
    }
    getCanvas() {
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
        this.draw(this.context);
        return canvas;
    }
}
//# sourceMappingURL=Arrow.js.map