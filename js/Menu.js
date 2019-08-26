(function ($, Float) {
    db = db;
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
            this.type = "system"; //default,buttons,dropdown,accordion[x|y]
            this.id = "";
            this.target = "";
            this.caption = "";
            this.className = "";
            this.items = [];
            this._menu = null;
            this._main = null;
            for (var x in opt) {
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
            $().on("click", (event) => {
                this.closeAll();
            });
        }
        static init() {
            let menus = $().queryAll(".sg-menu");
            alert(menus.length);
        }
        setType(type) {
        }
        getType() {
            return this.type;
        }
        create(main) {
            db("create");
            main.addClass("sg-menu");
            main.addClass(`menu-${this.getType()}`);
            if (this.caption) {
                main.create({
                    tagName: "div",
                    innerHTML: this.caption,
                    className: "caption",
                });
            }
            this.createMenu(main, this.items);
        }
        load(main) {
            db("load");
        }
        createMenu(main, items, submenu = false) {
            let menu = main.create({
                tagName: "div",
                className: "menu",
            });
            if (submenu) {
                menu.addClass("submenu");
                if (this.type == "dropdown" || this.type == "system") {
                    menu.style({
                        position: "fixed",
                        userSelect: "none",
                        MozUserSelect: "none",
                        visibility: "hidden",
                        overflow: "none",
                        zIndex: 150000000,
                    });
                }
                main.addClass("close");
            }
            if (items) {
                for (let x in items) {
                    if (items.hasOwnProperty(x)) {
                        this.add(menu, items[x]);
                    }
                }
            }
            return menu;
        }
        add(main, info) {
            let item = main.create("div").addClass("item");
            let link = item.create("a")
                .addClass("option")
                .prop("href", info.url || "javascript:void(0)");
            link.text(info.caption);
            if (info.items) {
                link.create("span").addClass("ind").ds("sgMenuType", "ind");
                let menu = this.createMenu(item, info.items, true);
                link.on("click", (event) => {
                    switch (this.type) {
                        case "dropdown":
                        case "system":
                        case "default":
                            if (item.hasClass("open")) {
                                db("abiertoooo");
                                event.stopPropagation();
                                //event.cancelBubble = true; 
                                event.preventDefault();
                                return false;
                            }
                            this._closeBrothers(item);
                            menu.style({
                                visibility: "visible"
                            });
                            item.removeClass("close");
                            item.addClass("open");
                            if (this.type === "system" && !main.hasClass("submenu")) {
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
                            db(item.get().className);
                            db(item.hasClass("open"), "red");
                            this._closeBrothers(item);
                        case "accordiony":
                            menu.style({
                                visibility: "visible"
                            });
                            if (item.hasClass("open")) {
                                db("tratando de cerrar");
                                item.removeClass("open").addClass("close");
                            }
                            else {
                                item.removeClass("close").addClass("open");
                                //   item.removeClass("close")
                            }
                            break;
                    }
                    event.stopPropagation();
                    //event.cancelBubble = true; 
                    event.preventDefault();
                });
            }
        }
        closeMenu(menu) {
            let menus = menu.queryAll(".submenu");
            menus.forEach((e) => {
                // alert(e.tagName)
                //return
                $(e.parentNode).removeClass("open")
                    .addClass("close");
                $(e).style({
                    visibility: "hidden"
                });
            });
        }
        _closeBrothers(menu) {
            let parent = menu.get().parentNode;
            let menus = $(parent).queryAll(".submenu");
            menus.forEach((e) => {
                if (e.parentNode === menu.get()) {
                    db("return....");
                    return;
                }
                $(e.parentNode).removeClass("open")
                    .addClass("close");
                $(e).style({
                    visibility: "hidden"
                });
            });
        }
        closeAll() {
            if (this.type == "default" || this.type == "dropdown" || this.type == "system" || this.type == "accordion") {
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
        });
        let m2 = new Menu({
            id: "menu2",
            caption: "Menu Opciones",
            items: [
                {
                    caption: "uno"
                },
                {
                    caption: "dos"
                },
                {
                    caption: "tres",
                    items: [
                        {
                            caption: "tres:a",
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
        });
    };
})(_sgQuery, _sgFloat);
