export class Triangle {
    constructor(map, option) {
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
        this.map = map;
        //this.size = size;
        //this.width = size;
        //this.height = size;
        this.data = new Uint8Array(this.width * this.height * 4);
    }
    onAdd() {
        let canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
    }
    render() {
        let duration = 1000;
        let t = (performance.now() % duration) / duration;
        const context = this.context;
        context.fillStyle = this.color;
        context.strokeStyle = this.border;
        context.beginPath();
        context.moveTo(this.width / 2, this.height / 2);
        context.lineTo(this.width, this.height);
        context.lineTo(this.width / 2, this.height * 0.9);
        context.lineTo(0, this.height);
        //ctx.lineTo(100,75);
        //ctx.lineTo(100,25);
        context.lineWidth = this.borderWidth; //2 + 4 * (1 - t);
        context.closePath();
        context.fill();
        context.stroke();
        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;
        // continuously repaint the map, resulting in the smooth animation of the dot
        this.map.triggerRepaint();
        // return `true` to let the map know that the image was updated
        return true;
    }
}
//# sourceMappingURL=Triangle.js.map