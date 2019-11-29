var Sorter = (($) => {
    class ContainerSorted {
        constructor(main, info = {}) {
            this.container = null;
            this.classContainer = "x-menu";
            this.classItem = "item";
            this.transfer = { item: null, info: null };
            this.contexts = [];
            this._item = null;
            this.drag = (event) => { };
            this.dragend = (event) => { };
            this.dragenter = (event) => { };
            this.dragleave = (event) => { };
            this.dragover = (event) => { };
            this.dragstart = (event) => { };
            this.drop = (event) => { };
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            const dropOn = object => (event) => {
                event.preventDefault();
                event.stopPropagation();
                let item = object.item;
                let context = object.contexts;
                let target = $(event.target);
                let allow = false;
                if (event.target.classList.contains(this.classContainer)) {
                    for (let e of object.contexts) {
                        if (event.target == e.get() || e.contains(event.target)) {
                            allow = true;
                            break;
                        }
                    }
                    if (allow && !item.contains(event.target)) {
                        $(event.target).append(item);
                    }
                }
                else if (event.target.classList.contains(this.classItem)) {
                    for (let e of object.contexts) {
                        if (event.target.parentNode == e.get() || e.contains(event.target.parentNode)) {
                            allow = true;
                            break;
                        }
                    }
                    if (allow && !item.contains(event.target.parentNode)) {
                        var rect = event.target.getBoundingClientRect();
                        var diff = event.clientY - rect.top;
                        if (diff > rect.height / 2) {
                            event.target.parentNode.insertBefore(item, event.target.nextSibling);
                        }
                        else {
                            event.target.parentNode.insertBefore(item, event.target);
                        }
                    }
                    $(event.target).removeClass("over-top").removeClass("over-bottom");
                }
            };
            const startOn = object => event => {
                event.stopPropagation();
                object.item = event.target;
                object.contexts = this.contexts;
            };
            const dragOverOn = object => event => {
                event.preventDefault();
                event.stopPropagation();
                if (event.target.classList.contains(this.classItem)) {
                    var rect = event.target.getBoundingClientRect();
                    var diff = event.clientY - rect.top;
                    if (diff > rect.height / 2) {
                        $(event.target)
                            .removeClass("over-top")
                            .addClass("over-bottom");
                    }
                    else {
                        $(event.target)
                            .removeClass("over-bottom")
                            .addClass("over-top");
                    }
                }
            };
            const dragDropDefault = event => { event.preventDefault(); event.stopPropagation(); };
            const dragLeave = event => {
                event.preventDefault();
                main.queryAll(".over-top, .over-bottom").forEach(e => {
                    $(e).removeClass("over-top").removeClass("over-bottom");
                });
            };
            main
                .on("dragstart", startOn(this.transfer))
                .on("dragover", dragDropDefault)
                .on("dragleave", dragLeave)
                .on("drop", dropOn(this.transfer))
                .on("dragover", dragOverOn(this.transfer));
            let children = main.children(); ///main.get().children;
            let i;
            for (i = 0; i < children.length; i++) {
                $(children[i]).attr("draggable", "true").on("dragstart", (event) => {
                    event.dataTransfer.setData("text/plain", null);
                }).create("div").addClass("handler");
            }
        }
    }
    class Sorter {
        constructor(info) {
            this.id = null;
            this.target = null;
            this._main = null;
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sgSorter")) {
                    return;
                }
                if (main.hasClass("sg-sorter")) {
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
        }
        _create(main) {
            let transfer = { item: null, contexts: null, info: null };
            this._main = main;
            let contexts = [main];
            //let item = main.create("div").text("uno");
            //main.create("div").text("dos");
            //main.create("div").text("tres");
            let nodo = `
			<ul class="x-menu" id="x">
				<li class="item"><div class="title">Titluo 1</div><ul class="x-menu"></ul></li>
				<li class="item"><div class="title">Titluo 2</div><ul class="x-menu"></ul></li>
				<li class="item"><div class="title">Titluo 3</div><ul class="x-menu"></ul></li>
				<li class="item"><div class="title">Titluo 4</div><ul class="x-menu"></ul></li>
				<li class="item"><div class="title">Titluo 5</div><ul class="x-menu"></ul></li>
			</ul>

		
		`;
            this._main.append(nodo);
            nodo = `
			<ul class="x-menu" id="y">
				<li class="item"><div class="title">Titluo 1</div><ul class="x-menu">
				<li class="item">Blue</li>
				<li class="item">Red</li>
				</ul></li>
				<li class="item"><div class="title">Titluo 2</div><ul class="x-menu"></ul></li>
				<li class="item"><div class="title">Titluo 3</div><ul class="x-menu"></ul></li>
				<li class="item"><div class="title">Titluo 4</div><ul class="x-menu"></ul></li>
				<li class="item"><div class="title">Titluo 5</div><ul class="x-menu"></ul></li>
			</ul>

		
		`;
            this._main.append(nodo);
            new ContainerSorted($("#y"), { transfer, contexts: [$("#x"), $("#y")] });
            new ContainerSorted($("#x"), { transfer, contexts: [$("#x"), $("#y")] });
            $("#x").queryAll(".x-menu").forEach(e => {
                new ContainerSorted($(e), { transfer, contexts: [$("#x"), $("#y")] });
            });
            $("#y").queryAll(".x-menu").forEach(e => {
                new ContainerSorted($(e), { transfer, contexts: [$("#x"), $("#y")] });
            });
            return;
            ["uno", "dos", "tres", "cuatro"].map((item) => {
                main.create("div").addClass("item").text(item);
            });
            let v = $(this._main.get().parentNode).id("alpha").create("div").addClass("x-menu").text("hola");
            contexts.push(v);
            ["Cinco", "Seis", "Siete", "Ocho"].map((item) => {
                v.create("div").addClass("item").text(item);
            });
            new ContainerSorted(v, { transfer, contexts });
            let z = $(this._main.get().parentNode).id("betha").create("div").addClass("x-menu").text("hola");
            ["Alpha", "Beta", "Gamma", "titha"].map((item) => {
                z.create("div").addClass("item").text(item);
            });
            //contexts.push(z);
            new ContainerSorted(z, { transfer, contexts: [z] });
            const _addClass = (e, className) => { $(e).addClass(className); };
            const _addEvent = (e, event, fn) => { $(e).on(event, fn); };
            const curry = PFTool.curry;
            const addClass = curry(_addClass);
            const addEvent = curry(_addEvent);
            const clss = addClass(main);
            clss("x-menu");
            const on = addEvent(main);
            let objItem = {
                item: null,
                info: null,
                classContainer: "x-menu",
                classItem: "item",
            };
            let menuc = new ContainerSorted(main, { transfer, contexts });
            return;
            const dropOn = object => (event) => {
                event.preventDefault();
                let item = object.item;
                if (event.target.className == object.classContainer) {
                    $(event.target).append(item);
                }
                else if (event.target.className == object.classItem) {
                    var rect = event.target.getBoundingClientRect();
                    var diff = event.clientY - rect.top;
                    if (diff > rect.height / 2) {
                        event.target.parentNode.insertBefore(item, event.target.nextSibling);
                    }
                    else {
                        event.target.parentNode.insertBefore(item, event.target);
                    }
                }
            };
            const startOn = object => {
                return (event) => {
                    object.item = event.target;
                };
            };
            const dragDropDefault = event => { event.preventDefault(); };
            main
                .on("dragstart", startOn(objItem))
                .on("dragover", dragDropDefault)
                .on("drop", dropOn(objItem));
        }
    }
    $(window).on("load", function () {
        //let sorter = new Sorter({});
    });
    return Sorter;
})(_sgQuery);
const NumberBox = number => ({
    applyFunction: fn => NumberBox(fn(number)),
    value: number,
});
console.log(NumberBox(5)
    .applyFunction(v => v * 2)
    .applyFunction(v => v + 1).value); // 11
class Zord {
    static of(...values) {
        const This = this[Symbol.species];
        return new This(...values);
    }
    static get [Symbol.species]() {
        return this;
    }
    constructor(...values) {
        this._values = values;
    }
    map(actor = (x) => x) {
        const This = this.constructor[Symbol.species];
        return new This(...this._values.map(actor));
    }
    flatMap(actor = (x) => x) {
        const This = this.constructor[Symbol.species];
        //We need to flatten the result array, as it can result in [ val1, [val2], [val3] ]
        const result = [].concat.apply([], this._values.map(value => {
            //Here we check if we need lift/unwrap from a inner Zord
            if (value instanceof This) {
                return value._values.map(actor);
            }
            else
                return actor(value);
        }));
        return This.of(...result); //We make sure to always return a new instance
    }
}
class CustomZord extends Zord {
    finalAtack() {
        this.flatMap(ranger => console.log(`${ranger} ready!`));
        console.log("Slice, slice, turns around ... BOOM! (epic explosion in background)");
    }
}
const megaDragonZord = CustomZord.of("green", CustomZord.of(CustomZord.of("purple")), CustomZord.of("red"), CustomZord.of("blue"), CustomZord.of("yellow"), CustomZord.of("pink"), CustomZord.of("black"));
megaDragonZord
    .flatMap(color => `${color} ranger`) // Put the complete name on them, e.g. "red ranger"
    .finalAtack();
var MenuDesign = (($) => {
    const captureItem = function (item) {
        return function (e) {
            item = e;
            return e;
        };
    };
    let sItem = {
        caption: "",
        id: "",
        name: "",
        action: "",
        image: "",
        className: "",
    };
    let createItems = (menu, item) => {
        let item1 = menu.create("li").addClass("caption").text(item.caption);
        if (item.items) {
            let _menu = item1.create("ul").addClass("sub-menu");
            item.items.reduce(createItems, _menu);
        }
        return menu;
    };
    class MenuDesign {
        constructor(info) {
            this.id = null;
            this.caption = null;
            this.menu = null;
            for (var x in info) {
                alert(x);
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this._main = $(this.id);
            let m = $(this.id).create("div").addClass("x-menu");
            m.create("div").addClass("item").text("uno");
            m.create("div").addClass("item").text("dos");
            m.create("div").addClass("item").text("tres");
            m.create("div").addClass("item").text("cuatro");
            let nodo = `
					<ul class="x-menu">
						<li class="item"><div class="title">Titluo 1</div><ul class="x-menu"></ul></li>
						<li class="item"><div class="title">Titluo 2</div><ul class="x-menu"></ul></li>
						<li class="item"><div class="title">Titluo 3</div><ul class="x-menu"></ul></li>
						<li class="item"><div class="title">Titluo 4</div><ul class="x-menu"></ul></li>
						<li class="item"><div class="title">Titluo 5</div><ul class="x-menu"></ul></li>
					</ul>

				
				`;
            this._main.append(nodo);
            let m2 = $(this.id).create("div").addClass("x-menu");
            m2.create("div").addClass("item").text("cinco");
            m2.create("div").addClass("item").text("seis");
            m2.create("div").addClass("item").text("siete");
            m2.create("div").addClass("item").text("ocho");
            let item = null;
            this._main.queryAll(".x-menu>.item").forEach((e) => {
                e.draggable = true;
                $(e).on("dragstart", (event) => {
                    db("ok");
                    event.dataTransfer.setData("text/plain", null);
                })
                    .on("dragover", (event) => {
                });
            });
            this._main.queryAll(".x-menu .title").forEach((e) => {
                //e.draggable = false;
                db(e.innerHTML, "green");
                $(e).on("dragstart", (event) => {
                    //event.cancelBubble = true;
                    event.preventDefault();
                });
            });
            $(this.id)
                .on("dragstart", event => {
                item = event.target;
            })
                .on("dragend", function (event) {
            })
                .on("dragover", function (event) {
                event.preventDefault();
            })
                .on("drag", event => {
                //db ("drag")
            })
                .on("dragleave", event => { })
                .on("scroll", event => { })
                .on("drop", (event) => {
                let contType = ["closed", "open", ""];
                event.preventDefault();
                if (event.target.parentNode === item.parentNode) {
                    //db (88888)
                }
                else {
                    //db ("outtttt")
                }
                let item2 = item.cloneNode(true);
                let x = item.compareDocumentPosition(item2);
                db(x, "blue");
                if (event.target.className == "x-menu") {
                    $(event.target).append(item);
                }
                else if (event.target.className == "item") {
                    var rect = event.target.getBoundingClientRect();
                    var diff = event.clientY - rect.top;
                    if (diff > rect.height / 2) {
                        event.target.parentNode.insertBefore(item, event.target.nextSibling);
                    }
                    else {
                        event.target.parentNode.insertBefore(item, event.target);
                    }
                }
            });
            var ev = new Event("evalcss", { "bubbles": true, "cancelable": false });
            let d = this._main.create("button").attr("type", "button").on("evalcss", (event) => {
                event.target.innerHTML = 'que horror';
            });
            this._main.create("button").attr("type", "button").text("ok").on("click", (event) => {
                //var ev = new Event("evalcss", {"bubbles":true, "cancelable":false});
                d.get().dispatchEvent(ev);
            });
            return;
            let _items = [
                {
                    "caption": "_Guardar",
                    "action": "S.send({\r\n\tasync:false,\r\n\tpanel:4,\r\nconfirm_:\"hola\",\r\nvalid:false,\r\n\tparams:\r\n[{\r\nt:\"setMethod\",\r\nmethod:\"save\",\r\n_element:\"sgForm\",\r\n_name:\"test_1\"\r\n\r\n},\r\n\r\n{\r\nt:\"setMethod\",\r\nmethod:\"load\",\r\n_element:\"sgForm\",\r\n_name:\"test_1\",\r\neparams:{\r\nrecordId:1\r\n}\r\n\r\n}\r\n\t\r\n]\r\n});"
                },
                {
                    "caption": "New",
                    "action": "S.send({\r\n\tasync:false,\r\n\tpanel:4,\r\nconfirm_:\"hola\",\r\nvalid:false,\r\n\tparams:\r\n[{\r\nt:\"setMethod\",\r\nmethod:\"request\",\r\nelement:\"sgForm\",\r\nname:\"test_1\"\r\n\r\n}\r\n\t\r\n]\r\n});"
                },
                {
                    "caption": "Edit",
                    "action": "S.send({\r\n\tasync: false,\r\n\tpanel:4,\r\n\tvalid:false,\r\n\tconfirm_: 'seguro?',\r\n\tparams:\t[\r\n\t\t{t:'setMethod',\r\n\t\t\t\r\n\t\t\telement:'sgForm',\r\n\t\t\tmethod:'load',\r\n\t\t\t\r\n      eparams:{\r\n        recordId:0,\r\n      }\r\n\t\t}\r\n\r\n\t]\r\n});"
                },
                {
                    "caption": "List",
                    "action": "S.send({\r\n\tasync:false,\r\n\tpanel:4,\r\nconfirm_:\"hola\",\r\nvalid:false,\r\n\tparams:\r\n[{\r\nt:\"setMethod\",\r\nmethod:\"list\",\r\nelement:\"sgForm\",\r\nname:\"test_1\"\r\n\r\n}\r\n\t\r\n]\r\n});"
                },
                {
                    "caption": "Send",
                    "action": "S.send({\r\n\tasync: false,\r\n\tpanel:4,\r\n\tvalid:false,\r\n\tconfirm_: 'seguro?',\r\n\tparams:\t[]\r\n});"
                },
                {
                    "caption": "Save All",
                    "action": "S.send({\r\n\tasync: false,\r\n\tpanel:4,\r\n\tvalid:false,\r\n\tconfirm_: 'seguro?',\r\n\tparams:\t[{\r\n    t:'setMethod',\r\n    method:'save'\r\n\r\n  }]\r\n});",
                    "items": [
                        {
                            "caption": "uno"
                        },
                        {
                            "caption": "dos",
                            "items": [
                                {
                                    "caption": "a-uno"
                                },
                                {
                                    "caption": "a-dos"
                                },
                                {
                                    "caption": "a-tres"
                                }
                            ]
                        },
                        {
                            "caption": "tres"
                        }
                    ]
                },
                {
                    "caption": "Guardar 2",
                    "action": "S.send({\r\n\tasync:true,\r\n\tpanel:4,\r\nconfirm_:\"hola\",\r\nvalid:false,\r\n\tparams:\r\n[{\r\nt:\"setMethod\",\r\nmethod:\"save\",\r\n_element:\"sgForm\",\r\n_name:\"test_1\"\r\n\r\n}\r\n\r\n\r\n\t\r\n]\r\n});"
                }
            ];
            let main = $(this.id).create("div").addClass("x-menu");
            let caption = main.create("div").addClass("caption").text(this.menu.caption);
            let div = main.create("ul").addClass("menu");
            if (this.menu.items) {
                this.addItems(_items, div);
            }
            //let  y = new Menu(this.menu);
            console.log(this.menu);
        }
        addItems(items, menu) {
            items.reduce(createItems, menu);
        }
    }
    return MenuDesign;
})(_sgQuery);
// JavaScript Document
if (!Sevian) {
    var Sevian = {};
}
if (!Sevian.Input) {
    Sevian.Input = {};
}
var sgDesignMenu = false;
var m1;
(function (namespace, $) {
    var dragItem = false;
    var dragObj = false;
    var dragStart = function (main) {
        return function (event) {
            if (main.type === "item") {
                main.obj.addClass("drag-start");
                event.dataTransfer.setData("text", "");
                dragObj = main;
            }
        };
    };
    var dragEnd = function (main) {
        return function (event) {
            //opt.obj.removeClass("drag-start");
            if (main.type === "item") {
                main.obj.removeClass("drag-start");
            }
            dragObj = false;
        };
    };
    var dragOver = function (main) {
        return function (event) {
            if (main.obj.ds("dmModeItem") === "new" && dragObj && dragObj.type === "item") {
                return false;
            }
            if (dragObj && main.menuName !== dragObj.menuName) {
                return false;
            }
            event.preventDefault();
            if (dragObj && (dragObj.type === "item") && main.type === "item") {
                var hand = main.item.getHand();
                var rect = hand.get().getBoundingClientRect();
                var diff = event.clientY - rect.top;
                //opt.obj.addClass("ul_over");
                if ((diff) < this.offsetHeight / 2) {
                    hand.addClass("effect-up");
                    hand.removeClass("effect-down");
                }
                else {
                    hand.addClass("effect-down");
                    hand.removeClass("effect-up");
                }
            }
        };
    };
    var dragLeave = function (opt) {
        return function (event) {
            //this.style.border = "1px solid green" ;
            if (dragObj && dragObj.type == "item") {
                opt.hand.removeClass("effect-down");
                opt.hand.removeClass("effect-up");
                //opt.obj.removeClass("ul_over");
            }
        };
    };
    var dragEnter = function (opt) {
        return function (event) {
            event.preventDefault();
        };
    };
    var drop = function (main) {
        return function (event) {
            event.preventDefault();
            if (dragObj && main.menuName !== dragObj.menuName) {
                return false;
            }
            if (main.obj.ds("dmModeItem") === "new" && dragObj && dragObj.type === "item") {
                return false;
            }
            if (main.type === "submenu" && dragObj) {
                main.menu.append(dragObj.obj);
                if (main.ondrop) {
                    main.ondrop(dragObj);
                }
                main.obj.removeClass("ul_over");
                event.stopPropagation();
            }
            if (main.type === "submenu") {
                return false;
            }
            if (dragObj === false) {
                if (event.dataTransfer.getData("text") !== "") {
                    if ((event.dataTransfer.getData("text")).match(/\.(png|gif|svg|jpg)$/i)) {
                        main.item.getImage().attr("src", event.dataTransfer.getData("text"));
                    }
                    else {
                        main.item.getAction().attr("title", event.dataTransfer.getData("text"))
                            .ds("dmAction", event.dataTransfer.getData("text"))
                            .addClass("data-action");
                    }
                    if (main.ondrop) {
                        main.ondrop(dragObj);
                    }
                    return false;
                }
            }
            if (dragObj && dragObj.type === "item" && main.type === "item") {
                var hand = main.hand;
                var rect = hand.get().getBoundingClientRect();
                var diff = event.clientY - rect.top;
                var target = main.obj.get().parentNode;
                main.obj.removeClass("ul_over");
                if ((diff) < this.offsetHeight / 2) {
                    target.insertBefore(dragObj.obj.get(), main.obj.get());
                }
                else {
                    target.insertBefore(dragObj.obj.get(), main.obj.get().nextSibling);
                }
                main.hand.removeClass("effect-down");
                main.hand.removeClass("effect-up");
                if (main.ondrop) {
                    main.ondrop(dragObj);
                }
            }
        };
    };
    var _item = function (opt) {
        this.index = false;
        this.parent = false;
        this.caption = false;
        this.action = false;
        this.image = false;
        this.type = "item";
        this.mode = "normal";
        //this.index = false;
        this.target = false;
        this._target = false;
        this.oncheck = false;
        this.ondeleteimg = false;
        this.ondeleteaction = function () { };
        this.onchange = function () { };
        for (var x in opt) {
            if (opt[x] !== null) {
                this[x] = opt[x];
            }
        }
        if (this.target) {
            this._target = $(this.target);
        }
        this.create();
    };
    _item.prototype = {
        get: function () {
            return this._main;
        },
        create: function () {
            this._main = $.create("li").ds("dmIndex", this.index)
                .ds("dmTypeItem", this.type)
                .ds("dmModeItem", this.mode);
            this._option = this._main.create("span").addClass("item-option")
                .attr("draggable", true);
            this._option
                .on("dragstart", dragStart({
                type: this.type,
                obj: this._main,
                menuName: this.menuName,
            }))
                .on("dragend", dragEnd({
                type: this.type,
                obj: this._main,
                hand: this._option,
            }))
                .on("dragover", dragOver({
                type: this.type,
                obj: this._main,
                item: this,
                mode: this.mode,
                menuName: this.menuName,
            }))
                .on("dragleave", dragLeave({
                type: this.type,
                obj: this._main,
                item: this,
                hand: this._option,
            }))
                .on("dragenter", dragEnter({
                type: this.type,
                obj: this._main,
            }))
                .on("drop", drop({
                type: this.type,
                obj: this._main,
                menu: this._menu,
                hand: this._option,
                item: this,
                mode: this.mode,
                menuName: this.menuName,
                ondrop: $.bind(this.ondrop, this),
            }));
            this._main
                .on("dragover", function (event) {
                $(this).addClass("ul_over");
                event.stopPropagation();
            })
                .on("dragleave", function (event) {
                $(this).removeClass("ul_over");
            })
                .on("drop", function (event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).removeClass("ul_over");
            });
            this._check = this._option.create("input").prop({ "type": "radio", name: this.chkName, value: this.index })
                .on("change", this.oncheck({
                index: this.index,
                menuName: this.menuName,
                obj: this._main,
                menu: this._menu,
                hand: this._option,
                item: this,
            }));
            this._image = this._option.create("img").attr("src", this.image)
                .on("dblclick", this.ondeleteimg)
                .on("dragstart", dragStart({}));
            var option = this._option;
            this._text = this._option.create("input").attr("type", "text").value(this.caption)
                .on("change", this.onchange).on("dblclick", function () {
                this.select();
            })
                .on("mouseover", function () {
                $.unSelect();
                //this.setSelectionRange(this.value.length, this.value.length);
            });
            this._add = this._option.create("span").text("+").addClass("item-add").on("click", $.bind(this.onnew, this));
            this._remove = this._option.create("span").text("-").addClass("item-remove").on("click", $.bind(this.onremove, this));
            this._action = this._option.create("span").addClass("item-action").ds("dmAction", this.action).attr("title", this.action).text("")
                .on("dblclick", this.ondeleteaction);
            if (this.action) {
                this._action.addClass("data-action");
            }
            this._menu = this._main.create("ul").addClass("submenu");
            this._menu.on("drop", drop({
                type: 'submenu',
                hand: this._option,
                obj: this._main,
                menu: this._menu,
                menuName: this.menuName,
                ondrop: $.bind(this.ondrop, this), mode: this.mode
            }))
                .on("dragover", function (event) { event.preventDefault(); });
            if (this._target) {
                this._target.append(this._main);
            }
        },
        getMenu: function () {
            return this._menu;
        },
        getHand: function () {
            return this._option;
        },
        getImage: function () {
            return this._image;
        },
        getAction: function () {
            return this._action;
        },
        remove: function () {
            if (this.get().ds("dmModeItem") !== "new") {
                this.get().get().parentNode.removeChild(this.get().get());
            }
        },
        addOption: function (opt) {
            var btn = false;
            if (this._option) {
                btn = this._option.create(opt.tagName || "span").text(opt.text || "").addClass(opt.className || false);
                for (var x in opt.events) {
                    if (opt.events.hasOwnProperty(x)) {
                        btn.on(x, $.bind(opt.events[x], this));
                    }
                }
            }
        }
    };
    var DesignMenu = function (opt) {
        this.target = false;
        this.main = false;
        this.type = "";
        this.id = "";
        this.name = "";
        this.className = false;
        this.title = "";
        this.value = "";
        this.default = false;
        this.data = [];
        this.parent = false;
        this.propertys = {};
        this.style = {};
        this.events = {};
        this.rules = {};
        this.oncheck = function (opt) {
            return function () {
                db(opt.index);
            };
        };
        this.modeInit = 1;
        this.placeholder = false;
        this.status = "normal";
        this.mode = "request";
        this._menu = false;
        this.length = 0;
        for (var x in opt) {
            if (opt.hasOwnProperty(x)) {
                this[x] = opt[x];
            }
        }
        this.input = false;
        this._item = [];
        this._target = $(this.target);
        this.create();
    };
    DesignMenu.prototype = {
        create: function () {
            var ME = this;
            this.length = 0;
            this._item = [];
            if (!this._main) {
                this._main = $.create("div");
            }
            this._main.addClass("design-menu").addClass(this.className);
            this._input = this._main.create("input").attr("type", "hidden").attr("name", this.name);
            if (this.target) {
                this._target = $("#" + this.target);
                this._target.append(this._main);
            }
            var opt = {
                target: this._main.create("ul"),
                caption: this.caption,
                chkName: this.name + "_chk",
                type: "caption",
                mode: "caption",
                menuName: this.name,
                oncheck: this.oncheck,
                ondrop: function (dragObject) {
                    if (dragObject && dragObject.obj.ds("dmModeItem") === "new") {
                        dragObject.obj.ds("dmModeItem", "normal");
                        ME.addNewItem();
                    }
                    if (dragObject) {
                        dragObject.obj.addClass("drop-end");
                    }
                    ME.getCode();
                },
                onnew: function () {
                    if (this.get().ds("dmModeItem") !== "new") {
                        ME._newItem.get().ds("dmModeItem", "normal");
                        ME._newItem.get().addClass("drop-end");
                        this._menu.append(ME._newItem.get());
                        ME.addNewItem();
                    }
                    ME.getCode();
                },
                onremove: function () {
                    //this.remove();
                },
                ondeleteimg: function () {
                    this.src = "";
                    ME.getCode();
                },
                onchange: function () {
                    ME.getCode();
                },
            };
            this.item = new _item(opt);
            this.item.addOption({
                text: "R",
                events: {
                    click: function () {
                        ME.reset();
                    }
                }
            });
            this._menu = this.item._menu;
            this.loadItems(this.data);
            this._main.create("div").addClass("delete-zone").text("DELETE")
                .on("dragover", function (event) {
                if (dragObj && dragObj.obj.ds("dmModeItem") !== "new" && dragObj.type === "item") {
                    event.preventDefault();
                }
                return false;
            })
                .on("drop", function (event) {
                event.preventDefault();
                if (dragObj && dragObj.obj.ds("dmModeItem") !== "new" && dragObj.type === "item") {
                    dragObj.obj.get().parentNode.removeChild(dragObj.obj.get());
                    ME.getCode();
                }
            });
        },
        loadItems: function (data) {
            this.length = 0;
            this._item = [];
            this._menu.text("");
            for (var x in data) {
                this.add(data[x]);
            }
            if (!this.newUL) {
                this.newUL = this._main.create("ul").addClass("new-item");
            }
            else {
                this._newItem.get().get().parentNode.removeChild(this._newItem.get().get());
            }
            this.addNewItem();
            this.getCode();
        },
        addNewItem: function () {
            this._newItem = this.add({ target: this.newUL, mode: "new", caption: "New Item " + (this.length + 1), index: this.length });
        },
        add: function (opt) {
            var main = false;
            if (opt.target) {
                main = opt.target;
            }
            else if (opt.parent !== false && opt.parent !== undefined) {
                main = this._item[opt.parent].getMenu();
            }
            else {
                main = this._menu;
            }
            var ME = this;
            //db(opt.caption+"....", "green")
            this._item[opt.index] = new _item({
                target: main,
                index: (opt.index === false || opt.index === undefined) ? this.length : opt.index,
                parent: opt.parent,
                id: this.name + "_i" + opt.index,
                caption: opt.caption,
                chkName: this.name + "_chk",
                menuName: this.name,
                menu: this,
                action: opt.action || "",
                image: opt.image || "",
                type: opt.type || null,
                mode: opt.mode || null,
                oncheck: this.oncheck,
                ondrop: function (dragObject) {
                    if (dragObject && dragObject.obj.ds("dmModeItem") === "new") {
                        dragObject.obj.ds("dmModeItem", "normal");
                        ME.addNewItem();
                    }
                    if (dragObject) {
                        dragObject.obj.addClass("drop-end");
                    }
                    ME.getCode();
                },
                onnew: function (event) {
                    if (this.get().ds("dmModeItem") != "new") {
                        ME._newItem.get().ds("dmModeItem", "normal");
                        ME._newItem.get().addClass("drop-end");
                        this._menu.append(ME._newItem.get());
                        ME.addNewItem();
                    }
                    ME.getCode();
                },
                onremove: function (event) {
                    this.remove();
                    ME.getCode();
                },
                ondeleteimg: function () {
                    this.src = "";
                    ME.getCode();
                },
                ondeleteaction: function () {
                    $(this).ds("dmAction", "").removeClass("data-action");
                    ME.getCode();
                },
                onchange: function () {
                    ME.getCode();
                },
            });
            this.length++;
            return this._item[opt.index];
        },
        getItems: function (node) {
            var childs = node.queryAll("li");
            var n = childs.length;
            var a = [], item = false, _index = false, _parent = false;
            this.recount = false;
            for (var i = 0; i < n; i++) {
                if (this.recount) {
                    $(childs[i]).ds("dmNewIndex", i);
                    _parent = $(childs[i].parentNode.parentNode).ds("dmNewIndex");
                    if (_parent === undefined) {
                        _parent = false;
                    }
                    item = {
                        index: $(childs[i]).ds("dmNewIndex"),
                        parent: _parent,
                        caption: $(childs[i]).query("input[type='text']").value,
                        image: $(childs[i]).query("img").getAttribute("src"),
                        action: $(childs[i]).query(".item-action").dataset.dmAction,
                    };
                }
                else {
                    item = {
                        index: $(childs[i]).ds("dmIndex"),
                        parent: $(childs[i].parentNode.parentNode).ds("dmIndex") || false,
                        caption: $(childs[i]).query("input[type='text']").value,
                        image: $(childs[i]).query("img").getAttribute("src"),
                        action: $(childs[i]).query(".item-action").dataset.dmAction,
                    };
                }
                a.push(item);
            }
            //this._input.value(JSON.stringify(a));
            return a;
        },
        reset: function () {
            this.loadItems(this.data);
        },
        getCode: function () {
            var request = {
                caption: this.item.get().query("input[type='text']").value,
                image: this.item.get().query("img").getAttribute("src"),
                items: this.getItems(this._menu),
            };
            this._input.value(JSON.stringify(request));
        },
        setValue: function (value) {
            this._main.get().value = value;
        },
        getValue: function () {
            return this._main.get().value;
        },
        addClass: function (className) {
            if (className) {
                this._main.addClass(className);
            }
        },
        setClass: function (value) {
        },
        getClass: function () {
        },
        on: function (event, fn) {
            if (typeof (fn) === "function") {
                this._main.on(event, fn.bind(this));
            }
            else if (typeof (fn) === "string") {
                this._main.on(event, Function(fn).bind(this));
            }
        },
        off: function (event, fn) {
        },
        getText: function () {
            if (this.type === "select") {
                return this._main.get().options[this._main.get().selectedIndex].text;
            }
            return this._main.get().value;
        },
        readOnly: function (value) {
        },
        disabled: function (value) {
        },
        setStatus: function (value) {
            this.status = value;
            this._main.ds("status", value);
        },
        setMode: function (value) {
            this.mode = value;
            this._main.ds("mode", value);
        },
        show: function (value) {
        },
        focus: function () {
            this._main.get().focus();
        },
        selectText: function () {
            if (this._main.get().select) {
                this._main.get().select();
            }
        },
        getSelectedItem: function () {
            var s = this._main.query("input[type='radio']:checked");
            db(s.value);
        },
        setData: function (data) {
        },
        resetUNO: function () {
            if (this.default !== false) {
                this.setValue(this.default);
            }
        },
        valid: function () {
            var result = valid.valid(this.rules, this.getValue(), this.title);
            if (result) {
                this.focus();
                this.setStatus("invalid");
                return false;
            }
            else {
                this.setStatus("valid");
            }
            return true;
        },
    };
    Sevian.Input.DesignMenu = DesignMenu;
    sgDesignMenu = DesignMenu;
}(Sevian.Input, _sgQuery));
function loadMenu() {
    var $ = _sgQuery;
    var data = [
        { index: 0, parent: false, caption: "cero", action: false },
        { index: 1, parent: false, caption: "uno", action: false },
        { index: 2, parent: false, caption: "dos", action: false },
        { index: 3, parent: false, caption: "tres", action: false },
        { index: 4, parent: 0, caption: "cuatro", action: false },
        { index: 5, parent: false, caption: "cinco", action: false },
        { index: 6, parent: false, caption: "seis", action: false },
        { index: 7, parent: false, caption: "siete", action: false },
        { index: 8, parent: 5, caption: "ocho", action: false },
        { index: 9, parent: 5, caption: "nueve", action: false },
        { index: 10, parent: 5, caption: "diez", action: false },
        { index: 11, parent: 9, caption: "once", action: false },
        { index: 12, parent: 9, caption: "doce", action: false },
        { index: 13, parent: 9, caption: "trece", action: false },
        { index: 14, parent: false, caption: "catorce", action: false },
        { index: 15, parent: false, caption: "quince", action: false },
    ];
    var data = [
        { index: 0, parent: false, caption: "cero", action: "Yanny", image: "http://localhost/sevian2020/images/Admin.png" },
        { index: 1, parent: false, caption: "uno", action: "Esteban" },
        { index: 2, parent: false, caption: "dos", action: false },
        { index: 3, parent: false, caption: "tres", action: false },
        { index: 4, parent: false, caption: "cuatro", action: false },
        { index: 5, parent: false, caption: "cinco", action: false },
        { index: 6, parent: false, caption: "seis", action: false },
        { index: 7, parent: false, caption: "siete", action: false },
        { index: 8, parent: false, caption: "ocho", action: false },
        { index: 9, parent: false, caption: "nueve", action: false },
        { index: 10, parent: false, caption: "diez", action: false },
        { index: 11, parent: 1, caption: "once", action: false },
        { index: 12, parent: 1, caption: "doce", action: false },
        { index: 13, parent: 11, caption: "trece", action: false },
        { index: 14, parent: 11, caption: "catorce", action: false },
        { index: 15, parent: 1, caption: "quince", action: "Nuñez" },
    ];
    //data = [];
    m1 = new Sevian.Input.DesignMenu({
        name: "menu_1",
        caption: "Menú Principal",
        data: data,
        target: "design",
    });
    return;
    data = [];
    new Sevian.Input.DesignMenu({
        name: "menu_2",
        caption: "Menú Secundario",
        data: data,
        target: "#design2",
    });
    //alert($("#design").text());
}
_sgQuery(window).on("load", function () {
    //loadMenu()
});
