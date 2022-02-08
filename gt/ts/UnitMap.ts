import { InfoForm } from '../../Sevian/ts/InfoForm.js';
import { _sgQuery as $, SQObject } from '../../Sevian/ts/Query.js';
import { S } from '../../Sevian/ts/Sevian.js';
import { MapAdmin } from "./MapAdmin.js"
import { UnitStore } from './UnitStore.js';
import { Float } from '../../Sevian/ts/Window.js';

const eventUnitChange = 'unitChange';
const eventVisibleChange = 'visibleChange';
const eventInfoChange = 'infoChange';

const obj = $.create("div").get();

export class UnitMap {
	private id: string = null;
	private unitData: { [id: number]: any } = {};

	private unitStoreId: string = null;
	private unitStore: UnitStore = null;

	private mapAdminId: string = null;
	private mapAdmin: MapAdmin = null;


	private units: any[] = [];
	private lastTime: string = null;
	private timer: number = null;
	private delay: number = 20;


	private lastUnit: number = null;

	private infoMapPopup = null;
	private msgErrorTracking: string = "";

	constructor(info) {


		for (var x in info) {
			if (this.hasOwnProperty(x)) {
				this[x] = info[x];
			}
		}


		if (this.mapAdminId) {

			this.mapAdmin = S.getElement(this.mapAdminId) as MapAdmin;
			console.log(this.mapAdminId, this.mapAdmin)

			this.mapAdmin.addEvent("map-change", (event) => {
				console.log("map-change");
				console.log(this.units)
				this.units.forEach(data => {

					this.createMark(data);
				});
			})
		}

		if (this.unitStoreId) {

			this.unitStore = S.getElement(this.unitStoreId) as UnitStore;

			this.unitStore.addEvent("unitChange", (event) => {
				console.log(this.mapAdmin)
				if (!this.mapAdmin) {
					console.log("error");
					return
				}
				const detail = event.detail;

				if (detail && detail.data && detail.data.unitId) {
					const data = detail.data;

					if (!data.longitude || !data.latitude) {
						new Float.Message({
							"caption": data.unitName,
							"text": this.msgErrorTracking,
							"className": "",
							"delay": 3000,
							"mode": "",
							"left": "center",
							"top": "top"
						}).show({});
						this.unitStore.updateData({ unitId: detail.data.unitId, active: false });
						return;
					}

					this.createMark(detail.data, true);
				}

			});

			this.unitStore.addEvent("infoChange", (event) => {

				const detail = event.detail;
				if (detail && detail.data && detail.data.unitId) {
					const data = detail.data;

					console.log(data);

					if (!data.active) {
						this.removeMark(data);
						return;
					}

					this.updateMark(data)
				}
			});
		}
	}

	createMark(unit, fly?) {
		console.log("mark intentando crear")

		const index = this.units.findIndex(element => element.unitId === unit.unitId);
		if(index < 0){
			console.error("unit existe");
			this.units.push(unit);
		}
		

		if(this.mapAdmin.getMobil(unit.unitId)){
			return;
		}

		const popup = new InfoForm(this.infoMapPopup)
		const data = Object.assign({}, unit);

		const mark = this.mapAdmin.addMobil({
			latitude: data.latitude,
			longitude: data.longitude,
			id: data.unitId,
			info: data,
			infoForm: this.infoMapPopup
		})
		if(fly){
			mark.flyTo();
		}

		

		console.log("mark creado")
		
	}

	public removeMark(data) {
		const unitId = data.unitId;
		const index = this.units.findIndex(element => element.unitId === unitId);
		if (index >= 0) {
			
			this.units.splice(index, 1);
		}

		this.mapAdmin.removeMobil(unitId);
	}

	public updateMark(data) {
		const unitId = data.unitId;

		const index = this.units.findIndex(element => element.unitId === unitId);
		this.units[index] = Object.assign(this.units[index] || {}, data);
		const mark = this.mapAdmin.getMobil(unitId);

		if (!mark) {
			console.log("no loaded!!!", unitId);
			return;
		}

		mark.setPosition({
			longitude: data.longitude,
			latitude: data.latitude
		});

		mark.updateInfo(data);

	}

	public setMap(mapAdmin: MapAdmin) {

		this.mapAdmin = mapAdmin;
	}
	public test() {

		alert("Unit admin");
	}

	public loadData(unitId: number) {

		this.loadUnitInfo(unitId);
	}

	public setUnit(unitId: number) {

		if (unitId === this.lastUnit) {
			return;
		}
		this.lastUnit = unitId;
		this.loadUnitInfo(unitId);
	}


	private loadUnitInfo(unitId) {
		S.go({
			async: true,
			valid: false,
			//confirm_: 'seguro?',
			//form: form.getFormData(),
			//blockingTarget: this.infoLayer.get(),
			requestFunctions: {
				info: (json) => {
					const data = Object.assign({}, json.unitData);

					console.log(data);









					this.dispatchEvent(eventUnitChange, unitId, data);
					const popup = new InfoForm(this.infoMapPopup)


					data.popupInfo = popup.get();
					data.onLoadInfo = () => {

						popup.setData(json.unitData);
					};
					if (data.longitude && data.latitude) {

						const mark = this.mapAdmin.addMobil({
							latitude: data.latitude,
							longitude: data.longitude,
							id: data.unitId,
							info: data,
							infoForm: this.infoMapPopup
						})

						mark.flyTo();
					} else {
						console.log("error")
					}


					//this.units[unitId].setInfo(json.unitData);
					//this.onInfoUpdate(json.unitData, json.unitData.unitName);
				},
			},
			params: [
				{
					t: "setMethod",
					element: "gt-unit-admin",
					method: "get-unit-data",//(type == "0") ? "get-event" : "get-command",
					name: "",
					eparams: {
						unitId: unitId,

					},
					iToken: "info",
				}
			],
		});
	}

	public play() {


		if (this.timer) {
			window.clearTimeout(this.timer);
		}

		this.timer = setInterval(() => {

			S.go({
				async: true,
				valid: false,
				requestFunctions: {
					info: (json) => {

						json.tracking.forEach(data => {

							const mark = this.mapAdmin.getMobil(data.unitId);

							if (!mark) {
								console.log("no loaded!!!", data.unitId);
								return;
							}

							this.dispatchEvent(eventInfoChange, data.unitId, data);

							if (mark) {
								mark.setPosition({
									longitude: data.longitude,
									latitude: data.latitude
								});

								mark.updateInfo(data);
							}
						});


						//this.units[unitId].setInfo(json.unitData);
						//this.onInfoUpdate(json.unitData, json.unitData.unitName);
					},
				},



				params: [
					{
						t: "setMethod",
						id: this.id,
						element: "gt-unit-admin",
						method: "tracking",
						name: "",
						eparams: {
							lastTime: this.lastTime
						},
						iToken: "info",
					}
				]
			});
		}, this.delay * 1000);
	}

	public stop() {
		if (this.timer) {
			window.clearTimeout(this.timer);
		}
	}

	public addEvent(eventName, fn) {

		obj.addEventListener(eventName, fn);

	}

	public dispatchEvent(eventName, unitId, data) {
		const event = new CustomEvent(eventName, {
			detail: {
				unitId,
				data
			}
		});

		obj.dispatchEvent(event);
	}


}
