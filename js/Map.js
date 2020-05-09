var sgMap = (($) => {
    class Units {
        constructor(info) {
            this.win = null;
            this.data = [];
            this.units = [];
            this.main = null;
            this.clients = [];
            this.accounts = [];
            this.tracking = [];
            this.info = null;
            this.wInfo = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.main = $().create("div").addClass("win-units");
            this.win = new Float.Window({
                visible: true,
                caption: "Unidades",
                child: this.main,
                left: 10,
                top: 40,
                width: "300px",
                height: "300px",
                mode: "auto",
                className: ["sevian"]
            });
            let infoMenu = [];
            for (let x in this.clients) {
                infoMenu[this.clients[x].id] = {
                    id: this.clients[x].id,
                    caption: this.clients[x].client,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                };
            }
            for (let x in this.accounts) {
                infoMenu[this.accounts[x].client_id].items[this.accounts[x].id] = {
                    id: this.accounts[x].id,
                    caption: this.accounts[x].account,
                    items: [],
                    useCheck: true,
                };
            }
            for (let x in this.units) {
                infoMenu[this.units[x].client_id].items[this.units[x].account_id].items[this.units[x].unit_id] = {
                    id: this.units[x].unit_id,
                    caption: this.units[x].vehicle_name,
                    useCheck: true,
                    action: () => {
                        this.info.text(this.loadInfo(x));
                        this.wInfo.setCaption(this.units[x].vehicle_name);
                    }
                };
            }
            let menu = new Menu({
                caption: "",
                autoClose: false,
                target: this.main, items: infoMenu
            });
            this.info = $().create("div").addClass("win-units-info");
            this.wInfo = new Float.Window({
                visible: true,
                caption: "Info",
                child: this.info,
                left: 10,
                top: 40,
                width: "300px",
                height: "300px",
                mode: "auto",
                className: ["sevian"]
            });
        }
        loadInfo(x) {
            var html = `
                <div class="units-info">
                <div>Placa</div><div>{=plate}</div>
                <div>Marca</div><div>{=brand}</div>
                <div>Modelo</div><div>{=model}</div>
                <div>Color</div><div>{=color}</div>

                <div>Hora</div><div>{=date_time}</div>
                <div>Longitud</div><div>{=longitude}</div>
                <div>Latidud</div><div>{=latitude}</div>
                <div>Velocidad</div><div>{=speed}</div>

                <div>Heading</div><div>{=heading}</div>
                <div>Satellite</div><div>{=satellite}</div>
                <div>Inputs</div><div>{=speed}</div>
                <div>Outputs</div><div>{=speed}</div>




            
            </div>`;
            let popup = evalHTML(html, this.units[x]);
            popup = evalHTML(popup, this.tracking[x]);
            return popup;
        }
    }
    class Marks {
        constructor(info) {
            this.win = null;
            this.data = [];
            this.units = [];
            this.main = null;
            this.clients = [];
            this.accounts = [];
            this.scales = [];
            this.icons = [];
            this.groups = [];
            this.marks = [];
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.main = $().create("div").addClass("win-marks");
            this.win = new Float.Window({
                visible: true,
                caption: "Mis Sitios",
                child: this.main,
                left: 10,
                top: 40,
                width: "300px",
                height: "300px",
                mode: "auto",
                className: ["sevian"]
            });
            let infoMenu = [];
            for (let x in this.groups) {
                infoMenu[this.groups[x].id] = {
                    id: this.groups[x].id,
                    caption: this.groups[x].name,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                };
            }
            for (let x in this.marks) {
                infoMenu[this.marks[x].group_id].items[this.marks[x].id] = {
                    id: this.marks[x].id,
                    caption: this.marks[x].name,
                    //items:[],
                    useCheck: true,
                };
            }
            let menu = new Menu({
                caption: "",
                autoClose: false,
                target: this.main, items: infoMenu
            });
        }
    }
    class Geofences {
        constructor(info) {
            this.win = null;
            this.data = [];
            this.units = [];
            this.main = null;
            this.clients = [];
            this.accounts = [];
            this.scales = [];
            this.icons = [];
            this.groups = [];
            this.marks = [];
            this.geofences = [];
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.main = $().create("div").addClass("win-geofences");
            this.win = new Float.Window({
                visible: true,
                caption: "Mis Geocercas",
                child: this.main,
                left: 10,
                top: 40,
                width: "300px",
                height: "300px",
                mode: "auto",
                className: ["sevian"]
            });
            let infoMenu = [];
            for (let x in this.geofences) {
                infoMenu[this.geofences[x].id] = {
                    id: this.geofences[x].id,
                    caption: this.geofences[x].name,
                    //items:[], 
                    useCheck: true,
                    useIcon: false,
                };
            }
            let menu = new Menu({
                caption: "",
                autoClose: false,
                target: this.main, items: infoMenu
            });
        }
    }
    class Alarms {
        constructor(info) {
            this.win = null;
            this.data = [];
            this.units = [];
            this.main = null;
            this.clients = [];
            this.accounts = [];
            this.scales = [];
            this.icons = [];
            this.types = [];
            this.alarms = [];
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.main = $().create("div").addClass("win-alarms");
            this.win = new Float.Window({
                visible: true,
                caption: "Mis Alarmas",
                child: this.main,
                left: 10,
                top: 40,
                width: "300px",
                height: "300px",
                mode: "auto",
                className: ["sevian"]
            });
            let infoMenu = [];
            for (let x in this.types) {
                infoMenu[this.types[x].id] = {
                    id: this.types[x].id,
                    caption: this.types[x].name,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                };
            }
            console.log(this.types);
            for (let x in this.alarms) {
                infoMenu[this.alarms[x].type_id].items[this.alarms[x].id] = {
                    id: this.alarms[x].id,
                    caption: this.alarms[x].name,
                    //items:[],
                    useCheck: true,
                };
            }
            let menu = new Menu({
                caption: "",
                autoClose: false,
                target: this.main, items: infoMenu
            });
        }
    }
    class Events {
        constructor(info) {
            this.win = null;
            this.data = [];
            this.units = [];
            this.main = null;
            this.map = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.main = $().create("div").addClass("win-events");
            this.win = new Float.Window({
                visible: true,
                caption: "Events",
                child: this.main,
                left: "left",
                top: "top",
                width: "300px",
                height: "300px",
                mode: "auto",
                className: ["sevian"]
            });
            this.loadData(this.data);
            setInterval((event) => {
                S.send({
                    "async": true,
                    "panel": 4,
                    "params": [
                        {
                            "t": "setMethod",
                            "id": 4,
                            "element": "sgMap",
                            "name": "gt_map",
                            "method": "load-events"
                        }
                    ]
                });
            }, 8000);
        }
        setData(data) {
            let map = this.map.map;
            this.data = data;
            //this.map.addImage('pulsing-dot', new Pulsing(this.map, 200), { pixelRatio: 2 });
            //this.map.addImage('pulsing-dot2', new Pulsing(this.map, 100), { pixelRatio: 2 });
            //this.map.addImage('pulsing-dot3', new Pulsing(this.map, 300), { pixelRatio: 2 });
            if (map.getLayer('p1')) {
                let source = {
                    'type': 'FeatureCollection',
                    'features': []
                };
                for (let x in this.data) {
                    source.features.push({
                        'type': 'Feature',
                        'properties': this.data[x],
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [this.data[x].longitude, this.data[x].latitude]
                        }
                    });
                }
                //console.log(source);
                map.getSource("q1").setData(source);
                return;
            }
            let source = {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': []
                }
            };
            for (let x in this.data) {
                //console.log(this.data);
                source.data.features.push({
                    'type': 'Feature',
                    'properties': this.data[x],
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [this.data[x].longitude, this.data[x].latitude]
                    }
                });
            }
            this.map.addSource('q1', source);
            this.map.addPulse('p1', 'q1');
            // Create a popup, but don't add it to the map yet.
            var popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
            map.on('mouseenter', 'p1', (e) => {
                // Change the cursor style as a UI indicator.
                map.getCanvas().style.cursor = 'pointer';
                var coordinates = e.features[0].geometry.coordinates.slice();
                var description = this.units[e.features[0].properties.unit_id].vehicle_name;
                //e.features[0].properties.description;
                // Ensure that if the map is zoomed out such that multiple
                // copies of the feature are visible, the popup appears
                // over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                // Populate the popup and set its coordinates
                // based on the feature found.
                popup
                    .setLngLat(coordinates)
                    .setHTML(description)
                    .addTo(map);
            });
            map.on('mouseleave', 'p1', function () {
                map.getCanvas().style.cursor = '';
                popup.remove();
            });
        }
        loadData(data) {
            let acc = new Accordion({ target: this.main });
            this.data.forEach((e) => {
                let line = $.create("ul").addClass("line").text("33");
                acc.add({
                    caption: this.units[e.unit_id].vehicle_name,
                    child: line,
                });
                //line.text(this.units[e.unit_id].vehicle_name);
            });
        }
    }
    function evalHTML(html, data) {
        function auxf(str, p, p2, offset, s) {
            return data[p2];
        }
        for (let x in data) {
            let regex = new RegExp('\(\{=(' + x + ')\})', 'gi');
            html = html.replace(regex, auxf);
        }
        return html;
    }
    function replacer(str, p1, offset, s) {
        return " <<" + p1 + ">> ";
    }
    class Map {
        constructor(info) {
            this.id = null;
            this.map = null;
            this.clients = [];
            this.accounts = [];
            this.units = [];
            this.tracking = [];
            this.events = [];
            this.marks = [];
            this.geofences = [];
            this.alarms = [];
            this._events = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sgMap")) {
                    return;
                }
                if (main.hasClass("sg-map")) {
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
            _sgQuery(window).on("load", () => {
                // this.loadMap(main);
            });
        }
        msg(value) {
        }
        loadMap(main) {
        }
        _createGoogleMap(main) {
            main.addClass("sg-map");
            let map = new google.maps.Map(main.get(), {
                center: { lat: 10.480594, lng: -66.903603 },
                zoom: 14
            });
        }
        _create(main) {
            main.addClass("map-main");
            let mapMenu = main.create("div").addClass("map-menu");
            //let mapItems = main.create("div").addClass("map-items");
            let mapBody = main.create("div").addClass("map-body").id(`${this.id}_map`);
            this.map = new MapBox({ id: `${this.id}_map` });
            let ev = this._events = new Events({
                data: this.events,
                accounts: this.accounts,
                clients: this.clients,
                units: this.units,
                map: this.map
            });
            let units = new Units({
                accounts: this.accounts,
                clients: this.clients,
                data: this.units,
                units: this.units,
                tracking: this.tracking,
            });
            let marks = new Marks({
                marks: this.marks.marks,
                groups: this.marks.groups,
                scales: this.marks.scales,
                icons: this.marks.icons
            });
            let geofences = new Geofences({
                geofences: this.geofences,
            });
            let alarms = new Alarms({
                alarms: this.alarms.alarms,
                types: this.alarms.types,
            });
            //this.map = new LeatfletMap({id:this.id});
            let infoMenu = [];
            infoMenu.push({
                id: 1,
                caption: "xx",
                useCheck: false,
                action: () => {
                }
            });
            let mm = new Menu({
                caption: "",
                autoClose: false,
                target: mapMenu,
                items: infoMenu
            });
            var html = `<div class="wecar_info">
                <div>{=vehicle_name}</div>
                <div>{=device_name}</div>
                <div>{=brand}: {=model}<br>{=plate}, {=color} </div>
            
                <div>{=latitude}, {=longitude}</div>
            
                <div>Velocidad: {=speed}</div>
            
            </div>`;
            let popup = "";
            for (let x in this.tracking) {
                popup = evalHTML(html, this.units[x]);
                popup = evalHTML(popup, this.tracking[x]);
                this.map.addMark(x, {
                    lat: this.tracking[x].latitude,
                    lng: this.tracking[x].longitude,
                    heading: this.tracking[x].heading,
                    popupInfo: popup
                });
                //db (this.devices[x].device_name, "red");
            }
        }
        _load(main) { }
        eventsData(data) {
            this._events.setData(data);
        }
    }
    return Map;
})(_sgQuery);
