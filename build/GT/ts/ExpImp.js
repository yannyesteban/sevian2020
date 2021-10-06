import { _sgQuery as $ } from "../../Sevian/ts/Query.js";
import { S } from "../../Sevian/ts/Sevian.js";
export class ExpImp {
    constructor(info) {
        this.id = "import-module1";
        this.className = "tool-import";
        this.main = null;
        this.grid = null;
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
        main.addClass(this.className).text("hello");
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
    createGrid(data) {
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
//# sourceMappingURL=ExpImp.js.map