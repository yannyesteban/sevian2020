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
            this.type = "2"; //"select-one,view,select-one,select-multiple,edit-one,edit-all,edit-form";
            this.ctrlSelect = "one"; //one,multiple,
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
                let ctrl = cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect == "one") ? "radio" : "checkbox",
                    name: this.id + "_chk"
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
            let hiddenDiv = body.create("div");
            let info = null, field = null;
            for (let x in this.fields) {
                field = this.fields[x];
                info = Object.assign({}, field.config);
                info.type = "text";
                hiddenDiv.append(I.create("input", info));
            }
            return;
            for (let record of this.data) {
                let row = table.create("tr").addClass("body-row");
                if (true) {
                    let cell = row.create("td").text(index + 1);
                }
                if (this.type == "select-one") {
                    let cell = row.create("td").create({ tagName: "input", type: "radio", name: this.id + "_chk", value: index });
                    cell.on("click", (event) => { this.getRecord((event.currentTarget.parentNode.parentNode)); });
                }
                let hiddenFields = $.create({ tagName: "div" });
                let cellAux = false;
                for (let x in this.fields) {
                    let value = record[x] ? record[x] : "";
                    if (this.fields[x].input == "hidden") {
                        // hiddenFields.create()                        
                    }
                    else {
                        let cell = row.create("td").ds("name", x).ds("index", index);
                        let input = new Input({
                            target: cell,
                            type: "text",
                            name: this.fields[x].name + "_" + index,
                            value: value
                        });
                        if (!cellAux) {
                            cellAux = cell;
                        }
                    }
                }
                if (cellAux) {
                    cellAux.append(hiddenFields);
                }
                row.ds("recordMode", record["__mode_"]);
                row.ds("recordId", record["__id_"]);
                this._rowLength = ++index;
            }
            if (1 == 2) {
                let row = table.create("tr");
                if (true) {
                    let cell = row.create("td").text("&nbsp");
                }
                if (this.type == "select-one") {
                    let cell = row.create("td").text("&nbsp");
                }
                let cols = 0;
                for (let x in this.fields) {
                    let cell = row.create("td").ds("name", x).ds("index", index);
                    if (cols == 0) {
                        this._mainForm["__mode_"] = new Input({ target: cell, type: "text", name: "__mode_", value: "0" });
                        this._mainForm["__id_"] = new Input({ target: cell, type: "text", name: "__mode_", value: "1" });
                    }
                    this._mainForm[x] = new Input({ target: cell, type: "text", name: this.fields[x].name, value: "" });
                    cols++;
                }
            }
            let hiddenForm = body.create({ tagName: "div", style: "display:inline", className: "hidden-form" });
            for (let x in this.fields) {
                //let span = hiddenForm.create("span");
                //this._mainForm[x] = new Input({target:span, type:"hidden", name:this.fields[x].name, value: ""});
            }
            let length = this._table.queryAll(".body-row").length;
            db(length, "green");
        }
        _load(main) {
            this._main = main.addClass("sg-grid");
        }
        createRow(data) {
            let row = this._table.create("tr");
            let hiddenInputs = $.create("span");
            let cell = null, value = null;
            if (this.showEnum) {
                cell = row.create("td").text(++this._rowLength);
            }
            if (this.ctrlSelect == "one" || this.ctrlSelect == "multiple") {
                cell = row.create("td");
                let ctrl = cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect == "one") ? "radio" : "checkbox",
                    name: this.id + "_chk"
                });
            }
            let hiddenFields = $.create({ tagName: "div", style: { cssText: "display:none;" } });
            for (let x in this.fields) {
                let field = this.fields[x];
                value = data[x];
                if (field.input == "hidden") {
                    let hidden = I.create("input", { type: "hidden", value: value });
                    hiddenFields.append(hidden);
                }
                else {
                    let info = null;
                    switch (this.type) {
                        case "default":
                            cell = row.create("td").text(value);
                            info = Object.assign({}, field.config);
                            info.type = "hidden";
                            info.name = field.config.name + "_" + this._rowLength;
                            info.value = value;
                            cell.append(I.create("input", info));
                            break;
                        case "2":
                            cell = row.create("td").text(value);
                            info = Object.assign({}, field.config);
                            info.name = field.config.name + "_" + this._rowLength;
                            info.value = value;
                            cell.append(I.create(field.input, info));
                    }
                }
            }
            if (cell) {
                hiddenFields.append(I.create("input", { type: "hidden", name: "__mode_", value: data["__mode_"] }));
                hiddenFields.append(I.create("input", { type: "hidden", name: "__id_", value: data["__id_"] }));
                cell.append(hiddenFields);
            }
        }
        createCell(field) {
        }
        setRecord(index, params) {
        }
        getRecord(row) {
            let cells = $(row).queryAll("[data-name]");
            let form = $(row).query("input").form;
            for (let cell of cells) {
                // alert (cell.dataset.name)
                let _input = $(cell).query("[data-sg-input]");
                let input = new Input({ id: _input });
                this._mainForm[cell.dataset.name].setValue(input.getValue());
            }
            this._mainForm["__mode_"].setValue($(row).ds("recordMode"));
            this._mainForm["__id_"].setValue($(row).ds("recordId"));
        }
        setValue(index, params) {
        }
        getValue(index) {
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
