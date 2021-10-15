import { _sgQuery as $ } from '../Sevian/ts/Query.js';


import { Pulsing } from './Pulsing.js';
import { Arrow } from './Arrow.js';
import { Point } from './Point.js';


import { HistoryControl } from './HistoryControl.js';
import { TraceControl } from './TraceControl.js';
import { InfoRuleControl } from './InfoRuleControl.js';
import { PolyControl } from './PolyControl.js';
import { PolyControl as PolyControl2 } from './PolyControl2.js';
import { MarkControl } from './MarkControl.js';
import { MarkControl as  MarkControl2 } from './MarkControl2.js';

import { IMark } from './IMark.js';
import { JMark } from './JMark.js';
import { Polygon } from './Polygon.js';
import { Rectangle } from './Rectangle.js';
import { Circle } from './Circle.js';
import { Rule } from './Rule.js';
import { Line } from './Line.js';
import { Mark } from './Mark.js';
import { History } from './History.js';
export type MapControl = TraceControl | HistoryControl | PolyControl;



//import {Menu}  from '../Sevian/ts/Menu2.js';
import { Tab } from '../Sevian/ts/Tab.js';
import { createGeoJSONRectangle, createGeoJSONPoly, createGeoJSONLine, createGeoJSONCircle } from './Util.js';
var ctMap = ctMap || [];
const turf = window["turf"];
const mapboxgl = window["mapboxgl"];
interface Polylayer {
    map: any;
    parent: any;
    stop: Function;
    play: Function;
    flyTo: Function;
    panTo: Function;
    delete: Function;
    visible: Function;
    save: Function;
}

export class MapBoxLib {
    id: any = null;
    private iImages: { [name: string]: any } = {};

    name: string = null;
    target: any = null;
    className: string = "map-main-layer";
    map: any = null;
    marks: any[] = [];
    groups: any[] = null;
    layers: any[] = [];
    latlng = null;//new mapboxgl.LngLat(-66.903603, 10.480594);

    load: any = (event) => { };

    _poly: { [key:string]: Polylayer } = {};
    _controls: MapControl[] = [];
    markImages: {name:string, src:string}[] = [];
    iconImages: any[] = null;
    layerImages: any[] = [];
    markDefaultImage: string = null;

    controls: string[] = ["history", "rule", "poly", "mark", "layer"];
    //controls:string[] = ["rule"];

    public ACCESS_TOKEN = "";
    constructor(info: object) {
        for (let x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = (this.id) ? $(this.id) : false;
        if (main) {

            if (main.ds("LeatfletMap")) {
                return;
            }

            if (main.hasClass("leatflet-map")) {
                this._load(main);
            } else {
                this._create(main);
            }

        } else {
            main = $.create("div").attr("id", this.id);

            this._create(main);
        }

        ctMap[this.name || this.id] = this;

        $(window).on("load", () => {
            // this.loadMap(main);
        });
    }
    _create(main) {

        if (!mapboxgl) {
            console.log("no mapbox");
            return;
        }

        //mapboxgl.accessToken = this.ACCESS_TOKEN;
        mapboxgl.accessToken = "pk.eyJ1IjoieWFubnkyNCIsImEiOiJjazYxZnM5dzMwMzk1M21xbjUyOHVmdjV0In0.4ifqDgs5_PqZd58N1DcVaQ";
        this.latlng = new mapboxgl.LngLat(-66.903603, 10.480594);
        let map = this.map = new mapboxgl.Map({
            container: this.id,
            //style: "mapbox://styles/mapbox/streets-v10",
            style: "mapbox://styles/mapbox/streets-v11",
            zoom: 10,
            center: this.latlng,
            attributionControl: true

        });

        map.doubleClickZoom.disable();

        map.on("dblclick",(event)=>{
           this.zoomOut();
        })
        map.on("load", (event) => {

            if (this.iconImages) {

                this.iconImages.forEach((e) => {

                    map.loadImage(e.source, (error, image) => {
                        if (error) {
                            throw error;
                        }
                        map.addImage(e.name, image, { sdf: e.sfd || false });

                    })
                });

            }

            this.layerImages.forEach(imageInfo => {
                this.addLayerImage(imageInfo);
            });



            let traffic = {

                "url": "mapbox://mapbox.mapbox-traffic-v1",
                "type": "vector"

            };

            this.map.addSource("mapbox-traffic", traffic);


            this.map.addLayer({
                "id": "traffic",
                "type": "line",
                "source": "mapbox-traffic",
                "source-layer": "traffic",

                "paint": {
                    "line-width": 2.5,
                    "line-color": [
                        "case",
                        [
                            "==",
                            "low",
                            [
                                "get",
                                "congestion"
                            ]
                        ],
                        "#aab7ef",
                        [
                            "==",
                            "moderate",
                            [
                                "get",
                                "congestion"
                            ]
                        ],
                        "#4264fb",
                        [
                            "==",
                            "heavy",
                            [
                                "get",
                                "congestion"
                            ]
                        ],
                        "#ee4e8b",
                        [
                            "==",
                            "severe",
                            [
                                "get",
                                "congestion"
                            ]
                        ],
                        "#b43b71",
                        "#000000"
                    ]
                }

            });

        });


        function LayerControl() { }

        LayerControl.prototype.onAdd = function(map) {
            this._map = map;
            this._container = document.createElement("div");
            this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
            this._container.innerHTML = `<button type="button" class="icon-layer"></button>`;
            return this._container;
        };

        LayerControl.prototype.onRemove = function() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        };
        //this.controls = ["rule"];
        //this.controls = ["trace", "rule", "poly", "mark", "layer"];
        this.controls.forEach((e) => {
            switch (e) {
                case "trace":
                    map.addControl(this._controls["trace"] = new TraceControl(this), "top-right");
                    break;
                case "history":
                    map.addControl(this._controls["history"] = new HistoryControl(this), "top-right");
                    break;
                case "poly2":
                    map.addControl(this._controls["poly2"] = new PolyControl2(this), "top-right");
                    break;
                case "poly":
                    map.addControl(this._controls["poly"] = new PolyControl(this), "top-right");
                    break;
                    case "rule":
                    map.addControl(this._controls["rule"] = new InfoRuleControl(this), "top-right");
                    break;
                case "mark":
                    map.addControl(this._controls["mark"] = new MarkControl(this), "top-right");
                    break;
                case "mark2":
                    map.addControl(this._controls["mark2"] = new MarkControl2(this), "top-right");
                    break;
                    case "layer":
                    //map.addControl(this._controls["layer"] = new LayerControl(), "top-right");
                    break;
            }

        });



        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }));
        //map.addControl(new mapboxgl.AttributionControl({compact: true}));
        map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector("body") }));


        mapboxgl.setRTLTextPlugin("https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js");
        map.addControl(new MapboxLanguage({
            defaultLanguage: "es"
        }));

        map.addControl(new mapboxgl.NavigationControl());




    }
    _load(main) {

    }

    on(event, func) {
        this.map.on(event, func);
    }

    zoom(value: number) {

    }

    flyTo(lat, lng) {

        this.map.flyTo({
            center: [lng, lat],
            zoom: 16,
            speed: 3.0,
            curve: 1,
            easing(t) {
                return t;
            }
        });
    }

    createMark(info) {
        info.map = this.map;
        return new Mark(info);
    }
    addMark(name: string, info: object) {
        info.map = this.map;
        this.marks[name] = new Mark(info);
    }

    addSource(id, source) {
        this.map.addSource(id, source);
    }
    setDataSource(sourceId, source) {
        this.map.getSource(sourceId).setData(source);
    }


    addRule(name: string, info: Polylayer) {
        info.map = this.map;
        return new Line(info);
    }

    addCircle(name: string, info: Polylayer) {

        if (this._poly[name]) {
            return this._poly[name];
        }
        info.map = this.map;
        info.parent = this;
        this._poly[name] = new Circle(info);
        return this._poly[name];
    }

    draw(name: string, type: string, info: Polylayer) {
        
        if (this._poly[name]) {
            return this._poly[name];
        }
        info.map = this.map;
        info.parent = this;

        switch (type) {
            case "circle":
                this._poly[name] = new Circle(info);
                break;
            case "rectangle":
                this._poly[name] = new Rectangle(info);
                break;
            case "polygon":
                this._poly[name] = new Polygon(info);
                break;
            case "symbol":
                this._poly[name] = new Circle(info);
                break;
            case "rule":
                this._poly[name] = new Rule(info);
                break;
            case "mark":

                this._poly[name] = new IMark(info);
                
                //this._poly[name] = new Trace(info);
                break;
            case "jmark":
                this._poly[name] = new JMark(info);
                //this._poly[name] = new Trace(info);
                break;
            case "history":

                this._poly[name] = new History(info);
                //this._poly[name] = new Trace(info);
                break;

        }

        return this._poly[name];
    }
    stop() {
        /*
        for(let poly of this._poly){

            poly.stop();
        }*/
        for (let x in this._poly) {

            this._poly[x].stop();
        }
    }

    delete(name) {
        
        if (this._poly[name]) {
            this._poly[name].delete();
            delete this._poly[name];
            return true;
        }
        return false;
    }

    getControl(name): MapControl {
        if (this._controls[name]) {
            return this._controls[name];
        }
        return null;

    }
    stopControls() {
        for (let x in this._controls) {
            this._controls[x].stop();
        }
    }
    getImage(name) {
        
        

        return this.markImages.find((img:any) => img.name == name).src;


    }

    createImage(info) {
        if (info.type == "arrow") {
            return new Arrow(info);
        }
        if (info.type == "circle") {
            return new Point(info);
        }
        if (info.type == "pulsing") {
            return new Pulsing(info);
        }

        return new Point(info);
    }

    addLayerImage(info) {

        if (this.map.hasImage(info.name)){
            return false;
        }
        this.iImages[info.name] = this.createImage(Object.assign({ map: this.map }, info));
        this.map.addImage(info.name, this.iImages[info.name], { pixelRatio: 3 });
        return true;
    }

    removeLayerImage(name){
        if (this.map.hasImage(name)){
            this.map.removeImage(name);
            return true;
        }
        return false;
    }

    getLayerImage(name:string){
        return this.iImages[name];
    }

    createPopup(info) {
        return new mapboxgl.Popup(info);
    }

    public boundTo(coordinates, padding?) {

        const zoom = this.map.getZoom();

        if (padding === undefined) {
            padding = 40;
        }

        const bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        this.map.fitBounds(bounds, {
            padding: padding,
            maxZoom: zoom,
            linear: false
        });
    }

    public zoomOut(){
        this.map.zoomOut();
    }

    public zoomIn(){
        this.map.zoomIn();
    }
}