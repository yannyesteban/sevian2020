var Menu = (function ($, Float) {
    class Menu {
        constructor(opt) {
            /*
            type in ("accordion", "popup")
            */
            this.type = "accordion";
            /*
            subType to popup {"default", "system"};
            subType to accordion {"default", "one", "any"};
            */
            this.subType = "default";
            this.tagLink = "a";
            this.id = "";
            this.target = "";
            this.caption = "";
            this.className = "";
            this.items = [];
            this.context = null;
            this._menu = null;
            this._main = null;
            this.action = null;
            this.check = null;
            this.useCheck = true;
            this.useIcon = true;
            this.parentContext = this;
            this._isCheck = false;
            this._isItem = false;
            this._action = function (index) { };
            this._check = function (index) { };
            let x;
            for (x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sgMenu")) {
                    return;
                }
                if (main.hasClass("sg-menu")) {
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
                }
                else {
                    main = $.create("div").attr("id", this.id);
                }
                this._create(main);
            }
            if (this.action) {
                this._action = $.bind(this.action, this.parentContext, "item");
            }
            if (this.check) {
                this._check = $.bind(this.check, this.parentContext, "item");
            }
            main.ds("sgMenu", "menu");
            if (this.context) {
                let context = $(this.context).on("click", event => {
                    main.style({
                        position: "absolute",
                        visibility: "visible",
                    });
                    Float.showMenu({
                        ref: context.get(),
                        e: main.get(),
                        left: "front",
                        top: "top"
                    });
                });
                Float.init(main.get());
                main.style({
                    position: "absolute",
                    visibility: "hidden",
                });
                $().on("mousedown", event => {
                    if (main.ds("active") == "0") {
                        main.style({
                            position: "absolute",
                            visibility: "hidden",
                        });
                    }
                });
                $().on("click", event => {
                    if (main.ds("active") == "1" && !this._isCheck && this._isItem) {
                        main.style({
                            position: "absolute",
                            visibility: "hidden",
                        });
                    }
                });
            }
            main.ds("active", "0")
                .on("mouseenter", event => {
                main.ds("active", "1");
            })
                .on("mouseleave", event => {
                main.ds("active", "0");
            });
            $().on("mousedown", event => {
                if (main.ds("active") == "0") {
                    this.closeAll();
                }
            });
            $().on("click", event => {
                if (main.ds("active") == "1" && !this._isCheck && this._isItem) {
                    this.closeAll();
                }
            });
            let items = main.queryAll(".submenu");
            if (this.type === "popup") {
                for (x of items) {
                    $(x).addClass("popup");
                }
            }
            items = main.queryAll(".option:only-child"); //m-item
            for (let x of items) {
                let item = $(x).on("mouseenter", () => {
                    this._isItem = true;
                })
                    .on("mouseleave", () => {
                    this._isItem = false;
                });
                if (this.action) {
                    item.on("click", (event) => { this._action($(x.parentNode)); });
                }
            }
            items = main.queryAll("input[type='checkbox']");
            for (x of items) {
                let chk = $(x).on("mouseenter", () => {
                    this._isCheck = true;
                })
                    .on("mouseleave", () => {
                    this._isCheck = false;
                })
                    .on("click", () => {
                    if (this._main.ds("active") == "1") {
                        event.stopPropagation();
                    }
                });
                if (this.check) {
                    chk.on("click", (event) => {
                        this._check($(chk.get().parentNode.parentNode));
                    });
                }
            }
        }
        static init() {
            let menus = $().queryAll(".sg-menu.sg-detect");
            for (let x of menus) {
                if ($(x).ds("sgMenu")) {
                    continue;
                }
                if (x.id) {
                    this.create(x.id, { id: x });
                }
                else {
                    new Menu({ id: x });
                }
            }
        }
        static create(name, info) {
            this._objs[name] = new Menu(info);
            return this._objs[name];
        }
        static getObj(name) {
            return this._objs[name];
        }
        get() {
            return this._main;
        }
        setType(type, subType = "default") {
            this.type = type;
            this.subType = subType;
            let types = ["accordion", "popup", "default", "one", "any", "dropdown"];
            types.forEach((e) => {
                this._main.removeClass(`menu-${e}`);
            });
            this._main.addClass(`menu-${type}`).addClass(`menu-${subType}`);
            if (this.type === "accordion") {
                let items = this._main.queryAll(".popup");
                for (var x of items) {
                    $(x).removeClass("popup");
                }
            }
            if (this.type === "popup") {
                let items = this._main.queryAll(".submenu");
                for (x of items) {
                    $(x).addClass("popup");
                }
            }
        }
        getType() {
            return this.type;
        }
        getSubType() {
            return this.subType;
        }
        _create(main) {
            this._main = main.addClass("sg-menu").addClass(this.className)
                .addClass(this.useIcon ? "w-icon" : "n-icon")
                .addClass(`menu-${this.getType()}`)
                .addClass(`menu-${this.getSubType()}`);
            if (this.caption) {
                main.create({
                    tagName: "div",
                    innerHTML: this.caption,
                    className: "caption",
                });
            }
            this.createMenu(main, this.items);
        }
        loadMenu(menu, submenu = false) {
            if (submenu) {
                menu.addClass("submenu");
            }
            let _item = menu.get().children;
            for (let e of _item) {
                this.loadItem($(e));
            }
        }
        loadItem(item) {
            let _item_ch = item.get().children;
            let link = $(_item_ch[0]);
            if (_item_ch[1]) {
                this.loadMenu($(_item_ch[1]), true);
                link.on("click", (event) => { this.show(item); });
            }
        }
        _load(main) {
            this._main = main.addClass(this.className);
            let type = "";
            let types = ["accordion", "popup"];
            types.forEach((e) => {
                if (main.hasClass(`menu-${e}`)) {
                    type = e;
                }
            });
            if (type !== "") {
                this.type = type;
            }
            else {
                main.addClass(`menu-${this.getType()}`);
            }
            type = "";
            types = ["default", "one", "any", "dropdown"];
            types.forEach((e) => {
                if (main.hasClass(`menu-${e}`)) {
                    type = e;
                }
            });
            if (type !== "") {
                this.subType = type;
            }
            else {
                main.addClass(`menu-${this.getSubType()}`);
            }
            this.loadMenu($(main.get().children[1]));
        }
        createMenu(main, items, submenu = false) {
            let menu = main.create({
                tagName: "div",
                className: "menu",
            });
            if (submenu) {
                main.addClass("close");
                menu.addClass("submenu");
            }
            if (items) {
                for (let x in items) {
                    if (items.hasOwnProperty(x)) {
                        this.add(menu, items[x]);
                    }
                }
            }
        }
        add(main, info) {
            let item = main.create("div").addClass("item");
            let link = item.create(this.tagLink)
                .addClass("option")
                .prop("href", info.url || "javascript:void(0)")
                .ds("value", info.value || "");
            if (this.tagLink == "button") {
                link.prop("type", "button");
            }
            if (this.useCheck && (info.useCheck === true)) {
                let chk = link.create("input").attr("type", "checkbox");
            }
            link.create("span").addClass("icon").addClass(info.iconClass || "");
            link.create("span").addClass("text").text(info.caption);
            if (info.items) {
                link.create("span").addClass("ind");
                this.createMenu(item, info.items, true);
                link.on("click", (event) => { this.show(item); });
            }
            else if (info.action) {
                let action = $.bind(info.action, this.parentContext, "item");
                link.on("click", (event) => { action(item); });
            }
        }
        show(item) {
            let link = $(item.get().children[0]);
            let menu = $(item.get().children[1]);
            if (this.type === "popup") {
                if (item.hasClass("open")) {
                    return false;
                }
                this._closeBrothers(item);
                item.removeClass("close");
                item.addClass("open");
                Float.setIndex(menu.get());
                if ((this.subType === "dropdown") && !$(item.get().parentNode).hasClass("submenu")) {
                    Float.showMenu({
                        ref: item.get(), e: menu.get(),
                        left: "left", top: "down",
                        deltaX: 0, deltaY: 0, z: 0
                    });
                }
                else {
                    Float.showMenu({
                        ref: item.get(), e: menu.get(),
                        left: "front", top: "top",
                        deltaX: -2, deltaY: 5, z: 0
                    });
                }
            }
            else {
                if (this.subType !== "any") {
                    this._closeBrothers(item);
                }
                if (item.hasClass("open")) {
                    item.removeClass("open").addClass("close");
                }
                else {
                    item.removeClass("close").addClass("open");
                }
            }
        }
        closeMenu(menu) {
            let menus = menu.queryAll(".submenu");
            menus.forEach((e) => {
                $(e.parentNode).removeClass("open").addClass("close");
            });
        }
        _closeBrothers(menu) {
            let parent = menu.get().parentNode;
            let menus = $(parent).queryAll(".submenu");
            menus.forEach((e) => {
                if (e.parentNode === menu.get()) {
                    return;
                }
                $(e.parentNode).removeClass("open").addClass("close");
            });
        }
        closeAll() {
            if (this.subType !== "any" && this.subType !== "one") {
                this.closeMenu(this._main);
            }
        }
    }
    Menu._objs = [];
    $(window).on("load", function () {
        // newMenus();
        Menu.init();
    });
    /*
    window.onload = function(event){
        Menu.init();
        newMenus();
    }
      */
    let newMenus = function () {
        let m = new Menu({
            id: "menu1",
            className: "summer",
            type: "popup"
        });
        let Info = {
            id: "menu2",
            caption: "Menu Opciones 1",
            type: "accordion",
            className: "summer",
            useIcon: true,
            target: "",
            context: "",
            action_: function (item) {
                // alert(menu.type)
                db(item.get());
            },
            action__: "db('item class name is '+item.get());",
            check: function (item) {
                db("checkeando " + event.target);
                db(item.get(), "blue", "aqua");
            },
            items: [
                {
                    caption: "popup",
                    action: function (item) {
                        db(this.caption, "orange");
                        this.setType("popup", "default");
                        //m4.setType("popup","default");
                    },
                },
                {
                    caption: "Navegador",
                    action: function (menu, item) {
                        this.setType("popup", "dropdown");
                        m4.setType("popup", "dropdown");
                    },
                },
                {
                    caption: "Acc<b>o</b>rdion",
                    action: function (menu, item) {
                        this.setType("accordion", "default");
                        m4.setType("accordion", "default");
                    },
                },
                {
                    caption: "Accordion Y",
                    action: function (menu, item) {
                        this.setType("accordion", "any");
                        m4.setType("accordion", "any");
                    },
                },
                {
                    caption: "Accordion X",
                    action: function (menu, item) {
                        this.setType("accordion", "one");
                        m4.setType("accordion", "one");
                    },
                },
                {
                    caption: "tres",
                    iconClass: "fruit",
                    items: [
                        {
                            caption: "tres:a",
                            action: "db('aaaaaa','yellow','red');",
                        },
                        {
                            caption: "tres:b",
                            items: [{ caption: "caracas",
                                    items: [{ caption: "alpha" }, { caption: "betha" }, { caption: "gamma" }]
                                }, { caption: "valencia" }, { caption: "san carlos" }, { caption: "yaritagua" }],
                        },
                        {
                            caption: "tres:c",
                            items: [{ caption: "caracas II" }, { caption: "valencia II" }, { caption: "san carlos II" }, { caption: "yaritagua II" }],
                        },
                    ]
                },
                {
                    caption: "IV"
                },
                {
                    caption: "V",
                    items: [
                        { caption: "Perla" }, { caption: "diamante" }, { caption: "esmeralda" }
                    ]
                }
            ]
        };
        Info.context = "cedula";
        let m2 = new Menu(Info);
        Info.context = "";
        Info.id = "menu4";
        let m3 = new Menu(Info);
        Info.context = "";
        Info.caption = "Menu X";
        Info.target = "q";
        Info.id = null;
        let m5 = new Menu(Info);
        db("info. target " + Info.target, "blue");
        let Info2 = {
            id: "menu10",
            type: "popup",
            subType: "system",
        };
        let m4 = new Menu(Info2);
        let btn = $().create({ tagName: "input", type: "button", value: "ok" }).on("click", () => {
            m4.show($("y")); //$("#y").fire("click");
            //m4._show()
            // alert(this)
        });
    };
    return Menu;
})(_sgQuery, false);
