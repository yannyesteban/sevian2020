import { _sgQuery } from '../Sevian/ts/Query.js';
import { Pulsing } from './Pulsing.js';
import { Point } from './Point.js';
import { TraceControl } from './TraceControl.js';
import { InfoRuleControl } from './InfoRuleControl.js';
import { PolyControl } from './PolyControl.js';
import { MarkControl } from './MarkControl.js';
import { IMark } from './IMark.js';
import { Polygon } from './Polygon.js';
import { Rectangle } from './Rectangle.js';
import { Circle } from './Circle.js';
import { Rule } from './Rule.js';
import { Line } from './Line.js';
import { Mark } from './Mark.js';
import { Trace } from './Trace.js';
var ctMap = ctMap || [];
export var MapBox = (($, turf) => {
    class Map {
        //controls:string[] = ["rule"];
        constructor(info) {
            this.id = null;
            this.name = null;
            this.target = null;
            this.className = "map-main-layer";
            this.map = null;
            this.marks = [];
            this.groups = null;
            this.layers = [];
            this.latlng = new mapboxgl.LngLat(-66.903603, 10.480594);
            this.load = (event) => { };
            this._poly = [];
            this._controls = [];
            this.markImages = [];
            this.iconImages = null;
            this.markDefaultImage = null;
            this.controls = ["trace", "rule", "poly", "mark", "layer"];
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
                }
                else {
                    this._create(main);
                }
            }
            else {
                main = $.create("div").attr("id", this.id);
                this._create(main);
            }
            ctMap[this.name || this.id] = this;
            $(window).on("load", () => {
                // this.loadMap(main);
            });
        }
        _create(main) {
            mapboxgl.accessToken = "pk.eyJ1IjoieWFubnkyNCIsImEiOiJjazYxZnM5dzMwMzk1M21xbjUyOHVmdjV0In0.4ifqDgs5_PqZd58N1DcVaQ";
            let map = this.map = new mapboxgl.Map({
                container: this.id,
                //style: "mapbox://styles/mapbox/streets-v10",
                style: "mapbox://styles/mapbox/streets-v11",
                zoom: 10,
                center: this.latlng,
                attributionControl: true
            });
            map.on("load", (event) => {
                if (this.iconImages) {
                    this.iconImages.forEach((e) => {
                        map.loadImage(e.source, (error, image) => {
                            if (error) {
                                throw error;
                            }
                            map.addImage(e.name, image, { sdf: e.sfd || false });
                        });
                    });
                }
                map.addImage("triangle_001", new Point({
                    map: map,
                    rgb: [255, 76, 0],
                    center: [255, 255, 102],
                    color: "rgba(128, 255, 0, 1)",
                    borderWidth: 10,
                    width: 80, height: 110
                }), { pixelRatio: 3 });
                map.addImage("pulsing-blue", new Pulsing({
                    map: map,
                    rgb: [0, 255, 255],
                    center: [0, 128, 255]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-yellow", new Pulsing({
                    map: map,
                    rgb: [255, 76, 0],
                    center: [255, 255, 102]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-orange", new Pulsing({
                    map: map,
                    rgb: [255, 76, 0],
                    center: [255, 128, 0]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-red", new Pulsing({
                    map: map,
                    rgb: [255, 255, 204],
                    center: [255, 0, 0]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-pink", new Pulsing({
                    map: map,
                    rgb: [247, 67, 183],
                    center: [247, 67, 216]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-green", new Pulsing({
                    map: map,
                    rgb: [204, 255, 220],
                    center: [102, 255, 153]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-dot", new Pulsing({
                    map: map,
                    rgb: [153, 255, 51],
                    center: [0, 204, 0]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-dot2", new Pulsing({
                    map: map,
                    rgb: [247, 67, 183],
                    center: [247, 67, 216]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-01", new Pulsing({
                    map: map,
                    rgb: [255, 76, 0],
                    center: [255, 255, 102]
                }), { pixelRatio: 3 });
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
            //map.addControl(this._controls["rule"] = new InfoRuleControl(this), "top-right");
            //map.addControl(this._controls["poly"] = new PolyControl(this), "top-right");
            //map.addControl(this._controls["mark"] = new MarkControl(this), "top-right");
            //this.controls = ["rule"];
            function LayerControl() { }
            LayerControl.prototype.onAdd = function (map) {
                this._map = map;
                this._container = document.createElement("div");
                this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
                this._container.innerHTML = "<button type='button' class='icon-layer'></button>";
                return this._container;
            };
            LayerControl.prototype.onRemove = function () {
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
                    case "poly":
                        map.addControl(this._controls["poly"] = new PolyControl(this), "top-right");
                        break;
                    case "rule":
                        map.addControl(this._controls["rule"] = new InfoRuleControl(this), "top-right");
                        break;
                    case "mark":
                        map.addControl(this._controls["mark"] = new MarkControl(this), "top-right");
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
            return;
            var draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true,
                    circle: true
                }
            });
            map.addControl(draw);
            draw.add({ type: "Point", coordinates: [-66.903603, 10.480594] });
            draw.add({ type: "Point", coordinates: [-66.87957040722598, 10.561268658842579] });
            map.on("load", (event) => {
                //this.load(event);
                map.addImage("pulsing-dot", new Pulsing(map, 200), { pixelRatio: 2 });
                map.addImage("pulsing-dot2", new Pulsing(map, 100), { pixelRatio: 2 });
                map.addImage("pulsing-dot3", new Pulsing(map, 300), { pixelRatio: 2 });
                //return;
                map.addSource("points", {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [
                            {
                                "type": "Feature",
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [0, 0]
                                }
                            }
                        ]
                    }
                });
                map.addSource("points2", {
                    "type": "geojson",
                    "data": {
                        "type": "FeatureCollection",
                        "features": [
                            {
                                "type": "Feature",
                                "properties": {
                                    "micon": "pulsing-dot3"
                                },
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [-71.65522800, 10.59577000]
                                }
                            },
                            {
                                "type": "Feature",
                                "properties": {
                                    "micon": "pulsing-dot2"
                                },
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [-69.39774800, 10.06782300]
                                }
                            }
                        ]
                    }
                });
                map.addLayer({
                    "id": "points2",
                    "type": "symbol",
                    "source": "points2",
                    "layout": {
                        "icon-image": ["get", "micon"]
                    }
                });
                map.addLayer({
                    "id": "points",
                    "type": "symbol",
                    "source": "points",
                    "layout": {
                        "icon-image": "pulsing-dot"
                    }
                });
                map.getSource("points").setData({
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [-66.903603, 10.480594]
                            }
                        },
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [-67.52839800, 10.22430800]
                            }
                        }
                    ]
                });
                let ele = document.createElement("div");
                $(ele).addClass("marker-alpha");
                var marker = new mapboxgl.Marker({ element: ele })
                    .setLngLat([-66.84444000, 10.28113600])
                    .addTo(map);
            });
        }
        _load(main) {
        }
        on(event, func) {
            this.map.on(event, func);
        }
        zoom(value) {
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
        addMark(name, info) {
            info.map = this.map;
            this.marks[name] = new Mark(info);
        }
        addSource(id, source) {
            this.map.addSource(id, source);
        }
        setDataSource(sourceId, source) {
            this.map.getSource(sourceId).setData(source);
        }
        addPulse(layerId, sourceId) {
            let map = this.map;
            this.map.addLayer({
                "id": layerId,
                "type": "symbol",
                "source": sourceId,
                "layout": {
                    "icon-image": ["get", "micon"]
                }
            });
            return;
            map.addSource("points", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "geometry": {
                                "type": "Point",
                                "coordinates": [0, 0]
                            }
                        }
                    ]
                }
            });
            map.addSource("points2", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [
                        {
                            "type": "Feature",
                            "properties": {
                                "micon": "pulsing-dot3"
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [-71.65522800, 10.59577000]
                            }
                        },
                        {
                            "type": "Feature",
                            "properties": {
                                "micon": "pulsing-dot2"
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [-69.39774800, 10.06782300]
                            }
                        }
                    ]
                }
            });
            map.addLayer({
                "id": "points2",
                "type": "symbol",
                "source": "points2",
                "layout": {
                    "icon-image": ["get", "micon"]
                }
            });
            map.addLayer({
                "id": "points",
                "type": "symbol",
                "source": "points",
                "layout": {
                    "icon-image": "pulsing-dot"
                }
            });
            map.getSource("points").setData({
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-66.903603, 10.480594]
                        }
                    },
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [-67.52839800, 10.22430800]
                        }
                    }
                ]
            });
            return;
            this.map.addLayer({
                "id": layerId,
                "type": "symbol",
                "source": sourceId,
                "layout": {
                    "icon-image": ["get", "micon"]
                }
            });
            alert(layerId);
            alert(sourceId);
        }
        addRule(name, info) {
            info.map = this.map;
            return new Line(info);
        }
        addCircle(name, info) {
            if (this._poly[name]) {
                return this._poly[name];
            }
            info.map = this.map;
            info.parent = this;
            this._poly[name] = new Circle(info);
            return this._poly[name];
        }
        draw(name, type, info) {
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
                case "trace":
                    this._poly[name] = new Trace(info);
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
        getControl(name) {
            if (this._controls[name]) {
                return this._controls[name];
            }
            return false;
        }
        stopControls() {
            for (let x in this._controls) {
                this._controls[x].stop();
            }
        }
        getImage(name) {
            return this.markImages[name] || '';
        }
    }
    return Map;
})(_sgQuery, turf);
//# sourceMappingURL=MapBox.js.map