export class Point {
    constructor(option) {
        this.map = null;
        this.width = null;
        this.height = null;
        this.size = 200;
        this.data = null;
        this.context = null;
        this.rgb = [255, 165, 62];
        this.center = [255, 165, 62];
        this.color = "#09F";
        this.border = "white";
        this.borderWidth = 10;
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
        let radius = (this.size / 2) * 0.3;
        let outerRadius = (this.size / 2) * 0.7 * t + radius;
        context.clearRect(0, 0, this.width, this.height);
        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        //context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.fillStyle = this.color;
        //242, 255, 62
        context.strokeStyle = this.border;
        context.lineWidth = this.borderWidth; //2 + 4 * (1 - t);
        context.fill();
        context.stroke();
    }
    render() {
        const context = this.context;
        this.draw(context);
        this.data = new Uint8Array(this.width * this.height * 4);
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
//# sourceMappingURL=Point.js.map