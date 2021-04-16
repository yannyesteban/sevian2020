import { _sgQuery } from '../../Sevian/ts/Query.js';
export const Tab = (function ($) {
    class Tab {
        constructor(opt) {
            this.target = false;
            this.id = 0;
            this.value = 0;
            this.mode = "";
            this.className = "";
            this.pages = [];
            this.onOpen = false;
            this.onClose = false;
            this._onOpen = (index) => { return true; };
            this._onClose = (index) => { return true; };
            this._main = false;
            this._menu = false;
            this._page = false;
            this._length = 0;
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sgTab")) {
                    return;
                }
                if (main.hasClass("sg-tab")) {
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
            if (this.onOpen) {
                this._onOpen = $.bind(this.onOpen, this, 'index');
            }
            if (this.onClose) {
                this._onClose = $.bind(this.onClose, this, 'index');
            }
            main.ds("sgTab", "tab");
            if ((this.value + 1) > this.getLenght()) {
                this.setValue(this.getLenght() - 1);
            }
            else {
                this.setValue(this.value);
            }
            let target = (this.target) ? $(this.target) : false;
            if (target) {
                target.append(this._main);
            }
        }
        static init() {
            let menus = $().queryAll(".sg-tab.sg-detect");
            for (let x of menus) {
                if ($(x).ds("sgTab")) {
                    continue;
                }
                if (x.id) {
                    this.create(x.id, { id: x });
                }
                else {
                    new Tab({ id: x });
                }
            }
        }
        static create(name, info) {
            this._objs[name] = new Tab(info);
            return this._objs[name];
        }
        static getObj(name) {
            return this._objs[name];
        }
        get() {
            return this._main;
        }
        _load(main) {
            this._main = main.addClass(this.className).addClass("sg-tab");
            let tab_parts = main.childs();
            this._menu = $(tab_parts[0]).addClass("menu");
            this._page = $(tab_parts[1]).addClass("body");
            let mItem = this._menu.get().children;
            let pItem = this._page.get().children;
            for (let i = 0; i < mItem.length; i++) {
                $(mItem[i]).on("click", this._click(i))
                    .on("focus", this._click(i)).ds("tabIndex", i)
                    .removeClass("tab-active");
            }
            for (let i = 0; i < pItem.length; i++) {
                $(pItem[i]).ds("tabIndex", i).removeClass("tab-active");
            }
            if (main.ds("value") >= 0) {
                this.value = parseInt(main.ds("value"));
            }
        }
        _create(main) {
            this._main = main.addClass(this.className).addClass("sg-tab");
            this._menu = main.create({
                "tagName": "div",
                "className": "menu"
            });
            this._page = main.create({
                "tagName": "div",
                "className": "body"
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
            let tab = this._menu.create("a").addClass("tab-menu")
                .on("click", this._click(index))
                .on("focus", this._click(index))
                .text(opt.caption || "")
                .attr("href", "javascript:void(0);")
                .ds("tabIndex", index);
            let body = this._page.create(opt.tagName || "div").addClass("tab-body")
                .ds("tabIndex", index);
            if (opt.child) {
                body.append(opt.child);
            }
            else if (opt.html) {
                body.text(opt.html);
            }
            if (opt.className) {
                tab.addClass(opt.className);
                body.addClass(opt.className);
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
            return () => {
                this.show(index);
            };
        }
        setVisible(index, value) {
            let mItem = this._menu.get().children;
            let pItem = this._page.get().children;
            if (mItem[index] && pItem[index]) {
                if (value) {
                    $(mItem[index]).addClass("tab-active");
                    $(pItem[index]).addClass("tab-active");
                }
                else {
                    $(mItem[index]).removeClass("tab-active");
                    $(pItem[index]).removeClass("tab-active");
                }
            }
        }
        show(index) {
            if (index === this.value) {
                return false;
            }
            if (this.value !== false) {
                var onClose = this._onClose(this.value);
                if (onClose === undefined || onClose === true) {
                    this.setVisible(this.value, false);
                }
                else {
                    return false;
                }
                this._onOpen(index);
            }
            this.setVisible(index, true);
            this.value = index;
            return true;
        }
        setValue(index) {
            this.value = false;
            this.show(index);
        }
        getValue() {
            return this.value;
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
        getPage(index) {
            const page = this._main.query(".body > [data-tab-index='" + index + "']");
            if (page) {
                return $(page);
            }
            return false;
        }
        getCaption(index) {
            const caption = this._main.query(`.menu > [data-tab-index='${index}']`);
            if (caption) {
                return $(caption);
            }
            return false;
        }
    }
    Tab._objs = [];
    $(window).on("load", function () {
        Tab.init();
        //ini();
    });
    function ini() {
        let tab = new Tab({
            id: "tab01",
            className: "xclass",
            value: 11,
            onOpen: function (index) {
                db(index + " => this " + this.id, "green");
            },
            onClose: "db('my index '+index);db('chaoooo'+this.value,'aqua','green')",
        });
        tab.add({
            caption: "tab001",
            html: "hola mundo txt",
        });
        let tab2 = new Tab({
            target: "tabii",
            //id:"tab_x01",
            className: "yclass",
            value: 1,
            onOpen: (index) => {
                db(index, "yellow", "red");
            },
            onClose: (index) => {
                db(index, "aqua", "blue");
            },
            pages: [
                {
                    caption: "tab001", html: "uno"
                },
                {
                    caption: "tab002", html: "que "
                },
                {
                    caption: "tab003", html: "Opps",
                },
                {
                    caption: "tab004", html: "Cuatro"
                },
            ],
        });
        tab2.add({
            caption: "tab0 x",
            html: "hola ee mundo txt 100...",
            active: true,
        });
        let tabii = new Tab({
            id: "tab02",
            className: "xclass",
            value: 11,
            onOpen: (index) => {
                db(index);
            },
            onClose: (index) => {
                db(index, "red");
            }
        });
    }
    return Tab;
})(_sgQuery);
//# sourceMappingURL=Tab.js.map