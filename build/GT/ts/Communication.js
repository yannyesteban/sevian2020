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
            this.menuPanel = main.create("div").addClass("menuPanel");
            this.historyPanel = main.create("div").addClass("historyPanel");
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
            S.send3({
                "async": true,
                //"form":f,
                id: 4,
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
                            "unitId": 5555555,
                        }
                    }
                ],
                onRequest: (x) => {
                    alert(x);
                }
            });
        }
        setFormCommand(info) {
            this.menuPanel.text("");
            this.menuPanel.removeDs("sgForm");
            this.menuPanel.removeClass("sg-form");
            info.id = this.menuPanel;
            info.parentContext = this;
            this._formCommand = new Form2(info);
        }
    }
    return Communication;
})(_sgQuery);
//# sourceMappingURL=Communication.js.map