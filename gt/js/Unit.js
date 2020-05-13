var GTUnit = (($) => {
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
            this.winCaption = "";
            this.main = null;
            this.marks = [];
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
        _create(main) {
            this.main = main;
            main.addClass("unit-main");
            this.createMenu();
            this.win = new Float.Window({
                visible: true,
                caption: "Unidades",
                child: main,
                left: 10,
                top: 40,
                width: "300px",
                height: "300px",
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
                    popupInfo: "popup hola"
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
    }
    return Unit;
})(_sgQuery);
