import { _sgQuery as $, SQObject } from "../../Sevian/ts/Query.js";
import { Menu as Menu } from "../../Sevian/ts/Menu2.js";
import { Float } from "../../Sevian/ts/Window.js";
import { Map, MapApi, MapControl } from './Map.js';
import {
    I,
    Input,
    Hidden,
    InputDate,
    InputInfo,
    Multi,
} from "../../Sevian/ts/Input.js";
import { Form2 as Form } from "../../Sevian/ts/Form2.js";
import { Tab } from "../../Sevian/ts/Tab.js";
import { S } from "../../Sevian/ts/Sevian.js";

import { Communication } from "./Communication.js";
import { UnitConfig } from "./UnitConfig.js"
import { InfoComm, InfoMenu, InfoUnits } from './InfoMenu.js';

import { InfoForm } from '../../Sevian/ts/InfoForm.js';

export class Search {

    public id: any = null;
    public caption: string = "";
    public formId: string = "form-" + String(new Date().getTime());
    public className: any = null;

    private main: SQObject = null;
    private wins: any[] = [];
    private unitPanelId: string = "";
    private unitPanel: any = null;

    resultLayer: SQObject = null;

    constructor(info: Search) {

        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        let main = this.id ? $(this.id) : null;

        if (!main) {
            main = $.create("div").attr("id", this.id);
            main.on("click", (event) => {

            })
        }

        if (this.unitPanelId) {
            this.unitPanel = S.getElement(this.unitPanelId);
            this.unitPanel.addEvent((unitId: number) => {

                if (this.wins["main"].getVisible()) {
                    this.show(unitId);
                }

            });
            this.unitPanel.onPending = (unitId: number) => {

                this.show(unitId);
            };
        }

        this.create(main);

    }

    public showUnit(unitId) {
        if (unitId) {
            this.unitPanel.setUnit(unitId);
            this.unitPanel.showUnit3(unitId);
        }
    }
    public create(main: SQObject) {

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

    public show() {
        this.wins["main"].show({
            left: 'center',
            top: 'middle',
        });
    }

    private goSearch(q: string) {
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

    private showResult(data) {
        this.resultLayer.text("");

        data.forEach(info => {
            const row = this.resultLayer.create("div").addClass("row");
            row.on("click", (event) => {
                this.showUnit(info.unitId);
            })
            row.create("div").append($.create("img").attr("src", info.image));
            //row.create("div").text(info.unitId);
            row.create("div").text(info.unitName);
            row.create("div").text(info.deviceName);
            row.create("div").text(info.plate);


        });

    }
}
