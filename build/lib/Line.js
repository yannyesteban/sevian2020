let ii = 0;
export class Line {
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
//# sourceMappingURL=Line.js.map