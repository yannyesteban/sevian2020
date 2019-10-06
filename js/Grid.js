var Grid = (($) => {
    class InfoField {
        constructor() {
            this.name = "";
            this.id = "";
            this.input = {};
        }
    }
    class Paginator {
        constructor(info) {
            this.totalPages = 5;
            this.page = 1;
            this.className = "";
            this._main = null;
            this._main = $.create("div");
            this._create(this._main);
        }
        get() {
            return this._main.get();
        }
        _create(main) {
            let _begin = main.create("span").text("|<");
            let _prev = main.create("span").text("<");
            for (let i = 1; i <= this.totalPages; i++) {
                let _prev = main.create("span").text(i);
            }
            let _next = main.create("span").text(">");
            let _end = main.create("span").text(">|");
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
            this.showEnum = true;
            this.option = [];
            this.data = [];
            this.actionButtons = ["edit", "delete"];
            this.paginator = {
                page: 2,
                pages: 20,
                maxPage: 5,
            };
            this.searchControl = {
                type: "default,forfields",
            };
            this.fields = [];
            this._main = null;
            this._mainForm = [];
            this._table = null;
            this._thead = null;
            this._tbody = null;
            this._tfoot = null;
            this._rowLength = 0;
            this._data_grid = null;
            this._check = null;
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
                }).on("onchange", () => { this.setNew(); });
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
            this._data_grid = I.create("input", { type: "hidden", name: "__data_grid" });
            hiddenDiv.append(this._data_grid);
            this._main.append(new Paginator({}));
        }
        _load(main) {
            this._main = main.addClass("sg-grid");
        }
        createRow(data) {
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
            if (this.ctrlSelect === "one" || this.ctrlSelect === "multiple") {
                cell = row.create("td");
                cell.create("input").attr("type", "button").on("click", () => { this.setNew(); });
                cell.create("input").attr("type", "button").val("s").on("click", () => { this.save(); });
                cell.create("input").attr("type", "button").val("I").on("click", () => { this.insert(); });
            }
            let hiddenFields = $.create({ tagName: "div", style: { cssText: "display:none;" } });
            for (let x in this.fields) {
                let field = this.fields[x];
                value = field.config.default;
                info = Object.assign({}, field.config);
                input = (field.input === "hidden") ? "input" : field.input;
                info.type = (field.input === "hidden") ? "hidden" : field.config.type;
                info.value = value;
                info.dataset = { "name": x };
                this._mainForm[x] = I.create(input, info);
                if (field.input == "hidden") {
                    hiddenFields.append(this._mainForm[x]);
                }
                else {
                    cell = row.create("td").ds("name", x);
                    cell.append(this._mainForm[x]);
                }
            }
            if (cell) {
                hiddenFields.append(this._mainForm["__mode_"] = I.create("input", { type: "hidden", name: "__mode_", value: "", dataset: { name: "__mode_" } }));
                hiddenFields.append(this._mainForm["__id_"] = I.create("input", { type: "hidden", name: "__id_", value: "", dataset: { name: "__id_" } }));
                hiddenFields.append(this._mainForm["__index_"] = I.create("input", { type: "hidden", name: "__index_", value: "", dataset: { name: "__id_" } }));
                cell.append(hiddenFields);
            }
        }
        createCell(field) {
        }
        setRecord(index, params) {
        }
        getRecord(row) {
            let inputs = $(row).queryAll("[data-sg-input][data-name]");
            for (let _input of inputs) {
                let input = new Input({ id: _input });
                this._mainForm[_input.dataset.name].setValue(input.getValue());
            }
            this.getGrid();
        }
        setValue(index, params) {
        }
        getValue() {
            let data = {};
            for (let x in this._mainForm) {
                data[x] = this._mainForm[x].getValue();
            }
            return data;
        }
        getGrid() {
            let rows = this._main.queryAll(".body-row");
            let str = "";
            let data = [], i = 0;
            for (let row of rows) {
                let inputs = $(row).queryAll("[data-sg-input][data-name]");
                data[i] = {};
                for (let _input of inputs) {
                    let input = new Input({ id: _input });
                    data[i][_input.dataset.name] = input.getValue();
                }
                i++;
            }
            this._data_grid.get().value = JSON.stringify(data);
        }
        setNew() {
            this._check.get().checked = true;
            for (let x in this.fields) {
                this._mainForm[x].setValue(this.fields[x].config.default);
            }
            this._mainForm["__mode_"].setValue("1");
            this._mainForm["__id_"].setValue("");
            this._mainForm["__index_"].setValue("");
        }
        insert() {
            let data = this.getValue();
            this.createRow(data);
        }
        save() {
            let data = {};
            for (let x in this._mainForm) {
                data[x] = this._mainForm[x].getValue();
            }
            this.saveAt(data["__index_"], data);
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
        valid() {
        }
    }
    Grid._objs = [];
    $(window).on("load", function () {
        return;
        let info = {
            target: "",
            id: "",
            caption: "",
            className: "",
            type: "",
            fields: [{}],
            data: [{}]
        };
        let g = new Grid(info);
    });
    return Grid;
})(_sgQuery);
