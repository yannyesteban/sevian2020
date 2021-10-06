import { _sgQuery as $, SQObject } from "../../Sevian/ts/Query.js";
import {
    I,
    Input,
    Hidden,
    InputDate,
    InputInfo,
    Multi,
} from "../../Sevian/ts/Input.js";

import { S } from "../../Sevian/ts/Sevian.js";


export class ExpImp {
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

        main.addClass(this.className).text("hello");
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

    private createGrid(data) {
        this.main.text("");

        data.forEach(info => {
            const row = this.main.create("div").addClass("row");
            row.on("click", (event) => {

            });
            row.create("input").prop({
                type: "checkbox"
            });
            row.create("div").text(info.id);
            row.create("div").text(info.role);
            row.create("div").text(info.cindex);
            //row.create("div").text(info.unitId);





        });
    }

}