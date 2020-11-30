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
            this.onmessage = (event) => {
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
        onclose(event) {
            db("Connection lost...!!!");
            // Try to reconnect in 5 seconds
            setTimeout(() => {
                //db ("Connection lost...!!!");
                this.connect();
            }, 5000);
        }
        send(msg) {
            //console.log( this.socket);
            if (this.socket && this.socket.readyState == 1) {
                this.socket.send(msg);
                return;
            }
            alert("Connecting, wait !!!");
        }
        onopen(event) {
            let openMessage = JSON.stringify({
                type: "connect",
                clientName: this.user,
                config: []
            });
            this.send(openMessage);
            db("Websockect Connected...!");
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
            this._bodyPanel = null;
            this.bodyPanelId = "gtcomm-panel-2";
            this._ws = null;
            this.user = "";
            this.unitId = null;
            this._grid = null;
            this.callOnMessage = (messaje) => { };
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
            this._ws = new Socket({
                user: this.user,
                url: this.socketServer.host,
                port: this.socketServer.port,
                onmessage: (event) => {
                    const server_message = event.data;
                    console.log(server_message);
                    try {
                        let json = JSON.parse(server_message);
                        //console.log(json);
                        //alert(json.message)
                        db(json.message);
                        this.callOnMessage(json);
                        this._grid.createRow(json);
                    }
                    catch (e) {
                        //alert(e)
                    }
                }
            });
        }
        _create(main) {
            this.main = main;
            main.addClass(this.mainClass);
            main.text("");
            main.removeDs("sgForm");
            main.removeClass("sg-form");
            this.mainPanel = main.create("div").addClass("mainPanel");
            this._aux = main.create("div").addClass("command-panel").id("aux3");
            this._commandPanel = main.create("div").addClass("command-panel").id(this.commandPanelId);
            this._bodyPanel = main.create("div").addClass("body-panel").id(this.bodyPanelId);
            this._formCommand = main.create("div").addClass("formCommand").id(this.formCommandId);
            this.historyPanel = main.create("div").addClass("historyPanel").id("his");
            //this.paramCommandId = "xxx1";
            this.paramCommand = main.create("div").addClass("paramCommand").id(this.paramCommandId);
            this.mainForm.id = this.mainPanel;
            this.mainForm.parentContext = this;
            this.form = new Form2(this.mainForm);
            this.responseForm.id = this.gridId;
            this.responseForm.type = "default";
            this.responseForm.parentContext = this;
            this._grid = new Grid2(this.responseForm);
            if (this.unitId) {
                this.loadUnit(this.unitId);
            }
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
        test2() {
            let f = this.form.getFormData();
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
        loadUnit(unitId) {
            let f = this.form.getFormData();
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
                        "name": "/gt/forms/h_commands",
                        "eparams": {
                            "a": 'yanny',
                            "mainId": this.bodyPanelId,
                            "unitId": 5555555,
                        }
                    }
                ],
                onRequest: (x) => {
                    S.getElement(this.commandPanelId).setContext(this);
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
            let unitId = this.form.getInput("unit_idx").getValue();
            let f = this.form.getFormData();
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
                let unitId = this.form.getInput("unit_idx").getValue();
                let f = this.form.getFormData();
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
            let unitId = this.form.getInput("unit_idx").getValue();
            let f = this.form.getFormData();
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
            let unitId = this.form.getInput("unit_idx").getValue();
            let f = this.form.getFormData();
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
        loadCmdResponse() {
            let unitId = this.form.getInput("unit_idx").getValue();
            let f = this.form.getFormData();
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
            return this.form.getInput("unit_idx").getValue() * 1;
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
            let unitId = this.form.getInput("unit_idx").getValue();
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
    }
    return Communication;
})(_sgQuery);
//# sourceMappingURL=Communication.js.map