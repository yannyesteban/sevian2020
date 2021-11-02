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
import { CommandExport } from "./CommandExport.js";
import { CommandImport } from "./CommandImport.js";


export class Report {
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
    private commandExport: CommandExport = null;
    private commandImport: CommandImport = null;

    constructor(info: Report) {
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }



        let main = this.id ? $(this.id) : null;

        if (!main) {
            main = $.create("div").attr("id", this.id);
        }

        if (this.socketId) {

            this.socket = S.getElement(this.socketId) as Communication;
            this.socket.callOnMessage = (json) => {

                this.decodeMessage(json);
            };

        }

        if (this.unitPanelId) {
            this.unitPanel = S.getElement(this.unitPanelId);

            this.unitPanel.addEvent((unitId: number) => {

                if (this.wins["main"].getVisible()) {
                    this.show(unitId);
                }

            });

            this.unitPanel.onGetPosition = (unitId: number) => {
                this.goCommandId(null, 2);
            };
            this.unitPanel.onReset = (unitId: number) => {
                this.goCommandId(null, 3);
            };
            this.unitPanel.onCall = (unitId: number) => {
                this.goCommandId(null, 4);
            };
            this.unitPanel.onAny = (unitId: number, type: string) => {
                this.doAny(unitId, type);
            };
        }

        this.formIds["0"] = "form-" + String(new Date().getTime());
        this.formIds["A"] = "form-a" + String(new Date().getTime());
        this.formIds["W"] = "form-w" + String(new Date().getTime());
        this.formIds["M"] = "form-m" + String(new Date().getTime());
        this.formIds["params"] = "form-p" + String(new Date().getTime());
        this.create(main);


    }

    public create(main: SQObject) {
        main.addClass("report-tool");

        this.main = main;

        this.tab = new Tab({
            target: main,
            className: "tab-tool",
            onOpen: (index) => {
                if (index == 5) {
                    this.commandExport.init(this.unitId);
                } else if (index == 6) {
                    this.commandImport.init(this.unitId);
                }

            }
        });

        this.tabs["A"] = this.tab.add({
            caption: "Configuración",
            tagName: "div",
            active: true,
        });
        this.tabs["M"] = this.tab.add({ caption: "Info", tagName: "form" });
        this.tabs["W"] = this.tab.add({ caption: "Equipo", tagName: "form" });
        this.tabs["0"] = this.tab.add({ caption: "Eventos", tagName: "form" });

        this.unitConfig = new UnitConfig({

            tagMain : "form"
        });


        this.commandExport = new CommandExport({});
        this.commandImport = new CommandImport({});

        this.tab.add({ caption: "Reportar", tagName: "form", set:this.unitConfig.get() });
        this.tab.add({ caption: "Exp", tagName: "form", set: this.commandExport.get() });
        this.tab.add({ caption: "Imp", tagName: "form", set: this.commandImport.get() });

        this.wins["main"] = new Float.Window({
            visible: false,
            caption: this.caption,
            child: main,
            left: 10,
            top: 100,
            width: "280px",
            height: "250px",
            mode: "auto",
            className: ["sevian"],
        });

        //main.style("height", "300px");
        /*
        this.wins["main"].getMain().on("dblclick", (event) => {

            this.show(4032, 0);

        });
        */
        this.wins["params"] = new Float.Window({
            visible: false,
            caption: "PARAMS",
            //child: main,
            left: 10,
            top: 100,
            width: "280px",
            height: "250px",
            mode: "auto",
            className: ["sevian", "flex"],
        });

        this.wins["params"].getBody().addClass("report-tool");



        this.listCommand["0"] = new Input({
            target: this.tabs["0"],
            input: "input",
            type: "select",
            name: "event_list",
            value: "1",
            caption: "Alarmas",
            data: [
                [100, 100],
                [101, 101],
            ],

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.setIndex(event.currentTarget.value);
                    //this.goConfig(this.unitId, this.index, 1, "0");
                    this.goGetCommand(this.unitId, null, event.currentTarget.value, "0", 1);

                    //this.goGetCommand(this.unitId, event.currentTarget.value, 0, "0", 1);
                },
            },
        });



        this.listCommand["A"] = new Input({
            target: this.tabs["A"],
            input: "input",
            type: "select",
            name: "list_command_a",
            value: "",
            caption: "",
            data: [
                [100, 100],
                [101, 101],
            ],

            onAddOption: (option, data) => {

                if (data[3] !== undefined) {

                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.goGetCommand(this.unitId, event.currentTarget.value, 0, "A", 1);
                },
            },
        });

        this.listCommand["W"] = new Input({
            target: this.tabs["W"],
            input: "input",
            type: "select",
            name: "list_command_w",
            value: "",
            caption: "",
            data: [
                [100, 100],
                [101, 101],
            ],

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.goGetCommand(this.unitId, event.currentTarget.value, 0, "W", 0);
                },
            },
        });

        this.listCommand["M"] = new Input({
            target: this.tabs["M"],
            input: "input",
            type: "select",
            name: "list_command_m",
            value: "",
            caption: "",
            data: [
                [100, 100],
                [101, 101],
            ],

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.goGetCommand(this.unitId, event.currentTarget.value, 0, "M", 0);
                },
            },
        });
    }

    public show(unitId?, index?: number) {

        if (index !== undefined) {
            this.index = index;
        }

        let last = null;


        try {
            $(this.formIds["0"]).text("");
            $(this.formIds["A"]).text("");
            $(this.formIds["M"]).text("");
            $(this.formIds["W"]).text("");
        } catch (e) {

        }



        if (unitId !== undefined) {
            this.unitId = unitId;
        } else if (last = this.unitPanel.getLastUnit()) {
            this.unitId = last;

        }

        if (this.unitPanel && this.unitId) {
            this.unitName = this.unitPanel.getUnitInfo(this.unitId).unitName;
        }



        /*
        this.start(this.unitId, this.index);
        this.wins["main"].show();
        return;
        */

        if (this.unitId) {
            this.unitConfig.init(this.unitId);
            this.start(this.unitId, this.index);
            this.wins["main"].setCaption(`${this.caption} : ${this.unitName}`);
            this.wins["main"].show();
        } else {
            alert("no unit selected!!!")
        }
    }

    public setUnitId(unitId) {
        this.unitId = unitId;
    }
    public getUnitId() {
        return this.unitId;
    }
    public setIndex(index) {
        this.index = index;
    }
    public getIndex(index) {
        return this.index;
    }

    public init(json: any) {
        this.iniLists(json.eventList, json.commandList, false);
    }
    public start(unitId?: number, index?: number) {
        if (unitId !== undefined) {
            this.unitId = unitId;
        }

        if (index !== undefined) {
            this.index = index;
        }

        this.goInit(this.unitId, this.index, 0);
    }

    private loadTab(command, type) {

        if(type == "0"){
            this.listCommand[type].setValue(command.index);
        }else{
            this.listCommand[type].setValue(command.command_id);
        }

        this.tabs[type].ds("mode", command.status);

        this.loadForm(command, type, command.index);



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
                /*,rules:{
                    required:{}
                }*/
            };

            if (command.indexField && item.name == command.indexField) {
                info.type = "text";
                /*info.data = range;
                        info.events = {change: (event) => {
                            this.setIndex(event.currentTarget.value);
                            this.start();
                        }};*/
                info.value = this.index;

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
        let query = "";
        if (command.query) {
            params = JSON.stringify(command.query);
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
            caption: "Query",
            name: "query",
            input: "input",
            type: "hidden",
            value: query,
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
            target: this.tabs[type],
            id: this.formIds[type],
            caption: command.command,
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
                            form.getInput("status").setValue(0);
                            form.getInput("mode").setValue(1);
                            form.getInput("params").setValue(JSON.stringify(params));
                            this.goSave(type);
                        },
                    },
                    {
                        caption: "Send",
                        action: (item, event) => {
                            let params = {};

                            if(command.level > 0){

                                if(command.level == 2){
                                    alert("this command is very sensitive !");
                                }
                                if(!confirm("Are you sure?")){
                                    return;
                                }
                            }

                            command.fields.forEach((element, index: number) => {

                                params[`param_${index}`] = form.getInput(`param_${index}`).getValue();
                            });
                            form.getInput("status").setValue(1);
                            form.getInput("mode").setValue(1);

                            form.getInput("params").setValue(JSON.stringify(params));
                            this.goSave(type, true);
                        },
                    },
                    {
                        caption: "Recibir",
                        action: (item, event) => {
                            let params = {};


                            command.fields.forEach((element, index2: number) => {

                                params[`param_${index2}`] = form.getInput(`param_${index2}`).getValue();
                            });
                            form.getInput("status").setValue(1);
                            form.getInput("mode").setValue(2);

                            form.getInput("params").setValue(JSON.stringify(params));

                            if(form.getInput("index").getValue()>0){
                                form.getInput("query").setValue(JSON.stringify({
                                    param_0:form.getInput("index").getValue()
                                    }));
                            }
                            this.goSave(type, true);

                            return;


                            form.getInput("mode").setValue(2);
                            this.goSaveCommand(type, "", true);
                        },
                    },
                    {
                        caption: "Config",
                        action: (item, event) => {

                            this.goGetValue(command.unit_id, command.command_id, command.index);
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

    private iniLists(eventList, commandList, type) {
        if (type == "params") {
            return;
        }
        if (type === false) {

            this.listCommand["0"].setOptionsData([['', ' - ']].concat(eventList));

            this.listCommand["A"].setOptionsData(
                [['', ' - ']].concat(commandList
                    .filter((e) => e.type == "A")
                    .map((e) => {
                        return [e.id, e.command, "*", e.status];
                    }))
            );
            this.listCommand["W"].setOptionsData(
                [['', ' - ']].concat(commandList
                    .filter((e) => e.type == "W")
                    .map((e) => {
                        return [e.id, e.command, "*", e.status];
                    }))
            );
            this.listCommand["M"].setOptionsData(
                [['', ' - ']].concat(commandList
                    .filter((e) => e.type == "M")
                    .map((e) => {
                        return [e.id, e.command, "*", e.status];
                    }))
            );
        } else if (type == "0") {
            this.listCommand["0"].setOptionsData([['', ' - ']].concat(eventList));
        } else {
            this.listCommand[type].setOptionsData(
                [['', ' - ']].concat(commandList
                    .filter((e) => e.type == type)
                    .map((e) => {
                        return [e.id, e.command, "*", e.status];
                    }))
            );
        }

    }

    private goInit(unitId: number, index: number, mode?: number) {
        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    this.iniLists(json.eventList, json.commandList, false);
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "init",
                    name: "",
                    eparams: {
                        unitId: unitId,
                        index: index,
                        mode: mode,
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private goConfig(unitId: number, index: number, mode: number, type: string) {
        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {

                f: (json) => {
                    this.iniLists(json.eventList, json.commandList, type);
                    this.createForm(json.command, type);

                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: (type == "0") ? "get-event" : "get_command",
                    name: "",
                    eparams: {
                        unitId: unitId,
                        index: index,
                        mode: mode,
                        type: type

                    },
                    iToken: "f",
                },
            ],
        });
    }

    private goGetCommand(
        unitId: number,
        commandId: number,
        index: number,
        type: string, mode: number
    ) {




        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    console.log(json)
                    this.iniLists(json.eventList, json.commandList, type);

                    this.loadTab(json.command, type);
                    //this.loadForm(json.command, type, index);
                    //this.createForm(json.command, type);
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-command",
                    name: "",
                    eparams: {
                        unitId,
                        commandId,
                        index,
                        mode,
                        type
                    },
                    iToken: "f",
                },
            ],
        });
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
                f: (json) => {
                    if (type == "0") {
                        this.iniLists(json.eventList, json.commandList, type);
                        this.createMainForm(json.command)
                    } else {
                        this.iniLists(json.eventList, json.commandList, type);
                        this.createCommandForm(json.command, type);
                    }

                },
                goSave: (json) => {
                    this.iniLists(json.eventList, json.commandList, type);
                    //this.createForm(json.command, type);
                    this.loadTab(json.command, type);

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
                    iToken: "goSave",
                },

                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-command",//(type == "0") ? "get-event" : "get-command",
                    name: "",
                    eparams: {
                        unitId: unitId,
                        commandId: commandId,
                        index: index,
                        mode: mode,
                        type: type,
                    },
                    iToken: "goSave",
                }
            ],
        });
    }

    public goSaveCommand(type, params, send?) {

        const form = this.forms[type];

        const unitId = form.getInput("unit_id").getValue();
        const commandId = form.getInput("command_id").getValue();
        const index = form.getInput("index").getValue();
        const mode = 2;


        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            form: form.getFormData(),
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    if (type == "0") {
                        this.iniLists(json.eventList, json.commandList, type);
                        this.createMainForm(json.command)
                    } else {
                        this.iniLists(json.eventList, json.commandList, type);
                        this.createCommandForm(json.command, type);
                    }

                },
                goSaveCommand: (json) => {
                    if (!json.message) {
                        new Float.Message({
                            "caption": "Command",
                            "text": "Record was saved!!!",
                            "className": "",
                            "delay": 3000,
                            "mode": "",
                            "left": "center",
                            "top": "top"
                        }).show({});
                        if (send) {
                            this.send(unitId, commandId, index, mode);

                            if (mode == 2) {

                            }
                        }
                    } else {
                        new Float.Message({
                            "caption": "Command",
                            "text": "Record wasn't saved!!!!",
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
                    element: "gt-report",
                    method: "save-command",

                    name: "",
                    eparams: {
                        unitId: unitId,
                        commandId: commandId,
                        index: index,
                        mode: mode,
                        type: type,
                        params: params
                    },
                    iToken: "goSaveCommand",
                }
            ],
        });
    }

    public goSaveRapidCommand(form, params, unitId, commandId, index, mode, send) {


        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            //form: (form)?form.getFormData():null,
            blockingTarget: this.main,
            requestFunctions: {

                goSaveRapidCommand: (json) => {

                    if (!json.message) {
                        new Float.Message({
                            "caption": "Command",
                            "text": "Record was saved!!!",
                            "className": "",
                            "delay": 3000,
                            "mode": "",
                            "left": "center",
                            "top": "top"
                        }).show({});
                        if (send) {
                            this.send(unitId, commandId, index, mode);
                        }
                    } else {
                        new Float.Message({
                            "caption": "Command",
                            "text": "Record wasn't saved!!!!",
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
                    element: "gt-report",
                    method: "save-command",

                    name: "",
                    eparams: {
                        unitId: unitId,
                        commandId: commandId,
                        index: index,
                        mode: mode,
                        type: "W",
                        params: params
                    },
                    iToken: "goSaveRapidCommand",
                }
            ],
        });
    }

    public goSave2(type, send?) {

        const form = this.forms[type];

        const unitId = form.getInput("unit_id").getValue();
        const commandId = form.getInput("command_id").getValue();
        const index = form.getInput("index").getValue();
        const mode = 2;


        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            form: form.getFormData(),
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    if (type == "0") {
                        this.iniLists(json.eventList, json.commandList, type);
                        this.createMainForm(json.command)
                    } else {
                        this.iniLists(json.eventList, json.commandList, type);
                        this.createCommandForm(json.command, type);
                    }

                },
                f2: (json) => {
                    this.iniLists(json.eventList, json.commandList, type);
                    this.createForm(json.command, type);

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
                    element: "gt-report",
                    method: (type == "0") ? "get-event" : "get-command",
                    name: "",
                    eparams: {
                        unitId: unitId,
                        commandId: commandId,
                        index: index,
                        mode: mode,
                        type: type,
                    },
                    iToken: "f2",
                }
            ],
        });
    }

    public goCommandId(unitId: number, role: number) {

        if (unitId === null) {
            unitId = this.getUnitId();
        }

        if (unitId === null) {
            unitId = this.unitPanel.getLastUnit();
        }

        if (unitId === null) {
            alert("ninguna Unidad seleccionada");
            return;
        }

        if (role === 3 && !confirm("Seguro de reiniciar la Unidad?")) {
            return;
        }

        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    if (json.commandId > 0) {
                        console.log("commnadId", json.commandId)
                        this.sendRapidCommand(role, unitId, json.commandId, json.command);
                    } else {
                        alert("error command not found")
                    }


                },

            },
            params: [


                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-command-id",
                    name: "",
                    eparams: {
                        unitId: unitId,
                        role: role


                    },
                    iToken: "f",
                }
            ],
        });
    }

    public goGetValue(unitId, commandId, index) {
        console.log(unitId, commandId, index);
        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json)
                    for (let x in this.forms) {
                        const commandId2 = this.forms[x].getInput("command_id").getValue();

                        if (commandId == commandId2) {
                            console.log(commandId)
                            this.forms[x].setValue(json);
                        }
                    }
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-values",
                    name: "",
                    eparams: {
                        unitId,
                        commandId,
                        index
                    },
                    iToken: "f",
                }
            ],
        });
    }

    private createForm(command, type) {
        if (type == "0") {
            //this.createMainForm(command);
            //this.loadTab(command, type);

            this.loadForm(command, type, command.index);

        } else if (type == "params") {

            this.createAuxForm(command, type);
        } else {
            this.loadTab(command, type);
        }
    }

    private createMainForm(command) {
        const type = "0";


        const indexField = command.indexField;



        this.listCommand[type].setValue(this.index);
        const id = command.id;
        const commandId = command.command_id;
        const unitId = command.unit_id;
        const index = command.index;
        const name = command.name;
        const status = command.status;
        const __mode_ = command.__mode_;
        const mode = command.mode;
        const fields = [];

        //const fields = this.commandConfig.params.fields.map((item) => {
        command.fields.forEach((item, index: number) => {
            //let input = "input";
            //let type = "text";
            //let caption = item.label;
            //let events = {};
            //let value = item.value || "";
            //console.log(item.name, item.value);

            const info: any = {
                caption: item.label,
                name: `param_${index}`,
                input: "input",
                type: "text",
                value: item.value,
            };

            if (item.name == indexField) {
                info.type = "hidden";
                /*info.data = range;
                        info.events = {change: (event) => {
                            this.setIndex(event.currentTarget.value);
                            this.start();
                        }};*/
                info.value = this.index;
                fields.push(info);
                fields.push({
                    caption: "Description",
                    name: "name",
                    input: "input",
                    type: "text",
                    value: name,
                });
                return;
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

        let record = "";
        if (command.__record_) {
            record = JSON.stringify(command.__record_);
        }

        let params = "";
        if (command.params) {
            params = JSON.stringify(command.params);
        }

        fields.push({
            caption: "ID",
            name: "id",
            input: "input",
            type: "hidden",
            value: id,
        });
        fields.push({
            caption: "Unit ID",
            name: "unit_id",
            input: "input",
            type: "hidden",
            value: unitId,
        });
        fields.push({
            caption: "Command ID",
            name: "command_id",
            input: "input",
            type: "hidden",
            value: commandId,
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
            value: status,
        });
        fields.push({
            caption: "Mode",
            name: "mode",
            input: "input",
            type: "hidden",
            value: 1,
        });
        fields.push({
            caption: "Params",
            name: "params",
            input: "input",
            type: "hidden",
            value: params,
        });
        fields.push({
            caption: "__mode_",
            name: "__mode_",
            input: "input",
            type: "hidden",
            value: __mode_,
        });
        fields.push({
            caption: "__record_",
            name: "__record_",
            input: "input",
            type: "hidden",
            value: record,
        });
        fields.push({
            caption: "type_command",
            name: "type_command",
            input: "input",
            type: "hidden",
            value: type,
        });
        fields.push({
            caption: "command_name",
            name: "command_name",
            input: "input",
            type: "hidden",
            value: command.command,
        });
        fields.push({
            caption: "command_params",
            name: "command_params",
            input: "input",
            type: "hidden",
            value: JSON.stringify(command.fields.map(e => e.name)),
        });
        const form = this.forms[type] = new Form({
            target: this.tabs["0"],
            id: this.formIds["0"],
            caption: command.command,
            fields: fields,
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        caption: "Save",
                        action: (item, event) => {

                            let params = {};

                            command.fields.forEach((element) => {

                                params[element.name] = form.getInput(`pr_${element.name}`).getValue();
                            });
                            form.getInput("status").setValue(1);
                            form.getInput("params").setValue(JSON.stringify(params));
                            this.goSave(type);
                        },
                    },
                    {
                        caption: "Send",
                        action: (item, event) => {
                            let params = {};



                            command.fields.forEach((element) => {

                                params[element.name] = form.getInput(`pr_${element.name}`).getValue();
                            });

                            form.getInput("params").setValue(JSON.stringify(params));
                            form.getInput("status").setValue(2);
                            this.goSave(type, true);

                        },
                    },
                    {
                        caption: "Recibir",
                        action: (item, event) => {
                            let params = { event_id: index };
                            this.goSaveCommand(type, JSON.stringify(params), true);
                        },
                    }
                ],
            },
        });
        if (__mode_ == 2) {
            const params2 = {};


            for (let x in command.params) {
                params2["pr_" + x] = command.params[x];
            }

            command.params.forEach((item, index) => {
                params2[`param_${index}`] = item;
            });

            form.setValue(params2);
        }

        this.setMode(status);
    }

    public setMode(mode: number) {
        this.main.ds("mode", "mode-" + mode);
    }

    private createCommandForm(command, type) {

        let data = null;


        const id = command.id;
        const commandId = command.command_id;
        const unitId = command.unit_id;
        const index = command.index;
        const mode = command.mode;
        //const name = this.unitPending.name;
        const status = command.status;
        const __mode_ = command.__mode_;

        this.listCommand[type].setValue(commandId);

        let __record_ = "";
        if (command.__record_) {
            __record_ = JSON.stringify(command.__record_);
        }

        const fields = [];
        //const commandParams = [];

        //const fields = this.commandConfig.params.fields.map((item) => {
        command.fields.forEach((item, index: number) => {

            //commandParams.push(item.name);

            data = command.paramData
                .filter((e) => e.param_id == item.id)
                .map((e) => {
                    return [e.value, e.title || e.value];
                });


            const info: any = {
                caption: item.param,
                name: `param_${index}`,
                input: "input",
                type: "text",
                value: item.value,
                dataset: { type: "param" }
            };

            if (item.type == "select") {
                info.type = "select";
                info.data = data;
                fields.push(info);
                return;
            }

            if (item.type == "bit") {
                info.input = "multi";
                info.type = "checkbox";
                info.data = data;

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
            value: id,
        });
        fields.push({
            caption: "Unit ID",
            name: "unit_id",
            input: "input",
            type: "hidden",
            value: unitId,
        });
        fields.push({
            caption: "Command ID",
            name: "command_id",
            input: "input",
            type: "hidden",
            value: commandId,
        });
        fields.push({
            caption: "Index",
            name: "index",
            input: "input",
            type: "hidden",
            value: index,
        });
        fields.push({
            caption: "Mode",
            name: "mode",
            input: "input",
            type: "hidden",
            value: mode,
        });

        fields.push({
            caption: "Status",
            name: "status",
            input: "input",
            type: "hidden",
            value: status,
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
            caption: "__mode_",
            name: "__mode_",
            input: "input",
            type: "hidden",
            value: __mode_,
        });
        fields.push({
            caption: "__record_",
            name: "__record_",
            input: "input",
            type: "hidden",
            value: __record_,
        });
        fields.push({
            caption: "type_command",
            name: "type_command",
            input: "input",
            type: "hidden",
            value: type,
        });
        fields.push({
            caption: "command_name",
            name: "command_name",
            input: "input",
            type: "hidden",
            value: command.command,
        });
        fields.push({
            caption: "command_params",
            name: "command_params",
            input: "input",
            type: "hidden",
            value: JSON.stringify(command.fields.map(e => e.name)),
        });
        const form = this.forms[type] = new Form({
            target: this.tabs[type],
            id: this.formIds[type],
            caption: command.command,
            fields: fields,
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        caption: "Save",
                        action: (item, event) => {

                            let params = {};



                            command.fields.forEach((element) => {

                                params[element.name] = form.getInput(element.name).getValue();
                            });
                            form.getInput("status").setValue(1);
                            form.getInput("params").setValue(JSON.stringify(params));
                            this.goSave(type);
                        },
                    },
                    {
                        caption: "Send",
                        action: (item, event) => {
                            let params = {};



                            command.fields.forEach((element) => {

                                params[element.name] = form.getInput(element.name).getValue();
                            });

                            form.getInput("params").setValue(JSON.stringify(params));
                            form.getInput("status").setValue(2);
                            this.goSave(type, true);
                        },
                    },
                    {
                        caption: "Recibir",
                        action: (item, event) => {


                            this.goSaveCommand(type, "", true);
                        },
                    },

                ],
            },
        });
        if (__mode_ == 2) {
            console.log(command.params);


            form.setValue(command.params);
        }

        form.setMode(status);
        this.tabs[type].ds("mode", status);
        //this.setMode(status);
    }


    public send(unitId, commandId, index, mode) {


        this.socket.sendCommand({
            type: "CS",
            unitId: Number.parseInt(unitId, 10),
            commandId: Number.parseInt(commandId, 10),
            index: Number.parseInt(index, 10),
            mode: Number.parseInt(mode, 10),
        });
    }

    public disconnect(unitId) {


        this.socket.sendCommand({
            type: "RC",
            unitId: Number.parseInt(unitId, 10)
        });
    }

    public evalCommandId(role) {

    }
    public sendRapidCommand(rolId, unitId, commandId, command) {

        if (rolId == 2) {
            this.goSaveRapidCommand(null, null, unitId, commandId, 0, 1, true);
        }

        if (rolId == 3) {
            this.goSaveRapidCommand(null, null, unitId, commandId, 0, 2, true);
        }

        if (rolId == 4) {
            this.wins["params"].show();

            this.createAuxForm(command, "params");
            return;


            this.createFormParams([{
                caption: "Teléfono",
                name: "phone",
                input: "input",
                type: "text",
                value: "04164309040",
            }], unitId, commandId);
            //this.goSaveRapidCommand(null, null, unitId, commandId, 0, 1, true);
        }

        return;

    }


    public createFormParams(fields, unitId, commandId) {
        const type = "params";

        const form = this.forms[type] = new Form({
            target: this.wins["params"].getBody(),
            id: this.formIds[type],
            caption: "Params",
            fields: fields,
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [


                    {
                        caption: "Recibir",
                        action: (item, event) => {
                            let params = {};
                            fields.forEach((element) => {
                                params[element.name] = form.getInput(element.name).getValue();
                            });
                            this.goSaveRapidCommand(null, null, unitId, commandId, 0, 1, true);
                            //this.goSaveCommand(type, JSON.stringify(params), true);
                        },
                    },

                ],
            },
        });
    }

    public decodeMessage(message) {


        if (message.type == 4) {
            
            if (message.unitId == this.getUnitId()) {
                
                this.goGetValue(message.unitId, message.commandId, message.index);
            }
        }

        return;
        //let exp ="$OK:SETVIP=55,5,5,,";
        console.log(message)
        let regex = new RegExp("(\\$(\\w+):(\\w+)(\\+\\w+)?(?:=(.+)?)?)", "gi");
        let info = message.matchAll(regex);

        for (let match of info) {



            for (const key in this.forms) {



                //console.log(`[${this.forms[key].getInput("command_name").getValue()}]`)
                //console.log(`[${match[3]}]`)
                //console.log(key)

                if (this.forms[key].getInput("command_name").getValue() == match[3]) {
                    const values = match[5].split(",");
                    const params = JSON.parse(this.forms[key].getInput("command_params").getValue());
                    const result = {};
                    params.forEach((param, index) => {
                        result[param] = values[index];
                    });

                    this.forms[key].setValue(result);
                }


            }



        }



    }


    private createAuxForm(command, type) {

        let data = null;


        const id = command.id;
        const commandId = command.command_id;
        const unitId = command.unit_id;
        const index = command.index;
        const mode = command.mode;
        //const name = this.unitPending.name;
        const status = command.status;
        const __mode_ = command.__mode_;



        let __record_ = "";
        if (command.__record_) {
            __record_ = JSON.stringify(command.__record_);
        }

        const fields = [];
        //const commandParams = [];

        //const fields = this.commandConfig.params.fields.map((item) => {
        command.fields.forEach((item) => {

            //commandParams.push(item.name);

            data = command.paramData
                .filter((e) => e.param_id == item.id)
                .map((e) => {
                    return [e.value, e.title || e.value];
                });


            const info: any = {
                caption: item.param,
                name: item.name,
                input: "input",
                type: "text",
                value: item.value,
                dataset: { type: "param" }
            };

            if (item.type == "select") {
                info.type = "select";
                info.data = data;
                fields.push(info);
                return;
            }

            if (item.type == "bit") {
                info.input = "multi";
                info.type = "checkbox";
                info.data = data;

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
            value: id,
        });
        fields.push({
            caption: "Unit ID",
            name: "unit_id",
            input: "input",
            type: "hidden",
            value: unitId,
        });
        fields.push({
            caption: "Command ID",
            name: "command_id",
            input: "input",
            type: "hidden",
            value: commandId,
        });
        fields.push({
            caption: "Index",
            name: "index",
            input: "input",
            type: "hidden",
            value: index,
        });
        fields.push({
            caption: "Mode",
            name: "mode",
            input: "input",
            type: "hidden",
            value: mode,
        });

        fields.push({
            caption: "Status",
            name: "status",
            input: "input",
            type: "hidden",
            value: status,
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
            caption: "__mode_",
            name: "__mode_",
            input: "input",
            type: "hidden",
            value: __mode_,
        });
        fields.push({
            caption: "__record_",
            name: "__record_",
            input: "input",
            type: "hidden",
            value: __record_,
        });
        fields.push({
            caption: "type_command",
            name: "type_command",
            input: "input",
            type: "hidden",
            value: type,
        });
        fields.push({
            caption: "command_name",
            name: "command_name",
            input: "input",
            type: "hidden",
            value: command.command,
        });
        fields.push({
            caption: "command_params",
            name: "command_params",
            input: "input",
            type: "hidden",
            value: JSON.stringify(command.fields.map(e => e.name)),
        });
        const form = this.forms[type] = new Form({
            target: this.wins["params"].getBody(),
            id: this.formIds[type],
            caption: command.command,
            fields: fields,
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    /*{
                        caption: "Save",
                        action: (item, event) => {

                            let params = {};



                            command.fields.forEach((element) => {

                                params[element.name] = form.getInput(element.name).getValue();
                            });
                            form.getInput("status").setValue(1);
                            form.getInput("params").setValue(JSON.stringify(params));
                            this.goSave(type);
                        },
                    },*/
                    {
                        caption: "Send",
                        action: (item, event) => {
                            let params = {};



                            command.fields.forEach((element) => {

                                params[element.name] = form.getInput(element.name).getValue();
                            });

                            form.getInput("params").setValue(JSON.stringify(params));
                            form.getInput("status").setValue(2);
                            this.goSave(type, true);
                        },
                    }/*,
                    {
                        caption: "Recibir",
                        action: (item, event) => {


                            this.goSaveCommand(type, "", true);
                        },
                    },*/

                ],
            },
        });
        if (__mode_ == 2) {
            form.setValue(command.params);
        }
        form.setMode(status);

        return form;


    }

    private doAny(unitId: number, type: string){

        if(type == "dc" && confirm("Seguro?")){
            this.disconnect(unitId);
        }
    }
}
