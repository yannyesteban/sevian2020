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
                this.config.index = -1;
                if (index === 0) {
                    this.config.roleId = 7;
                    this.goInit(this.tabs["203"], this.config);
                }

                if (index === 1) {
                    this.config.roleId = 8;
                    this.goInit(this.tabs["210"], this.config);
                }
                if (index === 2) {
                    this.config.roleId = 9;
                    this.goInit(this.tabs["212"], this.config);
                }
                if (index === 3) {
                    this.config.roleId = 10;
                    this.goInit808(this.tabs["808"], this.config);
                }
                if (index === 4) {
                    this.config.roleId = 11;

                    this.goInit204(this.tabs["204"], this.config);
                }
                if (index === 5) {
                    this.config.roleId = 12;
                    this.goInit(this.tabs["205"], this.config);
                }

                if (index === 6) {
                    this.config.roleId = 13;
                    this.goInit(this.tabs["206"], this.config);
                }

                if (index === 7) {
                    this.config.roleId = 14;
                    this.goInit250(this.tabs["250"], this.config);
                }


            }
        });
        this.tabs["203"] = this.tab.add({ caption: "203 Num", tagName: "form" });
        this.tabs["210"] = this.tab.add({ caption: "210 Srv", tagName: "form" });
        this.tabs["212"] = this.tab.add({ caption: "212 Out", tagName: "form" });
        this.tabs["808"] = this.tab.add({ caption: "808", tagName: "form" });

        this.tabs["204"] = this.tab.add({ caption: "204", tagName: "form" });
        this.tabs["205"] = this.tab.add({ caption: "205", tagName: "form" });
        this.tabs["206"] = this.tab.add({ caption: "206", tagName: "form" });
        this.tabs["250"] = this.tab.add({ caption: "250", tagName: "form" });



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

                    if( this.config.index <= 0){
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

        let params = "";
        let param2 = "";

        const query = command.query || {};

        if (query && query[index] && query[index].param_2) {
            param2 = query[index].param_2.toString() + "";
        }

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
                })

            });

        });



        const button = main.create("button").prop({ "type": "button", innerHTML: "SEND" });

        button.on("click", (event) => {


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



            this.goSave(formData, "W", 1);
        });


        return;


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



        const button = main.create("button").prop({ "type": "button", innerHTML: "SEND" });

        button.on("click", (event) => {


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



            this.goSave(formData, "W", 1);
        });


        return;


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

        let params = "";
        let param2 = "";

        const query = command.query || {};

        if (query && query[index] && query[index].param_2) {
            param2 = query[index].param_2.toString() + "";
        }

        const paramValues = param2.split(",");


        const row = grid.create("div").addClass("row");

        row.create("span").addClass("label").text("mode");
        //const output1  = row.create("input").prop({"type": "input", "name":"mode"}).addClass(["o1"]).val();


        const mode = new Input({
            target: row,
            input: "input",
            type: "select",
            name: "mode",
            value: index,
            caption: "mode",
            data: config.fields[1].data.map(e => [e[0], e[1]])

        });


        row.create("span").addClass("label").text("time");
        const time1 = row.create("input").prop({ "type": "input", "name": "time" }).addClass(["o1"]);


        /*
        eventList.forEach(element => {
            const row = grid.create("div").addClass("row");
            const label  = row.create("span").addClass("label").text(element.name);
            const output1  = row.create("input").prop({"type": "checkbox", checked:(paramValues.find(e=> e ==element.event_id))}).addClass(["o1"]).val(element.event_id);
            output1.on("change", (event)=>{
                const elem = grid.queryAll(`.o1:checked`);
                params = "";
                elem.forEach(e=>{
                    params += ((params!=="")?",":"") + e.value;
                })
            });
        });
        */


        const button = main.create("button").prop({ "type": "button", innerHTML: "SEND" });

        button.on("click", (event) => {


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



            this.goSave(formData, "W", 1);
        });


        return;


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


        const button = main.create("button").prop({ "type": "button", innerHTML: "SEND->" });

        button.on("click", (event) => {

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



            this.goSave808(formData, "W", 1);
        });


        return;


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
                    element: "s-form",
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
                                e.value = data[index];
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

        //this.goGetValues(unitId, commandId, index);
    }





}