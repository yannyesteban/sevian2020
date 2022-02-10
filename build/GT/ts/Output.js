import { _sgQuery as $ } from "../../Sevian/ts/Query.js";
import { Float } from "../../Sevian/ts/Window.js";
import { Input, } from "../../Sevian/ts/Input.js";
import { Form2 as Form } from "../../Sevian/ts/Form2.js";
import { S } from "../../Sevian/ts/Sevian.js";
export class Output {
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
        this.eventList = [];
        this.commandList = null;
        this.form = null;
        this.forms = {};
        this.unitId = null;
        this.unitName = "";
        this.index = -1;
        this.eventId = null;
        //private listCommand["0"]: any;
        this.tab = null;
        this.tabs = [];
        this.listCommand = [];
        this.socketId = "";
        this.socket = null;
        this.unitPanelId = "";
        this.unitPanel = null;
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
            this.unitPanel.addEvent((unitId) => {
                if (this.wins["main"].getVisible()) {
                    this.show(unitId);
                }
            });
            this.unitPanel.onOutput = (unitId) => {
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
        main.addClass("output-tool");
        main.addClass("report-tool");
        this.main = main;
        this.wins["main"] = new Float.Window({
            visible: false,
            caption: "Output",
            left: 'right',
            top: 'bottom',
            deltaX: -50 - 350,
            deltaY: -140 - 20,
            width: "330px",
            height: "300px",
            mode: "auto",
            className: ["sevian"],
            child: this.main
        });
        this.listCommand["0"] = new Input({
            target: this.main,
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
                    this.goLoadPage(this.unitId, event.currentTarget.value, event.currentTarget.options[event.currentTarget.selectedIndex].text);
                },
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
            this.goLoadPage(0, -1);
            this.wins["main"].setCaption(`${this.caption} : Todos`);
            this.wins["main"].show({ left: "center", top: "middle" });
            return;
        }
        let unitName = "";
        if (this.unitPanel) {
            unitName = this.unitPanel.getUnitInfo(unitId).unitName;
        }
        this.unitId = unitId;
        this.goLoadPage(unitId, -1);
        this.wins["main"].setCaption(`${this.caption} : ${unitName}`);
        this.wins["main"].show({ left: "center", top: "middle" });
    }
    setUnitId(unitId) {
        this.unitId = unitId;
    }
    getUnitId() {
        return this.unitId;
    }
    goLoadPage(unitId, index, caption) {
        if (index < 0 && $(this.formId)) {
            $(this.formId).text("...");
        }
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json);
                    this.loadPage(json);
                    if (json.command) {
                        this.loadForm(json.command, 0, index, caption);
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
    loadPage(info) {
        if (info.list) {
            this.eventList = info.list;
            if (info.command && info.command.bitwise) {
                this.listCommand["0"].setOptionsData([['', ' - ']].concat(info.list
                    .map((e) => {
                    return [Math.pow(2, e.number - 1), e.number + ": " + e.name /*, "*", e.status*/];
                })));
            }
            else {
                this.listCommand["0"].setOptionsData([['', ' - ']].concat(info.list
                    .map((e) => {
                    return [e.number, e.number + ": " + e.name /*, "*", e.status*/];
                })));
            }
        }
    }
    getIndexName(index) {
        if (this.eventList) {
            const item = this.eventList.find(e => e.number == index);
            if (item) {
                return item.name;
            }
        }
        return "";
    }
    loadForm(command, type, index, caption) {
        const fields = [];
        fields.push({
            caption: "[Description]",
            name: "name",
            input: "input",
            type: "text",
            value: caption || command.name,
        });
        command.fields.forEach((item, index2) => {
            /*

            const data = command.paramData
                .filter((e) => e.param_id == item.id)
                .map((e) => {
                    return [e.value, e.title || e.value];
                });

        */
            const info = {
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
            if (item.type == "output") {
                info.type = "hidden";
                /*info.data = range;
                        info.events = {change: (event) => {
                            this.setIndex(event.currentTarget.value);
                            this.start();
                        }};*/
                info.value = index;
            }
            if (item.type == "mask") {
                info.type = "select";
                info.data = [[0, "Off"], [index, "On"]];
                fields.push(info);
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
                    inputs.forEach((input) => {
                        if ((parseInt(value, 10) & parseInt(input.value, 10)) ==
                            parseInt(input.value)) {
                            input.checked = true;
                        }
                        else {
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
            value: 0,
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
            target: this.main,
            id: this.formId,
            caption: command.command + ": " + this.getIndexName(index),
            fields: fields,
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal", `type-${type}`],
                items: [
                    /*{
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
                    },*/
                    {
                        caption: "Send",
                        action: (item, event) => {
                            let params = {};
                            command.fields.forEach((element, index) => {
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
    goSave(type, send) {
        const form = this.forms[type];
        const unitId = form.getInput("unit_id").getValue();
        const commandId = form.getInput("command_id").getValue();
        const index = form.getInput("index").getValue();
        const mode = form.getInput("mode").getValue();
        console.log({
            unitId,
            commandId,
            index,
            mode,
            type,
        });
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
                    method: "get-outputs",
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
}
//# sourceMappingURL=Output.js.map