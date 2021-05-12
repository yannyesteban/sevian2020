/*
var ev = new Event("look", {"bubbles":true, "cancelable":false});
document.dispatchEvent(ev);


*/
import { _sgQuery as $ } from './Query.js';
import { Float as float } from './Window.js';
const Float = float.Float;
class Item {
    constructor(info) {
        this.main = null;
        this.tagLink = "a";
        this.url = null;
        this.value = null;
        this.useCheck = false;
        this.checkValue = true;
        this.context = null;
        this.ds = null;
        this.checkDs = null;
        this.check = null;
        this.checked = false;
        this.caption = null;
        this.imageClass = null;
        this.items = null;
        this.dataUser = null;
        this.onDataUser = null;
        this.propertys = null;
        this.events = null;
        this.action = null;
        this.menuInfo = null;
        this.menu = null;
        this.infoElement = null;
        this.className = null;
        this.customIcon = null;
        let x;
        for (x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        if (this.main) {
            return;
        }
        this.create();
    }
    get() {
        return this.main.get();
    }
    getMain() {
        return this.main;
    }
    load(item) {
    }
    getCaption() {
        return this.main.q(":first-of-type > .text");
    }
    getOption() {
        return this.main.q(":first-of-type > .option");
    }
    getImage() {
        return this.main.q(":first-of-type > .image");
    }
    getCheck(item) {
        return this.main.q(":first-of-type > input[type='checkbox']");
        //return $(item.query("input[type='checkbox']'"));
    }
    getChild() {
        return this.main.q(".sg-menu:first-of-type");
    }
    append(item) {
        this.main.q(".sg-menu:first-of-type").append(item);
    }
    getMenu() {
        let main = this.main.q(".sg-menu:first-of-type");
        return new Menu({
            id: main,
            context: this.context,
            dataUser: this.dataUser,
            //subMenu:    true,
            type: this.menu.type,
            subType: this.menu.subType,
            useCheck: this.menu.useCheck,
        });
    }
    create() {
        let item = this.main = $.create("li").addClass("item").ds("value", this.value || "");
        if (this.className) {
            item.addClass(this.className);
        }
        if (this.ds) {
            item.ds(this.ds);
        }
        let link = item.create(this.tagLink)
            .addClass("option")
            .prop("href", this.url || "javascript:void(0)");
        if (this.tagLink == "button") {
            link.prop("type", "button");
        }
        if (this.menu.useCheck && (this.useCheck === true)) {
            let chk = link.create("input").attr("type", "checkbox");
            chk.attr("checked", this.checked);
            if (this.checkValue) {
                chk.value(this.checkValue);
            }
            if (this.checkDs) {
                chk.ds(this.checkDs);
            }
            chk.on("click", (event) => {
                event.stopPropagation();
            });
            if (this.check) {
                let action = $.bind(this.check, this.context, "item");
                chk.on("click", (event) => {
                    action(item, event);
                });
            }
        }
        link.create("span").addClass("image").addClass(this.imageClass || "");
        if (this.customIcon) {
            link.append(this.customIcon);
        }
        link.create("span").addClass("text").append(this.caption);
        if (this.infoElement) {
            link.append(this.infoElement);
        }
        link.on("click", event => { this.menu.closeBrothers(item); });
        if (this.items) {
            item.addClass("close");
            link.create("span").addClass("ind");
            let menu = new Menu({
                items: this.items,
                context: this.context,
                subMenu: true,
                type: this.menu.type,
                subType: this.menu.subType,
                useCheck: this.menu.useCheck,
                dataUser: this.dataUser,
                onDataUser: this.onDataUser
            });
            item.append(menu.get());
            //this.createMenu(item, info.items, true);
            link.on("click", (event) => { this.menu.show(item); });
        }
        else if (this.action) {
            let action = $.bind(this.action, this.context, "item, dataUser, event");
            link.on("click", (event) => { action(this, this.dataUser || false, event); });
        }
        else if (this.onDataUser) {
            let action = $.bind(this.onDataUser, this.context, "item, dataUser, event");
            link.on("click", (event) => { action(this, this.dataUser || false, event); });
        }
        if (this.events) {
            for (let i in this.events) {
                link.on(i, $.bind(this.events[i], this.context || this, "event"));
            }
        }
        if (this.propertys) {
            link.prop(this.propertys);
        }
    }
}
export class Menu {
    constructor(info) {
        this.id = null;
        this.className = null;
        this.tagLink = "a";
        this.useCheck = false;
        this.target = null;
        this.subMenu = false;
        this.onDataUser = null;
        this.useIcon = true;
        this.type = "accordion";
        this.subType = "default";
        this.autoClose = true;
        this.items = [];
        this.context = null;
        this.parentContext = null;
        this._main = null;
        this.context = this;
        let x;
        for (x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = (this.id) ? $(this.id) : false;
        if (main) {
            if (main.ds("sgMenu")) {
                this._main = main;
                return;
            }
        }
        else {
            main = $.create("ul");
            if (this.id && typeof this.id === 'string') {
                main.attr("id", this.id);
            }
        }
        this._create(main);
        if (this.autoClose) {
            $().on("click", event => {
                if (main.contains(event.target)) {
                    return;
                }
                this.closeAll();
            });
        }
        if (this.target) {
            let target = $(this.target);
            target.append(main);
        }
        return;
        let items = main.queryAll(".submenu");
        if (this.type === "popup") {
            for (x of items) {
                $(x).addClass("popup");
            }
        }
    }
    get() {
        return this._main.get();
    }
    getMain() {
        return this._main;
    }
    _create(main) {
        this._main = main;
        main.addClass("sg-menu").addClass(this.className).ds("sgMenu", this.getType());
        if (this.subMenu) {
            main.addClass(["submenu", "close2"]);
            //main.style({position:"fixed"})
        }
        main.addClass(this.useIcon ? "w-icon" : "n-icon")
            .addClass(`menu-${this.getType()}`)
            .addClass(`menu-${this.getSubType()}`);
        this.items.forEach((item) => {
            this.add(item);
        });
    }
    add(info) {
        //info.menuInfo = {type: "accordion", subType: "default"};
        info.menu = this;
        info.onDataUser = this.onDataUser;
        info.context = this.context;
        //info.useCheck = this.useCheck;
        return this._main.append(new Item(info));
    }
    setCaption(info) {
    }
    getItem(index) {
        return new Item({
            main: $(this._main.get().childNodes[index]),
            menu: this,
            onDataUser: this.onDataUser,
            context: this.context,
        });
    }
    getByValue(value) {
        return new Item({
            main: $(this._main.q(`.item[data-value='${value}']`)),
            menu: this,
            onDataUser: this.onDataUser,
            context: this.context,
        });
    }
    getByData(data, value) {
        let main = $(this._main.q(`.item[data-${data}='${value}']`));
        if (!main) {
            return false;
        }
        return new Item({
            main: main,
            menu: this,
            onDataUser: this.onDataUser,
            context: this.context,
        });
    }
    show(item) {
        let link = $(item.get().children[0]);
        let menu = $(item.get().children[1]);
        if (this.type == "accordion") {
            if (item.hasClass("open")) {
                item.removeClass("open").addClass("close");
            }
            else {
                item.removeClass("close").addClass("open");
            }
        }
        if (this.type === "popup") {
            if (item.hasClass("open")) {
                return false;
            }
            //this.closeBrothers(item);
            item.removeClass("close");
            item.addClass("open");
            Float.setIndex(menu.get());
            if ((this.subType === "dropdown") && !$(item.get().parentNode).hasClass("submenu")) {
                Float.showMenu({
                    context: item.get(), e: menu.get(),
                    left: "left", top: "down",
                    deltaX: 0, deltaY: 0, z: 0
                });
            }
            else {
                Float.showMenu({
                    context: item.get(), e: menu.get(),
                    left: "front", top: "top",
                    deltaX: -2, deltaY: 5, z: 0
                });
            }
        }
        return;
        if (this.type === "popup") {
            if (item.hasClass("open")) {
                return false;
            }
            this.closeBrothers(item);
            item.removeClass("close");
            item.addClass("open");
            Float.setIndex(menu.get());
            if ((this.subType === "dropdown") && !$(item.get().parentNode).hasClass("submenu")) {
                Float.showMenu({
                    context: item.get(), e: menu.get(),
                    left: "left", top: "down",
                    deltaX: 0, deltaY: 0, z: 0
                });
            }
            else {
                Float.showMenu({
                    context: item.get(), e: menu.get(),
                    left: "front", top: "top",
                    deltaX: -2, deltaY: 5, z: 0
                });
            }
        }
        else {
            if (this.subType !== "any") {
                this.closeBrothers(item);
            }
            if (item.hasClass("open")) {
                item.removeClass("open").addClass("close");
            }
            else {
                item.removeClass("close").addClass("open");
            }
        }
    }
    closeBrothers(menu) {
        if (this.subType == "default") {
            return;
        }
        let parent = menu.get().parentNode;
        let menus = $(parent).queryAll(".item.open");
        menus.forEach((e, index) => {
            if (e != menu.get()) {
                $(e).removeClass("open").addClass("close");
            }
        });
    }
    closeMenu(menu) {
        let menus = menu.queryAll(".submenu");
        menus.forEach((e) => {
            $(e.parentNode).removeClass("open").addClass("close");
        });
    }
    closeAll() {
        if (this.subType !== "any" && this.subType !== "one") {
            this.closeMenu(this._main);
        }
    }
    getType() {
        return this.type;
    }
    getSubType() {
        return this.subType;
    }
    getParentContext() {
        return this.parentContext;
    }
}
//# sourceMappingURL=Menu2.js.map