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

import { S } from "../../Sevian/ts/Sevian.js";

import { Communication } from "./Communication.js";
import { UnitConfig } from "./UnitConfig.js"
import { InfoComm, InfoMenu, InfoUnits } from './InfoMenu.js';



export class CommandForm {
    public id: any = null;
    public caption: string = "";




    public className: any = null;
    private main: SQObject = null;

    private wins: any[] = [];



    private form: Form = null;


    private unitId: number = null;
    private unitName: string = "";
    private index: number = 100;


    private socketId: string = "";
    private socket: Communication = null;

    private unitPanelId: string = "";
    private unitPanel: any = null;


    constructor(info: any) {

        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }


    }



    public createForm(main, commandConfig, onSave: any, onSend: any, onGet: any) {

        main.text("");
        main.addClass(["command-form", "report-tool"]);
        let data = null;


        const command = commandConfig.commandData;
        const config = commandConfig.config;


        const id = command.id;
        const commandId = command.command_id;
        const unitId = command.unit_id;
        const index = command.index;
        const mode = command.mode || 1;
        //const name = this.unitPending.name;
        const status = command.status;
        const __mode_ = command.__mode_;



        let __record_ = "";
        if (command.__record_) {
            __record_ = JSON.stringify(command.__record_);
        }

        const fields = [];

        

        fields.push({
            caption: "Descripción",
            name: "help",
            input: "inputInfo",
            type: "text",
            value: config.description,
        });


        config.fields.forEach((item, i) => {



            const value = command.params[`param_${i}`] || item.value || "";

            const info: any = {
                caption: item.label || item.name,
                name: `param_${i}`,
                input: "input",
                type: "text",
                value: value,
                dataset: { type: "param" },
                rules: item.rules || {}
            };

            if (item.type == "select") {
                info.type = "select";
                info.data = item.data;
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
            value: command.type,
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
            value: JSON.stringify(config.fields.map(e => e.name)),
        });


        const menu = {
            caption: "",
            autoClose: false,
            className: ["sevian", "horizontal"],
            items: []
        }


        const doParams = (status?: number) => {
            const params = {};

            config.fields.forEach((element, index) => {
                params[`param_${index}`] = this.form.getInput(`param_${index}`).getValue();
            });

            this.form.getInput("params").setValue(JSON.stringify(params));
            if (status > 0) {
                this.form.getInput("status").setValue(status);
            }



        };

        if (config.onSave) {



            menu.items.push({
                caption: config.onSave,
                action: (event) => {
                    doParams();

                    if (this.form.valid()) {
                        onSave(this.form.getFormData(), false);
                    }

                }
            });
        }

        if (config.onSend) {
            menu.items.push({
                caption: config.onSend,
                action: (event) => {

                    doParams();

                    if (!this.form.valid()) {
                        return;
                    }

                    let valid = true;
                    if (config.confirm) {
                        config.confirm.forEach(e => {
                            if (valid && !confirm(e)) {
                                valid = false;
                            }
                        })
                    }

                    if (valid) {
                        onSave(this.form.getFormData(), true);
                    }

                }
            });
        }



        const caption = config.label || command.command;

        this.form = new Form({
            target: main,

            caption: caption,
            fields: fields,
            menu
        });

        if (__mode_ == 2) {
            this.form.setValue(command.params);
        }
        this.form.setMode(status);

        return this.form;


    }
}


export abstract class RapidCommand {
    static socket: Communication = null;
    static main;
    static win;
    static commandForm: CommandForm = null;
    static closeCommand: boolean = false;

    static setWebSocket(socket: Communication) {
        this.socket = socket;
    }
    static setWin() {
        if (!this.win) {

            //this.main = $.create("div");
            this.win = new Float.Window({
                visible: false,
                caption: "",
                child: this.main,
                left: 10,
                top: 100,
                width: "280px",
                height: "250px",
                mode: "auto",
                className: ["sevian", "report-tool1"],
            })
        }

        this.commandForm = new CommandForm({
            caption: "hola"
        });
    }
    static flashCommand(unitId: number, rolId: number) {


        this.closeCommand = false;
        const prom = this.goLoadCommand(this.main, {
            roleId: rolId,
            unitId: unitId
        }).then((json: any) => {
            console.log(json);
            console.log(json.config.useRapidCommand)
            this.closeCommand = json.config.closeCommand || false;

            if (json.config.useRapidCommand) {

                let valid = true;
                if (json.config.confirm) {
                    json.config.confirm.forEach(e => {
                        if (valid && !confirm(e)) {
                            valid = false;
                        }
                    })
                }
                if (valid) {
                    this.goSaveRapidCommand(null, null, unitId, json.config.commandId, 0, 2, true);
                }

            } else {
                this.win.setCaption(json.config.unitName || "-");
                this.win.show();

                const f = this.commandForm.createForm(this.win.getBody(), json, this.goSave, null, null);
            }




        });

    }

    private static async test(name) {


    }

    private static goLoadCommand(main, config: any) {
        return new Promise((resolve, reject) => {

            S.go({
                async: true,
                valid: false,
                blockingTarget: main,
                requestFunctions: {
                    f: (json) => {

                        resolve(json);
                    },
                },

                params: [
                    {
                        t: "setMethod",
                        element: "gt-report",
                        method: "get-command-config",
                        name: "",
                        eparams: {
                            unitId: config.unitId,
                            roleId: config.roleId
                        },
                        iToken: "f",
                    },
                ],
            });
        });

    }


    public static goSave(formData, send?) {


        const unitId = formData.get("unit_id");
        const commandId = formData.get("command_id");
        const index = formData.get("index");
        const mode = formData.get("mode");
        const type = "";

        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            form: formData,
            blockingTarget: RapidCommand.main,
            requestFunctions: {

                goSave: (json) => {

                    if (send) {

                        RapidCommand.send(unitId, commandId, index, mode);
                        
                        if(RapidCommand.win && RapidCommand.closeCommand){
                            RapidCommand.win.hide();
                        }
                        

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
                    method: "get-command",
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

    public static send(unitId, commandId, index, mode) {


        this.socket.sendCommand({
            type: "CS",
            unitId: Number.parseInt(unitId, 10),
            commandId: Number.parseInt(commandId, 10),
            index: Number.parseInt(index, 10),
            mode: Number.parseInt(mode, 10),
        });

        //this.goGetValues(unitId, commandId, index);
    }

    public static goSaveRapidCommand(form, params, unitId, commandId, index, mode, send) {


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
                            console.log(unitId, commandId, index, mode)
                            RapidCommand.send(unitId, commandId, index, mode);
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
}

RapidCommand.setWin();
