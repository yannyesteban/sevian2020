import { _sgQuery as $, SQObject } from "../../Sevian/ts/Query.js";
import {
    I,
    Input,
    Hidden,
    InputDate,
    InputInfo,
    Multi,
} from "../../Sevian/ts/Input.js";

import { Float } from "../../Sevian/ts/Window.js";
import { Form2 as Form } from "../../Sevian/ts/Form2.js";
import { S } from "../../Sevian/ts/Sevian.js";
import { Tab } from "../../Sevian/ts/Tab.js";

import { Communication } from "./Communication.js";

export class IStartekEvent {
    private id: any = "istartek-module";
    private className: any = "tool-istartek";
    private main: SQObject = null;
    private form: Form = null;
    private tab: Tab = null;
    private tabs: any[] = [];

    private config: any = {};

    private socket: Communication = null;
    constructor(info: any) {
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        let main = this.id ? $(this.id) : null;

        if (!main) {
            main = $.create("div");
            if (this.id) {
                main.id(this.id);
            }
        }

        this.create(main);
    }

    private create(main) {
        this.main = main;
        main.addClass(this.className);


        this.tab = new Tab({
            target: this.main,
            className: "tab-tool",
            onOpen: (index) => {
                if(index === 0){
                    this.goInit(this.tabs["212"], [[1,1],[2,2]], this.config);
                }

            }
        });

        this.tabs["212"] = this.tab.add({ caption: "212", tagName: "form" });
        this.tabs["210"] = this.tab.add({ caption: "210", tagName: "form" });
        this.tabs["203"] = this.tab.add({ caption: "203", tagName: "form" });

    }
    public get() {
        return this.main;
    }

    public init(unitId: number) {
        this.config = {
            unitId,
            commandId : 2554,
            index: 0,
            mode: 1, 
            type: "w"
        }
        //this.goInit(unitId, 2554, 0, 1, "W");
        
    }



    private goInit(main, listData, config:any) {
        
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json);
                    //this.goGetCommand(new FormData(), unitId, 2554, 0, 1, "W");
                    //this.createForm(json.eventList, unitId);
                    console.log(json.command);

                    this.createForm(main, listData, json.eventList, config.unitId, json.command);
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-native-events",
                    name: "",
                    eparams: {
                        unitId: config.unitId,
                        commandId: config.commandId,
                        index: config.index,
                        mode: config.mode,
                        type: config.type,
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private goImport(unitId: number, fileId:number) {

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            //form: this.form.getFormData(),
            requestFunctions: {
                f: (json) => {
                    console.log(json);
                    this.createForm(json.files, unitId);
                    if (!json.error) {
                        new Float.Message({
                            "caption": "Command",
                            "text": "Record was saved!!!",
                            "className": "",
                            "delay": 3000,
                            "mode": "",
                            "left": "center",
                            "top": "top"
                        }).show({});

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
                    element: "gt-report",
                    method: "import-file",
                    name: "",
                    eparams: {
                        unitId,
                        fileId
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private goDelete(unitId: number, fileId:number) {

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            form: this.form.getFormData(),
            requestFunctions: {
                f: (json) => {
                    console.log(json);
                    this.createForm(json.files, unitId);
                    if (!json.error) {
                        new Float.Message({
                            "caption": "Command",
                            "text": "Record was saved!!!",
                            "className": "",
                            "delay": 3000,
                            "mode": "",
                            "left": "center",
                            "top": "top"
                        }).show({});

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
                    element: "gt-report",
                    method: "delete-file",
                    name: "",
                    eparams: {
                        fileId
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private getCommandList() {
        const elems = this.grid.queryAll(`input[type="checkbox"]`);
        const result = [];
        if (elems) {
            elems.forEach(element => {
                if (element.checked) {
                    result.push(element.value);
                }

            });
        }

        return result;
    }

    private getNameList() {
        const elems = this.main.query(`input[name="name"]`);
        const result = [];
        if (elems) {
            return elems.value;
        }

        return "";
    }
    private createGrid(data) {
        this.grid.text("");

        data.forEach(info => {
            const row = this.grid.create("div").addClass("row");
            row.on("click", (event) => {

            });
            row.create("input").prop({
                type: "checkbox",
                value: info.id
            });
            row.create("div").text(info.id);
            row.create("div").text(info.role);
            row.create("div").text(info.cindex);
            //row.create("div").text(info.unitId);





        });
    }

    private createForm(main, listData, data, unitId, command) {
        
        main.text("");

        const list = new Input({
            target: main,
            input: "input",
            type: "select",
            name: "list",
            value: command.index,
            caption: "Alarmas",
            data: listData,

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    //this.setIndex(event.currentTarget.value);
                    //this.goConfig(this.unitId, this.index, 1, "0");
                    //this.goGetCommand(this.unitId, null, event.currentTarget.value, "0", 1);

                    //this.goGetCommand(this.unitId, event.currentTarget.value, 0, "0", 1);
                },
            },
        });


        const grid = main.create("div").addClass("grid");
        console.log(data);
        let params = "";
        data.forEach(element => {
            const row = grid.create("div").addClass("row");

            const label  = row.create("span").addClass("label").text(element.name);
            const output1  = row.create("input").attr("type","checkbox").addClass(["o1"]).val(element.event_id);
            //const output2  = row.create("input").attr("type","checkbox").addClass(["o2"]).val(element.event_id);
            
            output1.on("change", (event)=>{
                

                const elem = grid.queryAll(`.o1:checked`);
                params = "";
                elem.forEach(e=>{
                    
                    params += ((params!=="")?",":"") + e.value;
                })
                console.log(params)
            });
            
        });


        const button = main.create("button").prop({"type":"button", innerHTML:"SEND" });

        button.on("click", (event)=>{
            const formData = new FormData();
            formData.append("id", command.id);
            formData.append("unit_id", command.unit_id);
            formData.append("command_id", command.command_id);
            formData.append("index", "0");
            formData.append("status", command.status);
            formData.append("params", params);
            formData.append("query", "212");
            formData.append("mode", "212");

            formData.append("__mode_", command.__mode_);
            formData.append("__record_", (command.__record_ != "") ? JSON.stringify(command.__record_) : "");
        });

        console.log(params)
        return;

        
    }


    public goSave(form, type, send?) {

       

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
                    

                },
                goSave: (json) => {
                    //this.iniLists(json.eventList, json.commandList, type);
                    //this.createForm(json.command, type);
                    //this.loadTab(json.command, type);

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

    public send(unitId, commandId, index, mode) {


        this.socket.sendCommand({
            type: "CS",
            unitId: Number.parseInt(unitId, 10),
            commandId: Number.parseInt(commandId, 10),
            index: Number.parseInt(index, 10),
            mode: Number.parseInt(mode, 10),
        });
    }


    public goGetCommand(form, unitId, commandId, index, mode, type) {

        

        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            form: form,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json.command);

                    this.createForm(json.eventList, unitId, json.command);
                }
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
                        type: type,
                    },
                    iToken: "f",
                }
            ],
        });
    }

}