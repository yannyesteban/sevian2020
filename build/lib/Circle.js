import { createGeoJSONCircle } from './Util.js';
export class Circle {
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
        this.type = "circle";
        this.parent = null;
        this.name = "";
        this.visible = true;
        this.flyToSpeed = 0.8;
        this.flyToZoom = 14;
        this.panDuration = 5000;
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
        return;
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
    getType() {
        return Circle.TYPE;
    }
    init() {
        let map = this.map;
        if (this.feature === null) {
            this.feature = {
                "type": "Feature",
                "properties": {
                    "center": null,
                    "radius": null,
                    "rol": "circle",
                    "color": this.color,
                    "width": this.width,
                    "opacity": this.opacity,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[]]
                }
            };
        }
        else {
            /*this.feature.properties.rol = "circle";alert(2)
            this.feature = {
                "type": "Feature", "geometry":
                {
                    "type": "Polygon", "coordinates":
                        //[[[-66.87412347509954, 10.559468614481247], [-66.8743216356281, 10.563460708395764], [-66.87491420881956, 10.567414356263585], [-66.87589548787015, 10.571291482294457], [-66.8772560225262, 10.575054747645252], [-66.87898271009522, 10.57866791001343], [-66.88105892163202, 10.58209617267023], [-66.88346466208453, 10.585306519572189], [-66.88617676285708, 10.588268033323686], [-66.88916910493664, 10.590952192928366], [-66.8924128704332, 10.593333148461927], [-66.89587682011182, 10.595387970021015], [-66.89952759424351, 10.59709686855074], [-66.90333003387765, 10.598443386424078], [-66.90724751944194, 10.59941455593783], [-66.91124232340889, 10.600001024198683], [-66.9152759736325, 10.600197143196686], [-66.91930962385612, 10.600001024198683], [-66.92330442782307, 10.59941455593783], [-66.92722191338736, 10.598443386424078], [-66.9310243530215, 10.59709686855074], [-66.93467512715318, 10.595387970021015], [-66.9381390768318, 10.593333148461927], [-66.94138284232837, 10.590952192928366], [-66.94437518440793, 10.588268033323686], [-66.94708728518047, 10.585306519572189], [-66.94949302563299, 10.58209617267023], [-66.95156923716979, 10.57866791001343], [-66.95329592473881, 10.575054747645252], [-66.95465645939485, 10.571291482294457], [-66.95563773844545, 10.567414356263585], [-66.9562303116369, 10.563460708395764], [-66.95642847216547, 10.559468614481247], [-66.9562303116369, 10.55547652056673], [-66.95563773844545, 10.551522872698909], [-66.95465645939485, 10.547645746668037], [-66.95329592473881, 10.543882481317242], [-66.95156923716979, 10.540269318949065], [-66.94949302563299, 10.536841056292264], [-66.94708728518047, 10.533630709390305], [-66.94437518440793, 10.530669195638808], [-66.94138284232837, 10.527985036034128], [-66.9381390768318, 10.525604080500568], [-66.93467512715318, 10.523549258941479], [-66.9310243530215, 10.521840360411755], [-66.92722191338736, 10.520493842538416], [-66.92330442782307, 10.519522673024664], [-66.91930962385612, 10.518936204763811], [-66.9152759736325, 10.518740085765808], [-66.91124232340889, 10.518936204763811], [-66.90724751944194, 10.519522673024664], [-66.90333003387765, 10.520493842538416], [-66.89952759424351, 10.521840360411755], [-66.89587682011182, 10.523549258941479], [-66.8924128704332, 10.525604080500568], [-66.88916910493664, 10.527985036034128], [-66.88617676285708, 10.530669195638808], [-66.88346466208453, 10.533630709390305], [-66.88105892163202, 10.536841056292264], [-66.87898271009522, 10.540269318949065], [-66.8772560225262, 10.543882481317242], [-66.87589548787015, 10.547645746668037], [-66.87491420881956, 10.551522872698909], [-66.8743216356281, 10.55547652056673], [-66.87412347509954, 10.559468614481247]]]
                    [[]]
                }, "properties": {
                    "rol": "circle",
                    "radius": 5,
                    "center": null,
                    //"center": [-66.9152759736325, 10.559468614481247],
                    "color": "#45ff00", "width": 6, "opacity": 0.4
                }
            }
            */
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
                //"line-gap-width":4,
                //"line-dasharray":[2,2]
                //"line-dasharray": ["get","line-width"]
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
    setFeature(feature) {
        this.feature = feature;
        this.color = this.feature.properties.color;
        const geojson = this.createGeoJSONCircle(this.feature);
        return geojson;
        //this.map.getSource(this.sourceId).setData(geojson);
    }
    updateSource(geojson) {
        this.map.getSource(this.sourceId).setData(geojson.data);
        if (this.editMode) {
            //this.map.setPaintProperty(this.nodeLayerId, "circle-stroke-color", "#ff0000");
        }
        this.ondraw(this.feature);
    }
    setCenter(center) {
        this.feature.properties.center = center;
        this.updateSource(this.setFeature(this.feature));
    }
    setRadius(radius) {
        var line = turf.lineString([this.feature.properties.center, radius]);
        this.feature.properties.radius = turf.length(line, { units: "kilometers" });
        this.updateSource(this.setFeature(this.feature));
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
    createGeoJSONCircle(feature, points) {
        if (feature.properties.center === null) {
            return {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": []
                }
            };
        }
        const ret = [];
        const hands = [];
        if (!points)
            points = 64;
        const coords = {
            latitude: feature.properties.center[1],
            longitude: feature.properties.center[0]
        };
        const km = feature.properties.radius || 0;
        const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
        const distanceY = km / 110.574;
        let theta, x, y;
        for (let i = 0; i < points; i++) {
            theta = (i / points) * (2 * Math.PI);
            x = distanceX * Math.cos(theta);
            y = distanceY * Math.sin(theta);
            ret.push([coords.longitude + x, coords.latitude + y]);
            if (i % (~~(points / 4)) == 0) {
                hands.push([coords.longitude + x, coords.latitude + y]);
            }
        }
        ret.push(ret[0]);
        this.feature.geometry = {
            "type": "Polygon",
            "coordinates": [ret]
        };
        let json = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [this.feature]
            }
        };
        json.data.features.push({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": feature.properties.center
            },
            "properties": {
                "index": -1,
                "type": "c",
            }
        });
        hands.forEach((item, index) => {
            json.data.features.push({
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
    test() {
    }
    _fnclick(map) {
        return this._click = (e) => {
            if (this.feature.properties.center !== null) {
                this.setRadius([e.lngLat.lng, e.lngLat.lat]);
            }
            else {
                this.feature.properties.radius = 0;
                this.setCenter([e.lngLat.lng, e.lngLat.lat]);
            }
        };
    }
    play() {
        console.log("play");
        if (this.editMode) {
            return;
        }
        this.parent.stop();
        this.editMode = true;
        let map = this.map;
        //this.map.setLayoutProperty(this.nodesId, "visibility", "none");
        this.setVisible(true);
        //this.setFill(this.fillEdit);
        //this.setLine(this.lineEdit);
        this.map.setLayoutProperty(this.nodeLayerId, "visibility", "visible");
        this.map.setPaintProperty(this.borderLayerId, "line-dasharray", [2, 2]);
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
                this.setCenter([e.lngLat.lng, e.lngLat.lat]);
                //this.center = [e.lngLat.lng, e.lngLat.lat];
                //this.createCircle(this.center, this.radio);
                this.callmove();
            }
            else if (place == "h") {
                this.hand = [e.lngLat.lng, e.lngLat.lat];
                this.setRadius([e.lngLat.lng, e.lngLat.lat]);
                this.callresize();
            }
        };
        map.on("mousedown", this.nodeLayerId, this._mousedown = (e) => {
            // Prevent the default map drag behavior.
            e.preventDefault();
            var features = map.queryRenderedFeatures(e.point, {
                layers: [this.nodeLayerId]
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
        console.log("stop");
        if (this.editMode) {
            this.map.off("click", this._click);
            this.map.off("mousedown", this.nodeLayerId, this._mousedown);
            // this.map.setPaintProperty(this.lineId, "line-dasharray", [1]);
            //"line-dasharray":[2,2]
            //this.map.setPaintProperty(this.lineId, "line-color", "#fd8d3c");
            //map.on("mousemove", fnMove);
        }
        this.map.setLayoutProperty(this.nodeLayerId, "visibility", "none");
        this.map.setPaintProperty(this.borderLayerId, "line-dasharray", [1]);
        //this.setFill(this.fill);
        //this.setLine(this.line);
        //this._mode = 0;
        this.editMode = false;
    }
    reset() {
        console.log("reset");
        console.log(this.defaultFeature);
        if (!this.editMode) {
            return;
        }
        this.updateSource(this.setFeature(JSON.parse(JSON.stringify(this.defaultFeature))));
        this.setProperties(this.defaultFeature.properties);
    }
    draw(center, radio) {
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
        const feature = data.data.features[0];
        this.source = this.map.getSource(this.lineId).setData(data.data);
        feature.properties = {
            "rol": "circle",
            "radio": radio,
            "center": center,
            "color": "",
            "width": 2,
            "opacity": 0.4,
        };
        this.ondraw(feature);
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
        const bboxPolygon = turf.bbox(this.feature.geometry);
        this.map.fitBounds(bboxPolygon, {
            padding: 80
        });
        return;
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
        if (map.getLayer(this.fillLayerId))
            map.removeLayer(this.fillLayerId);
        if (map.getLayer(this.borderLayerId))
            map.removeLayer(this.borderLayerId);
        if (map.getLayer(this.nodeLayerId))
            map.removeLayer(this.nodeLayerId);
        if (map.getSource(this.sourceId))
            map.removeSource(this.sourceId);
    }
}
Circle.TYPE = "circle";
//# sourceMappingURL=Circle.js.map