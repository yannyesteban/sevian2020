var test = (($) => {
    class test {
        constructor(info) {
            this.id = "";
            this.tag = "";
            this.grid = null;
            this.menu = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sgForm")) {
                    return;
                }
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
            //alert(this.tag);
        }
        _create(main) {
            this.grid.target = "#testgrid_2";
            let g = this.grid = new Grid2(this.grid);
            let xc = main.create({ tagName: "span" });
            this.menu.parentContext = this;
            this.menu.target = xc;
            let _menu = new Menu(this.menu);
            //return $(_menu.get());
            //xc.text("YANNY");
            return;
            this.grid.target = "#testgrid_2";
            this.grid.type = "default";
            this.grid.selectMode = "one";
            this.grid.editMode = "simple";
            //let g = this.grid = new Grid2(this.grid);
        }
        _load(main) {
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
        ver(msg) {
            alert(msg);
        }
        setTotalPages(pages) {
            //
            this.grid.pag.totalPages = pages;
            this.grid.pag.updatePages();
        }
    }
    return test;
})(_sgQuery);
