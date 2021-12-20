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


export class IStartekEvent {
    private id: any = "istartek-module";
    private className: any = "tool-istartek";
    private main: SQObject = null;
    private form: Form = null;

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


    }
    public get() {
        return this.main;
    }

    public init(unitId: number) {
        this.goInit(unitId);
    }



    private goInit(unitId: number) {
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

    private createForm(data, unitId) {

        const grid = this.main.create("div").addClass("grid");

        data.forEach(element => {
            const row = grid.create("div").addClass("row");

            const label  = grid.create("span").addClass("label").text(element.name);
            const output1  = grid.create("input").attr("type","checkbox").val(element.event_id).addClass(["o1"]);
            const output2  = grid.create("input").attr("type","checkbox").val(element.event_id).addClass(["o2"]);
        });


        return;

        const fields = [];
        fields.push({
            caption: "File",
            name: "file_id",
            input: "input",
            type: "select",
            value: "",
            data: data.map((info)=>[info.id, info.name])
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
            }});
    }

}