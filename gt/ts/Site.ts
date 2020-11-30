
var GTSite = (($) => {
   
	let n=0;

    class Site{
		
		id:any = null;
		map:any = null;
		mode:number = 0;
		tempPoly:any = null;

		formId:any = null;
		images:string[] = [];
		dataCategory:any[] = null;
		dataAccounts:any[] = null;
		dataSite:any[] = null;
		tracking:any[] = null;

		menu:any = null;
		win:any = null;
		form:any = null;
		
		caption:string = "u";
		winCaption:string = "";
		pathImages:string = "";
		followMe:boolean = false;

		tag="Yanny Esteban";

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
			<div>{=name}</div>
			<div>{=device_name}</div>
			<div>{=brand}: {=model}<br>{=plate}, {=color} </div>
		
			<div>{=latitude}, {=longitude}</div>
		
			<div>Dirección: {=speed}</div>
		
		</div>`;
		
		
		public oninfo:Function = (info, name)=>{};
		public delay:number = 30000;

		public onSave:Function = info => {};
		public onEdit:Function = info => {};
		private main:any = null; 
		private marks:any[] = [];

		private _info:any = null;
		private _winInfo:any = null;
		private _timer:any = null;
		
		private _lastUnitId = null;

		private _traces:any[] = [];
		
		private editId:number = null;
		private lastId:number = null;

		private _form:any = null;

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
                
                if(main.ds("gtSite")){
                    return;
                }
    
                if(main.hasClass("gt-site")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
			}

			
			

		}

		_create(main:any){
			
			this.main = main;

			main.addClass("site-main");
			
			this.menu = this.createMenu();
			this.createForm(this.form);
			this._info = $().create("div").addClass("win-sites-info");
			return;
			const xx = $().create("form").id("yan124");
			xx.text("Hoooooooola");
			const win = new Float.Window({
                visible:true,
                caption: "Site IIs",
                child:xx,
                left:300,
                top:100,
                width: "400px",
                height: "500px",
                mode:"auto",
				className:["sevian"],
				
			});

			this.loadSite2();
		} 
		
		loadSite2(){
            //let unitId = this.form.getInput("unit_idx").getValue();

			//let f  = this.form.getFormData();
			
			const nameId = "yan124"; 
            S.send3({
                "async":1,
                //"form":f,
                //id:4,
                
				
				"params":[
                    
                    {
                        "t":"setMethod",
                        'mode':'element',
						"id":nameId,
						"element":"form",
						"method":"request",
						"name":"/form/site2",
						"eparams":{
							"a":'yanny',
                            "mainId":nameId,
                            "unitId":5555555,
						}

                    }
                ],
                onRequest:(x)=>{
                    //S.getElement(this.commandPanelId).setContext(this);
                    S.getElement(nameId).setContext(this);
                    
                }
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
			
			map.getControl("mark").onsave = ((info)=>{
				this.loadForm(info);
				map.getControl("mark").stop();
				this.onSave(info);
			});
			
			this.map = map;
		}
		start(){
			this.map.getControl("mark").play();
		}

		update(info){
			this.getForm().setValue(info).setMode('update');
			this.getForm().getInput("__mode_").setValue(2);
			this.getForm().getInput("__id_").setValue(0);


			this.dataSite[info.id] = info;
			this.updateMark(info.id);
		}
		updateMark(id){
			
			if(!this.menu.getByData("category-id", this.dataSite[id].category_id)){
				
				console.log(this.dataCategory)
				this.menu.add({
					id: this.dataSite[id].category_id,
					caption: this.dataCategory.find(e => {return e.id==this.dataSite[id].category_id;}).category,
					items:[], 
					useCheck:true,
					useIcon:false,
					checkValue:id,
					checkDs:{"level":"category","categoryId":this.dataSite[id].category_id},
					ds:{"categoryId":this.dataSite[id].category_id},
					check:(item, event)=>{
						
						//this.showAccountUnits(this.dataClients[x].id, event.currentTarget.checked);

					},
				});

				
			}
			if(this.marks[id]){
				let m = this.menu.getByData("category-id", this.dataSite[id].category_id);
				let item = this.menu.getByValue(id);
				console.log(item.get())
				if(!m.getMain().contains(item)){
					m.append(item);//getChild().get().appendChild(item.get());
				}
				


				this.getMap().delete("site-"+id);
				delete this.marks[id];
				//let menu = this.menu.get().query(".item[data-site-id='"+id+"'] .text");
				
				item.getCaption().text(this.dataSite[id].name);
				//$(menu).text(this.dataSite[id].name);
				//item = this.menu.getByData("site-id", 19221);
				//item.getCaption().text(this.dataSite[id].name+"...");
			}else{
				let m = this.menu.getByData("category-id", this.dataSite[id].category_id).getMenu();

				let info = {
					id: this.dataSite[id].id,
					caption:this.dataSite[id].name,
					useCheck:true,
					value: id,
					checkValue:id,
					checkDs:{"level":"sites","siteId":id},
					ds:{"siteId":id},

					infoElement:$.create("span").addClass("site-edit").on("click",()=>{this.edit(this.dataSite[id].id);}),
					check:(item, event)=>{
						this.showSite(id, event.currentTarget.checked);
					},
					action:(item, event) => {
						let ch = item.getCheck();
						
						ch.get().checked = true;
						this.showSite(id, true);
						this._lastUnitId = id;
						this.setInfo(id);
						this.flyTo(id);
	
					}
					
				};

				m.add(info);
			}
			
			
			
			this.showSite(id, true);
			

		}
		

		requestFun(xhr){
			
			let json = JSON.parse(xhr.responseText);
			this.createForm(json);
			let id = this.editId;
			this.showSite(id, false);
			this.map.getControl("mark").play({
				defaultImage:this.dataSite[id].image,
				defaultCoordinates:[this.dataSite[id].longitude*1, this.dataSite[id].latitude*1],
				onstop: ()=>{
					this.showSite(id, true);
					this.editId = null;
				}
			});

			
		}
		
		play(){
		}
		
		createMenu(){
			
			let category = {};
			let cat = [];
			let catId = null;
			
			this.dataCategory.forEach(e => {
				category[e.id] = e.category;
			});
			
			let menu = new Menu({
				
				autoClose: false,
				target:this.main,
				items: [],
				type:"accordion",
				useCheck:true,
				subType:"",
			});
			
			for(let x in this.dataSite){
				
				catId = this.dataSite[x].category_id;

				if(!cat[catId]){
					cat[catId] = menu.add({
						id: catId,
						caption: category[catId],
						items:[], 
						useCheck:true,
						useIcon:false,
						checkValue:x,
						checkDs:{"level":"category","categoryId":catId},
						ds:{"categoryId":catId},
						check:(item, event)=>{
							
							//this.showAccountUnits(this.dataClients[x].id, event.currentTarget.checked);
	
						},
					}).getMenu();
				}

				cat[catId].add({
					id: this.dataSite[x].id,
					caption:this.dataSite[x].name,
					useCheck:true,
					value: x,
					checkValue:x,
					checkDs:{"level":"sites","siteId":x},
					ds:{"siteId":x},
					infoElement:$.create("span").addClass("site-edit").on("click",()=>{this.edit(this.dataSite[x].id);}),
					check:(item, event)=>{
						this.showSite(x, event.currentTarget.checked);
					},
					action:(item, event) => {
						let ch = item.getCheck();
						ch.get().checked = true;
						this.showSite(x, true);
						this._lastUnitId = x;
						this.setInfo(x);
						this.flyTo(x);
						
	
					}
					
				});
			}


			return menu;

		}

		createForm(info){
			
			if(this._form){
				this._form.delete();
				
			}
			info.parentContext = this;
			info.id = this.formId;
			
			this._form = new Form2(info);
			
		}

		getForm(){
			return this._form;
		}

		loadForm(info){
			
			if(this.editId === null){
			
				this._form.reset();
			}else{
				this.marks[this.editId].setLngLat(info.coordinates);
				this.marks[this.editId].setImage(info.image);
			}
			
			this._form.setValue({
				image:info.image,
				longitude:info.coordinates[0],
				latitude:info.coordinates[1],
			});
		}

		new(info){
			console.log(info)
			this._form.setValue({
				icon_id:info.image,
				longitude:info.coordinates[0],
				latitude:info.coordinates[1],
			});


		}
		getInfoLayer(){
			
			return this._info;
		}

		showSite(id, value){
			
			if(!this.marks[id]){
				
				/*
				this.marks[id] = this.getMap().createMark({
					lat:this.dataSite[id].latitude,
					lng:this.dataSite[id].longitude,
					heading:0,//this.tracking[id].heading,
					image:this.pathImages+this.dataSite[id].icon+".png",
					popupInfo: this.loadPopupInfo(id)
				});
				*/
				this.marks[id] = this.getMap().draw("site-"+id, 'mark',
            {
                coordinates:[this.dataSite[id].longitude, this.dataSite[id].latitude],
                height: 30,
				image: this.dataSite[id].image,
				popupInfo: this.loadPopupInfo(id)
                
            });
				
			}else{
				db (id, "white","blue")
				this.marks[id].setVisible(value);
			}
		}
		
		showUnits(accountId, value){
			
			let e;

			for(let x in this.dataSite){
				e = this.dataSite[x];
				
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

		edit(id){

			this.editId = id;

			S.send({
				"async": true,
				"panel":"2",
				"valid":false,
				"confirm_": "seguro?",
				"requestFunction":$.bind(this.requestFun, this),
				"params":[
					{
						"t":"setMethod",
						"id":"0",
						"element":"gt-site",
						"method":"site-load",
						"name":"",
						"eparams":{
							"siteId":id
						}
					}
			
				]});
			this.onEdit(id);
			
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
		flyTo(unitId:any){
			if(this.marks[unitId]){
				this.marks[unitId].flyTo();
			}
		}
		panTo(unitId:any){
			if(this.marks[unitId]){
				this.marks[unitId].panTo();
			}
		}
		setInfo(id:any){
			//this._info.text(this.loadInfo(id));
			//this._winInfo.setCaption(this.dataUnits[id].vehicle_name);

			this.oninfo(this.loadInfo(id), this.dataSite[id].name);
		}
		loadPopupInfo(id){
            return this.evalHTML(this.popupTemplate, this.dataSite[id]);
        }

		loadInfo(id){
            return this.evalHTML(this.infoTemplate, this.dataSite[id]);
		}
		
		setFollowMe(value:boolean){
			this.followMe = value;
		}
		getFollowMe(){
			return this.followMe;
		}
		setImage(id, image){
			//let image = "http://localhost/sevian2020/images/sites maison - _viii_256.png";
			let re = /(?:\w|\s|\.|-)*(?=.png|.jpg|.svg)/gim;
			//myRe = /\w+/
			let result = re.exec(image);
			
			this.dataSite[id].icon = result[0];
			//this.image = e;
            this.marks[id].setImage(this.pathImages+this.dataSite[id].icon+".png");
		}
		moveTo(id, coordinates){
			this.dataSite[id].longitude = coordinates[0];
			this.dataSite[id].latitude = coordinates[1];
			this.marks[id].setLngLat(coordinates);
		}
	}
	


	return Site;
})(_sgQuery);