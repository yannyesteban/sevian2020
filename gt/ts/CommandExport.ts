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
import { S } from "../../Sevian/ts/Sevian.js";


export class CommandExport {
    private id: any = "import-module1";
    private className: any = "tool-import";
    private main: SQObject = null;
    private grid: SQObject = null;

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

        const menu = main.create("div").addClass("menu");
        const chk = menu.create("input").prop({
            type: "checkbox"



        });

        chk.on("change", (event) => {
            const value = event.currentTarget.checked;

            const elems = this.grid.queryAll(`input[type="checkbox"]`);
            if (elems) {
                elems.forEach(element => {
                    element.checked = value;

                });
            }
        });
        this.grid = main.create("div").addClass("grid");
        menu.create("span").text("todos");
        const nav = main.create("div").addClass("nav");
        nav.create("input").prop({
            type: "text",
            name: "name",
            placeholder: "...Exportar Como"
        });
        nav.create("button").text("Exportar")
            .on("click", event => {
                this.goSave();
            });
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
                    this.createGrid(json);
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "load-file",
                    name: "",
                    eparams: {
                        unitId
                    },
                    iToken: "f",
                },
            ],
        });
    }



    private goSave() {

        if (this.getNameList() == "") {
            alert("Nombre es Obligatorio!")
            return;
        }

        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
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
                    method: "save-file",
                    name: "",
                    eparams: {
                        list: this.getCommandList(),
                        name: this.getNameList()
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
                value: info.id,
                checked: true
            });
            //row.create("div").text(info.id);
            row.create("div").text(info.role);
            row.create("div").text(info.cindex);
            //row.create("div").text(info.unitId);





        });
    }



}