import { _sgQuery as $ } from "../../Sevian/ts/Query.js";
import { Float } from "../../Sevian/ts/Window.js";
import { S } from "../../Sevian/ts/Sevian.js";
export class Search {
    constructor(info) {
        this.id = null;
        this.caption = "";
        this.formId = "form-" + String(new Date().getTime());
        this.className = null;
        this.main = null;
        this.wins = [];
        this.unitPanelId = "";
        this.unitPanel = null;
        this.resultLayer = null;
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = this.id ? $(this.id) : null;
        if (!main) {
            main = $.create("div").attr("id", this.id);
        }
        if (this.unitPanelId) {
            this.unitPanel = S.getElement(this.unitPanelId);
        }
        this.create(main);
    }
    showUnit(unitId) {
        if (unitId) {
            this.unitPanel.setUnit(unitId);
            this.unitPanel.showUnit3(unitId);
        }
    }
    create(main) {
        main.addClass("search-tool");
        this.main = main;
        const input = main.create("input").prop({
            name: "q",
            type: "text",
            autocomplete: "off"
        });
        input.on("keyup", event => {
            this.goSearch(event.currentTarget.value);
        });
        this.resultLayer = main.create("div").addClass("grid");
        this.wins["main"] = new Float.Window({
            visible: false,
            caption: this.caption,
            left: 'center',
            top: 'middle',
            //deltaX: -50 - 350,
            //deltaY: -140 - 20,
            width: "330px",
            height: "320px",
            mode: "auto",
            className: ["sevian"],
            child: this.main,
            onshow: (info) => {
                //this.play();
            },
            onhide: (info) => {
                //this.stop();
            },
        });
    }
    show() {
        this.wins["main"].show({
            left: 'center',
            top: 'middle',
        });
    }
    goSearch(q) {
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.resultLayer,
            requestFunctions: {
                f: (json) => {
                    console.log(json);
                    this.showResult(json);
                },
            },
            params: [
                {
                    t: "setMethod",
                    element: "gt-search",
                    method: "search",
                    name: "",
                    eparams: {
                        q: q,
                    },
                    iToken: "f",
                },
            ],
        });
    }
    showResult(data) {
        this.resultLayer.text("");
        data.forEach(info => {
            const row = this.resultLayer.create("div").addClass("row");
            row.on("click", (event) => {
                this.showUnit(info.unitId);
            });
            row.create("div").append($.create("img").attr("src", info.image));
            //row.create("div").text(info.unitId);
            row.create("div").text(info.unitName);
            row.create("div").text(info.deviceName);
            row.create("div").text(info.plate);
        });
    }
}
//# sourceMappingURL=Search.js.map