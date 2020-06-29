var GTWebcar = (($) => {

	let color = null;
	class TraceMarker{
        map:any = null;
        width: number = 10;
        height: number = 10;
        size: number = 200;
        data:any = null;
        context:any = null;
        constructor(map, size:number){
            this.map = map;
            this.size = size;
            this.width = size;
            this.height = size;
            this.data = new Uint8Array(this.width * this.height * 4);
            
        }

        onAdd(){
            
            let canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d')
        }

        render(){
			let context = this.context;
			context.beginPath();
			context.moveTo(this.size/2, 0);
			context.lineTo(this.size, this.size);

			context.lineTo(this.size/2, this.size*0.8);

			context.lineTo(0, this.size);
			context.lineTo(this.size/2, 0);
			//context.fill();
			context.strokeStyle = 'yello3';
			context.lineWidth = 2;
			context.fillStyle = "#aabb1105";
            context.fill();
            context.stroke();

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


            let duration = 1000;
            let t = (performance.now() % duration) / duration;
             
            let radius = (this.size / 2) * 0.3;
            let outerRadius = (this.size / 2) * 0.7 * t + radius;
            //let context = this.context;
             
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
            context.fillStyle = 'rgba(255, 165, 62,' + (1 - t) + ')';
            context.fill();
             
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
            context.fillStyle = 'rgba(255, 165, 62, 1)';

            //242, 255, 62
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();
             
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
    }  


    class Webcar{
		
		id:any = null;
		map:any = null;

		unit:object = null;
		
		dataClients:any[] = null;
		dataAccounts:any[] = null;
		dataUnits:any[] = null;
		tracking:any[] = null;

		menu:any = null;
		win:any = null;
		
		caption:string = "";
		winCaption:string = "";
		pathImages:string = "";
		followMe:boolean = false;

		
		
		public delay:number = 30000;
		private main:any = null; 
		private marks:any[] = [];

		private _info:any = null;
		private _winInfo:any = null;
		private _timer:any = null;
		
		private _lastUnitId = null;

		private _traces:any[] = [];
		
		private _unit:object = null;
		private _win:any[] = [];
		
		static _instances:object[] = []; 
		
		static getInstance(name){
            return Unit._instances[name];
        }
		
		constructor(info){
			
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
			}
			let main = (this.id)? $(this.id): false;
            
            if(main){
                
                if(main.ds("gtUnit")){
                    return;
                }
    
                if(main.hasClass("gt-unit")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
			}
			GTMap.load((map, s)=>{
				this._unit.setMap(map);
				map.map.addImage('t1', new TraceMarker(map.map, 30), { pixelRatio: 1 });
			})
			
			

		}

		

		_create(main:any){
			
			this.main = main;

			main.addClass("unit-main");

			

			this._win["unit"] = this.win = new Float.Window({
                visible:true,
                caption: this.unit.caption,
                //child:main,
                left:10,
                top:100,
                width: "300px",
                height: "200px",
                mode:"auto",
                className:["sevian"]
			});
			
			this.unit.id = this.win.getBody();
			this.loadUnit(this.unit);

			this._win["info"] = new Float.Window({
                visible:true,
                caption: "Info",
                child:this._unit.getInfoLayer(),
                left:10,
                top:310,
                width: "300px",
                height: "200px",
                mode:"auto",
                className:["sevian"]
			});

			let menu = new Menu({
				caption:"uuuu", 
				autoClose: false,
				target:main,
				"className":["sevian","horizontal"],
				items: [
					{
						id: 1,
                		caption:"U",
                		action:(item, event) => {
							this.win.show();
						}
					},
					{
						id: 1,
                		caption:"I",
                		action:(item, event) => {
							this._win["info"].show();
						}
					},
					{
						id: 1,
                		caption:"S",
                		action:(item, event) => {
							
						}
					},
					{
						id: 3,
                		caption:"G",
                		action:(item, event) => {
							
						}
					},
					{
						id: 4,
                		caption:"A",
                		action:(item, event) => {
							
						}
					},
					{
						id: 5,
                		caption:"H",
                		action:(item, event) => {
							
						}
					},
					{
						id: 6,
                		caption:"E",
                		action:(item, event) => {
							
						}
					},
					{
						id: 7,
                		caption:"R",
                		action:(item, event) => {
							db ("rules");
							this.rule = this._unit.getMap().addRule('xxx', {
								name:"x"
							});

							this.rule.play();
							
						}
					},
					{
						id: 8,
                		caption:"L",
                		action:(item, event) => {
							color = 'green';
						}
					},
					{
						id: 9,
                		caption:"O",
                		action:(item, event) => {
							db ("circulo","white");
							this.rule = this._unit.getMap().addCircle('xxx', {
								name:"x"
							});

							this.rule.play();
						}
					}
				]
			 });
			
			

			
			

		} 
		
		loadUnit(unit){
			this._unit = new GTUnit(unit);
		}
		
        _load(main:any){

		}
		
		init(){

		}

		load(){

		}


		
	}
	


	return Webcar;
})(_sgQuery);