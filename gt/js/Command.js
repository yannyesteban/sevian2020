var Command = (($) => {
    class Command {
        constructor(info) {
            this.id = "";
            this.panel = "";
            this.tag = "";
            this.grid = null;
            this.form = null;
            this.menu = null;
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
            grid.target = this.panelGrid;
            grid.parentContext = this;
            this.grid = new Grid2(grid);
        }
        setForm(form) {
            this.panelGrid.text("");
            form.target = this.panelGrid;
            form.parentContext = this;
            this.grid = new Form2(form);
            //this.panelCommand.text("yanny");
        }
        setFormX(form) {
            this.panelCommand.text("");
            form.target = this.panelCommand;
            form.parentContext = this;
            this.grid2 = new Form2(form);
        }
    }
    return Command;
})(_sgQuery);
