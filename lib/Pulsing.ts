export class Pulsing{
        map:any = null;
        width: number = null;
        height: number = null;
        size: number = 80;
        data:any = null;
        context:any = null;
        rgb:number[] = [255, 165, 62];
        center:number[] = [255, 165, 62];

        color:any = "yellow";
        border:any = "white";
        halo:any = "yellow";

        constructor(option:any){

            for(let x in option){
                this[x] = option[x];
            }
            
            this.width = this.width || this.size;
            this.height = this.height || this.size;
            //this.size = size;
            //this.width = size;
            //this.height = size;
            this.data = new Uint8Array(this.width * this.height * 4);
            
        }

        onAdd(){
            
            let canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext("2d")
        }

        draw(context){
            let duration = 1000;
            let t = (performance.now() % duration) / duration;
             
            let radius = (this.size / 2) * 0.3;
            let outerRadius = (this.size / 2) * 0.7 * t + radius;
            
             
            // draw outer circle
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );
            //context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
            //context.fillStyle = 'rgba(255, 165, 62,' + (1 - t) + ')';
            context.globalAlpha = (1 - t);  
            context.fillStyle = this.halo;//"aqua";//`rgba(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]},${1-t})`;

            context.fill();
            context.globalAlpha = (1);  
            // draw inner circle
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            //context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.fillStyle = this.color;//`rgb(${this.center[0]},${this.center[1]},${this.center[2]})`;

            //242, 255, 62
            context.strokeStyle = this.border;
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();
        }
        render(){
            const context:any =  this.context;
            this.draw(context);

            this.data = new Uint8Array(this.width * this.height * 4);
            
             
            // update this image's data with data from the canvas
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;
             
            // continuously repaint the map, resulting in the smooth animation of the dot
            this.map.triggerRepaint();
             
            // return `true` to let the map know that the image was updated
            return true;
        }
        getCanvas(){
            let canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext("2d")
            this.draw(this.context);
            return canvas;
        }
    }