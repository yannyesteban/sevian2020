import { _sgQuery } from '../../Sevian/ts/Query.js';
import { Form2 as Form2 } from '../../Sevian/ts/Form2.js';
import { Menu as Menu } from '../../Sevian/ts/Menu2.js';
import { Float } from '../../Sevian/ts/Window.js';
import { InfoForm } from '../../Sevian/ts/InfoForm.js';
import { LayerTool } from './LayerTool.js';
export var GTHistory = (($) => {
    let n = 0;
    class History {
        constructor(info) {
            this.id = null;
            this.map = null;
            this.dataMain = null;
            this.menu = null;
            this.win = null;
            this.form = null;
            this.formHistoryConfig = null;
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
            this.infoForm = null;
            this._infoForm = null;
            this._info = null;
            this._winInfo = null;
            this._timer = null;
            this._lastUnitId = null;
            this._traceModes = [];
            this.layers = [];
            this._form = null;
            this._trace = null;
            this._formHistoryConfig = null;
            this._parentContext = null;
            this.dataInput = null;
            this.unitInfo = null;
            this.data = null;
            this.layerConfig = null;
            this.tracePopup = null;
            this.popupInfoForm = null;
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
                /*this.formHistoryConfig.id = this.getMap().getControl('trace').getPage(3);
                this.formHistoryConfig.parentContext =  this;
                this._formHistoryConfig = new Form2(this.formHistoryConfig);*/
                if (this.infoForm) {
                    this.infoForm.id = this.getMap().getControl('trace').getPage(4);
                    this._infoForm = new InfoForm(this.infoForm);
                }
                this.tracePopup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });
                let divInfo = $.create("div");
                this.tracePopup.setDOMContent(divInfo.get());
                this.infoForm.id = divInfo;
                this.popupInfoForm = new InfoForm(this.infoForm);
            });
        }
        static getInstance(name) {
            return Unit._instances[name];
        }
        _create(main) {
            this.main = main;
            main.addClass("history-main");
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
        setContext(context) {
            this._parentContext = context;
        }
        find(unitId) {
            //let unitId = this.form.getInput("unit_idx").getValue();
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
        play() {
            //console.log(this.data);return;
            let data = this.formateData(this.data);
            //console.log(data);return;
            //this.layerConfig = this.getInfo();
            const layer2 = this.layerConfig.groups;
            this.layerConfig.layers.forEach((e, index) => {
                //console.log(e);
                if (e.group !== undefined && layer2[e.group]) {
                    if (!layer2[e.group].features) {
                        layer2[e.group].features = [];
                    }
                    layer2[e.group].features.push(e);
                }
            });
            //console.log(layer2);return;
            this.getMap().delete('traza2');
            this._trace = this.getMap().draw('traza2', 'trace', {
                data: data,
                layers: this.layerConfig.layers,
                groups: this.layerConfig.groups,
                layers2: layer2,
                images: this.layerConfig.images,
                popup: this.tracePopup,
                onShowInfo: (info) => {
                    info = Object.assign(this.data[info.i], info);
                    let xInputs = "";
                    info.iInputs.forEach(element => {
                        xInputs += `<div>${element.name} ${element.value}</div>`;
                    });
                    info.xinputs = xInputs;
                    //console.log(info)
                    this.popupInfoForm.setMode(info.className);
                    this.popupInfoForm.setData(info);
                    this._infoForm.setMode(info.className);
                    this._infoForm.setData(info);
                }
            });
            this.getMap().getControl('trace').setTrace(this._trace);
            //this.getMap().getControl('trace').reset();
            this.getMap().getControl('trace').showLayers();
            this.getMap().getControl('trace').setData(this.data);
            this.getMap().getControl('trace').setConfigData({
                className: "speed",
                fields: ["uTime", "speed", "event"],
                labels: ["Hora", "Km/h", "Evento"],
            });
            //this.formHistoryConfig.id = ;
            const layerTool = new LayerTool({
                id: this.getMap().getControl('trace').getPage(3),
                trace: this._trace,
                data: this.layerConfig,
                onNewLayer: (id, info) => {
                    layerTool.setNewIdLayer(this._trace.imageLayer(info));
                },
                onEditLayer: (id, info) => {
                    this._trace.updateImageLayer(info);
                },
                onDeleteLayer: (id, info) => {
                    this._trace.removeLayer(id);
                },
                onNewImage: (id, info) => {
                    this._trace.addImage(info);
                },
                onEditImage: (id, info) => {
                    this._trace.updateImage(info);
                },
                onDeleteImage: (id, info) => {
                    this._trace.removeImage(info);
                },
                onSaveRoad: (data => {
                    this._trace.updateRoadLayer(data);
                }),
                onSaveTrace: (data => {
                    this._trace.updateTraceLayer(data);
                }),
            });
            this.getMap().getControl('trace').createList();
            return;
            const win = new Float.Window({
                visible: true,
                caption: "Layer Control",
                child: layerTool.get(),
                left: 10,
                top: 40,
                width: "300px",
                height: "300px",
                mode: "auto",
                className: ["sevian"]
            });
            //this.getMap().getControl('trace').setFilterPage(this._form.get());
            //this._trace.play();
        }
        formateData(data) {
            console.log(data);
            data.forEach((e, index) => {
                e.coordinates = [e.longitude, e.latitude];
                e.i = index;
            });
            return data;
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
        }
        getInfoLayer() {
            return this._info;
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
        getTrace() {
            return this._trace;
        }
        getInfo() {
            return {
                "images": [
                    {
                        "name": "pulsing-1",
                        "type": "pulsing",
                        "color": "#ff6464",
                        "border": "#ffffff",
                        "halo": "#FFC8C8"
                    },
                    {
                        "name": "pulsing-2",
                        "type": "pulsing",
                        "color": "#12AAC8",
                        "border": "#ffffff",
                        "halo": "#CCF2F9"
                    },
                    {
                        "name": "pulsing-3",
                        "type": "pulsing",
                        "color": "#FFFC84",
                        "border": "#FF4500",
                        "halo": "#FFD3C6"
                    },
                    {
                        "name": "circle-0",
                        "type": "circle",
                        "color": "#000000",
                        "border": "#ffffff"
                    },
                    {
                        "name": "circle-1",
                        "type": "circle",
                        "color": "#FFFF00",
                        "border": "#ffffff"
                    },
                    {
                        "name": "circle-2",
                        "type": "circle",
                        "color": "#339966",
                        "border": "#ffffff"
                    },
                    {
                        "name": "circle-3",
                        "type": "circle",
                        "color": "#FF0000",
                        "border": "#ffffff"
                    },
                    {
                        "name": "circle-4",
                        "type": "circle",
                        "color": "#3366cc",
                        "border": "#ffffff"
                    },
                    {
                        "name": "arrow-1",
                        "type": "arrow",
                        "color": "#ff99ff",
                        "border": "#ffffff"
                    },
                    {
                        "name": "arrow-2",
                        "type": "arrow",
                        "color": "#FF0000",
                        "border": "#ffffff"
                    },
                    {
                        "name": "arrow-3",
                        "type": "arrow",
                        "color": "#008000",
                        "border": "#ffffff"
                    },
                    {
                        "name": "arrow-4",
                        "type": "arrow",
                        "color": "#66ffff",
                        "border": "#ffffff"
                    },
                    {
                        "name": "arrow-5",
                        "type": "arrow",
                        "color": "#ffccff",
                        "border": "#ffffff"
                    },
                    {
                        "name": "arrow-6",
                        "type": "arrow",
                        "color": "#ff9900",
                        "border": "#ffffff"
                    },
                    {
                        "name": "arrow-7",
                        "type": "arrow",
                        "color": "#cc3399",
                        "border": "#FFC0CB"
                    }
                ],
                "colors": [
                    "#FF0000",
                    "#FFFF00",
                    "#0000FF",
                    "#008000",
                    "#FF0000",
                    "#FF4500",
                    "#000000",
                    "#ffffff",
                    "aquamarine",
                    "brown",
                    "fuchsia",
                    "#008000#FFFF00",
                    "lime",
                    "magenta",
                    "dark#0000FF"
                ],
                "groups": [
                    {
                        "caption": "Capas",
                        "className": "x",
                        "mode": "close"
                    },
                    {
                        "caption": "Velocidad",
                        "className": "x",
                        "mode": "close"
                    },
                    {
                        "caption": "Inputs",
                        "className": "x",
                        "mode": "close"
                    },
                    {
                        "caption": "Opuputs",
                        "className": "x",
                        "mode": "close"
                    },
                    {
                        "caption": "Eventos",
                        "className": "x",
                        "mode": "close"
                    },
                    {
                        "caption": "Mis Alarmas",
                        "className": "x",
                        "mode": "close"
                    },
                    {
                        "caption": "Mis Eventos",
                        "className": "x",
                        "mode": "close"
                    }
                ],
                "layers": [
                    {
                        "prop": "speed",
                        "caption": "Detenido",
                        "image": "pulsing-1",
                        "scale": 1.0,
                        "valueType": "==",
                        "value": 0,
                        "className": "",
                        "group": 1,
                        "visible": true
                    },
                    {
                        "prop": "speed",
                        "caption": "0+ a 20 Km/h",
                        "image": "pulsing-2",
                        "scale": 1.0,
                        "valueType": "(]",
                        "value": "0,20",
                        "className": "",
                        "group": 1,
                        "visible": true
                    },
                    {
                        "prop": "speed",
                        "caption": "20 a 40 Km/h",
                        "image": "pulsing-3",
                        "scale": 1.0,
                        "valueType": "(]",
                        "value": "20,40",
                        "className": "",
                        "group": 1,
                        "visible": true
                    },
                    {
                        "prop": "speed",
                        "caption": "40 a 60 Km/h",
                        "image": "arrow-3",
                        "scale": 1.0,
                        "valueType": "(]",
                        "value": "40,60",
                        "className": "",
                        "group": 1,
                        "visible": true
                    },
                    {
                        "prop": "speed",
                        "caption": "60 a 80 Km/h",
                        "image": "arrow-4",
                        "scale": 1.0,
                        "valueType": "(]",
                        "value": "60,80",
                        "className": "",
                        "group": 1,
                        "visible": true
                    },
                    {
                        "prop": "speed",
                        "caption": "80 a 100 Km/h",
                        "image": "arrow-5",
                        "scale": 1.0,
                        "valueType": "(]",
                        "value": "80,100",
                        "className": "",
                        "group": 1,
                        "visible": true
                    },
                    {
                        "prop": "speed",
                        "caption": "100+ Km/h",
                        "image": "arrow-6",
                        "scale": 1.0,
                        "valueType": ">",
                        "value": "100",
                        "className": "",
                        "group": 1,
                        "visible": true
                    }
                ]
            };
        }
    }
    History._instances = [];
    return History;
})(_sgQuery);
//# sourceMappingURL=History.js.map