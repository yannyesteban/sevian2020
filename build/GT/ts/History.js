var GTHistory = (($) => {
    let n = 0;
    class History {
        constructor(info) {
            this.id = null;
            this.map = null;
            this.dataMain = null;
            this.menu = null;
            this.win = null;
            this.form = null;
            this.caption = "";
            this.winCaption = "";
            this.pathImages = "";
            this.followMe = false;
            this.infoTemplate = `
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
            this.popupTemplate = `<div class="wecar_info">
			<div>{=name}</div>
			<div>{=device_name}</div>
			<div>{=brand}: {=model}<br>{=plate}, {=color} </div>
		
			<div>{=latitude}, {=longitude}</div>
		
			<div>Dirección: {=speed}</div>
		
		</div>`;
            this.oninfo = (info, name) => { };
            this.delay = 30000;
            this.main = null;
            this.marks = [];
            this._info = null;
            this._winInfo = null;
            this._timer = null;
            this._lastUnitId = null;
            this._traces = [];
            this.layers = [];
            this._form = null;
            this._parentContext = null;
            this.dataInput = null;
            this.unitInfo = null;
            this.data = null;
            this.layerConfig = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            //return;
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtHistory")) {
                    return;
                }
                if (main.hasClass("gt-history")) {
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
            GTMap.load((map, s) => {
                this.setMap(map);
                //this.play();
                //map.map.addImage('t1', new TraceMarker(map.map, 30), { pixelRatio: 1 });
                //map.getControl("mark").onsave = ((info)=>{}
                this.form.id = this.getMap().getControl('trace').getPage(0);
                this.form.parentContext = this;
                this._form = new Form2(this.form);
            });
        }
        static getInstance(name) {
            return Unit._instances[name];
        }
        _create(main) {
            this.main = main;
            main.addClass("history-main");
            return;
            this.form.id = this.getMap().getControl('trace').getPage(1);
            this.form.parentContext = this;
            this._form = new Form2(this.form);
            //this.find(1);
            return;
            this.form.id = this.main;
            this.form.parentContext = this;
            this._form = new Form2(this.form);
            this.win = new Float.Window({
                visible: true,
                caption: this.caption,
                child: this._form.get(),
                left: 10,
                top: 100,
                width: "280px",
                height: "250px",
                mode: "auto",
                className: ["sevian"]
            });
            return;
            this.createMenu();
            this._info = $().create("div").addClass("win-history-info");
            //this._info = $().create("div").addClass("win-units-info");
            return;
            this.win = new Float.Window({
                visible: true,
                caption: this.caption,
                child: main,
                left: 10,
                top: 40,
                width: "300px",
                height: "300px",
                mode: "auto",
                className: ["sevian"]
            });
            this._winInfo = new Float.Window({
                visible: true,
                caption: "Info",
                child: this._info,
                left: 10,
                top: "bottom",
                width: "300px",
                height: "auto",
                mode: "auto",
                className: ["sevian"]
            });
            let _info2 = $().create("div").addClass("win-units-info");
            /* OJO
            
            //console.log(this.map)
            let t = new GTTrace({map: this.map.map});
            
            */
            let menu = new Menu({
                caption: "uuuu",
                autoClose: false,
                target: _info2,
                items: [
                    {
                        id: 1,
                        caption: "o",
                        action: (item, event) => {
                            t.play();
                        }
                    },
                    {
                        id: 1,
                        caption: "x",
                        action: (item, event) => {
                            t.addPoint();
                        }
                    },
                    {
                        id: 3,
                        caption: "z",
                        action: (item, event) => {
                            this.z();
                        }
                    }
                ]
            });
            let _winInfo2 = new Float.Window({
                visible: true,
                caption: "Info 2",
                child: _info2,
                left: "center",
                top: "top",
                width: "300px",
                height: "auto",
                mode: "auto",
                className: ["sevian"]
            });
        }
        showMenu() {
            this.win.show();
        }
        _load(main) {
        }
        init() {
        }
        load() {
        }
        getMap() {
            return this.map;
        }
        setMap(map) {
            this.map = map;
        }
        updateTracking(data) {
            let unitId;
            n = n + 0.001;
            let a = 0, b = 0;
            for (let x of data) {
                if (Math.floor(Math.random() * 10) >= 8) {
                    a = Math.random() / 100;
                    b = Math.random() / 300;
                }
                else {
                    a = -Math.random() / 100;
                    b = -Math.random() / 300;
                }
                unitId = x.unit_id;
                this.tracking[unitId].latitude = x.latitude * 1.0 + a;
                this.tracking[unitId].longitude = x.longitude * 1.0 + b;
                this.tracking[unitId].heading = x.heading;
                if (this.marks[unitId]) {
                    this.marks[unitId].setLngLat([this.tracking[unitId].longitude, this.tracking[unitId].latitude]);
                    this.marks[unitId].setPopup(this.loadPopupInfo(unitId));
                    this.setInfo(unitId);
                    //let popup = this.evalHTML(this.popupTemplate, this.dataUnits[id]);
                    //popup = this.evalHTML(popup, this.tracking[id]);
                }
            }
            if (this.followMe && this._lastUnitId) {
                this.panTo(this._lastUnitId);
                this._traces[this._lastUnitId].addPoint([this.tracking[this._lastUnitId].longitude, this.tracking[this._lastUnitId].latitude]);
            }
            if (this._traces[unitId]) {
            }
        }
        requestFun(xhr) {
            let json = JSON.parse(xhr.responseText);
            this.updateTracking(json);
        }
        setContext(context) {
            this._parentContext = context;
        }
        find(unitId) {
            //let unitId = this.form.getInput("unit_idx").getValue();
            this.bodyPanelId = "x888";
            let f = this._form.getFormData();
            S.send3({
                "async": 1,
                "form": f,
                //id:4,
                "params": [
                    {
                        "t": "setMethod",
                        'mode': 'element',
                        "id": this.id,
                        "element": "gt_history",
                        "method": "load-data",
                        "name": "/form/h_commands",
                        "eparams": {
                            "a": 'yanny',
                        }
                    }
                ],
                onRequest: (x) => {
                    //S.getElement(this.commandPanelId).setContext(this);
                    // S.getElement(this.bodyPanelId).setContext(this);
                    // alert(x)
                }
            });
        }
        uPlay() {
            this.layers_ = [
                {
                    type: "circle",
                    color: "red",
                    filter: {
                        s: 1
                    }
                },
                {
                    type: "circle",
                    color: "#43f3f7",
                    filter: {
                        s: 2
                    },
                },
                {
                    type: "circle",
                    color: "#00d4ff",
                    filter: {
                        s: 3
                    },
                },
                {
                    type: "circle",
                    color: "#007dff",
                    filter: {
                        s: 4
                    },
                },
                {
                    type: "circle",
                    color: "#0005ff",
                    filter: {
                        s: 5
                    },
                },
                {
                    type: "circle",
                    color: "#6f00ff",
                    filter: {
                        s: 6
                    },
                },
                {
                    type: "circle",
                    color: "#e200ff",
                    filter: {
                        s: 7
                    },
                },
                {
                    type: "circle",
                    color: "#ff8400",
                    filter: {
                        s: 8
                    },
                },
                {
                    type: "circle",
                    color: "#00ff80",
                    filter: {
                        s: 9
                    },
                },
                {
                    type: "circle",
                    color: "black",
                    filter: {
                        s: 10
                    },
                },
                {
                    type: "pulsing",
                    color: "black",
                    filter: {
                        p: 1
                    }
                }
            ];
            //console.log(this.data);return;
            let data = this.formateData(this.data);
            //console.log(data);return;
            const layer2 = this.layerConfig.groups;
            this.layerConfig.layers.forEach((e, index) => {
                if (e.group !== undefined && layer2[e.group]) {
                    if (!layer2[e.group].features) {
                        layer2[e.group].features = [];
                    }
                    layer2[e.group].features.push(e);
                }
            });
            //console.log(data);
            this.getMap().delete('traza2');
            this._trace = this.getMap().draw('traza2', 'trace', {
                data: data,
                layers: this.layerConfig.layers,
                groups: this.layerConfig.groups,
                layers2: layer2,
            });
            this.getMap().getControl('trace').setTrace(this._trace);
            //this.getMap().getControl('trace').reset();
            this.getMap().getControl('trace').showLayers();
            this.getMap().getControl('trace').setData(this.data);
            this.getMap().getControl('trace').setConfigData({
                className: "speed",
                fields: ["utime", "speed", "event"],
                labels: ["Hora", "Km/h", "Evento"],
            });
            //this.getMap().getControl('trace').setFilterPage(this._form.get());
            //this._trace.play();
            this.getMap().getControl('trace').createList();
            if (this._trace) {
                //alert(91)
                //this._trace.restart();
                //this._trace.play();
            }
            else {
            }
        }
        initTrace() {
            alert("initTrace");
            let layers = [
                {
                    type: "circle",
                    color: "red",
                    filter: (e => e.speed > 0 && e.speed <= 20),
                },
                {
                    type: "circle",
                    color: "blue",
                    filter: (e => e.speed > 20 && e.speed <= 30),
                },
                {
                    type: "pulsing",
                    color: "orange",
                    filter: (e => e.event != null),
                },
                {
                    type: "pulsing",
                    color: "green",
                    filter: (e => e.event != null),
                },
                {
                    type: "circle",
                    color: "orange",
                    filter: (e => e.input != null),
                }
            ];
        }
        formateData(data) {
            let result = [];
            for (let x in data) {
                result.push({
                    coordinates: [data[x].longitude * 1, data[x].latitude * 1],
                    speed: data[x].speed * 1,
                    ts: data[x].ts - data[0].ts,
                    heading: data[x].heading * 1,
                    event: data[x].event,
                    mainEvent: data[x].main_event,
                    event_id: data[x].event_id,
                    iconImage: (data[x].event_id) ? "pulsing-dot" : "pulsing-dot2",
                    s: 0,
                    p: 0,
                    i: x * 1
                });
            }
            let filter = [
                (e) => { if (e.speed <= 0)
                    e.s = 1; },
                (e) => { if (e.speed > 0 && e.speed <= 10)
                    e.s = 2; },
                (e) => { if (e.speed > 10 && e.speed <= 20)
                    e.s = 3; },
                (e) => { if (e.speed > 20 && e.speed <= 30)
                    e.s = 4; },
                (e) => { if (e.speed > 30 && e.speed <= 40)
                    e.s = 5; },
                (e) => { if (e.speed > 40 && e.speed <= 50)
                    e.s = 6; },
                (e) => { if (e.speed > 50 && e.speed <= 60)
                    e.s = 7; },
                (e) => { if (e.speed > 60 && e.speed <= 70)
                    e.s = 8; },
                (e) => { if (e.speed > 70 && e.speed <= 80)
                    e.s = 9; },
                (e) => { if (e.speed > 80)
                    e.s = 10; },
                (e) => { if (e.event != null)
                    e.p = 1; },
            ];
            filter.forEach((f) => {
                result.forEach(f);
            });
            return result;
        }
        setData(data) {
            this.data = data;
            //console.log(data);
        }
        setInfoUnit(info) {
            this.unitInfo = info;
            //console.log(info);
        }
        setInfoUnitInfo(info) {
            this.dataInput = info;
        }
        play() {
            let map = this.getMap().map;
            map.loadImage('https://upload.wikimedia.org/wikipedia/commons/7/7c/201408_cat.png', function (error, image) {
                if (error)
                    throw error;
                map.addImage('cat', image);
                map.addSource('point', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': [
                            {
                                'type': 'Feature',
                                'properties': {
                                    'rotacion': 45
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-69.39874800, 10.06882300]
                                }
                            },
                            {
                                'type': 'Feature',
                                'properties': {
                                    'rotacion': 120
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-69.39674800, 10.06682300]
                                }
                            }
                        ]
                    }
                });
                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'point',
                    'layout': {
                        'icon-image': 'cat',
                        'icon-size': 0.10,
                        'icon-rotate': ['get', 'rotacion']
                    }
                });
            });
            if (this._timer) {
                clearTimeout(this._timer);
            }
            this._timer = setInterval(() => {
                S.send({
                    async: true,
                    panel: 2,
                    valid: false,
                    confirm_: 'seguro?',
                    requestFunction: $.bind(this.requestFun, this),
                    params: [
                        {
                            t: 'setMethod',
                            id: 2,
                            element: 'gt_unit',
                            method: 'tracking',
                            name: 'x',
                            eparams: {
                                record: { codpersona: 16386 },
                                token: "yanny",
                                page: 2
                            }
                        }
                    ]
                });
            }, this.delay);
        }
        createMenu() {
            let infoMenu = [];
            for (let x in this.dataMain) {
                infoMenu[this.dataMain[x].id] = {
                    id: this.dataMain[x].id,
                    caption: this.dataMain[x].name,
                    useCheck: true,
                    value: x,
                    checkValue: x,
                    checkDs: { "level": "geofence", "geofenceId": x },
                    ds: { "geofenceId": x },
                    check: (item, event) => {
                        this.showGeofence(x, event.currentTarget.checked);
                    },
                    action: (item, event) => {
                        let ch = menu.getCheck(item);
                        ch.get().checked = true;
                        this.showGeofence(x, true);
                        this._lastUnitId = x;
                        this.setInfo(x);
                        this.flyTo(x);
                        return;
                        this._traces[x] = new GTTrace({ map: this.map.map });
                        this._traces[x].play();
                    }
                };
            }
            let menu = new Menu({
                caption: "",
                autoClose: false,
                target: this.main,
                items: infoMenu,
                check: (item) => {
                    let ch = menu.getCheck(item);
                    let checked = ch.get().checked;
                    let list = item.queryAll("input[type='checkbox']");
                    for (let x of list) {
                        x.checked = checked;
                    }
                }
            });
            return menu;
            for (let x in this.dataAccounts) {
                infoMenu[this.dataAccounts[x].client_id].items[this.dataAccounts[x].id] = {
                    id: this.dataAccounts[x].id,
                    caption: this.dataAccounts[x].account,
                    items: [],
                    useCheck: true,
                    checkValue: x,
                    checkDs: { "level": "account", "accountId": this.dataAccounts[x].id },
                    ds: { "accountId": this.dataAccounts[x].id },
                    check: (item, event) => {
                        this.showUnits(this.dataAccounts[x].id, event.currentTarget.checked);
                    },
                };
            }
            for (let x in this.dataUnits) {
                infoMenu[this.dataUnits[x].client_id].items[this.dataUnits[x].account_id].items[this.dataUnits[x].unit_id] = {
                    id: this.dataUnits[x].unit_id,
                    caption: this.dataUnits[x].vehicle_name,
                    useCheck: true,
                    value: x,
                    checkValue: x,
                    checkDs: { "level": "units", "unitId": x },
                    ds: { "unitId": x },
                    check: (item, event) => {
                        this.showUnit(x, event.currentTarget.checked);
                    },
                    action: (item, event) => {
                        let ch = menu.getCheck(item);
                        ch.get().checked = true;
                        this.showUnit(x, true);
                        this._lastUnitId = x;
                        this.setInfo(x);
                        this.flyTo(x);
                        return;
                        this._traces[x] = new GTTrace({ map: this.map.map });
                        this._traces[x].play();
                    }
                };
            }
            let menu1 = new Menu({
                caption: "",
                autoClose: false,
                target: this.main,
                items: infoMenu,
                check: (item) => {
                    let ch = menu.getCheck(item);
                    let checked = ch.get().checked;
                    let list = item.queryAll("input[type='checkbox']");
                    for (let x of list) {
                        x.checked = checked;
                    }
                }
            });
            return menu1;
            //console.log(check);
        }
        getInfoLayer() {
            return this._info;
        }
        showGeofence(id, value) {
            if (!this.marks[id]) {
                this.marks[id] = this.getMap().draw(id, this.dataMain[id].type, {
                    coordinates: this.dataMain[id].config,
                    popupInfo: this.loadPopupInfo(id)
                });
            }
            else {
                this.marks[id].setVisible(value);
            }
        }
        showUnits(accountId, value) {
            let e;
            for (let x in this.dataSite) {
                e = this.dataSite[x];
                if (accountId == e.account_id) {
                    this.showUnit(x, value);
                }
            }
        }
        showAccountUnits(clientId, value) {
            let e;
            for (let x in this.dataUnits) {
                e = this.dataUnits[x];
                if (clientId == e.client_id) {
                    this.showUnits(e.account_id, value);
                }
            }
        }
        evalHTML(html, data) {
            function auxf(str, p, p2, offset, s) {
                return data[p2];
            }
            for (let x in data) {
                let regex = new RegExp('\(\{=(' + x + ')\})', 'gi');
                html = html.replace(regex, auxf);
            }
            return html;
        }
        flyTo(unitId) {
            if (this.marks[unitId]) {
                this.marks[unitId].flyTo();
            }
        }
        panTo(unitId) {
            if (this.marks[unitId]) {
                this.marks[unitId].panTo();
            }
        }
        setInfo(id) {
            //this._info.text(this.loadInfo(id));
            //this._winInfo.setCaption(this.dataUnits[id].vehicle_name);
            this.oninfo(this.loadInfo(id), this.dataMain[id].name);
        }
        loadPopupInfo(id) {
            return this.evalHTML(this.evalHTML(this.popupTemplate, this.dataMain[id]), this.dataMain[id]);
        }
        loadInfo(id) {
            return this.evalHTML(this.evalHTML(this.infoTemplate, this.dataMain[id]), this.dataMain[id]);
        }
        setFollowMe(value) {
            this.followMe = value;
        }
        getFollowMe() {
            return this.followMe;
        }
        setLayerConfig(config) {
            this.layerConfig = config;
            console.log(config);
        }
    }
    History._instances = [];
    return History;
})(_sgQuery);
//# sourceMappingURL=History.js.map