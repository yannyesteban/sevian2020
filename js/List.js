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
            this.id = "";
            this.target = null;
            this.className = null;
            this.data = [];
            this.value = null;
            this.input = null;
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
            $().on("mousedown", (event) => {
                if (this._main.get().contains(event.target) || this.input.get().contains(event.target)) {
                    return false;
                }
                this.active(false);
            });
            $(document).on("blur", (event) => {
                this.active(false);
            });
            this.setInput(this.input);
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
        }
        _create(main) {
            this._main = main.addClass("list-menu").addClass(this.className);
            Float.Float.init(main.get());
        }
        _load(main) {
        }
        get() {
            return this_main;
        }
        setText(index) {
            let item = this._main.query(`.option[data-index='${index}']`);
            if (item) {
                this.input.val(this.data[$(item).ds("value")].text);
            }
        }
        select(index) {
            if (this.data[index]) {
                this._error = false;
                this.input.val(this.data[index].text);
                this.setValue(this.data[index].value);
                this.active(false);
            }
        }
        setData(data) {
            this.data = data;
        }
        setValue(value) {
            if (value !== this.value) {
                this.value = value;
                this.input.fire("change");
            }
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
            //this._main.toggleClass("active");
            //db ("toggle")
            //return ;
            if (value) {
                this._main.addClass("active");
            }
            else {
                this._main.removeClass("active");
            }
        }
        getActive() {
            return this._active;
        }
        show() {
            Float.Float.showMenu({
                context: this.input.get(),
                e: this._main.get(),
                left: "left",
                top: "down"
            });
        }
        hide() {
            //this._main.addClass("close");
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
            }).on("focus", event => {
                //db ("focus")
                //this.setFilter(event.currentTarget.value, true);
                //this.active(true);
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
            }).on("paste", e => {
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
                //&& event.keyCode !== 37
                //&& event.keyCode !== 39
                && event.keyCode !== 38 && event.keyCode !== 40 && event.keyCode !== 9) {
                this.active(true);
                this.setFilter(event.currentTarget.value);
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
                        this.active(true);
                        this.setFilter(event.currentTarget.value, true);
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
                    //this.active(true);
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
                info.value = this.value;
            }
            info.tagName = "input";
            info.type = "text";
            this.value = "";
            this._main = $.create("div").addClass("type-input").addClass("sg-input-list").addClass(this.className);
            this._input = this._main.create(info);
            let data = [];
            if (this.parent) {
                this.data.forEach((d) => {
                    if (!data[d[2]]) {
                        data[d[2]] = {};
                    }
                    data[d[0]] = {
                        value: d[0],
                        text: d[1],
                        item: d[1]
                    };
                });
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
            }
            this.menu = new ListMenu({
                input: this._input.prop("autocomplete", "off"),
                data: data[0],
                target: this._main
            });
            for (var x in this.events) {
                //let action = $.bind(this.events[x], this._main);
                this._input.on(x, $.bind(this.events[x], this, "event"));
            }
            if (this.childs) {
                this._main.on("change", $.bind(this.evalChilds, this, "event"));
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
            if (this.childs) {
                this._main.ds("childs", "childs");
            }
            this.setValue(this.value);
        }
        setValue(value) {
            this._input.get().value = value;
        }
        getValue() {
            return this._input.get().value;
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
            }
            let e = this._popup = this._main.create("div").addClass("list-popup");
            for (i in this.data) {
                if (vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*") {
                    e.create("div").addClass("option").ds("value", this.data[i][0]).text(this.data[i][1]);
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
        _keyUp(event) {
            if (event.keyCode !== 38 && event.keyCode !== 40 && event.keyCode !== 9) {
                this._evalText(event.currentTarget.value);
            }
        }
        _keyDown(event) {
            switch (event.keyCode) {
                case 13: //enter
                    break;
                case 9: //tab
                    //this.hide();
                    break;
                case 27: //escape
                    //e.returnValue = false;
                    //e.cancelBubble = true;
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
        _setFilter(filter) {
            this._index = -1;
            let cont = $(this._main.query(".list-popup"));
            cont.text("");
            let item = null;
            for (var x in this.data) {
                let text = this.data[x][1];
                if (filter === "" || acute(text).indexOf(acute(filter)) >= 0) {
                    item = cont.create("div").addClass("option").text(this.data[x][1]);
                }
            }
        }
        move(step) {
            this._index += step;
            let items = this._main.queryAll(".list-popup > .option");
            if (this._index < 0) {
                this._index = 0;
            }
            if (this._index >= items.length - 1) {
                this._index = items.length - 1;
            }
            let item = $(this._main.query(".list-popup > .option.active"));
            if (item) {
                item.removeClass("active");
            }
            $(items[this._index]).addClass("active");
            var offsetTop = items[this._index].offsetTop;
            var height = items[this._index].clientHeight;
            db(offsetTop + "..." + height);
            //option.style.color = "white";
            //option.style.backgroundColor = "rgba(167,8,8,1.00)";
            let popup = this._popup.get();
            //popup.style.position = "relative";
            if (offsetTop <= popup.scrollTop) {
                popup.scrollTop = offsetTop;
            }
            else if (offsetTop + height >= popup.clientHeight + popup.scrollTop) {
                popup.scrollTop = offsetTop + height - popup.clientHeight;
            }
        }
    }
    I.register("list", List);
    return List;
})(_sgQuery);
