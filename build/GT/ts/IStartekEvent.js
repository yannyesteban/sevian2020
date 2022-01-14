import { _sgQuery as $ } from "../../Sevian/ts/Query.js";
import { Input, } from "../../Sevian/ts/Input.js";
import { S } from "../../Sevian/ts/Sevian.js";
import { Tab } from "../../Sevian/ts/Tab.js";
export class IStartekEvent {
    constructor(info) {
        this.id = "istartek-module";
        this.className = "tool-istartek";
        this.main = null;
        this.form = null;
        this.tab = null;
        this.tabs = [];
        this.config = {};
        this.socket = null;
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
    create(main) {
        this.main = main;
        main.addClass(this.className);
        this.main.text("");
        this.tab = new Tab({
            target: this.main,
            className: "tab-tool",
            onOpen: (index) => {
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
            }
        });
        this.tabs["203"] = this.tab.add({ caption: "203 Num", tagName: "form" });
        this.tabs["210"] = this.tab.add({ caption: "210 Srv", tagName: "form" });
        this.tabs["212"] = this.tab.add({ caption: "212 Out", tagName: "form" });
        this.tabs["808"] = this.tab.add({ caption: "808", tagName: "form" });
    }
    get() {
        return this.main;
    }
    init(unitId) {
        this.config = {
            unitId,
            commandId: 0,
            index: -1,
            mode: 1,
            type: "w",
            roleId: 0
        };
        //this.goInit(unitId, 2554, 0, 1, "W");
    }
    goInit(main, config) {
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json);
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
    goInit808(main, config) {
        console.log(808);
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json);
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
    createForm(main, unitId, index, eventList, config, command) {
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
            data: config.indexRange.map(e => [e, e]),
            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },
            events: {
                change: (event) => {
                    this.config.index = event.currentTarget.value;
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
    createForm808(main, unitId, index, eventList, config, command) {
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
    goGetValues(unitId, commandId, index) {
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
    goSave(form, type, send) {
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
    goSave808(form, type, send) {
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
    goCommandData(unitId, commandId, index) {
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
                    }
                    else {
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
                    method: "get-command-data",
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
    send(unitId, commandId, index, mode) {
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
//# sourceMappingURL=IStartekEvent.js.map