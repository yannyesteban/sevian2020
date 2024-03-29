import { _sgQuery as $, SQObject } from "../../Sevian/ts/Query.js";
import { Menu as Menu } from "../../Sevian/ts/Menu2.js";
import { Float } from "../../Sevian/ts/Window.js";

import { Event } from './Event.js';

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
import { Grid2 } from "../../Sevian/ts/Grid2.js";


export class EventAdmin {
    public id: any = null;
    public caption: string = "";
    public formId: string = "form-" + String(new Date().getTime());
    public gridId: string = "grid-" + String(new Date().getTime());


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
    private eventList: any = [];
    private commandList: any = null;

    private form: Form = null;
    private forms: { [key: string]: Form } = {};

    private unitId: number = null;
    private page: number = 1;
    private unitName: string = "";
    private index: number = -1;
    private eventId: number = null;

    //private listCommand["0"]: any;
    private tab: Tab = null;
    private tabs: any[] = [];

    private listCommand: any[] = [];


    private socketId: string = "";
    private socket: Communication = null;

    private unitPanelId: string = "";
    private unitPanel: any = null;

    private eventPanelId:string = "";

    private dateFrom:string = "";
    private dateTo:string = "";

    private mode:string = "0";
    private status:string = "-1";

    constructor(info: EventAdmin) {

        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        if (this.id === null) {
           this.id = "event-admin-" + String(new Date().getTime());
        }
        let main = this.id ? $(this.id) : null;

        if (!main) {
            main = $.create("div").attr("id", this.id);
        }

        const ele = S.getElement(this.unitPanelId);
        if (this.unitPanelId && ele ) {

            this.unitPanel = ele;
            this.unitPanel.addEvent((unitId: number) => {

                if (this.wins["main"].getVisible()) {
                    this.show(unitId);
                }

            });

        }

        if (this.socketId) {

            this.socket = S.getElement(this.socketId) as Communication;

        }

        //this.formIds["0"] = "form-" + String(new Date().getTime());

        this.create(main);

    }

    public create(main: SQObject) {

        main.addClass("output-tool");
        main.addClass("report-tool");

        this.main = main;

        this.wins["main"] = new Float.Window({
            visible: false,
            caption: "Event Admin",
            left:'right',
			top:'bottom',
			deltaX: -50 - 350,
			deltaY:-140 - 20,
            width: "330px",
            height: "300px",

            mode: "auto",
            className: ["sevian"],
            child: this.main
        });

        //this.show(4031);


    }

    public getEventPanel():Event{

        return S.getElement(this.eventPanelId) as Event;
    }

    public getUnit() {
        if (this.unitPanel) {
            return this.unitPanel.getLastUnit();
        }

        return null;

    }

    public show(unitId?) {
        if (unitId == 0 || unitId === undefined) {

            unitId = this.getUnit();


        }

        if (!unitId) {
            alert("unit not found!!!");
            return;
        }


        let unitName = "";

        if (this.unitPanel) {
            unitName = this.unitPanel.getUnitInfo(unitId).unitName;
        }

        this.unitId = unitId;



        this.wins["main"].setCaption(`${this.caption} : ${unitName}`);
        this.wins["main"].show({ left: "center", top: "middle" });



        const dateZero = new Date(Date.now() - ((new Date().getTimezoneOffset()+120)) * 60000);
        const date = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000);

        this.dateFrom = dateZero.toISOString().substring(0,10) + " " + dateZero.toISOString().substring(11,19);
        this.dateTo = date.toISOString().substring(0,10) + " " + date.toISOString().substring(11,19);


        this.goLoadEvents(unitId);

    }

    public setUnitId(unitId) {
        this.unitId = unitId;
    }
    public getUnitId() {
        return this.unitId;
    }
    private goLoadEvents(unitId?: number, dateFrom?, dateTo?, eventId?, page?:number) {


        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json);
                    if (!this.form) {
                        this.createForm(json);
                    }

                    this.createGrid(json);

                }
            },

            params: [
                {
                    t: "setMethod",
                    id:this.id,
                    element: "gt-event_admin",
                    method: "get-events",
                    name: "events",
                    eparams: {
                        unitId,
                        dateFrom: this.dateFrom,
                        dateTo: this.dateTo,
                        eventId,
                        page:1,
                        mode: this.mode,
                        status: this.status,


                    },
                    iToken: "f",
                },
            ],
        });
    }


    private loadListEvent(eventList) {

        this.listCommand["0"].setOptionsData(
            [['', ' - ']].concat(eventList

                .map((e) => {
                    return [e.number, e.number + ": " + e.name/*, "*", e.status*/];
            }))
        );

    }
    private createForm(json) {
        
        
        const dateZero = new Date(Date.now() - ((new Date().getTimezoneOffset()+120)) * 60000);
        const date = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000);
        
        const form = this.form = new Form({
            id:this.formId,
            target: this.main,
            caption: "search",
            fields: [
                {
                    name: "dateFrom",
                    caption: "Desde",
                    input: "input",
                    type:"date",
                    value: dateZero.toISOString().substring(0,10)
                },
                {
                    name: "timeFrom",
                    caption: "",
                    input: "input",
                    type:"time",
                    value: "00:00:00",//dateZero.toISOString().substring(11,19)
                },
                {
                    name: "dateTo",
                    caption: "Hasta",
                    input: "input",
                    type:"date",
                    value: date.toISOString().substring(0,10)
                },
                {
                    name: "timeTo",
                    caption: "",
                    input: "input",
                    type:"time",
                    value: "23:59:59",//date.toISOString().substring(11,19)
                },
                {
                    name: "eventId",
                    caption: "Tipo de Evento",
                    input: "input",
                    type: "select",
                    data: [['', ' - Todos']].concat(json.eventList

                        .map((e) => {
                            return [e.event_id, e.event_id + ": " + e.name/*, "*", e.status*/];
                    }))
                },
                {
                    name: "status",
                    caption: "Status",
                    input: "input",
                    type: "select",
                    value: "-1",
                    data: [['-1', ' - Todos'], ['0', 'No leído'], ['1', 'Leído'], ['2', 'Eliminado']]
                },
                {
                    name: "mode",
                    caption: "Bandeja",
                    input: "input",
                    type: "select",
                    value: "0",
                    data: [['0', ' - Todos'], ['1', 'Unit'], ['2', 'Evento'], ['4', 'Alarma']]
                },
                {
                    name: "unitId",
                    caption: "Unidad",
                    input: "input",
                    type: "hidden",
                    value:json.unitId
                }
            ],
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        caption: "Buscar",
                        action: (item, event) => {
                            
                            const unitId = this.getUnitId();
                            
                            const dateFrom = form.getInput("dateFrom").getValue();
                            const dateTo = form.getInput("dateTo").getValue();

                            const timeFrom = form.getInput("timeFrom").getValue();
                            const timeTo = form.getInput("timeTo").getValue();

                            const eventId = form.getInput("eventId").getValue();
                            
                            this.dateFrom = dateFrom + " " + timeFrom;
                            this.dateTo = dateTo + " " + timeTo;

                            this.mode = form.getInput("mode").getValue();
                            this.status = form.getInput("status").getValue();
                            
                            this.goLoadEvents(unitId, dateFrom, dateTo, eventId, this.page);
                        },
                    },
                ]
            }
        })
    }

    private createGrid(json) {


        const grid = new Grid2({
            id: this.gridId,
            target:this.main,
            caption: "",
            data: json.events,
            type: "default",
            actionButton: false,
            deleteButton: false,
            allowSearch: false,
            allowPaginator: false,
            selectMode: "",
            className: "event-admin",
            action:(index) => {
                
                if(json.events[index].tracking_id){
                    this.getEventPanel().showEvent(json.events[index].id);
                }
                
            },
            fields: [
                {
                    name: "f_date",
                    caption: "Date"
                },

                {
                    name: "event_name",
                    caption: "Title"
                },
                               {
                    name: "status_name",
                    caption: "Status"
                },
                {
                    name: "info",
                    caption: "Info"
                },
                {
                    name: "message",
                    caption: "Message"
                },
                {
                    name: "user",
                    caption: "User"
                },
                {
                    name: "alarm",
                    caption: "Alarma"
                },
                {
                    name: "event",
                    caption: "Event"
                },



            ]

        });

    }

    private goLoadPage(unitId: number, index?) {

        if (index < 0 && $(this.formId)) {
            $(this.formId).text("...");
        }
        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    this.loadPage(json);
                    if (json.command) {
                        this.loadForm(json.command, 0, index);
                    }

                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-output",
                    method: "get-outputs",
                    name: "",
                    eparams: {
                        unitId,
                        index

                    },
                    iToken: "f",
                },
            ],
        });
    }

    private loadPage(info) {
        if (info.list) {
            this.eventList = info.list;
            this.listCommand["0"].setOptionsData(
                [['', ' - ']].concat(info.list

                    .map((e) => {
                        return [e.number, e.number + ": " + e.name/*, "*", e.status*/];
                }))
            );
        }
    }

    private getIndexName(index) {

        if (this.eventList) {
            const item = this.eventList.find(e => e.number == index);
            if (item) {
                return item.name;
            }
        }
        return "";
    }


    private loadForm(command, type, index) {

        const fields = [];

        fields.push({
            caption: "[Description]",
            name: "name",
            input: "input",
            type: "text",
            value: command.name,
        });

        command.fields.forEach((item, index2: number) => {


            /*

            const data = command.paramData
                .filter((e) => e.param_id == item.id)
                .map((e) => {
                    return [e.value, e.title || e.value];
                });

        */
            const info: any = {
                caption: item.label || item.param,
                name: `param_${index2}`,
                input: "input",
                type: "text",
                value: item.value,
                dataset: { type: "param" }
            };

            if (command.indexField && item.name == command.indexField) {
                info.type = "hidden";
                /*info.data = range;
                        info.events = {change: (event) => {
                            this.setIndex(event.currentTarget.value);
                            this.start();
                        }};*/
                info.value = index;


            }

            if (item.type == "select") {
                info.type = "select";
                info.data = item.data;
                fields.push(info);
                return;
            }

            if (item.type == "bit") {
                info.input = "multi";
                info.type = "checkbox";
                info.data = item.data;

                info.check = (value, inputs) => {
                    inputs.forEach((input: HTMLInputElement) => {
                        if (
                            (parseInt(value, 10) & parseInt(input.value, 10)) ==
                            parseInt(input.value)
                        ) {
                            input.checked = true;
                        } else {
                            input.checked = false;
                        }
                    });
                };

                info.onchange = function (item) {
                    const parent = $(item.get().parentNode.parentNode);

                    let input = parent.queryAll("input.option:checked");
                    if (input) {
                        let str = 0;

                        input.forEach((i) => {
                            str += Number(i.value);
                        });
                        this._input.val(str);
                    }
                };

                fields.push(info);
                return;
            }

            fields.push(info);
        });

        let params = "";
        if (command.params) {
            params = JSON.stringify(command.params);
        }

        fields.push({
            caption: "ID",
            name: "id",
            input: "input",
            type: "hidden",
            value: command.id,
        });

        fields.push({
            caption: "Unit ID",
            name: "unit_id",
            input: "input",
            type: "hidden",
            value: command.unit_id,
        });

        fields.push({
            caption: "Command ID",
            name: "command_id",
            input: "input",
            type: "hidden",
            value: command.command_id,
        });

        fields.push({
            caption: "Index",
            name: "index",
            input: "input",
            type: "hidden",
            value: index,
        });

        fields.push({
            caption: "Status",
            name: "status",
            input: "input",
            type: "hidden",
            value: command.status,
            default: 1
        });

        fields.push({
            caption: "Params",
            name: "params",
            input: "input",
            type: "hidden",
            value: params,
        });

        fields.push({
            caption: "Mode",
            name: "mode",
            input: "input",
            type: "hidden",
            value: 1,
        });

        fields.push({
            caption: "__mode_",
            name: "__mode_",
            input: "input",
            type: "hidden",
            value: command.__mode_,
        });

        fields.push({
            caption: "__record_",
            name: "__record_",
            input: "input",
            type: "hidden",
            value: (command.__record_ != "") ? JSON.stringify(command.__record_) : "",
        });

        fields.push({
            caption: "command_name",
            name: "command_name",
            input: "input",
            type: "hidden",
            value: command.command,
        });


        const form = this.forms[type] = new Form({
            target: this.main,//this.tabs[type],
            id: this.formId,
            caption: command.command + ": "+ this.getIndexName(index),
            fields: fields,
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal", `type-${type}`],
                items: [
                    {
                        caption: "Save",
                        action: (item, event) => {

                            let params = {};

                            command.fields.forEach((element, index: number) => {

                                params[`param_${index}`] = form.getInput(`param_${index}`).getValue();
                            });
                            form.getInput("status").setValue(1);
                            form.getInput("mode").setValue(1);
                            form.getInput("params").setValue(JSON.stringify(params));
                            this.goSave(type);
                        },
                    },
                    {
                        caption: "Send",
                        action: (item, event) => {
                            let params = {};



                            command.fields.forEach((element, index: number) => {

                                params[`param_${index}`] = form.getInput(`param_${index}`).getValue();
                            });
                            form.getInput("status").setValue(1);
                            form.getInput("mode").setValue(1);

                            form.getInput("params").setValue(JSON.stringify(params));
                            this.goSave(type, true);
                        },
                    }

                ],
            },
        });
        if (command.__mode_ == 2) {



            form.setValue(command.params);
        }

        form.setMode(command.status);


    }

    public goSave(type, send?) {

        const form = this.forms[type];

        const unitId = form.getInput("unit_id").getValue();
        const commandId = form.getInput("command_id").getValue();
        const index = form.getInput("index").getValue();
        const mode = form.getInput("mode").getValue();


        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            form: form.getFormData(),
            blockingTarget: this.main,
            requestFunctions: {

                f2: (json) => {



                    this.loadPage(json);
                    if (json.command) {
                        this.loadForm(json.command, 0, index);
                    }


                    if (send) {
                        this.send(unitId, commandId, index, mode);
                    }
                },
            },
            params: [
                {
                    t: "setMethod",
                    mode: "element",
                    element: "s-form",
                    method: "save",

                    name: "/gt/forms/unit_command",
                    eparams: {},
                    iToken: "f2",
                },

                {
                    t: "setMethod",
                    element: "gt-output",
                    method: "get-outputs",//(type == "0") ? "get-event" : "get-command",
                    name: "",
                    eparams: {
                        unitId,
                        commandId,
                        index,
                        mode,
                        type,
                    },
                    iToken: "f2",
                }
            ],
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




}
