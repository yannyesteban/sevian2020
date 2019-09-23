var $I = {};
var Input = (($) => {
    class Input {
        constructor(opt) {
            this.target = null;
            this.id = "";
            this.name = "";
            this.type = "";
            this.value = "";
            this.className = "";
            this.data = false;
            this.propertys = false;
            this.events = false;
            this.placeholder = "";
            this.childs = false;
            this.parent = "";
            this._main = null;
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (!main) {
                this._create(false);
            }
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
            return;
            if (main) {
                if (main.ds("sgPage")) {
                    return;
                }
                if (main.hasClass("sg-page")) {
                    this._load(main);
                }
                else {
                    this._create(main);
                }
            }
            else {
                let target = (this.target) ? $(this.target) : false;
                if (target) {
                    main = target.create("div");
                }
                else {
                    main = $.create("div");
                }
                this._create(main);
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
                case "multiple":
                    info.tagName = "select";
                    this.propertys.multiple = "multiple";
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
            this._main = $.create(info);
            if (this.type === "select" || this.type === "multiple") {
                this.createOptions(this.value, false);
            }
            this.setValue(this.value);
        }
        setValue(value) {
            this.get().value = value;
        }
        _load(main) {
        }
        get() {
            return this._main.get();
        }
        createOptions(value, parentValue) {
            var i, option, vParent = [], _ele = this.get();
            _ele.length = 0;
            if (this.parent) {
                var aux = (parentValue + "").split(",");
                for (i = 0; i < aux.length; i++) {
                    vParent[aux[i]] = true;
                }
            }
            if (this.placeholder) {
                option = document.createElement("OPTION");
                option.value = "";
                option.text = this.placeholder;
                _ele.options.add(option);
            }
            for (i in this.data) {
                if (vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*") {
                    option = document.createElement("OPTION");
                    option.value = this.data[i][0];
                    option.text = this.data[i][1];
                    _ele.options.add(option);
                }
            }
        }
    }
    $I.std = Input;
    return Input;
})(_sgQuery);
