var ControlDevice = (($) => {
    class GTSocket {
        constructor(info) {
            this.url = null;
            this.socket = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.url = "ws://127.0.0.1:3310"; //= new WebSocket();
        }
        connect() {
            this.socket = new WebSocket(this.url);
            this.socket.onopen = this.onopen;
            this.socket.onmessage = this.onmessage;
        }
        disconnect() {
        }
        send(msg) {
            this.socket.send(msg);
        }
        onopen(event) {
            db("on OPEN");
        }
        onmessage(event) {
            var server_message = event.data;
            db(server_message);
        }
    }
    class ControlDevice {
        constructor(info) {
            this.panel = null;
            this.id = null;
            this.cmdData = null;
            this.clientData = null;
            this.paramForm = null;
            this.accountData = null;
            this.deviceData = null;
            this.socket = null;
            this.form = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.socket = new GTSocket({});
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtControlDevice")) {
                    return;
                }
                if (main.hasClass("gt-control-device")) {
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
        _create(main) {
            main.addClass("gt-control-device");
            //let bar = main.create("div");
            let f = new Form({
                caption: "hello",
                target: main,
                fields: [
                    {
                        input: "list",
                        config: {
                            type: "text",
                            name: "client_id",
                            caption: "Cliente",
                            data: this.clientData,
                            childs: true,
                            value: 86
                        }
                    },
                    {
                        input: "list",
                        config: {
                            type: "text",
                            name: "count_id",
                            caption: "Cuenta",
                            data: this.accountData,
                            parent: "client_id",
                            childs: true,
                            parentValue: 86,
                            value: 103,
                            propertys: {}
                        }
                    },
                    {
                        input: "list",
                        config: {
                            type: "text",
                            name: "device_id",
                            caption: "Device",
                            parent: "count_id",
                            parentValue: '103',
                            value: 2109,
                            data: this.deviceData
                        }
                    },
                ]
            });
            let d = $().create("input").attr("type", "button").val("connect");
            d.on("click", (event) => {
                this.socket.connect();
            });
            f.add(d);
            //let bar2 = main.create("div");
            let tab = new Tab({
                target: main,
                pages: [
                    {
                        caption: "Parámetros",
                    },
                    {
                        caption: "Funciones"
                    },
                    {
                        caption: "Eventos", html: "Opps",
                    },
                    {
                        caption: "Identificación", html: "Cuatro"
                    },
                ]
            });
            let page = this._page0 = tab.getPage(0);
            page.id(this.id + "_tpage_0").addClass("gt-control-p1");
            //let bar3 = page.create("div");
            let items = [];
            let act = {
                async: true,
                panel: this.panel,
                params: [{
                        t: "setMethod",
                        id: this.panel,
                        element: 'gtControlDevice',
                        method: "load_cmd",
                        eparams: {
                            cmd: "",
                            cmdId: ""
                        }
                    }]
            };
            for (let x in this.cmdData) {
                items.push({
                    caption: this.cmdData[x][1],
                    action_: "db('" + this.cmdData[x][1] + "')",
                    action: () => {
                        act.params[0].eparams.cmd = this.cmdData[x][1];
                        act.params[0].eparams.cmdId = this.cmdData[x][0];
                        S.send(act);
                    }
                });
            }
            let menu = new Menu({ caption: "", target: page, items: items });
            // page = tab.getPage(0);
            this.paramForm.target = page;
            this.paramForm.id = this.id + "_form_1";
            let f2 = new Form(this.paramForm);
            /*
            this.nav = [
                ["uno"], ["dos"]
            ]
            items = [];
            for(let x in this.nav){
                items.push({
                    caption: this.nav[x][0],
                    
                    action: () => {
                        //act.params[0].eparams.cmd = this.nav[x][1];
                        
                        //S.send(act);
                    }
                })
            }


            let menu2 = new Menu({caption:"", target:page, items: items});
            */
        }
        _load(main) { }
        loadCmdForm(f) {
            $(this.id + "_form_1").get().parentNode.removeChild($(this.id + "_form_1").get());
            //this._page0
            //$(this.id+"_form_1").text("");
            f.target = this._page0;
            f.id = this.id + "_form_1";
            f.parentContext = this;
            let f2 = new Form(f);
            this.form = f2;
        }
        sendCMD() {
            let value = this.form.getInput("param_tag").getValue();
            this.socket.send(value);
        }
    }
    return ControlDevice;
})(_sgQuery);
