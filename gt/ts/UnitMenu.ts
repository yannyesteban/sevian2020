import { _sgQuery as $, SQObject } from '../../Sevian/ts/Query.js';
import { Map } from './Map.js';
//import {Form2 as Form2} from './Form2.js';
import { Menu as Menu } from '../../Sevian/ts/Menu2.js';
import { Float } from '../../Sevian/ts/Window.js';

import { S } from '../../Sevian/ts/Sevian.js';
import { GeofenceTool } from '../../gt/ts/GeofenceTool.js';
import { MarkControl } from '../../lib/MarkControl2';
import { Form2 as Form } from '../../Sevian/ts/Form2.js';


import { UnitStore } from './UnitStore.js';




export class UnitMenu {

	private unitData: any[] = [];
	private unitStoreId: string = null;

	private unitStore: UnitStore = null;

	private mapName: string = null;
	private geofenceForm: typeof Form = null;
	private dataCategory: any[] = null;
	private dataMain: any[] = [];

	private id: any = null;
	map: any = null;
	mode: number = 0;
	tempPoly: any = null;
	formId: any = null;



	menu: Menu = null;
	win: any = null;
	form: any = null;

	caption: string = "";
	winCaption: string = "";
	pathImages: string = "";
	followMe: boolean = false;

	infoTemplate: string = ``;
	popupTemplate: string = ``;
	public oninfo: Function = (info, name) => { };
	public delay: number = 30000;

	public onSave: Function = info => { };
	public onEdit: Function = info => { };

	private main: any = null;
	private marks: any[] = [];

	private _info: any = null;
	private _winInfo: any = null;
	private _timer: any = null;
	private _form: any = null;
	private _lastUnitId = null;
	private editId: number = null;
	private _traces: any[] = [];

	private window: any[] = [];

	private lastTransaction: number = 0;

	constructor(info) {
		console.log(info)
		for (var x in info) {
			if (this.hasOwnProperty(x)) {
				this[x] = info[x];
			}
		}

		//return;
		let main = (this.id) ? $(this.id) : false;

		if (!main) {
			main = $.create("div").attr("id", this.id);
		}




		if (this.unitStoreId) {

			this.unitStore = S.getElement(this.unitStoreId) as UnitStore;



			this.unitStore.addEvent("unitChange", (event) => {
				const detail = event.detail;
				if (detail && detail.data && detail.data.unitId) {
					const data = detail.data;
					const unitId = detail.data.unitId;
					console.log(detail.data)

					const ele = this.menu.getMain().query(`[data-unit-id="${unitId}"] input[type="checkbox"]`);
					if (ele) {
						ele.checked = data.active || false;
					}


					return;

				}



			});

			this.unitStore.addEvent("infoChange", (event) => {

				const detail = event.detail;
				if (detail && detail.data && detail.data.unitId) {

					console.log(detail.data)

				}

			});

		}

		this._create(main);

	}

	_create(main: any) {

		this.main = main;

		//this.menu = this.createMenu();
		this.window = new Float.Window({
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


		main.addClass("geofence-main");


		this.createUnitMenu(this.unitData);




	}


	createUnitMenu(data) {
		//console.log(this.dataUnits);return;
		let infoMenu = [];
		let cacheClient = [];
		let cacheAccount = [];

		data.forEach((info, index) => {
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

						//this.showAccountUnits(clientId, event.currentTarget.checked);

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

						//this.showUnits(accountId, event.currentTarget.checked);

					},
				};
				cacheClient[clientId].items.push(cacheAccount[accountId]);
			}

			cacheAccount[accountId].items.push({
				id: unitId,
				caption: info.unitName,
				useCheck: true,
				value: index,
				checkValue: index,

				checkDs: { "level": "units", "unitId": unitId },
				ds: { "unitId": unitId, "valid": info.valid },
				check: (item, event) => {
					if (event.currentTarget.checked) {
						this.unitStore.loadUnit(unitId);
					} else {
						this.unitStore.updateData({ unitId, active: false });
					}
					//this.showUnit(unitId, event.currentTarget.checked);


				},
				action: (item, event) => {
					let ch = item.getCheck();
					ch.get().checked = true;
					this.unitStore.loadUnit(unitId);
				}


			});
		});


		this.menu = new Menu({
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
		});

		return this.menu;


	}


	showMenu() {
		this.window.show();
	}







}
