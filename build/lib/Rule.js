import { createGeoJSONLine, createGeoJSONCircle } from './Util.js';
export class Rule {
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
//# sourceMappingURL=Rule.js.map