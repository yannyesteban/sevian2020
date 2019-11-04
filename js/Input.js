class I {
    static create(name, info) {
        return new I._ele_[name](info);
    }
    static register(name, classInput) {
        I._ele_[name] = classInput;
    }
}
I._ele_ = [];
var $I = {};
var Input = (($) => {
    class Input {
        constructor(info) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "";
            this.value = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = false;
            this.placeholder = "";
            this.rules = null;
            this.childs = false;
            this.parent = "";
            this.parentValue = null;
            this._main = null;
            this.status = "valid";
            this.mode = "request";
            this.evalChilds = () => { };
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
            switch (this.type) {
                case "text":
                case "password":
                case "hidden":
                case "button":
                case "submit":
                case "color":
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
                default:
                    info.tagName = "input";
                    info.type = "text";
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
            this._main = $.create(info).addClass("type-input").addClass(this.className);
            for (var x in this.events) {
                //let action = $.bind(this.events[x], this._main);
                this._main.on(x, $.bind(this.events[x], this, "event"));
            }
            if (this.childs) {
                this._main.on("change", $.bind(this.evalChilds, this, "event"));
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
            if (this.childs) {
                this._main.ds("childs", "childs");
            }
            this.setValue(this.value);
        }
        setValue(value) {
            this.get().value = value;
        }
        getValue() {
            return this.get().value;
        }
        _load(main) {
        }
        get() {
            return this._main.get();
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
                    this._main.get().options.add(option);
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
            this._main.ds(prop, value);
        }
        focus() {
            this._main.get().focus();
        }
        select() {
            this._main.get().select();
        }
    }
    I.register("input", Input);
    return Input;
})(_sgQuery);
var InputDate = (($) => {
    class InputCalendar {
        constructor(opt) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "calendar";
            this.value = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = false;
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
            for (var x in this.events) {
                auxTxt.on(x, $.bind(this.events[x], this, "event"));
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
            this._main.ds(prop, value);
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
    }
    I.register("date", InputCalendar);
    return InputCalendar;
})(_sgQuery);
var Multi = (($) => {
    class Multi {
        constructor(info) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "";
            this.value = "";
            this.className = "";
            this.data = false;
            this.propertys = {};
            this.dataset = null;
            this.style = {};
            this.events = false;
            this.placeholder = "";
            this.rules = null;
            this.childs = false;
            this.parent = "";
            this.parentValue = "";
            this._main = null;
            this._input = null;
            this.status = "valid";
            this.mode = "request";
            this.evalChilds = () => { };
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
                this.doValues = $.bind(info.doValues, this, "inputs");
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
                case "check":
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
            let input = this._main.query(`input[value='${value}']`);
            if (input) {
                input.checked = true;
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
        hasChilds() {
            if (this._main.ds("childs")) {
                return true;
            }
            return false;
        }
        createInputs(data) {
            data.forEach((d, index) => {
                let div = this._main.create("span");
                this._input = div.create({ tagName: "input",
                    type: this.type,
                    name: this.name + ((this.type === "check") ? "_" + index : ""),
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
                    $(e).on(x, $.bind(this.events[x], this, "event"));
                }
                if (this.childs) {
                    $(e).on("change", $.bind(this.evalChilds, this, "event"));
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
                    this._input = div.create({ tagName: "input",
                        type: this.type,
                        name: this.name + ((this.type === "check") ? "_" + index : ""),
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
            this._main.ds(prop, value);
        }
        focus() {
            this._main.get().focus();
        }
        select() {
            this._main.get().select();
        }
    }
    I.register("multi", Multi);
    return Multi;
})(_sgQuery);
