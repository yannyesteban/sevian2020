var GTMap = (($) => {
    class Map {
        constructor(info) {
            this.id = null;
            this.map = null;
            //win:any = null;
            //data:any[] = [];
            //units:any[] = [];
            //main:any = null;
            //clients:any[] = [];
            //accounts:any[] = [];
            //tracking:any[] = [];
            this.info = null;
            //wInfo:any = null;
            this.tapName = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtMap")) {
                    return;
                }
                if (main.hasClass("gt-map")) {
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
            Map._instances[this.id] = this;
        }
        static getMap(name) {
            return Map._instances[name];
        }
        _create(main) {
            main.addClass("map-main");
            this.map = new MapBox({ id: `${this.id}` });
        }
        _load(main) {
        }
    }
    Map._instances = [];
    return Map;
})(_sgQuery);
