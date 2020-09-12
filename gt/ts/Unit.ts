var GTTrace = (($) => {

	class Trace{
		
		id:string = "";
		lineId:string = "";
		map:any = null;
		data:object = null;

		_line:object = null;
		_marks:any[] = [];
		coordinates:any[] = [];
		maxPoints = 5;
		lineWidth = 5;

		_active:boolean = false;

		constructor(info:object){
			
			for(let x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
			
			this.lineId = this.id + "_line"; 
			this.data = {
				
				'type': 'geojson',
				
				'data': {
					'type': 'Feature',
					'properties': {},
					'geometry': {
						'type': 'LineString',
						'coordinates': this.coordinates
					}
				}
			};
			return;[
							[-71.65522800, 10.59577000],
							[-69.39774800, 10.06782300],
							[-66.903603, 10.480594]
						]
			
		}

		play(){
			
			this.map.addSource(this.lineId, this.data);
			this.map.addLayer({
				'id': this.lineId,
				'type': 'line',
				'source': this.lineId,
				'layout': {
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					'line-color': 'red',
					'line-width': this.lineWidth
				}
			});
		}
		addPoint(lngLat){
			//this.coordinates.push()
			

			if(this.data.data.geometry.coordinates.length <= this.maxPoints){

			}else{
				this.data.data.geometry.coordinates.shift();
			}
			this.data.data.geometry.coordinates.push(lngLat);
			// then update the map
			this.map.getSource(this.lineId).setData(this.data.data);
		}

		deletePoint(){

		}

	}

	return Trace;
})(_sgQuery)

var GTUnit = (($) => {
   
	let n=0;

    class Unit{
		
		id:any = null;
		map:any = null;
		
		dataClients:any[] = null;
		dataAccounts:any[] = null;
		dataUnits:any[] = null;
		tracking:any[] = null;

		menu:any = null;
		win:any = null;
		
		caption:string = "u";
		winCaption:string = "";
		pathImages:string = "";
		followMe:boolean = false;

		infoTemplate:string = `
                <div class="units-info">
                <div>Placa</div><div>{=plate}</div>
                <div>Marca</div><div>{=brand}</div>
                <div>Modelo</div><div>{=model}</div>
                <div>Color</div><div>{=color}</div>

                <div>Hora</div><div>{=date_time}</div>
                <div>Longitud</div><div>{=longitude}</div>
                <div>Latidud</div><div>{=latitude}</div>
                <div>Velocidad</div><div>{=speed}</div>

                <div>Heading</div><div>{=heading}</div>
                <div>Satellite</div><div>{=satellite}</div>
                <div>Inputs</div><div>{=speed}</div>
                <div>Outputs</div><div>{=speed}</div>




            
            </div>`;
		popupTemplate:string = `<div class="wecar_info">
			<div>{=vehicle_name}</div>
			<div>{=device_name}</div>
			<div>{=brand}: {=model}<br>{=plate}, {=color} </div>
		
			<div>{=latitude}, {=longitude}</div>
		
			<div>Velocidad: {=speed}</div>
		
		</div>`;
		
		public oninfo:Function = (info, name)=>{};
		public delay:number = 30000;
		private main:any = null; 
		private marks:any[] = [];

		private _info:any = null;
		private _winInfo:any = null;
		private _timer:any = null;
		
		private _lastUnitId = null;

		private _traces:any[] = [];
		

		
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
			//return;
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

			
			

		}

		z(){
			alert("z")
			let map = this.map.map;
				
				map.addSource('point2', {
				'type': 'geojson',
				'data': {
				'type': 'FeatureCollection',
				'features': [
				{
				'type': 'Feature',
				'properties':{
					'rotacion':45
				},
				'geometry': {
				'type': 'Point',
				'coordinates': [-69.39274800, 10.07182300]	
				}
				},
				{
					'type': 'Feature',
					'properties':{
						'rotacion':120
					},
					'geometry': {
					'type': 'Point',
					'coordinates': [-69.30074800, 10.06682300]	
					}
					}
				]
				}
				});
				map.addLayer({
				'id': 'points2',
				'type': 'symbol',
				'source': 'point2',
				'layout': {
				'icon-image': 'cat',
				'icon-size': 0.10,
				'icon-rotate':['get','rotacion']
				}
				});
				
		}

		_create(main:any){
			
			this.main = main;

			main.addClass("unit-main");
			
			this.createMenu();
			this._info = $().create("div").addClass("win-units-info");
			//this._info = $().create("div").addClass("win-units-info");
			return;

			this.win = new Float.Window({
                visible:true,
                caption: this.caption,
                child:main,
                left:10,
                top:40,
                width: "300px",
                height: "300px",
                mode:"auto",
                className:["sevian"]
			});
			
			this._winInfo = new Float.Window({
                visible:true,
                caption:"Info",
                child:this._info,
                left:10,
                top:"bottom",
                width: "300px",
                height: "auto",
                mode:"auto",
                className:["sevian"]
			});
			let _info2 = $().create("div").addClass("win-units-info");
			/* OJO
			
			//console.log(this.map)
			let t = new GTTrace({map: this.map.map});
			
			*/


			
			let menu = new Menu({
				caption:"uuuu", 
				autoClose: false,
				target:_info2,
				items: [
					{
						id: 1,
                		caption:"o",
                		action:(item, event) => {
							t.play()
						}
					},
					{
						id: 1,
                		caption:"x",
                		action:(item, event) => {
							t.addPoint()
						}
					},
					{
						id: 3,
                		caption:"z",
                		action:(item, event) => {
							this.z()
						}
					}
				]
			 });
			let _winInfo2 = new Float.Window({
                visible:true,
                caption:"Info 2",
                child:_info2,
                left:"center",
                top:"top",
                width: "300px",
                height: "auto",
                mode:"auto",
                className:["sevian"]
			});
			

			
			

		} 
		
		
        _load(main:any){

		}
		
		init(){

		}

		load(){

		}

		getMap(){
			return this.map;
		}
		setMap(map){
			this.map = map;
		}
		updateTracking(data){
			let unitId;
			n = n + 0.001;
			let a=0, b=0;
			for(let x of data){
				if(Math.floor(Math.random() * 10)>=8){
					a = Math.random()/100;
					b = Math.random()/300;
				}else{
					a = -Math.random()/100;
					b = -Math.random()/300;
				}
				
				
				unitId = x.unit_id;
				this.tracking[unitId].latitude = x.latitude*1.0+a;
				this.tracking[unitId].longitude = x.longitude*1.0+b;
				this.tracking[unitId].heading = x.heading;
				if(this.marks[unitId]){
					this.marks[unitId].setLngLat([this.tracking[unitId].longitude, this.tracking[unitId].latitude]);

					this.marks[unitId].setPopup(this.loadPopupInfo(unitId));
					this.setInfo(unitId);
					
					//let popup = this.evalHTML(this.popupTemplate, this.dataUnits[id]);
					//popup = this.evalHTML(popup, this.tracking[id]);
				}
			}
			if(this.followMe && this._lastUnitId){
				this.panTo(this._lastUnitId);
				this._traces[this._lastUnitId].addPoint([this.tracking[this._lastUnitId].longitude, this.tracking[this._lastUnitId].latitude]);
			
			}
			if(this._traces[unitId]){
			}
		}

		requestFun(xhr){
			let json = JSON.parse(xhr.responseText);
			this.updateTracking(json);

			
		}
		
		play(){
			let map = this.getMap().map;

			map.loadImage(
				'https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png',
				function(error, image) {
				if (error) throw error;
				map.addImage('cat', image);
				map.addSource('point', {
				'type': 'geojson',
				'data': {
				'type': 'FeatureCollection',
				'features': [
				{
				'type': 'Feature',
				'properties':{
					'rotacion':45
				},
				'geometry': {
				'type': 'Point',
				'coordinates': [-69.39874800, 10.06882300]	
				}
				},
				{
					'type': 'Feature',
					'properties':{
						'rotacion':120
					},
					'geometry': {
					'type': 'Point',
					'coordinates': [-69.39674800, 10.06682300]	
					}
					}
				]
				}
				});
				map.addLayer({
				'id': 'points',
				'type': 'symbol',
				'source': 'point',
				'layout': {
				'icon-image': 'cat',
				'icon-size': 0.10,
				'icon-rotate':['get','rotacion']
				}
				});
				}
				);
			

			

			if(this._timer){
				clearTimeout(this._timer);	
			}
			
			this._timer = setInterval(()=>{

				S.send(
					{
					
					async: true,
					panel:2,
					valid:false,
					confirm_: 'seguro?',
					requestFunction: $.bind(this.requestFun, this),
					params:	[
						{
							t:'setMethod',
							id:2,
							element:'gt_unit',
							method:'tracking',
							name:'x',
							eparams:{
								record:{codpersona:16386},
								token:"yanny",
								page:2
							}
						}
				
					]
					

				});

				
			}, this.delay);
		}
		
		createMenu(){
			let infoMenu = [];
			
            for(let x in this.dataClients){
				
                infoMenu[this.dataClients[x].id] = {
                    id: this.dataClients[x].id,
                    caption:this.dataClients[x].client,
                    items:[], 
                    useCheck:true,
					useIcon:false,
					checkValue:x,
					checkDs:{"level":"client","clientId":x},
					ds:{"clientId":x},
					check:(item, event)=>{
						
						this.showAccountUnits(this.dataClients[x].id, event.currentTarget.checked);

					},
                };    
            }
            
            
            for(let x in this.dataAccounts){
                infoMenu[this.dataAccounts[x].client_id].items[this.dataAccounts[x].id] = {
                    id: this.dataAccounts[x].id,
                    caption:this.dataAccounts[x].account,
                    items:[],
					useCheck:true,
					checkValue:x,
					checkDs:{"level":"account","accountId":this.dataAccounts[x].id},
					ds:{"accountId":this.dataAccounts[x].id},
					check:(item, event)=>{
						this.showUnits(this.dataAccounts[x].id, event.currentTarget.checked);

					},
                };
            }

           for(let x in this.dataUnits){
			
            infoMenu[this.dataUnits[x].client_id].items[this.dataUnits[x].account_id].items[this.dataUnits[x].unit_id] = {
                id: this.dataUnits[x].unit_id,
                caption:this.dataUnits[x].vehicle_name,
				useCheck:true,
				value: x,
				checkValue:x,
				checkDs:{"level":"units","unitId":x},
				ds:{"unitId":x},
				check:(item, event)=>{
					this.showUnit(x, event.currentTarget.checked);
				},
                action:(item, event) => {
					let ch = item.getCheck();
					ch.get().checked = true;
					this.showUnit(x, true);
					this._lastUnitId = x;
					this.setInfo(x);
					this.flyTo(x);
						return;
					this._traces[x] = new GTTrace({map:this.map.map});
					
					this._traces[x].play();
					

				}
                
            };
            


           }

           let menu = new Menu({
               caption:"", 
               autoClose: false,
			   target:this.main,
			   items: infoMenu,
			   useCheck:true,
			   check:(item) => {
					let ch = item.getCheck();
					let checked = ch.get().checked;   
					let list = item.queryAll("input[type='checkbox']");
					for(let x of list){
						x.checked = checked;
					}
			   	}
			});
			
			return menu;
			//console.log(check);
		}

		getInfoLayer(){
			
			return this._info;
		}

		showUnit(id, value){
			if(!this.marks[id]){
				
				this.marks[id] = this.getMap().createMark({
					lat:this.tracking[id].latitude,
					lng:this.tracking[id].longitude,
					heading:this.tracking[id].heading,
					image:this.pathImages+this.dataUnits[id].icon+".png",
					popupInfo: this.loadPopupInfo(id)
				});
				
				
			}else{
				this.marks[id].show(value);
			}
		}
		
		showUnits(accountId, value){
			
			let e;

			for(let x in this.dataUnits){
				e = this.dataUnits[x];
				
				if(accountId == e.account_id){
					this.showUnit(x, value);
					
				}
				
			}
		}
		showAccountUnits(clientId, value){
			
			let e;

			for(let x in this.dataUnits){
				e = this.dataUnits[x];
				
				if(clientId == e.client_id){
					this.showUnits(e.account_id, value);
				}
			}
		}
		evalHTML(html, data){

			function auxf(str, p, p2, offset, s){
				return data[p2];
			}
			
			for(let x in data){
				let regex = new RegExp('\(\{=('+x+')\})', 'gi'); 
				html= html.replace(regex, auxf);
			   
			}
			return html;
	
		}
		flyTo(unitId:number){
			if(this.marks[unitId]){
				this.marks[unitId].flyTo();
			}
		}
		panTo(unitId:number){
			if(this.marks[unitId]){
				this.marks[unitId].panTo();
			}
		}
		setInfo(id:number){
			//this._info.text(this.loadInfo(id));
			//this._winInfo.setCaption(this.dataUnits[id].vehicle_name);
			this.oninfo(this.loadInfo(id), this.dataUnits[id].vehicle_name);
		}
		loadPopupInfo(id){
            return this.evalHTML(this.evalHTML(this.popupTemplate, this.dataUnits[id]), this.tracking[id]);
        }

		loadInfo(id){
			let input = "";
			for(let x in this.dataUnits[id].input){
				input += x + ": " +this.dataUnits[id].input[x];
			}
			this.dataUnits[id].input1 = input;

			input = "";
			for(let x in this.dataUnits[id].input){
				input += x + ": " +this.dataUnits[id].input[x];
			}
			this.dataUnits[id].output1 = input;
			
			console.log(this.dataUnits[id])
            return this.evalHTML(this.evalHTML(this.infoTemplate, this.dataUnits[id]), this.tracking[id]);
		}
		
		setFollowMe(value:boolean){
			this.followMe = value;
		}
		getFollowMe(){
			return this.followMe;
		}
	}
	


	return Unit;
})(_sgQuery);