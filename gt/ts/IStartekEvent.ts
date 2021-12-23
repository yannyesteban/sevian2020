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
        this.main.text("");

        this.tab = new Tab({
            target: this.main,
            className: "tab-tool",
            onOpen: (index) => {
                if(index === 0){
                    this.config.roleId = 7;
                    this.goInit(this.tabs["203"],  this.config);
                }

                if(index === 1){
                    this.config.roleId = 8;
                    this.goInit(this.tabs["210"],  this.config);
                }
                if(index === 2){
                    this.config.roleId = 9;
                    this.goInit(this.tabs["212"],  this.config);
                }

            }
        });
        this.tabs["203"] = this.tab.add({ caption: "203", tagName: "form" });
        this.tabs["210"] = this.tab.add({ caption: "210", tagName: "form" });
        this.tabs["212"] = this.tab.add({ caption: "212", tagName: "form" });
        
        

    }
    public get() {
        return this.main;
    }

    public init(unitId: number) {
        this.config = {
            unitId,
            commandId : 0,
            index: -1,
            mode: 1, 
            type: "w",
            roleId: 0
        }
        //this.goInit(unitId, 2554, 0, 1, "W");
        
    }



    private goInit(main, config:any) {
        console.log(config)
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json);
                    //this.goGetCommand(new FormData(), unitId, 2554, 0, 1, "W");
                    //this.createForm(json.eventList, unitId);
                    console.log(json);

                    this.createForm(main, config.roleId, json.commandConfig.params, json.eventList, config.unitId, json.command);
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
                        roleId: config.roleId
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private createForm(main, roleId, commandConfig, data, unitId, command) {


        
        console.log(command);
        main.text("");



        const list = new Input({
            target: main,
            input: "input",
            type: "select",
            name: "list",
            value: command.index,
            caption: "Alarmas",
            data: commandConfig.indexRange.map(e=> [e, e]),

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.config.index = event.currentTarget.value;
                    this.config.commandId = command.command_id;
                    this.config.roleId = roleId;
                    this.goInit(main, this.config);
                    //this.setIndex(event.currentTarget.value);
                    //this.goConfig(this.unitId, this.index, 1, "0");
                    //this.goGetCommand(this.unitId, null, event.currentTarget.value, "0", 1);

                    //this.goGetCommand(this.unitId, event.currentTarget.value, 0, "0", 1);
                },
            },
        });

        if(command.index < 0){
            return;
        }

        const grid = main.create("div").addClass("grid");
        
        let params = "";
        let param2 = "";

        if(command.params  && command.params.param_2){
            param2 = command.params.param_2 + "";
        }
        console.log(param2)
        const paramValues = param2.split(",");
        
        data.forEach(element => {
            const row = grid.create("div").addClass("row");

            const label  = row.create("span").addClass("label").text(element.name);
            const output1  = row.create("input").prop({"type": "checkbox", checked:(paramValues.find(e=> e ==element.event_id))}).addClass(["o1"]).val(element.event_id);
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
            formData.append("id", command.id || "");
            formData.append("unit_id", command.unit_id);
            formData.append("command_id", command.command_id);
            formData.append("index", command.index);
            formData.append("status", "1");
            formData.append("params", JSON.stringify({
                param_0: command.index,
                param_1: 1,
                param_2: params
            }));
            formData.append("query", "");
            formData.append("mode", "1");

            formData.append("__mode_", command.__mode_);
            formData.append("__record_", (command.__record_ != "") ? JSON.stringify(command.__record_) : "");
            

            
            this.goSave(formData, "W", 1);
        });

        console.log(params)
        return;

        
    }


    public goSave(form, type, send?) {

       

        const unitId = form.get("unit_id");
        const commandId = form.get("command_id");
        const index = form.get("index");
        const mode = form.get("mode");


        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            form: form,
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


  

}