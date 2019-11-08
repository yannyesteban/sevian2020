var SimpleList = (($) => {
    class SimpleList {
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
                this._main.ds("childs", "childs");
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