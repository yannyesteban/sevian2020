interface MobilInfo {
    coordinates: number[],
    speed: number,
    heading: number
}

export class Trace {
    map: any = null;
    type: string = "trace";
    parent: object = null;
    name: string = "";
    visible: boolean = true;
    data: any = null;
    coordinates = null;
    coordinatesInit = null;

    flyToSpeed: number = 0.8;
    flyToZoom: number = 14;
    panDuration: number = 5000;


    layers: any = [];
    layers2: any = [];
    groups: any = [];
    _layers: any = [];

    maxLines: number = 0;
    line: object = {
        color: "blue",//"#FFA969",
        width: 3,
        opacity: 0.9,
        dasharray: [1]
    };
    fill: object = {
        color: "#f9f871",
        opacity: 0.4
    };
    lineEdit: object = {
        color: "red",//"#ff3300",
        width: 1,
        opacity: 0.9,
        dasharray: [2, 2]
    };
    fillEdit: object = {
        color: "#ff9933",
        opacity: 0.4
    };
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

    ondraw: Function = (coordinates) => { };


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

    private reverse: boolean = false;

    private mobil: MobilInfo = null;
    //private pause:boolean = false;
    private traceMode = 0;

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

        this.roadSourceId = "rs-" + this.id;
        this.traceSourceId = "ts-" + this.id;
        this.nodeSourceId = "ns-" + this.id;
        //this.mobilSourceId = "ms-" + this.id;

        this.roadLayerId = "rl-" + this.id;
        this.traceLayerId = "tl-" + this.id;
        this.mobilLayerId = "ml-" + this.id;

        //this.lineLayerId = "ll-" + this.id;
        this.init();
    }

    init() {

        /*this.coordinates = [];
        let fixDelay = 0;
        let ts = [];
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
        this.coordinatesInit = this.coordinates.slice();
        console.log(this.data)
        //let index = this.data.findIndex((e)=>e.ts>=885);
        */
        this.setData(this.data);
        this.drawLineA();
        //let map = this.map;
        this.flyTo();



        return;


        //let polygon = turf.polygon([coo], { name: "poly1" });
        //polygon = turf.bezierSpline(polygon);
        //            console.log(polygon)





        /*
        this.map.addLayer({
            "id": this.circleId,
            "type": "fill",
            "source": this.lineId,
            "layout": {
                visibility:(this.visible)? "visible": "none"
            },
            "paint": {
                //"fill-color": "#ff9900",
                //"fill-opacity": 0.4,
            },
            "filter": ["==", "$type", "Polygon"]
        });
        */
        //this.setLine(this.line);
        //this.setFill(this.fill);

        map.addLayer({
            id: this.pulsingId,
            type: "symbol",
            source: this.lineId,
            layout: {
                //visibility:["get", "visible"],
                "icon-image": "pulsing-dot",
                "icon-size": 0.4,
                "icon-rotate": ["get", "heading"],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                //"text-field":["get","speed"],
                //"text-offset":[0,5],
                //"text-ignore-placement": true,

            },
            paint: {

            },
            //filter: ["in", "$type", "Point"]
            filter: ["in", "dot", "dot"]

        });




        map.addLayer({
            id: this.nodesId + "2",
            type: "circle",
            source: this.lineIdA,
            layout: {
                visibility: "visible"
            },
            paint: {
                "circle-radius": 5,
                "circle-opacity": 0.8,
                "circle-color": "green",
                "circle-stroke-color": "#ff3300",
                "circle-stroke-width": 1
            },
            //filter: ["in", "$type", "Point"]
            filter: ["in", "type", "m"]
            //filter: ["in", "type"]
        });

        //this.setLine(this.line);
        //this.setFill(this.fill);


        this.coordinates = [];


    }

    setData(data) {
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
        console.log(this.data)
        //let index = this.data.findIndex((e)=>e.ts>=885);            
    }
    drawLineA() {

        const roadSource = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": this.coordinatesInit
                    }

                }]//[polygon, point]
            }
        };
        this.map.addSource(this.roadSourceId, roadSource);
        this.map.addLayer({
            "id": this.roadLayerId,
            "type": "line",
            "source": this.roadSourceId,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": (this.visible) ? "visible" : "none"
            },
            "paint": {
                "line-color": "#ff9900",
                "line-width": 2,
                "line-opacity": 0.8,
                //"line-gap-width":4,
                "line-dasharray": [2, 2]
            },
            "filter": ["==", "$type", "LineString"]
        });


        /*
        let lineString = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": this.coordinatesInit
            }
        
        };

        mainSource.data.features.push(lineString);
        */


        const traceSource = this._line = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [[]]
                        }
                    }
                ]
            }
        };

        this.map.addSource(this.traceSourceId, traceSource);

        // layer of trace line
        this.map.addLayer({
            "id": this.traceLayerId,
            "type": "line",
            "source": this.traceSourceId,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                visibility: (this.visible) ? "visible" : "none"
            },
            "paint": {
                "line-color": ["get", "color"],
                "line-width": 5,
                //"line-opacity": 0.9,
                //"line-gap-width":4,
                //"line-dasharray":[2,2]
                //"line-dasharray":[1,1]

            },
            "filter": ["==", "$type", "LineString"]
        });

        //this.map.addSource(this.layerSourceId, this.dataFilter(this.coordinatesInit));
        this.map.addSource(this.nodeSourceId, this.dataFilter([]));

        this.layers2.forEach((layer, index) => {

            console.log(layer);
            if (layer.features && Array.isArray(layer.features)) {
                layer.features.forEach((feature, index) => {
                    this.createLayer(index, feature);

                });
            }



            //e.id = "t_layer"+index;
            //e.map = this.map;
            //e.data = this.data;
            //e.range = [null, null];
            //e.source = this.layerSourceId;
            //this._layers[index] = new TraceLayer(e);


            //this.createLayer(index, e);


        });
        this.setTraceMode(this.traceMode, true);
        
        //this.map.setFilter("t_layer"+0,[">=",["get","i"],100]);
        //this.map.setFilter("t_layer"+1,[">=",["get","i"],100]);
        //this.map.setFilter("t_layer"+2,[">=",["get","i"],100]);
        //this.map.setFilter("t_layer"+10,["<=",["get","i"],30]);

        this.map.addLayer({
            id: this.mobilLayerId,
            type: "symbol",
            source: this.traceSourceId,
            layout: {
                visibility: "visible",
                "icon-image": "vehiculo_004",
                "icon-size": 0.4,
                "icon-rotate": ["get", "heading"],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                //"text-field":["get","speed"],
                //"text-offset":[0,5],
                //"text-ignore-placement": true,

            },
            paint: {
                //"icon-color":"#4d0000",
                "icon-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "speed"],
                    0,
                    "green",
                    25,
                    "yellow",
                    50,
                    "blue",
                    75,
                    "green",
                    100,
                    "rgb(209,229,240)",
                    120,
                    "orange",
                    140,
                    "red",
                    160,
                    "black"
                ],



                //"circle-radius": 4,
                //"circle-opacity":["case",["==",["get","type"],"m"] , 0.0, 0.8],
                //"circle-color": "orange",
                //"circle-stroke-color":"yellow",
                //"circle-stroke-width":1
            },
            filter: ["in", "dot", '']
            //filter: ["in", "$type", "Point"]
            //filter: ["in", "type", "h", "m"]
            //filter: ["in", "type"]
        });
        

    }
    drawLineAA() {

        const roadSource = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": this.coordinatesInit
                    }

                }]//[polygon, point]
            }
        };
        this.map.addSource(this.roadSourceId, roadSource);
        this.map.addLayer({
            "id": this.roadLayerId,
            "type": "line",
            "source": this.roadSourceId,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": (this.visible) ? "visible" : "none"
            },
            "paint": {
                "line-color": "#ff9900",
                "line-width": 2,
                "line-opacity": 0.8,
                //"line-gap-width":4,
                "line-dasharray": [2, 2]
            },
            "filter": ["==", "$type", "LineString"]
        });


        /*
        let lineString = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": this.coordinatesInit
            }
        
        };

        mainSource.data.features.push(lineString);
        */


        const traceSource = this._line = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [
                    {
                        "type": "Feature",
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [[]]
                        }
                    }
                ]
            }
        };

        this.map.addSource(this.traceSourceId, traceSource);

        // layer of trace line
        this.map.addLayer({
            "id": this.traceLayerId,
            "type": "line",
            "source": this.traceSourceId,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                visibility: (this.visible) ? "visible" : "none"
            },
            "paint": {
                "line-color": ["get", "color"],
                "line-width": 5,
                //"line-opacity": 0.9,
                //"line-gap-width":4,
                //"line-dasharray":[2,2]
                //"line-dasharray":[1,1]

            },
            "filter": ["==", "$type", "LineString"]
        });

        //this.map.addSource(this.layerSourceId, this.dataFilter(this.coordinatesInit));
        this.map.addSource(this.nodeSourceId, this.dataFilter([]));

        this.layers2.forEach((layer, index) => {

            console.log(layer);
            if (layer.features && Array.isArray(layer.features)) {
                layer.features.forEach((feature, index) => {
                    this.createLayer(index, feature);

                });
            }



            //e.id = "t_layer"+index;
            //e.map = this.map;
            //e.data = this.data;
            //e.range = [null, null];
            //e.source = this.layerSourceId;
            //this._layers[index] = new TraceLayer(e);


            //this.createLayer(index, e);


        });
        //this.map.setFilter("t_layer"+0,[">=",["get","i"],100]);
        //this.map.setFilter("t_layer"+1,[">=",["get","i"],100]);
        //this.map.setFilter("t_layer"+2,[">=",["get","i"],100]);
        //this.map.setFilter("t_layer"+10,["<=",["get","i"],30]);

        this.map.addLayer({
            id: this.mobilLayerId,
            type: "symbol",
            source: this.traceSourceId,
            layout: {
                visibility: "visible",
                "icon-image": "vehiculo_004",
                "icon-size": 0.4,
                "icon-rotate": ["get", "heading"],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                //"text-field":["get","speed"],
                //"text-offset":[0,5],
                //"text-ignore-placement": true,

            },
            paint: {
                //"icon-color":"#4d0000",
                "icon-color": [
                    "interpolate",
                    ["linear"],
                    ["get", "speed"],
                    0,
                    "green",
                    25,
                    "yellow",
                    50,
                    "blue",
                    75,
                    "green",
                    100,
                    "rgb(209,229,240)",
                    120,
                    "orange",
                    140,
                    "red",
                    160,
                    "black"
                ],



                //"circle-radius": 4,
                //"circle-opacity":["case",["==",["get","type"],"m"] , 0.0, 0.8],
                //"circle-color": "orange",
                //"circle-stroke-color":"yellow",
                //"circle-stroke-width":1
            },
            filter: ["in", "dot", '']
            //filter: ["in", "$type", "Point"]
            //filter: ["in", "type", "h", "m"]
            //filter: ["in", "type"]
        });
        return;

        this.coordinatesInit.forEach((element, index) => {
            let point = {
                type: "Feature",
                "properties": {
                    "iconImage": this.data[index].iconImage,
                    "speed": this.data[index].speed,
                    "heading": this.data[index].heading,
                    "event": this.data[index].event,
                },
                geometry: {
                    type: "Point",
                    coordinates: element
                }
            };
            geojson.data.features.push(point);
        });





        this.map.addSource(this.lineIdA, geojson);

        this.map.addLayer({
            "id": this.lineIdA,
            "type": "line",
            "source": this.lineIdA,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                visibility: (this.visible) ? "visible" : "none"

            },
            "paint": {
                "line-color": "#ff9900",
                "line-width": 2,
                "line-opacity": 0.8,
                //"line-gap-width":4,
                "line-dasharray": [2, 2]


            },
            "filter": ["==", "$type", "LineString"]
        });


        this.map.addLayer({
            id: this.lineIdA + "3",
            type: "circle",
            "minzoom": 13,
            "source": this.lineIdA,
            layout: {
                visibility: "visible"
            },
            paint: {
                "circle-radius": 4,
                //"circle-opacity":["case",["=>",["get","type"],30] , 0.0, 0.8],
                //"circle-color": "white",
                "circle-color": ["case", [">=", ["get", "speed"], 31], "red", [">=", ["get", "speed"], 21], "yellow", [">=", ["get", "speed"], 11], '#00d4ff', [">=", ["get", "speed"], 1], '#f743b7', "purple"],
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 1
            },
            //filter: ["in", "$type", "Point"]
            //filter: ["in", "type", "h", "m"]
            //filter: ["in", "type"]
            //filter:['>=',"speed",31]
            //filter:["case",[">=",["get","speed"],31], true,false]
            filter: ["any", ['>=', "speed", 31], ['>=', "speed", 30]]

        });



        return;
        this.map.addLayer({
            id: this.lineIdA + "3",
            type: "symbol",
            "source": this.lineIdA,
            layout: {
                //visibility:["get", "visible"],
                "icon-image": ["get", "iconImage"],
                "icon-size": 0.4,
                "icon-rotate": ["get", "heading"],
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                //"text-field":["get","speed"],
                //"text-offset":[0,5],
                //"text-ignore-placement": true,

            },
            paint: {

            },
            //filter: ["in", "$type", "Point"]
            //filter:["in","dot", "dot"]
            "filter": ['==', "$type", "Point"]

        });
        return;
        this.map.addLayer({
            id: this.nodesId + "cc",
            type: "circle",
            source: this.lineIdA,
            layout: {
                visibility: "none"
            },
            paint: {
                "circle-radius": 3,
                "circle-opacity": 0.5,
                "circle-color": "white",
                "circle-stroke-color": "#ff3300",
                "circle-stroke-width": 1
            },
            filter: ["in", "$type", "Point"]
            //filter: ["in", "type", "h", "m"]
            //filter: ["in", "type"]
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

    add(lngLat) {
        if (!this.coordinates) {
            this.coordinates = [];
        }
        this.coordinates.push([lngLat.lng, lngLat.lat]);
        this.draw();
    }
    createLayer(index, info) {
        switch (info.type) {
            case "circle":
                this.circleLayer(index, info);
                break;
            case "pulsing":
                this.pulsingLayer(index, info);
                break;
        }
    }

    createLayerFilter(info) {
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

        console.log(filter);
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
        console.log("Speedfactor: ", this.speedFactor);
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

        let coordinates = this.coordinates = this.coordinatesInit.slice(0, index);

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
            var start = totalLength - 1000;
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

        this.coordinates = this.coordinatesInit.slice(0, this._lastIndex);
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
        this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit.slice(0, this._lastIndex)).data);



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

    showLayer(index, value) {
        this.map.setLayoutProperty(this.layerId + index, "visibility", (value) ? "visible" : "none");

    }

    setTraceMode(mode, init?:boolean){

        if(this.traceMode == mode && mode == 0 && init === undefined){
            return;
        }
        this.traceMode = mode;
        if(mode == 0){
            this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit).data);  
        }else if(mode == 1){
            this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit.slice(0, this._lastIndex)).data);           
        }else if(mode == 2){

        }
              //this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit.slice(0, this._lastIndex)).data);
        //this.map.getSource(this.nodeSourceId).setData(this.dataFilter(this.coordinatesInit).data);

    }
}