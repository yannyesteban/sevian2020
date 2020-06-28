var GTWebcar = (($) => {
    class Webcar {
        constructor(info) {
            this.id = null;
            this.map = null;
            this.unit = null;
            this.dataClients = null;
            this.dataAccounts = null;
            this.dataUnits = null;
            this.tracking = null;
            this.menu = null;
            this.win = null;
            this.caption = "";
            this.winCaption = "";
            this.pathImages = "";
            this.followMe = false;
            this.delay = 30000;
            this.main = null;
            this.marks = [];
            this._info = null;
            this._winInfo = null;
            this._timer = null;
            this._lastUnitId = null;
            this._traces = [];
            this._unit = null;
            this._win = [];
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
            GTMap.load((map, s) => {
                this._unit.setMap(map);
            });
        }
        static getInstance(name) {
            return Unit._instances[name];
        }
        _create(main) {
            this.main = main;
            main.addClass("unit-main");
            this._win["unit"] = this.win = new Float.Window({
                visible: true,
                caption: this.unit.caption,
                //child:main,
                left: 10,
                top: 100,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"]
            });
            this.unit.id = this.win.getBody();
            this.loadUnit(this.unit);
            this._win["info"] = new Float.Window({
                visible: true,
                caption: "Info",
                child: this._unit.getInfoLayer(),
                left: 10,
                top: 310,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"]
            });
            let menu = new Menu({
                caption: "uuuu",
                autoClose: false,
                target: main,
                "className": ["sevian", "horizontal"],
                items: [
                    {
                        id: 1,
                        caption: "U",
                        action: (item, event) => {
                            this.win.show();
                        }
                    },
                    {
                        id: 1,
                        caption: "I",
                        action: (item, event) => {
                            this._win["info"].show();
                        }
                    },
                    {
                        id: 1,
                        caption: "S",
                        action: (item, event) => {
                        }
                    },
                    {
                        id: 3,
                        caption: "G",
                        action: (item, event) => {
                        }
                    },
                    {
                        id: 4,
                        caption: "A",
                        action: (item, event) => {
                        }
                    },
                    {
                        id: 5,
                        caption: "H",
                        action: (item, event) => {
                        }
                    },
                    {
                        id: 6,
                        caption: "E",
                        action: (item, event) => {
                        }
                    },
                    {
                        id: 7,
                        caption: "R",
                        action: (item, event) => {
                            db("rules");
                            this.rule = this._unit.getMap().addRule('xxx', {
                                name: "x"
                            });
                            this.rule.play();
                        }
                    },
                    {
                        id: 8,
                        caption: "L",
                        action: (item, event) => {
                        }
                    },
                    {
                        id: 9,
                        caption: "O",
                        action: (item, event) => {
                        }
                    }
                ]
            });
        }
        loadUnit(unit) {
            this._unit = new GTUnit(unit);
        }
        _load(main) {
        }
        init() {
        }
        load() {
        }
    }
    Webcar._instances = [];
    return Webcar;
})(_sgQuery);
