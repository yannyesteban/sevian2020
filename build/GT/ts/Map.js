import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { MapBoxLib } from '../../lib/MapBoxLib.js';
export class Map {
    constructor(info) {
        this.name = null;
        this.layerImages = [];
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
        this.ACCESS_TOKEN = "";
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = (this.id) ? $(this.id) : false;
        if (!main) {
            main = $.create("div").attr("id", this.id);
        }
        this.create(main);
        Map.setMap(this.name, this);
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
    static setMap(mapName, map) {
        Map._instances[mapName] = map;
    }
    static load(mapName, fn) {
        if (!Map._loadFunctions[mapName]) {
            Map._loadFunctions[mapName] = [];
        }
        Map._loadFunctions[mapName].push(fn);
    }
    create(main) {
        main.addClass(["gt-map", "map-main", "map-layout"]);
        this.map = new MapBoxLib({
            id: `${this.id}`,
            markImages: this.markImages,
            layerImages: this.layerImages,
            markDefaultImage: this.markDefaultImage,
            iconImages: this.iconImages,
            controls: this.controls,
            ACCESS_TOKEN: this.ACCESS_TOKEN
        });
        this.map.on("load", (event) => {
            if (Map._loadFunctions[this.name]) {
                for (let fn of Map._loadFunctions[this.name]) {
                    fn(this.map, this);
                }
            }
        });
    }
    getControl() {
        return this.map;
    }
}
Map._instances = {};
Map._last = null;
Map._loadFunctions = {};
//# sourceMappingURL=Map.js.map