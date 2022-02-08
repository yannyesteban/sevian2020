import { _sgQuery as $, SQObject } from '../../Sevian/ts/Query.js';
import { Menu as Menu } from '../../Sevian/ts/Menu2.js';
import { Float } from '../../Sevian/ts/Window.js';

import { S } from '../../Sevian/ts/Sevian.js';


import { UnitStore } from './UnitStore.js';


import { InfoForm } from '../../Sevian/ts/InfoForm.js';

export class UnitInfo {
	private unitId: number;
	private unitData: { [key: string]: any } = {};

	private unitStoreId: string = null;
	private unitStore: UnitStore = null;

	private infoForm: InfoForm = null;

	private main: SQObject = null;
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
	
	private window: any = null;

	

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




		this._create(main);

	}

	_create(main: any) {

		this.main = main;
		const infoForm = new InfoForm(this.infoForm);
		//this.menu = this.createMenu();
		this.window = new Float.Window({
			visible: true,
			caption: this.caption,
			left: "right",
			top: "top",
			deltaX: -50,
			deltaY: 100,

			width: "330px",
			height: "200px",
			mode: "custom",
			className: ["sevian"],
			closable: false

		});

		this.main.addClass("geofence-main");

		if (this.unitStoreId) {

			this.unitStore = S.getElement(this.unitStoreId) as UnitStore;

			this.unitStore.addEvent("unitChange", (event) => {
				const detail = event.detail;
				if (detail && detail.data && detail.data.unitId) {
					const data = detail.data;

					infoForm.setMode("");

					this.window.setBody(infoForm.get());
					this.window.setCaption(data.unitName || "");
					console.log("la unidad es " + this.unitId);

					this.unitId = data.unitId;
					this.unitData = data;
					infoForm.setData(data);
					return;

				}

				infoForm.setMode("error");
				this.window.setCaption("No Unit Selected!");
				this.unitId = null;
				this.unitData = {};

			});

			this.unitStore.addEvent("infoChange", (event) => {

				const detail = event.detail;
				if (detail && detail.data && detail.data.unitId && detail.data.unitId === this.unitId) {

					const data = detail.data;
					this.unitData = Object.assign(this.unitData || {}, data);
					infoForm.setData(this.unitData);
				}
				
			});
		}

	}



	showMenu() {
		this.window.show();
	}

}
