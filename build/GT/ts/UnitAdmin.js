import { InfoForm } from '../../Sevian/ts/InfoForm.js';
import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { S } from '../../Sevian/ts/Sevian.js';
const eventUnitChange = 'unitChange';
const eventVisibleChange = 'visibleChange';
const eventInfoChange = 'infoChange';
const obj = $.create("div").get();
export class UnitAdmin {
    constructor(info) {
        this.id = null;
        this.unitData = {};
        this.mapAdminId = null;
        this.mapAdmin = null;
        this.units = null;
        this.lastTime = null;
        this.timer = null;
        this.delay = 20;
        this.lastUnit = null;
        this.infoMapPopup = null;
        console.log(info);
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        if (this.mapAdminId) {
            //this.mapAdmin = S.getElement(this.mapAdminId) as MapAdmin;
        }
        this.play();
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
                        console.log(json);
                        json.tracking.forEach(data => {
                            const mark = this.mapAdmin.getMobil(data.unitId);
                            if (!mark) {
                                console.log("no loaded!!!", data.unitId);
                                return;
                            }
                            console.log("yes !!!", data.unitId);
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
//# sourceMappingURL=UnitAdmin.js.map