import {_sgQuery as $}  from '../Sevian/ts/Query.js';
import {Arrow}  from './Arrow.js';
import {Pulsing}  from './Pulsing.js';
import {Point}  from './Point.js';

interface MobilInfo {
    coordinates: number[],
    speed: number,
    heading: number
}

export class Trace {
    map: any = null;

    private data: any[] = [];
    private mainSourceId: string = "";
    private mainLayerId: string = "";
    private layers: any[] = [];
    private maxDelay: number = 200;
    private mapLayers: string[] = [];
    private active: boolean = false;
    private propertysInfo: any = {};

    type: string = "history";
    parent: object = null;
    name: string = "";
    visible: boolean = true;

    coordinates = null;
    coordinatesInit = null;

    flyToSpeed: number = 0.8;
    flyToZoom: number = 14;
    panDuration: number = 5000;



    layers2: any = [];
    groups: any = [];
    _layers: any = [];


    maxLines: number = 0;

    lineColor: string = "white";
    lineWidth: number = 2;
    fillColor: string = "red";
    //radio:number = 0;
    //center:number[] = null;
    hand: number[] = null;
    _status: number = 0;
    _nodes: any = null;
    _line: any = null;
    id: string = "p" + String(new Date().getTime());

    layerMobilId: string = null;
    lineId: string = null;
    lineIdA: string = null;
    circleId: string = null;
    mobileId: string = null;
    pulsingId: string = null;

    layerSourceId: string = "";
    layerId: string = "";
    _events: any[] = [];
    _play: boolean = false;
    _lastIndex = null;

    private layerIndex = 0;
    callmove: Function = () => { };
    callresize: Function = () => { };

    private ondraw: Function = (coordinates) => {};
    public onAddLayer: Function = (layerInfo)=>{};
    public onUpdateLayer: Function = (layerInfo)=>{};
    public onRemoveLayer: Function = (id)=>{};

    public onAddImage: Function = (imageInfo)=>{};
    public onUpdateImage: Function = (imageInfo)=>{};
    public onRemoveImage: Function = (id)=>{};


    private speedFactor = 0.05; // number of frames per longitude degree
    private animation; // to store and cancel the animation
    private startTime = 0;
    private endTime = -1;
    private progress = 0; // progress = timestamp - startTime
    private resetTime = false; // indicator of whether time reset is needed for the animation
    private layersId: string[] = [];




    private roadLayerId: string = "";
    private roadSourceId: string = "";

    private lineLayerId: string = "";
    private lineSourceId: string = "";

    private nodeSourceId: string = "";

    private mobilLayerId: string = "";
    private mobilSourceId: string = "";

    private traceLayerId: string = "";
    private traceSourceId: string = "";


    private roadLayerInfo = {
        color:"#ff9900",
        width: 2,
        opacity:0.8,
        dash: 2,
        visible: true
    };

    private traceLayerInfo = {
        color:"#f743d8",
        width: 4,
        opacity:1.0,
        dash: 0,
        visible: true
    };

    private traceLength = 1000;
    private reverse: boolean = false;

    private mobil: MobilInfo = null;
    //private pause:boolean = false;
    private traceMode = 1;
    private images:any[] = [];
    private iImages:any[] = [];

    private popup:any = null;
    public onShowInfo:Function = (info)=>{};

    private funContextMenu:Function = null;

    private popupInfo: any = null;


    constructor(info: object) {

        for (let x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        //this.lineIdA = "la-"+this.id;
        //this.layerMobilId = "n-"+this.id;
        //this.lineId = "l-"+this.id;
        //this.circleId = "c-"+this.id;
        //this.mobileId = "m-"+this.id;
        //this.pulsingId = "p-"+this.id;

        //this.layerSourceId = "lt-" + this.id;
        //this.layerId = "ly-" + this.id;
        //this.lineSourceId = "ls-" + this.id;

        this.mainSourceId = "mn-" + this.id;
        this.mainLayerId = "mn-" + this.id;

        this.roadSourceId = "rs-" + this.id;
        this.traceSourceId = "ts-" + this.id;
        this.nodeSourceId = "ns-" + this.id;
        //this.mobilSourceId = "ms-" + this.id;

        this.roadLayerId = "rl-" + this.id;
        this.traceLayerId = "tl-" + this.id;
        this.mobilLayerId = "ml-" + this.id;
        this.layerId =  `${this.id}-i-`;

        //this.lineLayerId = "ll-" + this.id;

        //this.init();
    }

    isActive() {
        return this.active;
    }

    init(data?) {
        if (data !== undefined) {
            this.data = data;
        }
        //this.registerImages(this.images);
        //console.log(this.map);

        this.popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });


        if (typeof this.popupInfo === "string") {
            this.popup.setHTML(this.popupInfo);
        } else {
            this.popup.setDOMContent(this.popupInfo);
        }

        this.initSource(this.data);

        this.createRoadLayer(this.roadLayerInfo);
        this.createMarksLayer(this.layers);
        this.active = true;
        return;
        this.registerImages(this.images);

        //this.setData(this.data);


        this.initSource(this.coordinatesInit);

        this.createRoadLayer(this.roadLayerInfo);
        this.createTraceLayer(this.traceLayerInfo);

        this.createMobilLayer();

        this.createMarksLayer(this.layers2);

        this.setTraceMode(this.traceMode, true);

        this.startSetPosition();
        //this.playPopup();
        //this.flyTo();
    }

    getLayerId(){
        return this.layerId + this.layerIndex++;
    }
    createImage(info){
        if(info.type == "arrow"){
            return new Arrow(info);
        }
        if(info.type == "circle"){
            return new Point(info);
        }
        if(info.type == "pulsing"){
            return new Pulsing(info);
        }
    }
    addImage(info){
        this.iImages[info.name] = this.createImage(Object.assign({map:this.map}, info));
        this.map.addImage(info.name, this.iImages[info.name], { pixelRatio: 3 });
        this.onAddImage(info);
    }
    updateImage(info){

        if (this.map.hasImage(info.name)){
           this.map.removeImage(info.name);
           this.onUpdateImage(info);
        }
        this.addImage(info);
    }
    removeImage(info){
        if (this.map.hasImage(info.name)){
           this.map.removeImage(info.name);
           this.onRemoveImage(info);
        }
    }

    registerImages(images:any[]){
        images.forEach((image) => {
            this.addImage(image);
            /*
            const info = image;
            info.map = this.map;
            this.iImages[image.name] = this.createImage(info);
            this.map.addImage(image.name, this.iImages[image.name], { pixelRatio: 3 });
            */
        });

    }

    getImageObj(name:string){
        return this.iImages[name];
    }

    setData2(data) {
        this.data = data;
        this.coordinates = [];
        let fixDelay = 0;
        let ts = [];
        //console.log(this.data)
        this.data.forEach((data, index) => {
            this.coordinates.push(data.coordinates);

            ts[index] = data.ts;
            if (index > 0) {
                if (ts[index] - ts[index - 1] > 120) {
                    fixDelay += (ts[index] - ts[index - 1]) - 120;
                }
            }


            this.data[index].ts = data.ts - ts[0] - fixDelay;

        });
        /*
        for(let x in this.data){
            this.coordinates.push(this.data[x].coordinates);

            ts[x] = this.data[x].ts;
            if(x>0){
                if(ts[x] - ts[x-1]>120){
                    fixDelay += (ts[x] - ts[x-1]) - 120;
                }
            }


            this.data[x].ts = this.data[x].ts - ts[0] - fixDelay;

        }
        */
        this.coordinatesInit = this.coordinates.slice();

        //let index = this.data.findIndex((e)=>e.ts>=885);
    }

    createGeoJson(data){

        const geojson = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": data.map(e => [e.longitude,e.latitude])
                        }

                    }
                ]
            }
        };

        data.forEach((e, index) => {

            let point = {
                "type": "Feature",
                "properties": e,
                "geometry": {
                    "type": "Point",
                    "coordinates": [e.longitude, e.latitude]
                }
            };
            geojson.data.features.push(point);
        });

        return geojson;
    }

    initSource(data){
        this.map.addSource(this.mainSourceId, this.createGeoJson(data));
    }
    setData(data) {
        console.log(data)
        if (this.map.getSource(this.mainSourceId)) {
            this.map.getSource(this.mainSourceId).setData(this.createGeoJson(data).data);
        }
        console.log(data)

    }
    updateSource(data) {
        if (this.map.getSource(this.mainSourceId)) {
            this.map.getSource(this.mainSourceId).setData(this.createGeoJson(data).data);
        }

    }

    getAllLayers(){

        return [
            {
                id:this.roadLayerId,
                caption:"Camino",
                type:"x",
                color:"red",
                visible:true,
                group:0
            },
            {
                id:this.traceLayerId,
                caption:"Rastro",
                type:"x",
                color:"red",
                visible:true,
                group:0
            },
            {
                id:this.mobilLayerId,
                caption:"Mobil",
                type:"x",
                color:"red",
                visible:true,
                group:0
            }
        ].concat(this.layers);
    }

    setTraceLength(length){
        this.traceLength = length;
        this.setProgress(this.progress);
    }
    updateRoadLayer(roadLayerInfo){

        const paint = {
            "line-color": roadLayerInfo.color,
            "line-width": Number(roadLayerInfo.width),
            "line-opacity": Number(roadLayerInfo.opacity)
        }

        if(Number(roadLayerInfo.dash) > 0){
            paint["line-dasharray"] = [Number(roadLayerInfo.dash), Number(roadLayerInfo.dash)];
        }else{
            paint["line-dasharray"] = [1];
        }

        for(let key in paint){
            this.map.setPaintProperty(this.roadLayerId, key, paint[key]);
        }

    }

    createRoadLayer(roadLayerInfo?){
        if(roadLayerInfo !== undefined){
            this.roadLayerInfo = roadLayerInfo;
        }
        const paint = {
            "line-color": roadLayerInfo.color,
            "line-width": Number(roadLayerInfo.width),
            "line-opacity": Number(roadLayerInfo.opacity)
        }
        if(Number(roadLayerInfo.dash) > 0){
            paint["line-dasharray"] = [Number(roadLayerInfo.dash), Number(roadLayerInfo.dash)];
        }else{
            paint["line-dasharray"] = [1];
        }
        this.map.addLayer({
            "id": this.roadLayerId,
            "type": "line",
            "source": this.mainSourceId,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": (roadLayerInfo.visible) ? "visible" : "none"
            },
            "paint": paint,
            "filter": ["==", "$type", "LineString"]
        });
        this.registerLayer(this.roadLayerId);
    }

    updateTraceLayer(traceLayerInfo){

        const paint = {
            "line-color": traceLayerInfo.color,
            "line-width": Number(traceLayerInfo.width),
            "line-opacity": Number(traceLayerInfo.opacity)
        }

        if(Number(traceLayerInfo.dash) > 0){
            paint["line-dasharray"] = [Number(traceLayerInfo.dash), Number(traceLayerInfo.dash)];
        }else{
            paint["line-dasharray"] = [1];
        }

        for(let key in paint){
            this.map.setPaintProperty(this.traceLayerId, key, paint[key]);
        }

        this.setTraceLength(traceLayerInfo.length);
    }
    createTraceLayer(traceLayerInfo?){

        if(traceLayerInfo !== undefined){
            this.roadLayerInfo = traceLayerInfo;
        }

        const paint = {
            "line-color": traceLayerInfo.color,
            "line-width": Number(traceLayerInfo.width),
            "line-opacity": Number(traceLayerInfo.opacity)
        }

        if(Number(traceLayerInfo.dash) > 0){
            paint["line-dasharray"] = [Number(traceLayerInfo.dash), Number(traceLayerInfo.dash)];
        }else{
            paint["line-dasharray"] = [1];
        }

        this.map.addLayer({
            "id": this.traceLayerId,
            "type": "line",
            "source": this.traceSourceId,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                visibility: (traceLayerInfo.visible) ? "visible" : "visible"
            },
            "paint": paint,
            "filter": ["==", "$type", "LineString"]
        });
    }

    createMobilLayer(){
        const mobilLayerInfo = {
            color:"#ff9900",
            image:"vehiculo_004",
            size:0.4,
            width: 2,
            opacity:1.0,
            dasharray: 2,
            visible: true
        };
        this.map.addLayer({
            id: this.mobilLayerId,
            type: "symbol",
            source: this.traceSourceId,
            layout: {
                "visibility": (mobilLayerInfo.visible)?"visible":"none",
                "icon-image": mobilLayerInfo.image,//"vehiculo_004",
                "icon-size": mobilLayerInfo.size,
                "icon-rotate": ["get", "heading"],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                //"text-field":["get","speed"],
                //"text-offset":[0,5],
                //"text-ignore-placement": true,

            },
            paint: {},
            filter: ["in", "dot", '']

        });
    }

    createMarksLayer(layers){

        layers.forEach((layer, index: number) => {
            const id = this.imageLayer(layer);
            this.registerLayer(id);
            // this.playPopup(id, feature.className)
            /*if (layer.features && Array.isArray(layer.features)) {
                layer.features.forEach((feature) => {
                    ;

                });
            }*/
        });
    }



    setLine(info: object) {
        for (let p in info) {
            this.map.setPaintProperty(this.lineId, "line-" + p, info[p]);
        }
    }
    setFill(info: object) {
        for (let p in info) {
            this.map.setPaintProperty(this.circleId, "fill-" + p, info[p]);
        }
    }

    setVisible(value: boolean) {
        let visible = "none";
        if (value) {
            visible = "visible";
        }
        this.map.setLayoutProperty(this.lineId, "visibility", visible);
        this.map.setLayoutProperty(this.circleId, "visibility", visible);

        if (this._play) {

            this.map.setLayoutProperty(this.nodesId, "visibility", visible);
        }


    }

    add(point) {

        this.data.push(point);
        console.log(this.data)
        if (this.maxDelay) {
            const time = Math.trunc(Date.now() / 1000);
            this.data = this.data.filter((e) => (time - e.ts) < this.maxDelay);
        }
        console.log(this.data)
        this.updateSource(this.data);
    }

    createLayer(index, info) {

        //return this.imageLayer(index, info);
        switch (info.type) {
            case "arrow":
                this.arrowLayer(index, info);
                break;
            case "circle":
                this.circleLayer(index, info);
                break;
            case "pulsing":
                this.pulsingLayer(index, info);
                break;
        }
    }

    createLayerFilter(info){


        const t = [
            ["==","=="],
            ["!=","<>"],
            ["in","In [a, b, c...]"],
            ["not-in","NOT In [a, b, c...]"],
            [">=",">="],
            [">",">"],
            ["<=","<="],
            ["<","<"],
            ["()", "(n, m)"],
            ["[)", "[n, m)"],
            ["[]", "[n, m]"],
            ["(]", "(n, m]"]
        ];

        const property = ["get", info.prop];
        const value = (info.value || "").toString();

        let values: any = value.split(",");
        let propertysInfo = {
            type:"",
        };

        if (propertysInfo = this.propertysInfo[info.prop]) {

            if (propertysInfo.type === "string") {
                values = values.map( e =>{
                    return String(e);
                });
            }else if (propertysInfo.type === "number") {
                values = values.map( e =>{
                    return Number(e);
                });
            }

        } else if (typeof this.data[0]) {
            if(typeof this.data[0][info.prop] === "number"){
                values = values.map( e =>{
                    return Number(e);
                });

            }else if(typeof this.data[0][info.prop] === "string"){
                values = values.map(e=>{
                    return String(e);
                });
            }
        }

        switch(info.valueType){
            case "==":
                return ["==", property, values[0]];
            case "!=":
                return ["!=", property, values[0]];
            case "in":
                return ["in", info.prop].concat(values);
            case "not-in":
                return ["!in", info.prop].concat(values);
            case ">=":
                return [">=", property, values[0]];
            case ">":
                return [">", property, values[0]];
            case "<=":
                return ["<=", property, values[0]];
            case "<":
                return ["<", property, values[0]];
            case "()":
                return [
                    "all",
                    [">", property, values[0]],
                    ["<", property, values[1]]
                ];
            case "[)":
                return [
                    "all",
                    [">=", property, values[0]],
                    ["<", property, values[1]]
                ];
            case "[]":
                return [
                    "all",
                    [">=", property, values[0]],
                    ["<=", property, values[1]]
                ];
            case "(]":
                return [
                    "all",
                    [">", property, values[0]],
                    ["<=", property, values[1]]
                ];
        }

        return ["==","2","1"];
    }

    createLayerFilter2(info) {
        let filter = [];

        if (info.in !== undefined) {
            info.in.forEach((value) => {
                filter = ["in", info.prop, value];

            });
            return filter;

        }
        filter.push("all");
        if (info.from !== undefined) {
            filter.push([">", ["get", info.prop], info.from]);
        } else if (info.from_e !== undefined) {
            filter.push([">=", ["get", info.prop], info.from_e]);
        } else {
            filter.push(true);
        }

        if (info.to !== undefined) {
            filter.push(["<", ["get", info.prop], info.to]);
        } else if (info.to_e !== undefined) {
            filter.push(["<=", ["get", info.prop], info.to_e]);
        }

        return filter;

    }

    arrowLayer(index, info) {


        let filter = this.createLayerFilter(info);


        /*if(info.filter){
            for(let x in info.filter){
                filter = ["in", x, info.filter[x]]
            }
        }*/

        const id = this.layerId + this.layerIndex++;
        this.layersId.push(id);
        this.map.addLayer({
            "id": id,

            "minzoom": 13,
            "source": this.nodeSourceId,


            "type": "symbol",

            "layout": {
                "visibility": "visible",
                "icon-image": "arrow_002",
                "icon-size": 0.4,
                "icon-rotate": ["get", "heading"],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                //"text-field":["get","speed"],
                //"text-offset":[0,5],
                //"text-ignore-placement": true,
            },
            //"paint": paint,
            //filter: ["in", "$type", "Point"]
            //filter: ["in", "type", "h", "m"]
            //filter: ["in", "type"]
            //filter:['>=',"speed",31]
            //filter:["case",[">=",["get","speed"],31], true,false]
            //filter:["any",['>=',"speed",31],['>=',"speed",30]]
            filter: filter

        });

    }

    circleLayer(index, info) {



        let paint = {
            "circle-radius": info.radius || 4,
            //"circle-opacity":["case",["=>",["get","type"],30] , 0.0, 0.8],
            "circle-color": info.color || "red",
            //"circle-color":["case",[">=",["get","speed"],31] , "red",[">=",["get","speed"],21],"yellow" ,[">=",["get","speed"],11],'#00d4ff',[">=",["get","speed"],1],'#f743b7',"purple"],
            "circle-stroke-color": info.borderColor || "white",
            "circle-stroke-width": info.borderWidth || 2
        };
        if (info.paint) {
            for (let x in info.paint) {
                paint["circle-" + x] = info.paint[x];
            }
        }

        paint["circle-" + "color"] = info.color || "blue";
        paint["circle-" + "opacity"] = 0.9
        let filter = this.createLayerFilter(info);


        /*if(info.filter){
            for(let x in info.filter){
                filter = ["in", x, info.filter[x]]
            }
        }*/

        const id = this.layerId + this.layerIndex++;
        this.layersId.push(id);
        this.map.addLayer({
            "id": id,
            "type": "circle",
            "minzoom": 13,
            "source": this.nodeSourceId,
            "layout": {
                "visibility": info.visible ? "visible" : "none"
            },
            "paint": paint,
            //filter: ["in", "$type", "Point"]
            //filter: ["in", "type", "h", "m"]
            //filter: ["in", "type"]
            //filter:['>=',"speed",31]
            //filter:["case",[">=",["get","speed"],31], true,false]
            //filter:["any",['>=',"speed",31],['>=',"speed",30]]
            filter: filter

        });

    }

    imageLayer(info) {


        const id = this.getLayerId();
        info.id = id;
        this.layersId.push(id);

        let filter = this.createLayerFilter(info);

        if(!this.map.hasImage(info.image)){
            console.log("errror");
        }

        this.map.addLayer({
            "id": id,
            "type": "symbol",
            "source": this.mainSourceId,
            "layout": {
                //visibility:["get", "visible"],
                "visibility": info.visible ? "visible" : "none",
                "icon-image": info.image,
                "icon-size": 1.0 * (info.scale || 1),
                "icon-rotate": ["get", "heading"],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
            },
            filter: filter
        });//, this.mobilLayerId
        this.playPopup(id, info.className);
        this.onAddLayer(info);
        return id;
    }

    updateImageLayer(info) {

        const layout = {
            "visibility": "visible",
            "icon-image": info.image,
            "icon-size": 1.0 * (info.scale || 1),
            "icon-rotate": ["get", "heading"]
        };

        for(let key in layout){
            this.map.setLayoutProperty(info.id, key, layout[key]);
        }

        this.map.setFilter(info.id, this.createLayerFilter(info));

        this.onUpdateLayer(info);

        return info.id;
    }

    pulsingLayer(index, info) {


        const id = this.layerId + this.layerIndex++;
        this.layersId.push(id);

        let filter = this.createLayerFilter(info);
        this.map.addLayer({
            "id": id,
            "type": "symbol",
            "source": this.nodeSourceId,
            "layout": {
                //visibility:["get", "visible"],
                "visibility": info.visible ? "visible" : "none",
                "icon-image": `pulsing-${info.color}`,
                "icon-size": 0.4,
                "icon-rotate": ["get", "heading"],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
            },
            filter: filter
        });
    }

    dataFilter(data) {
        let geojson = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []//[polygon, point]
            }
        };

        data.forEach((element, index) => {

            let point = {
                "type": "Feature",
                "properties": this.data[index],
                "geometry": {
                    "type": "Point",
                    "coordinates": element
                }
            };
            geojson.data.features.push(point);
        });
        return geojson;
    }

    addProgress(deltaTime) {
        //console.log("Speedfactor: ", this.speedFactor);
        if (this.reverse) {
            //this.progress = this.progress - (deltaTime * this.speedFactor);
        } else {
            //this.progress = this.progress + (deltaTime * this.speedFactor);
        }

        this.progress = this.progress + (deltaTime * this.speedFactor);

        if(this.progress < 0){
            //console.log("ERROR A progress: ",this.progress);
            this.progress = 0;
        }else if(this.progress > this.data[this.data.length - 1].ts){
            //console.log("ERROR B progress: ", this.data[this.data.length - 1],this.progress);
            this.progress = this.data[this.data.length - 1].ts;
        }
        //console.log("progress: ",this.progress);
        this.setProgress(this.progress);
    }
    setProgress(progress: number) {

        this.progress = progress;

        let index = this.data.findIndex((e) => e.ts >= this.progress);
        //console.log("index ", index);
        if (index < 0) {
            index = this.data.length - 1;
        }

        let coordinates = this.coordinates = this.coordinatesInit.slice(0, index + 1);

        let nextPoint = null;
        let nextBearing = null;

        if (index > 0) {
            let delta = this.data[index].ts - this.progress;
            let totalTime = this.data[index].ts - this.data[index - 1].ts;

            //calculating next point
            let pointFrom = this.coordinatesInit[index - 1];
            let pointTo = this.coordinatesInit[index];
            let line = turf.lineString([pointFrom, pointTo]);
            let totalLength = turf.length(line, { units: "meters" });

            nextPoint = turf.getCoords(turf.along(line, totalLength - delta * totalLength / totalTime, { units: "meters" }));

            // calculating simulated bearing
            let point1 = turf.point(pointFrom);
            let point2 = turf.point(pointTo);

            nextBearing = turf.bearing(point1, point2);
        } else {
            nextPoint = this.coordinatesInit[0];
            nextBearing = this.data[0].heading;
        }

        this.data[index].tempHeading = nextBearing;

        coordinates.push(nextPoint);

        if (index > 0) {
            // creating the trace line of fixed length
            let line = turf.lineString(coordinates);
            let totalLength = turf.length(line, { units: "meters" });
            var start = totalLength - this.traceLength;
            var stop = totalLength;
            if (start > 0) {
                var sliced = turf.lineSliceAlong(line, start, stop, { units: "meters" });
                coordinates = turf.getCoords(sliced);
            }
        }
        this._lastIndex = index;
        this.drawTraceLine(coordinates);
    }

    drawTraceLine(coordinates) {

        let geojson = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [

                    {
                        "type": "Feature",
                        "properties": {
                            "color": "#f743d8"
                        },
                        "geometry": {
                            "type": "LineString",
                            "coordinates": coordinates
                        }
                    },
                    {
                        "type": "Feature",
                        "properties": {
                            "heading": this.data[this._lastIndex].tempHeading || 0,//nextBearing,
                            "speed": this.data[this._lastIndex].speed || 0,
                            "dot": "",
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": coordinates[coordinates.length - 1]
                        }
                    }
                ]
            }
        };

        this.map.getSource(this.traceSourceId).setData(geojson.data);
        //this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit.slice(0, this._lastIndex)).data);
        //this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit).data);
        this.setTraceMode(this.traceMode);
        this.ondraw(coordinates);

    }

    draw(nextPoint, nextBearing) {

        this.coordinates = this.coordinatesInit.slice(0, this._lastIndex + 1);
        this.coordinates.push(nextPoint);
        if (this._lastIndex > 0) {
            // creating the trace line of fixed length
            let line = turf.lineString(this.coordinates);
            let totalLength = turf.length(line, { units: "meters" });
            var start = totalLength - 1000;
            var stop = totalLength;
            if (start > 0) {
                var sliced = turf.lineSliceAlong(line, start, stop, { units: "meters" });
                this.coordinates = turf.getCoords(sliced);
            }
        }
        let geojson = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [

                    {
                        "type": "Feature",
                        "properties": {
                            "color": "#f743d8"
                        },
                        "geometry": {
                            "type": "LineString",
                            "coordinates": this.coordinates
                        }
                    }
                ]
            }
        };

        let heading = 0, speed = 0;
        if (this.data[this._lastIndex]) {
            heading = this.data[this._lastIndex].heading;
            speed = this.data[this._lastIndex].speed;
        }


        let point = {
            type: "Feature",
            properties: {
                "heading": nextBearing,
                "speed": speed,
                dot: '',
            },
            geometry: {
                type: "Point",
                coordinates: this.coordinates[this.coordinates.length - 1]
            }
        };
        geojson.data.features.push(point);


        this.map.getSource(this.traceSourceId).setData(geojson.data);
        this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit.slice(0, this._lastIndex + 1)).data);



        this.ondraw(this.coordinates);



    }
    play() {

        this.setStatus(1);
        this.startTime = performance.now();
        this.resetTime = true;

        let animateLine = (timestamp?) => {

            if (timestamp > 0) {
                //this.animation = requestAnimationFrame(animateLine);
                //return;
                const delta = timestamp - this.startTime;
                this.startTime = timestamp;
                //console.log("delta", delta);
                this.addProgress(delta);
            }


            this.animation = requestAnimationFrame(animateLine);
        };
        animateLine(0);
    }
    restart() {
        this.resetTime = true;
        this.play();
    }

    setStatus(status) {
        this._status = status;
        if (status == 0) {
            this.map.setLayoutProperty(this.traceLayerId, "visibility", "none");
            this.map.setLayoutProperty(this.mobilLayerId, "visibility", "none");
            this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit).data);
        } else {
            this.map.setLayoutProperty(this.traceLayerId, "visibility", "visible");
            this.map.setLayoutProperty(this.mobilLayerId, "visibility", "visible");
        }

    }
    getStatus() {
        return this._status;
    }
    goTo(index) {
        //this.setStatus(2);
        //cancelAnimationFrame(this.animation);

        //let index = this._lastIndex + n;
        if (index < 0) {
            index = 0;
        }
        if (index > this.coordinatesInit.length - 1) {
            index = this.coordinatesInit.length - 1;
        }

        this._lastIndex = index;

        this.setProgress(this.data[this._lastIndex].ts);
    }
    setSpeed(speed) {
        this.speedFactor = speed;
    }
    setSpeedFactor(speedFactor) {
        this.speedFactor = speedFactor;
    }
    step(n) {
        this.setStatus(2);
        cancelAnimationFrame(this.animation);

        let index = this._lastIndex + n;
        if (index < 0) {
            index = 0;
        }
        if (index > this.coordinatesInit.length - 1) {
            index = this.coordinatesInit.length - 1;
        }

        this._lastIndex = index;

        this.setProgress(this.data[this._lastIndex].ts);
    }
    goBegin() {
        this.setStatus(2);
        cancelAnimationFrame(this.animation);
        this._lastIndex = 0;
        this.setProgress(this.data[this._lastIndex].ts);
    }
    goEnd() {
        cancelAnimationFrame(this.animation);
        this.setStatus(2);

        this._lastIndex = this.data.length - 1;
        this.setProgress(this.data[this._lastIndex].ts);

    }
    pause() {
        cancelAnimationFrame(this.animation);
        this.setStatus(2);
        //this.setProgress(this.data[this._lastIndex].ts);

    }

    setReverse(value) {
        this.reverse = value;
    }

    playOriginal() {

        this.setStatus(1);
        this.startTime = performance.now();

        this.resetTime = true;


        let animateLine = (timestamp?) => {

            let deltaTime = timestamp - this.startTime;

            if (this.resetTime) {
                // resume previous progress
                this.startTime = performance.now() - this.progress;

                this.coordinates = [];
                this.resetTime = false;
            } else {

                if (this.reverse) {
                    this.progress = this.endTime - (timestamp - this.endTime);

                } else {
                    this.progress = timestamp - this.startTime;
                    this.endTime = this.progress;
                }

            }
            console.log(this.progress);
            if (this.progress < 0) {
                this.progress = 0;
            }

            let speed = this.progress * this.speedFactor;

            let index = this.data.findIndex((e) => e.ts >= speed);
            this._lastIndex = index;

            if (this._lastIndex + 1 == this.data.length) {
                cancelAnimationFrame(this.animation);
                return;
            }

            let nextPoint = null;
            let nextBearing = null;
            if (index > 0) {

                let delta = this.data[index].ts - speed;
                let totalTime = this.data[index].ts - this.data[index - 1].ts;

                //calculating next point
                let pointFrom = this.coordinatesInit[index - 1];
                let pointTo = this.coordinatesInit[index];
                let line = turf.lineString([pointFrom, pointTo]);
                let totalLength = turf.length(line, { units: "meters" });

                nextPoint = turf.getCoords(turf.along(line, totalLength - delta * totalLength / totalTime, { units: "meters" }));

                // calculating simulated bearing
                let point1 = turf.point(pointFrom);
                let point2 = turf.point(pointTo);

                nextBearing = turf.bearing(point1, point2);

            } else {

                nextPoint = this.coordinatesInit[0];
                nextBearing = this.data[0].heading;
            }

            this.draw(nextPoint, nextBearing);

            // Request the next frame of the animation.
            this.animation = requestAnimationFrame(animateLine);
        };
        animateLine();
    }

    stop() {

        if (this._status != 0) {

            cancelAnimationFrame(this.animation);
            this.setStatus(0);
            this.progress = 0;
            this._lastIndex = 0;
        }
    }

    reset() {
        alert("reset")
        if (!this._play) {
            return;
        }
        this._mode = 1;
        if (this.coordinatesInit) {
            this.coordinates = this.coordinatesInit.slice();
            this.draw();
            return;
        } else {
            this.coordinates = [];
        }

        this._line = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [this.coordinates]
                    }
                }]
            }
        };
        //this._line.data.features = [];
        this.map.getSource(this.lineId).setData(this._line.data);
    }

    delete() {
        this.stop();
        this.stopSetPosition();
        const map = this.map;

        /* Delete Custom Layers */
        this.layersId.forEach((id) => {

            if (map.getLayer(id)) {

                map.removeLayer(id);
            }
        });

        /* Delete Layers */
        if (map.getLayer(this.mobilLayerId)) map.removeLayer(this.mobilLayerId);
        if (map.getLayer(this.traceLayerId)) map.removeLayer(this.traceLayerId);
        if (map.getLayer(this.roadLayerId)) map.removeLayer(this.roadLayerId);

        /* Delete Sources */
        if (map.getSource(this.nodeSourceId)) map.removeSource(this.nodeSourceId);
        if (map.getSource(this.traceSourceId)) map.removeSource(this.traceSourceId);
        if (map.getSource(this.roadSourceId)) map.removeSource(this.roadSourceId);

        if (map.getSource(this.mainSourceId)) map.removeSource(this.mainSourceId);

        return;
        /* Delete Images */
        for(let x in this.iImages){
            if (this.map.hasImage(x)){
                this.map.removeImage(x);
             }
        }
        this.iImages = [];
    }

    flyTo(zoom, speed) {

        var coordinates = this.coordinates;

        // Pass the first coordinates in the LineString to `lngLatBounds` &
        // wrap each coordinate pair in `extend` to include them in the bounds
        // result. A variation of this technique could be applied to zooming
        // to the bounds of multiple Points or Polygon geomteries - it just
        // requires wrapping all the coordinates with the extend method.
        var bounds = coordinates.reduce(function (bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        this.map.fitBounds(bounds, {
            padding: 40
        });

        return;

        let polygon = turf.lineString(this.coordinates);

        let centroid = turf.centroid(polygon);



        this.map.flyTo({
            center: centroid.geometry.coordinates,
            zoom: zoom || this.flyToZoom,
            speed: speed || this.flyToSpeed,
            curve: 1,
            easing(t) {
                return t;
            }
        });

    }
    panTo(duration) {

        //this.map.setLayerZoomRange(this.circleId, 2, 5);




        let polygon = turf.lineString(this.coordinates);

        let centroid = turf.centroid(polygon);



        this.map.panTo(centroid.geometry.coordinates, { duration: duration || this.panDuration });
    }

    showLayer(id, value) {
        this.map.setLayoutProperty(id, "visibility", (value) ? "visible" : "none");
    }

    registerLayer(id) {
        this.mapLayers.push(id);
    }
    showLayerIx(index, value) {
        if (this.mapLayers[index]) {
            this.map.setLayoutProperty(this.mapLayers[index], "visibility", (value) ? "visible" : "none");
        }
    }


    setTraceMode(mode, init?:boolean){

        if(this.traceMode == mode && mode == 0 && init === undefined){
            return;
        }
        this.traceMode = mode;
        if(mode == 0){
            this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit).data);
        }else if(mode == 1){
            this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit.slice(0, this._lastIndex + 1)).data);
        }else if(mode == 2){

        }
              //this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit.slice(0, this._lastIndex)).data);
        //this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit).data);

    }


    startSetPosition(){
        this.map.on("contextmenu", this.funContextMenu = (e) => {

            //console.log(this.coordinatesInit);
            let line = turf.lineString(this.coordinatesInit);
            let snapped = turf.nearestPointOnLine(line,[e.lngLat.lng, e.lngLat.lat],  { units: "meters" });
            this.goTo(snapped.properties.index);
        });
    }

    stopSetPosition(){
        this.map.off("contextmenu", this.funContextMenu);
    }

    setPopup(popup){
        this.popup = popup;
    }
    getPopup(popup){
        return this.popup;
    }
    removeLayer(id){

        if (this.map.getLayer(id)){
            this.map.removeLayer(id);
            this.onRemoveLayer(id);
        }

    }
    playPopup(layerId, className){
        /*
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
            });
            */
        const map = this.map;
        map.on("mouseenter", layerId, (e) => {

            const coords = this.data.map(e => [e.longitude, e.latitude]);
            const info = e.features[0].properties;

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = "pointer";

            info.layerId = layerId;
            info.className = className;
            info.length = 0;

            if (coords.length > 1) {
                let line = turf.lineString(coords);
                info.length = turf.length(line, {units: "meters"}).toFixed(2);
            }

            var coordinates = e.features[0].geometry.coordinates.slice();

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            //popup.setLngLat(coordinates).setHTML(description).addTo(map);
            this.onShowInfo(info);
            this.popup.setLngLat(coordinates).addTo(map);
        });

        map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = '';
            this.popup.remove();
            //popup.remove();
        });
    }
}