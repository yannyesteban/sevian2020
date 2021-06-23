import { createGeoJSONRectangle } from './Util.js';
export class Rectangle {
    constructor(info) {
        this.feature = null;
        this.defaultFeature = null;
        this.sourceId = "";
        this.fillLayerId = "";
        this.borderLayerId = "";
        this.nodeLayerId = "";
        this.midLayerId = "";
        this.editMode = false;
        this.color = "#ff3300";
        this.opacity = 0.4;
        this.width = 2;
        this.map = null;
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
        this.createMidPoints = function (coords, color) {
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
                        "color": color
                    }
                });
                features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": turf.midpoint(p1, p2).geometry.coordinates
                    },
                    "properties": {
                        "index": index + 9,
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
        return;
        this.nodesId = "n-" + this.id;
        this.lineId = "l-" + this.id;
        this.circleId = "c-" + this.id;
        this.init();
    }
    getType() {
        return Rectangle.TYPE;
    }
    init() {
        let map = this.map;
        const feature1 = {
            "type": "Feature",
            "properties": {
                "rol": "rectangle",
                "color": this.color,
                "width": this.width,
                "dasharray": [2, 2],
                "opacity": this.opacity,
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -66.92179910595793,
                            10.547093051244758
                        ],
                        [
                            -66.86824075634837,
                            10.547093051244758
                        ],
                        [
                            -66.86824075634837,
                            10.466752297728732
                        ],
                        [
                            -66.92179910595793,
                            10.466752297728732
                        ],
                        [
                            -66.92179910595793,
                            10.547093051244758
                        ]
                    ]
                ]
            }
        };
        this.popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
        //this.playPopup();
        if (this.feature === null) {
            this.feature = {
                "type": "Feature",
                "properties": {
                    "rol": "rectangle",
                    "color": this.color,
                    "width": this.width,
                    "dasharray": [2, 2],
                    "opacity": this.opacity,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[]]
                }
            };
        }
        if (this.feature.geometry.coordinates === null) {
            this.feature.geometry.coordinates = [[]];
        }
        this.defaultFeature = JSON.parse(JSON.stringify(this.feature));
        const geojson = this.setFeature(this.feature);
        this.map.addSource(this.sourceId, geojson);
        this.map.addLayer({
            "id": this.fillLayerId,
            "type": "fill",
            "source": this.sourceId,
            "layout": {
                visibility: (this.visible) ? "visible" : "none"
            },
            "paint": {
                "fill-color": ["get", "color"],
                "fill-opacity": ["get", "opacity"],
            },
            "filter": ["==", "$type", "Polygon"]
        });
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
                "line-color": ["get", "color"],
                "line-width": ["get", "width"],
            },
            "filter": ["==", "$type", "Polygon"]
        });
        map.addLayer({
            id: this.nodeLayerId,
            type: "circle",
            source: this.sourceId,
            layout: {
                visibility: (this.editMode && this.visible) ? "visible" : "none"
            },
            paint: {
                "circle-radius": 4,
                "circle-opacity": ["case", ["==", ["get", "type"], "m"], 0.0, 0.8],
                "circle-color": ["get", "color"],
                "circle-stroke-color": "#FFFFFF",
                "circle-stroke-width": 1
            },
            filter: ["in", "$type", "Point"]
            //filter: ["in", "type", "h", "m"]
            //filter: ["in", "type", "m"]
        });
    }
    setDefaultFeature(feature) {
        this.defaultFeature = feature;
    }
    updateSource(geojson) {
        this.map.getSource(this.sourceId).setData(geojson.data);
        if (this.editMode) {
            //this.map.setPaintProperty(this.nodeLayerId, "circle-stroke-color", "#ff0000");
        }
        this.ondraw(this.feature);
    }
    setProperties(info) {
        for (let p in info) {
            this.feature.properties[p] = info[p];
            switch (p) {
                case "dasharray":
                    this.map.setPaintProperty(this.borderLayerId, "line-dasharray", info[p]);
                    break;
                case "color":
                    this.map.setPaintProperty(this.borderLayerId, "line-color", info[p]);
                    this.map.setPaintProperty(this.fillLayerId, "fill-color", info[p]);
                    break;
                case "opacity":
                    this.map.setPaintProperty(this.fillLayerId, "fill-opacity", info[p]);
                    break;
            }
        }
        this.ondraw(this.feature);
    }
    setFeature(feature) {
        this.feature = feature;
        this.color = this.feature.properties.color;
        const midPoints = this.createMidPoints(this.feature.geometry.coordinates[0], this.color);
        const features = [];
        features.push(this.feature);
        const geojson = {
            "type": "geojson",
            "data": turf.featureCollection(features.concat(midPoints))
        };
        return geojson;
        //this.map.getSource(this.sourceId).setData(geojson);
    }
    createGeoJSONRectangle(p1, p2 = null) {
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
    }
    ;
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
        if (this.editMode || value === false) {
            this.map.setLayoutProperty(this.nodeLayerId, "visibility", visible);
        }
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
    resize(point, index) {
        const geo = this.feature.geometry;
        if (geo.coordinates[0].length <= 0) {
            geo.coordinates[0].push([...point]);
            geo.coordinates[0].push([...point]);
            geo.coordinates[0].push([...point]);
            geo.coordinates[0].push([...point]);
            geo.coordinates[0].push([...point]);
            this.updateSource(this.setFeature(this.feature));
            return;
        }
        if (index === 4 && geo.coordinates[0][4]) {
            geo.coordinates[0][4] = point;
            geo.coordinates[0][1][1] = point[1];
            geo.coordinates[0][3][0] = point[0];
            geo.coordinates[0][0] = geo.coordinates[0][4];
        }
        if (index === 1 && geo.coordinates[0][1]) {
            geo.coordinates[0][4][1] = point[1];
            geo.coordinates[0][1] = point;
            geo.coordinates[0][2][0] = point[0];
            geo.coordinates[0][0] = geo.coordinates[0][4];
        }
        if (index === 2 && geo.coordinates[0][2]) {
            geo.coordinates[0][1][0] = point[0];
            geo.coordinates[0][2] = point;
            geo.coordinates[0][3][1] = point[1];
        }
        if (index === 3 && geo.coordinates[0][3]) {
            geo.coordinates[0][4][0] = point[0];
            geo.coordinates[0][2][1] = point[1];
            geo.coordinates[0][3] = point;
            geo.coordinates[0][0] = geo.coordinates[0][4];
        }
        if (index === 10) {
            geo.coordinates[0][4][1] = point[1];
            geo.coordinates[0][1][1] = point[1];
            geo.coordinates[0][0] = geo.coordinates[0][4];
        }
        if (index === 11) {
            geo.coordinates[0][1][0] = point[0];
            geo.coordinates[0][2][0] = point[0];
        }
        if (index === 12) {
            geo.coordinates[0][2][1] = point[1];
            geo.coordinates[0][3][1] = point[1];
        }
        if (index === 13) {
            geo.coordinates[0][3][0] = point[0];
            geo.coordinates[0][4][0] = point[0];
            geo.coordinates[0][0] = geo.coordinates[0][4];
        }
        this.updateSource(this.setFeature(this.feature));
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
        if (this.editMode) {
            return;
        }
        this.parent.stop();
        this.editMode = true;
        let map = this.map;
        //this.map.setLayoutProperty(this.nodeLayerId, "visibility", "none");
        this.setVisible(true);
        //this.setFill(this.fillEdit);
        //this.setLine(this.lineEdit);
        //this.map.setLayoutProperty(this.nodeLayerId, "visibility", "visible");
        this.map.setPaintProperty(this.borderLayerId, "line-dasharray", [2, 2]);
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
            this.resize([e.lngLat.lng, e.lngLat.lat], place);
            return;
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
            place = features[0].properties.index;
            type = features[0].properties.type;
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
            /*var features = this.map.queryRenderedFeatures(e.point, {
                layers: [this.nodeLayerId]
            });*/
            this.resize([e.lngLat.lng, e.lngLat.lat], 2);
        });
        map.on("contextmenu", this._contextmenu = (e) => {
            e.preventDefault();
            //this.coordinates.pop();
            //this.draw();
            alert("back");
        });
    }
    pause() {
    }
    stop() {
        if (this.editMode) {
            this.map.off("click", this._click);
            this.map.off("contextmenu", this._contextmenu);
            this.map.off("mousedown", this.nodeLayerId, this._mousedown);
            this.map.off("mousedown", this.fillLayerId, this._mousedown2);
            this.map.setPaintProperty(this.borderLayerId, "line-dasharray", [1]);
            //"line-dasharray":[2,2]
            //this.map.setPaintProperty(this.lineId, "line-color", "#fd8d3c");
            //map.on("mousemove", fnMove);
        }
        this.map.setLayoutProperty(this.nodeLayerId, "visibility", "none");
        //this.setFill(this.fill);
        //this.setLine(this.line);
        //this._mode = 0;
        this.editMode = false;
    }
    reset() {
        if (!this.editMode) {
            return;
        }
        this.updateSource(this.setFeature(JSON.parse(JSON.stringify(this.defaultFeature))));
        this.setProperties(this.defaultFeature.properties);
    }
    delete() {
        this.stop();
        let map = this.map;
        if (map.getLayer(this.nodeLayerId))
            map.removeLayer(this.nodeLayerId);
        if (map.getLayer(this.borderLayerId))
            map.removeLayer(this.borderLayerId);
        if (map.getLayer(this.fillLayerId))
            map.removeLayer(this.fillLayerId);
        if (map.getSource(this.sourceId))
            map.removeSource(this.sourceId);
    }
    getCoordinates() {
        return this.coordinates;
    }
    split(index, value) {
        this.coordinates.splice(index, 0, value);
    }
    getHand() {
        return this.hand;
    }
    flyTo(zoom, speed) {
        const bboxPolygon = turf.bbox(this.feature.geometry);
        this.map.fitBounds(bboxPolygon, {
            padding: 80
        });
        return;
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
Rectangle.TYPE = "rectangle";
//# sourceMappingURL=Rectangle.js.map