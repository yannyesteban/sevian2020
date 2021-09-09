import { _sgQuery as $ } from "../../Sevian/ts/Query.js";
import { Float } from "../../Sevian/ts/Window.js";
import { S } from "../../Sevian/ts/Sevian.js";
export class Pending {
    constructor(info) {
        this.id = null;
        this.caption = "";
        this.formId = "form-" + String(new Date().getTime());
        this.formAId = "forma-" + String(new Date().getTime());
        this.formWId = "formw-" + String(new Date().getTime());
        this.formMId = "formm-" + String(new Date().getTime());
        this.formIds = {};
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
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = this.id ? $(this.id) : null;
        if (!main) {
            main = $.create("div").attr("id", this.id);
        }
        if (this.unitPanelId) {
            this.unitPanel = S.getElement(this.unitPanelId);
            this.unitPanel.onPending = (unitId) => {
                this.show(unitId);
            };
        }
        if (this.socketId) {
            this.socket = S.getElement(this.socketId);
        }
        //this.formIds["0"] = "form-" + String(new Date().getTime());
        this.create(main);
    }
    create(main) {
        main.addClass("pending-tool");
        this.main = main;
        this.wins["main"] = new Float.Window({
            visible: false,
            caption: "Pending",
            left: 'right',
            top: 'bottom',
            deltaX: -50 - 350,
            deltaY: -140 - 20,
            width: "330px",
            height: "120px",
            mode: "auto",
            className: ["sevian"],
            child: this.main,
            onshow: (info) => {
                this.play();
            },
            onhide: (info) => {
                this.stop();
            },
        });
    }
    getUnit() {
        if (this.unitPanel) {
            return this.unitPanel.getLastUnit();
        }
        return null;
    }
    show(unitId) {
        if (unitId == 0 || unitId === undefined) {
            this.goLoadPending(0);
            this.wins["main"].setCaption(`${this.caption} : Todos`);
            this.wins["main"].show({ left: "center", top: "middle" });
            return;
        }
        let unitName = "";
        if (this.unitPanel) {
            unitName = this.unitPanel.getUnitInfo(unitId).unitName;
        }
        this.goLoadPending(unitId);
        this.wins["main"].setCaption(`${this.caption} : ${unitName}`);
        this.wins["main"].show({ left: "center", top: "middle" });
        this.unitId = unitId;
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
            this.goLoadPending(this.unitId);
        }, this.delay);
    }
    stop() {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
    }
    goLoadPending(unitId) {
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    this.loadPending(json.pendingList);
                },
            },
            params: [
                {
                    t: "setMethod",
                    element: "gt-pending",
                    method: "load-pending",
                    name: "",
                    eparams: {
                        unitId: unitId,
                    },
                    iToken: "f",
                },
            ],
        });
    }
    loadPending(data) {
        this.main.text("");
        /*
        this.main.create("div").text("Unidad");
        this.main.create("div").text("Comando");
        this.main.create("div").text("Hora");
        this.main.create("div").text("");
        this.main.create("div").text("");
        */
        data.forEach(item => {
            const row = this.main.create("div").addClass("row");
            row.create("div").text(item.unit_name).on("click", (event) => {
                if (item.unit_id) {
                    this.unitPanel.setUnit(item.unit_id);
                    this.unitPanel.showUnit3(item.unit_id);
                }
            });
            row.create("div").text(item.command);
            row.create("div").text("05/05/2021 16:25:00");
            row.create("div").addClass("send").text("SEND")
                .on("click", (event) => {
                this.send(item.unit_id, item.command_id, item.index, item.mode);
            });
            row.create("div").addClass("delete").text("DELETE")
                .on("click", (event) => {
                if (confirm("Seguro")) {
                    this.goDeletePending(item.unit_id, item.id);
                }
            });
        });
    }
    send(unitId, commandId, index, mode) {
        if (!this.socket) {
            new Float.Message({
                "caption": "Socket",
                "text": "Socket not Connected",
                "className": "",
                "delay": 3000,
                "mode": "",
                "left": "center",
                "top": "top"
            }).show({});
            return;
        }
        this.socket.sendCommand({
            type: "CS",
            unitId: Number.parseInt(unitId, 10),
            commandId: Number.parseInt(commandId, 10),
            index: Number.parseInt(index, 10),
            mode: Number.parseInt(mode, 10),
        });
        new Float.Message({
            "caption": "Pending",
            "text": "Sending Pending Command",
            "className": "",
            "delay": 3000,
            "mode": "",
            "left": "center",
            "top": "top"
        }).show({});
    }
    goDeletePending(unitId, id) {
        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    if (!json.error) {
                        new Float.Message({
                            "caption": "Pending",
                            "text": json.message,
                            "className": "",
                            "delay": 3000,
                            "mode": "",
                            "left": "center",
                            "top": "top"
                        }).show({});
                        if (json.pendingList) {
                            this.loadPending(json.pendingList);
                        }
                    }
                    else {
                        new Float.Message({
                            "caption": "Pending - ERROR",
                            "text": json.message,
                            "className": "",
                            "delay": 3000,
                            "mode": "",
                            "left": "center",
                            "top": "top"
                        }).show({});
                    }
                },
            },
            params: [
                {
                    t: "setMethod",
                    mode: "element",
                    element: "gt-pending",
                    method: "delete-pending",
                    name: "",
                    eparams: {
                        unitId,
                        id
                    },
                    iToken: "f",
                }
            ],
        });
    }
}
//# sourceMappingURL=Pending.js.map