var GTCommunication = (($) => {
    let n = 0;
    class Socket {
        constructor(info) {
            this.url = '127.0.0.1';
            this.port = '3310';
            this.socket = null;
            this.user = "juan";
            this.key = "";
            this.error = null;
            this.onopen = function (event) {
                let openMessage = JSON.stringify({
                    type: "connect",
                    clientName: this.user,
                    config: []
                });
                this.send(openMessage);
                db("Websockect Connected...!");
            };
            this.onclose = function (event) {
                db("Connection lost...!!!");
                // Try to reconnect in 5 seconds
                setTimeout(() => {
                    //db ("Connection lost...!!!");
                    this.connect();
                }, 5000);
            };
            this.onmessage = (event) => {
                var server_message = event.data;
                db(server_message);
                try {
                    let json = JSON.parse(server_message);
                    console.log(json);
                    //alert(json.message)
                    db(json.message);
                }
                catch (e) {
                    //alert(e)
                }
            };
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.socket = new WebSocket('ws://' + this.url + ':' + this.port);
            this.socket.onopen = $.bind(this.onopen, this);
            this.socket.onmessage = $.bind(this.onmessage, this); //this.onmessage;
            this.socket.onclose = $.bind(this.onclose, this); //this.onclose ;
            /*
            this.socket.onclose = () => {
                // Try to reconnect in 5 seconds
                setTimeout(() => {
                    this.connect();
                }, 5000);
            };
            */
        }
        connect() {
            try {
                if (this.socket && this.socket.readyState == 1) {
                    db("is still connected...");
                    return;
                }
                this.socket = new WebSocket('ws://' + this.url + ':' + this.port);
                this.socket.onopen = $.bind(this.onopen, this);
                this.socket.onmessage = $.bind(this.onmessage, this); //this.onmessage;
                this.socket.onclose = $.bind(this.onclose, this); //this.onclose ;
                /*this.socket.onclose = () => {
                    // Try to reconnect in 5 seconds
                    setTimeout(() => {
                        this.connect();
                    }, 5000);
                };*/
                //this.socket = new WebSocket('ws://' + this.url + ':' + this.port);
            }
            catch (e) {
                this.error = e;
            }
        }
        send(msg) {
            //console.log( this.socket);
            if (this.socket && this.socket.readyState == 1) {
                this.socket.send(msg);
                return;
            }
            alert("Connecting, wait !!!");
        }
        onmessage1(event) {
            alert(1.001);
            var server_message = event.data;
            db(server_message);
            try {
                let json = JSON.parse(server_message);
                console.log(json);
                //alert(json.message)
                db(json.message);
            }
            catch (e) {
                //alert(e)
            }
        }
    }
    class Communication {
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
            this.paramCommandId = "xxx1";
            this.paramCommand = null;
            this._formCommand = null;
            this.formCommandId = "formCommand";
            this._responseForm = null;
            this.responseForm = null;
            this._commandPanel = null;
            this.commandPanelId = "gtcomm-panel-1";
            this.mainPanelId = "gtcomm-panel-0";
            this._bodyPanel = null;
            this.bodyPanelId = "gtcomm-panel-2";
            this._ws = null;
            this.user = "";
            this.unitId = null;
            this._grid = null;
            this.callOnMessage = (messaje) => { };
            this._win = [];
            this._infoWin = null;
            this._infoWin2 = null;
            this.showConnectedUnit = true;
            this._timer2 = null;
            this.delay2 = 12000;
            this.statusId = null;
            this.connectionId = "button-connect";
            this._form = null;
            this.mode = "";
            this.onSetMode = (mode) => { return this.mode; };
            this._infoMenu = null;
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
            $(window).on("load", () => {
                // newMenus();
                this._ws = new Socket({
                    user: this.user,
                    url: this.socketServer.host,
                    port: this.socketServer.port,
                    onopen: (event) => {
                        let openMessage = JSON.stringify({
                            type: "connect",
                            clientName: this.user,
                            config: []
                        });
                        this._ws.send(openMessage);
                        this.setMode('connected');
                        //db ("Websockect Connected...!");
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
                        //console.log(server_message)
                        try {
                            let json = JSON.parse(server_message);
                            console.log(json);
                            //alert(json.message)
                            //db (json.message);
                            this.callOnMessage(json);
                            //this._grid.createRow(json);
                            //info.add({name:"L-V06", time:"8:00am", type:"C", message:"CONECTING"});
                            this._infoWin.add({
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
                            //db(server_message);
                        }
                        catch (e) {
                            //alert(e)
                        }
                    }
                });
                if (this.showConnectedUnit) {
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
            this.main = main;
            main.addClass(this.mainClass);
            main.text("");
            main.removeDs("sgForm");
            main.removeClass("sg-form");
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
            this._form = new Form2(this.mainForm);
            const _formDiv = $().create("form").id(this.gridId);
            this.responseForm.id = this.gridId;
            this.responseForm.type = "default";
            this.responseForm.parentContext = this;
            this._grid = new Grid2(this.responseForm);
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
            this._infoMenu = S.getElement(7);
            const typeGroup = {
                1: 2,
                2: 2,
                3: 2,
                4: 2,
                7: 2,
                8: 2,
                5: 1,
                6: 0
            };
            const _formDiv2 = $().create("form").id("aas");
            _formDiv2.create("div").id("div2");
            const infoMenu = new InfoMenu({
                menu: this._infoMenu,
                id: "div2"
            });
            this._infoWin2 = new InfoUnits({});
            this._infoWin = new InfoComm({
                onread: (info) => {
                    const counts = this._infoWin.getCounts();
                    const sums = [0, 0, 0];
                    for (let x in counts) {
                        sums[typeGroup[x]] += counts[x];
                    }
                    for (let x in sums) {
                        infoMenu.updateType(x, sums[x]);
                    }
                    //infoMenu.updateType(info.type, counts[info.type]);
                },
                onadd: (info) => {
                    const counts = this._infoWin.getCounts();
                    const sums = [0, 0, 0];
                    for (let x in counts) {
                        sums[typeGroup[x]] += counts[x];
                    }
                    for (let x in sums) {
                        //console.log (x+" "+sums[x])
                        infoMenu.updateType(x, sums[x]);
                    }
                    //infoMenu.updateType(info.type, counts[info.type]);
                }
            });
            _formDiv2.append(this._infoWin.get());
            let info = {
                user: "panda",
                date: "2021-02-05",
                delay: "0",
                message: "TEST"
            };
            this._infoWin.add({ info, name: "L-V06", time: "8:00am", type: 5, cType: "SYNC", message: "ALARM INPUTS" });
            this._infoWin.add({ info, name: "L-V08", time: "5:00am", type: 2, cType: "POS", message: "DISCONECTING" });
            this._infoWin.add({ info, name: "x-U06", time: "4:00am", type: 3, cType: "CNN", message: "SYNC" });
            this._infoWin.add({ info, name: "V-V99", time: "1:00am", type: 4, cType: "DIS", message: "10.2554, -65.4544" });
            this._infoWin.add({ info, name: "V-V100", time: "1:00am", type: 2, cType: "DIS", message: "DISCONECTING" });
            this._infoWin.add({ info, name: "V-V101", time: "1:00am", type: 2, cType: "DIS", message: "DISCONECTING" });
            this._infoWin.add({ info, name: "V-V101", time: "1:00am", type: 5, cType: "DIS", message: "ALARM VELCOCIDAD" });
            this._infoWin.add({ info, name: "V-V101", time: "1:00am", type: 6, cType: "DIS", message: "PUERTA ABIERTA" });
            this._infoWin.add({ info, name: "V-V101", time: "1:00am", type: 5, cType: "DIS", message: "ALARM ZONA CERO" });
            this._infoWin.add({ info, name: "V-V101", time: "1:00am", type: 5, cType: "DIS", message: "ALARM VIAJE NOCTURNO" });
            this._infoWin.add({ info, name: "V-V101", time: "1:00am", type: 6, cType: "DIS", message: "LUCES ENCENDIDAS" });
            this._infoWin.add({ info, name: "V-V106", time: "1:00am", type: 1, cType: "DIS", message: "CONECTING" });
            this._infoWin.add({ info, name: "V-V107", time: "1:00am", type: 2, cType: "DIS", message: "DISCONECTING" });
            this._infoWin.add({ info, name: "V-V101", time: "1:00am", type: 8, cType: "SEND", message: "SENDING" });
            this._win["main3"] = new Float.Window({
                visible: true,
                caption: "Ventana Inmediato",
                left: 1130,
                top: 540,
                width: "330px",
                height: "120px",
                mode: "auto",
                className: ["sevian"],
                child: _formDiv2.get(),
                resizable: true,
                draggable: true,
                closable: false
            });
            if (this.unitId) {
                this.loadUnit(this.unitId);
            }
            this.statusId = "yasta2";
            const _statusUnit = $().create("div").id(this.statusId).addClass("win-status-unit");
            this._win["status-unit"] = new Float.Window({
                visible: this.showConnectedUnit,
                caption: "Conected Units",
                left: 1130,
                top: 390,
                width: "330px",
                height: "120px",
                mode: "auto",
                className: ["sevian"],
                child: _statusUnit.get(),
                resizable: true,
                draggable: true,
                closable: false
            });
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
        requestFun(xhr) {
            let json = JSON.parse(xhr.responseText);
            this._infoWin2.reset();
            json.forEach(e => {
                this._infoWin2.add({
                    name: e.vehicle_name,
                    time: "8:00am",
                    type: 10,
                    device_name: e.device_name,
                    message: e.status
                });
            });
            console.log(json);
            const div = $(this.statusId);
            div.append(this._infoWin2.get());
        }
        showStatusWin() {
            S.send3({
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
                        method: 'status-units',
                        name: 'x',
                        eparams: {
                            record: { codpersona: 16386 },
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
            this._formCommand = new Form2(info);
        }
        paramLoad(commandId, request) {
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
        }
        loadHistory() {
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
        sendCommand(unitId, type = "RC") {
            let commandId = 0;
            //let unitId = this.getUnitId();
            let values = [];
            let str = JSON.stringify({
                type: type,
                deviceId: 1,
                deviceName: "",
                commandId: commandId,
                unitId: unitId * 1,
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
        updateType(type, text) {
            this.menu.getByValue(type).getCaption().text(text);
        }
    }
    return Communication;
})(_sgQuery);
//# sourceMappingURL=Communication.js.map