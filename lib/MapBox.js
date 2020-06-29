var ctMap = ctMap || [];
var Mark;
var createGeoJSONCircle = function (center, radiusInKm, points) {
    if (!points)
        points = 64;
    var coords = {
        latitude: center[1],
        longitude: center[0]
    };
    var km = radiusInKm;
    var ret = [];
    var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    var distanceY = km / 110.574;
    var theta, x, y;
    for (var i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI);
        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);
        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);
    return {
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
};
var MapBox = (($) => {
    let _poly = [];
    class Circle {
        constructor(info) {
            this.map = null;
            this.name = "";
            this.lineColor = "white";
            this.lineWidth = 1;
            this.fillColor = "red";
            this.radio = 0;
            this.center = [];
            this._mode = 0;
            this._nodes = null;
            this._line = null;
            this.nodesId = "n-" + String(new Date().getTime());
            this.lineId = "l-" + String(new Date().getTime());
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
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": [{
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [
                                    [
                                        [-121.353637, 40.584978],
                                        [-121.284551, 40.584758],
                                        [-121.275349, 40.541646],
                                        [-121.246768, 40.541017],
                                        [-121.251343, 40.423383],
                                        [-121.32687, 40.423768],
                                        [-121.360619, 40.43479],
                                        [-121.363694, 40.409124],
                                        [-121.439713, 40.409197],
                                        [-121.439711, 40.423791],
                                        [-121.572133, 40.423548],
                                        [-121.577415, 40.550766],
                                        [-121.539486, 40.558107],
                                        [-121.520284, 40.572459],
                                        [-121.487219, 40.550822],
                                        [-121.446951, 40.56319],
                                        [-121.370644, 40.563267],
                                        [-121.353637, 40.584978]
                                    ]
                                ]
                            }
                        }]
                }
            };
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
                    'line-width': this.lineWidth,
                    'line-opacity': 0.4,
                    //'line-gap-width':4,
                    'line-dasharray': [2, 2]
                },
                'filter': ['==', '$type', 'Polygon']
            });
            map.addLayer({
                id: this.nodesId,
                type: 'circle',
                source: this.nodesId,
                paint: {
                    'circle-radius': 4,
                    'circle-opacity': 0.0,
                    'circle-color': '#000',
                    'circle-stroke-color': "red",
                    'circle-stroke-width': 2
                },
                filter: ['in', '$type', 'Point']
            });
        }
        play() {
            let map = this.map;
            let point = null;
            this._mode = 1;
            let fnMove = (e) => {
                //this.coordinates[point] = [e.lngLat.lng, e.lngLat.lat];
                //this.setCoordinates(this.coordinates);
                //this.redraw();
            };
            let fnUp = (e) => {
                //point = null;
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
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if (this._mode == 1) {
                    this.createCenter(e.lngLat);
                    this._mode = 2;
                    return;
                }
                if (this._mode == 2) {
                    this.createCircle(this.center, e.lngLat);
                }
                //var line = turf.lineString([[115, -32], [131, -22], [143, -25], [150, -34]]);
                //var length = turf.length(line, {units: 'kilometers'});
                //this.add(e.lngLat);
                //map.getSource('geojson').setData(this.geojson);
            });
            return;
        }
        pause() {
        }
        stop() {
        }
        reset() {
        }
        draw(center, radio) {
        }
        createCenter(lngLat) {
            this.center = lngLat;
            let point = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [lngLat.lng, lngLat.lat]
                },
                'properties': {
                    'id': String(new Date().getTime()),
                    'index': 0
                }
            };
            this._nodes.features.push(point);
            let map = this.map;
            //map.getSource(this.lineId).setData(this._line.data);
            map.getSource(this.nodesId).setData(this._nodes);
        }
        createCircle(center, radio) {
            var line = turf.lineString([[center.lng, center.lat], [radio.lng, radio.lat]]);
            var length = turf.length(line, { units: 'kilometers' });
            let data = createGeoJSONCircle([center.lng, center.lat], length);
            console.log(data.data);
            this.map.getSource(this.lineId).setData(data.data);
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
    class Rule {
    }
    class Poly {
    }
    class CircleX {
    }
    class Trace {
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
            info.map = this.map;
            return new Circle(info);
        }
    }
    return Map;
})(_sgQuery);
