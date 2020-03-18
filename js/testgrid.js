var test = (($) => {
    class test {
        constructor(info) {
            this.id = "";
            this.tag = "";
            this.grid = null;
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
            this.grid.type = "default";
            this.grid.selectMode = "one";
            this.grid.editMode = "simple";
            let g = new Grid2(this.grid);
        }
        _load(main) {
        }
        ver(msg) {
            alert(msg);
        }
    }
    return test;
})(_sgQuery);
