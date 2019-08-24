//import { Query as $} from './Query.js';
(function ($) {
    class Tab {
        constructor(opt) {
            this.target = false;
            this.id = 0;
            this.value = 0;
            this.mode = "";
            this.className = "";
            this.pages = [];
            this.onOpen = (index) => { return true; };
            this.onClose = (index) => { return true; };
            this._menu = false;
            this._page = false;
            this._length = 0;
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let _target = $(this.target);
            if (_target) {
                this.create();
            }
            else {
                this.load();
            }
            //db(this.getLenght()+"..."+this.value, "green")
            if ((this.value + 1) > this.getLenght()) {
                this.setValue(this.getLenght() - 1);
            }
            else {
                this.setValue(this.value);
            }
        }
        load() {
            let main = $(this.id);
            main.addClass("sg-tab");
            let tab_parts = main.childs();
            let menu = tab_parts[0];
            let page = tab_parts[1];
            this._menu = $(menu);
            this._page = $(page);
            $(menu).addClass("sg-tab-menu");
            $(page).addClass("sg-tab-body");
            let mItem = menu.children;
            let pItem = page.children;
            for (let i = 0; i < mItem.length; i++) {
                $(mItem[i]).on("click", this._click(i)).on("focus", this._click(i)).removeClass("sg-tab-active");
            }
            for (let i = 0; i < pItem.length; i++) {
                $(pItem[i]).ds("sgTabIndex", i).removeClass("sg-tab-active");
            }
        }
        create() {
            let main = $(this.target).create({
                tagName: "div",
                id: this.id,
                className: this.className
            })
                .ds("sgType", "sg-tab")
                .addClass("sg-tab");
            this._menu = main.create({
                "tagName": "div",
                "className": "sg-tab-menu"
            });
            this._page = main.create({
                "tagName": "div",
                "className": "sg-tab-body"
            });
            if (this.pages) {
                for (var x in this.pages) {
                    if (this.pages.hasOwnProperty(x)) {
                        this.add(this.pages[x]);
                    }
                }
            }
        }
        add(opt, pos = false) {
            let index = this._menu.get().children.length;
            this._menu.create("a")
                .on("click", this._click(index))
                .on("focus", this._click(index))
                .addClass("sg-tab-imenu")
                .text(opt.title || "")
                .attr("href", "javascript:void(0);")
                .ds("sgTabIndex", index);
            let body = this._page.create("div")
                .ds("sgTabIndex", index);
            if (opt.child) {
                body.append(opt.child);
            }
            else if (opt.html) {
                body.text(opt.html);
            }
            if (opt.active === true) {
                this.show(index);
            }
            return body;
        }
        getLenght() {
            return this._menu.get().children.length;
        }
        _click(index) {
            var ME = this;
            return function () {
                ME.show(index);
            };
        }
        setVisible(index, value) {
            let main = $(this.id);
            let tab_parts = main.childs();
            let menu = tab_parts[0];
            let page = tab_parts[1];
            let mItem = menu.children;
            let pItem = page.children;
            if (mItem[index] && pItem[index]) {
                if (value) {
                    $(mItem[index]).addClass("sg-tab-active");
                    $(pItem[index]).addClass("sg-tab-active");
                }
                else {
                    $(mItem[index]).removeClass("sg-tab-active");
                    $(pItem[index]).removeClass("sg-tab-active");
                }
            }
        }
        show(index) {
            if (index === this.value) {
                return false;
            }
            if (this.value !== false) {
                var onClose = this.onClose(this.value);
                if (onClose === undefined || onClose === true) {
                    this.setVisible(this.value, false);
                }
                else {
                    return false;
                }
            }
            this.setVisible(index, true);
            this.value = index;
            this.onOpen(index);
            return true;
        }
        setValue(index) {
            this.value = false;
            this.show(index);
        }
        setMode(mode) {
            $(this.id).removeClass(this.mode)
                .addClass(mode)
                .ds("sgMenuMode", mode);
            this.mode = mode;
        }
        getMode() {
            return this.mode;
        }
    }
    let tab = new Tab({
        "id": "tab01",
        value: 11,
        onOpen: (index) => {
            db(index);
        },
        onClose: (index) => {
            db(index, "red");
        }
    });
    tab.add({
        title: "tab001",
        html: "hola mundo txt",
    });
    let tab2 = new Tab({
        target: "tabii",
        id: "tab_x01",
        value: 1,
        onOpen: (index) => {
            db(index, "yellow", "red");
        },
        onClose: (index) => {
            db(index, "aqua", "blue");
        },
        pages: [
            {
                title: "tab001", html: "uno"
            },
            {
                title: "tab002", html: "que "
            },
            {
                title: "tab003", html: "Opps",
            },
            {
                title: "tab004", html: "Cuatro"
            },
        ],
    });
    tab2.add({
        title: "tab0 x",
        html: "hola ee mundo txt 100...",
        active1: true,
    });
})(_sgQuery);
const Input = (($) => {
    class Input {
        constructor(opt) {
            this.target = false;
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
        }
    }
    return Input;
})(_sgQuery);
const Page = (($) => {
    class Page {
        constructor(opt) {
            this.target = false;
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
        }
    }
    return Page;
})(_sgQuery);
const Form = (($) => {
    class Form {
        constructor(opt) {
            this.target = false;
            this.name = "";
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let _target = $(this.target);
            if (_target && _target.get().tagName != "FORM") {
                let form = _target.create({
                    tagName: "form",
                    name: this.name
                }).ds("sgType", "sg-form");
            }
        }
        create() {
        }
    }
    return Form;
})(_sgQuery);
let F = new Form({
    target: "_f100",
    name: "form_100"
});
