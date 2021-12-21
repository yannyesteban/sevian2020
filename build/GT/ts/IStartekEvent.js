import { _sgQuery as $ } from "../../Sevian/ts/Query.js";
import { Float } from "../../Sevian/ts/Window.js";
import { Form2 as Form } from "../../Sevian/ts/Form2.js";
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
    }
    get() {
        return this.main;
    }
    init(unitId) {
        this.goInit(unitId);
    }
    goInit(unitId) {
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json);
                    this.createForm(json.eventList, unitId);
                },
            },
            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-native-events",
                    name: "",
                    eparams: {
                        unitId
                    },
                    iToken: "f",
                },
            ],
        });
    }
    goImport(unitId, fileId) {
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
                    }
                    else {
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
    goDelete(unitId, fileId) {
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
                    }
                    else {
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
    getCommandList() {
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
    getNameList() {
        const elems = this.main.query(`input[name="name"]`);
        const result = [];
        if (elems) {
            return elems.value;
        }
        return "";
    }
    createGrid(data) {
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
    createForm(data, unitId) {
        this.main.text("");
        this.tab = new Tab({
            target: this.main,
            className: "tab-tool",
            onOpen: (index) => {
            }
        });
        const button = this.main.create("button").text("Send");
        this.tabs["212"] = this.tab.add({ caption: "212", tagName: "form" });
        this.tabs["210"] = this.tab.add({ caption: "210", tagName: "form" });
        this.tabs["203"] = this.tab.add({ caption: "203", tagName: "form" });
        const grid = this.tabs["212"].create("div").addClass("grid");
        data.forEach(element => {
            const row = grid.create("div").addClass("row");
            const label = row.create("span").addClass("label").text(element.name);
            const output1 = row.create("input").attr("type", "checkbox").val(element.event_id).addClass(["o1"]);
            const output2 = row.create("input").attr("type", "checkbox").val(element.event_id).addClass(["o2"]);
        });
        return;
        const fields = [];
        fields.push({
            caption: "File",
            name: "file_id",
            input: "input",
            type: "select",
            value: "",
            data: data.map((info) => [info.id, info.name])
        });
        fields.push({
            caption: "Unit Id",
            name: "unit_it",
            input: "input",
            type: "hidden",
            value: unitId
        });
        this.form = new Form({
            target: this.main,
            id: "dddd",
            caption: "Importación",
            fields: fields,
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        caption: "Importar",
                        action: (item, event) => {
                            this.goImport(unitId, this.form.getInput("file_id").getValue());
                        }
                    },
                    {
                        caption: "Eliminar Registro",
                        action: (item, event) => {
                            this.goDelete(unitId, this.form.getInput("file_id").getValue());
                        }
                    }
                ]
            }
        });
    }
}
//# sourceMappingURL=IStartekEvent.js.map