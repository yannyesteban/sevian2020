import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { S } from '../../Sevian/ts/Sevian.js';
const obj = $.create("div").get();
const eventUnitChange = 'unitChange';
const eventVisibleChange = 'visibleChange';
const eventInfoChange = 'infoChange';
export class UnitStore {
    constructor(config) {
        this.unit = null;
        this.timer = null;
        this.delay = 5;
        this.lastTime = null;
        this.id = null;
        this.caption = "Store";
        const self = this;
        for (let x in config) {
            if (this.hasOwnProperty(x)) {
                this[x] = config[x];
            }
        }
        this.play();
    }
    setUnit(unit) {
        this.unit = unit;
        this.unit.active = true;
        this.dispatchEvent(eventUnitChange, this.unit);
        console.log("dispatchEvent");
    }
    updateData(data) {
        this.dispatchEvent(eventInfoChange, Object.assign(this.unit || {}, data));
    }
    loadUnit(unitId) {
        this.goFindUnit(unitId).then((unit) => {
            this.setUnit(unit);
        });
    }
    goFindUnit(unitId) {
        return new Promise((resolve, reject) => {
            S.go({
                async: true,
                valid: false,
                requestFunctions: {
                    info: (json) => {
                        const data = Object.assign({}, json.unitData);
                        resolve(data);
                    },
                },
                params: [
                    {
                        t: "setMethod",
                        element: "gt-unit-store",
                        method: "get-unit-data",
                        name: "",
                        eparams: {
                            unitId,
                        },
                        iToken: "info",
                    }
                ],
            });
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
                            this.dispatchEvent(eventInfoChange, data);
                        });
                    },
                },
                params: [
                    {
                        t: "setMethod",
                        id: this.id,
                        element: "gt-unit-store",
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
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, {
            detail: {
                data
            }
        });
        obj.dispatchEvent(event);
    }
}
//# sourceMappingURL=UnitStore.js.map