

import { _sgQuery as $, SQObject } from "../../Sevian/ts/Query.js";
import { Menu as Menu } from "../../Sevian/ts/Menu2.js";
import { Float } from "../../Sevian/ts/Window.js";

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
import { InfoComm } from "./InfoMenu.js";
import { Communication } from "./Communication";

export class UnitConfig {
    public id: any = null;
    public caption: string = "";



    public className: any = "unit-config";
    private main: SQObject = null;

    private wins: any[] = [];

    private forms: { [key: string]: Form } = {};

    private unitId: number = null;

    private tab: Tab = null;
    private tabs: any[] = [];

    private socketId: string = "";
    private socket: Communication = null;

    private unitPanelId: string = "";
    private unitPanel: any = null;

    private tagMain = "div";
    private list: any = null;

    public formIds = {};

    public data: any[] = [];
    constructor(info: any) {
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        let main = this.id ? $(this.id) : null;

        if (!main) {
            main = $.create(this.tagMain);
            if (this.id) {
                main.id(this.id);
            }
        }

        this.create(main);
    }

    public get() {
        return this.main;
    }
    public create(main: SQObject) {
        main.addClass(this.className);

        this.main = main;

        this.list = new Input({
            target: this.main,
            input: "input",
            type: "select",
            name: "event_list",
            value: "1",
            caption: "",
            data: [
                [100, 100],
                [101, 101],
            ],

            onAddOption: (option, data) => {
                if (data[3] !== undefined) {
                    $(option).addClass("status-" + data[3]);
                }
            },

            events: {
                change: (event) => {
                    this.goGetUnitEvent(this.unitId, event.currentTarget.value);
                },
            },
        });

        this.formIds["0"] = "f-unit-config" + String(new Date().getTime());


    }

    public createGrid(data) {
        
        this.data = data;
        const main = this.main;

        main.text("");
        const table = main.create("table").addClass(["event-grid", "grid"]);
        const row = table.create("tr")
        row.create("td").text("evento");
        row.create("td").text("Inm");
        row.create("td").text("Ev");
        row.create("td").text("Ala");
        data.forEach((info, index) => {
            const row = table.create("tr").addClass("grid-row").ds("id", info.id).ds("index", index);
            row.create("td").text(info.name);

            const cell1 = row.create("td");
            const check1 = cell1.create("input").prop({
                "type": "checkbox", value: 1, title: "Inmediato",
                "checked": ((info.mode & 1) == 1) ? true : false
            });



            const cell2 = row.create("td");
            const check2 = cell2.create("input").prop({
                "type": "checkbox",
                value: 2,
                title: "Evento",

                "checked": ((info.mode & 2) == 2) ? true : false
            });



            const cell3 = row.create("td");
            const check3 = cell3.create("input").prop({
                "type": "checkbox",
                value: 4,
                title: "Alarma",
                "checked": ((info.mode & 4) == 4) ? true : false
            });
            check1.on("change", (event) => {


                this.goSaveEvent(index, 1);
            });
            check2.on("change", (event) => {
                const checked = event.currentTarget.checked;

                if (checked) {

                    check3.get().checked = false;
                }
                this.goSaveEvent(index, 2);
            });
            check3.on("change", (event) => {
                const checked = event.currentTarget.checked;

                if (checked) {


                    check2.get().checked = false;
                }
                this.goSaveEvent(index, 4);
            });



        });
    }

    public getModeValue(index) {
        const aux = this.main.queryAll(`[data-index="${index}"] input[type="checkbox"]`);
        let value = 0;
        if (aux) {
            aux.forEach(chk => {
                if (chk.checked) {
                    value += Number.parseInt(chk.value, 10);
                }

            });
        }
        return value;
    }

    public goSaveEvent(index, value) {

        const mode = this.getModeValue(index);

        console.log(this.data[index]);

        const formData = new FormData();
        formData.append("unit_id", this.data[index].unit_id);
        formData.append("name", this.data[index].name);
        formData.append("event_id", this.data[index].event_id);
        formData.append("mode", mode.toString());
        formData.append("__mode_", this.data[index].__mode_);
        formData.append("__record_", this.data[index].__record_);

        const unitId = this.data[index].unitId;


        S.go({
            async: true,
            valid: false,
            form: formData,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json)
                    if (json.error) {
                        new Float.Message({
                            "caption": "Command",
                            "text": "Record wasn't saved!!!!",
                            "className": "",
                            "delay": 3000,
                            "mode": "",
                            "left": "center",
                            "top": "top"
                        }).show({});
                    } else {
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
                    //this.loadForm(json);
                    //this.loadTab(json.command, type);
                    //this.loadForm(json.command, type, index);
                    //this.createForm(json.command, type);
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-unit-config",
                    method: "save-event",
                    name: "",
                    eparams: {
                        unitId

                    },
                    iToken: "f",
                },
            ],
        });
    }
    public init(unitId: number) {
        this.unitId = unitId;

        this.goInit(this.unitId);


    }

    public show(unitId?, index?: number) {

        if (index !== undefined) {
            this.index = index;
        }

        let last = null;


        try {
            $(this.formIds["0"]).text("");
            $(this.formIds["A"]).text("");
            $(this.formIds["M"]).text("");
            $(this.formIds["W"]).text("");
        } catch (e) {

        }



        if (unitId !== undefined) {
            this.unitId = unitId;
        } else if (last = this.unitPanel.getLastUnit()) {
            this.unitId = last;

        }

        if (this.unitPanel && this.unitId) {
            this.unitName = this.unitPanel.getUnitInfo(this.unitId).unitName;
        }



        /*
        this.start(this.unitId, this.index);
        this.wins["main"].show();
        return;
        */

        if (this.unitId) {
            this.start(this.unitId, this.index);
            this.wins["main"].setCaption(`${this.caption} : ${this.unitName}`);
            this.wins["main"].show();
        } else {
            alert("no unit selected!!!")
        }
    }

    public setUnitId(unitId) {
        this.unitId = unitId;
    }
    public getUnitId() {
        return this.unitId;
    }



    public start(unitId?: number, index?: number) {
        if (unitId !== undefined) {
            this.unitId = unitId;
        }

        if (index !== undefined) {
            this.index = index;
        }

        this.goInit(this.unitId, this.index, 0);
    }

    private goInit(unitId: number) {
        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {

                    

                    this.createGrid(json.events);
                    return;

                    this.list.setOptionsData([['', ' - ']].concat(json.eventList));
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-unit-config",
                    method: "init",
                    name: "",
                    eparams: {
                        unitId: unitId,


                    },
                    iToken: "f",
                },
            ],
        });
    }

    private goGetUnitEvent(unitId: number, eventId: number) {
        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json)
                    this.loadForm(json);
                    //this.loadTab(json.command, type);
                    //this.loadForm(json.command, type, index);
                    //this.createForm(json.command, type);
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-unit-config",
                    method: "get-unit-event",
                    name: "",
                    eparams: {
                        unitId,
                        eventId,

                    },
                    iToken: "f",
                },
            ],
        });
    }


    public goSave(form) {

        const unitId = form.getInput("unit_id").getValue();
        const eventId = form.getInput("event_id").getValue();

        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            form: form.getFormData(),
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    this.list.setOptionsData([['', ' - ']].concat(json.eventList));
                },
                f2: (json) => {
                    this.loadForm(json);
                },
            },
            params: [
                {
                    t: "setMethod",
                    mode: "element",
                    element: "s-form",
                    method: "save",
                    name: "/gt/forms/unit_event",
                    eparams: {},
                    iToken: "f2",
                },
                {
                    t: "setMethod",
                    element: "gt-unit-config",
                    method: "init",
                    name: "",
                    eparams: {
                        unitId: unitId,
                    },
                    iToken: "f",
                },
                {
                    t: "setMethod",
                    element: "gt-unit-config",
                    method: "get-unit-event",
                    name: "",
                    eparams: {
                        unitId,
                        eventId,
                    },
                    iToken: "f2",
                }
            ],
        });
    }

    private loadForm(record) {

        const fields = [];


        fields.push({
            caption: "ID",
            name: "id",
            input: "input",
            type: "hidden",
            value: record.id,
        });

        fields.push({
            caption: "Name",
            name: "name",
            input: "input",
            type: "text",
            value: record.name,
        });

        fields.push({
            caption: "Unit ID",
            name: "unit_id",
            input: "input",
            type: "hidden",
            value: record.unit_id,
        });



        fields.push({
            caption: "Event Id",
            name: "event_id",
            input: "input",
            type: "hidden",
            value: record.event_id,
        });





        fields.push({
            caption: "Mode",
            name: "mode",
            input: "multi",
            type: "checkbox",
            value: record.mode,
            data: [[1, "Inmediato"], [2, "Evento"], [4, "Alarm"]/*, [8,"Unidad"]*/],

            check: (value, inputs) => {
                inputs.forEach((input: HTMLInputElement) => {
                    if (
                        (parseInt(value, 10) & parseInt(input.value, 10)) ==
                        parseInt(input.value)
                    ) {
                        input.checked = true;
                    } else {
                        input.checked = false;
                    }
                });
            },

            onchange: function(item) {
                const parent = $(item.get().parentNode.parentNode);

                let input = parent.queryAll("input.option:checked");
                if (input) {
                    let str = 0;

                    input.forEach((i) => {
                        str += Number(i.value);
                    });
                    this._input.val(str);
                }
            }
        });

        fields.push({
            caption: "__mode_",
            name: "__mode_",
            input: "input",
            type: "hidden",
            value: record.__mode_,
        });

        fields.push({
            caption: "__record_",
            name: "__record_",
            input: "input",
            type: "hidden",
            value: (record.__record_ != "") ? JSON.stringify(record.__record_) : "",
        });



        const type = "0";
        const form = new Form({
            target: this.main,
            id: this.formIds[type],
            caption: record.event_id,
            fields: fields,
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        caption: "Save",
                        action: (item, event) => {
                            this.goSave(form);
                        },
                    },


                ],
            },
        });
    }

}
