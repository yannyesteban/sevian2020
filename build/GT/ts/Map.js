var MAPBOX_IMAGES = 1;
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
            this.markImages = [];
            this.markDefaultImage = "";
            this.iconImages = [];
            this.controls = [];
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
            Map.setMap(this.id, this);
        }
        static getMap(name) {
            if (name) {
                return Map._instances[name];
            }
            if (Map._last) {
                return Map._last;
            }
            return null;
        }
        static setMap(name, map) {
            Map._instances[name] = map;
        }
        static load(fn) {
            Map._loadFuntions.push(fn);
        }
        _create(main) {
            main.addClass(["map-main", "map-layout"]);
            this.map = new MapBox({
                id: `${this.id}`,
                markImages: this.markImages,
                markDefaultImage: this.markDefaultImage,
                iconImages: this.iconImages,
                controls: this.controls
            });
            this.map.on("load", (event) => {
                for (let fn of Map._loadFuntions) {
                    fn(this.map, this.id);
                }
            });
        }
        _load(main) {
        }
    }
    Map._instances = [];
    Map._last = null;
    Map._loadFuntions = [];
    return Map;
})(_sgQuery);
//# sourceMappingURL=Map.js.map