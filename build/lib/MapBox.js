var ctMap = ctMap || [];
var Mark;
var createGeoJSONRectangle = function (p1, p2 = null) {
    //let line = turf.lineString([p1, p2]);
    //let bbox = turf.bbox(line);
    //let bboxPolygon = turf.bboxPolygon(bbox);
    let ret;
    if (p2) {
        ret = [[
                [p1[0], p1[1]],
                [p2[0], p1[1]],
                [p2[0], p2[1]],
                [p1[0], p2[1]],
                [p1[0], p1[1]]
            ]];
    }
    else {
        ret = [[p1]];
    }
    //let ret = bboxPolygon.geometry.coordinates;
    //ret.push(ret[0]);
    let json = {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": ret
                    }
                }]
        }
    };
    ret[0].forEach((item, index) => {
        if (index >= 4) {
            return;
        }
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": item
            },
            "properties": {
                "index": index,
                "type": "h",
            }
        };
        json.data.features.push(point);
    });
    // 
    p1 = null, p2 = null;
    let midpoint = null;
    ret[0].forEach((item, index) => {
        if (index > 0) {
            p2 = turf.point(item);
            midpoint = turf.midpoint(p1, p2);
            p1 = p2;
        }
        else {
            p1 = turf.point(item);
            return;
        }
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": midpoint.geometry.coordinates
            },
            "properties": {
                "index": 3 + index,
                "type": "m",
            }
        };
        json.data.features.push(point);
    });
    return json;
};
var createGeoJSONPoly = function (coords, ini) {
    let c = [];
    let ret = coords.slice();
    ret.push(ret[0]);
    let json = {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
        }
    };
    coords.forEach((item, index) => {
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": item
            },
            "properties": {
                "index": index,
                "type": "h",
            }
        };
        json.data.features.push(point);
    });
    let p1 = null, p2 = null, midpoint = null;
    ret.forEach((item, index) => {
        if (index > 0) {
            p2 = turf.point(item);
            midpoint = turf.midpoint(p1, p2);
            p1 = p2;
        }
        else {
            p1 = turf.point(item);
            return;
        }
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": midpoint.geometry.coordinates
            },
            "properties": {
                "index": index,
                "type": "m",
            }
        };
        json.data.features.push(point);
    });
    return json;
};
var createGeoJSONLine = function (coords, ini) {
    let ret = coords;
    let json = {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": ret
                    }
                }]
        }
    };
    coords.forEach((item, index) => {
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": item
            },
            "properties": {
                "index": index,
                "type": "h",
            }
        };
        json.data.features.push(point);
    });
    let p1 = null, p2 = null, midpoint = null;
    ret.forEach((item, index) => {
        if (index > 0) {
            p2 = turf.point(item);
            midpoint = turf.midpoint(p1, p2);
            p1 = p2;
        }
        else {
            p1 = turf.point(item);
            return;
        }
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": midpoint.geometry.coordinates
            },
            "properties": {
                "index": index,
                "type": "m",
            }
        };
        json.data.features.push(point);
    });
    return json;
};
var createGeoJSONCircle = function (center, radiusInKm, points) {
    if (!points)
        points = 64;
    var coords = {
        latitude: center[1],
        longitude: center[0]
    };
    var km = radiusInKm;
    var ret = [];
    let hands = [];
    var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    var distanceY = km / 110.574;
    var theta, x, y;
    for (var i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);
        ret.push([coords.longitude + x, coords.latitude + y]);
        if (i % (~~(points / 4)) == 0) {
            hands.push([coords.longitude + x, coords.latitude + y]);
        }
    }
    ret.push(ret[0]);
    let json = {
        "type": "geojson",
        "data": {
            "type": "FeatureCollection",
            "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
        }
    };
    let point = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": center
        },
        "properties": {
            "index": -1,
            "type": "c",
        }
    };
    json.data.features.push(point);
    hands.forEach((item, index) => {
        let point = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": item
            },
            "properties": {
                "index": index,
                "type": "h",
            }
        };
        json.data.features.push(point);
    });
    return json;
};
var MapBox = (($, turf) => {
    class TraceControl {
        constructor(object) {
            this.id = "mapboxgl-ctrl-trace";
            this._map = null;
            this._container = null;
            this._line = null;
            this._mode = 0;
            this._parent = null;
            this._meter = 1;
            this._group = null;
            this._length = null;
            this._unit = null;
            this._group1 = null;
            this._group2 = null;
            this._btnRule = null;
            this._btnLine = null;
            this._btnUnit = null;
            this._btnMultiLine = null;
            this._btnTrash = null;
            this._btnExit = null;
            this.propertys = {
                color: "#ff0000",
                opacity: 0.4
            };
            this.length = 0;
            this.groups = null;
            this._trace = null;
            this._playButton = null;
            this._factorIndex = 0;
            this._factorValue = [0.005, 0.01, 0.05, 0.09, 0.13, 0.20];
            this.onCheckLayer = (layerId, checked) => { };
            this.mainTab = null;
            this.data = [];
            this.configData = null;
            this.mode = "reset";
            this.speed = 8;
            this.speedRange = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
            this.dir = 1;
            this._parent = object;
        }
        setData(data) {
            this.data = data;
        }
        setConfigData(config) {
            this.configData = config;
        }
        onAdd(map) {
            this._map = map;
            this._container = $.create("div").addClass(["trace-tool"]);
            this._group1 = this._container.create("div");
            this._group1.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "trace-tool"]);
            this._btnRule = this._group1.create("button").prop({ "type": "button", "title": "Inicia la herramienta de Traza" }).addClass("icon-trace");
            this._btnRule.on("click", () => {
                this.play();
            });
            this._group2 = this._container.create("div").style("display", "none");
            this._group2.addClass(["trace-nav"]);
            //this._group_a = this._group2.create("div").addClass(["mapboxgl-ctrl","trace-nav"]);
            this.playBar(this._group2.create("div").addClass(["mapboxgl-ctrl", "trace-nav"]));
            this._group_speed = this._group2.create("div").addClass(["mapboxgl-ctrl", "trace-speed-nav"]);
            this.speedBar(this._group_speed);
            this._group = this._group2.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "trace-layer"])
                .style("display", "none");
            const tab = this.mainTab = new Tab({
                id: this._group,
                className: "trace-control",
            });
            tab.add({ tagName: "form", active: true });
            tab.add({});
            tab.add({});
            //this._length = this._group.create("span").addClass("rule-tool-value");
            //this._length.text("Layers");
            //this._unit = this._group.create("span");
            this._group_b = this._group2.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group"]);
            this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Filtro" }).addClass(["icon-filter"])
                .on("click", () => {
                this.mainTab.show(0);
            });
            this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Mostrar Capas" }).addClass(["icon-layer2"])
                .on("click", () => {
                this.mainTab.show(1);
            });
            this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Mostrar Puntos" }).addClass(["icon-grid"])
                .on("click", () => {
                this.mainTab.show(2);
            });
            this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Descarta la medición actual" }).addClass(["icon-trash"])
                .on("click", () => {
                this.reset();
                //this.cmdTrace("stop");
            });
            this._btnExit = this._group_b.create("button").prop({ "type": "button", "title": "Salir de la herramienta de medición" }).addClass(["icon-exit"])
                .on("click", () => {
                this.stop();
            });
            //this.showLayers();
            this.setSpeed(this.speed);
            this.setMode(this.mode);
            return this._container.get();
        }
        reset() {
            this.setIconPlay(true);
            this.mainTab.getPage(1).text("");
            this.mainTab.getPage(2).text("");
            this.setSpeed(8);
            this.setModeSpeed(8);
            this.setMode("reset");
            this.getTrace().delete();
            this.mainTab.show(0);
        }
        setMode(mode) {
            this.mode = mode;
            this._container.ds("mode", mode);
        }
        setModeSpeed(speed) {
            this._container.ds("modeSpeed", speed);
        }
        setSpeed(speed) {
            this.speed = speed;
            this.setModeSpeed(speed);
        }
        setFilterPage(form) {
            this.getPage(0).append(form);
        }
        getPage(index) {
            return this.mainTab.getPage(index);
        }
        createList() {
            let main = this.mainTab.getPage(2);
            const body = main.create("div").addClass("trace-list");
            this.configData.labels.forEach((line) => {
                body.create("div").text(line);
            });
            this.data.forEach((data, index) => {
                //body.create("span").text(index);
                this.configData.fields.forEach((line) => {
                    body.create("div").ds("value", index).text(data[line]).on("click", (event) => {
                        alert($(event.currentTarget).ds("value"));
                    });
                });
            });
        }
        playBar(bar) {
            //bar.create("button").prop({"type": "button", "title":"+"}).addClass("").text("16x");
            //bar.create("button").prop({"type": "button", "title":"+"}).addClass("").text("&raquo;");
            bar.create("button").prop({ "type": "button", "title": "+" }).addClass("icon-fb")
                .on("click", () => {
                this.getTrace().setReverse(true);
                console.log("reverse");
                return;
                this.dir = -1;
                let speed = this.speed - 1; // % this.speedRange.length;
                if (speed > 6) {
                    speed -= 6;
                }
                if (speed < 0) {
                    speed = 5;
                }
                this.setSpeed(speed);
                if (this._factorIndex <= 0) {
                    //this._factorIndex = this._factorValue.length;
                }
                //this.speed = (this.speed - 1 ) % this.speedRange.length+6;
                //this._factorIndex = (this._factorIndex - 1 ) % this._factorValue.length;
                //this._trace.setSpeedFactor(this._factorValue[this._factorIndex]);
            });
            /*

            
            */
            bar.create("button").prop({ "type": "button", "title": "+" }).addClass("icon-go_begin")
                .on("click", () => {
                this.cmdTrace("go-begin");
            });
            bar.create("button").prop({ "type": "button", "title": "+" }).addClass("icon-sb")
                .on("click", () => {
                this.cmdTrace("sb");
            });
            this._playButton = bar.create("button").prop({ "type": "button", "title": "-" }).addClass("icon-play")
                .on("click", () => {
                if (this._trace.getStatus() == 1) {
                    this.cmdTrace("pause");
                }
                else {
                    this.cmdTrace("play");
                }
            });
            bar.create("button").prop({ "type": "button", "title": "-" }).addClass("icon-sf")
                .on("click", () => {
                this.cmdTrace("sf");
            });
            bar.create("button").prop({ "type": "button", "title": "Play" }).addClass("icon-go_end")
                .on("click", () => {
                this.cmdTrace("go-end");
            });
            bar.create("button").prop({ "type": "button", "title": "Play" }).addClass("icon-ff")
                .on("click", () => {
                this.getTrace().setReverse(false);
                console.log("foward");
                return;
                this.dir = 1;
                let speed = (this.speed + 1); // % this.speedRange.length;
                if (speed < 6) {
                    speed += 6;
                }
                if (speed == 12) {
                    speed = 6;
                }
                //this.speed = (this.speed + 1 ) % this.speedRange.length;
                this.setSpeed(speed);
                //this._factorIndex = (this._factorIndex + 1 ) % this._factorValue.length;
                //this._trace.setSpeedFactor(this._factorValue[this._factorIndex]);
            });
        }
        speedBar(bar, value) {
            this.speedRange.forEach((e, index) => {
                bar.create("div").addClass(["speed", `speed-${index}`])
                    .on("click", () => {
                    this.setSpeed(index);
                });
                //.text((index<7)?"&laquo;":"&raquo;")
                ;
            });
            return;
            bar.create("div").addClass(["speed", "r16"]);
            bar.create("div").addClass(["speed", "r8"]);
            bar.create("div").addClass(["speed", "r4"]);
            bar.create("div").addClass(["speed", "r2"]);
            bar.create("div").addClass(["speed", "r"]).text("&laquo;");
            bar.create("div").addClass(["speed", "x"]).text("&raquo;").on("click", () => {
                this._trace.setSpeedFactor(this._factorValue[0]);
            });
            bar.create("div").addClass(["speed", "x2"]).text("x2").on("click", () => {
                this._trace.setSpeedFactor(this._factorValue[1]);
            });
            bar.create("div").addClass(["speed", "x4"]).text("x4").on("click", () => {
                this._trace.setSpeedFactor(this._factorValue[2]);
            });
            bar.create("div").addClass(["speed", "x8"]).text("x8").on("click", () => {
                this._trace.setSpeedFactor(this._factorValue[3]);
            });
            bar.create("div").addClass(["speed", "x16"]).text("x16").on("click", () => {
                this._trace.setSpeedFactor(this._factorValue[4]);
            });
        }
        onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
        play() {
            this._parent.stopControls();
            if (this._mode == 0) {
                this._group.style("display", "");
                this._group1.style("display", "none");
                this._group2.style("display", "");
                this._mode = 1;
            }
        }
        init() {
        }
        setIconPlay(value) {
            if (value) {
                this._playButton.removeClass("icon-pause");
                this._playButton.addClass("icon-play");
            }
            else {
                this._playButton.removeClass("icon-play");
                this._playButton.addClass("icon-pause");
            }
        }
        cmdTrace(cmd) {
            switch (cmd) {
                case "play":
                    this.setIconPlay(false);
                    this._trace.play();
                    break;
                case "pause":
                    this.setIconPlay(true);
                    this._trace.pause();
                    break;
                case "fb":
                    this.setIconPlay(true);
                    this._trace.play("fb");
                    break;
                case "ff":
                    this.setIconPlay(true);
                    this._trace.play("ff");
                    break;
                case "go-begin":
                    this.setIconPlay(true);
                    this._trace.goBegin();
                    break;
                case "go-end":
                    this.setIconPlay(true);
                    this._trace.goEnd();
                    break;
                case "sb":
                    this.setIconPlay(true);
                    this._trace.step(-1);
                    break;
                case "sf":
                    this.setIconPlay(true);
                    this._trace.step(1);
                    break;
                case "stop":
                    this.setIconPlay(true);
                    this._trace.stop();
                    break;
            }
        }
        setTrace(trace) {
            this._trace = trace;
            this.init();
            //this.showLayers();
        }
        getTrace() {
            return this._trace;
        }
        getTraceLayers() {
            return this.getTrace().layers;
        }
        getTraceGroupLayers() {
            return this.getTrace().groups;
        }
        showLayers() {
            this.groups = this.getTraceGroupLayers();
            const layers = this.getTraceLayers();
            //console.log(this.groups, layers);
            //alert(889);
            //return;
            let items = [];
            let _menu = null;
            let index = 0;
            for (let layer of layers) {
                if (layer.group !== "" && layer.group !== 0) {
                    if (!items[layer.group]) {
                        items[layer.group] = {
                            caption: this.groups[layer.group].caption,
                            useCheck: true,
                            items: []
                        };
                    }
                    _menu = items[layer.group];
                }
                else {
                    if (!items[0]) {
                        items[0].items = items[layer.group] = {
                            caption: this.groups[layer.group].caption,
                            useCheck: true,
                            items: []
                        };
                    }
                    _menu = items[0];
                }
                _menu.items.push({
                    caption: layer.caption,
                    //className:layer.className,
                    useCheck: true,
                    className: [layer.type, layer.color],
                    imageClass: [layer.type, layer.color],
                    value: "" + index++,
                    checked: layer.visible,
                    check: (x, event) => {
                        this.onCheckLayer(parseInt(x.ds("value"), 10), event.currentTarget.checked);
                        this.getTrace().showLayer(parseInt(x.ds("value"), 10), event.currentTarget.checked);
                    }
                });
            }
            let menu = new Menu({
                autoClose: false,
                target: this.getPage(1),
                items: items,
                type: "accordion",
                useCheck: true,
                subType: "",
            });
        }
        setLength(length) {
            this.length = length;
            if (this._meter == 0) {
                this._length.text((this.length / 1000).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                this._unit.text("Km");
            }
            else {
                this._length.text(this.length.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                this._unit.text("m");
            }
        }
        toggleUnit() {
            if (this._meter == 0) {
                this._meter = 1;
            }
            else {
                this._meter = 0;
            }
            this.setLength(this.length);
        }
        delete() {
            //this._line.stop();
            this._parent.delete(this.id);
        }
        stop() {
            if (this._mode == 1) {
                //this.delete();
                this._group.style("display", "none");
                this._group1.style("display", "");
                this._group2.style("display", "none");
                this.setIconPlay(true);
                this._mode = 0;
            }
        }
    }
    class InfoRuleControl {
        constructor(object) {
            this.id = "mapboxgl-ctrl-rule";
            this._map = null;
            this._container = null;
            this._line = null;
            this._mode = 0;
            this._parent = null;
            this._meter = 1;
            this._group = null;
            this._length = null;
            this._unit = null;
            this._group1 = null;
            this._group2 = null;
            this._btnRule = null;
            this._btnLine = null;
            this._btnUnit = null;
            this._btnMultiLine = null;
            this._btnTrash = null;
            this._btnExit = null;
            this.propertys = {
                color: "#ff0000",
                opacity: 0.4
            };
            this.length = 0;
            this._parent = object;
        }
        onAdd(map) {
            this._map = map;
            this._container = $.create("div").addClass(["rule-tool-main"]);
            this._group = this._container.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool-text"])
                .style("display", "none");
            this._length = this._group.create("span").addClass("rule-tool-value");
            this._length.text("0");
            this._unit = this._group.create("span");
            this._unit.addClass("rule-tool-unit").text("km")
                .on("click", () => {
                //this.toggleUnit();
            });
            this._group1 = this._container.create("div");
            this._group1.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool"]);
            this._btnRule = this._group1.create("button").prop({ "type": "button", "title": "Inicia la herramienta de medición" }).addClass("icon-rule");
            this._btnRule.on("click", () => {
                this.play();
            });
            this._group2 = this._container.create("div").style("display", "none");
            this._group2.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool"]);
            this._btnLine = this._group2.create("button").prop({ "type": "button", "title": "Dibujar una línea recta" }).addClass("icon-line")
                .on("click", () => {
                this._length.text("0");
                this._line.setMaxLines(1);
            });
            this._btnMultiLine = this._group2.create("button").prop({ "type": "button", "title": "Dibujar una línea de varios segmentos" }).addClass(["icon-multi-line"])
                .on("click", () => {
                this._length.text("0");
                this._line.setMaxLines(0);
            });
            this._btnUnit = this._group2.create("button").prop({ "type": "button", "title": "Cambiar la unidad de metros a kilometros y viceversa" }).addClass(["icon-unit"]).text("K")
                .on("click", () => {
                this.toggleUnit();
            });
            this._btnTrash = this._group2.create("button").prop({ "type": "button", "title": "Descarta la medición actual" }).addClass(["icon-trash"])
                .on("click", () => {
                this._length.text("0");
                this._line.reset();
            });
            this._btnExit = this._group2.create("button").prop({ "type": "button", "title": "Salir de la herramienta de medición" }).addClass(["icon-exit"])
                .on("click", () => {
                this._length.text("0");
                this.stop();
            });
            return this._container.get();
        }
        onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
        play() {
            this._parent.stopControls();
            if (this._mode == 0) {
                this._group.style("display", "");
                this._group1.style("display", "none");
                this._group2.style("display", "");
                this._mode = 1;
            }
            this._line = this._parent.draw(this.id, "rule", {
                maxLines: 1,
                ondraw: (coordinates) => {
                    if (coordinates.length > 1) {
                        let line = turf.lineString(coordinates);
                        //turf.length(linestring).toLocaleString()
                        this.setLength(turf.length(line, { units: "meters" }));
                        //this.length = ;
                        //this._length.text(this.length.toLocaleString());
                    }
                }
            });
            this._line.play();
        }
        setLength(length) {
            this.length = length;
            if (this._meter == 0) {
                this._length.text((this.length / 1000).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                this._unit.text("Km");
            }
            else {
                this._length.text(this.length.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                this._unit.text("m");
            }
        }
        toggleUnit() {
            if (this._meter == 0) {
                this._meter = 1;
            }
            else {
                this._meter = 0;
            }
            this.setLength(this.length);
        }
        delete() {
            //this._line.stop();
            this._parent.delete(this.id);
        }
        stop() {
            if (this._mode == 1) {
                this.delete();
                this._group.style("display", "none");
                this._group1.style("display", "");
                this._group2.style("display", "none");
                this._mode = 0;
            }
        }
    }
    class PolyControl {
        constructor(object) {
            this.id = "mapboxgl-ctrl-poly";
            this.type = "circle";
            this._map = null;
            this._container = null;
            this._line = null;
            this._mode = 0;
            this._parent = null;
            this._meter = 1;
            this._type = null;
            this._group = null;
            this._length = null;
            this._unit = null;
            this._group1 = null;
            this._group2 = null;
            this._btnRule = null;
            this._btnLine = null;
            this._btnUnit = null;
            this._btnMultiLine = null;
            this._btnTrash = null;
            this._btnExit = null;
            this._fill = null;
            this._alpha = null;
            this.length = 0;
            this.defaultCoordinates = null;
            this.fill = {
                color: "#2fb5f9",
                opacity: 0.4
            };
            this.line = {
                color: "#2fb5f9",
                opacity: 1,
                width: 2,
                dasharray: [2, 2]
            };
            this.onstart = (coords, propertys) => { };
            this.onsave = (coords, propertys) => { };
            this.onexit = (coords, propertys) => { };
            this._parent = object;
        }
        onAdd(map) {
            this._map = map;
            this._container = $.create("div").addClass(["poly-tool-main"]);
            this._group = this._container.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "poly-tool-info"])
                .style("display", "none");
            this._groupi = this._group.create("div").addClass(["info"]);
            this._length = this._groupi.create("span").addClass("poly-tool-value");
            this._length.text("0 Km<sup>2</sup>");
            this._group0 = this._group.create("div").addClass(["propertys"]);
            this._group0.create("span").text("Color: ");
            this._fill = this._group0.create("input").prop({ "type": "color", "title": "Color", "value": this.fill.color }).
                on("change", (event) => {
                this.evalPropertys();
            });
            this._group0.create("span").text("Opacidad: ");
            let options = "";
            for (let i = 0.1; i <= 1; i = i + 0.1) {
                options += `<option value=${i}>${i.toPrecision(1)}</option>`;
            }
            this._alpha = this._group0.create("select").prop({ "title": "Opacidad" }).
                text(options).
                on("change", (event) => {
                this.evalPropertys();
            }).val(this.fill.opacity);
            this._group1 = this._container.create("div");
            this._group1.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool"]);
            this._btnRule = this._group1.create("button").prop({ "type": "button", "title": "Inicia la herramienta de Polígonos" }).addClass("icon-poly");
            this._btnRule.on("click", () => {
                this.play({});
            });
            this._group2 = this._container.create("div").style("display", "none");
            this._group2.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool"]);
            this._btnLine = this._group2.create("button").prop({ "type": "button", "title": "Dibujar un Círculo" }).addClass("icon-circle")
                .on("click", () => {
                this.delete();
                this.setCircle();
            });
            this._btnMultiLine = this._group2.create("button").prop({ "type": "button", "title": "Dibujar un Rectángulo" }).addClass(["icon-rectangle"])
                .on("click", () => {
                this.delete();
                this.setRectangle();
            });
            this._group2.create("button").prop({ "type": "button", "title": "Dibuja un Polígono" }).addClass(["icon-poly"])
                .on("click", () => {
                this.delete();
                this.setPolygon();
            });
            this._btnUnit = this._group2.create("button").prop({ "type": "button", "title": "Guardar" }).addClass(["icon-save"])
                .on("click", () => {
                this.onsave(this._line.getCoordinates());
            });
            this._btnTrash = this._group2.create("button").prop({ "type": "button", "title": "Descarta la medición actual" }).addClass(["icon-trash"])
                .on("click", () => {
                this._length.text("0");
                this._line.reset();
            });
            this._btnExit = this._group2.create("button").prop({ "type": "button", "title": "Salir" }).addClass(["icon-exit"])
                .on("click", () => {
                this._line.stop();
                this.stop();
            });
            return this._container.get();
        }
        onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
        play(info) {
            this._parent.stopControls();
            this.defaultCoordinates = info.defaultCoordinates || [];
            this.type = info.type || this.type;
            if (this._mode == 0) {
                this._group.style("display", "");
                this._group1.style("display", "none");
                this._group2.style("display", "");
                this._mode = 1;
            }
            switch (this.type) {
                case "circle":
                    this.setCircle();
                    break;
                case "rectangle":
                    this.setRectangle();
                    break;
                case "polygon":
                    this.setPolygon();
                    break;
            }
        }
        evalPropertys() {
            this.fill = {
                color: this._fill.val(),
                opacity: this._alpha.val() * 1
            };
            this.line = {
                color: this._fill.val(),
                dasharray: [2, 2],
                opacity: 1,
                width: 2
            };
            this._line.setFill(this.fill);
            this._line.setLine(this.line);
        }
        setLength(length) {
        }
        toggleUnit() {
        }
        stop() {
            if (this._mode == 1) {
                this.delete();
                this._group.style("display", "none");
                this._group1.style("display", "");
                this._group2.style("display", "none");
                this._mode = 0;
            }
        }
        delete() {
            this._length.text("0 Km<sup>2</sup>");
            this._parent.delete(this.id);
        }
        printArea(area) {
            if (area > 1000000) {
                area = area / 1000000;
                this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km<sup>2</sup>");
            }
            else {
                this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m<sup>2</sup>");
            }
        }
        setCircle() {
            this._line = this._parent.draw(this.id, "circle", {
                fill: this.fill,
                line: this.line,
                fillEdit: this.fill,
                lineEdit: this.line,
                coordinates: this.defaultCoordinates,
            });
            this._line.ondraw = (coordinates) => {
                let radio = this._line.getRadio();
                let area = Math.PI * Math.pow(radio, 2);
                this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km<sup>2</sup>" + " (R: " + radio.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km)");
                return;
                if (coordinates.length > 2) {
                    let coord = coordinates.slice();
                    coord.push(coord[0]);
                    let polygon = turf.polygon([coord]);
                    let area = turf.area(polygon);
                    if (area > 1000000) {
                        area = area / 1000000;
                        this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                        this._unit.text("Km<sup>2</sup>");
                    }
                    else {
                        this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                        this._unit.text("m<sup>2</sup>");
                    }
                }
                else {
                    this._length.text("0");
                    this._unit.text("Km<sup>2</sup>");
                }
            };
            this._line.play();
            this._type = 1;
        }
        setRectangle() {
            this._line = this._parent.draw(this.id, "rectangle", {
                fill: this.fill,
                line: this.line,
                fillEdit: this.fill,
                lineEdit: this.line,
                coordinates: this.defaultCoordinates,
            });
            this._line.ondraw = (coordinates) => {
                this.printArea(this._line.getArea());
            };
            this._line.play();
            this._type = 2;
        }
        setPolygon() {
            this._line = this._parent.draw(this.id, "polygon", {
                fill: this.fill,
                line: this.line,
                fillEdit: this.fill,
                lineEdit: this.line,
            });
            this._line.ondraw = (coordinates) => {
                if (coordinates.length > 2) {
                    let coord = coordinates.slice();
                    coord.push(coord[0]);
                    let polygon = turf.polygon([coord]);
                    this.printArea(turf.area(polygon));
                }
                else {
                    this._length.text("0 Km<sup>2</sup>");
                }
            };
            this._line.play();
            this._type = 3;
        }
    }
    class MarkControl {
        constructor(object) {
            this.id = "mapboxgl-ctrl-mark";
            this._map = null;
            this._container = null;
            this._line = null;
            this._mode = 0;
            this._parent = null;
            this._meter = 1;
            this._group = null;
            this._length = null;
            this._unit = null;
            this._group1 = null;
            this._group2 = null;
            this._btnRule = null;
            this._btnLine = null;
            this._btnUnit = null;
            this._btnMultiLine = null;
            this._btnTrash = null;
            this._btnExit = null;
            this._inpLng = null;
            this._inpLat = null;
            this.length = 0;
            this.coordinates = [];
            this.images = [];
            this.image = null;
            this.defaultImage = null;
            this.defaultCoordinates = null;
            this.onnew = () => { };
            this.onplay = (coords, propertys) => { };
            this.onsave = (coords, propertys) => { };
            this.onstop = (coords, propertys) => { };
            this.onchange = (coords, propertys) => { };
            this._parent = object;
        }
        onAdd(map) {
            this._map = map;
            this._container = $.create("div").addClass(["mark-tool-main"]);
            this._group = this._container.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "mark-tool-text"])
                .style("display", "none");
            this._length = this._group.create("div").addClass("mark-tool-value");
            let images = null;
            let g1 = this._length.create("div").addClass("mark-tool-g1");
            let g2 = this._length.create("div").addClass("mark-tool-g2");
            this._inpLng = g1.create("input").prop({ type: "text" }).
                on("change", (event) => {
                this._line.setLngLat([this._inpLng.val(), this._inpLat.val()]);
            });
            this._inpLat = g1.create("input").prop({ type: "text" }).
                on("change", (event) => {
                this._line.setLngLat([this._inpLng.val(), this._inpLat.val()]);
            });
            this.defaultImage = this._parent.markDefaultImage;
            for (let x in this._parent.markImages) {
                images = g2.create("div").create("img");
                images.prop("src", this._parent.markImages[x]);
                images.on("click", () => {
                    this.image = x;
                    this._line.setImage(x);
                    this.onchange({
                        coordinates: this.coordinates,
                        image: this.image,
                        size: this._line.getSize()
                    });
                });
            }
            //this._unit = this._group.create("span");
            //this._unit.addClass("rule-tool-unit").text("km")
            this._group1 = this._container.create("div");
            this._group1.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "mark-tool"]);
            this._btnRule = this._group1.create("button").prop({ "type": "button", "title": "Inicia la herramienta de Marcas / Sitios" }).addClass("icon-marker");
            this._btnRule.on("click", () => {
                this.play();
                this.onnew({
                    coordinates: this.coordinates,
                    image: this.image,
                    size: this._line.getSize()
                });
            });
            this._group2 = this._container.create("div").style("display", "none");
            this._group2.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "mark-tool"]);
            /*
            this._btnLine = this._group2.create("button").prop({"type": "button", "title":"Seleccionar imagen a mostrar"}).addClass("icon-image")
            .on("click", ()=>{
                
            });
            */
            this._group2.create("button").prop({ "type": "button", "title": "Aumentar [+] Tamaño" }).addClass("icon-max")
                .on("click", () => {
                let size = this._line.getSize();
                this._line.setSize(null, size[1] * 1.2);
                this.onchange({
                    coordinates: this.coordinates,
                    image: this.image,
                    size: this._line.getSize()
                });
                //this._line.setMax(1);
            });
            this._group2.create("button").prop({ "type": "button", "title": "Disminuir [-] Tamaño" }).addClass("icon-min")
                .on("click", () => {
                let size = this._line.getSize();
                this._line.setSize(null, size[1] * 0.8);
                this.onchange({
                    coordinates: this.coordinates,
                    image: this.image,
                    size: this._line.getSize()
                });
            });
            this._group2.create("button").prop({ "type": "button", "title": "Guardar" }).addClass(["icon-save"])
                .on("click", () => {
                this.onsave({ coordinates: this._line.getCoordinates(), image: this.image });
            });
            this._btnTrash = this._group2.create("button").prop({ "type": "button", "title": "Descartar" }).addClass(["icon-trash"])
                .on("click", () => {
                //this._length.text("0");
                this._line.reset();
            });
            this._btnExit = this._group2.create("button").prop({ "type": "button", "title": "Salir" }).addClass(["icon-exit"])
                .on("click", () => {
                this.stop();
            });
            return this._container.get();
        }
        onRemove() {
            this._container.parentNode.removeChild(this._container);
            this._map = undefined;
        }
        play(info) {
            this._parent.stopControls();
            if (this._mode == 0) {
                this._group.style("display", "");
                this._group1.style("display", "none");
                this._group2.style("display", "");
                this._mode = 1;
            }
            if (info) {
                this.defaultImage = info.defaultImage;
                this.defaultCoordinates = info.defaultCoordinates;
                this.onstop = info.onstop;
            }
            else {
                this.coordinates = [this._map.getCenter().lng, this._map.getCenter().lat];
                this.defaultCoordinates = this.coordinates.slice();
            }
            this.image = this.defaultImage;
            this._line = this._parent.draw(this.id, "mark", {
                coordinates: this.defaultCoordinates,
                height: 30,
                image: this.image,
            });
            this._inpLng.val(this.defaultCoordinates[0].toFixed(8));
            this._inpLat.val(this.defaultCoordinates[1].toFixed(8));
            this._line.ondraw = (coord) => {
                this.coordinates = coord;
                this._inpLng.val(coord[0].toFixed(8));
                this._inpLat.val(coord[1].toFixed(8));
                this.onchange({
                    coordinates: this.coordinates,
                    image: this.image,
                    size: this._line.getSize()
                });
            };
            this._line.play();
            this.onplay();
        }
        setLength(length) {
        }
        toggleUnit() {
        }
        delete() {
            //this._line.stop();
            this._line.stop();
            this._parent.delete(this.id);
        }
        stop() {
            if (this._mode == 1) {
                this.delete();
                this._group.style("display", "none");
                this._group1.style("display", "");
                this._group2.style("display", "none");
                this._mode = 0;
                this.onstop();
            }
        }
    }
    let test1 = 0;
    class IMark {
        constructor(info) {
            this.map = null;
            this.type = "mark";
            this.parent = null;
            this.name = "";
            this.visible = true;
            this.coordinates = null;
            this.coordinatesInit = null;
            this.rotation = 0;
            this.width = 15;
            this.height = 24;
            this.image = "";
            this.className = "my-class";
            this.popupClassName = "my-class";
            this.popupInfo = "";
            this.flyToSpeed = 0.8;
            this.flyToZoom = 14;
            this.panDuration = 5000;
            this._mode = 0;
            this._marker = null;
            this._image = null;
            this._play = false;
            this.callmove = () => { };
            this.callresize = () => { };
            this.ondraw = () => { };
            this._drag = () => { };
            this._click = () => { };
            this.ondrag = (info) => { };
            this.onplace = (info) => { };
            this.onsave = (info) => { };
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.init();
        }
        init() {
            let map = this.map;
            let markerHeight = 24;
            let markerRadius = 0;
            let linearOffset = 0;
            let popupOffsets = {
                "top": [0, 0],
                "top-left": [0, 0],
                "top-right": [0, 0],
                "bottom": [0, -this.height / 2 + 5],
                "bottom-left": [linearOffset, (this.height - markerRadius + linearOffset) * -1],
                "bottom-right": [-linearOffset, (this.height - markerRadius + linearOffset) * -1],
                "left": [markerRadius, (this.height - markerRadius) * -1],
                "right": [-markerRadius, (this.height - markerRadius) * -1]
            };
            let popup = new mapboxgl.Popup({
                offset: popupOffsets,
                className: this.popupClassName
            })
                //.setLngLat(e.lngLat)
                .setHTML(this.popupInfo)
                .setMaxWidth("300px");
            this.setImage(this.image);
            this._marker = new mapboxgl.Marker(this._image).setLngLat(this.coordinates);
            this._marker.setPopup(popup);
            this._marker.setRotation(this.rotation);
            this.ondraw(this.coordinates);
            if (this.coordinates) {
                this.coordinatesInit = this.coordinates.slice();
            }
            this.setVisible(this.visible);
        }
        setSize(width = null, height = null) {
            if (width != null) {
                this.width = width;
                this._image.style.width = this.width + "px";
            }
            if (height != null) {
                this.height = height;
                this._image.style.height = this.height + "px";
            }
        }
        getSize() {
            return [this.width, this.height];
        }
        setImage(image) {
            if (!this._image) {
                this._image = document.createElement("img");
                this._image.className = "marker";
                this._image.style.height = this.height + "px";
            }
            this._image.src = this.parent.getImage(image);
            //return this._image;
        }
        setVisible(value) {
            if (this._marker) {
                this.visible = value;
                if (value) {
                    this._marker.addTo(this.map);
                }
                else {
                    this._marker.remove();
                }
            }
        }
        getLngLat() {
            return this._marker.getLngLat();
        }
        setLngLat(lngLat) {
            this._marker.setLngLat(lngLat);
        }
        setRotation(rotation) {
            if (this._marker) {
                this.rotation = rotation;
                this._marker.setRotation(rotation);
            }
            return this;
        }
        getCoordinates() {
            return [this._marker.getLngLat().lng, this._marker.getLngLat().lat];
        }
        play() {
            if (this._play) {
                return;
            }
            this.parent.stop();
            this._play = true;
            this.setVisible(true);
            this._marker.setDraggable(true);
            this._marker.on("drag", this._drag = () => {
                this.ondrag(this._marker.getLngLat());
                this.ondraw([this._marker.getLngLat().lng, this._marker.getLngLat().lat]);
            });
            this.map.on("click", this._click = (e) => {
                this.setLngLat(e.lngLat);
                this.onplace(e.lngLat);
                this.ondraw([e.lngLat.lng, e.lngLat.lat]);
            });
        }
        stop() {
            if (this._play) {
                this._marker.setDraggable(false);
                this._play = false;
                this.map.off("click", this._click);
                this.map.off("drag", this._drag);
                this._play = false;
            }
        }
        reset() {
            if (!this._play) {
                return;
            }
            if (this.coordinatesInit) {
                this.setLngLat(this.coordinatesInit);
            }
        }
        save() {
            this.coordinatesInit = this.getCoordinates();
            this.onsave(this.coordinatesInit);
        }
        delete() {
            this.stop();
            this.setVisible(false);
            this._marker = null;
        }
        flyTo(zoom, speed) {
            this.map.flyTo({
                center: this._marker.getLngLat(),
                zoom: zoom || this.flyToZoom,
                speed: speed || this.flyToSpeed,
                curve: 1,
                easing(t) {
                    return t;
                }
            });
        }
        panTo(duration) {
            this.map.panTo(this._marker.getLngLat(), { duration: duration || this.panDuration });
        }
    }
    class Polygon {
        constructor(info) {
            this.map = null;
            this.type = "polygon";
            this.parent = null;
            this.name = "";
            this.visible = true;
            this.coordinates = [];
            this.coordinatesInit = null;
            this.flyToSpeed = 0.8;
            this.flyToZoom = 14;
            this.panDuration = 5000;
            this.line = {
                color: "#FFA969",
                width: 2,
                opacity: 0.9,
                dasharray: [1]
            };
            this.fill = {
                color: "#f9f871",
                opacity: 0.4
            };
            this.lineEdit = {
                color: "#ff3300",
                width: 1,
                opacity: 0.9,
                dasharray: [2, 2]
            };
            this.fillEdit = {
                color: "#ff9933",
                opacity: 0.4
            };
            this.lineColor = "white";
            this.lineWidth = 2;
            this.fillColor = "red";
            //radio:number = 0;
            //center:number[] = null;
            this.hand = null;
            this._mode = 0;
            this._nodes = null;
            this._line = null;
            this.id = "p" + String(new Date().getTime());
            this.nodesId = null;
            this.lineId = null;
            this.circleId = null;
            this._play = false;
            this.callmove = () => { };
            this.callresize = () => { };
            this.ondraw = () => { };
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.nodesId = "n-" + this.id;
            this.lineId = "l-" + this.id;
            this.circleId = "c-" + this.id;
            this.init();
        }
        init() {
            let map = this.map;
            //let polygon = turf.polygon([coo], { name: "poly1" });
            //polygon = turf.bezierSpline(polygon);
            //            console.log(polygon)
            let polygon = {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[]]
                }
            };
            this._line = {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [polygon]
                }
            };
            this.map.addSource(this.lineId, this._line);
            this.map.addLayer({
                "id": this.lineId,
                "type": "line",
                "source": this.lineId,
                "layout": {
                    "line-join": "round",
                    "line-cap": "round",
                    visibility: (this.visible) ? "visible" : "none"
                },
                "paint": {
                    "line-color": "#ff3300",
                    "line-width": 4,
                },
                "filter": ["==", "$type", "Polygon"]
            });
            this.map.addLayer({
                "id": this.circleId,
                "type": "fill",
                "source": this.lineId,
                "layout": {
                    visibility: (this.visible) ? "visible" : "none"
                },
                "paint": {
                //"fill-color": "#ff9900",
                //"fill-opacity": 0.4,
                },
                "filter": ["==", "$type", "Polygon"]
            });
            //this.setLine(this.line);
            //this.setFill(this.fill);
            map.addLayer({
                id: this.nodesId,
                type: "circle",
                source: this.lineId,
                layout: {
                    visibility: "none"
                },
                paint: {
                    "circle-radius": 4,
                    "circle-opacity": ["case", ["==", ["get", "type"], "m"], 0.0, 0.8],
                    "circle-color": "white",
                    "circle-stroke-color": "#ff3300",
                    "circle-stroke-width": 1
                },
                filter: ["in", "$type", "Point"]
                //filter: ["in", "type", "h", "m"]
                //filter: ["in", "type"]
            });
            /*
            map.addLayer({
                id: this.nodesId+"2",
                type: "circle",
                source: this.lineId,
                layout: {
                    visibility:"visible"
                },
                paint: {
                    "circle-radius": 3,
                    "circle-opacity":0.5,
                    "circle-color": "#000",
                    "circle-stroke-color":"#ff3300",
                    "circle-stroke-width":1
                },
                //filter: ["in", "$type", "Point"]
                filter: ["in", "type", "m"]
                //filter: ["in", "type"]
            });
            */
            this.setLine(this.line);
            this.setFill(this.fill);
            this.coordinates_ = [
                [-66.84927463531494, 10.490132784557675],
                [-66.84916734695435, 10.487727485274153],
                [-66.847482919693, 10.488339361426192],
                [-66.84403896331787, 10.48798067555274],
                [-66.83899641036987, 10.4872211040956],
                [-66.83056354522705, 10.480659173081785],
                [-66.82998418807983, 10.48194625089936],
                [-66.83200120925903, 10.48333882087384],
                [-66.83295607566833, 10.483686962388932],
                [-66.83379024267197, 10.484296209098416],
                [-66.83488190174103, 10.485327442138733],
                [-66.83595210313797, 10.486147678753897],
                [-66.8368935585022, 10.487347699467918],
                [-66.83808445930487, 10.488181117709713],
                [-66.83968305587774, 10.488465956341086],
                [-66.84177517890936, 10.488687497317594],
                [-66.84476852416998, 10.489014533707307],
                [-66.84704303741461, 10.489362668839194],
                [-66.84779405593878, 10.490064212687859],
                [-66.84927463531494, 10.490132784557675]
            ];
            this.coordinatesInit = this.coordinates.slice();
            if (this.coordinates.length > 0) {
                this.draw();
            }
        }
        setLine(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.lineId, "line-" + p, info[p]);
            }
        }
        setFill(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.circleId, "fill-" + p, info[p]);
            }
        }
        setVisible(value) {
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
            this.coordinates.push([lngLat.lng, lngLat.lat]);
            this.draw();
            //let data = createGeoJSONPoly(this.coordinates);
            //this.map.getSource(this.lineId).setData(data.data);
        }
        draw() {
            let data = createGeoJSONPoly(this.coordinates);
            this.map.getSource(this.lineId).setData(data.data);
            this.ondraw(this.coordinates);
        }
        getArea() {
            var polygon = turf.polygon([this.coordinates]);
            return turf.area(polygon);
        }
        _fnclick(map) {
            return;
        }
        play() {
            if (this._play) {
                return;
            }
            this.parent.stop();
            this._play = true;
            let map = this.map;
            //this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, "visibility", "visible");
            //this.map.setPaintProperty(this.lineId, "line-dasharray", [2,2]);
            let place = null;
            let type = null;
            let place_one = null;
            let down1 = false;
            let fnUp = (e) => {
                map.off("mousemove", fnMove);
                type = null;
                down1 = false;
            };
            let fnMove = (e) => {
                this.coordinates[place] = [e.lngLat.lng, e.lngLat.lat];
                this.draw();
            };
            let fnUp2 = (e) => {
                map.off("mousemove", fnMove2);
            };
            let fnMove2 = (e) => {
                //this.move(place_one, e.lngLat);
                let dLng = e.lngLat.lng - place_one.lng;
                let dLat = e.lngLat.lat - place_one.lat;
                //db (dLng)
                let c = [];
                this.coordinates.forEach((elem, index) => {
                    //db (index+"  "+elem[0], "white")
                    c.push([elem[0] + dLng, elem[1] + dLat]);
                });
                this.coordinates = c;
                place_one = e.lngLat;
                this.draw();
            };
            map.on("mousedown", this.nodesId, this._mousedown = (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                down1 = true;
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                place = features[0].properties.index;
                type = features[0].properties.type;
                if (type == "m") {
                    this.split(place, [e.lngLat.lng, e.lngLat.lat]);
                    this.draw();
                }
                map.on("mousemove", fnMove);
                map.once("mouseup", fnUp);
            });
            map.on("mousedown", this.circleId, this._mousedown2 = (e) => {
                if (down1) {
                    return;
                }
                // Prevent the default map drag behavior.
                e.preventDefault();
                place_one = e.lngLat;
                map.on("mousemove", fnMove2);
                map.once("mouseup", fnUp2);
            });
            map.on("click", this._click = (e) => {
                //db (e.originalEvent.button+".........", "red","yellow")
                var features = this.map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                this.add(e.lngLat);
            });
            map.on("contextmenu", this._contextmenu = (e) => {
                e.preventDefault();
                this.coordinates.pop();
                this.draw();
            });
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off("click", this._click);
                this.map.off("contextmenu", this._contextmenu);
                this.map.off("mousedown", this.nodesId, this._mousedown);
                this.map.off("mousedown", this.circleId, this._mousedown2);
                // this.map.setPaintProperty(this.lineId, "line-dasharray", [1]);
                //"line-dasharray":[2,2]
                //this.map.setPaintProperty(this.lineId, "line-color", "#fd8d3c");
                //map.on("mousemove", fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setFill(this.fill);
            this.setLine(this.line);
            //this._mode = 0;
            this._play = false;
        }
        reset() {
            if (!this._play) {
                return;
            }
            this._mode = 1;
            if (this.coordinatesInit) {
                this.coordinates = this.coordinatesInit.slice();
                if (this.coordinates.length > 1) {
                    this.draw();
                    return;
                }
            }
            else {
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
            let map = this.map;
            if (map.getLayer(this.circleId))
                map.removeLayer(this.circleId);
            if (map.getLayer(this.lineId))
                map.removeLayer(this.lineId);
            if (map.getLayer(this.nodesId))
                map.removeLayer(this.nodesId);
            if (map.getSource(this.lineId))
                map.removeSource(this.lineId);
        }
        getCoordinates() {
            return this.coordinates;
        }
        setCenter(lngLat) {
            this.center = lngLat;
        }
        setHand(lngLat) {
            this.hand = lngLat;
        }
        createCircle(center, radio) {
            let length;
            if (typeof radio === "number") {
                length = radio;
            }
            else {
                var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
                length = turf.length(line, { units: "kilometers" });
            }
            this.radio = length;
            let data = createGeoJSONCircle([center.lng, center.lat], length);
            this.map.getSource(this.lineId).setData(data.data);
        }
        split(index, value) {
            this.coordinates.splice(index, 0, value);
        }
        getHand() {
            return this.hand;
        }
        getRadio() {
            return this.radio;
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
            console.log(centroid);
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
    }
    class Rectangle {
        constructor(info) {
            this.map = null;
            this.type = "rectangle";
            this.parent = null;
            this.name = "";
            this.visible = true;
            this.coordinates = null;
            this.coordinatesInit = null;
            this.flyToSpeed = 0.8;
            this.flyToZoom = 14;
            this.panDuration = 5000;
            this.line = {
                color: "#FFA969",
                width: 2,
                opacity: 0.9,
                dasharray: [1]
            };
            this.fill = {
                color: "#f9f871",
                opacity: 0.4
            };
            this.lineEdit = {
                color: "#ff3300",
                width: 1,
                opacity: 0.9,
                dasharray: [2, 2]
            };
            this.fillEdit = {
                color: "#ff9933",
                opacity: 0.4
            };
            this.lineColor = "white";
            this.lineWidth = 2;
            this.fillColor = "red";
            //radio:number = 0;
            //center:number[] = null;
            this.hand = null;
            this._mode = 0;
            this._nodes = null;
            this._line = null;
            this.id = "p" + String(new Date().getTime());
            this.nodesId = null;
            this.lineId = null;
            this.circleId = null;
            this._play = false;
            this.callmove = () => { };
            this.callresize = () => { };
            this.ondraw = () => { };
            this.dataSource = null;
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.nodesId = "n-" + this.id;
            this.lineId = "l-" + this.id;
            this.circleId = "c-" + this.id;
            this.init();
        }
        init() {
            let map = this.map;
            //let polygon = turf.polygon([coo], { name: "poly1" });
            //polygon = turf.bezierSpline(polygon);
            //            console.log(polygon)
            let polygon = {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[]]
                }
            };
            this._line = {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [polygon]
                }
            };
            this.map.addSource(this.lineId, this._line);
            this.map.addLayer({
                "id": this.lineId,
                "type": "line",
                "source": this.lineId,
                "layout": {
                    "line-join": "round",
                    "line-cap": "round",
                    visibility: (this.visible) ? "visible" : "none"
                },
                "paint": {
                    "line-color": "#ff3300",
                    "line-width": 4,
                },
                "filter": ["==", "$type", "Polygon"]
            });
            this.map.addLayer({
                "id": this.circleId,
                "type": "fill",
                "source": this.lineId,
                "layout": {
                    visibility: (this.visible) ? "visible" : "none"
                },
                "paint": {
                //"fill-color": "#ff9900",
                //"fill-opacity": 0.4,
                },
                "filter": ["==", "$type", "Polygon"]
            });
            //this.setLine(this.line);
            //this.setFill(this.fill);
            map.addLayer({
                id: this.nodesId,
                type: "circle",
                source: this.lineId,
                layout: {
                    visibility: "none"
                },
                paint: {
                    "circle-radius": 4,
                    "circle-opacity": ["case", ["==", ["get", "type"], "m"], 0.0, 0.8],
                    "circle-color": "white",
                    "circle-stroke-color": "#ff3300",
                    "circle-stroke-width": 1
                },
                filter: ["in", "$type", "Point"]
                //filter: ["in", "type", "h", "m"]
                //filter: ["in", "type"]
            });
            /*
            map.addLayer({
                id: this.nodesId+"2",
                type: "circle",
                source: this.lineId,
                layout: {
                    visibility:"visible"
                },
                paint: {
                    "circle-radius": 3,
                    "circle-opacity":0.5,
                    "circle-color": "#000",
                    "circle-stroke-color":"#ff3300",
                    "circle-stroke-width":1
                },
                //filter: ["in", "$type", "Point"]
                filter: ["in", "type", "m"]
                //filter: ["in", "type"]
            });
            */
            this.setLine(this.line);
            this.setFill(this.fill);
            this.coordinates_ = [
                [-66.84927463531494, 10.490132784557675],
                [-66.84916734695435, 10.487727485274153],
                [-66.847482919693, 10.488339361426192],
                [-66.84403896331787, 10.48798067555274],
                [-66.83899641036987, 10.4872211040956],
                [-66.83056354522705, 10.480659173081785],
                [-66.82998418807983, 10.48194625089936],
                [-66.83200120925903, 10.48333882087384],
                [-66.83295607566833, 10.483686962388932],
                [-66.83379024267197, 10.484296209098416],
                [-66.83488190174103, 10.485327442138733],
                [-66.83595210313797, 10.486147678753897],
                [-66.8368935585022, 10.487347699467918],
                [-66.83808445930487, 10.488181117709713],
                [-66.83968305587774, 10.488465956341086],
                [-66.84177517890936, 10.488687497317594],
                [-66.84476852416998, 10.489014533707307],
                [-66.84704303741461, 10.489362668839194],
                [-66.84779405593878, 10.490064212687859],
                [-66.84927463531494, 10.490132784557675]
            ];
            if (this.coordinates) {
                this.coordinatesInit = this.coordinates.slice();
                this.draw();
            }
        }
        setLine(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.lineId, "line-" + p, info[p]);
            }
        }
        setFill(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.circleId, "fill-" + p, info[p]);
            }
        }
        setVisible(value) {
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
            if (this._mode == 0) {
                this.coordinates = [];
                this.coordinates[0] = [lngLat.lng, lngLat.lat];
                this.coordinates[1] = null;
                this._mode = 1;
            }
            else {
                this.coordinates[1] = [lngLat.lng, lngLat.lat];
                this._mode = 2;
            }
            this.draw();
        }
        draw() {
            let data = createGeoJSONRectangle(this.coordinates[0], this.coordinates[1]);
            //let data = createGeoJSONPoly(this.coordinates);
            this.map.getSource(this.lineId).setData(data.data);
            this.dataSource = data.data;
            this.ondraw(this.coordinates);
        }
        getArea() {
            let coord = this.dataSource.features[0].geometry.coordinates;
            if (coord[0].length >= 4) {
                let polygon = turf.polygon(this.dataSource.features[0].geometry.coordinates);
                return turf.area(polygon);
            }
            return 0;
        }
        _fnclick(map) {
            return;
        }
        play() {
            if (this._play) {
                return;
            }
            this.parent.stop();
            this._play = true;
            let map = this.map;
            //this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, "visibility", "visible");
            //this.map.setPaintProperty(this.lineId, "line-dasharray", [2,2]);
            let place = null;
            let type = null;
            let place_one = null;
            let down1 = false;
            let fnUp = (e) => {
                map.off("mousemove", fnMove);
                type = null;
                down1 = false;
            };
            let fnMove = (e) => {
                if (this._mode == 2) {
                    let pX = this.coordinates[0][0];
                    let pY = this.coordinates[0][1];
                    let p1X = this.coordinates[1][0];
                    let p1Y = this.coordinates[1][1];
                    switch (place) {
                        case 0:
                            pX = e.lngLat.lng;
                            pY = e.lngLat.lat;
                            break;
                        case 1:
                            p1X = e.lngLat.lng;
                            pY = e.lngLat.lat;
                            break;
                        case 2:
                            p1X = e.lngLat.lng;
                            p1Y = e.lngLat.lat;
                            break;
                        case 3:
                            pX = e.lngLat.lng;
                            p1Y = e.lngLat.lat;
                            break;
                        case 4:
                            pY = e.lngLat.lat;
                            break;
                        case 5:
                            p1X = e.lngLat.lng;
                            break;
                        case 6:
                            p1Y = e.lngLat.lat;
                            break;
                        case 7:
                            pX = e.lngLat.lng;
                            break;
                    }
                    this.coordinates[0] = [pX, pY];
                    this.coordinates[1] = [p1X, p1Y];
                }
                else {
                    this.coordinates[0] = [e.lngLat.lng, e.lngLat.lat];
                }
                this.draw();
            };
            let fnUp2 = (e) => {
                map.off("mousemove", fnMove2);
            };
            let fnMove2 = (e) => {
                //this.move(place_one, e.lngLat);
                let dLng = e.lngLat.lng - place_one.lng;
                let dLat = e.lngLat.lat - place_one.lat;
                let pX = this.coordinates[0][0] + dLng;
                let pY = this.coordinates[0][1] + dLat;
                let p1X = this.coordinates[1][0] + dLng;
                let p1Y = this.coordinates[1][1] + dLat;
                this.coordinates[0] = [pX, pY];
                this.coordinates[1] = [p1X, p1Y];
                this.draw();
                place_one = e.lngLat;
            };
            map.on("mousedown", this.nodesId, this._mousedown = (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                down1 = true;
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                place = features[0].properties.index;
                type = features[0].properties.type;
                //db (place);return;
                if (type == "m") {
                    //this.split(place, [e.lngLat.lng, e.lngLat.lat]);
                    //this.draw();
                }
                map.on("mousemove", fnMove);
                map.once("mouseup", fnUp);
            });
            map.on("mousedown", this.circleId, this._mousedown2 = (e) => {
                if (down1) {
                    return;
                }
                // Prevent the default map drag behavior.
                e.preventDefault();
                place_one = e.lngLat;
                map.on("mousemove", fnMove2);
                map.once("mouseup", fnUp2);
            });
            map.on("click", this._click = (e) => {
                //db (e.originalEvent.button+".........", "red","yellow")
                var features = this.map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                this.add(e.lngLat);
            });
            map.on("contextmenu", this._contextmenu = (e) => {
                e.preventDefault();
                this.coordinates.pop();
                this.draw();
            });
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off("click", this._click);
                this.map.off("contextmenu", this._contextmenu);
                this.map.off("mousedown", this.nodesId, this._mousedown);
                this.map.off("mousedown", this.circleId, this._mousedown2);
                // this.map.setPaintProperty(this.lineId, "line-dasharray", [1]);
                //"line-dasharray":[2,2]
                //this.map.setPaintProperty(this.lineId, "line-color", "#fd8d3c");
                //map.on("mousemove", fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setFill(this.fill);
            this.setLine(this.line);
            //this._mode = 0;
            this._play = false;
        }
        reset() {
            if (!this._play) {
                return;
            }
            if (this.coordinatesInit) {
                this.coordinates = this.coordinatesInit.slice();
                this.draw();
                return;
            }
            else {
                this.coordinates = [];
            }
            this._mode = 0;
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
            let map = this.map;
            if (map.getLayer(this.circleId))
                map.removeLayer(this.circleId);
            if (map.getLayer(this.lineId))
                map.removeLayer(this.lineId);
            if (map.getLayer(this.nodesId))
                map.removeLayer(this.nodesId);
            if (map.getSource(this.lineId))
                map.removeSource(this.lineId);
        }
        getCoordinates() {
            return this.coordinates;
        }
        createCircle(center, radio) {
            let length;
            if (typeof radio === "number") {
                length = radio;
            }
            else {
                var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
                length = turf.length(line, { units: "kilometers" });
            }
            this.radio = length;
            let data = createGeoJSONCircle([center.lng, center.lat], length);
            this.map.getSource(this.lineId).setData(data.data);
        }
        split(index, value) {
            this.coordinates.splice(index, 0, value);
        }
        getHand() {
            return this.hand;
        }
        getRadio() {
            return this.radio;
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
            console.log(centroid);
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
    }
    class Circle {
        constructor(info) {
            this.map = null;
            this.type = "circle";
            this.parent = null;
            this.name = "";
            this.visible = true;
            this.flyToSpeed = 0.8;
            this.flyToZoom = 14;
            this.panDuration = 5000;
            this.line = {
                color: "#FFA969",
                width: 2,
                opacity: 0.9,
                dasharray: [1]
            };
            this.fill = {
                color: "#f9f871",
                opacity: 0.4
            };
            this.lineEdit = {
                color: "#ff3300",
                width: 2,
                opacity: 0.9,
                dasharray: [2, 2]
            };
            this.fillEdit = {
                color: "#ff9933",
                opacity: 0.4
            };
            this.lineColor = "white";
            this.lineWidth = 2;
            this.fillColor = "red";
            this.coordinates = null;
            this.radio = 0;
            this.center = null;
            this.hand = null;
            this._mode = 0;
            this._nodes = null;
            this._line = null;
            this.id = "c" + String(new Date().getTime());
            this.nodesId = null;
            this.lineId = null;
            this.circleId = null;
            this._play = false;
            this.callmove = () => { };
            this.callresize = () => { };
            this.ondraw = () => { };
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.nodesId = "n-" + this.id;
            this.lineId = "l-" + this.id;
            this.circleId = "c-" + this.id;
            let map = this.map;
            this._line = {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [[]]
                            }
                        }]
                }
            };
            this.map.addSource(this.lineId, this._line);
            this.map.addLayer({
                "id": this.lineId,
                "type": "line",
                "source": this.lineId,
                "layout": {
                    "line-join": "round",
                    "line-cap": "round",
                    visibility: (this.visible) ? "visible" : "none"
                },
                "paint": {
                //"line-color": "#ff3300",
                //"line-width": this.lineWidth,
                //"line-opacity": 0.9,
                //"line-gap-width":4,
                //"line-dasharray":[2,2]
                },
                "filter": ["==", "$type", "Polygon"]
            });
            this.map.addLayer({
                "id": this.circleId,
                "type": "fill",
                "source": this.lineId,
                "layout": {
                    visibility: (this.visible) ? "visible" : "none"
                },
                "paint": {
                //"fill-color": "#ff9900",
                //"fill-opacity": 0.4,
                },
                "filter": ["==", "$type", "Polygon"]
            });
            map.addLayer({
                id: this.nodesId,
                type: "circle",
                source: this.lineId,
                layout: {
                    visibility: "none"
                },
                paint: {
                    "circle-radius": 4,
                    "circle-opacity": 0.0,
                    "circle-color": "#000",
                    "circle-stroke-color": "#ff3300",
                    "circle-stroke-width": 1
                },
                filter: ["in", "$type", "Point"]
            });
            this.setLine(this.line);
            this.setFill(this.fill);
            if (this.coordinates) {
                this.center = this.coordinates[0];
                this.radio = this.coordinates[1] / 1000;
            }
            if (this.center && this.radio) {
                this.createCircle(this.center, this.radio);
            }
            if (this.center && this.hand) {
                this.createCircle(this.center, this.hand);
            }
        }
        setLine(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.lineId, "line-" + p, info[p]);
            }
        }
        setFill(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.circleId, "fill-" + p, info[p]);
            }
        }
        setVisible(value) {
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
        test() {
        }
        _fnclick(map) {
            return this._click = (e) => {
                var features = this.map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if (this._mode == 1) {
                    this.setCenter([e.lngLat.lng, e.lngLat.lat]);
                    this.createCircle(this.center, 0);
                    this._mode = 2;
                    return;
                }
                if (this._mode == 2) {
                    this.setHand([e.lngLat.lng, e.lngLat.lat]);
                    this.createCircle(this.center, this.hand);
                }
            };
        }
        play() {
            if (this._play) {
                return;
            }
            this.parent.stop();
            this._play = true;
            let map = this.map;
            //this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, "visibility", "visible");
            //this.map.setPaintProperty(this.lineId, "line-dasharray", [2,2]);
            let place = null;
            if (this.radio == 0) {
                this._mode = 1;
            }
            let fnUp = (e) => {
                //point = null;
                map.off("mousemove", fnMove);
            };
            let fnMove = (e) => {
                //this.coordinates[point] = [e.lngLat.lng, e.lngLat.lat];
                //this.setCoordinates(this.coordinates);
                //this.redraw();
                if (place == "c") {
                    this.center = [e.lngLat.lng, e.lngLat.lat];
                    this.createCircle(this.center, this.radio);
                    this.callmove();
                }
                else if (place == "h") {
                    this.hand = [e.lngLat.lng, e.lngLat.lat];
                    this.createCircle(this.center, this.hand);
                    this.callresize();
                }
            };
            map.on("mousedown", this.nodesId, this._mousedown = (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if (features.length) {
                    var id = features[0].properties.id;
                }
                place = features[0].properties.type;
                map.on("mousemove", fnMove);
                map.once("mouseup", fnUp);
            });
            map.on("click", this._fnclick(this.map));
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off("click", this._click);
                this.map.off("mousedown", this.nodesId, this._mousedown);
                // this.map.setPaintProperty(this.lineId, "line-dasharray", [1]);
                //"line-dasharray":[2,2]
                //this.map.setPaintProperty(this.lineId, "line-color", "#fd8d3c");
                //map.on("mousemove", fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setFill(this.fill);
            this.setLine(this.line);
            //this._mode = 0;
            this._play = false;
        }
        reset() {
            if (!this._play) {
                return;
            }
            this._mode = 1;
            this.radio = 0;
            this._line = {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [[]]
                            }
                        }]
                }
            };
            //this._line.data.features = [];
            this.map.getSource(this.lineId).setData(this._line.data);
        }
        draw(center, radio) {
        }
        setCenter(lngLat) {
            this.center = lngLat;
        }
        setHand(lngLat) {
            this.hand = lngLat;
        }
        createCircle(center, radio) {
            let length;
            if (typeof radio === "number") {
                length = radio;
            }
            else {
                var line = turf.lineString([center, radio]);
                length = turf.length(line, { units: "kilometers" });
            }
            this.radio = length;
            let data = createGeoJSONCircle(center, length);
            this.source = this.map.getSource(this.lineId).setData(data.data);
            this.ondraw(center, radio);
        }
        getCenter() {
            return this.center;
        }
        getHand() {
            return this.hand;
        }
        getCoordinates() {
            return [this.center, this.radio];
        }
        getRadio() {
            return this.radio;
        }
        flyTo(zoom, speed) {
            var bbox = turf.bbox(this.source._data.features[0]);
            this.map.fitBounds(bbox, {
                padding: 40
            });
            return;
            let data = this.map.getSource(this.lineId).getData();
            var coordinates = data.features[0].geometry.coordinates;
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
            console.log(centroid);
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
            this.map.panTo(this.center, { duration: duration || this.panDuration });
        }
        delete() {
            this.stop();
            let map = this.map;
            if (map.getLayer(this.circleId))
                map.removeLayer(this.circleId);
            if (map.getLayer(this.lineId))
                map.removeLayer(this.lineId);
            if (map.getLayer(this.nodesId))
                map.removeLayer(this.nodesId);
            if (map.getSource(this.lineId))
                map.removeSource(this.lineId);
        }
    }
    class Rule {
        constructor(info) {
            this.map = null;
            this.type = "rule";
            this.parent = null;
            this.name = "";
            this.visible = true;
            this.coordinates = [];
            this.coordinatesInit = null;
            this.flyToSpeed = 0.8;
            this.flyToZoom = 14;
            this.panDuration = 5000;
            this.maxLines = 0;
            this.line = {
                color: "#FFA969",
                width: 2,
                opacity: 0.9,
                dasharray: [1]
            };
            this.fill = {
                color: "#f9f871",
                opacity: 0.4
            };
            this.lineEdit = {
                color: "#ff3300",
                width: 1,
                opacity: 0.9,
                dasharray: [2, 2]
            };
            this.fillEdit = {
                color: "#ff9933",
                opacity: 0.4
            };
            this.lineColor = "white";
            this.lineWidth = 2;
            this.fillColor = "red";
            //radio:number = 0;
            //center:number[] = null;
            this.hand = null;
            this._status = 0;
            this._nodes = null;
            this._line = null;
            this.id = "p" + String(new Date().getTime());
            this.nodesId = null;
            this.lineId = null;
            this.circleId = null;
            this._play = false;
            this.callmove = () => { };
            this.callresize = () => { };
            this.ondraw = (coordinates) => { };
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.nodesId = "n-" + this.id;
            this.lineId = "l-" + this.id;
            this.circleId = "c-" + this.id;
            this.init();
        }
        init() {
            let map = this.map;
            //let polygon = turf.polygon([coo], { name: "poly1" });
            //polygon = turf.bezierSpline(polygon);
            //            console.log(polygon)
            let polygon = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[]]
                }
            };
            this._line = {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [polygon]
                }
            };
            this.map.addSource(this.lineId, this._line);
            this.map.addLayer({
                "id": this.lineId,
                "type": "line",
                "source": this.lineId,
                "layout": {
                    "line-join": "round",
                    "line-cap": "round",
                    visibility: (this.visible) ? "visible" : "none"
                },
                "paint": {
                    "line-color": "#ff3300",
                    "line-width": 4,
                },
                "filter": ["==", "$type", "LineString"]
            });
            this.map.addLayer({
                "id": this.circleId,
                "type": "fill",
                "source": this.lineId,
                "layout": {
                    visibility: (this.visible) ? "visible" : "none"
                },
                "paint": {
                //"fill-color": "#ff9900",
                //"fill-opacity": 0.4,
                },
                "filter": ["==", "$type", "Polygon"]
            });
            //this.setLine(this.line);
            //this.setFill(this.fill);
            map.addLayer({
                id: this.nodesId,
                type: "circle",
                source: this.lineId,
                layout: {
                    visibility: "none"
                },
                paint: {
                    "circle-radius": 4,
                    "circle-opacity": ["case", ["==", ["get", "type"], "m"], 0.0, 0.8],
                    "circle-color": "white",
                    "circle-stroke-color": "#ff3300",
                    "circle-stroke-width": 1
                },
                filter: ["in", "$type", "Point"]
                //filter: ["in", "type", "h", "m"]
                //filter: ["in", "type"]
            });
            /*
            map.addLayer({
                id: this.nodesId+"2",
                type: "circle",
                source: this.lineId,
                layout: {
                    visibility:"visible"
                },
                paint: {
                    "circle-radius": 3,
                    "circle-opacity":0.5,
                    "circle-color": "#000",
                    "circle-stroke-color":"#ff3300",
                    "circle-stroke-width":1
                },
                //filter: ["in", "$type", "Point"]
                filter: ["in", "type", "m"]
                //filter: ["in", "type"]
            });
            */
            this.setLine(this.line);
            this.setFill(this.fill);
            this.coordinates_ = [
                [-66.84927463531494, 10.490132784557675],
                [-66.84916734695435, 10.487727485274153],
                [-66.847482919693, 10.488339361426192],
                [-66.84403896331787, 10.48798067555274],
                [-66.83899641036987, 10.4872211040956],
                [-66.83056354522705, 10.480659173081785],
                [-66.82998418807983, 10.48194625089936],
                [-66.83200120925903, 10.48333882087384],
                [-66.83295607566833, 10.483686962388932],
                [-66.83379024267197, 10.484296209098416],
                [-66.83488190174103, 10.485327442138733],
                [-66.83595210313797, 10.486147678753897],
                [-66.8368935585022, 10.487347699467918],
                [-66.83808445930487, 10.488181117709713],
                [-66.83968305587774, 10.488465956341086],
                [-66.84177517890936, 10.488687497317594],
                [-66.84476852416998, 10.489014533707307],
                [-66.84704303741461, 10.489362668839194],
                [-66.84779405593878, 10.490064212687859],
                [-66.84927463531494, 10.490132784557675]
            ];
            if (this.coordinates) {
                //this.coordinatesInit = this.coordinates.slice();
                //this.draw();
            }
        }
        setLine(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.lineId, "line-" + p, info[p]);
            }
        }
        setFill(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.circleId, "fill-" + p, info[p]);
            }
        }
        setVisible(value) {
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
            this.coordinates.push([lngLat.lng, lngLat.lat]);
            this.draw();
        }
        draw() {
            let data = createGeoJSONLine(this.coordinates);
            this.map.getSource(this.lineId).setData(data.data);
            this.ondraw(this.coordinates);
        }
        setMaxLines(lines) {
            if (lines >= 0) {
                this.maxLines = lines;
                this.reset();
            }
        }
        _fnclick(map) {
            return;
        }
        play() {
            if (this._play) {
                return;
            }
            this.parent.stop();
            this._play = true;
            let map = this.map;
            //this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, "visibility", "visible");
            //this.map.setPaintProperty(this.lineId, "line-dasharray", [2,2]);
            let place = null;
            let type = null;
            let place_one = null;
            let down1 = false;
            let fnUp = (e) => {
                map.off("mousemove", fnMove);
                type = null;
                down1 = false;
            };
            let fnMove = (e) => {
                this.coordinates[place] = [e.lngLat.lng, e.lngLat.lat];
                this.draw();
            };
            let fnUp2 = (e) => {
                map.off("mousemove", fnMove2);
            };
            let fnMove2 = (e) => {
                //this.move(place_one, e.lngLat);
                let dLng = e.lngLat.lng - place_one.lng;
                let dLat = e.lngLat.lat - place_one.lat;
                //db (dLng)
                let c = [];
                this.coordinates.forEach((elem, index) => {
                    //db (index+"  "+elem[0], "white")
                    c.push([elem[0] + dLng, elem[1] + dLat]);
                });
                this.coordinates = c;
                place_one = e.lngLat;
                this.draw();
            };
            map.on("mousedown", this.nodesId, this._mousedown = (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                down1 = true;
                place = features[0].properties.index;
                type = features[0].properties.type;
                if (type == "m" && !this.split(place, [e.lngLat.lng, e.lngLat.lat])) {
                    return;
                }
                map.on("mousemove", fnMove);
                map.once("mouseup", fnUp);
            });
            map.on("mousedown", this.circleId, this._mousedown2 = (e) => {
                if (down1) {
                    return;
                }
                // Prevent the default map drag behavior.
                e.preventDefault();
                place_one = e.lngLat;
                map.on("mousemove", fnMove2);
                map.once("mouseup", fnUp2);
            });
            map.on("click", this._click = (e) => {
                //db (e.originalEvent.button+".........", "red","yellow")
                var features = this.map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if (this.maxLines == 0) {
                    this.add(e.lngLat);
                    return;
                }
                let lines = this.coordinates.length - 1;
                if (lines < this.maxLines) {
                    this.add(e.lngLat);
                }
                else {
                    this.coordinates[this.maxLines] = [e.lngLat.lng, e.lngLat.lat];
                    this.draw();
                    return;
                }
                return;
            });
            map.on("contextmenu", this._contextmenu = (e) => {
                e.preventDefault();
                this.coordinates.pop();
                this.draw();
            });
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off("click", this._click);
                this.map.off("contextmenu", this._contextmenu);
                this.map.off("mousedown", this.nodesId, this._mousedown);
                this.map.off("mousedown", this.circleId, this._mousedown2);
                // this.map.setPaintProperty(this.lineId, "line-dasharray", [1]);
                //"line-dasharray":[2,2]
                //this.map.setPaintProperty(this.lineId, "line-color", "#fd8d3c");
                //map.on("mousemove", fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setFill(this.fill);
            this.setLine(this.line);
            //this._mode = 0;
            this._play = false;
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
            }
            else {
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
            let map = this.map;
            if (map.getLayer(this.circleId))
                map.removeLayer(this.circleId);
            if (map.getLayer(this.lineId))
                map.removeLayer(this.lineId);
            if (map.getLayer(this.nodesId))
                map.removeLayer(this.nodesId);
            if (map.getSource(this.lineId))
                map.removeSource(this.lineId);
        }
        setCenter(lngLat) {
            this.center = lngLat;
        }
        setHand(lngLat) {
            this.hand = lngLat;
        }
        createCircle(center, radio) {
            let length;
            if (typeof radio === "number") {
                length = radio;
            }
            else {
                var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
                length = turf.length(line, { units: "kilometers" });
            }
            this.radio = length;
            let data = createGeoJSONCircle([center.lng, center.lat], length);
            this.map.getSource(this.lineId).setData(data.data);
        }
        split(index, value) {
            if (this.maxLines != 0 && (this.coordinates.length - 1) >= this.maxLines) {
                return false;
            }
            this.coordinates.splice(index, 0, value);
            this.draw();
            return true;
        }
        getHand() {
            return this.hand;
        }
        getRadio() {
            return this.radio;
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
    }
    class Trace {
        //private pause:boolean = false;
        constructor(info) {
            this.map = null;
            this.type = "trace";
            this.parent = null;
            this.name = "";
            this.visible = true;
            this.data = null;
            this.coordinates = null;
            this.coordinatesInit = null;
            this.flyToSpeed = 0.8;
            this.flyToZoom = 14;
            this.panDuration = 5000;
            this.layers = [];
            this.layers2 = [];
            this.groups = [];
            this._layers = [];
            this.maxLines = 0;
            this.line = {
                color: "blue",
                width: 3,
                opacity: 0.9,
                dasharray: [1]
            };
            this.fill = {
                color: "#f9f871",
                opacity: 0.4
            };
            this.lineEdit = {
                color: "red",
                width: 1,
                opacity: 0.9,
                dasharray: [2, 2]
            };
            this.fillEdit = {
                color: "#ff9933",
                opacity: 0.4
            };
            this.lineColor = "white";
            this.lineWidth = 2;
            this.fillColor = "red";
            //radio:number = 0;
            //center:number[] = null;
            this.hand = null;
            this._status = 0;
            this._nodes = null;
            this._line = null;
            this.id = "p" + String(new Date().getTime());
            this.layerMobilId = null;
            this.lineId = null;
            this.lineIdA = null;
            this.circleId = null;
            this.mobileId = null;
            this.pulsingId = null;
            this.layerSourceId = "";
            this.layerId = "";
            this._events = [];
            this._play = false;
            this._lastIndex = null;
            this.layerIndex = 0;
            this.callmove = () => { };
            this.callresize = () => { };
            this.ondraw = (coordinates) => { };
            this.speedFactor = 0.05; // number of frames per longitude degree
            this.startTime = 0;
            this.endTime = -1;
            this.progress = 0; // progress = timestamp - startTime
            this.resetTime = false; // indicator of whether time reset is needed for the animation
            this.layersId = [];
            this.roadLayerId = "";
            this.roadSourceId = "";
            this.lineLayerId = "";
            this.lineSourceId = "";
            this.nodeSourceId = "";
            this.mobilLayerId = "";
            this.mobilSourceId = "";
            this.traceLayerId = "";
            this.traceSourceId = "";
            this.reverse = false;
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
                },
                paint: {},
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
            console.log(this.data);
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
                        }] //[polygon, point]
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
                },
                "filter": ["==", "$type", "LineString"]
            });
            //this.map.addSource(this.layerSourceId, this.dataFilter(this.coordinatesInit));
            this.map.addSource(this.nodeSourceId, this.dataFilter([]));
            this.layers2.forEach((layer, index) => {
                console.log(layer);
                if (layer.features && Array.isArray(layer.features)) {
                    layer.features.forEach((feature, index) => {
                        //this.createLayer(index, feature);
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
                },
                paint: {},
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
        setLine(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.lineId, "line-" + p, info[p]);
            }
        }
        setFill(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.circleId, "fill-" + p, info[p]);
            }
        }
        setVisible(value) {
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
            }
            else if (info.from_e !== undefined) {
                filter.push([">=", ["get", info.prop], info.from_e]);
            }
            else {
                filter.push(true);
            }
            if (info.to !== undefined) {
                filter.push(["<", ["get", info.prop], info.to]);
            }
            else if (info.to_e !== undefined) {
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
            paint["circle-" + "opacity"] = 0.9;
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
                    "features": [] //[polygon, point]
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
            }
            else {
                this.map.setLayoutProperty(this.traceLayerId, "visibility", "visible");
                this.map.setLayoutProperty(this.mobilLayerId, "visibility", "visible");
            }
        }
        getStatus() {
            return this._status;
        }
        goTo(index) {
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
            console.log("lastIndex", index, this.data[this._lastIndex].ts);
            this.progress = this.data[this._lastIndex].ts / this.speedFactor;
            this.draw(this.coordinatesInit[this._lastIndex], this.data[this._lastIndex].heading);
        }
        goBegin() {
            this.setStatus(2);
            cancelAnimationFrame(this.animation);
            this._lastIndex = 0;
            this.progress = 0; //this.data[this._lastIndex].ts/this.speedFactor;
            this.draw(this.coordinatesInit[this._lastIndex], this.data[this._lastIndex].heading);
        }
        goEnd() {
            this.setStatus(2);
            cancelAnimationFrame(this.animation);
            this._lastIndex = this.coordinatesInit.length - 1;
            this.progress = this.data[this._lastIndex].ts / this.speedFactor;
            this.draw(this.coordinatesInit[this._lastIndex], this.data[this._lastIndex].heading);
        }
        pause() {
            cancelAnimationFrame(this.animation);
            this.setStatus(2);
            this.draw(this.coordinatesInit[this._lastIndex], this.data[this._lastIndex].heading);
        }
        setReverse(value) {
            this.reverse = value;
        }
        play() {
            this.setStatus(1);
            this.startTime = performance.now();
            this.rStartTime = this.startTime;
            //this.startTime = performance.now() - this.progress;
            this.resetTime = true;
            console.log("Play progress", this.progress);
            console.log("Play startTime", this.startTime);
            let ini = this.progress;
            let animateLine = (timestamp) => {
                if (timestamp == 0) {
                    this.animation = requestAnimationFrame(animateLine);
                    return;
                }
                console.log("===", this.progress);
                //let deltaTime = timestamp - this.startTime;
                console.log("**timestamp", timestamp, timestamp - this.startTime);
                if (this.reverse) {
                    console.log("endTime", this.endTime);
                    this.progress = this.endTime - (timestamp - this.rStartTime);
                    this.startTime = performance.now();
                    ini = this.progress;
                }
                else {
                    this.progress = ini + timestamp - this.startTime;
                    //ini = 0;
                    this.endTime = this.progress;
                    this.rStartTime = performance.now();
                }
                console.log("...", this.progress);
                if (this.progress < 0) {
                    console.log("******error");
                    this.progress = 0;
                }
                let speed = this.progress * this.speedFactor;
                console.log(" Factor ", this.speedFactor, " Speed ", speed);
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
                }
                else {
                    nextPoint = this.coordinatesInit[0];
                    nextBearing = this.data[0].heading;
                }
                this.draw(nextPoint, nextBearing);
                // Request the next frame of the animation.
                this.animation = requestAnimationFrame(animateLine);
            };
            animateLine(0);
        }
        playOriginal() {
            this.setStatus(1);
            this.startTime = performance.now();
            this.resetTime = true;
            let animateLine = (timestamp) => {
                let deltaTime = timestamp - this.startTime;
                if (this.resetTime) {
                    // resume previous progress
                    this.startTime = performance.now() - this.progress;
                    this.coordinates = [];
                    this.resetTime = false;
                }
                else {
                    if (this.reverse) {
                        this.progress = this.endTime - (timestamp - this.endTime);
                    }
                    else {
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
                }
                else {
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
            }
            else {
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
            if (map.getLayer(this.mobilLayerId))
                map.removeLayer(this.mobilLayerId);
            if (map.getLayer(this.traceLayerId))
                map.removeLayer(this.traceLayerId);
            if (map.getLayer(this.roadLayerId))
                map.removeLayer(this.roadLayerId);
            /* Delete Sources */
            if (map.getSource(this.nodeSourceId))
                map.removeSource(this.nodeSourceId);
            if (map.getSource(this.traceSourceId))
                map.removeSource(this.traceSourceId);
            if (map.getSource(this.roadSourceId))
                map.removeSource(this.roadSourceId);
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
    }
    class Trace2 {
        constructor(info) {
            this.map = null;
            this.type = "trace";
            this.parent = null;
            this.name = "";
            this.visible = true;
            this.coordinates = [];
            this.coordinatesInit = null;
            this.flyToSpeed = 0.8;
            this.flyToZoom = 14;
            this.panDuration = 5000;
            this.maxLines = 1;
            this.line = {
                color: "#FFA969",
                width: 2,
                opacity: 0.9,
                dasharray: [1]
            };
            this.fill = {
                color: "#f9f871",
                opacity: 0.4
            };
            this.lineEdit = {
                color: "#ff3300",
                width: 1,
                opacity: 0.9,
                dasharray: [2, 2]
            };
            this.fillEdit = {
                color: "#ff9933",
                opacity: 0.4
            };
            this.lineColor = "white";
            this.lineWidth = 2;
            this.fillColor = "red";
            //radio:number = 0;
            //center:number[] = null;
            this.hand = null;
            this._status = 0;
            this._nodes = null;
            this._line = null;
            this.id = "p" + String(new Date().getTime());
            this.nodesId = null;
            this.lineId = null;
            this._play = false;
            this.callmove = () => { };
            this.callresize = () => { };
            this.ondraw = () => { };
            this.features = [];
            this._lineFeature = null;
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this._lineFeature = {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[]]
                }
            };
            this.features.push(this._lineFeature);
            this.nodesId = "n-" + this.id;
            this.lineId = "l-" + this.id;
            this.init();
        }
        init() {
            let map = this.map;
            //let polygon = turf.polygon([coo], { name: "poly1" });
            //polygon = turf.bezierSpline(polygon);
            //            console.log(polygon)
            let geojson = {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": this.features
                }
            };
            this.map.addSource(this.lineId, geojson);
            this.map.addLayer({
                "id": this.lineId,
                "type": "line",
                "source": this.lineId,
                "layout": {
                    "line-join": "round",
                    "line-cap": "round",
                    visibility: (this.visible) ? "visible" : "none"
                },
                "paint": {
                    "line-color": "#ff3300",
                    "line-width": 4,
                },
                "filter": ["==", "$type", "LineString"]
            });
            map.addLayer({
                id: this.nodesId,
                type: "circle",
                source: this.lineId,
                layout: {
                    visibility: "none"
                },
                paint: {
                    "circle-radius": 4,
                    "circle-opacity": ["case", ["==", ["get", "type"], "m"], 0.0, 0.8],
                    "circle-color": "white",
                    "circle-stroke-color": "#ff3300",
                    "circle-stroke-width": 1
                },
                filter: ["in", "$type", "Point"]
                //filter: ["in", "type", "h", "m"]
                //filter: ["in", "type"]
            });
            this.setLine(this.line);
            this.coordinates_ = [
                [-66.84927463531494, 10.490132784557675],
                [-66.84916734695435, 10.487727485274153],
                [-66.847482919693, 10.488339361426192],
                [-66.84403896331787, 10.48798067555274],
                [-66.83899641036987, 10.4872211040956],
                [-66.83056354522705, 10.480659173081785],
                [-66.82998418807983, 10.48194625089936],
                [-66.83200120925903, 10.48333882087384],
                [-66.83295607566833, 10.483686962388932],
                [-66.83379024267197, 10.484296209098416],
                [-66.83488190174103, 10.485327442138733],
                [-66.83595210313797, 10.486147678753897],
                [-66.8368935585022, 10.487347699467918],
                [-66.83808445930487, 10.488181117709713],
                [-66.83968305587774, 10.488465956341086],
                [-66.84177517890936, 10.488687497317594],
                [-66.84476852416998, 10.489014533707307],
                [-66.84704303741461, 10.489362668839194],
                [-66.84779405593878, 10.490064212687859],
                [-66.84927463531494, 10.490132784557675]
            ];
            if (this.coordinates) {
                //this.coordinatesInit = this.coordinates.slice();
                //this.draw();
            }
        }
        addPoint(coordinates, properties) {
            this.coordinates.push(coordinates);
            this.features[0].geometry.coordinates = this.coordinates;
            let point = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": coordinates
                },
                "properties": properties
            };
            this.features.push(point);
        }
        draw2() {
            let data = {
                "type": "FeatureCollection",
                "features": this.features
            };
            this.map.getSource(this.lineId).setData(data);
        }
        setLine(info) {
            for (let p in info) {
                this.map.setPaintProperty(this.lineId, "line-" + p, info[p]);
            }
        }
        setVisible(value) {
            let visible = "none";
            if (value) {
                visible = "visible";
            }
            this.map.setLayoutProperty(this.lineId, "visibility", visible);
            this.map.setLayoutProperty(this.nodesId, "visibility", visible);
        }
        add(lngLat) {
            this.coordinates.push([lngLat.lng, lngLat.lat]);
            this.draw();
        }
        draw() {
            let data = createGeoJSONLine(this.coordinates);
            this.map.getSource(this.lineId).setData(data.data);
        }
        play() {
            if (this._play) {
                return;
            }
            this.parent.stop();
            this._play = true;
            let map = this.map;
            //this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, "visibility", "visible");
            //this.map.setPaintProperty(this.lineId, "line-dasharray", [2,2]);
            let place = null;
            let type = null;
            let place_one = null;
            let down1 = false;
            let fnUp = (e) => {
                map.off("mousemove", fnMove);
                type = null;
                down1 = false;
            };
            let fnMove = (e) => {
                this.coordinates[place] = [e.lngLat.lng, e.lngLat.lat];
                this.draw();
            };
            let fnUp2 = (e) => {
                map.off("mousemove", fnMove2);
            };
            let fnMove2 = (e) => {
                //this.move(place_one, e.lngLat);
                let dLng = e.lngLat.lng - place_one.lng;
                let dLat = e.lngLat.lat - place_one.lat;
                //db (dLng)
                let c = [];
                this.coordinates.forEach((elem, index) => {
                    //db (index+"  "+elem[0], "white")
                    c.push([elem[0] + dLng, elem[1] + dLat]);
                });
                this.coordinates = c;
                place_one = e.lngLat;
                this.draw();
            };
            map.on("mousedown", this.nodesId, this._mousedown = (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                down1 = true;
                place = features[0].properties.index;
                type = features[0].properties.type;
                if (type == "m" && !this.split(place, [e.lngLat.lng, e.lngLat.lat])) {
                    return;
                }
                map.on("mousemove", fnMove);
                map.once("mouseup", fnUp);
            });
            map.on("mousedown", this.circleId, this._mousedown2 = (e) => {
                if (down1) {
                    return;
                }
                // Prevent the default map drag behavior.
                e.preventDefault();
                place_one = e.lngLat;
                map.on("mousemove", fnMove2);
                map.once("mouseup", fnUp2);
            });
            map.on("click", this._click = (e) => {
                //db (e.originalEvent.button+".........", "red","yellow")
                var features = this.map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                this.addPoint([e.lngLat.lng, e.lngLat.lat], false);
                this.draw2();
                return;
                if (this.maxLines == 0) {
                    this.add(e.lngLat);
                    return;
                }
                let lines = this.coordinates.length - 1;
                if (lines < this.maxLines) {
                    this.add(e.lngLat);
                }
                else {
                    this.coordinates[this.maxLines] = [e.lngLat.lng, e.lngLat.lat];
                    this.draw();
                    return;
                }
                return;
            });
            map.on("contextmenu", this._contextmenu = (e) => {
                e.preventDefault();
                this.coordinates.pop();
                this.draw();
            });
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off("click", this._click);
                this.map.off("contextmenu", this._contextmenu);
                this.map.off("mousedown", this.nodesId, this._mousedown);
                this.map.off("mousedown", this.circleId, this._mousedown2);
                // this.map.setPaintProperty(this.lineId, "line-dasharray", [1]);
                //"line-dasharray":[2,2]
                //this.map.setPaintProperty(this.lineId, "line-color", "#fd8d3c");
                //map.on("mousemove", fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, "visibility", "none");
            this.setFill(this.fill);
            this.setLine(this.line);
            //this._mode = 0;
            this._play = false;
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
            }
            else {
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
            let map = this.map;
            if (map.getLayer(this.circleId))
                map.removeLayer(this.circleId);
            if (map.getLayer(this.lineId))
                map.removeLayer(this.lineId);
            if (map.getLayer(this.nodesId))
                map.removeLayer(this.nodesId);
            if (map.getSource(this.lineId))
                map.removeSource(this.lineId);
        }
        setCenter(lngLat) {
            this.center = lngLat;
        }
        setHand(lngLat) {
            this.hand = lngLat;
        }
        createCircle(center, radio) {
            let length;
            if (typeof radio === "number") {
                length = radio;
            }
            else {
                var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
                length = turf.length(line, { units: "kilometers" });
            }
            this.radio = length;
            let data = createGeoJSONCircle([center.lng, center.lat], length);
            this.map.getSource(this.lineId).setData(data.data);
        }
        split(index, value) {
            if ((this.coordinates.length - 1) >= this.maxLines) {
                return false;
            }
            this.coordinates.splice(index, 0, value);
            this.draw();
            return true;
        }
        getHand() {
            return this.hand;
        }
        getRadio() {
            return this.radio;
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
    }
    let ii = 0;
    class Pulsing {
        constructor(map, option) {
            this.map = null;
            this.width = 200;
            this.height = 200;
            this.size = 200;
            this.data = null;
            this.context = null;
            this.rgb = [255, 165, 62];
            this.center = [255, 165, 62];
            for (let x in option) {
                this[x] = option[x];
            }
            this.map = map;
            //this.size = size;
            //this.width = size;
            //this.height = size;
            this.data = new Uint8Array(this.width * this.height * 4);
        }
        onAdd() {
            let canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext("2d");
        }
        render() {
            let duration = 1000;
            let t = (performance.now() % duration) / duration;
            let radius = (this.size / 2) * 0.3;
            let outerRadius = (this.size / 2) * 0.7 * t + radius;
            let context = this.context;
            // draw outer circle
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
            //context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
            //context.fillStyle = 'rgba(255, 165, 62,' + (1 - t) + ')';
            context.fillStyle = `rgba(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]},${1 - t})`;
            context.fill();
            // draw inner circle
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
            //context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.fillStyle = `rgb(${this.center[0]},${this.center[1]},${this.center[2]})`;
            //242, 255, 62
            context.strokeStyle = "white";
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();
            // update this image's data with data from the canvas
            this.data = context.getImageData(0, 0, this.width, this.height).data;
            // continuously repaint the map, resulting in the smooth animation of the dot
            this.map.triggerRepaint();
            // return `true` to let the map know that the image was updated
            return true;
        }
    }
    class Line {
        constructor(info) {
            this.map = null;
            this.coordinates = [
                [-66.94205514843668, 10.364101919393633],
                [-66.74704782421789, 10.455948588617758],
                [-66.87957040722598, 10.561268658842579],
                [-66.99698678906188, 10.49511024268891]
            ];
            this.nodesId = "n-" + String(new Date().getTime());
            this.lineId = "l-" + String(new Date().getTime());
            this.lineWidth = 5;
            this._nodes = null;
            this._line = null;
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let map = this.map;
            this._nodes = {
                "type": "FeatureCollection",
                "features": []
            };
            this._line = {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": this.coordinates
                    }
                }
            };
            ii = 0;
            this.coordinates.forEach((el, index) => {
                ii = ii + 5;
                let point = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [el[0], el[1]]
                    },
                    "properties": {
                        "id": String(new Date().getTime()),
                        "index": index,
                        "angle": ii
                    }
                };
                this._nodes.features.push(point);
            });
            map.addSource(this.nodesId, {
                "type": "geojson",
                "data": this._nodes
            });
            this.map.addSource(this.lineId, this._line);
            this.map.addLayer({
                "id": this.lineId,
                "type": "line",
                "source": this.lineId,
                "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                },
                "paint": {
                    "line-color": "green",
                    "line-width": this.lineWidth / 2,
                    "line-opacity": 0.4,
                    //"line-gap-width":4,
                    "line-dasharray": [2, 2]
                }
            });
            /*map.addLayer({
                id: this.nodesId,
                type: "circle",
                source: this.nodesId,
                paint: {
                    "circle-radius": 4,
                    "circle-opacity":0.0,
                    "circle-color": '#000',
                    "circle-stroke-color":"red",
                    "circle-stroke-width":2
                },
                filter: ["in", "$type", "Point"]
            });*/
            map.addLayer({
                id: this.nodesId,
                type: "symbol",
                source: this.nodesId,
                layout: {
                    "icon-image": "t1",
                    "icon-size": 0.5,
                    "icon-rotate": ["get", "angle"],
                    "text-field": ["format",
                        "foo", { "font-scale": 1.0 },
                        "bar", { "font-scale": 1.0 }
                    ],
                    "text-font": [
                        "Open Sans Bold",
                        "Arial Unicode MS Bold"
                    ],
                    "text-size": 12,
                    "text-offset": [0, 1.5]
                },
                filter: ["in", "$type", "Point"]
            });
        }
        setCoordinates(coordinates) {
            this.coordinates = coordinates;
            this._nodes = {
                "type": "FeatureCollection",
                "features": []
            };
            this._line = {
                "type": "geojson",
                "data": {
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "LineString",
                        "coordinates": this.coordinates
                    }
                }
            };
            this.coordinates.forEach((el, index) => {
                ii = ii + 5;
                let point = {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [el[0], el[1]]
                    },
                    "properties": {
                        "id": String(new Date().getTime()),
                        "index": index,
                        "angle": ii
                    }
                };
                this._nodes.features.push(point);
            });
        }
        redraw() {
            let map = this.map;
            map.getSource(this.lineId).setData(this._line.data);
            map.getSource(this.nodesId).setData(this._nodes);
        }
        add(lngLat) {
            this.coordinates.push([lngLat.lng, lngLat.lat]);
            this.setCoordinates(this.coordinates);
            this.redraw();
        }
        play() {
            let map = this.map;
            let point = null;
            let fnMove = (e) => {
                this.coordinates[point] = [e.lngLat.lng, e.lngLat.lat];
                this.setCoordinates(this.coordinates);
                this.redraw();
            };
            let fnUp = (e) => {
                point = null;
                map.off("mousemove", fnMove);
            };
            map.on("mousedown", this.nodesId, (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if (features.length) {
                    var id = features[0].properties.id;
                }
                point = features[0].properties.index;
                //canvas.style.cursor = "grab";
                map.on("mousemove", fnMove);
                map.once("mouseup", fnUp);
            });
            map.on("mousedown", (e) => {
                // Prevent the default map drag behavior.
                //e.preventDefault();
            });
            map.on("mouseup", (e) => {
                // Prevent the default map drag behavior.
                //e.preventDefault();
            });
            map.on("mousemove", (e) => {
                // Prevent the default map drag behavior.
                //e.preventDefault();
            });
            map.on("click", (e) => {
                ii++;
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if (ii >= 6) {
                    //return;
                }
                this.add(e.lngLat);
                //map.getSource("geojson").setData(this.geojson);
            });
            return;
            map.on("mousedown", (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                this.data.data.geometry.coordinates.push([e.lngLat.lng, e.lngLat.lat]);
                console.log(this.data.data);
                // then update the map
                this.map.getSource(this.id).setData(this.data.data);
                db(this.id, "aqua");
                db(e.lngLat, "white");
            });
        }
        pause() {
        }
        stop() {
        }
        delete() {
        }
        reset() {
        }
    }
    class Popup {
        constructor() {
        }
    }
    class Mark {
        constructor(info) {
            this.map = null;
            this.icon = "";
            this.width = "15px";
            this.height = "24px";
            this.image = '';
            this.src = "";
            this.visible = true;
            this.lat = 0;
            this.lng = 0;
            this.heading = 0;
            this.popupInfo = "";
            this.flyToSpeed = 0.8;
            this.flyToZoom = 14;
            this.panDuration = 5000;
            this._marker = null;
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let markerHeight = 24, markerRadius = 0, linearOffset = 0;
            let popupOffsets = {
                "top": [0, 0],
                "top-left": [0, 0],
                "top-right": [0, 0],
                "bottom": [0, -markerHeight / 2 + 5],
                "bottom-left": [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                "bottom-right": [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                "left": [markerRadius, (markerHeight - markerRadius) * -1],
                "right": [-markerRadius, (markerHeight - markerRadius) * -1]
            };
            let popup = new mapboxgl.Popup({
                offset: popupOffsets,
                className: "my-class"
            })
                //.setLngLat(e.lngLat)
                .setHTML(this.popupInfo)
                .setMaxWidth("300px"); //.addTo(map);
            let el = document.createElement("img");
            el.className = "marker";
            el.src = this.image;
            //el.style.width = this.width;
            el.style.height = this.height;
            let M = this._marker = new mapboxgl.Marker(el)
                .setLngLat([this.lng, this.lat]);
            M.setPopup(popup);
            M.setRotation(this.heading);
            if (this.visible) {
                this._marker.addTo(this.map);
            }
        }
        setLngLat(lngLat) {
            this._marker.setLngLat(lngLat);
        }
        setHeading(heading) {
        }
        setPopup(html) {
            this._marker.getPopup().setHTML(html);
        }
        show(value) {
            if (this._marker) {
                this.visible = value;
                if (value) {
                    this._marker.addTo(this.map);
                }
                else {
                    this._marker.remove();
                }
            }
        }
        hide() {
        }
        flyTo(zoom, speed) {
            this.map.flyTo({
                center: this._marker.getLngLat(),
                zoom: zoom || this.flyToZoom,
                speed: speed || this.flyToSpeed,
                curve: 1,
                easing(t) {
                    return t;
                }
            });
        }
        panTo(duration) {
            this.map.panTo(this._marker.getLngLat(), { duration: duration || this.panDuration });
        }
    }
    class Group {
        constructor() {
            this.marks = null;
            this.groups = null;
        }
        show(value) {
        }
    }
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
                style: "mapbox://styles/mapbox/streets-v10",
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
                map.addImage("pulsing-blue", new Pulsing(map, {
                    rgb: [0, 255, 255],
                    center: [0, 128, 255]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-yellow", new Pulsing(map, {
                    rgb: [255, 76, 0],
                    center: [255, 255, 102]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-orange", new Pulsing(map, {
                    rgb: [255, 76, 0],
                    center: [255, 128, 0]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-red", new Pulsing(map, {
                    rgb: [255, 255, 204],
                    center: [255, 0, 0]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-pink", new Pulsing(map, {
                    rgb: [247, 67, 183],
                    center: [247, 67, 216]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-green", new Pulsing(map, {
                    rgb: [204, 255, 220],
                    center: [102, 255, 153]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-dot", new Pulsing(map, {
                    rgb: [153, 255, 51],
                    center: [0, 204, 0]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-dot2", new Pulsing(map, {
                    rgb: [247, 67, 183],
                    center: [247, 67, 216]
                }), { pixelRatio: 3 });
                map.addImage("pulsing-01", new Pulsing(map, {
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