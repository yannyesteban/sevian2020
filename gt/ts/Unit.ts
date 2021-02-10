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
		indexUnit:any[] = [];
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
		public delay:number = 10000;
		
		private main:any = null; 
		private marks:any[] = [];

		private _info:any = null;
		private _winInfo:any = null;
		
		private _timer:any = null;

		private _timer2:any = null;
		public delay2:number = 12000;
		
		private _lastUnitId = null;

		private _traces:any[] = [];
		
		private infoId:string = null;
		private statusId:string = null;
		private _win:any[] = [];

		public showConnectedUnit:boolean = false;
		
		private msgErrorUnit = "Unit not Found!!!";
		private msgErrortracking = "data tracking not Found!!!";
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

			GTMap.load((map, s)=>{
				this.setMap(map);
				//this.play();
				//map.map.addImage('t1', new TraceMarker(map.map, 30), { pixelRatio: 1 });


				
				//map.getControl("mark").onsave = ((info)=>{}
			});
			
			if(this.showConnectedUnit){
				this.play2();
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


		showMenu(){
			this._win["menu-unit"].show();
		}
		showConnected(){
			this._win["status-unit"].show();
		}
		_create(main:any){
			
			this.main = main;

			main.addClass("unit-main");
			
			this.createMenu();

			//this.menu = this.createMenu();
			this._win["menu-unit"] = new Float.Window({
                visible:false,
                caption: this.caption,
                left:10,
                top:100,
                width: "280px",
                height: "250px",
                mode:"auto",
				className:["sevian"],
				child:this.main.get()
			});

			this.statusId = "yasta";
			const _statusUnit = $().create("div").id(this.statusId).addClass("win-status-unit");
			this._win["status-unit"] = new Float.Window({
                visible:this.showConnectedUnit,
                caption: "Conected Units",
                left:10+280+20,
                top:100,
                width: "380px",
                height: "300px",
                mode:"auto",
				className:["sevian"],
				child:_statusUnit.get()
			});


			this._info = $().create("div").addClass("win-units-info");
			//this._info = $().create("div").addClass("win-units-info");

			
			if(this.infoId){
				
				this.oninfo = (info, name) =>{

					S.getElement(this.infoId).setCaption(name);
					S.getElement(this.infoId).setText(info);
				};
				
			}
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
				
				
				
				//this._traces[this._lastUnitId].addPoint([this.tracking[this._lastUnitId].longitude, this.tracking[this._lastUnitId].latitude]);
			
			}

			return;
			if(this._traces[unitId]){
			}
		}

		requestFun(xhr){
			let json = JSON.parse(xhr.responseText);
			this.updateTracking(json);

			
		}
		
		play(){
			let map = this.getMap().map;

			

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

		play2(){
			
			

			if(this._timer2){
				clearTimeout(this._timer2);	
			}
			
			this._timer2 = setInterval(()=>{
				this.showStatusWin();
				

				
			}, this.delay2);
		}
		
		createMenu(){
			//console.log(this.dataUnits);return;
			let info = [];
			let cacheClient = [];
			let cacheAccount = [];
			let clientId = null;
			let accountId = null;
			let unitId = null;
			for(let x in this.dataUnits){

				clientId = this.dataUnits[x].client_id;
				accountId = this.dataUnits[x].account_id;
				unitId = this.dataUnits[x].unit_id;
				this.indexUnit[unitId] = x;
				//console.log(clientId, this.dataUnits[x].client);
				if(!cacheClient[clientId]){
					cacheClient[clientId] = {
						id: clientId,
						caption:this.dataUnits[x].client,
						items:[], 
						useCheck:true,
						useIcon:false,
						checkValue:x,
						checkDs:{"level":"client","clientId":clientId},
						ds:{"clientId":clientId},
						check:(item, event)=>{
							
							this.showAccountUnits(clientId, event.currentTarget.checked);
	
						},
					};
					info.push(cacheClient[clientId]);
				} 

				if(!cacheAccount[accountId]){
					cacheAccount[accountId] = {
						id: accountId,
						caption:this.dataUnits[x].account,
						items:[], 
						useCheck:true,
						useIcon:false,
						checkValue:accountId,
						checkDs:{"level":"account","accountId":accountId},
						ds:{"accountId":accountId},
						check:(item, event)=>{
							
							this.showUnits(accountId, event.currentTarget.checked);
	
						},
					};
					cacheClient[clientId].items.push(cacheAccount[accountId]);
				}

				cacheAccount[accountId].items.push({
					id: this.dataUnits[x].unit_id,
					caption:this.dataUnits[x].vehicle_name,
					useCheck:true,
					value: x,
					checkValue:x,
					checkDs:{"level":"units","unitId":unitId},
					ds:{"unitId":unitId},
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
					
				});


			}

			//console.log(info);
			const menu2 = new Menu({
				caption:"", 
				autoClose: false,
				target:this.main,
				items: info,
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
			//console.log(info);
			return menu2;
			return;

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
			console.log(infoMenu);
			return menu;
			//console.log(check);
		}

		getInfoLayer(){
			
			return this._info;
		}
		showUnit2(unitId, value){
			this.showUnit(this.indexUnit[unitId], value);
		}
		showUnit(id, value){

			if(!this.dataUnits[id]){
				alert(this.msgErrorUnit);
				return;
			}

			const unitId = this.dataUnits[id].unit_id;
			
			if(!this.tracking[unitId]){
				alert(this.msgErrortracking);
				return;
			}
			if(!this.marks[id]){
				
				this.marks[id] = this.getMap().createMark({
					lat:this.tracking[unitId].latitude,
					lng:this.tracking[unitId].longitude,
					heading:this.tracking[unitId].heading,
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
			if(!this.dataUnits[id]){
				return;
			}
			//this._info.text(this.loadInfo(id));
			//this._winInfo.setCaption(this.dataUnits[id].vehicle_name);
			this.oninfo(this.loadInfo(id), this.dataUnits[id].vehicle_name);

			
		}

		getDataInfo(id:number){
			if(!this.dataUnits[id]){
				return;
			}
			let data = this.dataUnits[id];
			const tracking = this.tracking[data.unit_id];
			for(let x in tracking){
				this.dataUnits[id][x] = tracking[x];
			}
			return data;
		}
		loadPopupInfo(id:number){
			const data = this.getDataInfo(id);

					
			
			data.input1 = " -";
			data.output1 = " -";
			if(data.input){
				let _input = $.create("div");
				data.input.forEach((e, index)=>{
					_input.create("div").text(e.name+":"+e.value);
					//_input.add("div").text(e.value);
				});
				data.input1 = _input.text();
			}
			
			if(data.output){
				let _input = $.create("div");
				data.output.forEach((e, index)=>{
					_input.create("div").text(e.name+":"+e.value);
					//_input.add("div").text(e.value);
				});
				data.output1 = _input.text();
			}
			
			
			return this.evalHTML(this.popupTemplate, data)
            //return this.evalHTML(, this.tracking[this.dataUnits[id].unit_id]);
        }

		loadInfo(id:number){
			
			if(!this.dataUnits[id]){
				return;
			}

			const data = this.getDataInfo(id);
			
			
			data.input1 = " -";
			data.output1 = " -";
			if(data.input){
				let _input = $.create("div");
				data.input.forEach((e, index)=>{
					_input.create("div").text(e.name+":"+e.value);
					//_input.add("div").text(e.value);
				});
				data.input1 = _input.text();
			}
			
			if(data.output){
				let _input = $.create("div");
				data.output.forEach((e, index)=>{
					_input.create("div").text(e.name+":"+e.value);
					//_input.add("div").text(e.value);
				});
				data.output1 = _input.text();
			}
			
	
			return this.evalHTML(this.infoTemplate, data)
            //return this.evalHTML(this.evalHTML(this.infoTemplate, this.dataUnits[id]), this.tracking[this.dataUnits[id].unit_id]);
		}
		
		setFollowMe(value:boolean){
			this.followMe = value;
		}
		getFollowMe(){
			return this.followMe;
		}


		showStatusWin(){
			S.send3({
                "async":1,
				
				"params":[
                    
                    {
                        "t":"setMethod",
                        'mode':'element',
						"id":this.statusId,
						"element":"form",
						"method":"list",
						"name":"/form/status_unit",
						"eparams":{"mainId":this.statusId}

                    }
                ],
                onRequest:(x)=>{
                    
                }
			});
		}


		findUnit(unitId:number){
			const index = this.indexUnit[unitId];
			
			this.showUnit(index, true);
			this.setInfo(index);
			this.flyTo(index);
		}
	}
	


	return Unit;
})(_sgQuery);