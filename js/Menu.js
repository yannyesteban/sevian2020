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
            this.id = "";
            this.target = "";
            this.caption = "";
            this.className = "";
            this.items = [];
            this._menu = null;
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
            }
        }
        create(main) {
            db("create");
            main.addClass("sg-menu");
            if (this.caption) {
                main.create({
                    tagName: "div",
                    innerHTML: this.caption,
                    className: "caption",
                });
            }
            this.createMenu(main, this.items);
            return;
            this._menu = main.create({
                tagName: "div",
                className: "menu",
            });
            if (this.items) {
                for (let x in this.items) {
                    if (this.items.hasOwnProperty(x)) {
                        this.add(this.items[x], main);
                    }
                }
            }
        }
        load(main) {
            db("load");
        }
        createMenu(main, items) {
            let menu = main.create({
                tagName: "div",
                className: "menu",
            });
            if (items) {
                for (let x in items) {
                    if (items.hasOwnProperty(x)) {
                        this.add(menu, items[x]);
                    }
                }
            }
        }
        add(main, info) {
            let item = main.create("div").addClass("item").addClass("close");
            let link = item.create("a").addClass("option").prop("href", "javascript:void(0)");
            link.text(info.caption);
            if (info.items) {
                link.on("click", function (event) {
                    if (item.hasClass("open")) {
                        item.removeClass("open").addClass("close");
                    }
                    else {
                        item.removeClass("close").addClass("open");
                    }
                    event.stopPropagation();
                    //event.cancelBubble = true; 
                    event.preventDefault();
                });
                this.createMenu(item, info.items);
            }
        }
    }
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
                        items: [{ caption: "caracas" }, { caption: "valencia" }, { caption: "san carlos" }, { caption: "yaritagua" }],
                    },
                    {
                        caption: "tres:c",
                    },
                ]
            },
            {
                caption: "IV"
            }
        ]
    });
})(_sgQuery, _sgFloat);
