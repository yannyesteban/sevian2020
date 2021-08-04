import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { Map } from './Map.js';
//import {Form2 as Form2} from './Form2.js';
import { Menu as Menu } from '../../Sevian/ts/Menu2.js';
import { Float } from '../../Sevian/ts/Window.js';
import { S } from '../../Sevian/ts/Sevian.js';
import { Trace } from '../../lib/Trace.js';
import { TraceTool } from './TraceTool.js';
import { InfoForm } from '../../Sevian/ts/InfoForm.js';
import { LayerMenu } from './LayerMenu.js';
const evalInputs = (data) => {
    let xInputs = "";
    let xOutputs = "";
    if (typeof data.iInputs === "string") {
        data.iInputs = JSON.parse(data.iInputs);
    }
    data.iInputs.forEach(element => {
        return;
        const div = `<div data-input-id="${element.id}" data-input-value="${element.on}"><span>${element.name}</span><span>${element.value}</span></div>`;
        if (element.type === "i") {
            xInputs += div;
        }
        else {
            xOutputs += div;
        }
    });
    data.xInputs = xInputs;
    data.xOutputs = xOutputs;
    return data;
};
class Mobil {
    constructor(info) {
        this.data = null;
        this.name = null;
        this.mark = null;
        this.latitude = 0;
        this.longitude = 0;
        this.heading = 0;
        this.image = "";
        this.trace = null;
        this.traceInfo = {};
        this.popupInfo = "";
        this.visible = false;
        this.valid = false;
        this.infoForm = null;
        this.infoFormMain = null;
        this.propertysInfo = [];
        this.maxDelay = 200;
        this.followMe = false;
        this.trackingData = [];
        this.onValid = (value) => { };
        this.onFollow = (value) => { };
        this.onVisible = (value) => { };
        this.onTrace = (value) => { };
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        this.infoFormMain = new InfoForm(this.infoForm);
        this.mark = Mobil.map.createMark({
            latitude: this.latitude,
            longitude: this.longitude,
            heading: this.heading,
            image: this.image,
            popupInfo: this.infoFormMain.get(),
            visible: this.visible
        });
        this.createTrace(this.traceInfo);
    }
    static setMap(map) {
        Mobil.map = map;
    }
    createTrace(info) {
        const infoForm = new InfoForm(info.infoTrace);
        this.trace = new Trace({
            //data:tracking,
            map: Mobil.map.map,
            layers: info.layers,
            propertysInfo: this.propertysInfo,
            popupInfo: infoForm.get(),
            onShowInfo: (info) => {
                const data = Object.assign({}, this.data);
                Object.assign(data, info);
                //info = evalInputs(info);
                if (typeof data.inputs === "string") {
                    data.inputs = JSON.parse(data.inputs);
                }
                if (typeof data.outputs === "string") {
                    data.outputs = JSON.parse(data.outputs);
                }
                infoForm.setData(data);
            }
        });
    }
    deleteTrace() {
        this.trace.delete();
    }
    getTrace() {
        return this.trace;
    }
    initTrace(trackingData) {
        if (trackingData) {
            this.trackingData = trackingData;
        }
        this.trace.init(this.trackingData);
    }
    addTracking(tracking) {
        this.setValid(true);
        if (this.trace.isActive()) {
            this.trackingData.push(tracking);
            this.trace.setData(this.trackingData);
        }
    }
    setPosition(info) {
        this.longitude = info.longitude || 0;
        this.latitude = info.latitude || 0;
        this.mark.setLngLat([this.longitude, this.latitude]);
        this.mark.setHeading(info.heading || 0);
        //this.mark.setPopup(info.popupInfo || "");
        if (info.visible) {
            this.mark.show(info.visible);
        }
        if (info.image) {
        }
        return this;
    }
    setInfo(info) {
        this.infoFormMain.setData(info);
        return this;
    }
    flyTo() {
        this.mark.flyTo();
        return this;
    }
    show(value) {
        this.visible = value;
        this.mark.show(value);
        return this;
    }
    setVisible(value) {
        this.visible = value;
        this.mark.show(value);
        this.onVisible(value);
        return this;
    }
    getVisible() {
        return this.visible;
    }
    panTo() {
        this.mark.panTo();
        return this;
    }
    getValid() {
        return this.valid;
    }
    setValid(value) {
        this.valid = value;
        this.onValid(value);
    }
    getName() {
        return this.name;
    }
    getInfoForm() {
        return this.infoFormMain;
    }
    getCoordinates() {
        return [this.longitude, this.latitude];
    }
    getFollow() {
        return this.followMe;
    }
    setFollow(value) {
        this.followMe = value;
        this.onFollow(value);
    }
    cutTrace() {
        if (this.trace.isActive() && this.maxDelay) {
            let length = this.trackingData.length;
            const time = Math.trunc(Date.now() / 1000);
            this.trackingData = this.trackingData.filter((e) => (time - e.ts) < this.maxDelay);
            if (length != this.trackingData.length) {
                this.trace.setData(this.trackingData);
            }
        }
    }
}
Mobil.map = null;
export class Unit {
    constructor(info) {
        this.id = null;
        this.map = null;
        this.units = {};
        this.mapName = null;
        this.traceControl = null;
        this.infoForm = null;
        this.infoFormMain = null;
        this.infoPopup = null;
        this.infoTrace = null;
        this.infoPopupMain = null;
        this.delay = 5000;
        this.traceDelay = 20000;
        this.timer = null;
        this.traceTimer = null;
        this.propertysInfo = [];
        this.traceTool = null;
        this.dataClients = null;
        this.dataAccounts = null;
        this.dataUnits = null;
        this.indexUnit = [];
        this.tracking = null;
        this.history = null;
        this.traceConfig = null;
        this.menu = null;
        this.win = null;
        this.infoInput = {};
        this.unitInputs = {};
        this.caption = "u";
        this.winCaption = "";
        this.pathImages = "";
        this.followMe = false;
        this.infoTemplate = ``;
        this.popupTemplate = ``;
        this.onInfoUpdate = (info, name) => { };
        this.main = null;
        this.marks = {};
        this._info = null;
        this._winInfo = null;
        this._timer = null;
        this._timer2 = null;
        this.delay2 = 12000;
        this._lastUnitId = 0;
        this._traces = [];
        this.infoId = null;
        this.statusId = null;
        this._win = [];
        this.showConnectedUnit = false;
        this.msgErrorUnit = "Unit not Found!!!";
        this.msgErrortracking = "data tracking not Found!!!";
        this.searchUnitId = null;
        this.searchUnit = null;
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        //return;
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
        Map.load(this.mapName, (mapApi, map) => {
            Mobil.setMap(mapApi);
            this.setMap(map);
            this.dataUnits.forEach((info) => {
                const tracking = this.tracking.find(e => e.unitId == info.unitId) || {};
                const propertys = {};
                this.propertysInfo.forEach((e) => {
                    propertys[e.name] = e;
                });
                this.units[info.unitId] = new Mobil({
                    data: info,
                    name: info.vehicle_name,
                    latitude: tracking.latitude || 0,
                    longitude: tracking.longitude || 0,
                    heading: tracking.heading || 0,
                    image: info.image,
                    popupInfo: "this.loadPopupInfo(info)" + info.unitId,
                    visible: false,
                    infoForm: this.infoPopup,
                    valid: tracking.unitId !== undefined,
                    propertysInfo: propertys,
                    traceInfo: {
                        layers: this.traceConfig.layers,
                        infoTrace: this.infoTrace,
                    },
                    onValid: (valid) => {
                        const ele = $.query(`.sg-menu .item[data-unit-id="${info.unitId}"] `);
                        $(ele).ds("valid", (valid) ? "1" : "0");
                        this.traceTool.validUnit(info.unitId, valid);
                    },
                    onVisible: (value) => {
                        const ele = $.query(`.sg-menu .item[data-unit-id="${info.unitId}"] input[type="checkbox"] `);
                        $(ele).attr("checked", value);
                    }
                });
            });
            if (this.infoForm) {
                this.infoFormMain = new InfoForm(this.infoForm);
                if (this.infoId) {
                    const winInfo = S.getElement(this.infoId);
                    this.onInfoUpdate = (info, name) => {
                        //this.infoFormMain.setMode(info.className);
                        this.infoFormMain.setData(info);
                        winInfo.setCaption(name);
                        winInfo.setBody(this.infoFormMain.get());
                    };
                }
            }
            this.play();
            this.initTraceControl();
            //this.playTrace();
            //map.map.addImage("t1", new TraceMarker(map.map, 30), { pixelRatio: 1 });
            return;
            console.log(this.tracking);
            t;
        });
        if (this.showConnectedUnit) {
            this.play2();
        }
    }
    static getInstance(name) {
        return Unit._instances[name];
    }
    showMenu() {
        this._win["menu-unit"].show();
    }
    showConnected() {
        this._win["status-unit"].show();
    }
    _create(main) {
        this.main = main;
        this.searchUnit = S.getElement(this.searchUnitId);
        main.addClass("unit-main");
        this.createMenu();
        //this.menu = this.createMenu();
        this._win["menu-unit"] = new Float.Window({
            visible: true,
            caption: this.caption,
            left: 10,
            top: 100,
            width: "280px",
            height: "250px",
            mode: "auto",
            className: ["sevian"],
            child: this.main.get()
        });
        this.statusId = "yasta";
        const _statusUnit = $().create("div").id(this.statusId).addClass("win-status-unit");
        this._win["status-unit"] = new Float.Window({
            visible: this.showConnectedUnit,
            caption: "Conected Units",
            left: 10 + 280 + 20,
            top: 100,
            width: "380px",
            height: "300px",
            mode: "auto",
            className: ["sevian"],
            child: _statusUnit.get()
        });
        this._info = $().create("div").addClass("win-units-info");
        //this._info = $().create("div").addClass("win-units-info");
    }
    _load(main) {
    }
    init() {
    }
    setUnit(info) {
        if (!this.units[info.unitId]) {
            this.units[info.unitId] = new Mobil(info);
        }
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
        for (let unitId in this.units) {
            this.units[unitId].cutTrace();
        }
        if (data === undefined) {
            return;
        }
        data.forEach((tracking, i) => {
            //this.trace.add(element);
            const unitId = tracking.unitId;
            const index = this.tracking.findIndex(e => e.unitId == unitId);
            if (index >= 0) {
                this.tracking[index] = tracking;
            }
            if (this.units[unitId]) {
                this.units[unitId].addTracking(tracking);
                this.units[unitId].setPosition({
                    longitude: tracking.longitude,
                    latitude: tracking.latitude,
                    heading: tracking.heading
                }).setInfo(this.getUnitInfo(unitId));
            }
            if (this._lastUnitId === unitId) {
                this.onInfoUpdate(this.getUnitInfo(unitId), this.units[unitId].getName());
            }
            if (this.followMe) {
                this.flyTo();
            }
            return;
            const unitIndex = this.dataUnits.findIndex(e => e.unitId == unitId);
            console.log(index, this.marks, this.marks[unitId]);
            if (this.marks[unitId]) {
                const mark = this.marks[unitId];
                mark.setLngLat([this.tracking[index].longitude, this.tracking[index].latitude]);
                mark.setHeading(this.tracking[index].heading);
                mark.setPopup(this.loadPopupInfo(unitIndex));
                this.setInfo(unitIndex);
                //let popup = this.evalHTML(this.popupTemplate, this.dataUnits[id]);
                //popup = this.evalHTML(popup, this.tracking[id]);
            }
        });
    }
    play() {
        //console.log(this.map.map.map)
        /*
        const cluster = new Cluster({ map: this.map.map.map });
        cluster.init();
        */
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
        this.timer = setInterval(() => {
            S.go({
                async: true,
                valid: false,
                requestFunction: (json) => {
                    console.log(json);
                    //cluster.updateSource(json);
                    this.updateTracking(json);
                },
                params: [
                    {
                        t: "setMethod",
                        id: this.id,
                        element: "gt_unit",
                        method: "tracking",
                        name: "x",
                        eparams: {}
                    }
                ]
            });
        }, this.delay);
    }
    stop() {
        if (this.timer) {
            window.clearTimeout(this.timer);
        }
    }
    updateTrace(xhr) {
        let json = JSON.parse(xhr.responseText);
        console.log(json);
        //this.updateTraceLayer(json);
        //this.stopTrace();
        //this.traceDelay = 60000000;
        //this.playTrace();
    }
    stopTrace() {
        if (this.traceTimer) {
            window.clearTimeout(this.traceTimer);
        }
    }
    playTrace(unitId, value) {
        if (value === false) {
            this.units[unitId].deleteTrace();
            return;
        }
        S.go({
            async: true,
            requestFunction: (tracking) => {
                this.units[unitId].initTrace(tracking);
                this.units[unitId].setVisible(true);
            },
            params: [
                {
                    t: "setMethod",
                    id: this.id,
                    element: "gt_unit",
                    method: "trace",
                    name: '',
                    eparams: {
                        unitId: unitId
                    }
                }
            ]
        });
    }
    createMenu() {
        //console.log(this.dataUnits);return;
        let infoMenu = [];
        let cacheClient = [];
        let cacheAccount = [];
        this.dataUnits.forEach((info, index) => {
            const clientId = info.client_id;
            const accountId = info.account_id;
            const unitId = info.unitId;
            //console.log(clientId, this.dataUnits[x].client);
            if (!cacheClient[clientId]) {
                cacheClient[clientId] = {
                    id: clientId,
                    caption: info.client,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                    checkValue: index,
                    checkDs: { "level": "client", "clientId": clientId },
                    ds: { "clientId": clientId },
                    check: (item, event) => {
                        this.showAccountUnits(clientId, event.currentTarget.checked);
                    },
                };
                infoMenu.push(cacheClient[clientId]);
            }
            if (!cacheAccount[accountId]) {
                cacheAccount[accountId] = {
                    id: accountId,
                    caption: info.account,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                    checkValue: accountId,
                    checkDs: { "level": "account", "accountId": accountId },
                    ds: { "accountId": accountId },
                    check: (item, event) => {
                        this.showUnits(accountId, event.currentTarget.checked);
                    },
                };
                cacheClient[clientId].items.push(cacheAccount[accountId]);
            }
            cacheAccount[accountId].items.push({
                id: unitId,
                caption: info.vehicle_name,
                useCheck: true,
                value: index,
                checkValue: index,
                checkDs: { "level": "units", "unitId": unitId },
                ds: { "unitId": unitId, "valid": info.valid },
                check: (item, event) => {
                    this.showUnit(unitId, event.currentTarget.checked);
                },
                action: (item, event) => {
                    let ch = item.getCheck();
                    ch.get().checked = true;
                    if (this.units[unitId].getValid()) {
                        this.units[unitId].setInfo(this.getUnitInfo(unitId));
                        this.units[unitId].show(true);
                        this.units[unitId].flyTo();
                        this._lastUnitId = unitId;
                        //this.playTrace(unitId);
                    }
                    else {
                        alert(this.msgErrortracking);
                    }
                    this.onInfoUpdate(this.getUnitInfo(unitId), info.vehicle_name);
                    //this.setInfo(unitId);
                }
            });
        });
        return new Menu({
            caption: "",
            autoClose: false,
            target: this.main,
            items: infoMenu,
            useCheck: true,
            check: (item) => {
                let ch = item.getCheck();
                let checked = ch.get().checked;
                let list = item.queryAll(`input[type="checkbox"]`);
                for (let x of list) {
                    x.checked = checked;
                }
            }
        });
        ;
    }
    getInfoLayer() {
        return this._info;
    }
    showUnit2(unitId, value) {
        this.showUnit(this.indexUnit[unitId], value);
    }
    showUnit(unitId, value) {
        if (this.units[unitId]) {
            this.units[unitId].show(value);
            return;
        }
        //alert(this.msgErrorUnit);
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
            let regex = new RegExp('\(\{=(' + x + ')\})', "gi");
            html = html.replace(regex, auxf);
        }
        return html;
    }
    flyTo() {
        let coordinates = [];
        for (let x in this.units) {
            if (this.units[x].getValid() && this.units[x].getVisible() && this.units[x].getFollow()) {
                coordinates.push(this.units[x].getCoordinates());
            }
        }
        if (coordinates.length > 0) {
            this.map.getControl().boundTo(coordinates);
        }
    }
    panTo(unitId) {
        if (this.marks[unitId]) {
            this.marks[unitId].panTo();
        }
    }
    getUnitInfo(unitId) {
        const dataUnit = this.dataUnits.find(e => e.unitId == unitId);
        const data = Object.assign({}, dataUnit);
        Object.assign(data, this.tracking.find(e => e.unitId == unitId));
        return (data);
    }
    setInfo(unitId) {
        const dataUnit = this.dataUnits.find(e => e.unitId == unitId);
        const data = Object.assign({}, dataUnit);
        Object.assign(data, this.tracking.find(e => e.unitId == unitId));
        this.onInfoUpdate(this.loadInfoData(data), dataUnit.vehicle_name);
        return;
        if (!this.dataUnits[id]) {
            return;
        }
        //this._info.text(this.loadInfoData(id));
        //this._winInfo.setCaption(this.dataUnits[id].vehicle_name);
    }
    getDataInfo(id) {
        if (!this.dataUnits[id]) {
            return;
        }
        let data = this.dataUnits[id];
        const tracking = this.tracking[data.unitId];
        for (let x in tracking) {
            this.dataUnits[id][x] = tracking[x];
        }
        return data;
    }
    loadPopupInfo(id) {
        const data = this.getDataInfo(id);
        data.input1 = " -";
        data.output1 = " -";
        if (data.input) {
            let _input = $.create("div");
            data.input.forEach((e, index) => {
                _input.create("div").text(e.name + ":" + e.value);
                //_input.add("div").text(e.value);
            });
            data.input1 = _input.text();
        }
        if (data.output) {
            let _input = $.create("div");
            data.output.forEach((e, index) => {
                _input.create("div").text(e.name + ":" + e.value);
                //_input.add("div").text(e.value);
            });
            data.output1 = _input.text();
        }
        return this.evalHTML(this.popupTemplate, data);
        //return this.evalHTML(, this.tracking[this.dataUnits[id].unitId]);
    }
    loadInfoData(data) {
        console.log(data);
        let xInputs = "";
        if (data.iInputs) {
            data.iInputs.forEach(element => {
                xInputs += `<div>${element.name} ${element.value}</div>`;
            });
        }
        data.xinputs = xInputs;
        //this.infoFormMain.setMode(info.className);
        this.infoFormMain.setData(data);
    }
    setFollowMe(value) {
        this.followMe = value;
    }
    getFollowMe() {
        return this.followMe;
    }
    showStatusWin() {
        S.send3({
            "async": 1,
            "params": [
                {
                    "t": "setMethod",
                    "mode": "element",
                    "id": this.statusId,
                    "element": "form",
                    "method": "list",
                    "name": "/form/status_unit",
                    "eparams": { "mainId": this.statusId }
                }
            ],
            onRequest: (x) => {
            }
        });
    }
    setUnit2(unitId) {
        this._lastUnitId = unitId;
        if (this.searchUnit) {
            this.searchUnit.setValue({ unitId: unitId });
        }
        this.findUnit(unitId);
    }
    findUnit(unitId) {
        const index = this.indexUnit[unitId];
        this.showUnit(index, true);
        this.setInfo(index);
        this.flyTo(index);
    }
    initTool() {
        const tool = new TraceTool({});
    }
    initTraceControl() {
        this.traceControl = this.map.getControl().getControl("trace"); //<TraceControl>
        //this.traceControl.play();
        this.traceTool = new TraceTool({
            id: this.traceControl.getPage(0),
            dataUnits: this.dataUnits,
            tracking: this.tracking,
            onTrace: (unitId, value) => {
                this.playTrace(unitId, value);
            },
            onFollow: (unitId, value) => {
                this.units[unitId].setFollow(value);
            }
        });
        this.traceControl.getPage(1).addClass("trace-layer");
        new LayerMenu({
            layers: this.traceConfig.layers,
            groups: this.traceConfig.groups,
            map: this.map.getControl(),
            target: this.traceControl.getPage(1),
            onShowLayer: (index, value) => {
                for (const key in this.units) {
                    this.units[key].getTrace().showLayerIx(index, value);
                }
            }
        });
    }
    updateTraceLayer(tracking) {
        /*
        console.log(this.history);
        console.log(this.history.filter((e, index)=>{
            return e.ts>=1593616910
        }));
        */
        //console.log(this.dataUnits);
        const trace = this.trace = new Trace({
            data: tracking,
            map: this.map.getControl().map,
            layers: this.traceConfig.layers,
            images: this.traceConfig.images,
        });
        //trace.draw({});
        const traceTool = new TraceTool({
            id: this.traceControl.getPage(0),
            dataUnits: this.dataUnits,
            tracking: this.tracking,
        });
        //map.getControl("mark").onsave = ((info)=>{}
    }
    isValid(unitId) {
        this.units[unitId];
    }
    showUnit3(unitId) {
        if (this.units[unitId].getValid()) {
            this.units[unitId].setInfo(this.getUnitInfo(unitId));
            this.units[unitId].show(true);
            this.units[unitId].flyTo();
            this._lastUnitId = unitId;
            //this.playTrace(unitId);
        }
        else {
            alert(this.msgErrortracking);
        }
        const info = this.dataUnits.find(e => e.unitId == unitId) || {};
        if (info) {
            this.onInfoUpdate(this.getUnitInfo(unitId), info.unitName);
        }
    }
}
Unit._instances = [];
//# sourceMappingURL=Unit.js.map