var Command = (($) => {
    class Command {
        constructor(info) {
            this.id = "";
            this.panel = "";
            this.tag = "";
            this.grid = null;
            this.form = null;
            this.menu = null;
            this.panelGrid = null;
            this.panelCommand = null;
            this._formParams = null;
            this._formCommand = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtType")) {
                    return;
                }
                if (main.hasClass("gt-command")) {
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
            this.main = main;
        }
        _create(main) {
            main.ds("gtType", "command");
            main.addClass("gt-command");
            //main.text("Mis Comandos");
            let g = null;
            if (this.form) {
                this.form.target = main.id();
                this.form.parentContext = this;
                console.log(this.form);
                g = this.form = new Form2(this.form);
            }
            this.panelGrid = main.create("div");
            this.panelCommand = main.create("div");
        }
        _load(main) {
        }
        setGrid(grid) {
            this.panelGrid.text("");
            this.panelCommand.text("");
            grid.target = this.panelGrid;
            grid.parentContext = this;
            this.grid = new Grid2(grid);
        }
        setForm(form) {
            this.panelGrid.text("");
            this.panelCommand.text("");
            form.target = this.panelGrid;
            form.parentContext = this;
            this._formCommand = new Form2(form);
            //this.panelCommand.text("yanny");
        }
        setFormX(form) {
            this.panelCommand.text("");
            form.target = this.panelCommand;
            form.parentContext = this;
            this._formParams = new Form2(form);
        }
        setData(data, page, totalPages) {
            this.grid.setData(data, page, totalPages);
            //this.grid.setPage(1);
            //this.grid.setPage(1);
        }
        setPage(page) {
            this.grid.pag.page = page;
            //this.grid.setPage(page);
        }
        getDetail(info) {
            let inputs = this._formParams.getInputs();
            let str = "";
            let cmdValues = [];
            let _data = [];
            let n = 0;
            for (let i in inputs) {
                if (inputs[i].ds("cmd")) {
                    _data.push({
                        "h_command_id": 410,
                        "param_id": inputs[i].ds("cmd"),
                        "value": inputs[i].getValue(),
                        "__mode_": inputs["param_mode"].getValue(),
                        "__id_": n++
                    });
                }
            }
            this._formCommand.getInput("d").setValue(JSON.stringify(_data));
        }
        test() {
            alert("hello world!");
        }
        valid() {
            this.getDetail({});
            return true;
        }
    }
    return Command;
})(_sgQuery);
