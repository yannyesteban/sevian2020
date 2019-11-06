var List = (($) => {
    let acute = function (str) {
        if (str === undefined) {
            return false;
        }
        str = str.toLowerCase();
        str = str.replace(/á/gi, "a");
        str = str.replace(/é/gi, "e");
        str = str.replace(/í/gi, "i");
        str = str.replace(/ó/gi, "o");
        str = str.replace(/ú/gi, "u");
        str = str.replace(/ñ/gi, "n");
        return str;
    };
    class ListMenu {
        constructor(info) {
            this.name = "";
            this.id = "";
            this.target = null;
            this.className = null;
            this.data = [];
            this.value = null;
            this.input = null;
            this.onactive = value => { return value; };
            this._main = null;
            this._active = null;
            this._index = -1;
            this._error = false;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sgListMenu")) {
                    return;
                }
                if (main.hasClass("sg-list-menu")) {
                    this._load(main);
                }
                else {
                    this._create(main);
                }
            }
            else {
                main = $.create("div").attr("id", this.id);
                this._create(main);
            }
            if (info.onactive) {
                this.onactive = $.bind(info.onactive, this, "value");
            }
            main.ds("sgListMenu", "list-menu");
            main.on("mousemove", event => {
                if (event.target.classList.contains("option")) {
                    this.setIndex(event.target.dataset.index * 1);
                }
            });
            main.on("click", event => {
                if (event.target.classList.contains("option")) {
                    this._index = event.target.dataset.value;
                    this.select(event.target.dataset.value);
                }
            }).on("contextmenu", event => {
                event.preventDefault();
            });
            $().on("mousedown", event => {
                if (this._main.get().contains(event.target) || this.input.get().contains(event.target)) {
                    return false;
                }
                this.active(false);
            });
            $(document).on("blur", event => {
                this.active(false);
            });
            this.setInput(this.input);
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
            if (this.value) {
                this.setValue(this.value);
            }
        }
        _create(main) {
            this._main = main.addClass("list-menu").addClass(this.className);
        }
        _load(main) {
        }
        get() {
            return this._main;
        }
        select(index) {
            if (this.data[index]) {
                this._error = false;
                this.input.val(this.data[index].text);
                //this.setValue(this.data[index].value);
                if (this.data[index].text !== this.value) {
                    this.value = this.data[index].value;
                    this.input.fire("change");
                }
                this.active(false);
            }
        }
        setData(data) {
            this.data = data;
        }
        setText(value) {
            for (let e of this.data) {
                if (acute(e.text) == acute(value)) {
                    this.input.val(e.text);
                    this.value = e.value;
                }
            }
        }
        setValue(value) {
            let error = true;
            for (let e of this.data) {
                if (e.value == value) {
                    this.input.val(e.text);
                    this.value = e.value;
                    error = false;
                }
            }
            if (error) {
                this.input.val("");
                this.value = "";
            }
            //this.input.fire("change");
        }
        getValue() {
            return this.value;
        }
        setFilter(filter, showAll = false) {
            this._main.text("");
            this._error = true;
            this._index = -1;
            let index = 0, value = null;
            this.data.forEach((d, i) => {
                if (showAll || filter === "" || acute(d.text).indexOf(acute(filter)) >= 0) {
                    this._main.create("div")
                        .ds("value", i)
                        .ds("index", index).addClass("option").append(d.item);
                    if (acute(d.text) === acute(filter)) {
                        value = index;
                    }
                    index++;
                }
            });
            if (value !== null) {
                this.setIndex(value);
            }
            else {
                this.setIndex(0);
            }
            if (filter === "") {
                this._main.get().scrollTop = "0px";
            }
        }
        active(value) {
            if (this._active === value) {
                return;
            }
            this._active = value;
            if (value) {
                this._main.addClass("active");
            }
            else {
                this._main.removeClass("active");
            }
            this.onactive(value);
        }
        getActive() {
            return this._active;
        }
        move(step) {
            this.setIndex(this._index + step);
        }
        setIndex(index) {
            if (index === this._index) {
                return;
            }
            let items = this._main.queryAll(".option");
            if (index < 0) {
                index = 0;
            }
            else if (index >= items.length - 1) {
                index = items.length - 1;
            }
            this._index = index;
            let item = $(this._main.query(".option.active"));
            if (item) {
                item.removeClass("active");
            }
            if (!items[index]) {
                return;
            }
            $(items[index]).addClass("active");
            let offsetTop = items[index].offsetTop;
            let height = items[index].offsetHeight;
            let popup = this._main.get();
            if (offsetTop <= popup.scrollTop) {
                popup.scrollTop = offsetTop;
            }
            else if (offsetTop + height >= popup.offsetHeight + popup.scrollTop) {
                popup.scrollTop = offsetTop + height - popup.offsetHeight;
            }
        }
        setInput(input) {
            input.on("keyup", event => {
                this._keyUp(event);
            }).on("keydown", event => {
                this._keyDown(event);
            }).on("mousedown", event => {
                this.setFilter(event.currentTarget.value, true);
                this.active(true);
            }).on("change", event => {
                if (this._error) {
                    this._index = -1;
                    this.value = null;
                    event.currentTarget.value = "";
                }
            }).on("contextmenu", event => {
                this.active(false);
            }).on("paste", event => {
                let paste = (event.clipboardData || window.clipboardData).getData('text');
                this.setFilter(paste);
                this.active(true);
            }).on("drop", event => {
                event.preventDefault();
                event.currentTarget.value = event.dataTransfer.getData('text/plain');
                this.setFilter(event.currentTarget.value);
                this.active(true);
            });
        }
        _keyUp(event) {
            if (event.keyCode !== 13
                && event.keyCode !== 16
                && event.keyCode !== 17
                && event.keyCode !== 38 && event.keyCode !== 40 && event.keyCode !== 9) {
                this.setFilter(event.currentTarget.value);
                this.active(true);
            }
        }
        _keyDown(event) {
            switch (event.keyCode) {
                case 9: //tab
                    this.active(false);
                    break;
                case 13: //enter
                    if (this._active) {
                        let item = this._main.query(`.option[data-index='${this._index}']`);
                        if (item) {
                            this.select($(item).ds("value"));
                        }
                    }
                    else {
                        this.setFilter(event.currentTarget.value, true);
                        this.active(true);
                    }
                    break;
                case 27: //escape
                    break;
                case 38: //up arrow 
                    this.move(-1);
                    break;
                case 40: //down arrow
                    this.move(1);
                    break;
                default:
                    break;
            } // end switch
        }
    }
    class List {
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
            this._input = null;
            this._index = -1;
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
            if (this.id) {
                info.id = this.id;
            }
            if (this.name) {
                info.name = this.name;
            }
            if (this.value) {
                // info.value = this.value;
            }
            //info.value=31321;
            info.tagName = "input";
            info.type = "hidden";
            this._main = $.create("div").addClass("type-input").addClass("sg-input-list").addClass(this.className);
            Float.Float.init(this._main.get());
            this.input = this._main.create(info);
            this._input = this._main.create({
                tagName: "input",
                type: "text",
                autocomplete: "off",
                placeholder: this.placeholder,
            });
            let data = [];
            let _data = null;
            if (this.parent) {
                this.data.forEach((d) => {
                    if (!data[d[2]]) {
                        data[d[2]] = [];
                    }
                    data[d[2]].push({
                        value: d[0],
                        text: d[1],
                        item: d[1]
                    });
                });
                _data = data[this.parentValue] || [];
            }
            else {
                data[0] = [];
                this.data.forEach((d) => {
                    data[0].push({
                        value: d[0],
                        text: d[1],
                        item: d[1]
                    });
                });
                _data = data[0];
            }
            this._data = data;
            this.menu = new ListMenu({
                name: this.name,
                input: this._input,
                data: _data,
                target: this._main,
                value: this.value,
                onactive: (value) => {
                    if (value) {
                        this.menu.get().get().style.minWidth = this._input.get().offsetWidth + "px";
                        Float.Float.showMenu({
                            e: this.menu.get().get(),
                            context: this._input.get(),
                            left: "left",
                            top: "down"
                        });
                    }
                },
            });
            this._input.on("change", event => {
                this.input.val(this.menu.getValue());
            });
            for (var x in this.events) {
                //let action = $.bind(this.events[x], this._main);
                this._input.on(x, $.bind(this.events[x], this, "event"));
            }
            if (this.childs) {
                this._main.ds("childs", "childs");
                this._input.on("change", $.bind(this.evalChilds, this, "event"));
            }
            this._input.prop(this.propertys);
            this._input.style(this.style);
            if (this.data) {
                //this.createOptions(this.parentValue);
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
            this.menu.setValue(value);
            this.input.get().value = this.menu.getValue();
        }
        getValue() {
            return this.menu.getValue(); //this._input.get().value;
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
        createOptions(parentValue, name) {
            this.menu.setData(this._data[parentValue] || []);
            this.menu.setValue("");
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
            this.input.get().focus();
        }
        select() {
            this.input.get().select();
        }
    }
    I.register("list", List);
    return List;
})(_sgQuery);
