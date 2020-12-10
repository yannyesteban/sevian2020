var GTSite = (($) => {
    let n = 0;
    class Site {
        /*
        static getInstance(name){
            return Unit._instances[name];
        }
        */
        constructor(info) {
            this.id = null;
            this.map = null;
            this.mode = 0;
            this.tempPoly = null;
            //formId:any = null;
            this.images = [];
            this.dataCategory = null;
            this.dataAccounts = null;
            this.dataSite = null;
            this.tracking = null;
            this.menu = null;
            this.win = null;
            this.form = null;
            this.caption = "u";
            this.winCaption = "";
            this.pathImages = "";
            this.followMe = false;
            this.tag = "Yanny Esteban";
            this.infoTemplate = `
                <div class="units-info">
                <div>Placa</div><div>{=plate}</div>
                <div>Marca</div><div>{=brand}</div>
                <div>Modelo</div><div>{=model}</div>
                <div>Color</div><div>{=color}</div>

                <div>Hora</div><div>{=date_time}</div>
                <div>Longitud</div><div>{=longitude}</div>
                <div>Latidud</div><div>{=latitude}</div>
                <div>Velocidad</div><div>{=speed}</div>

                <div>Heading</div><div>{=heading}</div>
                <div>Satellite</div><div>{=satellite}</div>
                <div>Inputs</div><div>{=speed}</div>
                <div>Outputs</div><div>{=speed}</div>




            
            </div>`;
            this.popupTemplate = `<div class="wecar_info">
			<div>{=name}</div>
			<div>{=device_name}</div>
			<div>{=brand}: {=model}<br>{=plate}, {=color} </div>
		
			<div>{=latitude}, {=longitude}</div>
		
			<div>Dirección: {=speed}</div>
		
		</div>`;
            this.oninfo = (info, name) => { };
            this.delay = 30000;
            this.onSave = info => { };
            this.onEdit = info => { };
            this.main = null;
            this.marks = [];
            this._info = null;
            this._winInfo = null;
            this._timer = null;
            this._lastUnitId = null;
            this._traces = [];
            this.editId = null;
            this.lastId = null;
            this._form = null;
            this.infoId = null;
            this.formId = null;
            this._win = [];
            this._isplay = false;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            //return;
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtSite")) {
                    return;
                }
                if (main.hasClass("gt-site")) {
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
                this.setMap(map);
                //this.play();
                //map.map.addImage('t1', new TraceMarker(map.map, 30), { pixelRatio: 1 });
                //map.getControl("mark").onsave = ((info)=>{}
            });
        }
        _create(main) {
            this.main = main;
            main.addClass("site-main");
            this.menu = this.createMenu();
            this._win["menu-site"] = new Float.Window({
                visible: false,
                caption: this.caption,
                left: 10,
                top: 100,
                width: "280px",
                height: "250px",
                mode: "auto",
                className: ["sevian"],
                child: this.main.get(),
            });
            const _formDiv = $().create("form").id(this.formId);
            this._win["form-site"] = new Float.Window({
                visible: false,
                caption: this.caption,
                left: 10 + 280 + 10,
                top: 100,
                width: "280px",
                height: "250px",
                mode: "auto",
                className: ["sevian"],
                child: _formDiv.get(),
                onhide: (info) => {
                    this.stop();
                },
            });
            //this.createForm(this.form);
            this._info = $().create("div").addClass("win-sites-info");
            if (this.infoId) {
                this.oninfo = (info, name) => {
                    S.getElement(this.infoId).setCaption(name);
                    S.getElement(this.infoId).setText(info);
                };
            }
            return;
            const xx = $().create("form").id("yan124");
            xx.text("Hoooooooola");
            const win = new Float.Window({
                visible: true,
                caption: "Site IIs",
                child: xx,
                left: 300,
                top: 100,
                width: "400px",
                height: "500px",
                mode: "auto",
                className: ["sevian"],
            });
            this.loadSite2();
        }
        showMenu() {
            this._win["menu-site"].show();
        }
        showForm() {
            this._win["form-site"].show();
        }
        newSite(info) {
            //let unitId = this.form.getInput("unit_idx").getValue();
            //let f  = this.form.getFormData();
            this.editId = null;
            S.send3({
                "async": 1,
                //"form":f,
                //id:4,
                "params": [
                    {
                        "t": "setMethod",
                        'mode': 'element',
                        "id": this.formId,
                        "element": "form",
                        "method": "request",
                        "name": "/form/site2",
                        "eparams": { "mainId": this.formId }
                    }
                ],
                onRequest: (x) => {
                    //S.getElement(this.commandPanelId).setContext(this);
                    S.getElement(this.formId).setContext(this);
                    this._form = S.getElement(this.formId);
                    this.loadForm(info);
                    this.showForm();
                }
            });
        }
        loadSite2() {
            //let unitId = this.form.getInput("unit_idx").getValue();
            //let f  = this.form.getFormData();
            const nameId = "yan124";
            S.send3({
                "async": 1,
                //"form":f,
                //id:4,
                "params": [
                    {
                        "t": "setMethod",
                        'mode': 'element',
                        "id": nameId,
                        "element": "form",
                        "method": "request",
                        "name": "/form/site2",
                        "eparams": {
                            "a": 'yanny',
                            "mainId": nameId,
                            "unitId": 5555555,
                        }
                    }
                ],
                onRequest: (x) => {
                    //S.getElement(this.commandPanelId).setContext(this);
                    S.getElement(nameId).setContext(this);
                }
            });
        }
        loadSite3(id) {
            //let unitId = this.form.getInput("unit_idx").getValue();
            //let f  = this.form.getFormData();
            S.send3({
                "async": 1,
                //"form":f,
                //id:4,
                "params": [
                    {
                        "t": "setMethod",
                        'mode': 'element',
                        "id": this.formId,
                        "element": "form",
                        "method": "load",
                        "name": "/form/site2",
                        "eparams": {
                            //"a":'yanny',
                            "mainId": this.formId,
                            //"unitId":5555555,
                            'record': { 'id': id }
                        }
                    }
                ],
                onRequest: (x) => {
                    //S.getElement(this.commandPanelId).setContext(this);
                    S.getElement(this.formId).setContext(this);
                    this._form = S.getElement(this.formId);
                    this.play(id);
                }
            });
        }
        _load(main) {
        }
        init() {
        }
        load() {
        }
        getMap() {
            return this.map;
        }
        setMap(map) {
            map.getControl("mark").onchange = (info) => {
                this.loadForm(info);
            };
            map.getControl("mark").onsave = ((info) => {
                map.getControl("mark").stop();
                this.onSave(info);
                this.showForm();
            });
            map.getControl("mark").onnew = $.bind(this.newSite, this);
            this.map = map;
        }
        start() {
            if (this._isplay) {
                this.stop();
            }
            this._isplay = true;
            this.map.getControl("mark").play();
        }
        play(id) {
            this.editId = id;
            this.showForm();
            this.showSite(id, false);
            this.map.getControl("mark").play({
                defaultImage: this._form.getInput("image").value,
                defaultCoordinates: [
                    this._form.getInput("longitude").value * 1,
                    this._form.getInput("latitude").value * 1
                ],
                onstop: () => {
                    //this.showSite(id, true);
                    //this.editId = null;
                }
            });
            this._isplay = true;
        }
        stop() {
            if (this.editId) {
                this.marks[this.editId].setLngLat([this.dataSite[this.editId].longitude, this.dataSite[this.editId].latitude]);
                this.marks[this.editId].setImage(this.dataSite[this.editId].image);
                this.showSite(this.editId, true);
            }
            this.map.getControl("mark").stop();
            this._isplay = false;
        }
        updateSite(info) {
            this.dataSite[info.lastId] = info.dataSite[info.lastId];
            this.updateMark(info.lastId);
            this.map.getControl("mark").stop();
            this._isplay = false;
        }
        update(info) {
            this.getForm().setValue(info).setMode('update');
            this.getForm().getInput("__mode_").setValue(2);
            this.getForm().getInput("__id_").setValue(0);
            this.dataSite[info.id] = info;
            this.updateMark(info.id);
        }
        updateMark(id) {
            if (!this.menu.getByData("category-id", this.dataSite[id].category_id)) {
                this.menu.add({
                    id: this.dataSite[id].category_id,
                    caption: this.dataCategory.find(e => { return e.id == this.dataSite[id].category_id; }).category,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                    checkValue: id,
                    checkDs: { "level": "category", "categoryId": this.dataSite[id].category_id },
                    ds: { "categoryId": this.dataSite[id].category_id },
                    check: (item, event) => {
                        //this.showAccountUnits(this.dataClients[x].id, event.currentTarget.checked);
                    },
                });
            }
            if (this.marks[id]) {
                let m = this.menu.getByData("category-id", this.dataSite[id].category_id);
                let item = this.menu.getByValue(id);
                if (!m.getMain().contains(item)) {
                    m.append(item); //getChild().get().appendChild(item.get());
                }
                this.getMap().delete("site-" + id);
                delete this.marks[id];
                //let menu = this.menu.get().query(".item[data-site-id='"+id+"'] .text");
                item.getCaption().text(this.dataSite[id].name);
                //$(menu).text(this.dataSite[id].name);
                //item = this.menu.getByData("site-id", 19221);
                //item.getCaption().text(this.dataSite[id].name+"...");
            }
            else {
                let m = this.menu.getByData("category-id", this.dataSite[id].category_id).getMenu();
                let info = {
                    id: this.dataSite[id].id,
                    caption: this.dataSite[id].name,
                    useCheck: true,
                    value: id,
                    checkValue: id,
                    checkDs: { "level": "sites", "siteId": id },
                    ds: { "siteId": id },
                    infoElement: $.create("span").addClass("site-edit").on("click", () => {
                        this.showSite(id, true);
                        this._lastUnitId = id;
                        this.setInfo(id);
                        this.flyTo(id);
                        this.edit(this.dataSite[id].id);
                    }),
                    check: (item, event) => {
                        this.showSite(id, event.currentTarget.checked);
                    },
                    action: (item, event) => {
                        let ch = item.getCheck();
                        ch.get().checked = true;
                        if ($(event.target).hasClass("site-edit")) {
                            return;
                        }
                        //let ch = item.getCheck();
                        //ch.get().checked = true;
                        this.showSite(id, true);
                        this._lastUnitId = id;
                        this.setInfo(id);
                        this.flyTo(id);
                    }
                };
                m.add(info);
            }
            this.showSite(id, true);
        }
        requestFun(xhr) {
            alert(8888);
            let json = JSON.parse(xhr.responseText);
            this.createForm(json);
            let id = this.editId;
            this.showSite(id, false);
            this.map.getControl("mark").play({
                defaultImage: this.dataSite[id].image,
                defaultCoordinates: [this.dataSite[id].longitude * 1, this.dataSite[id].latitude * 1],
                onstop: () => {
                    this.showSite(id, true);
                    this.editId = null;
                }
            });
        }
        createMenu() {
            let category = {};
            let cat = [];
            let catId = null;
            this.dataCategory.forEach(e => {
                category[e.id] = e.category;
            });
            let menu = new Menu({
                autoClose: false,
                target: this.main,
                items: [],
                type: "accordion",
                useCheck: true,
                subType: "",
            });
            for (let x in this.dataSite) {
                catId = this.dataSite[x].category_id;
                if (!cat[catId]) {
                    cat[catId] = menu.add({
                        id: catId,
                        caption: category[catId],
                        items: [],
                        useCheck: true,
                        useIcon: false,
                        checkValue: x,
                        checkDs: { "level": "category", "categoryId": catId },
                        ds: { "categoryId": catId },
                        check: (item, event) => {
                            //this.showAccountUnits(this.dataClients[x].id, event.currentTarget.checked);
                        },
                    }).getMenu();
                }
                cat[catId].add({
                    id: this.dataSite[x].id,
                    caption: this.dataSite[x].name,
                    useCheck: true,
                    value: x,
                    checkValue: x,
                    checkDs: { "level": "sites", "siteId": x },
                    ds: { "siteId": x },
                    infoElement: $.create("span").addClass("site-edit").on("click", (event) => {
                        this.showSite(x, true);
                        this._lastUnitId = x;
                        this.setInfo(x);
                        this.flyTo(x);
                        this.edit(this.dataSite[x].id);
                    }),
                    check: (item, event) => {
                        this.showSite(x, event.currentTarget.checked);
                    },
                    action: (item, dataUser, event) => {
                        let ch = item.getCheck();
                        ch.get().checked = true;
                        if ($(event.target).hasClass("site-edit")) {
                            return;
                        }
                        //let ch = item.getCheck();
                        //ch.get().checked = true;
                        this.showSite(x, true);
                        this._lastUnitId = x;
                        this.setInfo(x);
                        this.flyTo(x);
                    }
                });
            }
            return menu;
        }
        createForm(info) {
            if (this._form) {
                this._form.delete();
            }
            info.parentContext = this;
            info.id = this.formId;
            this._form = new Form2(info);
        }
        getForm() {
            return this._form;
        }
        loadForm(info) {
            if (this.editId === null) {
                //this._form.reset();
            }
            else {
                this.marks[this.editId].setLngLat(info.coordinates);
                this.marks[this.editId].setImage(info.image);
            }
            this._form.setValue({
                image: info.image,
                longitude: info.coordinates[0],
                latitude: info.coordinates[1],
            });
        }
        new(info) {
            this.editId = null;
            alert(8);
            this._form.setValue({
                icon_id: info.image,
                longitude: info.coordinates[0],
                latitude: info.coordinates[1],
            });
        }
        getInfoLayer() {
            return this._info;
        }
        showSite(id, value) {
            if (!this.marks[id]) {
                this.marks[id] = this.getMap().draw("site-" + id, 'mark', {
                    coordinates: [this.dataSite[id].longitude, this.dataSite[id].latitude],
                    height: 30,
                    image: this.dataSite[id].image,
                    popupInfo: this.loadPopupInfo(id)
                });
            }
            else {
                this.marks[id].setVisible(value);
            }
        }
        showUnits(accountId, value) {
            let e;
            for (let x in this.dataSite) {
                e = this.dataSite[x];
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
        edit(id) {
            //this.editId = id;
            if (this._isplay) {
                if (this.editId == id) {
                    return;
                }
                this.stop();
            }
            this.loadSite3(id);
            //this.start();
            return;
            S.send({
                "async": true,
                "panel": "2",
                "valid": false,
                "confirm_": "seguro?",
                "requestFunction": $.bind(this.requestFun, this),
                "params": [
                    {
                        "t": "setMethod",
                        "id": "0",
                        "element": "gt-site",
                        "method": "site-load",
                        "name": "",
                        "eparams": {
                            "siteId": id
                        }
                    }
                ]
            });
            this.onEdit(id);
        }
        evalHTML(html, data) {
            function auxf(str, p, p2, offset, s) {
                return data[p2] || "";
            }
            for (let x in data) {
                let regex = new RegExp('\(\{=(' + x + ')\})', 'gi');
                html = html.replace(regex, auxf);
            }
            return html;
        }
        flyTo(unitId) {
            if (this.marks[unitId]) {
                this.marks[unitId].flyTo();
            }
        }
        panTo(unitId) {
            if (this.marks[unitId]) {
                this.marks[unitId].panTo();
            }
        }
        setInfo(id) {
            //this._info.text(this.loadInfo(id));
            //this._winInfo.setCaption(this.dataUnits[id].vehicle_name);
            this.oninfo(this.loadInfo(id), this.dataSite[id].name);
        }
        loadPopupInfo(id) {
            return this.evalHTML(this.popupTemplate, this.dataSite[id]);
        }
        loadInfo(id) {
            return this.evalHTML(this.infoTemplate, this.dataSite[id]);
        }
        setFollowMe(value) {
            this.followMe = value;
        }
        getFollowMe() {
            return this.followMe;
        }
        setImage(id, image) {
            //let image = "http://localhost/sevian2020/images/sites maison - _viii_256.png";
            let re = /(?:\w|\s|\.|-)*(?=.png|.jpg|.svg)/gim;
            //myRe = /\w+/
            let result = re.exec(image);
            this.dataSite[id].icon = result[0];
            //this.image = e;
            this.marks[id].setImage(this.pathImages + this.dataSite[id].icon + ".png");
        }
        moveTo(id, coordinates) {
            this.dataSite[id].longitude = coordinates[0];
            this.dataSite[id].latitude = coordinates[1];
            this.marks[id].setLngLat(coordinates);
        }
    }
    Site._instances = [];
    return Site;
})(_sgQuery);
//# sourceMappingURL=Site.js.map