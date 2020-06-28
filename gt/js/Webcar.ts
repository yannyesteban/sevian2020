var GTWebcar = (($) => {
   


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
							
						}
					},
					{
						id: 9,
                		caption:"O",
                		action:(item, event) => {
							
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