import { S } from '../../Sevian/ts/Sevian.js';
import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { MapBoxLib, MapControl as _MapControl } from '../../lib/MapBoxLib.js';

interface MapInitFunctions {
    [key: string]: Function[]
}

export type MapApi = MapBoxLib;
export type MapLib = MapBoxLib;
export type MapControl = _MapControl;

export class Map {

    private name: string = null;
    private layerImages: any[] = [];
    static _instances: { [key: string]: Map } = {};
    static _last: Map = null;
    static _loadFunctions: MapInitFunctions = {};

    id: any = null;
    map:MapApi = null;

    //win:any = null;
    //data:any[] = [];
    //units:any[] = [];
    //main:any = null;
    //clients:any[] = [];
    //accounts:any[] = [];
    //tracking:any[] = [];

    info: any = null;
    //wInfo:any = null;

    tapName: any = null;

    markImages: string[] = [];
    markDefaultImage: string = "";
    iconImages: any[] = [];
    controls: string[] = [];
    public ACCESS_TOKEN = "";

    static getMap(name) {

        if (name) {
            return Map._instances[name];
        } if (Map._last) {
            return Map._last;
        }

        return null;

    }
    static setMap(mapName: string, map) {
        Map._instances[mapName] = map;
    }
    static load(mapName: string, fn: Function) {
        if (!Map._loadFunctions[mapName]) {
            Map._loadFunctions[mapName] = [];
        }
        Map._loadFunctions[mapName].push(fn);
    }
    constructor(info) {
        
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

    create(main: any) {
        
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
    getControl(){
        return this.map;
    }
}