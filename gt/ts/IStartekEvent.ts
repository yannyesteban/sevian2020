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
function hexTobin(hex){
    return (parseInt(hex, 16).toString(2));
}

function hexToBit(hex){
    return hexTobin(hex).split("").reverse().map(e=>Number.parseInt(e, 10));
}


export class IStartekEvent {
    private id: any = "istartek-module";
    private className: any = "tool-istartek-ext";
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


        const list = new Input({
            target: main,
            input: "input",
            type: "select",
            name: "list",
            value: "",
            caption: "Alarmas",
            data: [
                [202, "202 escuchar / llamar"],
                [203, "203 SMS / evento"],
                [204, "204 descripcion sms / alarma"],
                [205, "205 llamada / evento"],
                [206, "206 escuchar / evento"],
                [210, "210 GPRS / eventos"],
                [212, "212 outpus / eventos"],
                [250, "250 niveles inputs"],
                [251, "251 config output / eventos"],
                [802, "802"],
                [808, "808"]
            ],

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    const index = Number.parseInt(event.currentTarget.value, 10);
                    this.config.index = -1;

                    if (index === 203) {

                        this.config.roleId = 7;
                        this.goInit(body, this.config);
                    }

                    if (index === 210) {
                        this.config.roleId = 8;
                        this.goInit(body, this.config);
                    }
                    if (index === 212) {
                        this.config.roleId = 9;
                        this.goInit(body, this.config);
                    }
                    if (index === 808) {
                        this.config.roleId = 10;
                        this.goInit808(body, this.config);
                    }
                    if (index === 204) {
                        this.config.roleId = 11;

                        this.goInit204(body, this.config);
                    }
                    if (index === 205) {
                        this.config.roleId = 12;
                        this.goInit(body, this.config);
                    }

                    if (index === 206) {
                        this.config.roleId = 13;
                        this.goInit(body, this.config);
                    }

                    if (index === 250) {
                        this.config.roleId = 14;
                        this.goInit250(body, this.config);
                    }



                    if (index === 202) {
                        this.config.roleId = 16;
                        this.goInit202(body, this.config);
                    }

                    if (index === 251) {
                        this.config.roleId = 17;
                        this.goInit251(body, this.config);
                    }

                    if (index === 802) {
                        this.config.roleId = 18;
                        this.goInit802(body, this.config);
                    }
                },
            },
        });

        const body = this.main.create("div").addClass("command-boby");
        return;
        const enum Pos {
            p202, p203, p204, p205, p206, p210, p212, p250, p251, p802, p808

        }

        this.tab = new Tab({
            target: this.main,
            className: "tab-tool",
            onOpen: (index) => {
                this.config.index = -1;
                if (index === Pos.p203) {
                    this.config.roleId = 7;
                    this.goInit(this.tabs["203"], this.config);
                }

                if (index === Pos.p210) {
                    this.config.roleId = 8;
                    this.goInit(this.tabs["210"], this.config);
                }
                if (index === Pos.p212) {
                    this.config.roleId = 9;
                    this.goInit(this.tabs["212"], this.config);
                }
                if (index === Pos.p808) {
                    this.config.roleId = 10;
                    this.goInit808(this.tabs["808"], this.config);
                }
                if (index === Pos.p204) {
                    this.config.roleId = 11;

                    this.goInit204(this.tabs["204"], this.config);
                }
                if (index === Pos.p205) {
                    this.config.roleId = 12;
                    this.goInit(this.tabs["205"], this.config);
                }

                if (index === Pos.p206) {
                    this.config.roleId = 13;
                    this.goInit(this.tabs["206"], this.config);
                }

                if (index === Pos.p250) {
                    this.config.roleId = 14;
                    this.goInit250(this.tabs["250"], this.config);
                }



                if (index === Pos.p202) {
                    this.config.roleId = 16;
                    this.goInit202(this.tabs["202"], this.config);
                }

                if (index === Pos.p251) {
                    this.config.roleId = 17;
                    this.goInit251(this.tabs["251"], this.config);
                }


            }
        });
        this.tabs["202"] = this.tab.add({ caption: "202 escuchar / llamar", tagName: "form" });
        this.tabs["203"] = this.tab.add({ caption: "203 SMS / evento", tagName: "form" });
        this.tabs["204"] = this.tab.add({ caption: "204 descripcion sms / alarma", tagName: "form" });
        this.tabs["205"] = this.tab.add({ caption: "205 llamada / evento", tagName: "form" });
        this.tabs["206"] = this.tab.add({ caption: "206 escuchar / evento", tagName: "form" });

        this.tabs["210"] = this.tab.add({ caption: "210 servidor / eventos", tagName: "form" });
        this.tabs["212"] = this.tab.add({ caption: "212 outpus / eventos", tagName: "form" });

        this.tabs["250"] = this.tab.add({ caption: "250 niveles inputs", tagName: "form" });

        this.tabs["251"] = this.tab.add({ caption: "251 config output / eventos", tagName: "form" });


        this.tabs["802"] = this.tab.add({ caption: "802", tagName: "form" });
        this.tabs["808"] = this.tab.add({ caption: "808", tagName: "form" });





    }
    public get() {
        return this.main;
    }

    public init(unitId: number) {
        this.config = {
            unitId,
            commandId: 0,
            index: -1,
            mode: 1,
            type: "w",
            roleId: 0
        }
        //this.goInit(unitId, 2554, 0, 1, "W");


        

       
    }



    private goInit(main, config: any) {

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    //this.goGetCommand(new FormData(), unitId, 2554, 0, 1, "W");
                    //this.createForm(json.eventList, unitId);
                    main.text("");

                    let params = null;

                    if (json.config && json.config.params) {
                        params = json.config.params;
                    }

                    this.createForm(main, config.unitId, config.index, json.eventList, params, json.data);


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
                        index: 0,
                        mode: config.mode,
                        type: config.type,
                        roleId: config.roleId
                    },
                    iToken: "f",
                },
            ],
        });
    }


    private goInit202(main, config: any) {

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    //this.goGetCommand(new FormData(), unitId, 2554, 0, 1, "W");
                    //this.createForm(json.eventList, unitId);
                    main.text("");

                    let params = null;

                    if (json.config && json.config.params) {
                        params = json.config.params;
                    }

                    this.createForm202(main, config.unitId, config.index, json.eventList, params, json.data);


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
                        index: 0,
                        mode: config.mode,
                        type: config.type,
                        roleId: config.roleId
                    },
                    iToken: "f",
                },
            ],
        });
    }


    private goInit251(main, config: any) {

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    //this.goGetCommand(new FormData(), unitId, 2554, 0, 1, "W");
                    //this.createForm(json.eventList, unitId);
                    main.text("");

                    let params = null;

                    if (json.config && json.config.params) {
                        params = json.config.params;
                    }

                    this.createForm251(main, config.unitId, config.index, json.eventList, params, json.data);


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
                        index: 0,
                        mode: config.mode,
                        type: config.type,
                        roleId: config.roleId
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private goInit802(main, config: any) {

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    //this.goGetCommand(new FormData(), unitId, 2554, 0, 1, "W");
                    //this.createForm(json.eventList, unitId);
                    main.text("");

                    let params = null;

                    if (json.config && json.config.params) {
                        params = json.config.params;
                    }

                    this.createForm802(main, config.unitId, config.index, json.eventList, params, json.data);


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
                        index: 0,
                        mode: config.mode,
                        type: config.type,
                        roleId: config.roleId
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private goInit204(main, config: any) {

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    //this.goGetCommand(new FormData(), unitId, 2554, 0, 1, "W");
                    //this.createForm(json.eventList, unitId);
                    main.text("");

                    let params = null;

                    if (json.config && json.config.params) {
                        params = json.config.params;
                    }

                    this.createForm204(main, config.unitId, config.index, json.eventList, params, json.data);


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
                        index: 0,
                        mode: config.mode,
                        type: config.type,
                        roleId: config.roleId
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private goInit250(main, config: any) {

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    //this.goGetCommand(new FormData(), unitId, 2554, 0, 1, "W");
                    //this.createForm(json.eventList, unitId);
                    main.text("");

                    let params = null;

                    if (json.config && json.config.params) {
                        params = json.config.params;
                    }

                    this.createForm250(main, config.unitId, config.index, json.eventList, params, json.data);


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
                        index: 0,
                        mode: config.mode,
                        type: config.type,
                        roleId: config.roleId
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private goInit808(main, config: any) {

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    //this.goGetCommand(new FormData(), unitId, 2554, 0, 1, "W");
                    //this.createForm(json.eventList, unitId);
                    main.text("");
                    let params = null;
                    if (json.config && json.config.params) {
                        params = json.config.params;
                    }
                    this.createForm808(main, config.unitId, config.index, json.eventList, params, json.data);

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
                        index: 0,
                        mode: config.mode,
                        type: config.type,
                        roleId: config.roleId
                    },
                    iToken: "f",
                },
            ],
        });
    }

    private createForm(main, unitId, index, eventList, config, command) {

        if (!config) {
            return;
        }

        const list = new Input({
            target: main,
            input: "input",
            type: "select",
            name: "list",
            value: index,
            caption: "Alarmas",
            data: config.data.map(e => [e[0], e[1]]),

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.config.index = event.currentTarget.value;

                    if (this.config.index <= 0) {
                        alert("seleccione una opción");
                        return false;
                    }
                    this.config.commandId = command.command_id;
                    this.goInit(main, this.config);
                    //this.setIndex(event.currentTarget.value);
                    //this.goConfig(this.unitId, this.index, 1, "0");
                    //this.goGetCommand(this.unitId, null, event.currentTarget.value, "0", 1);

                    //this.goGetCommand(this.unitId, event.currentTarget.value, 0, "0", 1);
                },
            },
        });

        if (index < 0) {
            return;
        }

        const grid = main.create("div").addClass("grid");

        
        let param2 = "";

        const query = command.query || {};

        if (query && query[index] && query[index].param_2) {
            param2 = query[index].param_2.toString() + "";
        }
        let params = param2;
        const paramValues = param2.split(",");
        
        let array2 = [];

        //eventList = eventList.filter(e=>e.event_id>=20) ;

        if (config.extra && config.extra.filter) {
            eventList = eventList.filter(e => {
                if (config.extra.filter.some(x => x == e.event_id)) {
                    return false;
                }
                return true;
            });
        }

        
        
        
        

        eventList.forEach(element => {
            const row = grid.create("div").addClass("row");

            const label = row.create("span").addClass("label").text(element.name);
            const output1 = row.create("input").prop({ "type": "checkbox", checked: (paramValues.find(e => e == element.event_id)) }).addClass(["o1"]).val(element.event_id);
            //const output2  = row.create("input").attr("type","checkbox").addClass(["o2"]).val(element.event_id);

            output1.on("change", (event) => {


                const elem = grid.queryAll(`.o1:checked`);
                params = "";
                elem.forEach(e => {

                    params += ((params !== "") ? "," : "") + e.value;
                });

            });

        });
       
        const _func = (event)=>{
            
            query[index] = {
                param_0: index,
                param_1: 1,
                param_2: params
            };
            const formData = new FormData();
            formData.append("id", command.id || "");
            formData.append("unit_id", command.unit_id);
            formData.append("command_id", command.command_id);
            formData.append("index", "0");
            formData.append("status", "1");
            formData.append("params", JSON.stringify({
                param_0: index,
                param_1: 1,
                param_2: params
            }));
            formData.append("query", JSON.stringify(query));
            formData.append("mode", "1");

            formData.append("__mode_", command.__mode_);
            formData.append("__record_", (command.__record_ != "") ? JSON.stringify(command.__record_) : "");

            return formData;

        };


        main.create("button").prop({ "type": "button", innerHTML: "SAVE" })
        .on("click", (event) => {
            this.goSave(_func(event), "W", 0);
        });
        main.create("button").prop({ "type": "button", innerHTML: "SEND" })
        .on("click", (event) => {
            this.goSave(_func(event), "W", 1);
        });


    }


    private createForm202(main, unitId, index, eventList, config, command) {

        if (!config) {
            return;
        }

        const list = new Input({
            target: main,
            input: "input",
            type: "select",
            name: "list",
            value: index,
            caption: "Alarmas",
            data: config.data.map(e => [e[0], e[1]]),

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.config.index = event.currentTarget.value;

                    if (this.config.index <= 0) {
                        alert("seleccione una opción");
                        return false;
                    }
                    this.config.commandId = command.command_id;
                    this.goInit202(main, this.config);
                    //this.setIndex(event.currentTarget.value);
                    //this.goConfig(this.unitId, this.index, 1, "0");
                    //this.goGetCommand(this.unitId, null, event.currentTarget.value, "0", 1);

                    //this.goGetCommand(this.unitId, event.currentTarget.value, 0, "0", 1);
                },
            },
        });

        if (index < 0) {
            return;
        }

        const grid = main.create("div").addClass("grid");

        let param3 = "";
        let param2 = "";

        const query = command.query || {};

        if (query && query[index] && query[index].param_2 >= 0) {
            param2 = query[index].param_2.toString() + "";
            param3 = query[index].param_3.toString() + "";
        }




        const row = grid.create("div").addClass("row");

        row.create("span").addClass("label").text("Operación");
        //const output1  = row.create("input").prop({"type": "input", "name":"mode"}).addClass(["o1"]).val();


        const mode = new Input({
            target: row,
            input: "input",
            type: "select",
            name: "mode",
            value: param2,
            caption: "mode",
            data: config.fields[2].data.map(e => [e[0], e[1]])

        });


        row.create("span").addClass("label").text("Replicar con SMS");
        const time1 = row.create("input").prop({ "type": "checkbox", "name": "time", "value": "3" }).addClass(["o1"]);
        if (param3) {
            time1.attr("checked", true);
        }


        const _func = (event)=>{
            query[index] = {
                param_0: index,
                param_1: 1,
                param_2: mode.getValue(),
                param_3: (time1.attr("checked")) ? time1.val() : ""
            };
            const formData = new FormData();
            formData.append("id", command.id || "");
            formData.append("unit_id", command.unit_id);
            formData.append("command_id", command.command_id);
            formData.append("index", "0");
            formData.append("status", "1");
            formData.append("params", JSON.stringify(query[index]));
            formData.append("query", JSON.stringify(query));
            formData.append("mode", "1");

            formData.append("__mode_", command.__mode_);
            formData.append("__record_", (command.__record_ != "") ? JSON.stringify(command.__record_) : "");

            return formData;

        };

        main.create("button").prop({ "type": "button", innerHTML: "SAVE" })
        .on("click", (event) => {
            this.goSave(_func(event), "W", 0);
        });
        main.create("button").prop({ "type": "button", innerHTML: "SEND" })
        .on("click", (event) => {
            this.goSave(_func(event), "W", 1);
        });

    }

    private createForm251(main, unitId, index, eventList, config, command) {

        if (!config) {
            return;
        }

        const list = new Input({
            target: main,
            input: "input",
            type: "select",
            name: "list",
            value: index,
            caption: "Alarmas",
            data: config.data.map(e => [e[0], e[1]]),

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.config.index = event.currentTarget.value;

                    if (this.config.index <= 0) {
                        alert("seleccione una opción");
                        return false;
                    }
                    this.config.commandId = command.command_id;
                    this.goInit251(main, this.config);
                    //this.setIndex(event.currentTarget.value);
                    //this.goConfig(this.unitId, this.index, 1, "0");
                    //this.goGetCommand(this.unitId, null, event.currentTarget.value, "0", 1);

                    //this.goGetCommand(this.unitId, event.currentTarget.value, 0, "0", 1);
                },
            },
        });

        if (index < 0) {
            return;
        }

        const grid = main.create("div").addClass("grid");

        let param1 = "";
        let param2 = "";
        let param3 = "";
        let param4 = "";
        let param5 = "";


        const query = command.query || {};

        if (query && query[index] && query[index].param_1 >= 0) {
            param1 = query[index].param_1.toString() + "";
            param2 = query[index].param_2.toString() + "";
            param3 = query[index].param_3.toString() + "";
            param4 = query[index].param_4.toString() + "";
            param5 = query[index].param_5.toString() + "";
        }

        const row = grid.create("div").addClass("row");

        row.create("span").addClass("label").text("Operación");

        const text1 = new Input({
            target: row,
            input: "input",
            type: "select",
            name: "mode",
            value: param1,
            caption: "mode",
            data: config.fields[1].data.map(e => [e[0], e[1]])

        });


        row.create("span").addClass("label").text(config.fields[2].label);
        const text2 = row.create("input").prop({ "type": "text", "name": "time", "value": param2 }).addClass(["o1"]);

        row.create("span").addClass("label").text(config.fields[3].label);
        const text3 = row.create("input").prop({ "type": "text", "name": "time", "value": param3 }).addClass(["o1"]);

        row.create("span").addClass("label").text(config.fields[4].label);
        const text4 = row.create("input").prop({ "type": "text", "name": "time", "value": param4 }).addClass(["o1"]);

        row.create("span").addClass("label").text(config.fields[5].label);
        const text5 = row.create("input").prop({ "type": "text", "name": "time", "value": param5 }).addClass(["o1"]);
        


        const _func = (event)=>{
            
            query[index] = {
                param_0: index,
                param_1: text1.getValue(),
                param_2: text2.val(),
                param_3: text3.val(),
                param_4: text4.val(),
                param_5: text5.val()

            };
            const formData = new FormData();
            formData.append("id", command.id || "");
            formData.append("unit_id", command.unit_id);
            formData.append("command_id", command.command_id);
            formData.append("index", "0");
            formData.append("status", "1");
            formData.append("params", JSON.stringify(query[index]));
            formData.append("query", JSON.stringify(query));
            formData.append("mode", "1");

            formData.append("__mode_", command.__mode_);
            formData.append("__record_", (command.__record_ != "") ? JSON.stringify(command.__record_) : "");


            return formData;

        }
        main.create("button").prop({ "type": "button", innerHTML: "SAVE" })
        .on("click", (event) => {
            this.goSave(_func(event), "W", 0);
        });
        const button = main.create("button").prop({ "type": "button", innerHTML: "SEND" });
        button.on("click", (event) => {
            this.goSave(_func(event), "W", 1);
        });

    }


    private createForm802(main, unitId, index, eventList, config, command) {

        if (!config) {
            
            return;
        }

        const grid = main.create("div").addClass("grid");

        
        const query = command.values || {};
        console.log(command.values);
    
        let param0 = query.param_0 || "" + "";
        let param1 = query.param_1 || "" + "";
        let param2 = query.param_2 || "" + "";
        let param3 = query.param_3 || "" + "";
        let param4 = query.param_4 || "" + "";
        let param5 = query.param_5 || "" + "";
        let param6 = query.param_6 || "" + "";
    

        const row = grid.create("div").addClass("row");

        //param0 = "01";

        let value = hexToBit(param0);

        const p1 = [
            ["GPRS connection status of IP1", value[7] ? "connected": "disconnected"],
            ["GPRS connection status of IP2", value[6] ? "connected": "disconnected"],
            ["GPS positioning status", value[5] ? "valid": "invalid"],
            ["External power connection status", value[4] ? "connected": "disconnected"],

            ["GPS antenna connection status", value[3] ? "connected": "disconnected"],
            ["Stop status", value[2] ? "stop": "move"],
            ["Armed state", value[1] ? "armed": "disarmed"],
            ["RFID/iButton login status", value[0] ? "log in,": "log out"]
        ];

        //param1 = "02";

        value = hexToBit(param1);

        const p2 = [
            ["input 1 status", value[3] ? "Activo": "Inactivo"],
            ["input 2 status", value[2] ? "Activo": "Inactivo"],
            ["input 3 status", value[1] ? "Activo": "Inactivo"],
            ["input 4 status", value[0] ? "Activo": "Inactivo"]
        ];

        //param2 = "00";

        value = hexToBit(param2);
        
        const p3 = [
            ["output 1 status", value[3] ? "Activo": "Inactivo"],
            ["output 2 status", value[2] ? "Activo": "Inactivo"],
            ["output 3 status", value[1] ? "Activo": "Inactivo"],
            ["output 4 status", value[0] ? "Activo": "Inactivo"]
        ];

        p1.concat(p2).concat(p3).forEach(e=>{
            row.create("span").addClass("label").text(e[0]);
            row.create("div").text(e[1]);
        })

        row.create("span").addClass("label").text(config.fields[3].label);
        const text3 = row.create("div").text(param3);

        row.create("span").addClass("label").text(config.fields[4].label);
        const text4 = row.create("div").text(param4);

        row.create("span").addClass("label").text(config.fields[5].label);
        const text5 = row.create("div").text(param5);
        
        row.create("span").addClass("label").text(config.fields[6].label);
        const text6 = row.create("div").text(param6);

        const _func = (event)=>{
            
            query[index] = {
                

            };
            const formData = new FormData();
            formData.append("id", command.id || "");
            formData.append("unit_id", command.unit_id);
            formData.append("command_id", command.command_id);
            formData.append("index", "0");
            formData.append("status", "1");
            formData.append("params", JSON.stringify(query[index]));
            formData.append("query", JSON.stringify(query));
            formData.append("mode", "1");

            formData.append("__mode_", command.__mode_);
            formData.append("__record_", (command.__record_ != "") ? JSON.stringify(command.__record_) : "");


            return formData;

        }
        
        const button = main.create("button").prop({ "type": "button", innerHTML: "Recibir" });
        button.on("click", (event) => {
            this.goSave(_func(event), "W", 1);
        });

    }

    private createForm204(main, unitId, index, eventList, config, command) {

        if (!config) {
            return;
        }

        const list = new Input({
            target: main,
            input: "input",
            type: "select",
            name: "list",
            value: index,
            caption: "Alarmas",
            data: eventList.map(e => [e.event_id, e.event_id + ": " + e.name]),

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.config.index = event.currentTarget.value;
                    this.config.commandId = command.command_id;
                    this.goInit204(main, this.config);
                },
            },
        });

        if (index < 0) {
            return;
        }

        const grid = main.create("div").addClass("grid");

        let params = "";
        let param2 = "";

        const query = command.query || {};

        if (query && query[index] && query[index].param_2) {
            param2 = query[index].param_2.toString() + "";
        }

        const paramValues = param2.split(",");

        const row = grid.create("div").addClass("row");

        row.create("span").addClass("label").text("string");
        const textString = row.create("input").prop({ "type": "text", "name": "string" }).addClass(["o1"]).val("");


        const _func = (event)=>{
            query[index] = {
                param_0: index,
                param_1: textString.val()
            };
            const formData = new FormData();
            formData.append("id", command.id || "");
            formData.append("unit_id", command.unit_id);
            formData.append("command_id", command.command_id);
            formData.append("index", "0");
            formData.append("status", "1");
            formData.append("params", JSON.stringify({
                param_0: index,
                param_1: textString.val()

            }));
            formData.append("query", JSON.stringify(query));
            formData.append("mode", "1");

            formData.append("__mode_", command.__mode_);
            formData.append("__record_", (command.__record_ != "") ? JSON.stringify(command.__record_) : "");
            return formData;

        };

        main.create("button").prop({ "type": "button", innerHTML: "SAVE" })
        .on("click", (event) => {
            this.goSave(_func(event), "W", 0);
        });
        main.create("button").prop({ "type": "button", innerHTML: "SEND" })
        .on("click", (event) => {
            this.goSave(_func(event), "W", 1);
        });


    }


    private createForm250(main, unitId, index, eventList, config, command) {

        if (!config) {
            return;
        }

        const list = new Input({
            target: main,
            input: "input",
            type: "select",
            name: "list",
            value: index,
            caption: "Alarmas",
            data: config.data.map(e => [e[0], e[1]]),

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.config.index = event.currentTarget.value;
                    this.config.commandId = command.command_id;
                    this.goInit250(main, this.config);
                },
            },
        });

        if (index < 0) {
            return;
        }

        const grid = main.create("div").addClass("grid");

        let param1 = "";
        let param2 = "";

        const query = command.query || {};

        if (query && query[index] && query[index].param_2) {
            param1 = query[index].param_1.toString() + "";
            param2 = query[index].param_2.toString() + "";
        }


        console.log(param2)
        const paramValues = param2.split(",");


        const row = grid.create("div").addClass("row");

        row.create("span").addClass("label").text("mode");
        //const output1  = row.create("input").prop({"type": "input", "name":"mode"}).addClass(["o1"]).val();


        const mode = new Input({
            target: row,
            input: "input",
            type: "select",
            name: "mode",
            value: param1,
            caption: "mode",
            data: config.fields[1].data.filter(e => e[2] == index).map(e => [e[0], e[1]])

        });


        row.create("span").addClass("label").text("time");
        const time1 = row.create("input").prop({ "type": "input", "name": "time" }).addClass(["o1"]);
        if (param2) {
            time1.val(param2);
        }


        const _func = (event)=>{
            query[index] = {
                param_0: index,
                param_1: mode.getValue(),
                param_2: time1.val()
            };
            const formData = new FormData();
            formData.append("id", command.id || "");
            formData.append("unit_id", command.unit_id);
            formData.append("command_id", command.command_id);
            formData.append("index", "0");
            formData.append("status", "1");
            formData.append("params", JSON.stringify({
                param_0: index,
                param_1: mode.getValue(),
                param_2: time1.val()
            }));
            formData.append("query", JSON.stringify(query));
            formData.append("mode", "1");

            formData.append("__mode_", command.__mode_);
            formData.append("__record_", (command.__record_ != "") ? JSON.stringify(command.__record_) : "");


            return formData;

        };

        main.create("button").prop({ "type": "button", innerHTML: "SAVE" })
        .on("click", (event) => {
            this.goSave(_func(event), "W", 0);
        });
        main.create("button").prop({ "type": "button", innerHTML: "SEND" })
        .on("click", (event) => {
            this.goSave(_func(event), "W", 1);
        });


    }

    private createForm808(main, unitId, index, eventList, config, command) {


        if (!config) {
            return;
        }


        const list = new Input({
            target: main,
            input: "input",
            type: "select",
            name: "list",
            value: index,
            caption: "Alarmas",
            data: config.fields[0].data,

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.config.index = event.currentTarget.value;
                    this.config.commandId = command.command_id;

                    this.goInit808(main, this.config);
                    //this.setIndex(event.currentTarget.value);
                    //this.goConfig(this.unitId, this.index, 1, "0");
                    //this.goGetCommand(this.unitId, null, event.currentTarget.value, "0", 1);

                    //this.goGetCommand(this.unitId, event.currentTarget.value, 0, "0", 1);
                },
            },
        });

        if (index < 0) {
            return;
        }



        const grid = main.create("div").addClass("grid").ds("commandId", command.command_id);

        let params = "";
        let param2 = "";

        const query = command.query || {};

        if (query && query[index] && query[index].param_2) {
            param2 = query[index].param_2.toString() + "";
        }

        const values = command.values || {};



        const paramValues = param2.split(",");



        config.request[index].forEach((element, index) => {
            const row = grid.create("div").addClass("row");

            let value = "";
            /*
             if(values && values[`param_${index + 1}`]){
                 value = values[`param_${index + 1}`];
             }
             */
            const label = row.create("span").addClass("label").text(element);
            const output1 = row.create("input").prop({ "type": "text" }).addClass(["p"]).val(value);


        });


        const _func = (event)=>{
            const formData = new FormData();
            formData.append("id", command.id || "0");
            formData.append("unit_id", command.unit_id);
            formData.append("command_id", command.command_id);
            formData.append("name", command.name);
            formData.append("index", command.index);
            formData.append("status", "1");
            formData.append("read", "0");
            formData.append("params", JSON.stringify({
                param_0: index
            }));
            formData.append("query", "");
            formData.append("mode", "1");

            formData.append("__mode_", command.__mode_);
            formData.append("__record_", (command.__record_ != "") ? JSON.stringify(command.__record_) : "");


            return formData;

        };

		
        main.create("button").prop({ "type": "button", innerHTML: "Recibir" })
        .on("click", (event) => {
            
            this.goSave(_func(event), "W", 1, ()=>{

                const timer = setTimeout(() => {
                    this.goCommandData(unitId, command.command_id, command.index);

                }, 5000);
            });
        });


    }

    public goGetValues(unitId, commandId, index) {





        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            //form: form,
            blockingTarget: this.main,
            requestFunctions: {

                go: (json) => {

                },
            },
            params: [
                {
                    t: "setMethod",
                    mode: "element",
                    element: "s-formm",
                    method: "save",

                    name: "/gt/forms/unit_command",
                    eparams: {},
                    iToken: "goSave",
                },

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
                    iToken: "go",
                }
            ],
        });
    }

    public goSave(form, type, send?, callBack?) {



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
                        if(callBack){
                            callBack();
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


    public goSave808(form, type, send?) {



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

                        const timer = setTimeout(() => {
                            this.goCommandData(unitId, commandId, index);

                        }, 5000);

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

    public goCommandData(unitId, commandId, index) {


        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            //form: form,
            blockingTarget: this.main,
            requestFunctions: {

                fn: (json) => {

                    let data = [];

                    if (json.status && json.status == 3) {

                        for (let x in json.values) {
                            if (x != "param_0") {
                                data.push(json.values[x]);
                            }

                        }


                        const elems = this.main.queryAll(`.grid[data-command-id='${commandId}'] input.p`);
                        if (elems) {
                            elems.forEach((e, index) => {
                                e.value = data[index] || "";
                            });

                        }
                    } else {
                        /*
                        const timer = setTimeout(()=>{
                      

                        }, 5000);
                        */
                    }



                },
            },
            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-command-data",//(type == "0") ? "get-event" : "get-command",
                    name: "",
                    eparams: {
                        unitId: unitId,
                        commandId: commandId,
                        index: index

                    },
                    iToken: "fn",
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

        this.goGetValues(unitId, commandId, index);
    }





}