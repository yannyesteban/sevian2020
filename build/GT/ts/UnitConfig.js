import { _sgQuery as $ } from "../../Sevian/ts/Query.js";
import { Input, } from "../../Sevian/ts/Input.js";
import { Form2 as Form } from "../../Sevian/ts/Form2.js";
import { S } from "../../Sevian/ts/Sevian.js";
export class UnitConfig {
    constructor(info) {
        this.id = null;
        this.caption = "";
        this.className = "unit-config";
        this.main = null;
        this.wins = [];
        this.forms = {};
        this.unitId = null;
        this.tab = null;
        this.tabs = [];
        this.socketId = "";
        this.socket = null;
        this.unitPanelId = "";
        this.unitPanel = null;
        this.tagMain = "div";
        this.list = null;
        this.formIds = {};
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
    get() {
        return this.main;
    }
    create(main) {
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
    init(unitId) {
        this.unitId = unitId;
        this.goInit(this.unitId);
    }
    show(unitId, index) {
        if (index !== undefined) {
            this.index = index;
        }
        let last = null;
        try {
            $(this.formIds["0"]).text("");
            $(this.formIds["A"]).text("");
            $(this.formIds["M"]).text("");
            $(this.formIds["W"]).text("");
        }
        catch (e) {
        }
        if (unitId !== undefined) {
            this.unitId = unitId;
        }
        else if (last = this.unitPanel.getLastUnit()) {
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
        }
        else {
            alert("no unit selected!!!");
        }
    }
    setUnitId(unitId) {
        this.unitId = unitId;
    }
    getUnitId() {
        return this.unitId;
    }
    start(unitId, index) {
        if (unitId !== undefined) {
            this.unitId = unitId;
        }
        if (index !== undefined) {
            this.index = index;
        }
        this.goInit(this.unitId, this.index, 0);
    }
    goInit(unitId) {
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
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
    goGetUnitEvent(unitId, eventId) {
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    console.log(json);
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
    goSave(form) {
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
    loadForm(record) {
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
            data: [[1, "Inmediato"], [2, "Evento"], [4, "Alarm"], [8, "Unidad"]],
            check: (value, inputs) => {
                inputs.forEach((input) => {
                    if ((parseInt(value, 10) & parseInt(input.value, 10)) ==
                        parseInt(input.value)) {
                        input.checked = true;
                    }
                    else {
                        input.checked = false;
                    }
                });
            },
            onchange: function (item) {
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
//# sourceMappingURL=UnitConfig.js.map