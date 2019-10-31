var ControlDevice = (($) => {
    class ControlDevice {
        constructor(info) {
            this.id = null;
            this.cmdData = null;
            this.clientData = null;
            this.paramForm = null;
            this.accountData = null;
            this.deviceData = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
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
                        input: "input",
                        config: {
                            type: "select",
                            name: "client_id",
                            caption: "Cliente",
                            data: this.clientData,
                            childs: true
                        }
                    },
                    {
                        input: "input",
                        config: {
                            type: "select",
                            name: "count_id",
                            caption: "Cuenta",
                            data: this.accountData,
                            parent: "client_id",
                            childs: true
                        }
                    },
                    {
                        input: "input",
                        config: {
                            type: "select",
                            name: "device_id",
                            caption: "Device",
                            parent: "count_id",
                            data: this.deviceData
                        }
                    }
                ]
            });
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
            let page = tab.getPage(0);
            page.addClass("gt-control-p1");
            //let bar3 = page.create("div");
            let items = [];
            for (let x in this.cmdData) {
                items.push({
                    caption: this.cmdData[x][1],
                    action: "db('" + this.cmdData[x][1] + "')"
                });
            }
            let menu = new Menu({ caption: "", target: page, items: items });
            // page = tab.getPage(0);
            this.paramForm.target = page;
            let f2 = new Form(this.paramForm);
        }
        _load(main) { }
    }
    return ControlDevice;
})(_sgQuery);
