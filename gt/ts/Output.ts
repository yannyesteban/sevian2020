import { _sgQuery as $, SQObject } from "../../Sevian/ts/Query.js";
import { Menu as Menu } from "../../Sevian/ts/Menu2.js";
import { Float } from "../../Sevian/ts/Window.js";

import {
    I,
    Input,
    Hidden,
    InputDate,
    InputInfo,
    Multi,
} from "../../Sevian/ts/Input.js";
import { Form2 as Form } from "../../Sevian/ts/Form2.js";
import { Tab } from "../../Sevian/ts/Tab.js";
import { S } from "../../Sevian/ts/Sevian.js";
import { InfoComm } from "./InfoMenu.js";
import { Communication } from "./Communication.js";
import { UnitConfig } from "./UnitConfig.js"


export class Output {
    public id: any = null;
    public caption: string = "";
    public formId: string = "form-" + String(new Date().getTime());
    public formAId: string = "forma-" + String(new Date().getTime());
    public formWId: string = "formw-" + String(new Date().getTime());
    public formMId: string = "formm-" + String(new Date().getTime());
    public formIds = {};

    public className: any = null;
    private main: SQObject = null;

    private wins: any[] = [];

    private commandConfig: any = null;
    private unitConfig: any = null;
    private unitPending: any = null;
    private eventList: any = null;
    private commandList: any = null;

    private form: Form = null;
    private forms: { [key: string]: Form } = {};

    private unitId: number = null;
    private unitName: string = "";
    private index: number = 100;
    private eventId: number = null;

    //private listCommand["0"]: any;
    private tab: Tab = null;
    private tabs: any[] = [];

    private listCommand: any[] = [];


    private socketId: string = "";
    private socket: Communication = null;

    private unitPanelId: string = "";
    private unitPanel: any = null;


    constructor(info: Output) {

        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        if (this.id === null) {
           this.id = "output-" + String(new Date().getTime());
        }
        let main = this.id ? $(this.id) : null;

        if (!main) {
            main = $.create("div").attr("id", this.id);
        }

        if (this.unitPanelId) {
            this.unitPanel = S.getElement(this.unitPanelId);

            this.unitPanel.onOutput = (unitId: number) => {

                this.show(unitId);
            };
        }

        if (this.socketId) {

            this.socket = S.getElement(this.socketId) as Communication;

        }

        //this.formIds["0"] = "form-" + String(new Date().getTime());

        this.create(main);

    }

    public create(main: SQObject) {

        main.addClass("pending-tool");

        this.main = main;

        this.wins["main"] = new Float.Window({
            visible: true,
            caption: "Output",
            left:'right',
			top:'bottom',
			deltaX: -50 - 350,
			deltaY:-140 - 20,
            width: "330px",
            height: "120px",

            mode: "auto",
            className: ["sevian"],
            child: this.main
        });

    }

    public getUnit() {
        if (this.unitPanel) {
            return this.unitPanel.getLastUnit();
        }

        return null;

    }

    public show(unitId?) {

        if (unitId == 0 || unitId === undefined) {
            this.goLoadPending(0);
            this.wins["main"].setCaption(`${this.caption} : Todos`);
            this.wins["main"].show({left:"center", top:"middle"});
            return;
        }

        let unitName = "";

        if (this.unitPanel) {
            unitName = this.unitPanel.getUnitInfo(unitId).unitName;
        }

        this.goLoadPending(unitId);

        this.wins["main"].setCaption(`${this.caption} : ${unitName}`);
        this.wins["main"].show({left:"center", top:"middle"});

    }

    public setUnitId(unitId) {
        this.unitId = unitId;
    }
    public getUnitId() {
        return this.unitId;
    }









    private goLoadPending(unitId: number) {
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


    private loadPending(data) {

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

            row.create("div").text(item.unit_name);
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

    public send(unitId, commandId, index, mode) {

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

    public goDeletePending(unitId, id) {




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


                    } else {
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
