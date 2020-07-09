var GTWebcar = (($) => {
    let color = null;
    class TraceMarker {
        constructor(map, size) {
            this.map = null;
            this.width = 10;
            this.height = 10;
            this.size = 200;
            this.data = null;
            this.context = null;
            this.map = map;
            this.size = size;
            this.width = size;
            this.height = size;
            this.data = new Uint8Array(this.width * this.height * 4);
        }
        onAdd() {
            let canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d');
        }
        render() {
            let context = this.context;
            context.beginPath();
            context.moveTo(this.size / 2, 0);
            context.lineTo(this.size, this.size);
            context.lineTo(this.size / 2, this.size * 0.8);
            context.lineTo(0, this.size);
            context.lineTo(this.size / 2, 0);
            //context.fill();
            context.strokeStyle = 'yello3';
            context.lineWidth = 2;
            context.fillStyle = "#aabb1105";
            context.fill();
            context.stroke();
            this.data = context.getImageData(0, 0, this.width, this.height).data;
            // continuously repaint the map, resulting in the smooth animation of the dot
            this.map.triggerRepaint();
            // return `true` to let the map know that the image was updated
            return true;
            let duration = 1000;
            let t = (performance.now() % duration) / duration;
            let radius = (this.size / 2) * 0.3;
            let outerRadius = (this.size / 2) * 0.7 * t + radius;
            //let context = this.context;
            // draw outer circle
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
            //context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
            context.fillStyle = 'rgba(255, 165, 62,' + (1 - t) + ')';
            context.fill();
            // draw inner circle
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
            //context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.fillStyle = 'rgba(255, 165, 62, 1)';
            //242, 255, 62
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();
            // update this image's data with data from the canvas
            this.data = context.getImageData(0, 0, this.width, this.height).data;
            // continuously repaint the map, resulting in the smooth animation of the dot
            this.map.triggerRepaint();
            // return `true` to let the map know that the image was updated
            return true;
        }
    }
    class Webcar {
        constructor(info) {
            this.id = null;
            this.map = null;
            this.unit = null;
            this.site = null;
            this.geofence = null;
            this.history = null;
            this.alarm = null;
            this.event = null;
            this.search = null;
            this.config = null;
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
            this._site = null;
            this._geofence = null;
            this._history = null;
            this._alarm = null;
            this._search = null;
            this._event = null;
            this._config = null;
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
                this._site.setMap(map);
                this._geofence.setMap(map);
                this._history.setMap(map);
                map.map.addImage('t1', new TraceMarker(map.map, 30), { pixelRatio: 1 });
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
            this._win["geofence"] = new Float.Window({
                visible: false,
                caption: this.geofence.caption,
                //child:main,
                left: 300,
                top: 100,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"]
            });
            this.unit.id = this.win.getBody();
            this.unit.oninfo = (info, name) => {
                this._win.info.getBody().text(info);
                this._win.info.setCaption(name);
            };
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
            this.loadSite(this.site);
            this.loadAlarm(this.alarm);
            this.loadConfig(this.config);
            this.geofence.id = this._win["geofence"].getBody();
            this.geofence.oninfo = (info, name) => {
                this._win.info.getBody().text(info);
                this._win.info.setCaption(name);
            };
            this.loadGeofence(this.geofence);
            this.loadHistory(this.history);
            let menu = new Menu({
                caption: "uuuu",
                autoClose: true,
                target: main,
                type: "popup",
                subType: "dropdown",
                "className": ["sevian", "horizontal"],
                items: [
                    {
                        id: 0,
                        caption: "+",
                        items: [
                            { caption: 'Sitio',
                                action: (item, event) => {
                                    this._win["form_site"].show();
                                } },
                            { caption: 'Alarma',
                                action: (item, event) => {
                                    this._win["form_alarm"].show();
                                } },
                            { caption: 'Geocerca',
                                action: (item, event) => {
                                    this._win["form_geofence"].show();
                                } },
                            { caption: 'Eventos',
                                action: (item, event) => {
                                    this._win["form_event"].show();
                                } },
                            { caption: 'Opciones',
                                action: (item, event) => {
                                    this._win["config"].show();
                                } },
                            { caption: 'Search',
                                action: (item, event) => {
                                    this._win["form_search"].show();
                                } },
                        ]
                    },
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
                            this._win["site"].show();
                        }
                    },
                    {
                        id: 3,
                        caption: "G",
                        action: (item, event) => {
                            this._win["geofence"].show();
                        }
                    },
                    {
                        id: 4,
                        caption: "A",
                        action: (item, event) => {
                            this._win["alarm"].show();
                        }
                    },
                    {
                        id: 5,
                        caption: "H",
                        action: (item, event) => {
                            this._win["history"].show();
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
                            color = 'green';
                        }
                    },
                    {
                        id: 9,
                        caption: "O",
                        action: (item, event) => {
                            db("circulo", "white");
                            this.rule = this._unit.getMap().addCircle('xxx', {
                                name: "x"
                            });
                            this.rule.play();
                        }
                    },
                    {
                        id: 9,
                        caption: "rs",
                        action: (item, event) => {
                            db("circulo", "white");
                            this.rule = this._unit.getMap().addCircle('xxx', {
                                name: "x"
                            });
                            this.rule.reset();
                        }
                    },
                    {
                        id: 9,
                        caption: "T",
                        action: (item, event) => {
                            this.rule.test();
                        }
                    },
                    {
                        id: 9,
                        caption: "S2",
                        action: (item, event) => {
                            this.rule.stop();
                        }
                    },
                    {
                        id: 9,
                        caption: "Pl",
                        action: (item, event) => {
                            this.rule.play();
                        }
                    },
                    {
                        id: 9,
                        caption: "color",
                        action: (item, event) => {
                            this.rule.setLine({
                                width: 2,
                                color: "yellow"
                            });
                            this.rule.setFill({
                                opacity: 0.9,
                                color: "orange"
                            });
                        }
                    },
                    {
                        id: 9,
                        caption: "New",
                        action: (item, event) => {
                            db("circulo", "white");
                            this.rule = this._unit.getMap().draw('t', 'circle', {
                                name: "x"
                            });
                            this.rule.play();
                        }
                    },
                    {
                        id: 9,
                        caption: "stop 2",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t');
                            poly.stop();
                        }
                    },
                    {
                        id: 9,
                        caption: "play 2",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t');
                            poly.play();
                        }
                    },
                    {
                        id: 9,
                        caption: "create",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                coordinates: [-66.79008000, 10.49680600],
                                image: "http://localhost/sevian2020/images/vehicle_004.png",
                                popupInfo: "HOLA MUNDO",
                                rotation: 100,
                                ondrag: (e) => {
                                    //db (e,"white","red")
                                }
                            });
                            //poly.play();
                        }
                    },
                    {
                        id: 9,
                        caption: "play 3",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.play();
                        }
                    },
                    {
                        id: 9,
                        caption: "stop 3",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.stop();
                        }
                    },
                    {
                        id: 9,
                        caption: "hide",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.setVisible(false);
                        }
                    },
                    {
                        id: 9,
                        caption: "show",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.setVisible(true);
                        }
                    },
                    {
                        id: 9,
                        caption: "reset",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.reset();
                        }
                    },
                    {
                        id: 9,
                        caption: "Flt",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.flyTo();
                        }
                    },
                    {
                        id: 9,
                        caption: "Pan",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.panTo();
                        }
                    },
                    {
                        id: 9,
                        caption: "X",
                        action: (item, event) => {
                            this._unit.getMap().delete('t');
                        }
                    },
                    {
                        id: 9,
                        caption: "RT",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.setRotation(45);
                        }
                    },
                    {
                        id: 9,
                        caption: "Save",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.save();
                        }
                    },
                    {
                        id: 9,
                        caption: "Icon",
                        action: (item, event) => {
                            let poly = this._unit.getMap().draw('t', 'mark', {
                                center: { lng: -66.79008000, lat: 10.49680600 },
                                radio: 6
                            });
                            poly.setImage("http://localhost/sevian2020/images/vehicle_006.png");
                        }
                    }
                ]
            });
        }
        loadUnit(unit) {
            this._unit = new GTUnit(unit);
        }
        loadSite(info) {
            this._win["site"] = new Float.Window({
                visible: false,
                caption: info.caption,
                //child:main,
                left: 300,
                top: 100,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"],
            });
            info.id = this._win["site"].getBody();
            this.site.oninfo = (info, name) => {
                this._win.info.getBody().text(info);
                this._win.info.setCaption(name);
            };
            this._site = new GTSite(info);
            this._win["form_site"] = new Float.Window({
                visible: true,
                caption: info.caption,
                //child:main,
                left: 300,
                top: 100,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"],
            });
            info.form.target = this._win["form_site"].getBody();
            let form = new Form2(info.form);
        }
        loadAlarm(info) {
            this._win["alarm"] = new Float.Window({
                visible: false,
                caption: info.caption,
                //child:main,
                left: 300,
                top: 100,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"],
            });
            info.id = this._win["alarm"].getBody();
            this.site.oninfo = (info, name) => {
                this._win.info.getBody().text(info);
                this._win.info.setCaption(name);
            };
            this._alarm = new GTAlarm(info);
            this._win["form_alarm"] = new Float.Window({
                visible: true,
                caption: info.caption,
                //child:main,
                left: 300,
                top: 100,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"],
            });
            info.form.target = this._win["form_alarm"].getBody();
            let form = new Form2(info.form);
        }
        loadGeofence(info) {
            this._geofence = new GTGeofence(info);
            this._win["form_geofence"] = new Float.Window({
                visible: true,
                caption: info.caption,
                //child:main,
                left: 300,
                top: 100,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"],
            });
            info.form.target = this._win["form_geofence"].getBody();
            let form = new Form2(info.form);
        }
        loadHistory(info) {
            this._win["history"] = new Float.Window({
                visible: false,
                caption: info.caption,
                //child:main,
                left: 300,
                top: 100,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"],
            });
            info.id = this._win["history"].getBody();
            this.site.oninfo = (info, name) => {
                this._win.info.getBody().text(info);
                this._win.info.setCaption(name);
            };
            this._history = new GTHistory(info);
        }
        loadConfig(info) {
            this._win["config"] = new Float.Window({
                visible: false,
                caption: info.caption,
                //child:main,
                left: 300,
                top: 100,
                width: "300px",
                height: "200px",
                mode: "auto",
                className: ["sevian"],
            });
            info.id = this._win["config"].getBody();
            info.oninfo = (info, name) => {
                this._win.info.getBody().text(info);
                this._win.info.setCaption(name);
            };
            this._config = new GTConfig(info);
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
