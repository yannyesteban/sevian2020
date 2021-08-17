import { _sgQuery } from './Query.js';
import { List } from './List.js';
import { FormDetail } from './FormDetail.js';
export class I {
    static create(name, info) {
        return new I._ele_[name](info);
    }
    static register(name, classInput) {
        I._ele_[name] = classInput;
    }
}
I._ele_ = [];
I.register("list", List);
export var $I = {};
export var Input = (($) => {
    class Input {
        constructor(info) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "";
            this.caption = "";
            this.value = "";
            this.default = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = null;
            this.placeholder = "";
            this.rules = null;
            this.context = null;
            this.parentContext = null;
            this.childs = false;
            this.parent = "";
            this.parentValue = null;
            this._main = null;
            this._input = null;
            this.status = "valid";
            this.mode = "request";
            this.evalChilds = () => { };
            this.getParentValue = () => { };
            this.onAddOption = (option, data) => { };
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = this._main = (this.id) ? $(this.id) : null;
            if (!main) {
                this._create(false);
            }
            else {
                if (main.ds("sgInput")) {
                    return;
                }
            }
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
        }
        _create(target) {
            let info = { tagName: "input", type: "text" };
            switch (this.type) {
                case "text":
                case "password":
                case "hidden":
                case "button":
                case "submit":
                case "color":
                case "checkbox":
                case "date":
                case "time":
                case "number":
                case "range":
                    info.tagName = "input";
                    info.type = this.type;
                    break;
                case "select":
                    info.tagName = this.type;
                    break;
                case "textarea":
                    info.tagName = this.type;
                    break;
            }
            if (this.id) {
                info.id = this.id;
            }
            if (this.name) {
                info.name = this.name;
            }
            if (this.value) {
                info.value = this.value;
            }
            this._input = this._main = $.create(info).addClass("type-input").addClass(this.className);
            if (this.events) {
                for (var x in this.events) {
                    //let action = $.bind(this.events[x], this._main);
                    this._main.on(x, $.bind(this.events[x], this.context || this, "event"));
                }
            }
            if (this.childs) {
                this._main.ds("childs", "childs");
                this._main.on("change", $.bind(this.evalChilds, this.context || this, "event"));
            }
            this._main.prop(this.propertys);
            this._main.style(this.style);
            if (this.type === "select" || this.type === "multiple") {
                this.createOptions(this.parentValue);
            }
            this._main.ds(this.dataset);
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "input");
            this._main.ds("sgType", this.type);
            if (this.parent) {
                this._main.ds("parent", this.parent);
            }
            this.setValue(this.value);
        }
        setValue(value) {
            if (this.parent) {
                let parentValue = this.getParentValue();
                if (parentValue != this.parentValue) {
                    this.createOptions(parentValue);
                }
            }
            this._input.val(value);
        }
        getValue() {
            return this.get().value;
        }
        _load(main) {
        }
        get() {
            return this._main.get();
        }
        main() {
            return this._main;
        }
        hasChilds() {
            if (this._main.ds("childs")) {
                return true;
            }
            return false;
        }
        createOptions(parentValue) {
            let i, option, vParent = [];
            this._main.get().length = 0;
            if (this.parent) {
                let aux = (parentValue + "").split(",");
                for (i = 0; i < aux.length; i++) {
                    vParent[aux[i]] = true;
                }
            }
            if (this.placeholder) {
                option = document.createElement("OPTION");
                option.value = "";
                option.text = this.placeholder;
                this._main.get().options.add(option);
            }
            for (i in this.data) {
                if (vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*") {
                    option = document.createElement("OPTION");
                    option.value = this.data[i][0];
                    option.text = this.data[i][1];
                    this.onAddOption(option, this.data[i]);
                    this._main.get().options.add(option);
                }
            }
        }
        setOptionsData(data) {
            this.data = data;
            this.createOptions(this.getParentValue());
        }
        evalOptions(parentValue) {
        }
        getName() {
            return this._main.get().name;
        }
        getId() {
            return this._main.get().id;
        }
        getText() {
            if (this._main.get().type) {
                alert(8);
            }
        }
        ds(prop, value) {
            return this._main.ds(prop, value);
        }
        focus() {
            this._main.get().focus();
        }
        select() {
            if (this._main.get().select) {
                this._main.get().select();
            }
        }
        reset() {
            this.setValue(this.default);
        }
    }
    I.register("input", Input);
    return Input;
})(_sgQuery);
export var Hidden = (($) => {
    class Hidden {
        constructor(info) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "hidden";
            this.caption = "";
            this.value = "";
            this.default = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = false;
            this.placeholder = "";
            this.rules = null;
            this.context = null;
            this.parentContext = null;
            this.childs = false;
            this.parent = "";
            this.parentValue = null;
            this._main = null;
            this._input = null;
            this.status = "valid";
            this.mode = "request";
            this.evalChilds = () => { };
            this.getParentValue = () => { };
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = this._main = (this.id) ? $(this.id) : false;
            if (!main) {
                this._create(false);
            }
            else {
                if (main.ds("sgInput")) {
                    return;
                }
            }
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
        }
        _create(target) {
            let info = {};
            info.tagName = "input";
            info.type = "hidden";
            if (this.id) {
                info.id = this.id;
            }
            if (this.name) {
                info.name = this.name;
            }
            if (this.value) {
                info.value = this.value;
            }
            this._input = this._main = $.create(info).addClass("type-input").addClass(this.className);
            this._main.prop(this.propertys);
            this._main.style(this.style);
            this._main.ds(this.dataset);
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "input");
            this._main.ds("sgType", this.type);
            this.setValue(this.value);
        }
        setValue(value) {
            this._input.val(value);
            return this;
        }
        getValue() {
            return this.get().value;
        }
        _load(main) {
        }
        get() {
            return this._main.get();
        }
        main() {
            return this._main;
        }
        hasChilds() {
            return false;
        }
        createOptions(parentValue) {
        }
        evalOptions(parentValue) {
        }
        getName() {
            return this._main.get().name;
        }
        getId() {
            return this._main.get().id;
        }
        getText() {
            if (this._main.get().type) {
                alert(8);
            }
        }
        ds(prop, value) {
            return this._main.ds(prop, value);
        }
        focus() {
            this._main.get().focus();
        }
        select() {
            this._main.get().select();
        }
        reset() {
            this.setValue(this.default);
        }
    }
    I.register("hidden", Hidden);
    return Hidden;
})(_sgQuery);
export var InputDate = (($) => {
    class InputCalendar {
        constructor(opt) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "calendar";
            this.caption = "";
            this.value = "";
            this.default = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = false;
            this.context = false;
            this.parentContext = false;
            this.placeholder = "";
            this.outFormat = "%d/%m/%yy";
            this.format = "%yy-%mm-%dd";
            this.childs = false;
            this.parent = "";
            this._main = null;
            this._input = null;
            this.status = "valid";
            this.mode = "request";
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let main = this._main = (this.id) ? $(this.id) : false;
            if (!main) {
                this._create(false);
            }
            else {
                if (main.ds("sgInput")) {
                    return;
                }
            }
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
        }
        _create(target) {
            let info = {};
            let main = this._main = $.create("div").addClass("input-calendar");
            switch (this.type) {
                case "text":
                    info.tagName = "input";
                    info.type = "hidden";
                    break;
                case "calendar":
                    info.tagName = "input";
                    info.type = "hidden";
                    break;
                case "hidden":
                default:
                    info.tagName = "input";
                    info.type = "hidden";
            }
            if (this.id) {
                info.id = this.id;
            }
            if (this.name) {
                info.name = this.name;
            }
            if (this.value) {
                info.value = this.value;
            }
            let input = this._input = main.create(info).addClass("type-input").addClass(this.className);
            let auxTxt = main.create({ tagName: "input", type: "text", value: "", name: this.name + "_aux" })
                .on("change", (event) => {
                let date = sgDate.dateFrom(event.currentTarget.value, this.outFormat);
                if (date) {
                    input.val(sgDate.evalFormat(date, this.format));
                }
                else {
                    input.val(event.currentTarget.value);
                }
            }).addClass("type-input-out");
            if (this.events) {
                for (var x in this.events) {
                    auxTxt.on(x, $.bind(this.events[x], this.context || this, "event"));
                }
            }
            auxTxt.prop(this.propertys);
            auxTxt.style(this.style);
            this._main.ds(this.dataset);
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "date");
            this._main.ds("sgType", this.type);
            this.setValue(this.value);
            let div2 = $.create("div");
            let p = this.picker = new sgDate.Picker({
                id_: this.id + "_calendar",
                target: div2,
                onselectday: (date) => {
                    auxTxt.val(sgDate.evalFormat(date, this.outFormat));
                    input.val(sgDate.evalFormat(date, this.format));
                    this.hide();
                }
            });
            let btn = main.create({ tagName: "button", type: "button", innerHTML: "&raquo;" })
                .on("click", (event) => {
                let date = sgDate.dateFrom(input.val(), "%yy-%mm-%dd");
                p.setCal(date || new Date());
                p.show({ context: event.currentTarget });
            });
        }
        hide() {
            this.picker.hide();
        }
        setValue(value) {
            let date = sgDate.dateFrom(value, this.format);
            let auxTxt = $(this._main.query(".type-input-out"));
            let value2 = "";
            if (date) {
                value2 = sgDate.evalFormat(date, this.outFormat);
            }
            else {
                value = "";
            }
            this._input.val(value);
            if (auxTxt) {
                auxTxt.val(value2);
            }
        }
        getValue() {
            let elem = this._main.query(".type-input");
            if (elem) {
                return elem.value;
            }
            return "";
        }
        _load(main) {
        }
        get() {
            return this._main.get();
        }
        main() {
            return this._main;
        }
        getName() {
            return this._main.get().name;
        }
        getId() {
            return this._main.get().id;
        }
        getText() {
            if (this._main.get().type) {
                alert(8);
            }
        }
        ds(prop, value) {
            return this._main.ds(prop, value);
        }
        focus() {
            let elem = this._main.query(".type-input-out");
            if (elem) {
                elem.focus();
            }
        }
        select() {
            let elem = this._main.query(".type-input-out");
            if (elem) {
                elem.select();
            }
        }
        reset() {
            this.setValue(this.default);
        }
    }
    I.register("date", InputCalendar);
    return InputCalendar;
})(_sgQuery);
export var InputInfo = (($) => {
    class InputInfo {
        constructor(info) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "";
            this.caption = "";
            this.value = "";
            this.default = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = false;
            this.placeholder = "";
            this.rules = null;
            this.context = null;
            this.parentContext = null;
            this.childs = false;
            this.parent = "";
            this.parentValue = null;
            this._main = null;
            this._input = null;
            this.status = "valid";
            this.mode = "request";
            this._data = null;
            this.evalChilds = () => { };
            this.getParentValue = () => { };
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = this._main = (this.id) ? $(this.id) : false;
            if (!main) {
                this._create(false);
            }
            else {
                if (main.ds("sgInput")) {
                    return;
                }
            }
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
        }
        _create(target) {
            let info = {};
            info.tagName = "input";
            info.type = "hidden";
            if (this.id) {
                info.id = this.id;
            }
            if (this.name) {
                info.name = this.name;
            }
            if (this.value) {
                info.value = this.value;
            }
            this._main = $.create("div").addClass("input-info").addClass(this.className);
            this._input = this._main.create(info);
            this._text = this._main.create("div").addClass("text");
            for (var x in this.events) {
                this._main.on(x, $.bind(this.events[x], this.context || this, "event"));
            }
            if (this.childs) {
                this._main.ds("childs", "childs");
                this._input.on("change", $.bind(this.evalChilds, this.context || this, "event"));
            }
            this._main.prop(this.propertys);
            this._main.style(this.style);
            if (this.data) {
                this.createOptions(this.parentValue);
            }
            this._main.ds(this.dataset);
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "inputInfo");
            this._main.ds("sgType", "default");
            if (this.parent) {
                this._main.ds("parent", this.parent);
            }
            this.setValue(this.value);
        }
        setValue(value) {
            if (this.parent) {
                let parentValue = this.getParentValue();
                if (parentValue != this.parentValue) {
                    this.createOptions(parentValue);
                }
            }
            if (this._data) {
                if (this._data[value]) {
                    this._text.text(this._data[value]);
                    this._input.val(value);
                }
                else {
                    this._text.text("");
                    this._input.val("");
                }
            }
            else {
                this._text.text(value);
                this._input.val(value);
            }
        }
        getValue() {
            return this._input.val();
        }
        _load(main) {
        }
        get() {
            return this._main.get();
        }
        main() {
            return this._main;
        }
        hasChilds() {
            if (this._main.ds("childs")) {
                return true;
            }
            return false;
        }
        createOptions(parentValue) {
            this._data = {};
            let i, option, vParent = [];
            if (this.parent) {
                let aux = (parentValue + "").split(",");
                for (i = 0; i < aux.length; i++) {
                    vParent[aux[i]] = true;
                }
            }
            for (i in this.data) {
                if (vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*") {
                    this._data[this.data[i][0]] = this.data[i][1];
                }
            }
        }
        evalOptions(parentValue) {
        }
        getName() {
            return this._main.get().name;
        }
        getId() {
            return this._main.get().id;
        }
        getText() {
            if (this._main.get().type) {
                alert(8);
            }
        }
        ds(prop, value) {
            return this._main.ds(prop, value);
        }
        focus() {
            this._main.get().focus();
        }
        select() {
            this._input.get().select();
        }
        reset() {
            this.setValue(this.default);
        }
    }
    I.register("inputInfo", InputInfo);
    return InputInfo;
})(_sgQuery);
export var Multi = (($) => {
    class Multi1 {
        constructor(info) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "";
            this.caption = "";
            this.value = "";
            this.default = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = false;
            this.placeholder = "";
            this.rules = null;
            this.context = null;
            this.parentContext = null;
            this.childs = false;
            this.parent = "";
            this.parentValue = "";
            this._main = null;
            this._input = null;
            this._value = null;
            this.status = "valid";
            this.mode = "request";
            this.evalChilds = () => { };
            this.getParentValue = () => { };
            this.doValues = (inputs) => {
                let value = "";
                inputs.forEach((e) => {
                    value += ((value !== "") ? "," : "") + e.value;
                });
                return value;
            };
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = this._main = (this.id) ? $(this.id) : false;
            if (!main) {
                this._create(false);
            }
            else {
                if (main.ds("sgInput")) {
                    //return;
                }
            }
            if (info.doValues) {
                this.doValues = $.bind(info.doValues, this.context || this, "inputs");
            }
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
        }
        _create(target) {
            let info = {};
            switch (this.type) {
                case "radio":
                case "checkbox":
                    break;
                default:
                    this.type = "radio";
                    break;
            }
            if (this.id) {
                info.id = this.id;
            }
            if (this.name) {
                info.name = this.name;
            }
            if (this.value) {
                info.value = this.value;
            }
            this._main = $.create("div").addClass("input-multi").addClass("type-input").addClass(this.className);
            if (this.type === "checkbox") {
                this._input = this._main.create({ tagName: "input", type: "text", name: this.name });
            }
            this._main.ds(this.dataset);
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "multi");
            this._main.ds("sgType", this.type);
            if (this.parent) {
                this._main.ds("parent", this.parent);
            }
            if (this.childs) {
                this._main.ds("childs", "childs");
            }
            this.createOptions(this.parentValue);
            this.setValue(this.value);
        }
        setValue(value) {
            this.value = value;
            if (Array.isArray(value)) {
                let data = [];
                value.forEach((v) => {
                    data[v] = v;
                });
                let input = this._main.queryAll("input.option");
                input.forEach((input) => {
                    if (data[input.value] !== undefined) {
                        input.checked = true;
                    }
                    else {
                        input.checked = false;
                    }
                });
            }
            if (Array.isArray(value)) {
                this._input.val(JSON.stringify(value));
            }
            else {
                //this._input.val(value);
            }
            return false;
        }
        getValue() {
            if (this.type === "radio") {
                let input = this._main.query("input.option:checked");
                if (input) {
                    return input.value;
                }
            }
            else {
                let inputs = this._main.queryAll("input.option:checked");
                if (inputs) {
                    return this.doValues(inputs);
                }
            }
            return "";
        }
        _load(main) {
        }
        get() {
            return this._main.get();
        }
        main() {
            return this._main;
        }
        hasChilds() {
            if (this._main.ds("childs")) {
                return true;
            }
            return false;
        }
        createInputs(data) {
            data.forEach((d, index) => {
                let div = this._main.create("span");
                div.create({ tagName: "input",
                    type: this.type,
                    name: this.name + ((this.type === "checkbox") ? "_" + index : ""),
                    id: this.id + "_" + index,
                    className: "option",
                    value: d[0] })
                    .on("click", (event) => {
                });
                div.create({ tagName: "label", htmlFor: this.id + "_" + index }).text(d[1]);
            });
        }
        _setPropertys() {
            let inputs = this._main.queryAll("input.option");
            inputs.forEach((e, index) => {
                for (var x in this.events) {
                    $(e).on(x, $.bind(this.events[x], this.context || this, "event"));
                }
                if (this.childs) {
                    $(e).on("change", $.bind(this.evalChilds, this.context || this, "event"));
                }
            });
        }
        createOptions(parentValue) {
            let i, vParent = {};
            if (this.parent) {
                let aux = (parentValue + "").split(",");
                for (i = 0; i < aux.length; i++) {
                    vParent[aux[i]] = true;
                }
            }
            let inputs = this._main.queryAll("span");
            inputs.forEach((e) => {
                e.parentNode.removeChild(e);
            });
            this.data.forEach((d, index) => {
                if (vParent[d[2]] || !this.parent || d[2] === "*") {
                    let div = this._main.create("span");
                    div.create({ tagName: "input",
                        type: this.type,
                        name: this.name + ((this.type === "checkbox") ? "_" + index : ""),
                        id: this.id + "_" + index,
                        className: "option",
                        value: d[0] });
                    div.create({ tagName: "label", htmlFor: this.id + "_" + index }).text(d[1]);
                }
            });
            this._setPropertys();
        }
        evalOptions(parentValue) {
        }
        getName() {
            return this._main.get().name;
        }
        getId() {
            return this._main.get().id;
        }
        getText() {
            if (this._main.get().type) {
                alert(8);
            }
        }
        ds(prop, value) {
            return this._main.ds(prop, value);
        }
        focus() {
            this._main.get().focus();
        }
        select() {
            this._main.get().select();
        }
        reset() {
            this.setValue(this.default);
        }
    }
    class Multi {
        constructor(info) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "";
            this.caption = "";
            this.value = "";
            this.default = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = false;
            this.placeholder = "";
            this.rules = null;
            this.context = null;
            this.parentContext = null;
            this.childs = false;
            this.parent = "";
            this.parentValue = "";
            this._main = null;
            this._input = null;
            this._value = null;
            this.status = "valid";
            this.mode = "request";
            this.subForm = null;
            this._form = null;
            this.evalChilds = () => { };
            this.getParentValue = () => { };
            this.doValues = (inputs) => {
                let value = "";
                inputs.forEach((e) => {
                    value += ((value !== "") ? "," : "") + e.value;
                });
                return value;
            };
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = this._main = (this.id) ? $(this.id) : false;
            if (!main) {
                this._create(false);
            }
            else {
                if (main.ds("sgInput")) {
                    //return;
                }
            }
            if (info.doValues) {
                this.doValues = $.bind(info.doValues, this.context || this, "inputs");
            }
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
        }
        _create(target) {
            let info = {};
            switch (this.type) {
                case "radio":
                case "checkbox":
                    break;
                default:
                    this.type = "radio";
                    break;
            }
            if (this.id) {
                info.id = this.id;
            }
            if (this.name) {
                info.name = this.name;
            }
            if (this.value) {
                info.value = this.value;
            }
            this._main = $.create("div").addClass("input-multi").addClass("type-input").addClass(this.className);
            if (this.type === "checkbox") {
                this._input = this._main.create({ tagName: "textarea", type: "text", name: this.name });
            }
            this._main.ds(this.dataset);
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "multi");
            this._main.ds("sgType", this.type);
            if (this.parent) {
                this._main.ds("parent", this.parent);
            }
            if (this.childs) {
                this._main.ds("childs", "childs");
            }
            this.createOptions(this.parentValue);
            if (this.subForm) {
                this._form = new FormDetail(this.subForm);
                this._form.setValue(this.value);
            }
            this.setValue(this.value);
        }
        onchange(item) {
            alert(888);
            if (this._form) {
                let value = this._form.setOn(item.get().value, item.get().checked);
                this._input.val(JSON.stringify(value));
            }
            else {
                let input = this._main.queryAll("input.option:checked");
                if (input) {
                    let str = "";
                    input.forEach((i) => {
                        str = ((str != "") ? "," : "") + i.value;
                    });
                    this._input.val(str);
                }
            }
        }
        check(values) {
            let data = [];
            values.forEach((v) => {
                data[v] = v;
            });
            let input = this._main.queryAll("input.option");
            input.forEach((input) => {
                if (data[input.value] !== undefined) {
                    input.checked = true;
                }
                else {
                    input.checked = false;
                }
            });
        }
        setValue(value) {
            this.value = value;
            if (this._form) {
                this.check(this._form.getList());
            }
            if (Array.isArray(value)) {
                value = JSON.stringify(value);
            }
            if (this._input) {
                this._input.val(value);
            }
            return this;
        }
        getValue() {
            //return this._main.val();
            if (this.type === "radio") {
                let input = this._main.query("input.option:checked");
                if (input) {
                    return input.value;
                }
                return undefined;
            }
            else {
                let input = this._main.queryAll("input.option:checked");
                if (input) {
                    let str = "";
                    input.forEach((i) => {
                        str = ((str != "") ? "," : "") + i.value;
                    });
                    return str;
                }
            }
            return "";
        }
        _load(main) {
        }
        get() {
            return this._main.get();
        }
        main() {
            return this._main;
        }
        hasChilds() {
            if (this._main.ds("childs")) {
                return true;
            }
            return false;
        }
        createInputs(data) {
            data.forEach((d, index) => {
                let div = this._main.create("span");
                div.create({ tagName: "input",
                    type: this.type,
                    name: this.name + ((this.type === "checkbox") ? "_" + index : ""),
                    id: this.id + "_" + index,
                    className: "option",
                    value: d[0] })
                    .on("click", (event) => {
                });
                div.create({ tagName: "label", htmlFor: this.id + "_" + index }).text(d[1]);
            });
        }
        _setPropertys() {
            let inputs = this._main.queryAll("input.option");
            inputs.forEach((e, index) => {
                for (var x in this.events) {
                    $(e).on(x, $.bind(this.events[x], this.context || this, "event"));
                }
                if (this.childs) {
                    $(e).on("change", $.bind(this.evalChilds, this.context || this, "event"));
                }
            });
        }
        createOptions(parentValue) {
            let i, vParent = {};
            if (this.parent) {
                let aux = (parentValue + "").split(",");
                for (i = 0; i < aux.length; i++) {
                    vParent[aux[i]] = true;
                }
            }
            let inputs = this._main.queryAll("span");
            inputs.forEach((e) => {
                e.parentNode.removeChild(e);
            });
            this.data.forEach((d, index) => {
                if (vParent[d[2]] || !this.parent || d[2] === "*") {
                    let div = this._main.create("span");
                    div.create({ tagName: "input",
                        type: this.type,
                        name: this.name + ((this.type === "checkbox") ? "_" + index : ""),
                        id: this.id + "_" + index,
                        className: "option",
                        value: d[0] }).on("change", event => {
                        this.onchange($(event.currentTarget));
                    });
                    div.create({ tagName: "label", htmlFor: this.id + "_" + index }).text(d[1]);
                }
            });
            this._setPropertys();
        }
        evalOptions(parentValue) {
        }
        getName() {
            return this._main.get().name;
        }
        getId() {
            return this._main.get().id;
        }
        getText() {
            if (this._main.get().type) {
                alert(8);
            }
        }
        ds(prop, value) {
            return this._main.ds(prop, value);
        }
        focus() {
            this._main.get().focus();
        }
        select() {
            this._main.get().select();
        }
        reset() {
            this.setValue(this.default);
        }
    }
    class CheckingList {
        constructor(info) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "";
            this.caption = "";
            this.value = "";
            this.default = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = false;
            this.placeholder = "";
            this.rules = null;
            this.context = null;
            this.parentContext = null;
            this.childs = false;
            this.parent = "";
            this.parentValue = "";
            this._main = null;
            this._input = null;
            this._value = null;
            this.status = "valid";
            this.mode = "request";
            this.subForm = null;
            this._form = null;
            this.evalChilds = () => { };
            this.getParentValue = () => { };
            this.doValues = (inputs) => {
                let value = "";
                inputs.forEach((e) => {
                    value += ((value !== "") ? "," : "") + e.value;
                });
                return value;
            };
            this.check = (value, inputs) => {
                const values = (value || "").split(",");
                let data = [];
                values.forEach((v) => {
                    data[v] = v;
                });
                let input = this._main.queryAll("input.option");
                input.forEach((input) => {
                    if (data[input.value] !== undefined) {
                        input.checked = true;
                    }
                    else {
                        input.checked = false;
                    }
                });
            };
            this.onchange = (item) => {
                if (this._form) {
                    console.log(999, this._form);
                    let value = this._form.setOn(item.get().value, item.get().checked);
                    this._input.val(JSON.stringify(value));
                }
                else {
                    let input = this._main.queryAll("input.option:checked");
                    if (input) {
                        let str = "";
                        input.forEach((i) => {
                            str += ((str != "") ? "," : "") + i.value;
                        });
                        this._input.val(str);
                    }
                }
            };
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = this._main = (this.id) ? $(this.id) : null;
            if (!main) {
                this._create(false);
            }
            else {
                if (main.ds("sgInput")) {
                    //return;
                }
            }
            if (info.doValues) {
                this.doValues = $.bind(info.doValues, this.context || this, "inputs");
            }
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
        }
        _create(target) {
            let info = {};
            switch (this.type) {
                case "radio":
                case "checkbox":
                    break;
                default:
                    this.type = "radio";
                    break;
            }
            this._main = $.create("div").addClass("input-multi").addClass("type-input").addClass(this.className);
            if (this.type === "checkbox") {
                this._input = this._main.create({ tagName: "input", type: "hidden", name: this.name });
            }
            this._main.ds(this.dataset);
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "multi");
            this._main.ds("sgType", this.type);
            if (this.parent) {
                this._main.ds("parent", this.parent);
            }
            if (this.childs) {
                this._main.ds("childs", "childs");
            }
            this.createOptions(this.parentValue);
            if (this.subForm) {
                this._form = new FormDetail(this.subForm);
                this._form.setValue(this.value);
            }
            this.setValue(this.value);
        }
        getInputsCheck() {
            return this._main.queryAll("input.option");
        }
        check1(value) {
            const values = (value || "").split(",");
            let data = [];
            values.forEach((v) => {
                data[v] = v;
            });
            let input = this._main.queryAll("input.option");
            input.forEach((input) => {
                if (data[input.value] !== undefined) {
                    input.checked = true;
                }
                else {
                    input.checked = false;
                }
            });
        }
        setValue(value) {
            this.value = value;
            if (Array.isArray(value)) {
                value = JSON.stringify(value);
            }
            else {
                this.check(value, this.getInputsCheck());
            }
            if (this._input) {
                this._input.val(value);
            }
            return this;
        }
        getValue() {
            return this._input.val();
            //return this._main.val();
            if (this.type === "radio") {
                let input = this._main.query("input.option:checked");
                if (input) {
                    return input.value;
                }
                return undefined;
            }
            else {
                let input = this._main.queryAll("input.option:checked");
                if (input) {
                    let str = "";
                    input.forEach((i) => {
                        str = ((str != "") ? "," : "") + i.value;
                    });
                    return str;
                }
            }
            return "";
        }
        _load(main) {
        }
        get() {
            return this._main.get();
        }
        main() {
            return this._main;
        }
        hasChilds() {
            if (this._main.ds("childs")) {
                return true;
            }
            return false;
        }
        createInputs(data) {
            data.forEach((d, index) => {
                let div = this._main.create("div");
                div.create({ tagName: "input",
                    type: this.type,
                    name: this.name + ((this.type === "checkbox") ? "_" + index : ""),
                    id: this.id + "_" + index,
                    className: "option",
                    value: d[0] })
                    .on("click", (event) => {
                });
                div.create({ tagName: "label", htmlFor: this.id + "_" + index }).text(d[1]);
            });
        }
        _setPropertys() {
            let inputs = this._main.queryAll("input.option");
            inputs.forEach((e, index) => {
                for (var x in this.events) {
                    $(e).on(x, $.bind(this.events[x], this.context || this, "event"));
                }
                if (this.childs) {
                    $(e).on("change", $.bind(this.evalChilds, this.context || this, "event"));
                }
            });
        }
        createOptions(parentValue) {
            let i, vParent = {};
            if (this.parent) {
                let aux = (parentValue + "").split(",");
                for (i = 0; i < aux.length; i++) {
                    vParent[aux[i]] = true;
                }
            }
            let inputs = this._main.queryAll("div");
            inputs.forEach((e) => {
                e.parentNode.removeChild(e);
            });
            if (Array.isArray(this.data)) {
                this.data.forEach((d, index) => {
                    if (vParent[d[2]] || !this.parent || d[2] === "*") {
                        let div = this._main.create("div");
                        div.create({ tagName: "input",
                            type: this.type,
                            name: this.name + ((this.type === "checkbox") ? "_" + index : ""),
                            id: this.id + "_" + index,
                            className: "option",
                            value: d[0] }).on("change", event => {
                            this.onchange($(event.currentTarget));
                        });
                        div.create({ tagName: "label", htmlFor: this.id + "_" + index }).text(d[1]);
                    }
                });
            }
            this._setPropertys();
        }
        evalOptions(parentValue) {
        }
        getName() {
            return this._main.get().name;
        }
        getId() {
            return this._main.get().id;
        }
        getText() {
            if (this._main.get().type) {
                alert(8);
            }
        }
        ds(prop, value) {
            return this._main.ds(prop, value);
        }
        focus() {
            this._main.get().focus();
        }
        select() {
            this._main.get().select();
        }
        reset() {
            this.setValue(this.default);
        }
    }
    I.register("multi", CheckingList);
    return Multi;
})(_sgQuery);
//# sourceMappingURL=Input.js.map