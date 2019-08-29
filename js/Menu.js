(function ($, Float) {
    class Drag {
    }
    class Item {
        constructor(opt) {
            this.caption = "";
            this.className = "";
            this.withCheck = false;
            this.withIcon = false;
            this.iconSource = "";
            this.onOpen = (index) => { return true; };
            this.onClose = (index) => { return true; };
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
        }
        create() {
        }
        load() {
        }
    }
    class Menu {
        constructor(opt) {
            this.type = "nav"; //default,nav,dropdown,accordion[x|y]
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
            this.useIcon = false;
            this._isCheck = false;
            this._isItem = false;
            let x;
            for (x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let main = $(this.id);
            if (main) {
                if (main.hasClass("sg-menu")) {
                    this.load(main);
                }
                else {
                    this.create(main);
                }
                this._main = main;
            }
            else {
                return;
            }
            if (this.context) {
                let context = $(this.context).on("click", () => {
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
                $().on("mousedown", (event) => {
                    if (main.ds("active") == "0") {
                        main.style({
                            position: "absolute",
                            visibility: "hidden",
                        });
                    }
                });
                $().on("click", (event) => {
                    if (main.ds("active") == "1" && !this._isCheck && this._isItem) {
                        main.style({
                            position: "absolute",
                            visibility: "hidden",
                        });
                    }
                });
            }
            main.ds("active", "0");
            main.on("mouseenter", (event) => {
                main.ds("active", "1");
            })
                .on("mouseleave", (event) => {
                main.ds("active", "0");
            });
            $().on("mousedown", (event) => {
                if (main.ds("active") == "0") {
                    this.closeAll();
                }
            });
            $().on("click", (event) => {
                if (main.ds("active") == "1" && !this._isCheck && this._isItem) {
                    this.closeAll();
                }
            });
            let items = main.queryAll(".submenu");
            if (this.type == "dropdown" || this.type == "system" || this.type == "nav") {
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
                    item.on("click", (event) => { this.action(this, $(x.parentNode)); });
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
                        this.check(this, chk.get().parentNode.parentNode);
                    });
                }
            }
        }
        static init() {
            let menus = $().queryAll(".sg-menu");
            alert(menus.length);
        }
        setType(type) {
            this.type = type;
            let types = ["nav", "accordion", "accordionx", "accordiony", "system", "dropdown"];
            types.forEach((e) => {
                this._main.removeClass(`menu-${e}`);
            });
            this._main.addClass(`menu-${type}`);
            if (this.type != "dropdown" && this.type != "system" && this.type != "nav") {
                let items = this._main.queryAll(".popup");
                for (var x of items) {
                    $(x).removeClass("popup");
                }
            }
            if (this.type == "dropdown" || this.type == "system" || this.type == "nav") {
                let items = this._main.queryAll(".submenu");
                for (x of items) {
                    $(x).addClass("popup");
                }
            }
        }
        getType() {
            return this.type;
        }
        create(main) {
            db("create");
            main.addClass("sg-menu").addClass(this.className)
                .addClass(this.useIcon ? "w-icon" : "n-icon")
                .addClass(`menu-${this.getType()}`);
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
                link.on("click", this._show(item));
            }
        }
        load(main) {
            db("load");
            let type = "";
            let types = ["nav", "accordion", "accordionx", "accordiony", "system", "dropdown"];
            types.forEach((e) => {
                if (main.hasClass(`menu-${e}`)) {
                    type = e;
                }
            });
            if (type !== "") {
                this.type = type;
            }
            else {
                main.addClass(`menu-${this.getType()}`).addClass("s8");
            }
            let _main = main.get().children;
            //let _menu = _main[1];
            $(_main[0]).addClass("_CAPTION");
            this.loadMenu($(_main[1]));
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
            let tagType = "a";
            if ((this.type === "system1" || this.type === "nav") && !main.hasClass("submenu")) {
                tagType = "button";
            }
            let link = item.create(tagType)
                .addClass("option")
                .prop("href", info.url || "javascript:void(0)")
                .ds("value", info.value || "");
            if (info.useCheck || true) {
                let chk = link.create("input").attr("type", "checkbox");
            }
            link.create("span").addClass("icon").addClass(info.iconClass || "");
            link.create("span").addClass("text").text(info.caption);
            if (info.items) {
                link.create("span").addClass("ind").ds("sgMenuType", "ind");
                this.createMenu(item, info.items, true);
                link.on("click", this._show(item));
            }
            else {
                if (info.action) {
                    link.on("click", $.bind(info.action, this));
                }
            }
        }
        _show(item) {
            return (event) => {
                let link = $(item.get().children[0]);
                let menu = $(item.get().children[1]);
                switch (this.type) {
                    case "dropdown":
                    case "system":
                    case "default":
                    case "nav":
                        if (item.hasClass("open")) {
                            return false;
                        }
                        this._closeBrothers(item);
                        item.removeClass("close");
                        item.addClass("open");
                        Float.setIndex(menu.get());
                        if ((this.type === "system" || this.type === "nav") && !$(item.get().parentNode).hasClass("submenu")) {
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
                        break;
                    case "accordion":
                    case "accordionx":
                        this._closeBrothers(item);
                    case "accordiony":
                        if (item.hasClass("open")) {
                            item.removeClass("open").addClass("close");
                        }
                        else {
                            item.removeClass("close").addClass("open");
                        }
                        break;
                }
            };
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
            if (this.type == "default" || this.type == "dropdown"
                || this.type == "system" || this.type == "nav" || this.type == "accordion") {
                this.closeMenu(this._main);
            }
        }
    }
    $(window).on("load", function () {
        newMenus();
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
            type: "dropdown"
        });
        let Info = {
            id: "menu2",
            caption: "Menu Opciones",
            type: "accordiony",
            className: "summer",
            useIcon: false,
            context: "",
            action: function (menu, item) {
                // alert(menu.type)
                db(item.get().className);
            },
            check: function (menu, item) {
                // db ("checkeando")
                //db (item.get());    
            },
            items: [
                {
                    caption: "Accordion",
                    action: function (menu, item) {
                        this.setType("accordion");
                        m4.setType("accordion");
                    },
                },
                {
                    caption: "Navegador",
                    action: function (menu, item) {
                        this.setType("nav");
                        m4.setType("nav");
                    },
                },
                {
                    caption: "dropdown",
                    action: function (menu, item) {
                        this.setType("dropdown");
                        m4.setType("dropdown");
                    },
                },
                {
                    caption: "dos"
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
        let Info2 = {
            id: "menu10",
            type: "nav",
            action: () => {
                db("ssss");
            }
        };
        let m4 = new Menu(Info2);
        let btn = $().create({ tagName: "input", type: "button", value: "ok" }).on("click", () => {
            $("#y").fire("click");
            //m4._show()
            // alert(this)
        });
    };
})(_sgQuery, _sgFloat);
