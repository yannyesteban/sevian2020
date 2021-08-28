import { _sgQuery as $, SQObject } from '../../Sevian/ts/Query.js';
import { Map, MapApi, MapControl } from './Map.js';
//import {Form2 as Form2} from './Form2.js';
import { Menu as Menu } from '../../Sevian/ts/Menu2.js';
import { Float } from '../../Sevian/ts/Window.js';
import { S } from '../../Sevian/ts/Sevian.js';
import { Trace } from '../../lib/Trace.js';
import { Mark } from '../../lib/Mark';
import { TraceControl } from '../../lib/TraceControl.js';
import { TraceTool } from './TraceTool.js';
import { InfoForm } from '../../Sevian/ts/InfoForm.js';

import { LayerMenu } from './LayerMenu.js';

import { GTInfo } from '../../GT/ts/Info.js';

import { Cluster } from '../../lib/Cluster.js';

import { InfoComm, InfoMenu, InfoUnits } from './InfoMenu.js';

const evalInputs = (data) => {

	let xInputs = "";
	let xOutputs = "";


	if (typeof data.iInputs === "string") {
		data.iInputs = JSON.parse(data.iInputs);
	}

	data.iInputs.forEach(element => {
		return;
		const div = `<div data-input-id="${element.id}" data-input-value="${element.on}"><span>${element.name}</span><span>${element.value}</span></div>`;
		if (element.type === "i") {
			xInputs += div;
		} else {
			xOutputs += div;
		}

	});


	data.xInputs = xInputs;
	data.xOutputs = xOutputs;

	return data;
}

class Mobil {
	public data: any = null;
	private name: Mark = null;
	private mark: Mark = null;
	private latitude: number = 0;
	private longitude: number = 0;
	private heading: number = 0;
	private image: string = "";
	private trace: Trace = null;
	private traceInfo: any = {};
	private popupInfo: string = "";
	private visible: boolean = false;
	private valid: boolean = false;
	private infoForm: typeof InfoForm = null;
	private infoFormMain: InfoForm = null;
	private propertysInfo: any[] = [];
	private maxDelay: number = 200;
	private followMe: boolean = false;
	private trackingData: any[] = [];
	public connected: number = 0;
	private traceActive: boolean = false;


	public onValid: (value: boolean) => void = (value) => { };
	public onFollow: (value: boolean) => void = (value) => { };
	public onVisible: (value: boolean) => void = (value) => { };
	public onTrace: (value: boolean) => void = (value) => { };

	static map = null;


	static setMap(map) {
		Mobil.map = map;
	}
	constructor(info?) {

		for (var x in info) {
			if (this.hasOwnProperty(x)) {
				this[x] = info[x];
			}
		}

		this.infoFormMain = new InfoForm(this.infoForm);

		this.mark = Mobil.map.createMark({
			latitude: this.latitude,
			longitude: this.longitude,
			heading: this.heading,
			image: this.image,
			popupInfo: this.infoFormMain.get(),
			visible: this.visible
		});

		this.createTrace(this.traceInfo);

		

	}

	
	createTrace(info) {


		const infoForm = new InfoForm(info.infoTrace);
		this.trace = new Trace({
			//data:tracking,
			map: Mobil.map.map,
			layers: info.layers,
			propertysInfo: this.propertysInfo,
			popupInfo: infoForm.get(),
			onShowInfo: (info) => {
				const data = Object.assign({}, this.data);
				Object.assign(data, info);

				//info = evalInputs(info);
				if (typeof data.inputs === "string") {
					data.inputs = JSON.parse(data.inputs);
				}
				if (typeof data.outputs === "string") {
					data.outputs = JSON.parse(data.outputs);
				}
				infoForm.setData(data);

			}

		});
	}

	deleteTrace() {
		this.trace.delete();
		this.traceActive = false;
	}

	getTrace() {
		return this.trace;
	}

	initTrace(trackingData?) {
		if (trackingData) {
			this.trackingData = trackingData;
		}

		this.trace.init(this.trackingData);
		this.traceActive = true;
	}

	addTracking(tracking) {

		this.setValid(true);

		if (this.trace.isActive()) {

			this.trackingData.push(tracking);
			this.trace.setData(this.trackingData);
		}
	}

	setPosition(info) {
		this.longitude = info.longitude || 0;
		this.latitude = info.latitude || 0;

		this.mark.setLngLat([this.longitude, this.latitude]);
		this.mark.setHeading(info.heading || 0);
		//this.mark.setPopup(info.popupInfo || "");
		if (info.visible) {
			this.mark.show(info.visible);
		}
		if (info.image) {

		}

		return this;

	}
	setInfo(info) {
		
		this.infoFormMain.setData(info);
		return this;
	}
	flyTo() {
		this.mark.flyTo();
		return this;
	}
	show(value) {
		this.visible = value;
		this.mark.show(value);
		return this;
	}
	setVisible(value: boolean) {
		this.visible = value;
		this.mark.show(value);
		this.onVisible(value);
		return this;
	}
	getVisible() {
		return this.visible;
	}
	panTo() {
		this.mark.panTo();
		return this;
	}
	getValid() {
		return this.valid;
	}
	setValid(value: boolean) {
		this.valid = value;
		this.onValid(value);
	}
	getName() {
		return this.name;
	}
	getInfoForm() {
		return this.infoFormMain;
	}
	getCoordinates() {
		return [this.longitude, this.latitude];
	}
	getFollow() {
		return this.followMe;
	}
	setFollow(value: boolean) {
		this.followMe = value;
		this.onFollow(value);
	}
	cutTrace() {
		if (this.trace.isActive() && this.maxDelay) {
			let length = this.trackingData.length;
			const time = Math.trunc(Date.now() / 1000);
			this.trackingData = this.trackingData.filter((e) => (time - e.ts) < this.maxDelay);
			if (length != this.trackingData.length) {
				this.trace.setData(this.trackingData);
			}
		}
	}
	getData(){
		return this.data;
	}
	setData(data){
		this.data = data;
	}
	isTraceActive(){
		return this.traceActive;
	}
}

export class Unit {

	id: any = null;
	map: any = null;

	private units: { [key: number]: Mobil } = {};
	private mapName: string = null;
	private traceControl: TraceControl = null;

	private infoForm: any = null;
	private infoFormMain: InfoForm = null;
	private infoPopup: any = null;
	private infoTrace: any = null;
	private infoPopupMain: any = null;

	private delay: number = 5000;
	private traceDelay: number = 20000;

	private timer: number = null;
	private traceTimer: number = null;
	private propertysInfo: any[] = [];
	private traceTool: TraceTool = null;


	dataClients: any[] = null;
	dataAccounts: any[] = null;
	dataUnits: any[] = null;
	indexUnit: any[] = [];
	tracking: any[] = null;
	history: any[] = null;
	traceConfig: any = null;
	menu: any = null;
	win: any = null;

	private infoInput: any = {};
	private unitInputs: any = {};

	caption: string = "u";
	winCaption: string = "";
	pathImages: string = "";
	followMe: boolean = false;

	infoTemplate: string = ``;
	popupTemplate: string = ``;

	public onInfoUpdate: Function = (info, name) => { };


	private main: any = null;
	private marks: any = {};

	private _info: any = null;
	private _winInfo: any = null;

	private _timer: any = null;

	private _timer2: any = null;
	public delay2: number = 12000;

	private _lastUnitId: number = null;

	private _traces: any[] = [];

	private infoId: string = null;
	private statusId: string = null;
	private _win: any[] = [];

	public showConnectedUnit: boolean = false;

	private msgErrorUnit = "Unit not Found!!!";
	private msgErrortracking = "data tracking not Found!!!";


	private searchUnitId: any = null;
	private searchUnit: any = null;
	
	private winStatus:any = null; 
	private statusInfo: InfoUnits = null;
	
	public onGetPosition: (unitId:number) => void = (unitId:number) => { };
	public onReset: (unitId:number) => void = (unitId:number) => { };
	public onCall: (unitId:number) => void = (unitId:number) => { };

	static _instances: object[] = [];



	static getInstance(name) {
		return Unit._instances[name];
	}

	constructor(info) {

		for (var x in info) {
			if (this.hasOwnProperty(x)) {
				this[x] = info[x];
			}
		}

		//return;
		let main = (this.id) ? $(this.id) : false;

		if (main) {

			if (main.ds("gtUnit")) {
				return;
			}

			if (main.hasClass("gt-unit")) {
				this._load(main);
			} else {
				this._create(main);
			}

		} else {
			main = $.create("div").attr("id", this.id);

			this._create(main);
		}

		Map.load(this.mapName, (mapApi: MapApi, map) => {

			Mobil.setMap(mapApi);
			this.setMap(map);

			this.dataUnits.forEach((info) => {

				//const tracking = this.tracking.find(e => e.unitId == info.unitId) || {};

				const propertys = {};

				this.propertysInfo.forEach((e) => {
					propertys[e.name] = e;
				});
				this.units[info.unitId] = new Mobil({
					data: info,
					name: info.vehicle_name,
					latitude: info.latitude || 0,
					longitude: info.longitude || 0,
					heading: info.heading || 0,
					image: info.image,
					popupInfo: "this.loadPopupInfo(info)" + info.unitId,
					visible: false,
					infoForm: this.infoPopup,
					valid: info.valid,
					propertysInfo: propertys,
					traceInfo: {
						layers: this.traceConfig.layers,
						infoTrace: this.infoTrace,
					},
					onValid: (valid) => {
						const ele = $.query(`.sg-menu .item[data-unit-id="${info.unitId}"] `);
						$(ele).ds("valid", (valid) ? "1" : "0");
						this.traceTool.validUnit(info.unitId, valid);
					},
					onVisible: (value) => {
						const ele = $.query(`.sg-menu .item[data-unit-id="${info.unitId}"] input[type="checkbox"] `);
						$(ele).attr("checked", value);
					}
				});


			});



			if (this.infoForm) {
				this.infoForm.onSetData=(data=>{
					const e = this.infoFormMain.getMain().query(`input[type="checkbox"][data-trace]`);
					console.log(e)
					if(e){
						$(e).on("click", (event)=>{
							this.playTrace(data.unitId, event.currentTarget.value);
						})
					}

				});

				this.infoFormMain = new InfoForm(this.infoForm);
				

				if (this.infoId) {
					const winInfo: GTInfo = S.getElement(this.infoId) as GTInfo;

					const div = $.create("div").addClass("info-main");
					
					const body = div.create("div").addClass("info-body");
					const menu = div.create("div").addClass("info-menu");

					const traceCHK = menu.create("input").prop({type:"checkbox"});
					menu.create("span").text("Activar Traza");
					
					const followCHK = menu.create("input").prop({type:"checkbox"});
					menu.create("span").text("Seguir");
					
					
					const b1 = menu.create("button").prop({type:"button", "value":"2", "title":"Get Position"}).text("P")
					.on("click", event=>{
						this.onGetPosition(event.currentTarget.value);
					});
					
					const b2 = menu.create("button").prop({type:"button", "value":"3", "title":"Reboot"}).text("R")
					.on("click", event=>{
						this.onReset(event.currentTarget.value);
					});

					const b3 = menu.create("button").prop({type:"button", "value":"4", "title":"Callback"}).text("C")
					.on("click", event=>{
						this.onCall(event.currentTarget.value);
					});

					traceCHK.on("change", event=>{
						this.playTrace(event.currentTarget.value, event.currentTarget.checked);
						
					});
					followCHK.on("change", event =>{
						this.setFollowMe(event.currentTarget.value, event.currentTarget.checked);
					});

					//winInfo.setBody(div.get());

					this.onInfoUpdate = (info, name) => {


						traceCHK.ds("trace", info.unitId);
						followCHK.ds("follow", info.unitId);
						traceCHK.value(info.unitId);
						followCHK.value(info.unitId);
						
						b1.value(info.unitId);
						b2.value(info.unitId);

						traceCHK.get().checked = this.units[info.unitId].isTraceActive();
						followCHK.get().checked = this.units[info.unitId].getFollow();
						

						//this.infoFormMain.setMode(info.className);
						this.infoFormMain.setData(info);

						winInfo.setCaption(name);
						this.infoFormMain.setMode("xxxx");

						//winInfo.setBody(this.infoFormMain.get());
						body.append(this.infoFormMain.get());
						winInfo.setBody(div.get());
						
					};

				}
			}

			this.play();

			this.initTraceControl();
			//this.playTrace();

			//map.map.addImage("t1", new TraceMarker(map.map, 30), { pixelRatio: 1 });
			return;
			


		});

		if (this.showConnectedUnit) {
			this.play2();
		}


	}




	showMenu() {
		this._win["menu-unit"].show();
	}
	showConnected() {
		this._win["status-unit"].show();
	}
	_create(main: any) {

		this.main = main;



		this.searchUnit = S.getElement(this.searchUnitId);

		main.addClass("unit-main");

		this.createMenu();


		this.statusInfo = new InfoUnits({
            onread: (info) => {
                if (info.id) {
                    this.setUnit(info.id);
                }
                //const counts = this.getInfoWin(2).getCounts();
                //infoMenu.updateType(1, counts[info.type] || "");
                this.showUnit3(info.id);


                
            },
            onadd: (info) => {

                //this._win["status-unit"].setCaption("Conected Units [ "+(this._infoWin2.getCounts()*1)+" ]");
            }
        });

		this.winStatus.child =  this.statusInfo.get();
		this._win["status"] = new Float.Window(this.winStatus);

		//this.menu = this.createMenu();
		this._win["menu-unit"] = new Float.Window({
			visible: true,
			caption: this.caption,
			left: 10,
			top: 100,
			width: "280px",
			height: "250px",
			mode: "auto",
			className: ["sevian"],
			child: this.main.get()
		});

		this.statusId = "yasta";
		const _statusUnit = $().create("div").id(this.statusId).addClass("win-status-unit");
		this._win["status-unit"] = new Float.Window({
			visible: this.showConnectedUnit,
			caption: "Conected Units",
			left: 10 + 280 + 20,
			top: 100,
			width: "380px",
			height: "300px",
			mode: "auto",
			className: ["sevian"],
			child: _statusUnit.get()
		});


		this._info = $().create("div").addClass("win-units-info");
		//this._info = $().create("div").addClass("win-units-info");




	}


	_load(main: any) {

	}

	init() {

	}

	setUnit(info: any) {
		if (!this.units[info.unitId]) {
			this.units[info.unitId] = new Mobil(info);
		}
	}

	load() {

	}

	getMap() {
		return this.map;
	}
	setMap(map) {
		this.map = map;
	}

	updateUnit(tracking) {
		const unitId = tracking.unitId;
		/*
		const index: number = this.tracking.findIndex(e => e.unitId == unitId);

		if (index >= 0) {
			this.tracking[index] = tracking;
		}
		*/
		if (this.units[unitId]) {

			this.units[unitId].addTracking(tracking);
			this.units[unitId].setPosition({
				longitude: tracking.longitude,
				latitude: tracking.latitude,
				heading: tracking.heading
			}).setInfo(this.getUnitInfo(unitId));

		}

		if (this._lastUnitId === unitId) {
			this.onInfoUpdate(this.getUnitInfo(unitId), this.units[unitId].getName());
		}

		if (this.followMe) {
			this.flyTo();
		}
	}

	updateTracking(data) {

		for (let unitId in this.units) {
			this.units[unitId].cutTrace();
		}
		if (data === undefined) {
			return;
		}


		

		
       
       
		let sum = 0;

		data.connected.forEach((tracking)=>{
			this.units[tracking.unitId].data.connected = tracking.connected;
			

			//this.lastDate = e.last_date;
            this.statusInfo.add({
                id: tracking.unitId,
                name: this.units[tracking.unitId].getName(),
                delay: 0,
                type: 10,
                device_name: this.units[tracking.unitId].data.device_name,
                message: tracking.str_status,
                connected : tracking.connected
            });
            if(tracking.connected > 0){
                sum++;
            }
		});


		this._win["status"].setCaption("Conected Units: [ "+(sum)+" ]");

		data.tracking2.forEach((tracking, i) => {
			
			this.units[tracking.unitId].data = Object.assign(this.units[tracking.unitId].data, tracking);
			this.updateUnit(tracking) ;
			/*
			if (tracking.tracking_id) {
				console.log(tracking);
				
			}else{
				console.log("NOOOOOO");
				
			}
			*/

		});

		return;

		

		data.conected.forEach((item: { unit_id: number, connected: number }, i) => {

			this.units[item.unit_id].connected = item.connected;

		});
		data.tracking.forEach((tracking, i) => {
			//this.trace.add(element);
			const unitId = tracking.unitId;
			const index: number = this.tracking.findIndex(e => e.unitId == unitId);

			if (index >= 0) {
				this.tracking[index] = tracking;
			}

			if (this.units[unitId]) {

				this.units[unitId].addTracking(tracking);
				this.units[unitId].setPosition({
					longitude: tracking.longitude,
					latitude: tracking.latitude,
					heading: tracking.heading
				}).setInfo(this.getUnitInfo(unitId));

			}

			if (this._lastUnitId === unitId) {
				this.onInfoUpdate(this.getUnitInfo(unitId), this.units[unitId].getName());
			}

			if (this.followMe) {
				this.flyTo();
			}




		});



	}

	play() {

		//return;
		//console.log(this.map.map.map)
		/*
		const cluster = new Cluster({ map: this.map.map.map });
		cluster.init();
		*/
		if (this.timer) {
			window.clearTimeout(this.timer);
		}

		this.timer = setInterval(() => {

			S.go({
				async: true,
				valid: false,

				requestFunction: (json) => {
					//console.log(json)
					//cluster.updateSource(json);
					this.updateTracking(json)
				},
				params: [
					{
						t: "setMethod",
						id: this.id,
						element: "gt_unit",
						method: "tracking",
						name: "x",
						eparams: {}
					}
				]
			});
		}, this.delay);
	}

	stop() {
		if (this.timer) {
			window.clearTimeout(this.timer);
		}
	}



	updateTrace(xhr: any) {

		let json = JSON.parse(xhr.responseText);
		

		//this.updateTraceLayer(json);
		//this.stopTrace();
		//this.traceDelay = 60000000;
		//this.playTrace();
	}

	stopTrace() {
		if (this.traceTimer) {
			window.clearTimeout(this.traceTimer);
		}
	}
	playTrace(unitId: number, value?: boolean) {

		if (value === false) {

			this.units[unitId].deleteTrace();
			return;
		}

		S.go({
			async: true,
			requestFunction: (tracking: any) => {
				this.units[unitId].initTrace(tracking);
				this.units[unitId].setVisible(true);

				const checkInfo = $(document).query(`input[type="checkbox"][data-trace="${unitId}"]`);
				if(checkInfo){
					
					checkInfo.checked = value;
				}

				this.traceTool.setTraceCheck(unitId, value);
			},
			params: [
				{
					t: "setMethod",
					id: this.id,
					element: "gt_unit",
					method: "trace",
					name: '',
					eparams: {
						unitId: unitId
					}
				}
			]
		});
	}

	createMenu() {
		//console.log(this.dataUnits);return;
		let infoMenu = [];
		let cacheClient = [];
		let cacheAccount = [];

		this.dataUnits.forEach((info, index) => {
			const clientId = info.client_id;
			const accountId = info.account_id;
			const unitId = info.unitId;

			//console.log(clientId, this.dataUnits[x].client);
			if (!cacheClient[clientId]) {
				cacheClient[clientId] = {
					id: clientId,
					caption: info.client,
					items: [],
					useCheck: true,
					useIcon: false,
					checkValue: index,
					checkDs: { "level": "client", "clientId": clientId },
					ds: { "clientId": clientId },
					check: (item, event) => {

						this.showAccountUnits(clientId, event.currentTarget.checked);

					},
				};
				infoMenu.push(cacheClient[clientId]);
			}

			if (!cacheAccount[accountId]) {
				cacheAccount[accountId] = {
					id: accountId,
					caption: info.account,
					items: [],
					useCheck: true,
					useIcon: false,
					checkValue: accountId,
					checkDs: { "level": "account", "accountId": accountId },
					ds: { "accountId": accountId },
					check: (item, event) => {

						this.showUnits(accountId, event.currentTarget.checked);

					},
				};
				cacheClient[clientId].items.push(cacheAccount[accountId]);
			}

			cacheAccount[accountId].items.push({
				id: unitId,
				caption: info.vehicle_name,
				useCheck: true,
				value: index,
				checkValue: index,

				checkDs: { "level": "units", "unitId": unitId },
				ds: { "unitId": unitId, "valid": info.valid },
				check: (item, event) => {
					this.showUnit(unitId, event.currentTarget.checked);
				},
				action: (item, event) => {
					let ch = item.getCheck();
					ch.get().checked = true;


					if (this.units[unitId].getValid()) {
						this.units[unitId].setInfo(this.getUnitInfo(unitId));
						this.units[unitId].show(true);
						this.units[unitId].flyTo();
						this._lastUnitId = unitId;
						//this.playTrace(unitId);

					} else {
						new Float.Message({
							"caption": this.units[unitId].getName(),
							"text": this.msgErrortracking,
							"className": "",
							"delay": 3000,
							"mode": "",
							"left": "center",
							"top": "top"
						}).show({});
						//alert(this.msgErrortracking);
					}
					this._lastUnitId = unitId;
					this.onInfoUpdate(this.getUnitInfo(unitId), info.vehicle_name);
					//this.setInfo(unitId);
				}

			});
		});

		return new Menu({
			caption: "",
			autoClose: false,
			target: this.main,
			items: infoMenu,
			useCheck: true,
			check: (item) => {
				let ch = item.getCheck();
				let checked = ch.get().checked;
				let list = item.queryAll(`input[type="checkbox"]`);
				for (let x of list) {
					x.checked = checked;
				}
			}
		});;

	}

	getInfoLayer() {

		return this._info;
	}
	showUnit2(unitId, value) {
		this.showUnit(this.indexUnit[unitId], value);
	}
	showUnit(unitId, value) {

		if (this.units[unitId]) {
			this.units[unitId].show(value);
			return;
		}
		//alert(this.msgErrorUnit);
	}

	showUnits(accountId, value) {

		let e;

		for (let x in this.dataUnits) {
			e = this.dataUnits[x];

			if (accountId == e.account_id) {
				this.showUnit(x, value);

			}

		}
	}
	showAccountUnits(clientId, value) {

		let e;

		for (let x in this.dataUnits) {
			e = this.dataUnits[x];

			if (clientId == e.client_id) {
				this.showUnits(e.account_id, value);
			}
		}
	}
	evalHTML(html, data) {

		function auxf(str, p, p2, offset, s) {
			return data[p2];
		}

		for (let x in data) {
			let regex = new RegExp('\(\{=(' + x + ')\})', "gi");
			html = html.replace(regex, auxf);

		}
		return html;

	}
	flyTo() {

		let coordinates = [];

		for (let x in this.units) {
			if (this.units[x].getValid() && this.units[x].getVisible() && this.units[x].getFollow()) {
				coordinates.push(this.units[x].getCoordinates());
			}
		}

		if (coordinates.length > 0) {
			this.map.getControl().boundTo(coordinates);
		}

	}

	panTo(unitId: number) {

		if (this.marks[unitId]) {

			this.marks[unitId].panTo();
		}
	}


	getUnitInfo(unitId: number) {
		
		return this.units[unitId].data;

		const dataUnit = this.dataUnits.find(e => e.unitId == unitId);
		const data = Object.assign({}, dataUnit);
		Object.assign(data, this.tracking.find(e => e.unitId == unitId));

		return (data);

	}
	setInfo(unitId: number) {
		
		this.onInfoUpdate(this.loadInfoData(this.units[unitId].data), this.units[unitId].getName());


		return;


		const dataUnit = this.dataUnits.find(e => e.unitId == unitId);
		const data = Object.assign({}, dataUnit);
		Object.assign(data, this.tracking.find(e => e.unitId == unitId));
		this.onInfoUpdate(this.loadInfoData(data), dataUnit.vehicle_name);

		



	}

	getDataInfo(id: number) {
		alert(8888)
		if (!this.dataUnits[id]) {
			return;
		}
		let data = this.dataUnits[id];
		const tracking = this.tracking[data.unitId];
		for (let x in tracking) {
			this.dataUnits[id][x] = tracking[x];
		}
		return data;
	}
	loadPopupInfo(id: number) {
		const data = this.getDataInfo(id);



		data.input1 = " -";
		data.output1 = " -";
		if (data.input) {
			let _input = $.create("div");
			data.input.forEach((e, index) => {
				_input.create("div").text(e.name + ":" + e.value);
				//_input.add("div").text(e.value);
			});
			data.input1 = _input.text();
		}

		if (data.output) {
			let _input = $.create("div");
			data.output.forEach((e, index) => {
				_input.create("div").text(e.name + ":" + e.value);
				//_input.add("div").text(e.value);
			});
			data.output1 = _input.text();
		}


		return this.evalHTML(this.popupTemplate, data)
		//return this.evalHTML(, this.tracking[this.dataUnits[id].unitId]);
	}

	loadInfoData(data) {
		
		let xInputs = "";
		if (data.iInputs) {
			data.iInputs.forEach(element => {
				xInputs += `<div>${element.name} ${element.value}</div>`;
			});
		}

		data.xinputs = xInputs;

		//this.infoFormMain.setMode(info.className);
		this.infoFormMain.setData(data);

	}

	setFollowMe(unitId: number, value: boolean) {
		if(this.units[unitId]){
			this.units[unitId].setFollow(value);

			this.units[unitId].setFollow(value);
			const checkInfo = $(document).query(`input[type="checkbox"][data-follow]`);
			if(checkInfo){
				checkInfo.checked = value;
			}

			this.traceTool.setFollowCheck(unitId, value)
		}
		
	}
	getFollowMe() {
		return this.followMe;
	}


	showStatusWin() {
		S.send3({
			"async": 1,

			"params": [

				{
					"t": "setMethod",
					"mode": "element",
					"id": this.statusId,
					"element": "form",
					"method": "list",
					"name": "/form/status_unit",
					"eparams": { "mainId": this.statusId }

				}
			],
			onRequest: (x) => {

			}
		});
	}

	setUnit2(unitId: number) {
		this._lastUnitId = unitId;
		if (this.searchUnit) {
			this.searchUnit.setValue({ unitId: unitId });
		}
		this.findUnit(unitId);

	}

	findUnit(unitId: number) {
		const index = this.indexUnit[unitId];

		this.showUnit(index, true);
		this.setInfo(index);
		this.flyTo(index);
	}

	initTool() {
		const tool = new TraceTool({});
	}

	initTraceControl() {

		this.traceControl = this.map.getControl().getControl("trace") as TraceControl;//<TraceControl>
		//this.traceControl.play();

		this.traceTool = new TraceTool({
			id: this.traceControl.getPage(0),
			dataUnits: this.dataUnits,
			tracking: this.tracking,
			onTrace: (unitId, value) => {
				this.playTrace(unitId, value);

				
			},
			onFollow: (unitId, value) => {
				this.setFollowMe(unitId, value);
				/*
				this.units[unitId].setFollow(value);
				const checkInfo = $(document).query(`input[type="checkbox"][data-follow]`);
				if(checkInfo){
					checkInfo.checked = value;
				}
				 */
			},
			
		});

		this.traceControl.getPage(1).addClass("trace-layer");
		new LayerMenu({
			layers: this.traceConfig.layers,
			groups: this.traceConfig.groups,
			map: this.map.getControl(),
			target: this.traceControl.getPage(1),
			onShowLayer: (index, value) => {

				for (const key in this.units) {
					this.units[key].getTrace().showLayerIx(index, value);
				}
			}
		})
	}


	updateTraceLayer(tracking) {

		console.log("hola");
		/*
		console.log(this.history);
		console.log(this.history.filter((e, index)=>{
			return e.ts>=1593616910
		}));
		*/
		//console.log(this.dataUnits);
		const trace = this.trace = new Trace({
			data: tracking,
			map: this.map.getControl().map,
			layers: this.traceConfig.layers,
			images: this.traceConfig.images,
		});
		//trace.draw({});
		const traceTool = new TraceTool({
			id: this.traceControl.getPage(0),
			dataUnits: this.dataUnits,
			tracking: this.tracking,
		});


		//map.getControl("mark").onsave = ((info)=>{}
	}


	public isValid(unitId) {
		this.units[unitId]
	}

	public showUnit3(unitId) {
		if (this.units[unitId].getValid()) {
			this.units[unitId].setInfo(this.getUnitInfo(unitId));
			this.units[unitId].show(true);
			this.units[unitId].flyTo();
			this._lastUnitId = unitId;
			//this.playTrace(unitId);

		} else {
			new Float.Message({
				"caption": this.units[unitId].getName(),
				"text": this.msgErrortracking,
				"className": "",
				"delay": 3000,
				"mode": "",
				"left": "center",
				"top": "top"
			}).show({});
			//alert(this.msgErrortracking);
		}

		const info = this.dataUnits.find(e => e.unitId == unitId) || {};
		if (info) {

			this.onInfoUpdate(this.getUnitInfo(unitId), info.unitName);
		}

	}

	public getLastUnit() {

		return this._lastUnitId;

	}
}

