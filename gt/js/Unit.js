var GTUnit = (($) => {
    let n = 0;
    class Unit {
        constructor(info) {
            this.id = null;
            this.map = null;
            this.dataClients = null;
            this.dataAccounts = null;
            this.dataUnits = null;
            this.tracking = null;
            this.menu = null;
            this.win = null;
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
			<div>{=vehicle_name}</div>
			<div>{=device_name}</div>
			<div>{=brand}: {=model}<br>{=plate}, {=color} </div>
		
			<div>{=latitude}, {=longitude}</div>
		
			<div>Velocidad: {=speed}</div>
		
		</div>`;
            this.delay = 30000;
            this.main = null;
            this.marks = [];
            this._info = null;
            this._winInfo = null;
            this._timer = null;
            this._lastUnitId = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtUnit")) {
                    return;
                }
                if (main.hasClass("gt-unit")) {
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
            $(window).on("load", (event) => {
                /*
                this.map = GTMap.getMap("gt-map-4").map;
                //alert(this.map.map)
                this.map.on("load", (event)=>{

                    alert("que");
                });
                */
            });
        }
        static getInstance(name) {
            return Unit._instances[name];
        }
        _create(main) {
            this.main = main;
            main.addClass("unit-main");
            this.createMenu();
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
            this._info = $().create("div").addClass("win-units-info");
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
        }
        _load(main) {
        }
        init() {
        }
        load() {
        }
        updateTracking(data) {
            let unitId;
            n = n + 0.001;
            for (let x of data) {
                unitId = x.unit_id;
                this.tracking[unitId].latitude = x.latitude * 1.0 + n;
                this.tracking[unitId].longitude = x.longitude * 1.0 + n;
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
            }
        }
        requestFun(xhr) {
            let json = JSON.parse(xhr.responseText);
            this.updateTracking(json);
        }
        play() {
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
            console.log(this);
            for (let x in this.dataClients) {
                infoMenu[this.dataClients[x].id] = {
                    id: this.dataClients[x].id,
                    caption: this.dataClients[x].client,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                    checkValue: x,
                    checkDs: { "level": "client", "clientId": x },
                    ds: { "clientId": x },
                    check: (item, event) => {
                        this.showAccountUnits(this.dataClients[x].id, event.currentTarget.checked);
                    },
                };
            }
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
            //console.log(check);
        }
        showUnit(id, value) {
            if (!this.marks[id]) {
                this.marks[id] = this.map.createMark({
                    lat: this.tracking[id].latitude,
                    lng: this.tracking[id].longitude,
                    heading: this.tracking[id].heading,
                    image: this.pathImages + this.dataUnits[id].icon + ".png",
                    popupInfo: this.loadPopupInfo(id)
                });
            }
            else {
                this.marks[id].show(value);
            }
        }
        showUnits(accountId, value) {
            let e;
            for (let x in this.dataUnits) {
                e = this.dataUnits[x];
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
            this._info.text(this.loadInfo(id));
            this._winInfo.setCaption(this.dataUnits[id].vehicle_name);
        }
        loadPopupInfo(id) {
            return this.evalHTML(this.evalHTML(this.popupTemplate, this.dataUnits[id]), this.tracking[id]);
        }
        loadInfo(id) {
            return this.evalHTML(this.evalHTML(this.infoTemplate, this.dataUnits[id]), this.tracking[id]);
        }
        setFollowMe(value) {
            this.followMe = value;
        }
        getFollowMe() {
            return this.followMe;
        }
    }
    Unit._instances = [];
    return Unit;
})(_sgQuery);
