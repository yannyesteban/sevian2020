//import { Query as $} from './Query.js';
import { _sgQuery as $ } from './Query.js';
import { I, Input } from './Input.js';
import { Menu } from './Menu2.js';
import { Valid } from './Valid.js';
class Field {
    constructor() {
        this.caption = "";
        this.input = "input";
        this.config = {};
        this.className = "";
        this._main = null;
        this._input = null;
        this._label = null;
        let field = this._page.create("div").addClass("field");
        field.create("label").addClass("label").prop("htmlFor", info.id).text(info.caption);
        field.create("div").addClass("input").append(this.createInput(info).get());
        return field;
    }
    _create(main) {
        main.addClass("field");
        main.create("label").addClass("label").prop("htmlFor", config.id).text(config.caption);
        main.create("div").addClass("input").append(this.createInput(info).get());
    }
}
export class Form2 {
    constructor(info) {
        this.target = "";
        this.name = "";
        this.id = null;
        this.value = "";
        this.caption = "";
        this.type = "dropdown";
        this.className = "";
        this.iconClass = "";
        this.fields = null;
        this.pages = [];
        this.menu = null;
        this.child = null;
        this.open = false;
        //text:string = "";
        this.elements = [];
        this._main = null;
        this._page = null;
        this._pg = [];
        this._tab = null;
        this._inputs = {};
        this.parentContext = null;
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = (this.id) ? $(this.id) : false;
        if (main) {
            if (main.ds("sgForm")) {
                main.removeClass("sg-form");
                //return;
            }
            main.text("");
            if (main.hasClass("sg-form")) {
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
        main.ds("sgForm", "form").addClass(`form-${this.type}`);
        if (this.child) {
            this.add(this.child);
        }
        if (this.type === "dropdown") {
            let children = this._main.get().children;
            for (let x of children) {
                if ($(x).hasClass("caption")) {
                    $(x).on("click", () => {
                        this.toggle();
                    });
                }
            }
        }
        main.addClass(this.open ? "open" : "close");
        let target = (this.target) ? $(this.target) : false;
        if (target) {
            target.append(this._main);
        }
    }
    static init() {
        let pages = $().queryAll(".sg-form.sg-detect");
        for (let x of pages) {
            if ($(x).ds("sgForm")) {
                continue;
            }
            if (x.id) {
                Form.create(x.id, { id: x });
            }
            else {
                new Form({ id: x });
            }
        }
    }
    static create(name, info) {
        Form._objs[name] = new Page(info);
        return Form._objs[name];
    }
    static get(name) {
        return Form._objs[name];
    }
    _create(main) {
        this._main = main.addClass("sg-form").addClass(this.className);
        main.create({ tagName: "div", className: "caption" })
            .add({ tagName: "span", className: "icon" + this.iconClass })
            .add({ tagName: "span", className: "text", innerHTML: this.caption })
            .add({ tagName: "span", className: "arrow" });
        let page = this._page = main.create({ tagName: "div", className: "page" });
        /*
        if(this.text){
            page.text(this.text);
        }
        */
        if (this.pages) {
            this.addPages(this._page, this.pages);
        }
        if (this.fields) {
            this.addFields(this.fields);
        }
        if (this.elements) {
            //this._addElements(page, this.elements);
        }
        if (this.menu) {
            main.append(this.createMenu(this.menu));
        }
    }
    _load(main) {
        this._main = main.addClass("sg-page");
    }
    addField(field) {
        if (field.page && this._pg[field.page]) {
            this._page = this._pg[field.page];
        }
        this.createField(field);
    }
    addFields(fields) {
        for (let x in fields) {
            fields[x].context = this.getContext();
            this.addField(fields[x]);
        }
        return;
        for (let field of fields) {
            this.addField(field);
        }
    }
    addPages(body, pages) {
        for (let page of pages) {
            switch (page.type) {
                case "page":
                    let ele = new Page(page.config);
                    this._pg[page.name] = ele.getPage();
                    //body.append(this._pg[page.name].get());
                    body.append(ele.get());
                    break;
                case "tab":
                    this._tab = new Tab(page.config);
                    body.append(this._tab.get());
                    this._pg[page.name] = false;
                    break;
                case "tab_page":
                    this._pg[page.name] = this._tab.add(page.config);
                    this._tab.setValue(0);
                    break;
                case "tag":
                    let _page = this._pg[page.name] = $.create(page.config.tagName).addClass(["page", "container"]);
                    body.append(_page.get());
                    break;
            }
            if (page.pages) {
                this.addPages(this._pg[page.name], page.pages);
            }
        }
    }
    _addElements(page, elements) {
        for (let x in elements) {
            let info = elements[x];
            switch (info.set) {
                case "input":
                    let input = new Input(info);
                    page.append(input.get());
                    break;
                case "field":
                    page.append(this.createField(info));
                    break;
                case "page":
                    page.append(this.createPage(info));
                    break;
                case "tab":
                    page.append(this.createTab(info));
                    break;
                case "menu":
                    page.append(this.createMenu(info));
                    break;
                case "tag":
                    page.append(this.createTag(info));
                    break;
            }
        }
    }
    createTag(info) {
        let _page = $.create(info.tagName).addClass(["page", "container"]);
        if (info.elements) {
            this._addElements(_page, info.elements);
        }
        return _page;
    }
    createMenu(info) {
        info.context = this.getContext();
        let _menu = new Menu(info);
        return $(_menu.get());
    }
    createPage(info) {
        return new Page(info);
        let _page = new Page(info);
        if (info.elements) {
            this._addElements(_page.getPage(), info.elements);
        }
        return $(_page.get());
    }
    createTab(info) {
        let _tab = new Tab(info);
        if (info.elements) {
            for (let _info of info.elements) {
                let page = _tab.add(_info);
                if (_info.elements) {
                    this._addElements(page, _info.elements);
                }
            }
            _tab.setValue(0);
        }
        return $(_tab.get());
    }
    createInput(info) {
        this._inputs[info.name] = I.create(info.input, info);
        return this._inputs[info.name];
    }
    createField(input, info) {
        info = input;
        if (input.type === "hidden") {
            input.input = "input";
            //info.type = "hidden";
            input.type = "hidden";
            this._inputs[info.name] = I.create(input.input, input);
            this._main.append(this._inputs[input.name]);
            return false;
        }
        let field = this._page.create("div").addClass("field");
        let ind = "";
        if (info.rules && info.rules.required) {
            ind = "<span class='ind'>*</span>";
        }
        if (info.parent) {
            info.getParentValue = () => {
                return this.getInput(info.parent).getValue();
            };
        }
        if (info.childs) {
            info.evalChilds = (event) => {
                this.evalChilds(info.name);
            };
        }
        if (!input.input) {
            return;
        }
        this._inputs[info.name] = I.create(input.input, info);
        field.create("label").addClass("label").prop("htmlFor", info.id).text(info.caption + ind);
        field.create("div").addClass("input").append(this._inputs[info.name]);
        return field;
    }
    get() {
        return this._main;
    }
    delete() {
        this._main.removeDs("sgForm");
        this._main.removeClass("sg-form");
        this._main.text("");
    }
    add(child) {
        let children = this._main.get().children;
        for (let x of children) {
            if ($(x).hasClass("page")) {
                if (typeof (child) === "string") {
                    $(x).text(child);
                }
                else {
                    $(x).append(child);
                }
                break;
            }
        }
    }
    toggle() {
        if (this._main.hasClass("close")) {
            this.show(true);
        }
        else {
            this.show(false);
        }
    }
    show(value) {
        let children = this._main.get().children;
        for (let x of children) {
            if (value === true) {
                this._main.removeClass("close").addClass("open");
            }
            else {
                this._main.removeClass("open").addClass("close");
            }
        }
    }
    getInput(name) {
        return this._inputs[name];
    }
    getInputs() {
        let inputs = {};
        let elem = null, e = null;
        let elems = this._main.queryAll("[data-sg-input][data-sg-name]");
        for (e of elems) {
            elem = $(e);
            inputs[elem.ds("sgName")] = I.create(elem.ds("sgInput"), {
                id: elem,
                name: elem.ds("sgName"),
                type: elem.ds("sgInput")
            });
        }
        return inputs;
    }
    setValue(data) {
        for (let x in data) {
            if (this._inputs[x]) {
                this._inputs[x].setValue(data[x]);
            }
        }
        return this;
    }
    reset() {
        for (let name in this._inputs) {
            this._inputs[name].reset();
        }
        return this;
    }
    getValue(input) {
        if (input) {
            return this._inputs[input].getValue();
        }
        let data = {};
        for (let name in this._inputs) {
            data[name] = this._inputs[name].getValue();
        }
        return data;
        /*
        let inputs = this.getInputs();
        let data = [];
        let name = null;

        for(name in inputs){
            data[name] = inputs[name].getValue();
        }

        return data;
        */
    }
    getFormData() {
        let formData = new FormData();
        for (let name in this._inputs) {
            formData.append(name, this._inputs[name].getValue());
        }
        return formData;
    }
    evalChilds(parent) {
        let input = this._inputs[parent];
        for (let i in this._inputs) {
            if (this._inputs[i].parent === parent) {
                this._inputs[i].createOptions(input.getValue(), i);
                if (this._inputs[i].hasChilds()) {
                    this.evalChilds(i);
                }
            }
        }
        return;
        let inputx = null, e = null, elem = null, value = null;
        e = this._main.query(`[data-sg-name='${parent}']`);
        elem = $(e);
        input = I.create(elem.ds("sgInput"), { id: elem, parent: parent });
        value = input.getValue();
        let elems = this._main.queryAll(`[data-sg-input][data-parent='${parent}']`);
        for (e of elems) {
            elem = $(e);
            input = I.create(elem.ds("sgInput"), { id: elem, parent: parent });
            input.createOptions(value);
            if (input.hasChilds()) {
                this.evalChilds(input.getName());
            }
        }
    }
    valid() {
        let data = this.getValue();
        let rules = null, config = null;
        let inputs = this._inputs;
        let msg = null;
        for (let x in this.fields) {
            //config = this.fields[x].config;
            //rules = config.rules;
            rules = this.fields[x].rules;
            if (rules) {
                /*msg = Sevian.Valid.send(rules, inputs[config.name].getValue(), config.caption, data);
                if(msg){
                    alert(msg);
                    inputs[config.name].focus();
                    inputs[config.name].select();
                    return false;
                }*/
                msg = Valid.send(rules, inputs[this.fields[x].name].getValue(), this.fields[x].caption, data);
                if (msg) {
                    alert(msg);
                    inputs[this.fields[x].name].focus();
                    inputs[this.fields[x].name].select();
                    return false;
                }
            }
        }
        return true;
    }
    setContext(context) {
        this.parentContext = context;
        return this;
    }
    getContext() {
        if (this.parentContext) {
            return this.parentContext;
        }
        return this;
    }
    setMode(value) {
        this._main.addClass("mode-" + value);
        return this;
    }
}
Form2._objs = [];
//# sourceMappingURL=Form2.js.map