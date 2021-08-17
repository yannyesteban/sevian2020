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
import { Communication } from "./Communication";

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
    private forms: Form[] = [];

    private unitId: number = null;
    private index: number = 100;
    private eventId: number = null;

    //private listCommand["0"]: any;
    private tab: Tab = null;
    private tabs: any[] = [];

    private listCommand: any[] = [];


    private socketId: string = "";
    private socket:Communication = null;

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

        }

        this.formIds["0"] = "form-" + String(new Date().getTime());
        this.formIds["A"] = "form-a" + String(new Date().getTime());
        this.formIds["W"] = "form-w" + String(new Date().getTime());
        this.formIds["M"] = "form-m" + String(new Date().getTime());
        this.create(main);
    }

    public create(main: SQObject) {
        main.addClass("event-tool");

        this.main = main;

        this.tab = new Tab({
            target: main,
            className: "layer-tool",
        });

        this.tabs["A"] = this.tab.add({
            caption: "Configuración",
            tagName: "form",
            active: true,
        });
        this.tabs["M"] = this.tab.add({ caption: "Info", tagName: "form" });
        this.tabs["W"] = this.tab.add({ caption: "Equipo", tagName: "form" });
        this.tabs["0"] = this.tab.add({ caption: "Eventos", tagName: "form" });

        this.wins["main"] = new Float.Window({
            visible: true,
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
        this.wins["main"].getMain().on("dblclick", (event) => {
            this.unitId = 4032;

            this.start(this.unitId, this.index);
        });

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
                    $(option).addClass("mode-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.setIndex(event.currentTarget.value);
                    this.goConfig(this.unitId, this.index, 0, "0");
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

                    $(option).addClass("mode-" + data[3]);
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
                    $(option).addClass("mode-" + data[3]);
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
                    $(option).addClass("mode-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.goGetCommand(this.unitId, event.currentTarget.value, 0, "M", 0);
                },
            },
        });
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

    public init(json:any) {
        this.iniLists(json.eventList, json.commandList);
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

    private iniLists(eventList, commandList) {

        this.listCommand["0"].setOptionsData([['', ' - ']].concat(eventList));

        this.listCommand["A"].setOptionsData(
            [['',' - ']].concat(commandList
                .filter((e) => e.type == "A")
                .map((e) => {
                    return [e.id, e.command, "*", e.status];
                }))
        );
        this.listCommand["W"].setOptionsData(
            [['',' - ']].concat(commandList
                .filter((e) => e.type == "W")
                .map((e) => {
                    return [e.id, e.command, "*", e.status];
                }))
        );
        this.listCommand["M"].setOptionsData(
            [['',' - ']].concat(commandList
                .filter((e) => e.type == "M")
                .map((e) => {
                    return [e.id, e.command, "*", e.status];
                }))
        );
    }

    private goInit(unitId: number, index: number, mode?: number) {
        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    this.iniLists(json.eventList, json.commandList);
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

    private goConfig(unitId: number, index: number, mode: number, type:string) {
        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {

                f: (json) => {
                    this.iniLists(json.eventList, json.commandList);
                    this.createForm(json.command, type);

                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: (type=="0")?"get-event": "get_command",
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
                    this.iniLists(json.eventList, json.commandList);
                    this.createForm(json.command, type);
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-command",
                    name: "",
                    eparams: {
                        unitId: unitId,
                        commandId: commandId,
                        index: index,
                        mode: mode,
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
                        this.iniLists(json.eventList, json.commandList);
                        this.createMainForm(json.command)
                    } else {
                        this.iniLists(json.eventList, json.commandList);
                        this.createCommandForm(json.command, type);
                    }

                },
                f2: (json) => {
                    this.iniLists(json.eventList, json.commandList);
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
                    method: (type=="0")?"get-event": "get-command",
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
                        this.iniLists(json.eventList, json.commandList);
                        this.createMainForm(json.command)
                    } else {
                        this.iniLists(json.eventList, json.commandList);
                        this.createCommandForm(json.command, type);
                    }

                },
                f2: (json) => {
                    this.iniLists(json.eventList, json.commandList);
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
                    method: (type=="0")?"get-event": "get-command",
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

    private createForm(command, type) {
        if (type == "0") {
            this.createMainForm(command)
        } else {
            this.createCommandForm(command, type);
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
        const mode = command.__mode_;
        const fields = [];

        //const fields = this.commandConfig.params.fields.map((item) => {
        command.fields.forEach((item) => {
            //let input = "input";
            //let type = "text";
            //let caption = item.label;
            //let events = {};
            //let value = item.value || "";
            //console.log(item.name, item.value);

            const info: any = {
                caption: item.label,
                name: item.name,
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

                info.onchange = function(item) {
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
            value: mode,
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
        const form = this.forms[type] = new Form({
            target: this.tabs["0"],
            id: this.formIds["0"],
            caption: "event",
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
                            console.log(form.getValue());
                            command.fields.forEach((element) => {
                                console.log(element.name);
                                params[element.name] = form.getInput(element.name).getValue();
                            });

                            form.getInput("params").setValue(JSON.stringify(params));
                            this.goSave("0");
                        },
                    },
                    {
                        caption: "Send",
                        action: (item, event) => {
                            let params = {};
                            console.log(form.getValue());


                            command.fields.forEach((element) => {
                                console.log(element.name);
                                params[element.name] = form.getInput(element.name).getValue();
                            });

                            form.getInput("params").setValue(JSON.stringify(params));
                            form.getInput("status").setValue(1);
                            this.goSave(type, true);

                        },
                    },
                    {
                        caption: "Recibir",
                        action: (item, event) => { },
                    },
                    {
                        caption: "Último Reportado",
                        action: (item, event) => { },
                    },
                ],
            },
        });
        if (mode == 2) {
            form.setValue(command.params);
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

        //const fields = this.commandConfig.params.fields.map((item) => {
        command.fields.forEach((item) => {
            console.log(item.name, item.value);

            data = command.paramData
                .filter((e) => e.param_id == item.id)
                .map((e) => {
                    return [e.value, e.title || e.value];
                });

            console.log(data);
            const info: any = {
                caption: item.param,
                name: item.name,
                input: "input",
                type: "text",
                value: item.value,
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

                info.onchange = function(item) {
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
            type: "text",
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
        const form = this.forms[type] = new Form({
            target: this.tabs[type],
            id: this.formIds[type],
            caption: "event",
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
                            console.log(form.getValue());


                            command.fields.forEach((element) => {
                                console.log(element.name);
                                params[element.name] = form.getInput(element.name).getValue();
                            });

                            form.getInput("params").setValue(JSON.stringify(params));
                            this.goSave(type);
                        },
                    },
                    {
                        caption: "Send",
                        action: (item, event) => {
                            let params = {};
                            console.log(form.getValue());


                            command.fields.forEach((element) => {
                                console.log(element.name);
                                params[element.name] = form.getInput(element.name).getValue();
                            });

                            form.getInput("params").setValue(JSON.stringify(params));
                            form.getInput("status").setValue(1);
                            this.goSave(type, true);
                         },
                    },
                    {
                        caption: "Recibir",
                        action: (item, event) => {
                            let params = {};
                            command.fields.forEach((element) => {
                                console.log(element.name);
                                params[element.name] = form.getInput(element.name).getValue();
                            });

                            form.getInput("params").setValue("");
                            form.getInput("mode").setValue(2);
                            form.getInput("status").setValue(1);


                            this.goSave(type, true);
                        },
                    },
                    {
                        caption: "Último Reportado",
                        action: (item, event) => {
                            this.send(unitId, commandId, index, mode);
                        },
                    },
                ],
            },
        });
        if (__mode_ == 2) {
            form.setValue(command.params);
        }

        this.setMode(status);
    }


    public send(unitId, commandId, index, mode) {
        console.log(unitId, commandId, index, mode);

        this.socket.sendCommand({
            type: "CS",
            unitId: Number.parseInt(unitId, 10),
            commandId: Number.parseInt(commandId, 10),
            index: Number.parseInt(index, 10),
            mode: Number.parseInt(mode, 10),
        });
    }
}
