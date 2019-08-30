var _tab;
(function ($) {
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
                let target = (this.target) ? $(this.target) : false;
                if (target) {
                    main = target.create("div").attr("id", this.id);
                    this._create(main);
                }
                else {
                    return;
                }
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
        static get(name) {
            return this._objs[name];
        }
        _load(main) {
            main.addClass(this.className).addClass("sg-tab");
            let tab_parts = main.childs();
            this._menu = $(tab_parts[0]).addClass("tab-menu");
            this._page = $(tab_parts[1]).addClass("tab-body");
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
            main.addClass("sg-tab");
            this._menu = main.create({
                "tagName": "div",
                "className": "tab-menu"
            });
            this._page = main.create({
                "tagName": "div",
                "className": "tab-body"
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
                .text(opt.title || "")
                .attr("href", "javascript:void(0);")
                .ds("tabIndex", index);
            let body = this._page.create("div")
                .ds("tabIndex", index);
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
            }
            this.setVisible(index, true);
            this.value = index;
            this._onOpen(index);
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
    }
    Tab._objs = [];
    _tab = Tab;
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
            title: "tab001",
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
})(_sgQuery);
