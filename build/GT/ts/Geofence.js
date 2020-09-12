var GTGeofence = (($) => {
    let n = 0;
    class Geofence {
        constructor(info) {
            this.id = null;
            this.map = null;
            this.mode = 0;
            this.tempPoly = null;
            this.formId = null;
            this.dataMain = null;
            this.menu = null;
            this.win = null;
            this.form = null;
            this.caption = "u";
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
            this.onSave = info => { };
            this.onEdit = info => { };
            this.main = null;
            this.marks = [];
            this._info = null;
            this._winInfo = null;
            this._timer = null;
            this._form = null;
            this._lastUnitId = null;
            this.editId = null;
            this._traces = [];
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            //return;
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtGeofence")) {
                    return;
                }
                if (main.hasClass("gt-geofence")) {
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
        }
        static getInstance(name) {
            return Unit._instances[name];
        }
        _create(main) {
            this.main = main;
            main.addClass("geofence-main");
            this.menu = this.createMenu();
            this.createForm(this.form);
            this._info = $().create("div").addClass("win-geofence-info");
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
            map.getControl("poly").onsave = ((info) => {
                //this.loadForm(info);
                map.getControl("poly").stop();
                this.onSave(info);
            });
        }
        requestFun(xhr) {
            let json = JSON.parse(xhr.responseText);
            this.createForm(json);
            let id = this.editId;
            this.showGeofence(id, false);
            this.map.getControl("poly").play({
                type: this.dataMain[id].type,
                defaultCoordinates: this.dataMain[id].config,
                onstop: () => {
                    this.showGeofence(id, true);
                    this.editId = null;
                }
            });
        }
        edit(id) {
            this.mode = 2;
            this.editId = id;
            S.send({
                "async": true,
                "panel": "2",
                "valid": false,
                "confirm_": "seguro?",
                "requestFunction": $.bind(this.requestFun, this),
                "params": [
                    {
                        "t": "setMethod",
                        "id": "0",
                        "element": "gt-geofence",
                        "method": "geofence-load",
                        "name": "",
                        "eparams": {
                            "geofenceId": id
                        }
                    }
                ]
            });
            this.onEdit(id);
        }
        update(info) {
            this.getForm().setValue(info).setMode('update');
            this.getForm().getInput("__mode_").setValue(2);
            this.getForm().getInput("__id_").setValue(0);
            this.dataMain[info.id] = info;
            this.updatePoly(info.id);
        }
        updatePoly(id) {
            if (this.marks[id]) {
                let item = this.menu.getByValue(id);
                this.getMap().delete("geofence-" + id);
                delete this.marks[id];
                item.getCaption().text(this.dataMain[id].name);
            }
            else {
                let info = {
                    id: this.dataMain[id].id,
                    caption: this.dataMain[id].name,
                    useCheck: true,
                    value: id,
                    checkValue: id,
                    checkDs: { "level": "geofences", "geofenceId": id },
                    ds: { "geofenceId": id },
                    infoElement: $.create("span").addClass("geofence-edit").on("click", () => { this.edit(this.dataMain[id].id); }),
                    check: (item, event) => {
                        this.showGeofence(id, event.currentTarget.checked);
                    },
                    action: (item, event) => {
                        let ch = item.getCheck();
                        ch.get().checked = true;
                        this.showGeofence(id, true);
                        this._lastUnitId = id;
                        this.setInfo(id);
                        this.flyTo(id);
                    }
                };
                m.add(info);
            }
            this.showGeofence(id, true);
        }
        getForm() {
            return this._form;
        }
        loadForm(info) {
            if (this.editId === null) {
                this._form.reset();
            }
            else {
                this.marks[this.editId].setLngLat(info.coordinates);
                this.marks[this.editId].setImage(info.image);
            }
            this._form.setValue({
                image: info.image,
                longitude: info.coordinates[0],
                latitude: info.coordinates[1],
            });
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
                    infoElement: $.create("span").addClass("geofence-edit").on("click", () => {
                        this.edit(this.dataMain[x].id);
                    }),
                    ds: { "geofenceId": x },
                    check: (item, event) => {
                        this.showGeofence(x, event.currentTarget.checked);
                    },
                    action: (item, event) => {
                        let ch = item.getCheck();
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
                useCheck: true,
                check: (item) => {
                    let ch = item.getCheck();
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
        }
        createForm(info) {
            if (this._form) {
                this._form.delete();
            }
            info.parentContext = this;
            info.id = this.formId;
            this._form = new Form2(info);
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
            for (let x in this.dataMain) {
                e = this.dataMain[x];
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
    }
    Geofence._instances = [];
    return Geofence;
})(_sgQuery);
//# sourceMappingURL=Geofence.js.map