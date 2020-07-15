var GTSite = (($) => {
    let n = 0;
    class Site {
        constructor(info) {
            this.id = null;
            this.map = null;
            this.mode = 0;
            this.formId = null;
            this.images = [];
            this.dataCategory = null;
            this.dataAccounts = null;
            this.dataSite = null;
            this.tracking = null;
            this.menu = null;
            this.win = null;
            this.form = null;
            this.caption = "u";
            this.winCaption = "";
            this.pathImages = "";
            this.followMe = false;
            this.tag = "Yanny Esteban";
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
            this.editId = null;
            this.lastId = null;
            this._form = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            //return;
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtSite")) {
                    return;
                }
                if (main.hasClass("gt-site")) {
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
            main.addClass("site-main");
            this.menu = this.createMenu();
            this.createForm(this.form);
            this._info = $().create("div").addClass("win-sites-info");
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
        start() {
            this.map.getControl("mark").play();
        }
        update(info) {
            info.fax = '88888';
            this.dataSite[info.id] = info;
            this.updateMark(info.id);
        }
        updateMark(id) {
            if (this.marks[id]) {
                this.getMap().delete("site-" + id);
                delete this.marks[id];
            }
            let menu = this.menu.get().query(".item[data-site-id='" + id + "'] .text");
            $(menu).text(this.dataSite[id].name);
            this.showSite(id, true);
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
            this.createForm(json);
            let id = this.editId;
            this.showSite(id, false);
            this.map.getControl("mark").play({
                defaultImage: this.dataSite[id].image,
                defaultCoordinates: [this.dataSite[id].longitude * 1, this.dataSite[id].latitude * 1],
                onstop: () => {
                    this.showSite(id, true);
                    this.editId = null;
                }
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
            for (let x in this.dataCategory) {
                infoMenu[this.dataCategory[x].id] = {
                    id: this.dataCategory[x].id,
                    caption: this.dataCategory[x].category,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                    checkValue: x,
                    checkDs: { "level": "category", "categoryId": x },
                    ds: { "clientId": x },
                    check: (item, event) => {
                        this.showAccountUnits(this.dataClients[x].id, event.currentTarget.checked);
                    },
                };
            }
            for (let x in this.dataSite) {
                infoMenu[this.dataSite[x].category_id].items[this.dataSite[x].id] = {
                    id: this.dataSite[x].id,
                    caption: this.dataSite[x].name,
                    useCheck: true,
                    value: x,
                    checkValue: x,
                    checkDs: { "level": "sites", "siteId": x },
                    ds: { "siteId": x },
                    check: (item, event) => {
                        this.showSite(x, event.currentTarget.checked);
                    },
                    action: (item, event) => {
                        let ch = menu.getCheck(item);
                        ch.get().checked = true;
                        this.showSite(x, true);
                        this._lastUnitId = x;
                        this.setInfo(x);
                        this.flyTo(x);
                        return;
                        this._traces[x] = new GTTrace({ map: this.map.map });
                        this._traces[x].play();
                    },
                    events: {
                        dblclick: () => {
                            this.edit(this.dataSite[x].id);
                        }
                    }
                };
            }
            console.log(infoMenu);
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
        createForm(info) {
            if (this._form) {
                this._form.delete();
            }
            info.parentContext = this;
            info.id = this.formId;
            this._form = new Form2(info);
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
        new(info) {
            console.log(info);
            this._form.setValue({
                icon_id: info.image,
                longitude: info.coordinates[0],
                latitude: info.coordinates[1],
            });
        }
        getInfoLayer() {
            return this._info;
        }
        showSite(id, value) {
            if (!this.marks[id]) {
                /*
                this.marks[id] = this.getMap().createMark({
                    lat:this.dataSite[id].latitude,
                    lng:this.dataSite[id].longitude,
                    heading:0,//this.tracking[id].heading,
                    image:this.pathImages+this.dataSite[id].icon+".png",
                    popupInfo: this.loadPopupInfo(id)
                });
                */
                this.marks[id] = this.getMap().draw("site-" + id, 'mark', {
                    coordinates: [this.dataSite[id].longitude, this.dataSite[id].latitude],
                    height: 30,
                    image: this.dataSite[id].image,
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
        edit(id) {
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
                        "element": "gt-site",
                        "method": "site-load",
                        "name": "",
                        "eparams": {
                            "siteId": id
                        }
                    }
                ]
            });
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
            this.oninfo(this.loadInfo(id), this.dataSite[id].name);
        }
        loadPopupInfo(id) {
            return this.evalHTML(this.popupTemplate, this.dataSite[id]);
        }
        loadInfo(id) {
            return this.evalHTML(this.infoTemplate, this.dataSite[id]);
        }
        setFollowMe(value) {
            this.followMe = value;
        }
        getFollowMe() {
            return this.followMe;
        }
        setImage(id, image) {
            //let image = "http://localhost/sevian2020/images/sites maison - _viii_256.png";
            let re = /(?:\w|\s|\.|-)*(?=.png|.jpg|.svg)/gim;
            //myRe = /\w+/
            let result = re.exec(image);
            this.dataSite[id].icon = result[0];
            //this.image = e;
            this.marks[id].setImage(this.pathImages + this.dataSite[id].icon + ".png");
        }
        moveTo(id, coordinates) {
            this.dataSite[id].longitude = coordinates[0];
            this.dataSite[id].latitude = coordinates[1];
            this.marks[id].setLngLat(coordinates);
        }
    }
    Site._instances = [];
    return Site;
})(_sgQuery);
