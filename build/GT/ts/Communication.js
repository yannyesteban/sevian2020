var GTCommunication = (($) => {
    let n = 0;
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
            this.historyPanel = null;
            this.paramCommandId = "xxx1";
            this.paramCommand = null;
            this._formCommand = null;
            this.formCommandId = "formCommand";
            this._commandPanel = null;
            this.commandPanelId = "gtcomm-panel-1";
            this._bodyPanel = null;
            this.bodyPanelId = "gtcomm-panel-2";
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
        }
        _create(main) {
            this.main = main;
            main.addClass(this.mainClass);
            main.text("");
            main.removeDs("sgForm");
            main.removeClass("sg-form");
            this.mainPanel = main.create("div").addClass("mainPanel");
            this._commandPanel = main.create("div").addClass("command-panel").id(this.commandPanelId);
            this._bodyPanel = main.create("div").addClass("body-panel").id(this.bodyPanelId);
            this._formCommand = main.create("div").addClass("formCommand").id(this.formCommandId);
            this.historyPanel = main.create("div").addClass("historyPanel").id("his");
            //this.paramCommandId = "xxx1";
            this.paramCommand = main.create("div").addClass("paramCommand").id(this.paramCommandId);
            this.mainForm.id = this.mainPanel;
            this.mainForm.parentContext = this;
            this.form = new Form2(this.mainForm);
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
                        "name": "/forms/gt/form_command",
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
                        "name": "/forms/gt/h_commands",
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
        paramLoad(commandId) {
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
                        "method": "request",
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
                        "name": "/forms/gt/h_commands",
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
                        "h_command_id": 410,
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
    }
    return Communication;
})(_sgQuery);
//# sourceMappingURL=Communication.js.map