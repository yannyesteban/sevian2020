var Grid = (($) => {
    class Form {
        constructor() {
            this._inputs = [];
        }
        createInput(input, info) {
            if (info.parent) {
                info.getParentValue = () => {
                    return this.getInput(info.parent).getValue();
                };
            }
            if (info.childs) {
                info.evalChilds = () => {
                    this.evalChilds(info.name);
                };
            }
            this._inputs[info.name] = I.create(input, info);
            return this._inputs[info.name];
        }
        getValue() {
            let data = {};
            for (let name in this._inputs) {
                if (!this._inputs[name].dataName) {
                    data[name] = this._inputs[name].getValue();
                }
                else {
                    data[this._inputs[name].dataName] = this._inputs[name].getValue();
                }
            }
            return data;
        }
        setValue(data) {
            for (let name in this._inputs) {
                if (this._inputs[name].parent) {
                    // this._inputs[name].createOptions(this._inputs[this._inputs[name].parent].getValue());
                }
                if (!this._inputs[name].dataName) {
                    this._inputs[name].setValue(data[name]);
                }
                else {
                    this._inputs[name].setValue(data[this._inputs[name].dataName]);
                }
            }
            return this;
        }
        reset() {
            for (let name in this._inputs) {
                this._inputs[name].reset();
            }
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
        }
        getInput(name) {
            return this._inputs[name];
        }
        getInputs() {
            return this._inputs;
        }
        valid() {
            let data = this.getValue();
            let rules = null, config = null;
            let inputs = this._inputs;
            let msg = null;
            for (let name in this._inputs) {
                let input = this._inputs[name];
                config = input.config;
                rules = input.rules;
                if (rules) {
                    msg = Sevian.Valid.send(rules, input.getValue(), input.caption, data);
                    if (msg) {
                        alert(msg);
                        input.focus();
                        input.select();
                        return false;
                    }
                }
            }
            return true;
        }
    }
    class InfoField {
        constructor() {
            this.name = "";
            this.id = "";
            this.input = {};
        }
    }
    class Paginator {
        constructor(info) {
            this.classType = "paginator";
            this.totalPages = 80;
            this.maxPages = 8;
            this.page = 2;
            this.className = "";
            this.symbols = ["|&laquo;", "&laquo;", "&raquo;", "&raquo;|"];
            this.change = (page) => { };
            this._firstPage = 1;
            this._main = null;
            this._change = (page) => { };
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this._main = $.create("span").addClass("sg-paginator");
            this._create(this._main);
            if (this.change) {
                this._change = $.bind(this.change, this, "page");
            }
        }
        get() {
            return this._main.get();
        }
        _create(main) {
            let ini = this.maxPages * Math.floor((this.page - 1) / this.maxPages) + 1;
            let end = ini + this.maxPages - 1;
            main.create("a").prop("href", "javascript:void(0)").text(this.symbols[0]).addClass("page").on("click", () => this.setPage("b"));
            main.create("a").prop("href", "javascript:void(0)").text(this.symbols[1]).addClass("page").on("click", () => this.setPage("p"));
            let cell = null;
            for (let i = ini; i <= end; i++) {
                cell = main.create("a").prop("href", "javascript:void(0)").addClass("page");
                if (i > this.totalPages) {
                    cell.text("&nbsp").addClass("hidden").ds("number", 0);
                }
                else {
                    cell.text(i).ds("number", i);
                }
                if (this.page == i) {
                    cell.addClass("active");
                }
                cell.on("click", () => this.setPage(event.currentTarget.dataset.number));
            }
            main.create("a").prop("href", "javascript:void(0)").addClass("page").text(this.symbols[2]).on("click", () => this.setPage("n"));
            main.create("a").prop("href", "javascript:void(0)").addClass("page").text(this.symbols[3]).on("click", () => this.setPage("e"));
            if (this.totalPages > this.maxPages) {
                let selectPage = main.create("select").on("onchange", (event) => this.setPage(event.currentTarget.value));
                ;
                let option = null;
                for (let i = 1; i <= this.totalPages; i = i + this.maxPages) {
                    option = $.create("option").get();
                    option.text = i;
                    option.value = i;
                    if (i >= ini && i <= end) {
                        option.selected = true;
                    }
                    else {
                        option.selected = false;
                    }
                    selectPage.get().options.add(option);
                }
            }
        }
        updatePages() {
            let cells = this._main.queryAll("[data-number]");
            let page = this.maxPages * Math.floor((this.page - 1) / this.maxPages) + 1;
            for (let cell of cells) {
                $(cell).removeClass(["active", "hidden"]);
                if (this.page == page) {
                    $(cell).addClass("active");
                }
                if (page < 1 || page > this.totalPages) {
                    $(cell).text("&nbsp").addClass("hidden").ds("number", 0);
                }
                else {
                    $(cell).text(page).ds("number", page);
                }
                page++;
            }
            if (this.totalPages > this.maxPages) {
                this._main.query("select").value = (Math.ceil(this.page / this.maxPages) - 1) * this.maxPages + 1;
            }
        }
        setPage(page) {
            if (page == this.page || page == 0) {
                return false;
            }
            switch (page) {
                case "b":
                    this.page = 1;
                    break;
                case "e":
                    this.page = this.totalPages;
                    break;
                case "p":
                    this.page--;
                    break;
                case "n":
                    this.page++;
                    break;
                default:
                    this.page = page;
            }
            if (this.page < 1) {
                this.page = 1;
            }
            if (this.page > this.totalPages) {
                this.page = this.totalPages;
            }
            this.updatePages();
            this._change(this.page);
        }
    }
    class Grid {
        constructor(opt) {
            this.target = "";
            this.name = "";
            this.id = "";
            this.value = "";
            this.caption = "";
            this.className = "sevian";
            this.iconClass = "";
            this.type = "default"; //"select-one,view,select-one,select-multiple,edit-one,edit-all,edit-form";
            this.ctrlSelect = "one"; //one,multiple,
            this.editMode = "none"; //grid,one,inline,form,custom
            this.searchValue = '';
            this.showEnum = true;
            this.allowSearch = true;
            this.option = [];
            this.data = [];
            this.menu = null;
            this.actionButtons = ["edit", "delete"];
            this.paginator = {
                page: 1,
                totalPages: 20,
                maxPage: 5,
                change: (page) => { }
            };
            this.searchControl = {
                type: "default,forfields",
            };
            this.fields = [];
            this._main = null;
            this._mainForm = null;
            this._table = null;
            this._thead = null;
            this._tbody = null;
            this._tfoot = null;
            this._forms = [];
            this._rowLength = 0;
            this._data_grid = null;
            this._check = null;
            this.pag = null;
            this._select = (index) => { return true; };
            this._new = (index) => { return true; };
            this._edit = (index) => { return true; };
            this._delete = (index) => { return true; };
            this._search = (index) => { return true; };
            this._filter = (index) => { return true; };
            this._short = (index) => { return true; };
            this._changePage = (page) => { return true; };
            this._fieldData = {};
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sgGrid")) {
                    return;
                }
                if (main.hasClass("sg-grid")) {
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
            if (opt.search) {
                this._search = $.bind(opt.search, this, "q");
            }
            main.ds("sgGrid", "grid").addClass(`grid-${this.type}`);
        }
        static init() {
            let grids = $().queryAll(".sg-grid.sg-detect");
            for (let x of grids) {
                if ($(x).ds("sgGrid")) {
                    continue;
                }
                if (x.id) {
                    this.create(x.id, { id: x });
                }
                else {
                    new Grid({ id: x });
                }
            }
        }
        static create(name, info) {
            this._objs[name] = new Page(info);
            return this._objs[name];
        }
        static get(name) {
            return this._objs[name];
        }
        _create(main) {
            let data = [];
            for (let x in this.fields) {
                if (data = this.fields[x].config.data) {
                    this._fieldData[x] = {};
                    for (let _data of data) {
                        this._fieldData[x][_data[0]] = _data[1];
                    }
                }
            }
            this._main = main.addClass("sg-grid").addClass(this.className);
            main.create({ tagName: "div", className: "caption" })
                .add({ tagName: "span", className: "icon" + this.iconClass })
                .add({ tagName: "span", className: "text", innerHTML: this.caption })
                .add({ tagName: "span", className: "arrow" });
            let _search = main.create("div").addClass("grid-search");
            let q = _search.create("input").attr("type", "search").attr("name", "q").attr("placeholder", "search")
                .addClass("search").val(this.searchValue)
                .on("keyup", (event) => {
                // Number 13 is the "Enter" key on the keyboard
                if (event.keyCode === 13) {
                    // Cancel the default action, if needed
                    event.preventDefault();
                    // Trigger the button element with a click
                    this._search(q.val());
                }
            });
            ;
            _search.create("input").attr("type", "button").val("go").addClass("btn-search")
                .on("click", (event) => { this._search(q.val()); });
            ;
            if (this.ctrlSelect === "one" || this.ctrlSelect === "multiple") {
                let _auxMenu = main.create("div").addClass("grid-aux-menu");
                _auxMenu.create("button").attr("type", "button").text("+").on("click", () => { this.setNew(); });
                _auxMenu.create("button").attr("type", "button").text("&#215;").on("click", () => { this.insert(); });
                _auxMenu.create("button").attr("type", "button").text("s").on("click", () => { this.save(); });
            }
            let body = main.create("div").addClass("body");
            let table = this._table = body.create("table").addClass("grid-table");
            this._thead = table.create("thead");
            this._tbody = table.create("tbody");
            let row = this._thead.create("tr");
            if (true) {
                row.create("td").text("#");
            }
            if (this.ctrlSelect == "one" || this.ctrlSelect == "multiple") {
                let cell = row.create("td");
                this._check = cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect == "one") ? "radio" : "checkbox",
                    name: this.id + "_chk",
                    checked: (this.ctrlSelect == "one") ? true : false,
                }).on("change", () => { this.setNew(); });
            }
            for (let x in this.fields) {
                if (this.fields[x].input == "hidden") {
                    continue;
                }
                row.create("td").text(this.fields[x].config.caption);
            }
            this._rowLength = 0;
            for (let record of this.data) {
                this.createRow(record);
            }
            this.createEditRow({});
            let hiddenDiv = body.create("div");
            this._data_grid = hiddenDiv.create({ tagName: "textarea", name: "__data_grid" });
            let pag = this.paginator;
            pag.change = $.bind(pag.change, this, "page");
            this._main.append(this.pag = new Paginator(pag));
            if (this.menu) {
                this._main.append(this.createMenu(this.menu));
            }
        }
        _load(main) {
            this._main = main.addClass("sg-grid");
        }
        createRow(data) {
            let row = this._tbody.create("tr")
                .addClass("body-row")
                .ds("index", this._rowLength);
            let cell = null, field = null, value = null, text = "", info = null, input = null, _input = null;
            if (this.showEnum) {
                cell = row.create("td").text(this._rowLength + 1);
            }
            if (this.ctrlSelect === "one" || this.ctrlSelect === "multiple") {
                cell = row.create("td");
                let ctrl = cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect === "one") ? "radio" : "checkbox",
                    name: this.id + "_chk",
                    value: this._rowLength,
                });
                ctrl.on("click", event => {
                    this.getRecord(event.currentTarget.value);
                });
            }
            let hiddenFields = $.create({ tagName: "div", style: { cssText: "display:none;" } });
            let f = this._forms[this._rowLength] = new Form;
            for (let x in this.fields) {
                field = this.fields[x];
                value = data[x];
                if (this._fieldData[x] && this._fieldData[x][value]) {
                    text = this._fieldData[x][value];
                }
                else {
                    text = value;
                }
                input = (field.input === "hidden" || this.type === "default") ? "input" : field.input;
                info = Object.assign({}, field.config);
                info.type = field.config.type;
                info.name = field.config.name + "_" + this._rowLength;
                info.value = value;
                if (field.config.parent) {
                    info.parent = field.config.parent + "_" + this._rowLength;
                    info.parentValue = f.getInput(info.parent).getValue();
                }
                info.dataset = { "name": x };
                _input = f.createInput(field.input, info);
                _input.dataName = x;
                if (field.input == "hidden") {
                    hiddenFields.append(_input);
                }
                else {
                    cell = row.create("td").ds("name", x);
                    cell.append(f.getInput(info.name));
                }
            }
            if (cell) {
                hiddenFields.append(f.createInput("input", { type: "hidden", name: "__index_" + "_" + this._rowLength, value: this._rowLength, dataset: { name: "__index_" } }));
                cell.append(hiddenFields);
            }
            this._rowLength++;
        }
        createRowORG(data) {
            this._rowLength++;
            let row = this._tbody.create("tr")
                .addClass("body-row")
                .ds("index", this._rowLength);
            let cell = null, field = null, value = null, text = "", info = null, input = null, _input = null;
            if (this.showEnum) {
                cell = row.create("td").text(this._rowLength);
            }
            if (this.ctrlSelect === "one" || this.ctrlSelect === "multiple") {
                cell = row.create("td");
                let ctrl = cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect === "one") ? "radio" : "checkbox",
                    name: this.id + "_chk"
                });
                ctrl.on("click", (event) => {
                    this.getRecord((event.currentTarget.parentNode.parentNode));
                });
            }
            let hiddenFields = $.create({ tagName: "div", style: { cssText: "display:none;" } });
            for (let x in this.fields) {
                field = this.fields[x];
                value = data[x];
                if (this._fieldData[x] && this._fieldData[x][value]) {
                    text = this._fieldData[x][value];
                }
                else {
                    text = value;
                }
                input = (field.input === "hidden" || this.type === "default") ? "input" : field.input;
                info = Object.assign({}, field.config);
                info.type = (field.input === "hidden" || this.type === "default") ? "hidden" : field.config.type;
                info.name = field.config.name + "_" + this._rowLength;
                info.value = value;
                info.dataset = { "name": x };
                _input = I.create("input", info);
                if (field.input == "hidden") {
                    hiddenFields.append(_input);
                }
                else {
                    cell = row.create("td").ds("name", x);
                    cell.append(_input);
                    cell.create("div").addClass("zone-edit");
                    if (this.type === "default") {
                        cell.create("span").addClass("text").text(text);
                    }
                }
            }
            if (cell) {
                hiddenFields.append(I.create("input", { type: "hidden", name: "__mode_" + "_" + this._rowLength, value: data["__mode_"], dataset: { name: "__mode_" } }));
                hiddenFields.append(I.create("input", { type: "hidden", name: "__id_" + "_" + this._rowLength, value: data["__id_"], dataset: { name: "__id_" } }));
                hiddenFields.append(I.create("input", { type: "hidden", name: "__index_" + "_" + this._rowLength, value: this._rowLength, dataset: { name: "__index_" } }));
                cell.append(hiddenFields);
            }
        }
        createEditRow(data) {
            if (!this._tfoot) {
                this._tfoot = this._table.create("tfoot");
            }
            let row = this._tfoot.create("tr").addClass("edit-row");
            let cell = null, value = null, info = null, input = "";
            if (this.showEnum) {
                cell = row.create("td").text("");
            }
            cell = row.create("td").text("");
            let hiddenFields = $.create({ tagName: "div", style: { cssText: "display:none;" } });
            this._mainForm = new Form();
            for (let x in this.fields) {
                let field = this.fields[x];
                value = field.config.default;
                info = Object.assign({}, field.config);
                input = (field.input === "hidden") ? "input" : field.input;
                info.type = (field.input === "hidden") ? "hidden" : field.config.type;
                //info.value = value;
                info.dataset = { "name": x };
                this._mainForm.createInput(input, info); //I.create(input, info);
                if (field.input == "hidden") {
                    hiddenFields.append(this._mainForm.getInput(x));
                }
                else {
                    cell = row.create("td").ds("name", x);
                    cell.append(this._mainForm.getInput(x));
                }
            }
            this._mainForm.reset();
            if (cell) {
                hiddenFields.append(this._mainForm.createInput("input", { type: "hidden", name: "__mode_", value: "1", dataset: { name: "__mode_" } }));
                hiddenFields.append(this._mainForm.createInput("input", { type: "hidden", name: "__id_", value: "", dataset: { name: "__id_" } }));
                hiddenFields.append(this._mainForm.createInput("input", { type: "hidden", name: "__index_", value: "", dataset: { name: "__id_" } }));
                cell.append(hiddenFields);
            }
        }
        createCell(field) {
        }
        setRecord(index, params) {
        }
        getRecord(index) {
            let rows = this._tbody.queryAll(".body-row.active");
            rows.forEach(row => {
                $(row).removeClass("active");
            });
            let row = this._tbody.query(`.body-row[data-index='${index}']`);
            //let inputs = $(row).addClass("active").queryAll("td[data-name]");
            this._mainForm.setValue(this._forms[index].getValue());
            return;
            for (let _input of inputs) {
                let context = $(_input).query(".zone-edit");
                let input = $(_input).query("[data-sg-input][data-name]");
                this._mainForm.getInput(_input.dataset.name).setValue();
                $(context).append(this._mainForm.getInput(_input.dataset.name).main());
                //$(_input).text(this._mainForm.getInput(_input.dataset.name));
                //let input = I.create("input", {id:_input});
                //this._mainForm.getInput(_input.dataset.name).setValue(input.getValue());
            }
            //this.getGrid();
        }
        getRecordORG(row) {
            let inputs = $(row).queryAll("[data-sg-input][data-name]");
            for (let _input of inputs) {
                let input = I.create("input", { id: _input });
                this._mainForm.getInput(_input.dataset.name).setValue(input.getValue());
            }
            this.getGrid();
        }
        setValue(index, params) {
        }
        getValue() {
            return this._mainForm.getValue();
        }
        getGrid() {
            let data = [], i = 0;
            for (let f of this._forms) {
                data.push(this._forms[0].getValue());
            }
            return data;
        }
        onsubmit() {
            this._data_grid.val(JSON.stringify(this.getGrid()));
            return true;
        }
        setData(data) {
            this.data = data;
            this._rowLength = 0;
            this._tbody.text("");
            for (let record of this.data) {
                this.createRow(record);
            }
        }
        setNew() {
            this._check.get().checked = true;
            this._mainForm.reset();
            /*
                        for(let x in this.fields){
                            this._mainForm[x].setValue(this.fields[x].config.default);
                        }*/
            this._mainForm.getInput("__mode_").setValue("1");
            this._mainForm.getInput("__id_").setValue("");
            this._mainForm.getInput("__index_").setValue("");
        }
        getSearchValue() {
            let input = this._main.query("input.search");
            return input.value;
        }
        insert() {
            let data = this.getValue();
            this.createRow(data);
        }
        save() {
            let data = {};
            if (this._mainForm.valid()) {
                data = this._mainForm.getValue();
                if (data["__mode_"] == '1' && data["__index_"] === '') {
                    this.createRow(data);
                    this.setNew();
                }
                else {
                    this.saveAt(data["__index_"], data);
                }
            }
            return data;
        }
        saveAt(index, data) {
            let cells = this._main.queryAll(".body-row[data-index='" + index + "'] > [data-name]");
            if (cells.length == 0) {
                return false;
            }
            let _text, _input, input, name = "", value = "", text = "";
            for (let cell of cells) {
                value = data[cell.dataset.name];
                name = cell.dataset.name;
                if (this._fieldData[name] && this._fieldData[name][value]) {
                    text = this._fieldData[name][value];
                }
                else {
                    text = value;
                }
                _input = $(cell).query("[data-sg-input]");
                if (_input && data[cell.dataset.name]) {
                    input = I.create(_input.dataset.sgInput, { id: _input });
                    input.setValue(value);
                }
                _text = $(cell).query(".text");
                if (_text) {
                    $(_text).text(text);
                }
            }
        }
        createMenu(info) {
            info.parentContext = this;
            let _menu = new Menu(info);
            return $(_menu.get());
        }
        valid() {
        }
        setCaption(text) {
            let caption = this._main.query(".caption > .text");
            caption.innerHTML = text;
        }
        setPage(page) {
            this.pag.setPage(page);
        }
    }
    Grid._objs = [];
    return Grid;
})(_sgQuery);
