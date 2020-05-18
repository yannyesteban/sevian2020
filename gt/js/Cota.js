var Cota = (($) => {
    class Cota {
        constructor(info) {
            this.id = null;
            this.map = null;
            this.win = null;
            this.data = [];
            this.units = [];
            this.main = null;
            this.clients = [];
            this.accounts = [];
            this.tracking = [];
            this.info = null;
            this.wInfo = null;
            this.tapName = null;
            this.unit = null;
            this.form = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtCota")) {
                    return;
                }
                if (main.hasClass("gt-cota")) {
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
        }
        _create(main) {
            main.addClass("cota-main").addClass("map-main");
            if (this.form) {
                this.form.target = main.id();
                this.form.parentContext = this;
                this._form = new Form2(this.form);
            }
            this.map = new MapBox({ id: `${this.id}` });
            //            console.log (this.unit.info)
            this.unit.info.map = this.map;
            let unit = new GTUnit(this.unit.info);
            return;
            unit.play();
        }
        _load(main) {
        }
    }
    return Cota;
})(_sgQuery);
