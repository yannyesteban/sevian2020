export class Polygon {
    constructor(info) {
        this.feature = null;
        this.sourceId = "";
        this.fillLayerId = "";
        this.borderLayerId = "";
        this.nodeLayerId = "";
        this.midLayerId = "";
        this.map = null;
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
        this.lineId = null;
        this.circleId = null;
        this._play = false;
        this.callmove = () => { };
        this.callresize = () => { };
        this.ondraw = () => { };
        this.createMidPoints = function (coords) {
            let coordinates = coords.slice();
            let p1 = null, p2 = null;
            const features = [];
            coordinates.map((item, index) => {
                if (index == 0) {
                    p1 = turf.point(item);
                    return;
                }
                p2 = turf.point(item);
                features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": item
                    },
                    "properties": {
                        "index": index,
                        "type": "h",
                    }
                });
                features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": turf.midpoint(p1, p2).geometry.coordinates
                    },
                    "properties": {
                        "index": index,
                        "type": "m",
                    }
                });
                p1 = p2;
            });
            return features;
        };
        for (let x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        this.sourceId = "s-" + this.id;
        this.fillLayerId = "f-" + this.id;
        this.borderLayerId = "b-" + this.id;
        this.nodeLayerId = "n-" + this.id;
        this.midLayerId = "m-" + this.id;
        this.init();
    }
    getType() {
        return Polygon.TYPE;
    }
    init() {
        let map = this.map;
        if (this.feature === null) {
            this.feature = {
                "type": "Feature",
                "properties": {
                    "fill-color": "#aa2255",
                    "line-color": "#5522aa",
                    "line-width": 2,
                    "line-dasharray": [2, 2],
                    "fill-opacity": 0.4,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[]]
                }
            };
        }
        else {
            this.feature = {
                "type": "Feature",
                "properties": {
                    "fill-color": "#aa2255",
                    "line-color": "#5522aa",
                    "line-width": 2,
                    "line-dasharray": [2, 2],
                    "fill-opacity": 0.4,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-66.87686735735063, 10.49935516128366], [-66.86582490973026, 10.509106707957727], [-66.85887225752434, 10.506291860101157], [-66.85672511493149, 10.500662087456533], [-66.85652062516098, 10.488296334115446], [-66.86153062454457, 10.504381770164244], [-66.86459797110578, 10.50649292151337], [-66.87686735735063, 10.49935516128366]]]
                }
            };
        }
        const geojson = this.setFeature(this.feature);
        /*
        const midPoints = this.createMidPoints( this.feature.geometry.coordinates[0]);
        console.log(midPoints);

        const features = [];
        features.push(this.feature);

        const geojson = {
        "type": "geojson",
        "data": turf.featureCollection(features.concat(midPoints))};
        */
        this.map.addSource(this.sourceId, geojson);
        this.map.addLayer({
            "id": this.borderLayerId,
            "type": "line",
            "source": this.sourceId,
            "layout": {
                "line-join": "round",
                "line-cap": "round",
                "visibility": (this.visible) ? "visible" : "none"
            },
            "paint": {
                "line-color": ["get", "line-color"],
                "line-width": ["get", "line-width"],
            },
            "filter": ["==", "$type", "Polygon"]
        });
        this.map.addLayer({
            "id": this.fillLayerId,
            "type": "fill",
            "source": this.sourceId,
            "layout": {
                visibility: (this.visible) ? "visible" : "none"
            },
            "paint": {
                "fill-color": ["get", "fill-color"],
                "fill-opacity": ["get", "fill-opacity"],
            },
            "filter": ["==", "$type", "Polygon"]
        });
        /*
        map.addLayer({
            id: this.nodeLayerId,
            type: "circle",
            source: this.sourceId,
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
            filter: ["in", "type", "h"]
            //filter: ["in", "$type", "Point"]
            //filter: ["in", "type", "m"]
            //filter: ["in", "type"]
        });
        */
        map.addLayer({
            id: this.nodeLayerId,
            type: "circle",
            source: this.sourceId,
            layout: {
                visibility: "visible"
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
            //filter: ["in", "type", "m"]
        });
        return;
        //this.setLine(this.line);
        //this.setFill(this.fill);
        this.map.setPaintProperty(this.fillLayerId, "fill-color", "#aa0000");
        //console.log(this.map.getLayoutProperty(this.fillLayerId));
        this.setFeature(this.feature);
    }
    updateSource(geojson) {
        this.map.getSource(this.sourceId).setData(geojson.data);
    }
    setLine(info) {
        for (let p in info) {
            this.map.setPaintProperty(this.borderLayerId, "line-" + p, info[p]);
        }
    }
    setFill(info) {
        for (let p in info) {
            this.map.setPaintProperty(this.fillLayerId, "fill-" + p, info[p]);
        }
    }
    setVisible(value) {
        let visible = "none";
        if (value) {
            visible = "visible";
        }
        this.map.setLayoutProperty(this.borderLayerId, "visibility", visible);
        this.map.setLayoutProperty(this.fillLayerId, "visibility", visible);
        if (this._play) {
            this.map.setLayoutProperty(this.nodeLayerId, "visibility", visible);
        }
    }
    getCoordinates() {
        return turf.getCoords(turf.getGeom(this.feature))[0];
    }
    setFeature(feature) {
        this.feature = feature;
        const midPoints = this.createMidPoints(this.feature.geometry.coordinates[0]);
        const features = [];
        features.push(this.feature);
        const geojson = {
            "type": "geojson",
            "data": turf.featureCollection(features.concat(midPoints))
        };
        return geojson;
        //this.map.getSource(this.sourceId).setData(geojson);
    }
    draw() {
        //let data = createGeoJSONPoly(this.coordinates);
        return;
        this.map.getSource(this.lineId).setData(data.data);
        this.ondraw(this.coordinates);
    }
    add(lngLat) {
        this.feature.geometry.coordinates[0][this.feature.geometry.coordinates.length - 1] = [lngLat.lng, lngLat.lat];
        this.feature.geometry.coordinates[0].push(this.feature.geometry.coordinates[0][0]);
        this.updateSource(this.setFeature(this.feature));
    }
    removeLast() {
        const geo = this.feature.geometry;
        console.log(geo.coordinates[0]);
        if (geo.coordinates[0].length > 0) {
            this.feature.geometry.coordinates[0].splice(geo.coordinates[0].length - 1, 1);
            console.log(geo.coordinates[0]);
            this.updateSource(this.setFeature(this.feature));
        }
    }
    moveNode(index, coordinates) {
        if (index === this.feature.geometry.coordinates[0].length - 1) {
            this.feature.geometry.coordinates[0][0] = coordinates;
        }
        this.feature.geometry.coordinates[0][index] = coordinates;
        this.updateSource(this.setFeature(this.feature));
    }
    move(deltaLng, deltaLat) {
        for (let i = 0; i < this.feature.geometry.coordinates[0].length; i++) {
            this.feature.geometry.coordinates[0][i] = [
                this.feature.geometry.coordinates[0][i][0] + deltaLng,
                this.feature.geometry.coordinates[0][i][1] + deltaLat
            ];
        }
        this.updateSource(this.setFeature(this.feature));
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
        //this.map.setLayoutProperty(this.nodeLayerId, "visibility", "none");
        this.setVisible(true);
        this.setFill(this.fillEdit);
        this.setLine(this.lineEdit);
        //this.map.setLayoutProperty(this.nodeLayerId, "visibility", "visible");
        //this.map.setPaintProperty(this.lineId, "line-dasharray", [2,2]);
        let place = null;
        let type = null;
        let place_one = null;
        let down1 = false;
        let index = null;
        let fnUp = (e) => {
            map.off("mousemove", fnMove);
            type = null;
            down1 = false;
        };
        let fnMove = (e) => {
            this.moveNode(index, [e.lngLat.lng, e.lngLat.lat]);
        };
        let fnUp2 = (e) => {
            map.off("mousemove", fnMove2);
        };
        let fnMove2 = (e) => {
            const dLng = e.lngLat.lng - place_one.lng;
            const dLat = e.lngLat.lat - place_one.lat;
            place_one = e.lngLat;
            this.move(dLng, dLat);
        };
        map.on("mousedown", this.nodeLayerId, this._mousedown = (e) => {
            // Prevent the default map drag behavior.
            e.preventDefault();
            down1 = true;
            var features = map.queryRenderedFeatures(e.point, {
                layers: [this.nodeLayerId]
            });
            index = place = features[0].properties.index;
            type = features[0].properties.type;
            console.log(index);
            if (type == "m") {
                this.split(place, [e.lngLat.lng, e.lngLat.lat]);
                this.draw();
            }
            map.on("mousemove", fnMove);
            map.once("mouseup", fnUp);
        });
        map.on("mousedown", this.fillLayerId, this._mousedown2 = (e) => {
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
                layers: [this.nodeLayerId]
            });
            this.add(e.lngLat);
        });
        map.on("contextmenu", this._contextmenu = (e) => {
            e.preventDefault();
            this.removeLast();
        });
    }
    pause() {
    }
    stop() {
        if (this._play) {
            this.map.off("click", this._click);
            this.map.off("contextmenu", this._contextmenu);
            this.map.off("mousedown", this.nodeLayerId, this._mousedown);
            this.map.off("mousedown", this.circleId, this._mousedown2);
            // this.map.setPaintProperty(this.lineId, "line-dasharray", [1]);
            //"line-dasharray":[2,2]
            //this.map.setPaintProperty(this.lineId, "line-color", "#fd8d3c");
            //map.on("mousemove", fnMove);
        }
        this.map.setLayoutProperty(this.nodeLayerId, "visibility", "none");
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
        this.feature.geometry.coordinates[0] = [];
        this.updateSource(this.setFeature(this.feature));
        return;
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
        if (map.getLayer(this.nodeLayerId))
            map.removeLayer(this.nodeLayerId);
        if (map.getSource(this.lineId))
            map.removeSource(this.lineId);
    }
    getCoordinates2() {
        return this.coordinates;
    }
    setCenter(lngLat) {
        this.center = lngLat;
    }
    setHand(lngLat) {
        this.hand = lngLat;
    }
    split(index, value) {
        //let coordinates = this.getCoordinates();
        //coordinates.splice(index, 0, value);
        //console.log(this.feature.geometry.coordinates[0])
        this.feature.geometry.coordinates[0].splice(index, 0, value);
        this.updateSource(this.setFeature(this.feature));
        //this.setFeature(this.feature);
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
Polygon.TYPE = "polygon";
//# sourceMappingURL=Polygon.js.map