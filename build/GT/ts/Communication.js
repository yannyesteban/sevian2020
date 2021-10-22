import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { Form2 as Form } from '../../Sevian/ts/Form2.js';
import { Grid2 as Grid } from '../../Sevian/ts/Grid2.js';
import { Float } from '../../Sevian/ts/Window.js';
import { S } from '../../Sevian/ts/Sevian.js';
import { Socket } from './Socket.js';
import { Sound } from './Sound.js';
import { InfoComm, InfoMenu, InfoUnits } from './InfoMenu.js';
var WNames;
(function (WNames) {
    WNames[WNames["now"] = 1] = "now";
    WNames[WNames["event"] = 2] = "event";
    WNames[WNames["alarm"] = 4] = "alarm";
    WNames[WNames["synch"] = 8] = "synch";
    WNames[WNames["unit"] = 9999] = "unit";
})(WNames || (WNames = {}));
let n = 0;
export class Communication {
    constructor(info) {
        this.id = null;
        this.target = null;
        this.caption = "gt-comm";
        this.mainClass = "gt-comm";
        this.mainDS = "gtComm";
        this.main = null;
        this.mainForm = null;
        this.mainPanel = null;
        this.menuPanel = null;
        this.gridId = null;
        this.historyPanel = null;
        this.infoMenuId = null;
        this.unitId = null;
        this.paramCommandId = "xxx1";
        this.paramCommand = null;
        this._formCommand = null;
        this.formCommandId = "formCommand";
        this._responseForm = null;
        this.responseForm = null;
        this._commandPanel = null;
        this.commandPanelId = "gtcomm-panel-1";
        this.eventPanelId = "";
        this.mainPanelId = "gtcomm-panel-0";
        this._bodyPanel = null;
        this.bodyPanelId = "gtcomm-panel-2";
        this._ws = null;
        this.user = "";
        this.unitPanelId = null;
        this._grid = null;
        this.callOnMessage = (messaje) => { };
        this._win = [];
        this._infoControl = {};
        this._infoWin = null;
        this._infoWin2 = null;
        this.showConnectedUnit = true;
        this._timer2 = null;
        this.delay2 = 5000;
        this._timer3 = null;
        this.delay3 = 5000;
        this.lastEventId = 0;
        this.lastDate = null;
        this.statusId = null;
        this.connectionId = "button-connect";
        this._form = null;
        this.mode = "";
        this.onSetMode = (mode) => { return this.mode; };
        this._infoMenu = null;
        this.infoMenu = null;
        this.winStatus = null;
        this.winNow = null;
        this.winUnit = null;
        this.winEvent = null;
        this.winAlarm = null;
        this.unitPanel = null;
        this.winNames = WNames;
        this.maxRecords = 50;
        this.sound = null;
        this.socketServer = {
            host: "127.0.0.1",
            port: 3310
        };
        //console.di(info);
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = (this.id) ? $(this.id) : false;
        if (main) {
            if (main.ds(this.mainDS)) {
                //return;
            }
        }
        else {
            main = $.create("div").attr("id", this.id);
        }
        this._create(main);
        this.sound = new Sound({});
        $(window).on("load", () => {
            // newMenus();
            this._ws = new Socket({
                user: this.user,
                url: this.socketServer.host,
                port: this.socketServer.port,
                //name: S.getInstance(),
                onopen: (event) => {
                    let openMessage = JSON.stringify({
                        type: "connect",
                        user: this.user,
                        name: S.getInstance(),
                        config: []
                    });
                    this._ws.send(openMessage);
                    this.setMode('connected');
                    console.log("Websockect Connected...!");
                },
                onclose: (event) => {
                    //db ("----Connection lost...!!!");
                    this.setMode("disconnected");
                    // Try to reconnect in 5 seconds
                    setTimeout(() => {
                        //db ("Connection lost...!!!");
                        this.connect();
                    }, 5000);
                },
                onmessage: (event) => {
                    //db ("     onmessage !!!!");
                    const server_message = event.data;
                    //console.log (server_message);
                    try {
                        let json = JSON.parse(server_message);
                        //console.log(json);
                        //alert(json.message)
                        //db (json.message);
                        this.callOnMessage(json);
                        //this._grid.createRow(json);
                        //info.add({name:"L-V06", time:"8:00am", type:"C", message:"CONECTING"});
                        this.addInfo(0, {
                            unitId: json.unitId || '',
                            name: json.name,
                            type: 7,
                            message: json.message,
                            info: {
                                user: json.user,
                                date: json.date,
                                delay: json.delay,
                                message: json.message
                            }
                        });
                        /*
                        this._infoWin2.add({
                            name:json.name,
                            type:7,
                            message: json.message,
                            info:{
                                user:json.user,
                                date:json.date,
                                delay:json.delay,
                                message:json.message
                            }
                        });
                        */
                        //db(server_message);
                    }
                    catch (e) {
                        //alert(e)
                    }
                }
            });
            if (this.showConnectedUnit) {
                //return;
                this.play2();
            }
            if (this.connectionId) {
                const connectionButton = $(this.connectionId);
                connectionButton.addClass("button-connect");
                this.onSetMode = (mode) => {
                    connectionButton.removeClass(this.mode);
                    connectionButton.addClass(mode);
                    return mode;
                };
            }
        });
    }
    _create(main) {
        this._infoMenu = S.getElement(this.infoMenuId);
        this.unitPanel = S.getElement(this.unitPanelId);
        this.unitPanel.onChange = (unitId) => {
            this.setUnit(unitId);
            this.getInfoWin(this.winNames.unit).reset();
            this.getInfoWin(this.winNames.unit).play();
            const unitName = this.unitPanel.getUnitInfo(unitId).unitName;
            this.getWin(this.winNames.unit).setCaption(`${this.winUnit.caption} : ${unitName} <button class="play"></button>`);
            const button = this.getWin(this.winNames.unit).getCaption().query(`button`);
            $(button)
                .prop("title", "Pausar la llegada de eventos")
                .on("click", (event) => {
                $(event.currentTarget).toggleClass("play");
                if ($(event.currentTarget).hasClass("play")) {
                    this.getInfoWin(this.winNames.unit).play();
                }
                else {
                    this.getInfoWin(this.winNames.unit).pause();
                }
            });
        };
        this.main = main;
        main.addClass(this.mainClass);
        main.text("");
        main.removeDs("sgForm");
        main.removeClass("sg-form");
        //const _formDiv2 = $().create("form").id("aas");
        //_formDiv2.create("div").id("div2");
        const infoMenu = this.infoMenu = new InfoMenu({
            menu: this._infoMenu,
            id: "div2"
        });
        /* winNow */
        this.createInfoWindow(this.winNames.now, {
            mainClass: "now",
            fields: [
                {
                    name: "name",
                },
                {
                    name: "ftime",
                },
                {
                    name: "title",
                },
                {
                    name: "speed",
                },
                {
                    name: "delay",
                },
                {
                    name: "info",
                }
            ],
            onread: (info) => {
                if (info.unitId) {
                    this.unitPanel.setUnit(info.unitId);
                    this.unitPanel.showUnit3(info.unitId);
                }
                //this.updateEventStatus(info, 1, this.winNames.now);
            },
            onadd: (info) => {
                /*
                if (info.unitId == this.unitPanel.getLastUnit()) {
                    const win = this.getInfoWin(this.winNames.unit);
                    if(!win.getRow(info.id)){
                        win.addMessage(info);
                    }
                    
                }
                */
            },
            ondelete: (info) => {
                //this.updateEventStatus(info, 2, this.winNames.now);
            }
        }, this.winNow);
        /* winNow2 */
        this.createInfoWindow(this.winNames.unit, {
            mainClass: ["now", "unit"],
            fields: [
                {
                    name: "name",
                },
                {
                    name: "ftime",
                },
                {
                    name: "title",
                },
                {
                    name: "speed",
                },
                {
                    name: "delay",
                },
                {
                    name: "info",
                }
            ],
            onread: (info) => {
                if (info.unitId) {
                    this.unitPanel.setUnit(info.unitId);
                    this.unitPanel.showUnit3(info.unitId);
                }
                //this.updateEventStatus(info, 1, this.winNames.now);
            },
            onadd: (info) => {
            },
            ondelete: (info) => {
                //this.updateEventStatus(info, 2, this.winNames.now);
            }
        }, this.winUnit);
        /* winEvent */
        this.createInfoWindow(this.winNames.event, {
            mainClass: "event",
            fields: [
                {
                    name: "name",
                },
                {
                    name: "ftime",
                },
                {
                    name: "title",
                },
                {
                    name: "speed",
                },
                {
                    name: "delay",
                },
                {
                    name: "attend",
                },
                {
                    name: "user",
                },
                {
                    name: "info",
                }
            ],
            showType: false,
            onread: (info) => {
                if (info.unitId) {
                    if (info.tracking_id) {
                        console.log(info.tracking_id);
                        this.unitPanel.setUnit(info.unitId);
                        this.unitPanel.showUnit4(info.unitId);
                        this.getEventPanel().showEvent(info.id);
                    }
                    else {
                        this.unitPanel.setUnit(info.unitId);
                        this.unitPanel.showUnit3(info.unitId);
                    }
                }
                this.updateEventStatus(info, 1, this.winNames.event);
            },
            onadd: (info) => {
                const counts = this.getInfoWin(this.winNames.event).getCounts();
                this.infoMenu.updateType(this.winNames.event, counts || "");
                this.evalSound();
            },
            ondelete: (info) => {
                this.updateEventStatus(info, 2, this.winNames.event);
            }
        }, this.winEvent);
        /* winAlarm */
        this.createInfoWindow(this.winNames.alarm, {
            mainClass: "alarm",
            fields: [
                {
                    name: "name",
                },
                {
                    name: "ftime",
                },
                {
                    name: "title",
                },
                {
                    name: "speed",
                },
                {
                    name: "delay",
                },
                {
                    name: "attend",
                },
                {
                    name: "user",
                },
                {
                    name: "info",
                }
            ],
            showType: false,
            onread: (info) => {
                if (info.unitId) {
                    if (info.tracking_id) {
                        console.log(info.tracking_id);
                        this.unitPanel.setUnit(info.unitId);
                        this.unitPanel.showUnit4(info.unitId);
                        this.getEventPanel().showEvent(info.id);
                    }
                    else {
                        this.unitPanel.setUnit(info.unitId);
                        this.unitPanel.showUnit3(info.unitId);
                    }
                }
                this.updateEventStatus(info, 1, this.winNames.alarm);
            },
            onadd: (info) => {
                const counts = this.getInfoWin(this.winNames.alarm).getCounts();
                this.infoMenu.updateType(this.winNames.alarm, counts || "");
                this.evalSound();
            },
            ondelete: (info) => {
                this.updateEventStatus(info, 2, this.winNames.alarm);
            }
        }, this.winAlarm);
        //this.createInfoWindow(3, {}, {caption:"Message"});
        let info1 = {};
        this._win["main"] = new Float.Window({
            visible: false,
            caption: this.caption,
            left: 10 + 280 + 20,
            top: 100,
            width: "600px",
            height: "250px",
            mode: "auto",
            className: ["sevian"],
            child: this.main.get()
        });
        this.mainPanel = main.create("div").addClass("mainPanel").id(this.mainPanelId);
        this._aux = main.create("div").addClass("command-panel").id("aux3");
        this._commandPanel = main.create("div").addClass("command-panel").id(this.commandPanelId);
        this._bodyPanel = main.create("form").addClass("body-panel").id(this.bodyPanelId);
        this._formCommand = main.create("div").addClass("formCommand").id(this.formCommandId);
        this.historyPanel = main.create("div").addClass("historyPanel").id("his");
        //this.paramCommandId = "xxx1";
        this.paramCommand = main.create("div").addClass("paramCommand").id(this.paramCommandId);
        this.mainForm.id = this.mainPanel;
        this.mainForm.parentContext = this;
        this._form = new Form(this.mainForm);
        const _formDiv = $().create("form").id(this.gridId);
        this.responseForm.id = this.gridId;
        this.responseForm.type = "default";
        this.responseForm.parentContext = this;
        this._grid = new Grid(this.responseForm);
        this._win["main2"] = new Float.Window({
            visible: false,
            caption: "Ventana Inmediato",
            left: 10 + 280 + 20 + 390,
            top: 500,
            width: "500px",
            height: "200px",
            mode: "auto",
            className: ["sevian"],
            child: _formDiv.get()
        });
        this._infoWin2 = new InfoUnits({
            onread: (info) => {
                if (info.id) {
                    this.unitPanel.setUnit(info.id);
                }
                //const counts = this.getInfoWin(2).getCounts();
                //infoMenu.updateType(1, counts[info.type] || "");
                this.unitPanel.showUnit3(info.id);
                //console.log(info);
            },
            onadd: (info) => {
                //this._win["status-unit"].setCaption("Conected Units [ "+(this._infoWin2.getCounts()*1)+" ]");
            }
        });
        if (this.unitId) {
            this.loadUnit(this.unitId);
        }
        return;
        this.statusId = "yasta2";
        const _statusUnit = $().create("div").id(this.statusId).addClass("win-status-unit");
        const winStatus = {
            visible: this.showConnectedUnit,
            caption: "Conected Units",
            left: "right",
            top: "bottom",
            deltaX: -50,
            deltaY: -140 - 20,
            //top:390,
            width: "330px",
            height: "120px",
            mode: "auto",
            className: ["sevian"],
            child: _statusUnit.get(),
            resizable: true,
            draggable: true,
            closable: false
        };
        this.winStatus.visible = this.showConnectedUnit;
        this.winStatus.child = _statusUnit.get();
        this._win["status-unit"] = new Float.Window(this.winStatus);
    }
    show() {
        if (this.unitId) {
            this.init(this.unitId);
        }
        this._win["main"].show();
    }
    show2() {
        this._win["main2"].show();
    }
    test() {
        alert("Communication");
    }
    send(unitId) {
        S.send({
            "async": true,
            "panel": 4,
            "params": [
                {
                    "t": "setMethod",
                    "id": "99",
                    "element": "gt-communication",
                    "method": "unit-init",
                    "name": "x",
                    "eparams": {
                        "a": 'yanny',
                        "targetId": 'x25',
                        "unitId": unitId,
                    }
                }
            ],
        });
    }
    send2(unitId) {
        S.send({
            "async": true,
            "panel": 4,
            "params": [
                {
                    "t": "setMethod",
                    "id": "4",
                    "element": "s-form",
                    "method": "request",
                    "name": "/form/brands",
                    "eparams": {}
                }
            ]
        });
    }
    showConnected() {
        this._win["status-unit"].show();
    }
    reqStatusWin(json) {
        //this._infoWin2.reset();
        let sum = 0;
        json.forEach(e => {
            this.lastDate = e.last_date;
            this._infoWin2.add({
                id: e.unit_id,
                name: e.vehicle_name,
                delay: e.delay,
                type: 10,
                device_name: e.device_name,
                message: e.status,
                connected: e.connected
            });
            if (e.connected >= 0) {
                sum++;
            }
        });
        this._win["status-unit"].setCaption("Conected Units: [ " + (sum) + " ]");
        //console.log(json);
        const div = $(this.statusId);
        div.append(this._infoWin2.get());
    }
    reqDataEvent(json) {
        let i = 0;
        const modes = [1, 2, 4, 8, 16, 32, 64, 128, 256];
        json = json.reverse();
        for (let x in json) {
            i++;
            modes.forEach((m, index) => {
                //console.log(json[x]);
                //console.log(json[x].mode, m, json[x].mode & m, index+1);
                if (json[x].mode & m) {
                    //console.log(m, index+1);
                    this.addInfo(m, json[x]);
                }
            });
            this.lastEventId = json[x].id;
        }
        /*
        json.forEach((e)=>{
            this.addInfo(e.mode*1,e);
        });
        */
        //this.addInfo(5,{info1, name:"L-V06", time:"8:00am", type:5, cType:"SYNC", message:"ALARM INPUTS"});
        // console.log(json);
    }
    reqEventStatus(json) {
        const infoWin = this.getInfoWin(json.windowId);
        infoWin.setStatus(json.eventId, json.status, json.user);
        console.log(json);
        const counts = infoWin.getCounts(); //counts[info.type]
        console.log(json.windowId, counts);
        this.infoMenu.updateType(json.windowId, counts);
        this.evalSound();
        //this.infoMenu.updateType(1, 9);
    }
    updateEventStatus(info, status, windowId) {
        S.go({
            async: true,
            valid: false,
            //blockingTarget: this.getInfoWin(windowId).getMain(),
            requestFunctions: {
                getData: (json) => {
                    this.reqEventStatus(json);
                    return;
                    for (const x in json.data) {
                        this._infoControl[x].setData(json.data[x]);
                        const counts = this.getInfoWin(x).getCounts();
                        this.infoMenu.updateType(x, counts || "");
                    }
                }
            },
            params: [
                {
                    t: 'setMethod',
                    id: 2,
                    element: 'gt-event',
                    method: 'update-status',
                    name: 'x',
                    eparams: {
                        eventId: info.id,
                        status: status,
                        windowId: windowId,
                        mode: info.mode
                    },
                    iToken: "getData",
                }
            ],
        });
        return;
        S.send3({
            async: true,
            panel: 2,
            valid: false,
            confirm_: 'seguro?',
            requestFunction: $.bind(this.reqEventStatus, this),
            params: [
                {
                    t: 'setMethod',
                    id: 2,
                    element: 'gt-event',
                    method: 'update-status',
                    name: 'x',
                    eparams: {
                        eventId: info.id,
                        status: status,
                        windowId: windowId,
                        mode: info.mode
                    }
                }
            ]
        });
    }
    reqAllEventStatus(json) {
        const infoWin = this.getInfoWin(json.windowId);
        infoWin.setAllStatus(json.eventId, json.status, json.user);
        //console.log(json);
        const counts = infoWin.getCounts(); //counts[info.type]
        //console.log(json.windowId, counts);
        this.infoMenu.updateType(json.windowId, counts);
        //this.infoMenu.updateType(1, 9);
        this.evalSound();
    }
    updateAllEventStatus(info, status, windowId) {
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.getInfoWin(windowId).getMain(),
            requestFunctions: {
                getData: (json) => {
                    this.reqAllEventStatus(json);
                    console.log(json);
                    for (const x in json.data) {
                        this._infoControl[x].setData(json.data[x]);
                        const counts = this.getInfoWin(x).getCounts();
                        this.infoMenu.updateType(x, counts || "");
                    }
                }
            },
            params: [
                {
                    t: 'setMethod',
                    id: 2,
                    element: 'gt-event',
                    method: 'update-all-status',
                    name: 'x',
                    eparams: {
                        eventId: this.lastEventId,
                        status: status,
                        windowId: windowId,
                        mode: windowId,
                        firstId: this.getInfoWin(windowId).firstId || 0,
                        lastId: this.getInfoWin(windowId).lastId || 0,
                    },
                    iToken: "getData",
                }
            ],
        });
        return;
        S.send3({
            async: true,
            panel: 2,
            valid: false,
            confirm_: 'seguro?',
            requestFunction: $.bind(this.reqAllEventStatus, this),
            params: [
                {
                    t: 'setMethod',
                    id: 2,
                    element: 'gt-event',
                    method: 'update-all-status',
                    name: 'x',
                    eparams: {
                        eventId: this.lastEventId,
                        status: status,
                        windowId: windowId,
                        mode: 1
                    }
                }
            ]
        });
    }
    goGetEvents() {
        S.go({
            async: true,
            valid: false,
            blockingTarget: this.main,
            requestFunctions: {
                getData: (json) => {
                    for (const x in json) {
                        this._infoControl[x].setData(json[x]);
                        const counts = this.getInfoWin(x).getCounts();
                        this.infoMenu.updateType(x, counts || "");
                    }
                    /*
                    json.forEach(data => {
                        this.reqDataEvent(data);
                    })
                    ;
                */
                }
            },
            params: [
                {
                    t: 'setMethod',
                    id: 2,
                    element: 'gt-event',
                    method: 'load',
                    name: 'x',
                    eparams: {
                        lastEventId: this.lastEventId,
                        unitId: this.unitId
                    },
                    iToken: "getData",
                }
            ],
        });
    }
    getDataEvent() {
        S.send3({
            async: true,
            panel: 2,
            valid: false,
            confirm_: 'seguro?',
            requestFunction: $.bind(this.reqDataEvent, this),
            params: [
                {
                    t: 'setMethod',
                    id: 2,
                    element: 'gt-event',
                    method: 'load',
                    name: 'x',
                    eparams: {
                        lastEventId: this.lastEventId
                    }
                }
            ]
        });
    }
    showStatusWin() {
        S.send3({
            async: true,
            panel: 2,
            valid: false,
            confirm_: 'seguro?',
            requestFunction: $.bind(this.reqStatusWin, this),
            params: [
                {
                    t: 'setMethod',
                    id: 2,
                    element: 'gt_unit',
                    method: 'status-units',
                    name: 'x',
                    eparams: {
                        lastDate: this.lastDate,
                        token: "yanny",
                        page: 2
                    }
                }
            ]
        });
        return;
        S.send3({
            "async": 1,
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
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
    play2() {
        if (this._timer3) {
            clearTimeout(this._timer3);
        }
        this._timer3 = setInterval(() => {
            this.goGetEvents();
            //this.getDataEvent();
        }, this.delay3);
        return;
        if (this._timer2) {
            clearTimeout(this._timer2);
        }
        this._timer2 = setInterval(() => {
            this.showStatusWin();
        }, this.delay2);
    }
    test2() {
        let f = this._form.getFormData();
        f.set("super", "man");
        console.log(f);
        for (let [name, value] of f) {
            // alert(name+": "+value);
        }
        //this._formCommand.text("ddd");
        S.send3({
            "async": 1,
            "form": f,
            //id:4,
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.formCommandId,
                    "element": "form",
                    "method": "request",
                    "name": "/forms/gt/form_command",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.formCommandId,
                        "unitId": 5555555,
                    }
                },
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": "his",
                    "element": "form",
                    "method": "list",
                    "name": "/form/h_commands",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": 'his',
                        "unitId": 5555555,
                    }
                },
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": "his2",
                    "element": "h-command",
                    "method": "request",
                    "name": "/form/h_commands",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": 'his2',
                        "unitId": 5555555,
                    }
                }
            ],
            onRequest: (x) => {
                // alert(x)
            }
        });
    }
    setUnit(unitId) {
        this.unitId = unitId;
    }
    init(unitId) {
        let f = this._form.getFormData();
        S.send3({
            "async": 1,
            "form": f,
            //id:4,
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    //"id":this.formCommandId,
                    "element": "gt-communication",
                    "method": "load-unit",
                    "name": "",
                    "eparams": {
                        "a": 'yanny',
                        //"mainId":this.formCommandId,
                        "unitId": unitId,
                    }
                },
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.mainPanelId,
                    "element": "form",
                    "method": "load",
                    "name": "/gt/forms/main_command",
                    "eparams": {
                        "mainId": this.mainPanelId,
                        "record": { unit_idx: unitId },
                    }
                },
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.commandPanelId,
                    "element": "form",
                    "method": "request",
                    "name": "/gt/forms/form_command",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.commandPanelId,
                        "unitId": 5555555,
                    }
                },
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "form",
                    "method": "list",
                    //"name":"/gt/forms/h_commands",
                    "name": "/gt/forms/pending",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": 5555555,
                    }
                }
            ],
            onRequest: (x) => {
                $(this.bodyPanelId).removeClass("sg-form");
                S.getElement(this.mainPanelId).setContext(this);
                S.getElement(this.commandPanelId).setContext(this);
                this._form = S.getElement(this.mainPanelId);
                // alert(x)
            }
        });
    }
    loadUnit(unitId) {
        let f = this._form.getFormData();
        let formData = this._form.getFormData();
        console.log(this.bodyPanelId);
        S.go({
            async: true,
            valid: false,
            form: formData,
            //blockingTarget: mapControl.getPanel(),
            blockingTarget: $(this.commandPanelId),
            requestFunctions: {
                "f": (json) => {
                    console.log(json);
                },
            },
            onRequest: (x) => {
                $(this.bodyPanelId).removeClass("sg-form");
                //S.getElement(this.mainPanelId).setContext(this);
                S.getElement(this.commandPanelId).setContext(this);
                //this._form = S.getElement(this.mainPanelId);
                // alert(x)
            },
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    //"id":this.formCommandId,
                    "element": "gt-communication",
                    "method": "load-unit",
                    "name": "",
                    "eparams": {
                        "a": 'yanny',
                        //"mainId":this.formCommandId,
                        "unitId": unitId,
                    }
                },
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.commandPanelId,
                    "element": "form",
                    "method": "request",
                    "name": "/gt/forms/form_command",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.commandPanelId,
                        "unitId": 5555555,
                    }
                },
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "form",
                    "method": "list",
                    //"name":"/gt/forms/h_commands",
                    "name": "/gt/forms/pending",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": 5555555,
                    }
                }
            ]
        });
        return;
        S.send3({
            "async": 1,
            "form": f,
            //id:4,
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    //"id":this.formCommandId,
                    "element": "gt-communication",
                    "method": "load-unit",
                    "name": "",
                    "eparams": {
                        "a": 'yanny',
                        //"mainId":this.formCommandId,
                        "unitId": unitId,
                    }
                },
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.commandPanelId,
                    "element": "form",
                    "method": "request",
                    "name": "/gt/forms/form_command",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.commandPanelId,
                        "unitId": 5555555,
                    }
                },
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "form",
                    "method": "list",
                    //"name":"/gt/forms/h_commands",
                    "name": "/gt/forms/pending",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": 5555555,
                    }
                }
            ],
            onRequest: (x) => {
                $(this.bodyPanelId).removeClass("sg-form");
                alert(this.commandPanelId);
                //S.getElement(this.mainPanelId).setContext(this);
                S.getElement(this.commandPanelId).setContext(this);
                //this._form = S.getElement(this.mainPanelId);
                // alert(x)
            }
        });
    }
    uTest() {
        alert("Comunication.ts");
    }
    setFormCommand(info) {
        this.menuPanel.text("");
        this.menuPanel.removeDs("sgForm");
        this.menuPanel.removeClass("sg-form");
        info.id = this.menuPanel;
        info.parentContext = this;
        this._formCommand = new Form(info);
    }
    paramLoad(commandId, request) {
        let unitId = this._form.getInput("unit_idx").getValue();
        let f = this._form.getFormData();
        let formData = this._form.getFormData();
        S.go({
            async: true,
            valid: false,
            form: formData,
            //blockingTarget: mapControl.getPanel(),
            blockingTarget: $(this.bodyPanelId),
            onRequest: (x) => {
                // alert(this.bodyPanelId)
                S.getElement(this.bodyPanelId).setContext(this);
            },
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "h-command",
                    "method": (request) ? "request" : "load",
                    "name": "/form/h_commands",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": unitId,
                        "commandId": commandId
                    }
                }
            ],
        });
        return;
        S.send3({
            "async": 1,
            "form": f,
            //id:4,
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "h-command",
                    "method": (request) ? "request" : "load",
                    "name": "/form/h_commands",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": unitId,
                        "commandId": commandId
                    }
                }
            ],
            onRequest: (x) => {
                //S.getElement(this.commandPanelId).setContext(this);
                S.getElement(this.bodyPanelId).setContext(this);
                // alert(x)
            }
        });
    }
    paramReadLoad(commandId) {
        if ((this.getTypeCommand() == "A" || this.getTypeCommand() == "R") && this.getQParams() > 0) {
            let unitId = this._form.getInput("unit_idx").getValue();
            let f = this._form.getFormData();
            S.send3({
                "async": 1,
                "form": f,
                //id:4,
                "params": [
                    {
                        "t": "setMethod",
                        'mode': 'element',
                        "id": this.bodyPanelId,
                        "element": "h-command",
                        "method": "read-params",
                        "name": "/form/h_commands",
                        "eparams": {
                            "a": 'yanny',
                            "mainId": this.bodyPanelId,
                            "unitId": unitId,
                            "commandId": commandId
                        }
                    }
                ],
                onRequest: (x) => {
                    //S.getElement(this.commandPanelId).setContext(this);
                    S.getElement(this.bodyPanelId).setContext(this);
                    // alert(x)
                }
            });
            return;
        }
        this.s('GET');
    }
    getConfigParam(commandId) {
        let unitId = this._form.getInput("unit_idx").getValue();
        let formData = this._form.getFormData();
        /* S.send3({
            "async": 1,
            "form": f,

            "params": [

                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "h-command",
                    "method": "load-config",
                    "name": "/form/h_commands",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": unitId,
                        "commandId": commandId
                    }

                }
            ],
            onRequest: (x) => {
                //S.getElement(this.commandPanelId).setContext(this);
                S.getElement(this.bodyPanelId).setContext(this);
                // alert(x)
            }
        });
 */
        S.go({
            async: true,
            valid: false,
            form: formData,
            blockingTarget: $(this.bodyPanelId),
            onRequest: (x) => {
                S.getElement(this.bodyPanelId).setContext(this);
                // alert(x)
            },
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "h-command",
                    "method": "load-config",
                    "name": "/form/h_commands",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": unitId,
                        "commandId": commandId
                    }
                }
            ]
        });
    }
    loadHistory() {
        let unitId = this._form.getInput("unit_idx").getValue();
        let formData = this._form.getFormData();
        S.go({
            async: true,
            valid: false,
            form: formData,
            blockingTarget: $(this.bodyPanelId),
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "form",
                    "method": "list",
                    "name": "/gt/forms/h_commands",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": 5555555,
                    }
                }
            ],
            onRequest: (x) => {
                //S.getElement(this.commandPanelId).setContext(this);
                S.getElement(this.bodyPanelId).setContext(this);
                // alert(x)
            }
        });
    }
    loadPending() {
        const unitId = this._form.getInput("unit_idx").getValue();
        const formData = this._form.getFormData();
        S.go({
            async: true,
            valid: false,
            form: formData,
            blockingTarget: $(this.bodyPanelId),
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "form",
                    "method": "list",
                    "name": "/gt/forms/pending",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": 5555555,
                    }
                }
            ],
            onRequest: (x) => {
                //S.getElement(this.commandPanelId).setContext(this);
                S.getElement(this.bodyPanelId).setContext(this);
                // alert(x)
            }
        });
    }
    loadCmdResponse() {
        let unitId = this._form.getInput("unit_idx").getValue();
        let f = this._form.getFormData();
        S.send3({
            "async": 1,
            "form": f,
            //id:4,
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "form",
                    "method": "list",
                    "name": "/gt/forms/unit_cmd_response",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": 5555555,
                    }
                }
            ],
            onRequest: (x) => {
                //S.getElement(this.commandPanelId).setContext(this);
                S.getElement(this.bodyPanelId).setContext(this);
                // alert(x)
            }
        });
    }
    getDetail() {
        //let inputs = this._formBody.getInputs();
        let inputs = S.getElement(this.bodyPanelId).getInputs(this);
        let str = "";
        let cmdValues = [];
        let _data = [];
        let n = 0;
        for (let i in inputs) {
            if (inputs[i].ds("cmd")) {
                _data.push({
                    "h_command_id": '',
                    "param_id": inputs[i].ds("cmd"),
                    "value": inputs[i].getValue(),
                    "__mode_": inputs["param_mode"].getValue(),
                    "__id_": n++
                });
            }
        }
        S.getElement(this.bodyPanelId).getInput('_detail').setValue(JSON.stringify(_data));
        //console.log(JSON.stringify(_data));
        //this._formCommand.getInput("d").setValue(JSON.stringify(_data));
    }
    getUnitId() {
        return this._form.getInput("unit_idx").getValue() * 1;
    }
    getCommandId() {
        return S.getElement(this.commandPanelId).getInput("command_idx").getValue() * 1;
    }
    getTypeCommand() {
        return S.getElement(this.bodyPanelId).getInput("type_command").getValue();
    }
    getQParams() {
        return S.getElement(this.bodyPanelId).getInput("q_params").getValue();
    }
    save(commandId) {
        this.getDetail();
        let unitId = this._form.getInput("unit_idx").getValue();
        let f = S.getElement(this.bodyPanelId).getFormData();
        S.send3({
            "async": 1,
            "form": f,
            //id:4,
            "params": [
                {
                    "t": "setMethod",
                    'mode': 'element',
                    "id": this.bodyPanelId,
                    "element": "h-command",
                    "method": "save",
                    "name": "/form/h_commands",
                    "eparams": {
                        "a": 'yanny',
                        "mainId": this.bodyPanelId,
                        "unitId": unitId,
                        "commandId": commandId
                    }
                }
            ],
            onRequest: (x) => {
                //S.getElement(this.commandPanelId).setContext(this);
                S.getElement(this.bodyPanelId).setContext(this);
                // alert(x)
            }
        });
    }
    connect() {
        this._ws.connect();
    }
    readCommand() {
    }
    setMode(mode) {
        this.main.removeClass(this.mode);
        this.main.addClass(mode);
        this.onSetMode(mode);
        this.mode = mode;
    }
    s(type = "SET") {
        let commandId = this.getCommandId();
        let unitId = this.getUnitId();
        let inputs = S.getElement(this.bodyPanelId).getInputs();
        let values = [];
        for (let i in inputs) {
            if (inputs[i].ds("cmd")) {
                values.push(inputs[i].getValue());
            }
        }
        let str1 = JSON.stringify({
            type: type,
            deviceId: 1,
            deviceName: "",
            commandId: commandId,
            unitId: unitId,
            cmdIndex: 0,
            comdValues: values,
            msg: "",
            name: "",
            level: 1,
            user: this.user,
            mode: 1,
            useTag: 0
        });
        this._ws.send(str1);
    }
    sendTo(pendingId) {
        let commandId = this.getCommandId();
        let unitId = this.getUnitId();
        let str1 = JSON.stringify({
            type: "rr",
            deviceId: 1,
            deviceName: "",
            commandId: commandId,
            unitId: unitId,
            comdValues: [],
            msg: "",
            name: "",
            level: 1,
            user: this.user,
            mode: 1,
            useTag: 0,
            id: pendingId * 1
        });
        this._ws.send(str1);
    }
    sendCommand1(unitId, type = "RC") {
        let commandId = 0;
        //let unitId = this.getUnitId();
        let values = [];
        let str = JSON.stringify({
            type: type,
            deviceId: 1,
            deviceName: "",
            commandId: commandId,
            unitId: unitId * 1,
            index: 0,
            comdValues: values,
            msg: "",
            name: "",
            level: 1,
            user: this.user,
            mode: 1,
            useTag: 0
        });
        this._ws.send(str);
    }
    sendCommand(query) {
        this._ws.send(JSON.stringify(query));
    }
    updateType(type, text) {
        this.menu.getByValue(type).getCaption().text(text);
    }
    createInfoWindow(type, info, window) {
        info.maxRecords = this.maxRecords;
        const typeGroup = [];
        const infoControl = this._infoControl[type] = new InfoComm(info);
        const winInfo = {
            name: type + "_name",
            visible: true,
            caption: "Ventana Inmediato 8",
            left: "right",
            top: 50,
            width: "330px",
            height: "120px",
            mode: "auto",
            className: ["sevian", "win-info-comm"],
            child: infoControl.get(),
            //deltaX:-50,
            resizable: true,
            draggable: true,
            closable: false
        };
        for (let x in window) {
            winInfo[x] = window[x];
        }
        this._win["info-" + type] = new Float.Window(winInfo);
    }
    getInfoWin(type) {
        if (this._infoControl[type]) {
            return this._infoControl[type];
        }
    }
    getWin(type) {
        if (this._win["info-" + type]) {
            return this._win["info-" + type];
        }
        return null;
    }
    showWin(type, value) {
        this.getWin(type).show({
            top: "bottom",
            left: "right",
            deltaX: -50 - 350,
            deltaY: -20
        });
    }
    addInfo(type, info) {
        if (this._infoControl[type]) {
            this._infoControl[type].add(info);
        }
    }
    readAll(windowId) {
        this.updateAllEventStatus({}, 1, windowId);
    }
    deleteAll(windowId) {
        this.updateAllEventStatus({}, 2, windowId);
    }
    getEventPanel() {
        return S.getElement(this.eventPanelId);
    }
    evalSound() {
        const alarms = this.getInfoWin(this.winNames.alarm).getCounts();
        if (alarms > 0) {
            this.sound.play(0);
            return;
        }
        const events = this.getInfoWin(this.winNames.event).getCounts();
        if (events > 0) {
            this.sound.play(1);
            return;
        }
        this.sound.pause();
    }
}
//# sourceMappingURL=Communication.js.map