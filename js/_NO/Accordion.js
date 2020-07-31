const Accordion = (function ($) {
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
                if (main.ds("sgAccordion")) {
                    return;
                }
                if (main.hasClass("sg-accordion")) {
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
            main.ds("sgAccordion", "accordion");
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
            let menus = $().queryAll(".sg-accordion.sg-detect");
            for (let x of menus) {
                if ($(x).ds("sgAccordion")) {
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
            this._main = main.addClass(this.className).addClass("sg-accordion");
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
            this._main = main.addClass(this.className).addClass("sg-accordion");
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
            this._menu.create("a").addClass("tab-menu")
                .on("click", this._click(index))
                //.on("focus", this._click(index))
                .text(opt.caption || "")
                .attr("href", "javascript:void(0);")
                .ds("tabIndex", index);
            let body = this._menu.create("div").addClass("tab-body")
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
            //let pItem = this._page.get().children;
            let page = $(this._main.query(".tab-body[data-tab-index='" + index + "']"));
            if (mItem[index]) {
                if (value) {
                    $(mItem[index]).addClass("tab-active");
                    page.addClass("tab-active");
                }
                else {
                    $(mItem[index]).removeClass("tab-active");
                    page.removeClass("tab-active");
                }
            }
        }
        show(index) {
            db(index);
            if (index === this.value) {
                this.value = -1;
                this.setVisible(index, false);
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
            let page = this._main.query(".menu > [data-tab-index='" + index + "']");
            if (page) {
                return $(page);
            }
            return false;
        }
    }
    //visible:boolean = false;
    Tab._objs = [];
    $(window).on("load", function () {
        Tab.init();
        //ini();
    });
    return Tab;
})(_sgQuery);
