import { _sgQuery as $ } from "../../Sevian/ts/Query.js";
import { Map } from './Map.js';
import { S } from "../../Sevian/ts/Sevian.js";
import { InfoForm } from '../../Sevian/ts/InfoForm.js';
export class Event {
    constructor(info) {
        this.id = null;
        this.caption = "";
        this.formId = "form-" + String(new Date().getTime());
        this.formAId = "forma-" + String(new Date().getTime());
        this.formWId = "formw-" + String(new Date().getTime());
        this.formMId = "formm-" + String(new Date().getTime());
        this.formIds = {};
        this.infoForm = null;
        this.infoFormMain = null;
        this.className = null;
        this.main = null;
        this.wins = [];
        this.commandConfig = null;
        this.unitConfig = null;
        this.unitPending = null;
        this.eventList = null;
        this.commandList = null;
        this.form = null;
        this.forms = {};
        this.unitId = null;
        this.unitName = "";
        this.index = 100;
        this.eventId = null;
        //private listCommand["0"]: any;
        this.tab = null;
        this.tabs = [];
        this.listCommand = [];
        this.socketId = "";
        this.socket = null;
        this.unitPanelId = "";
        this.unitPanel = null;
        this.timer = null;
        this.delay = 10000;
        this.infoMenuId = null;
        this.infoMenu = null;
        this.totalPending = -1;
        this.onSubTotal = (unitId, total) => { };
        this.subtotalButton = null;
        this.mapName = "";
        this.mark = null;
        this.popup = null;
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = this.id ? $(this.id) : null;
        if (!main) {
            main = $.create("div").attr("id", this.id);
            main.on("click", (event) => {
            });
        }
        if (this.unitPanelId) {
            this.unitPanel = S.getElement(this.unitPanelId);
            this.unitPanel.addEvent((unitId) => {
                if (this.wins["main"].getVisible()) {
                    this.show(unitId);
                }
            });
            this.unitPanel.onPending = (unitId) => {
                this.show(unitId);
            };
        }
        if (this.socketId) {
            this.socket = S.getElement(this.socketId);
        }
        //this.formIds["0"] = "form-" + String(new Date().getTime());
        Map.load(this.mapName, (mapApi, map) => {
            this.infoFormMain = new InfoForm(this.infoForm);
            this.map = mapApi;
            this.popup = this.map.createPopup({
                focusAfterOpen: true,
                closeOnClick: false
            });
            this.map.map.on("click", () => {
                this.popup.remove();
            });
            this.popup.setDOMContent(this.infoFormMain.get());
        });
        this.create(main);
        //this.play();
    }
    create(main) {
        this.main = main;
        main.addClass("event-tool");
    }
    showEvent(eventId) {
        this.goShowEvent(eventId);
    }
    getUnit() {
        if (this.unitPanel) {
            return this.unitPanel.getLastUnit();
        }
        return null;
    }
    show(unitId) {
    }
    setUnitId(unitId) {
        this.unitId = unitId;
    }
    getUnitId() {
        return this.unitId;
    }
    play() {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
        this.timer = setInterval(() => {
            //this.goLoadPending(this.getUnit());
        }, this.delay);
    }
    stop() {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
    }
    goShowEvent(eventId) {
        console.log(this.infoFormMain.get());
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.infoFormMain,
            requestFunctions: {
                getEven: (json) => {
                    console.log(json);
                    this.infoFormMain.setData(json);
                    this.popup.setLngLat([json.longitude, json.latitude]);
                    this.popup.addTo(this.map.map);
                    this.map.flyTo(json.longitude, json.latitude);
                    return;
                    if (!this.mark) {
                        this.mark = this.map.createMark({
                            latitude: json.latitude,
                            longitude: json.longitude,
                            heading: 0,
                            image: "http://localhost/sevian2020/images/marks/squat_marker_orange-31px2.png",
                            popupInfo: this.infoFormMain.get(),
                            visible: true, //this.visible
                        });
                    }
                    else {
                        this.mark.setLngLat([json.longitude, json.latitude]);
                        //this.mark.setHeading(json.heading || 0);
                    }
                    this.mark.panTo();
                },
            },
            params: [
                {
                    t: "setMethod",
                    element: "gt-event",
                    method: "get-event",
                    name: "",
                    eparams: {
                        eventId: eventId,
                    },
                    iToken: "getEven",
                },
            ],
        });
    }
}
//# sourceMappingURL=Event.js.map