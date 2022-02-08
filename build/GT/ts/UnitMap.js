import { InfoForm } from '../../Sevian/ts/InfoForm.js';
import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { S } from '../../Sevian/ts/Sevian.js';
import { Float } from '../../Sevian/ts/Window.js';
const eventUnitChange = 'unitChange';
const eventVisibleChange = 'visibleChange';
const eventInfoChange = 'infoChange';
const obj = $.create("div").get();
export class UnitMap {
    constructor(info) {
        this.id = null;
        this.unitData = {};
        this.unitStoreId = null;
        this.unitStore = null;
        this.mapAdminId = null;
        this.mapAdmin = null;
        this.units = [];
        this.lastTime = null;
        this.timer = null;
        this.delay = 20;
        this.lastUnit = null;
        this.infoMapPopup = null;
        this.msgErrorTracking = "";
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        if (this.mapAdminId) {
            this.mapAdmin = S.getElement(this.mapAdminId);
            console.log(this.mapAdminId, this.mapAdmin);
            this.mapAdmin.addEvent("map-change", (event) => {
                console.log("map-change");
                console.log(this.units);
                this.units.forEach(data => {
                    this.createMark(data);
                });
            });
        }
        if (this.unitStoreId) {
            this.unitStore = S.getElement(this.unitStoreId);
            this.unitStore.addEvent("unitChange", (event) => {
                console.log(this.mapAdmin);
                if (!this.mapAdmin) {
                    console.log("error");
                    return;
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
                    this.updateMark(data);
                }
            });
        }
    }
    createMark(unit, fly) {
        console.log("mark intentando crear");
        const index = this.units.findIndex(element => element.unitId === unit.unitId);
        if (index < 0) {
            console.error("unit existe");
            this.units.push(unit);
        }
        if (this.mapAdmin.getMobil(unit.unitId)) {
            return;
        }
        const popup = new InfoForm(this.infoMapPopup);
        const data = Object.assign({}, unit);
        const mark = this.mapAdmin.addMobil({
            latitude: data.latitude,
            longitude: data.longitude,
            id: data.unitId,
            info: data,
            infoForm: this.infoMapPopup
        });
        if (fly) {
            mark.flyTo();
        }
        console.log("mark creado");
    }
    removeMark(data) {
        const unitId = data.unitId;
        const index = this.units.findIndex(element => element.unitId === unitId);
        if (index >= 0) {
            this.units.splice(index, 1);
        }
        this.mapAdmin.removeMobil(unitId);
    }
    updateMark(data) {
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
    setMap(mapAdmin) {
        this.mapAdmin = mapAdmin;
    }
    test() {
        alert("Unit admin");
    }
    loadData(unitId) {
        this.loadUnitInfo(unitId);
    }
    setUnit(unitId) {
        if (unitId === this.lastUnit) {
            return;
        }
        this.lastUnit = unitId;
        this.loadUnitInfo(unitId);
    }
    loadUnitInfo(unitId) {
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
                    const popup = new InfoForm(this.infoMapPopup);
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
                        });
                        mark.flyTo();
                    }
                    else {
                        console.log("error");
                    }
                    //this.units[unitId].setInfo(json.unitData);
                    //this.onInfoUpdate(json.unitData, json.unitData.unitName);
                },
            },
            params: [
                {
                    t: "setMethod",
                    element: "gt-unit-admin",
                    method: "get-unit-data",
                    name: "",
                    eparams: {
                        unitId: unitId,
                    },
                    iToken: "info",
                }
            ],
        });
    }
    play() {
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
    stop() {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
    }
    addEvent(eventName, fn) {
        obj.addEventListener(eventName, fn);
    }
    dispatchEvent(eventName, unitId, data) {
        const event = new CustomEvent(eventName, {
            detail: {
                unitId,
                data
            }
        });
        obj.dispatchEvent(event);
    }
}
//# sourceMappingURL=UnitMap.js.map