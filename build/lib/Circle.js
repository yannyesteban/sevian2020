import { createGeoJSONCircle } from './Util.js';
export class Circle {
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
//# sourceMappingURL=Circle.js.map