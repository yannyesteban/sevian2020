import {_sgQuery as $, SQObject}  from '../../Sevian/ts/Query.js';
import {Map, MapApi, MapControl}  from './Map.js';
//import {Form2 as Form2} from './Form2.js';
import {Menu as Menu} from '../../Sevian/ts/Menu2.js';
import {Float}  from '../../Sevian/ts/Window.js';
import {S}  from '../../Sevian/ts/Sevian.js';
import {Trace}  from '../../lib/Trace.js';
import {Mark}  from '../../lib/Mark';
import {TraceControl}  from '../../lib/TraceControl.js';
import { TraceTool } from './TraceTool.js';
import { InfoForm } from '../../Sevian/ts/InfoForm.js';

import { LayerMenu } from './LayerMenu.js';

import { GTInfo } from '../../GT/ts/Info.js';

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

class Mobil{
	private data:any = null;
	private name: Mark = null;
	private mark: Mark = null;
	private latitude:number = 0;
	private longitude:number = 0;
	private heading:number = 0;
	private image: string = "";
	private trace: Trace = null;
	private traceInfo: any = {};
	private popupInfo:string = "";
	private visible:boolean = false;
	private valid: boolean = false;
	private infoForm: typeof InfoForm = null;
	private infoFormMain: InfoForm = null;
	private propertysInfo: any[] = [];
	private follow: boolean = false;

	public onValid: (value: boolean) => void = (value) => { };
	public onFollow: (value: boolean) => void = (value) => { };
	public onVisible: (value: boolean) => void = (value) => { };
	public onTrace: (value: boolean) => void = (value) => { };

	static map = null;


	static setMap(map) {
		Mobil.map = map;
	}
	constructor(info?) {

		for(var x in info){
			if(this.hasOwnProperty(x)) {
				this[x] = info[x];
			}
		}

		this.infoFormMain = new InfoForm(this.infoForm);

		this.mark = Mobil.map.createMark({
			latitude:this.latitude,
			longitude:this.longitude,
			heading:this.heading,
			image:this.image,
			popupInfo: this.infoFormMain.get(),
			visible:this.visible
		});

		this.createTrace(this.traceInfo);

	}

	createTrace(info) {


		const infoForm = new InfoForm(info.infoTrace);
		this.trace = new Trace({
			//data:tracking,
			map:Mobil.map.map,
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

	getTrace() {
		return this.trace;
	}

	initTrace(tracking) {
		this.trace.init(tracking);
	}

	addTracking(tracking) {

		this.setValid(true);

		if (this.trace.isActive()) {
			this.trace.add(tracking);
		}
	}

	setPosition(info) {
		this.longitude = info.longitude || 0;
		this.latitude = info.latitude || 0;

		this.mark.setLngLat([this.longitude, this.latitude]);
		this.mark.setHeading(info.heading || 0);
		//this.mark.setPopup(info.popupInfo || "");
		if(info.visible){
			this.mark.show(info.visible);
		}
		if(info.image){

		}

		return this;

	}
	setInfo(info){
		this.infoFormMain.setData(info);
		return this;
	}
	flyTo(){
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
	panTo(){
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
		return this.follow;
	}
	setFollow(value: boolean) {
		this.follow = value;
		this.onFollow(value);
	}
}

export class Unit{

	id:any = null;
	map:any = null;

	private units:{ [key: number]: Mobil} = {};
	private mapName:string = null;
	private traceControl:TraceControl = null;

	private infoForm:any = null;
	private infoFormMain: InfoForm = null;
	private infoPopup: any = null;
	private infoTrace: any = null;
	private infoPopupMain: any = null;

	private delay: number = 4000;
	private traceDelay: number = 20000;

	private timer: number = null;
	private traceTimer: number = null;
	private propertysInfo: any[] = [];


	dataClients:any[] = null;
	dataAccounts:any[] = null;
	dataUnits:any[] = null;
	indexUnit:any[] = [];
	tracking:any[] = null;
	history:any[] = null;
	traceConfig:any = null;
	menu:any = null;
	win:any = null;

	private infoInput:any = {};
	private unitInputs:any = {};

	caption:string = "u";
	winCaption:string = "";
	pathImages:string = "";
	followMe:boolean = false;

	infoTemplate:string = ``;
	popupTemplate:string = ``;

	public onInfoUpdate:Function = (info, name)=>{};


	private main:any = null;
	private marks:any = {};

	private _info:any = null;
	private _winInfo:any = null;

	private _timer:any = null;

	private _timer2:any = null;
	public delay2:number = 12000;

	private _lastUnitId: number = 0;

	private _traces:any[] = [];

	private infoId:string = null;
	private statusId:string = null;
	private _win:any[] = [];

	public showConnectedUnit:boolean = false;

	private msgErrorUnit = "Unit not Found!!!";
	private msgErrortracking = "data tracking not Found!!!";


	private searchUnitId:any = null;
	private searchUnit:any = null;
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

		Map.load(this.mapName, (mapApi: MapApi, map) => {

			Mobil.setMap(mapApi);
			this.setMap(map);

			this.dataUnits.forEach((info) => {

				const tracking = this.tracking.find(e => e.unitId == info.unitId) || {};

				const propertys = {};

				this.propertysInfo.forEach((e) => {
					propertys[e.name] = e;
				});
				this.units[info.unitId] = new Mobil({
					data: info,
					name:info.vehicle_name,
					latitude:tracking.latitude || 0,
					longitude:tracking.longitude || 0,
					heading:tracking.heading || 0,
					image:info.image,
					popupInfo: "this.loadPopupInfo(info)"+info.unitId,
					visible: false,
					infoForm: this.infoPopup,
					valid: tracking.unitId !== undefined,
					propertysInfo: propertys,
					traceInfo: {
						layers: this.traceConfig.layers,
						infoTrace: this.infoTrace,
					},
					onValid: (valid) => {
						const ele = $.query(`.sg-menu .item[data-unit-id="${info.unitId}"] `);
						$(ele).ds("valid", (valid) ? "1" : "0");
					},
					onVisible: (value) => {
						const ele = $.query(`.sg-menu .item[data-unit-id="${info.unitId}"] input[type="checkbox"] `);
						$(ele).attr("checked", value);
					}
				});


			});



			if(this.infoForm){


				this.infoFormMain = new InfoForm(this.infoForm);

				if(this.infoId){
					const winInfo:GTInfo = S.getElement(this.infoId) as GTInfo;
					this.onInfoUpdate = (info, name) =>{




						//this.infoFormMain.setMode(info.className);
						this.infoFormMain.setData(info);

						winInfo.setCaption(name);

						winInfo.setBody(this.infoFormMain.get());
					};

				}
			}

			this.play();

			this.initTraceControl();
			//this.playTrace();

			//map.map.addImage("t1", new TraceMarker(map.map, 30), { pixelRatio: 1 });
return;
			console.log(this.tracking);

			t
		});

		if(this.showConnectedUnit){
			this.play2();
		}


	}




	showMenu(){
		this._win["menu-unit"].show();
	}
	showConnected(){
		this._win["status-unit"].show();
	}
	_create(main:any){

		this.main = main;



		this.searchUnit = S.getElement(this.searchUnitId);

		main.addClass("unit-main");

		this.createMenu();

		//this.menu = this.createMenu();
		this._win["menu-unit"] = new Float.Window({
			visible:true,
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




	}


	_load(main:any){

	}

	init(){

	}

	setUnit(info:any){
		if(!this.units[info.unitId]){
			this.units[info.unitId] = new Mobil(info);
		}
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
		if (data === undefined) {
			return;
		}

		data.forEach((element, i)=>{
			//this.trace.add(element);
			const unitId = element.unitId;
			const index:number = this.tracking.findIndex(e=>e.unitId == unitId);

			if(index >= 0){
				this.tracking[index] = element;
			}

			if (this.units[unitId]) {

				this.units[unitId].addTracking(element);
				this.units[unitId].setPosition({
					longitude: element.longitude,
					latitude: element.latitude,
					heading: element.heading
				}).setInfo(this.getUnitInfo(unitId));

			}

			if (this._lastUnitId === unitId) {
				this.onInfoUpdate(this.getUnitInfo(unitId), this.units[unitId].getName());
			}

			if (this.followMe) {
				this.flyTo();
			}



			return;


			const unitIndex:number = this.dataUnits.findIndex(e=>e.unitId == unitId);



			console.log(index, this.marks, this.marks[unitId])
			if(this.marks[unitId]){
				const mark = this.marks[unitId];

				mark.setLngLat([this.tracking[index].longitude, this.tracking[index].latitude]);
				mark.setHeading(this.tracking[index].heading);

				mark.setPopup(this.loadPopupInfo(unitIndex));
				this.setInfo(unitIndex);

				//let popup = this.evalHTML(this.popupTemplate, this.dataUnits[id]);
				//popup = this.evalHTML(popup, this.tracking[id]);
			}
		});



	}

	play(){

		if(this.timer){
			window.clearTimeout(this.timer);
		}

		this.timer = setInterval(() => {

			S.go({
				async: true,
				valid:false,
				confirm_: 'seguro?',
				requestFunction: (json) => {
					this.updateTracking(json)
				},
				params:	[
					{
						t:"setMethod",
						id:this.id,
						element:"gt_unit",
						method:"tracking",
						name:"x",
						eparams:{}
					}
				]
			});
		}, this.delay);
	}

	stop() {
		if(this.timer){
			window.clearTimeout(this.timer);
		}
	}



	updateTrace(xhr:any) {

		let json = JSON.parse(xhr.responseText);
		console.log(json);

		//this.updateTraceLayer(json);
		//this.stopTrace();
		//this.traceDelay = 60000000;
		//this.playTrace();
	}

	stopTrace() {
		if(this.traceTimer){
			window.clearTimeout(this.traceTimer);
		}
	}
	playTrace(unitId: number, value?: boolean) {

		if (value === false) {
			return;
		}

		S.go({
			async: true,
			requestFunction: (tracking: any) => {
				this.units[unitId].initTrace(tracking);
				this.units[unitId].setVisible(true);
			},
			params:	[
				{
					t:"setMethod",
					id:this.id,
					element:"gt_unit",
					method:"trace",
					name:'',
					eparams: {
						unitId:unitId
					}
				}
			]
		});
	}

	createMenu(){
		//console.log(this.dataUnits);return;
		let infoMenu = [];
		let cacheClient = [];
		let cacheAccount = [];

		this.dataUnits.forEach((info, index) => {
			const clientId = info.client_id;
			const accountId = info.account_id;
			const unitId = info.unitId;

			//console.log(clientId, this.dataUnits[x].client);
			if(!cacheClient[clientId]){
				cacheClient[clientId] = {
					id: clientId,
					caption:info.client,
					items:[],
					useCheck:true,
					useIcon:false,
					checkValue: index,
					checkDs:{"level":"client","clientId":clientId},
					ds:{"clientId":clientId},
					check:(item, event)=>{

						this.showAccountUnits(clientId, event.currentTarget.checked);

					},
				};
				infoMenu.push(cacheClient[clientId]);
			}

			if(!cacheAccount[accountId]){
				cacheAccount[accountId] = {
					id: accountId,
					caption:info.account,
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
				id: unitId,
				caption:info.vehicle_name,
				useCheck:true,
				value: index,
				checkValue: index,

				checkDs:{"level":"units","unitId":unitId},
				ds:{"unitId":unitId, "valid": info.valid},
				check:(item, event)=>{
					this.showUnit(unitId, event.currentTarget.checked);
				},
				action:(item, event) => {
					let ch = item.getCheck();
					ch.get().checked = true;


					if(this.units[unitId].getValid()){

						this.units[unitId].show(true);
						this.units[unitId].flyTo();
						this._lastUnitId = unitId;
						//this.playTrace(unitId);

					}else{
						alert(this.msgErrortracking);
					}
					this.onInfoUpdate(this.getUnitInfo(unitId), info.vehicle_name);
					//this.setInfo(unitId);
				}

			});
		});

		return new Menu({
			caption:"",
			autoClose: false,
			target:this.main,
			items: infoMenu,
			useCheck:true,
			check:(item) => {
					let ch = item.getCheck();
					let checked = ch.get().checked;
					let list = item.queryAll(`input[type="checkbox"]`);
					for(let x of list){
						x.checked = checked;
					}
				}
			});;

	}

	getInfoLayer(){

		return this._info;
	}
	showUnit2(unitId, value){
		this.showUnit(this.indexUnit[unitId], value);
	}
	showUnit(unitId, value){

		if(this.units[unitId]){
			this.units[unitId].show(value);
			return;
		}
		//alert(this.msgErrorUnit);
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
			let regex = new RegExp('\(\{=('+x+')\})', "gi");
			html= html.replace(regex, auxf);

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

		if(this.marks[unitId]){

			this.marks[unitId].panTo();
		}
	}


	getUnitInfo(unitId: number) {
		const dataUnit = this.dataUnits.find(e=>e.unitId == unitId);
		const data = Object.assign({}, dataUnit);
		Object.assign(data, this.tracking.find(e => e.unitId == unitId));

		return (data);

	}
	setInfo(unitId:number){
		const dataUnit = this.dataUnits.find(e=>e.unitId == unitId);
		const data = Object.assign({}, dataUnit);
		Object.assign(data, this.tracking.find(e=>e.unitId == unitId));
		this.onInfoUpdate(this.loadInfoData(data), dataUnit.vehicle_name);

		return;
		if(!this.dataUnits[id]){
			return;
		}
		//this._info.text(this.loadInfoData(id));
		//this._winInfo.setCaption(this.dataUnits[id].vehicle_name);



	}

	getDataInfo(id:number){
		if(!this.dataUnits[id]){
			return;
		}
		let data = this.dataUnits[id];
		const tracking = this.tracking[data.unitId];
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
		//return this.evalHTML(, this.tracking[this.dataUnits[id].unitId]);
	}

	loadInfoData(data){
		console.log(data)
		let xInputs = "";
		if(data.iInputs){
			data.iInputs.forEach(element => {
				xInputs += `<div>${element.name} ${element.value}</div>`;
			});
		}

		data.xinputs = xInputs;

		//this.infoFormMain.setMode(info.className);
		this.infoFormMain.setData(data);

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
					"mode":"element",
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

	setUnit2(unitId:number){
		this._lastUnitId = unitId;
		if(this.searchUnit){
			this.searchUnit.setValue({unitId:unitId});
		}
		this.findUnit(unitId);

	}

	findUnit(unitId:number){
		const index = this.indexUnit[unitId];

		this.showUnit(index, true);
		this.setInfo(index);
		this.flyTo(index);
	}

	initTool(){
		const tool = new TraceTool({});
	}

	initTraceControl() {

		this.traceControl = this.map.getControl().getControl("trace") as TraceControl;//<TraceControl>
		this.traceControl.play();

		const traceTool = new TraceTool({
			id:this.traceControl.getPage(0),
			dataUnits: this.dataUnits,
			tracking: this.tracking,
			onTrace: (unitId, value) => {
				this.playTrace(unitId, value);
			},
			onFollow: (unitId, value) => {
				this.units[unitId].setFollow(value);
			}
		});

		this.traceControl.getPage(1).addClass("trace-layer");
		new LayerMenu({
			layers: this.traceConfig.layers,
			groups: this.traceConfig.groups,
			map:this.map.getControl(),
			target: this.traceControl.getPage(1),
			onShowLayer: (index, value) => {

				for (const key in this.units) {
					this.units[key].getTrace().showLayerIx(index, value);
				}
			}
		})
	}


	updateTraceLayer(tracking) {


		/*
		console.log(this.history);
		console.log(this.history.filter((e, index)=>{
			return e.ts>=1593616910
		}));
		*/
		//console.log(this.dataUnits);
		const trace = this.trace = new Trace({
			data:tracking,
			map:this.map.getControl().map,
			layers:this.traceConfig.layers,
			images:this.traceConfig.images,
		});
		//trace.draw({});
		const traceTool = new TraceTool({
			id:this.traceControl.getPage(0),
			dataUnits: this.dataUnits,
			tracking: this.tracking,
		});


		//map.getControl("mark").onsave = ((info)=>{}
	}


	public isValid(unitId) {
		this.units[unitId]
	}
}

