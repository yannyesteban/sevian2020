import { createGeoJSONRectangle, createGeoJSONPoly, createGeoJSONLine, createGeoJSONCircle } from './Util.js';
import { IPoly } from './IPoly';
import { Polygon as GeoPolygon, Feature } from '../types/geojson/GeoJSON';

export class Polygon implements IPoly {
    public static readonly TYPE = "polygon";
    private feature: any = null;

    private sourceId: string = "";

    private fillLayerId: string = "";
    private borderLayerId: string = "";
    private nodeLayerId: string = "";
    private midLayerId: string = "";
    private editMode: boolean = false;
    private popup;

    private color: string = "#ff3300";

    map: any = null;

    parent: object = null;
    name: string = "";
    visible: boolean = true;
    coordinates = [];
    coordinatesInit = null;

    flyToSpeed: number = 0.8;
    flyToZoom: number = 14;
    panDuration: number = 5000;


    id: string = "p" + String(new Date().getTime());

    callmove: Function = () => { };
    callresize: Function = () => { };

    ondraw: Function = () => { };
    public getType() {
        return Polygon.TYPE;
    }
    constructor(info: object) {

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

    init() {


        let map = this.map;


        this.popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        //this.playPopup();

        if (this.feature === null) {
            this.feature = {
                "type": "Feature",
                "properties": {
                    "rol": "polygon",
                    "color": this.color,
                    "width": 2,
                    "dasharray": [2, 2],
                    "opacity": 0.4,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[]]
                }
            };
        } else {
            this.feature.properties.rol = "polygon";
            /*
            this.feature = {
                "type": "Feature",
                "properties": {
                    "color": "#aa2255",
                    "width": 2,
                    "dasharray": [2, 2],
                    "opacity": 0.4,
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[-66.87686735735063, 10.49935516128366], [-66.86582490973026, 10.509106707957727], [-66.85887225752434, 10.506291860101157], [-66.85672511493149, 10.500662087456533], [-66.85652062516098, 10.488296334115446], [-66.86153062454457, 10.504381770164244], [-66.86459797110578, 10.50649292151337], [-66.87686735735063, 10.49935516128366]]]
                }
            };
            */
        }


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

    updateSource(geojson) {
        this.map.getSource(this.sourceId).setData(geojson.data);
        if (this.editMode) {
            //this.map.setPaintProperty(this.nodeLayerId, "circle-stroke-color", "#ff0000");
         }
        this.ondraw(this.feature);
    }

    setProperties(info: object) {
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

    setLine(info: object) {

        for (let p in info) {
            this.map.setPaintProperty(this.borderLayerId, "line-" + p, info[p]);
        }
    }

    setFill(info: object) {
        for (let p in info) {
            this.map.setPaintProperty(this.fillLayerId, "fill-" + p, info[p]);
        }
    }

    setVisible(value: boolean) {
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

    setEditMode(value) {
        if (value) {

        } else {

        }
    }



    createMidPoints = function(coords, color) {


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

    getCoordinates() {
        return turf.getCoords(turf.getGeom(this.feature))[0];
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

    draw() {
        console.log(this.feature);
        //let data = createGeoJSONPoly(this.coordinates);


        return;
        this.map.getSource(this.lineId).setData(data.data);
        this.ondraw(this.coordinates);


    }

    add(lngLat) {

        const geo = this.feature.geometry;
        if (geo.coordinates[0].length === 0) {
            geo.coordinates[0].push([lngLat.lng, lngLat.lat]);
            geo.coordinates[0].push([lngLat.lng, lngLat.lat]);
        } else {
            geo.coordinates[0].splice(geo.coordinates[0].length - 1, 0, [lngLat.lng, lngLat.lat]);
        }

        this.updateSource(this.setFeature(this.feature));
    }
    removeLast() {

        const geo = this.feature.geometry;

        if (geo.coordinates[0].length > 0) {
            this.feature.geometry.coordinates[0].splice(geo.coordinates[0].length - 2, 1);
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
                this.feature.geometry.coordinates[0][i][1] + deltaLat];
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
        this.map.setPaintProperty(this.borderLayerId, "line-dasharray", [2,2]);

        let place = null;
        let type = null;
        let place_one = null;
        let down1 = false;

        let index: number = null;

        let fnUp = (e) => {
            map.off("mousemove", fnMove);
            type = null;
            down1 = false;
        }
        let fnMove = (e) => {
            this.moveNode(index, [e.lngLat.lng, e.lngLat.lat]);
        }
        let fnUp2 = (e) => {
            map.off("mousemove", fnMove2);

        }
        let fnMove2 = (e) => {


            const dLng = e.lngLat.lng - place_one.lng;
            const dLat = e.lngLat.lat - place_one.lat;
            place_one = e.lngLat;


            this.move(dLng, dLat);



        }

        map.on("mousedown", this.nodeLayerId, this._mousedown = (e) => {
            // Prevent the default map drag behavior.
            e.preventDefault();

            down1 = true;
            var features = map.queryRenderedFeatures(e.point, {
                layers: [this.nodeLayerId]
            });


            index = place = features[0].properties.index;
            type = features[0].properties.type;
            console.log(index)
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
        this._mode = 1;

        this.feature.geometry.coordinates[0] = [];
        this.updateSource(this.setFeature(this.feature));

        return
        if (this.coordinatesInit) {

            this.coordinates = this.coordinatesInit.slice();
            if (this.coordinates.length > 1) {
                this.draw();
                return;
            }

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

        let map = this.map;
        if (map.getLayer(this.nodeLayerId)) map.removeLayer(this.nodeLayerId);
        if (map.getLayer(this.borderLayerId)) map.removeLayer(this.borderLayerId);
        if (map.getLayer(this.fillLayerId)) map.removeLayer(this.fillLayerId);


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
        var bounds = coordinates.reduce(function(bounds, coord) {
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


    playPopup() {
        /*
        var popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
            });
            */
        const map = this.map;
        map.on("mouseenter", this.nodeLayerId, (e) => {


            const info = e.features[0].properties;

            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = "pointer";


            info.length = 0;



            var coordinates = e.features[0].geometry.coordinates.slice();

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.

            this.popup.setHTML(`<div>${coordinates[0]}</div><div>${coordinates[1]}</div>`).addTo(map);

            this.popup.setLngLat(coordinates).addTo(map);
        });

        map.on("mouseleave", this.nodeLayerId, () => {
            map.getCanvas().style.cursor = '';
            this.popup.remove();
            //popup.remove();
        });
    }
}