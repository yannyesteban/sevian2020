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
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': item
            },
            'properties': {
                'index': index,
                'type': 'h',
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
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': midpoint.geometry.coordinates
            },
            'properties': {
                'index': 3 + index,
                'type': 'm',
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
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': item
            },
            'properties': {
                'index': index,
                'type': 'h',
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
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': midpoint.geometry.coordinates
            },
            'properties': {
                'index': index,
                'type': 'm',
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
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': item
            },
            'properties': {
                'index': index,
                'type': 'h',
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
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': midpoint.geometry.coordinates
            },
            'properties': {
                'index': index,
                'type': 'm',
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
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': center
        },
        'properties': {
            'index': -1,
            'type': 'c',
        }
    };
    json.data.features.push(point);
    hands.forEach((item, index) => {
        let point = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': item
            },
            'properties': {
                'index': index,
                'type': 'h',
            }
        };
        json.data.features.push(point);
    });
    return json;
};
var MapBox = (($, turf) => {
    let test1 = 0;
    class IMark {
        constructor(info) {
            this.map = null;
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
            this.calldraw = () => { };
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
                'top': [0, 0],
                'top-left': [0, 0],
                'top-right': [0, 0],
                'bottom': [0, -this.height / 2 + 5],
                'bottom-left': [linearOffset, (this.height - markerRadius + linearOffset) * -1],
                'bottom-right': [-linearOffset, (this.height - markerRadius + linearOffset) * -1],
                'left': [markerRadius, (this.height - markerRadius) * -1],
                'right': [-markerRadius, (this.height - markerRadius) * -1]
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
            if (this.coordinates) {
                this.coordinatesInit = this.coordinates.slice();
            }
            this.setVisible(this.visible);
        }
        setImage(source) {
            if (!this._image) {
                this._image = document.createElement('img');
                this._image.className = 'marker';
                this._image.style.height = this.height + "px";
            }
            this._image.src = source;
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
            this._marker.on('drag', this._drag = () => {
                this.ondrag(this._marker.getLngLat());
            });
            this.map.on('click', this._click = (e) => {
                this.setLngLat(e.lngLat);
                this.onplace(e.lngLat);
            });
        }
        stop() {
            if (this._play) {
                this._marker.setDraggable(false);
                this._play = false;
                this.map.off('click', this._click);
                this.map.off('drag', this._drag);
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
            this.calldraw = () => { };
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
            //let polygon = turf.polygon([coo], { name: 'poly1' });
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
                'id': this.lineId,
                'type': 'line',
                'source': this.lineId,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round',
                    visibility: (this.visible) ? 'visible' : 'none'
                },
                'paint': {
                    'line-color': '#ff3300',
                    'line-width': 4,
                },
                'filter': ['==', '$type', 'Polygon']
            });
            this.map.addLayer({
                'id': this.circleId,
                'type': 'fill',
                'source': this.lineId,
                'layout': {
                    visibility: (this.visible) ? 'visible' : 'none'
                },
                'paint': {
                //'fill-color': '#ff9900',
                //'fill-opacity': 0.4,
                },
                'filter': ['==', '$type', 'Polygon']
            });
            //this.setLine(this.line);
            //this.setFill(this.fill);
            map.addLayer({
                id: this.nodesId,
                type: 'circle',
                source: this.lineId,
                layout: {
                    visibility: 'none'
                },
                paint: {
                    'circle-radius': 4,
                    'circle-opacity': ["case", ["==", ['get', 'type'], 'm'], 0.0, 0.8],
                    'circle-color': 'white',
                    'circle-stroke-color': "#ff3300",
                    'circle-stroke-width': 1
                },
                filter: ['in', '$type', 'Point']
                //filter: ["in", 'type', 'h', 'm']
                //filter: ["in", 'type']
            });
            /*
            map.addLayer({
                id: this.nodesId+"2",
                type: 'circle',
                source: this.lineId,
                layout: {
                    visibility:'visible'
                },
                paint: {
                    'circle-radius': 3,
                    'circle-opacity':0.5,
                    'circle-color': '#000',
                    'circle-stroke-color':"#ff3300",
                    'circle-stroke-width':1
                },
                //filter: ['in', '$type', 'Point']
                filter: ["in", 'type', 'm']
                //filter: ["in", 'type']
            });
            */
            this.setLine(this.line);
            this.setFill(this.fill);
            this.coordinates = [
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
            let visible = 'none';
            if (value) {
                visible = 'visible';
            }
            this.map.setLayoutProperty(this.lineId, 'visibility', visible);
            this.map.setLayoutProperty(this.circleId, 'visibility', visible);
            if (this._play) {
                this.map.setLayoutProperty(this.nodesId, 'visibility', visible);
            }
        }
        add(lngLat) {
            this.coordinates.push([lngLat.lng, lngLat.lat]);
            let data = createGeoJSONPoly(this.coordinates);
            this.map.getSource(this.lineId).setData(data.data);
        }
        draw() {
            let data = createGeoJSONPoly(this.coordinates);
            this.map.getSource(this.lineId).setData(data.data);
        }
        _fnclick(map) {
            return this._click = (e) => {
                console.log(e.originalEvent);
                //db (e.originalEvent.button+".........", "red","yellow")
                var features = this.map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                this.add(e.lngLat);
            };
        }
        play() {
            if (this._play) {
                return;
            }
            this.parent.stop();
            this._play = true;
            let map = this.map;
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'visible');
            //this.map.setPaintProperty(this.lineId, 'line-dasharray', [2,2]);
            let place = null;
            let type = null;
            let place_one = null;
            let down1 = false;
            let fnUp = (e) => {
                map.off('mousemove', fnMove);
                type = null;
                down1 = false;
            };
            let fnMove = (e) => {
                this.coordinates[place] = [e.lngLat.lng, e.lngLat.lat];
                this.draw();
            };
            let fnUp2 = (e) => {
                map.off('mousemove', fnMove2);
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
            map.on('mousedown', this.nodesId, this._mousedown = (e) => {
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
                map.on('mousemove', fnMove);
                map.once('mouseup', fnUp);
            });
            map.on('mousedown', this.circleId, this._mousedown2 = (e) => {
                if (down1) {
                    return;
                }
                // Prevent the default map drag behavior.
                e.preventDefault();
                place_one = e.lngLat;
                map.on('mousemove', fnMove2);
                map.once('mouseup', fnUp2);
            });
            map.on('click', this._fnclick(this.map));
            map.on('contextmenu', this._contextmenu = (e) => {
                e.preventDefault();
                this.coordinates.pop();
                this.draw();
            });
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off('click', this._click);
                this.map.off('contextmenu', this._contextmenu);
                this.map.off('mousedown', this.nodesId, this._mousedown);
                this.map.off('mousedown', this.circleId, this._mousedown2);
                // this.map.setPaintProperty(this.lineId, 'line-dasharray', [1]);
                //'line-dasharray':[2,2]
                //this.map.setPaintProperty(this.lineId, 'line-color', "#fd8d3c");
                //map.on('mousemove', fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
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
            if (typeof radio === 'number') {
                length = radio;
            }
            else {
                var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
                length = turf.length(line, { units: 'kilometers' });
            }
            this.radio = length;
            let data = createGeoJSONCircle([center.lng, center.lat], length);
            this.map.getSource(this.lineId).setData(data.data);
        }
        split(index, value) {
            db(index, "blue", "aqua");
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
            this.calldraw = () => { };
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
            //let polygon = turf.polygon([coo], { name: 'poly1' });
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
                'id': this.lineId,
                'type': 'line',
                'source': this.lineId,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round',
                    visibility: (this.visible) ? 'visible' : 'none'
                },
                'paint': {
                    'line-color': '#ff3300',
                    'line-width': 4,
                },
                'filter': ['==', '$type', 'Polygon']
            });
            this.map.addLayer({
                'id': this.circleId,
                'type': 'fill',
                'source': this.lineId,
                'layout': {
                    visibility: (this.visible) ? 'visible' : 'none'
                },
                'paint': {
                //'fill-color': '#ff9900',
                //'fill-opacity': 0.4,
                },
                'filter': ['==', '$type', 'Polygon']
            });
            //this.setLine(this.line);
            //this.setFill(this.fill);
            map.addLayer({
                id: this.nodesId,
                type: 'circle',
                source: this.lineId,
                layout: {
                    visibility: 'none'
                },
                paint: {
                    'circle-radius': 4,
                    'circle-opacity': ["case", ["==", ['get', 'type'], 'm'], 0.0, 0.8],
                    'circle-color': 'white',
                    'circle-stroke-color': "#ff3300",
                    'circle-stroke-width': 1
                },
                filter: ['in', '$type', 'Point']
                //filter: ["in", 'type', 'h', 'm']
                //filter: ["in", 'type']
            });
            /*
            map.addLayer({
                id: this.nodesId+"2",
                type: 'circle',
                source: this.lineId,
                layout: {
                    visibility:'visible'
                },
                paint: {
                    'circle-radius': 3,
                    'circle-opacity':0.5,
                    'circle-color': '#000',
                    'circle-stroke-color':"#ff3300",
                    'circle-stroke-width':1
                },
                //filter: ['in', '$type', 'Point']
                filter: ["in", 'type', 'm']
                //filter: ["in", 'type']
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
            let visible = 'none';
            if (value) {
                visible = 'visible';
            }
            this.map.setLayoutProperty(this.lineId, 'visibility', visible);
            this.map.setLayoutProperty(this.circleId, 'visibility', visible);
            if (this._play) {
                this.map.setLayoutProperty(this.nodesId, 'visibility', visible);
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
        }
        _fnclick(map) {
            return this._click = (e) => {
                //db (e.originalEvent.button+".........", "red","yellow")
                var features = this.map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                this.add(e.lngLat);
            };
        }
        play() {
            if (this._play) {
                return;
            }
            this.parent.stop();
            this._play = true;
            let map = this.map;
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'visible');
            //this.map.setPaintProperty(this.lineId, 'line-dasharray', [2,2]);
            let place = null;
            let type = null;
            let place_one = null;
            let down1 = false;
            let fnUp = (e) => {
                map.off('mousemove', fnMove);
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
                map.off('mousemove', fnMove2);
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
            map.on('mousedown', this.nodesId, this._mousedown = (e) => {
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
                map.on('mousemove', fnMove);
                map.once('mouseup', fnUp);
            });
            map.on('mousedown', this.circleId, this._mousedown2 = (e) => {
                if (down1) {
                    return;
                }
                // Prevent the default map drag behavior.
                e.preventDefault();
                place_one = e.lngLat;
                map.on('mousemove', fnMove2);
                map.once('mouseup', fnUp2);
            });
            map.on('click', this._fnclick(this.map));
            map.on('contextmenu', this._contextmenu = (e) => {
                e.preventDefault();
                this.coordinates.pop();
                this.draw();
            });
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off('click', this._click);
                this.map.off('contextmenu', this._contextmenu);
                this.map.off('mousedown', this.nodesId, this._mousedown);
                this.map.off('mousedown', this.circleId, this._mousedown2);
                // this.map.setPaintProperty(this.lineId, 'line-dasharray', [1]);
                //'line-dasharray':[2,2]
                //this.map.setPaintProperty(this.lineId, 'line-color', "#fd8d3c");
                //map.on('mousemove', fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
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
        createCircle(center, radio) {
            let length;
            if (typeof radio === 'number') {
                length = radio;
            }
            else {
                var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
                length = turf.length(line, { units: 'kilometers' });
            }
            this.radio = length;
            let data = createGeoJSONCircle([center.lng, center.lat], length);
            this.map.getSource(this.lineId).setData(data.data);
        }
        split(index, value) {
            db(index, "blue", "aqua");
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
            this.parent = null;
            this.name = "";
            this.visible = true;
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
            this.calldraw = () => { };
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
                'id': this.lineId,
                'type': 'line',
                'source': this.lineId,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round',
                    visibility: (this.visible) ? 'visible' : 'none'
                },
                'paint': {
                //'line-color': '#ff3300',
                //'line-width': this.lineWidth,
                //'line-opacity': 0.9,
                //'line-gap-width':4,
                //'line-dasharray':[2,2]
                },
                'filter': ['==', '$type', 'Polygon']
            });
            this.map.addLayer({
                'id': this.circleId,
                'type': 'fill',
                'source': this.lineId,
                'layout': {
                    visibility: (this.visible) ? 'visible' : 'none'
                },
                'paint': {
                //'fill-color': '#ff9900',
                //'fill-opacity': 0.4,
                },
                'filter': ['==', '$type', 'Polygon']
            });
            map.addLayer({
                id: this.nodesId,
                type: 'circle',
                source: this.lineId,
                layout: {
                    visibility: 'none'
                },
                paint: {
                    'circle-radius': 4,
                    'circle-opacity': 0.0,
                    'circle-color': '#000',
                    'circle-stroke-color': "#ff3300",
                    'circle-stroke-width': 1
                },
                filter: ['in', '$type', 'Point']
            });
            this.setLine(this.line);
            this.setFill(this.fill);
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
            let visible = 'none';
            if (value) {
                visible = 'visible';
            }
            this.map.setLayoutProperty(this.lineId, 'visibility', visible);
            this.map.setLayoutProperty(this.circleId, 'visibility', visible);
            db("visible " + visible, "blue", "aqua");
            if (this._play) {
                this.map.setLayoutProperty(this.nodesId, 'visibility', visible);
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
                    this.setCenter(e.lngLat);
                    this.createCircle(this.center, 0);
                    this._mode = 2;
                    return;
                }
                if (this._mode == 2) {
                    this.setHand(e.lngLat);
                    this.createCircle(this.center, this.hand);
                }
            };
        }
        play() {
            if (this._play) {
                return;
            }
            db("PLAY");
            this.parent.stop();
            this._play = true;
            let map = this.map;
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'visible');
            //this.map.setPaintProperty(this.lineId, 'line-dasharray', [2,2]);
            let place = null;
            if (this.radio == 0) {
                this._mode = 1;
            }
            let fnUp = (e) => {
                //point = null;
                map.off('mousemove', fnMove);
            };
            let fnMove = (e) => {
                //this.coordinates[point] = [e.lngLat.lng, e.lngLat.lat];
                //this.setCoordinates(this.coordinates);
                //this.redraw();
                if (place == "c") {
                    this.center = e.lngLat;
                    this.createCircle(this.center, this.radio);
                    this.callmove();
                }
                else if (place == "h") {
                    this.hand = e.lngLat;
                    this.createCircle(this.center, this.hand);
                    this.callresize();
                }
            };
            map.on('mousedown', this.nodesId, this._mousedown = (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if (features.length) {
                    var id = features[0].properties.id;
                }
                place = features[0].properties.type;
                map.on('mousemove', fnMove);
                map.once('mouseup', fnUp);
            });
            map.on('click', this._fnclick(this.map));
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off('click', this._click);
                this.map.off('mousedown', this.nodesId, this._mousedown);
                // this.map.setPaintProperty(this.lineId, 'line-dasharray', [1]);
                //'line-dasharray':[2,2]
                //this.map.setPaintProperty(this.lineId, 'line-color', "#fd8d3c");
                //map.on('mousemove', fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
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
            if (typeof radio === 'number') {
                length = radio;
            }
            else {
                var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
                length = turf.length(line, { units: 'kilometers' });
            }
            this.radio = length;
            let data = createGeoJSONCircle([center.lng, center.lat], length);
            this.map.getSource(this.lineId).setData(data.data);
        }
        getCenter() {
            return this.center;
        }
        getHand() {
            return this.hand;
        }
        getRadio() {
            return this.radio;
        }
    }
    class Rule {
        constructor(info) {
            this.map = null;
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
            this.circleId = null;
            this._play = false;
            this.callmove = () => { };
            this.callresize = () => { };
            this.calldraw = () => { };
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
            //let polygon = turf.polygon([coo], { name: 'poly1' });
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
                'id': this.lineId,
                'type': 'line',
                'source': this.lineId,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round',
                    visibility: (this.visible) ? 'visible' : 'none'
                },
                'paint': {
                    'line-color': '#ff3300',
                    'line-width': 4,
                },
                'filter': ['==', '$type', 'LineString']
            });
            this.map.addLayer({
                'id': this.circleId,
                'type': 'fill',
                'source': this.lineId,
                'layout': {
                    visibility: (this.visible) ? 'visible' : 'none'
                },
                'paint': {
                //'fill-color': '#ff9900',
                //'fill-opacity': 0.4,
                },
                'filter': ['==', '$type', 'Polygon']
            });
            //this.setLine(this.line);
            //this.setFill(this.fill);
            map.addLayer({
                id: this.nodesId,
                type: 'circle',
                source: this.lineId,
                layout: {
                    visibility: 'none'
                },
                paint: {
                    'circle-radius': 4,
                    'circle-opacity': ["case", ["==", ['get', 'type'], 'm'], 0.0, 0.8],
                    'circle-color': 'white',
                    'circle-stroke-color': "#ff3300",
                    'circle-stroke-width': 1
                },
                filter: ['in', '$type', 'Point']
                //filter: ["in", 'type', 'h', 'm']
                //filter: ["in", 'type']
            });
            /*
            map.addLayer({
                id: this.nodesId+"2",
                type: 'circle',
                source: this.lineId,
                layout: {
                    visibility:'visible'
                },
                paint: {
                    'circle-radius': 3,
                    'circle-opacity':0.5,
                    'circle-color': '#000',
                    'circle-stroke-color':"#ff3300",
                    'circle-stroke-width':1
                },
                //filter: ['in', '$type', 'Point']
                filter: ["in", 'type', 'm']
                //filter: ["in", 'type']
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
            let visible = 'none';
            if (value) {
                visible = 'visible';
            }
            this.map.setLayoutProperty(this.lineId, 'visibility', visible);
            this.map.setLayoutProperty(this.circleId, 'visibility', visible);
            if (this._play) {
                this.map.setLayoutProperty(this.nodesId, 'visibility', visible);
            }
        }
        add(lngLat) {
            this.coordinates.push([lngLat.lng, lngLat.lat]);
            this.draw();
        }
        draw() {
            let data = createGeoJSONLine(this.coordinates);
            this.map.getSource(this.lineId).setData(data.data);
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
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'visible');
            //this.map.setPaintProperty(this.lineId, 'line-dasharray', [2,2]);
            let place = null;
            let type = null;
            let place_one = null;
            let down1 = false;
            let fnUp = (e) => {
                map.off('mousemove', fnMove);
                type = null;
                down1 = false;
            };
            let fnMove = (e) => {
                this.coordinates[place] = [e.lngLat.lng, e.lngLat.lat];
                this.draw();
            };
            let fnUp2 = (e) => {
                map.off('mousemove', fnMove2);
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
            map.on('mousedown', this.nodesId, this._mousedown = (e) => {
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
                map.on('mousemove', fnMove);
                map.once('mouseup', fnUp);
            });
            map.on('mousedown', this.circleId, this._mousedown2 = (e) => {
                if (down1) {
                    return;
                }
                // Prevent the default map drag behavior.
                e.preventDefault();
                place_one = e.lngLat;
                map.on('mousemove', fnMove2);
                map.once('mouseup', fnUp2);
            });
            map.on('click', this._click = (e) => {
                console.log(e.originalEvent);
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
            map.on('contextmenu', this._contextmenu = (e) => {
                e.preventDefault();
                this.coordinates.pop();
                this.draw();
            });
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off('click', this._click);
                this.map.off('contextmenu', this._contextmenu);
                this.map.off('mousedown', this.nodesId, this._mousedown);
                this.map.off('mousedown', this.circleId, this._mousedown2);
                // this.map.setPaintProperty(this.lineId, 'line-dasharray', [1]);
                //'line-dasharray':[2,2]
                //this.map.setPaintProperty(this.lineId, 'line-color', "#fd8d3c");
                //map.on('mousemove', fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
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
            if (typeof radio === 'number') {
                length = radio;
            }
            else {
                var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
                length = turf.length(line, { units: 'kilometers' });
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
    class Trace {
        constructor(info) {
            this.map = null;
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
            this.calldraw = () => { };
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
            //let polygon = turf.polygon([coo], { name: 'poly1' });
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
                'id': this.lineId,
                'type': 'line',
                'source': this.lineId,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round',
                    visibility: (this.visible) ? 'visible' : 'none'
                },
                'paint': {
                    'line-color': '#ff3300',
                    'line-width': 4,
                },
                'filter': ['==', '$type', 'LineString']
            });
            map.addLayer({
                id: this.nodesId,
                type: 'circle',
                source: this.lineId,
                layout: {
                    visibility: 'none'
                },
                paint: {
                    'circle-radius': 4,
                    'circle-opacity': ["case", ["==", ['get', 'type'], 'm'], 0.0, 0.8],
                    'circle-color': 'white',
                    'circle-stroke-color': "#ff3300",
                    'circle-stroke-width': 1
                },
                filter: ['in', '$type', 'Point']
                //filter: ["in", 'type', 'h', 'm']
                //filter: ["in", 'type']
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
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': coordinates
                },
                'properties': properties
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
            let visible = 'none';
            if (value) {
                visible = 'visible';
            }
            this.map.setLayoutProperty(this.lineId, 'visibility', visible);
            this.map.setLayoutProperty(this.nodesId, 'visibility', visible);
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
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
            this.setVisible(true);
            this.setFill(this.fillEdit);
            this.setLine(this.lineEdit);
            //this.map.setLayoutProperty(this.nodesId, 'visibility', 'visible');
            //this.map.setPaintProperty(this.lineId, 'line-dasharray', [2,2]);
            let place = null;
            let type = null;
            let place_one = null;
            let down1 = false;
            let fnUp = (e) => {
                map.off('mousemove', fnMove);
                type = null;
                down1 = false;
            };
            let fnMove = (e) => {
                this.coordinates[place] = [e.lngLat.lng, e.lngLat.lat];
                this.draw();
            };
            let fnUp2 = (e) => {
                map.off('mousemove', fnMove2);
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
            map.on('mousedown', this.nodesId, this._mousedown = (e) => {
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
                map.on('mousemove', fnMove);
                map.once('mouseup', fnUp);
            });
            map.on('mousedown', this.circleId, this._mousedown2 = (e) => {
                if (down1) {
                    return;
                }
                // Prevent the default map drag behavior.
                e.preventDefault();
                place_one = e.lngLat;
                map.on('mousemove', fnMove2);
                map.once('mouseup', fnUp2);
            });
            map.on('click', this._click = (e) => {
                console.log(e.originalEvent);
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
            map.on('contextmenu', this._contextmenu = (e) => {
                e.preventDefault();
                this.coordinates.pop();
                this.draw();
            });
        }
        pause() {
        }
        stop() {
            if (this._play) {
                this.map.off('click', this._click);
                this.map.off('contextmenu', this._contextmenu);
                this.map.off('mousedown', this.nodesId, this._mousedown);
                this.map.off('mousedown', this.circleId, this._mousedown2);
                // this.map.setPaintProperty(this.lineId, 'line-dasharray', [1]);
                //'line-dasharray':[2,2]
                //this.map.setPaintProperty(this.lineId, 'line-color', "#fd8d3c");
                //map.on('mousemove', fnMove);
            }
            this.map.setLayoutProperty(this.nodesId, 'visibility', 'none');
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
            if (typeof radio === 'number') {
                length = radio;
            }
            else {
                var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
                length = turf.length(line, { units: 'kilometers' });
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
    //map.addSource("polygon", createGeoJSONCircle([-93.6248586, 41.58527859], 0.5));
    /*
    map.addLayer({
    "id": "polygon",
    "type": "fill",
    "source": "polygon",
    "layout": {},
    "paint": {
        "fill-color": "blue",
        "fill-opacity": 0.6
    }
}); */
    let ii = 0;
    class Pulsing {
        constructor(map, size) {
            this.map = null;
            this.width = 10;
            this.height = 10;
            this.size = 200;
            this.data = null;
            this.context = null;
            this.map = map;
            this.size = size;
            this.width = size;
            this.height = size;
            this.data = new Uint8Array(this.width * this.height * 4);
        }
        onAdd() {
            let canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
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
            context.fillStyle = 'rgba(255, 165, 62,' + (1 - t) + ')';
            context.fill();
            // draw inner circle
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
            //context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.fillStyle = 'rgba(255, 165, 62, 1)';
            //242, 255, 62
            context.strokeStyle = 'white';
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
                'type': 'FeatureCollection',
                'features': []
            };
            this._line = {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': this.coordinates
                    }
                }
            };
            ii = 0;
            this.coordinates.forEach((el, index) => {
                ii = ii + 5;
                let point = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [el[0], el[1]]
                    },
                    'properties': {
                        'id': String(new Date().getTime()),
                        'index': index,
                        'angle': ii
                    }
                };
                this._nodes.features.push(point);
            });
            map.addSource(this.nodesId, {
                'type': 'geojson',
                'data': this._nodes
            });
            this.map.addSource(this.lineId, this._line);
            this.map.addLayer({
                'id': this.lineId,
                'type': 'line',
                'source': this.lineId,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': 'green',
                    'line-width': this.lineWidth / 2,
                    'line-opacity': 0.4,
                    //'line-gap-width':4,
                    'line-dasharray': [2, 2]
                }
            });
            /*map.addLayer({
                id: this.nodesId,
                type: 'circle',
                source: this.nodesId,
                paint: {
                    'circle-radius': 4,
                    'circle-opacity':0.0,
                    'circle-color': '#000',
                    'circle-stroke-color':"red",
                    'circle-stroke-width':2
                },
                filter: ['in', '$type', 'Point']
            });*/
            map.addLayer({
                id: this.nodesId,
                type: 'symbol',
                source: this.nodesId,
                layout: {
                    'icon-image': 't1',
                    'icon-size': 0.5,
                    'icon-rotate': ['get', 'angle'],
                    'text-field': ["format",
                        "foo", { "font-scale": 1.0 },
                        "bar", { "font-scale": 1.0 }
                    ],
                    'text-font': [
                        'Open Sans Bold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-size': 12,
                    'text-offset': [0, 1.5]
                },
                filter: ['in', '$type', 'Point']
            });
        }
        setCoordinates(coordinates) {
            this.coordinates = coordinates;
            this._nodes = {
                'type': 'FeatureCollection',
                'features': []
            };
            this._line = {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': this.coordinates
                    }
                }
            };
            this.coordinates.forEach((el, index) => {
                ii = ii + 5;
                let point = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [el[0], el[1]]
                    },
                    'properties': {
                        'id': String(new Date().getTime()),
                        'index': index,
                        'angle': ii
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
                map.off('mousemove', fnMove);
            };
            map.on('mousedown', this.nodesId, (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if (features.length) {
                    var id = features[0].properties.id;
                }
                point = features[0].properties.index;
                db(features[0].properties.index);
                //canvas.style.cursor = 'grab';
                map.on('mousemove', fnMove);
                map.once('mouseup', fnUp);
            });
            map.on('mousedown', (e) => {
                // Prevent the default map drag behavior.
                //e.preventDefault();
            });
            map.on('mouseup', (e) => {
                // Prevent the default map drag behavior.
                //e.preventDefault();
            });
            map.on('mousemove', (e) => {
                // Prevent the default map drag behavior.
                //e.preventDefault();
            });
            map.on('click', (e) => {
                ii++;
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if (ii >= 6) {
                    //console.log(this.geojson.features);
                    //return;
                }
                this.add(e.lngLat);
                db(545454);
                //map.getSource('geojson').setData(this.geojson);
            });
            return;
            map.on('mousedown', (e) => {
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
    class RuleX {
    }
    class PolyX {
    }
    class CircleX {
    }
    class TraceX {
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
                'top': [0, 0],
                'top-left': [0, 0],
                'top-right': [0, 0],
                'bottom': [0, -markerHeight / 2 + 5],
                'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                'left': [markerRadius, (markerHeight - markerRadius) * -1],
                'right': [-markerRadius, (markerHeight - markerRadius) * -1]
            };
            let popup = new mapboxgl.Popup({
                offset: popupOffsets,
                className: 'my-class'
            })
                //.setLngLat(e.lngLat)
                .setHTML(this.popupInfo)
                .setMaxWidth("300px"); //.addTo(map);
            let el = document.createElement('img');
            el.className = 'marker';
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
            //main.addClass("leatflet-map");
            mapboxgl.accessToken = 'pk.eyJ1IjoieWFubnkyNCIsImEiOiJjazYxZnM5dzMwMzk1M21xbjUyOHVmdjV0In0.4ifqDgs5_PqZd58N1DcVaQ';
            let map = this.map = new mapboxgl.Map({
                container: this.id,
                style: 'mapbox://styles/mapbox/streets-v10',
                zoom: 10,
                center: this.latlng,
            });
            function HelloWorldControl() { }
            HelloWorldControl.prototype.onAdd = function (map) {
                this._map = map;
                this._container = document.createElement('div');
                this._container.className = 'mapboxgl-ctrl';
                this._container.textContent = 'Hello, world';
                return this._container;
            };
            HelloWorldControl.prototype.onRemove = function () {
                this._container.parentNode.removeChild(this._container);
                this._map = undefined;
            };
            map.addControl(new HelloWorldControl(), 'top-right');
            map.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            }));
            map.addControl(new mapboxgl.AttributionControl({
                compact: true
            }));
            map.addControl(new mapboxgl.FullscreenControl());
            mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
            map.addControl(new MapboxLanguage({
                defaultLanguage: 'es'
            }));
            map.addControl(new mapboxgl.NavigationControl());
            var draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true
                },
                styles: [
                    // default themes provided by MB Draw
                    // default themes provided by MB Draw
                    // default themes provided by MB Draw
                    // default themes provided by MB Draw
                    {
                        'id': 'gl-draw-polygon-fill-inactive',
                        'type': 'fill',
                        'filter': ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Polygon'],
                            ['!=', 'mode', 'static']
                        ],
                        'paint': {
                            'fill-color': '#3bb2d0',
                            'fill-outline-color': '#3bb2d0',
                            'fill-opacity': 0.1
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-midpoint',
                        'type': 'circle',
                        'filter': ['all', ['==', '$type', 'Point'],
                            ['==', 'meta', 'midpoint']
                        ],
                        'paint': {
                            'circle-radius': 3,
                            'circle-color': '#fbb03b'
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-fill-active',
                        'type': 'fill',
                        'filter': ['all', ['==', 'active', 'true'],
                            ['==', '$type', 'Polygon']
                        ],
                        'paint': {
                            'fill-color': '#fbb03b',
                            'fill-outline-color': '#fbb03b',
                            'fill-opacity': 0.1
                        }
                    }
                ]
            });
            map.addControl(draw);
            draw.add({ type: 'Point', coordinates: [-66.903603, 10.480594] });
            draw.add({ type: 'Point', coordinates: [-66.87957040722598, 10.561268658842579] });
            map.on('load', (event) => {
                return;
                //this.load(event);
                map.addImage('pulsing-dot', new Pulsing(map, 200), { pixelRatio: 2 });
                map.addImage('pulsing-dot2', new Pulsing(map, 100), { pixelRatio: 2 });
                map.addImage('pulsing-dot3', new Pulsing(map, 300), { pixelRatio: 2 });
                //return;
                map.addSource('points', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [0, 0]
                                }
                            }
                        ]
                    }
                });
                map.addSource('points2', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'properties': {
                                    'micon': "pulsing-dot3"
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-71.65522800, 10.59577000]
                                }
                            },
                            {
                                'type': 'Feature',
                                'properties': {
                                    'micon': "pulsing-dot2"
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-69.39774800, 10.06782300]
                                }
                            }
                        ]
                    }
                });
                map.addLayer({
                    'id': 'points2',
                    'type': 'symbol',
                    'source': 'points2',
                    'layout': {
                        'icon-image': ['get', 'micon']
                    }
                });
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points',
                    'layout': {
                        'icon-image': 'pulsing-dot'
                    }
                });
                map.getSource("points").setData({
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-66.903603, 10.480594]
                            }
                        },
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-67.52839800, 10.22430800]
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
                'id': layerId,
                'type': 'symbol',
                'source': sourceId,
                'layout': {
                    'icon-image': ['get', 'micon']
                }
            });
            return;
            map.addSource('points', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [0, 0]
                            }
                        }
                    ]
                }
            });
            map.addSource('points2', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {
                                'micon': "pulsing-dot3"
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-71.65522800, 10.59577000]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {
                                'micon': "pulsing-dot2"
                            },
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-69.39774800, 10.06782300]
                            }
                        }
                    ]
                }
            });
            map.addLayer({
                'id': 'points2',
                'type': 'symbol',
                'source': 'points2',
                'layout': {
                    'icon-image': ['get', 'micon']
                }
            });
            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'points',
                'layout': {
                    'icon-image': 'pulsing-dot'
                }
            });
            map.getSource("points").setData({
                'type': 'FeatureCollection',
                'features': [
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-66.903603, 10.480594]
                        }
                    },
                    {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [-67.52839800, 10.22430800]
                        }
                    }
                ]
            });
            return;
            this.map.addLayer({
                'id': layerId,
                'type': 'symbol',
                'source': sourceId,
                'layout': {
                    'icon-image': ['get', 'micon']
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
                case "mark":
                    this._poly[name] = new IMark(info);
                    //this._poly[name] = new Trace(info);
                    break;
            }
            return this._poly[name];
        }
        stop() {
            for (let poly of this._poly) {
                poly.stop();
            }
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
    }
    return Map;
})(_sgQuery, turf);
