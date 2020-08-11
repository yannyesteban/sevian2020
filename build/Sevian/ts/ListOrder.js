var SortList = (($) => {
    class SortList {
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
            let value = this._form.setOn(item.get().value, item.get().checked);
            this._input.val(JSON.stringify(value));
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
            this._main.ds(prop, value);
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
    I.register("sort", SortList);
    return SortList;
})(_sgQuery);
//# sourceMappingURL=ListOrder.js.map