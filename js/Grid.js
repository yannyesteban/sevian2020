var Grid = (($) => {
    class InfoField {
        constructor() {
            this.name = "";
            this.id = "";
            this.input = {};
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
            this._main = main.addClass("sg-grid").addClass(this.className);
            main.create({ tagName: "div", className: "caption" })
                .add({ tagName: "span", className: "icon" + this.iconClass })
                .add({ tagName: "span", className: "text", innerHTML: this.caption })
                .add({ tagName: "span", className: "arrow" });
            let body = main.create("div").addClass("body");
            let table = this._table = body.create("table").addClass("grid-table");
            //table.create("caption").text("consulta");
            let row = table.create("tr");
            if (true) {
                let cell = row.create("td").text("#");
            }
            if (this.ctrlSelect == "one" || this.ctrlSelect == "multiple") {
                let cell = row.create("td");
                let ctrl = this._check = cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect == "one") ? "radio" : "checkbox",
                    name: this.id + "_chk",
                    checked: (this.ctrlSelect == "one") ? true : false,
                });
            }
            for (let x in this.fields) {
                if (this.fields[x].input == "hidden") {
                    continue;
                }
                let cell = row.create("td").text(this.fields[x].config.caption);
            }
            let index = 0;
            this._rowLength = 0;
            for (let record of this.data) {
                this.createRow(record);
            }
            this.createEditRow({});
            let hiddenDiv = body.create("div");
            this._data_grid = I.create("input", { type: "hidden", name: "__data_grid" });
            hiddenDiv.append(this._data_grid);
            return;
            let info = null, field = null;
            for (let x in this.fields) {
                field = this.fields[x];
                info = Object.assign({}, field.config);
                if (field.input === "hidden") {
                    info.input = "input";
                    info.type = "hidden";
                }
                else {
                    info.input = field.input;
                    info.type = field.config.type;
                }
                //
                this._mainForm[x] = I.create(info.input, info);
                hiddenDiv.append(this._mainForm[x]);
            }
        }
        _load(main) {
            this._main = main.addClass("sg-grid");
        }
        createRow(data) {
            let row = this._table.create("tr").addClass("body-row");
            let hiddenInputs = $.create("span");
            let cell = null, value = null;
            if (this.showEnum) {
                cell = row.create("td").text(++this._rowLength);
            }
            if (this.ctrlSelect === "one" || this.ctrlSelect === "multiple") {
                cell = row.create("td");
                let ctrl = cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect === "one") ? "radio" : "checkbox",
                    name: this.id + "_chk"
                });
                ctrl.on("click", (event) => { this.getRecord((event.currentTarget.parentNode.parentNode)); });
            }
            let hiddenFields = $.create({ tagName: "div", style: { cssText: "display:none;" } });
            for (let x in this.fields) {
                let field = this.fields[x];
                value = data[x];
                if (field.input === "hidden") {
                    let hidden = I.create("input", { type: "hidden", value: value });
                    hiddenFields.append(hidden);
                }
                else {
                    let info = null;
                    switch (this.type) {
                        case "default":
                            cell = row.create("td").ds("name", x).text(value);
                            info = Object.assign({}, field.config);
                            info.type = "hidden";
                            info.name = field.config.name + "_" + this._rowLength;
                            info.value = value;
                            info.dataset = { "name": x };
                            cell.append(I.create("input", info));
                            break;
                        case "2":
                            cell = row.create("td").ds("name", x).text(value);
                            info = Object.assign({}, field.config);
                            info.name = field.config.name + "_" + this._rowLength;
                            info.value = value;
                            info.dataset = { "name": x };
                            cell.append(I.create(field.input, info));
                            break;
                    }
                }
            }
            if (cell) {
                hiddenFields.append(I.create("input", { type: "hidden", name: "__mode_" + "_" + this._rowLength, value: data["__mode_"], dataset: { name: "__mode_" } }));
                hiddenFields.append(I.create("input", { type: "hidden", name: "__id_" + "_" + this._rowLength, value: data["__id_"], dataset: { name: "__id_" } }));
                cell.append(hiddenFields);
            }
        }
        createEditRow(data) {
            let row = this._table.create("tr").addClass("edit-row");
            //let hiddenInputs = $.create("span");
            let cell = null, value = null, info = null, input = "";
            if (this.showEnum) {
                cell = row.create("td").text("");
            }
            if (this.ctrlSelect === "one" || this.ctrlSelect === "multiple") {
                cell = row.create("td");
                cell.create("input").attr("type", "button").on("click", () => { this.setNew(); });
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
                hiddenFields.append(this._mainForm["__mode_"] = I.create("input", { type: "hidden", name: "__mode_", value: data["__mode_"], dataset: { name: "__mode_" } }));
                hiddenFields.append(this._mainForm["__id_"] = I.create("input", { type: "hidden", name: "__id_", value: data["__id_"], dataset: { name: "__id_" } }));
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
        getValue(index) {
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
            let value;
            this._check.get().checked = true;
            for (let x in this.fields) {
                this._mainForm[x].setValue(this.fields[x].config.default);
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
