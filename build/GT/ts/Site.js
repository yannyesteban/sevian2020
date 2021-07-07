import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { Map } from './Map.js';
//import {Form2 as Form2} from './Form2.js';
import { Menu as Menu } from '../../Sevian/ts/Menu2.js';
import { Float } from '../../Sevian/ts/Window.js';
import { S } from '../../Sevian/ts/Sevian.js';
export class Site {
    constructor(info) {
        this.mapName = null;
        this.geofenceForm = null;
        this.dataCategory = null;
        this.dataMain = [];
        this.id = null;
        this.map = null;
        this.mode = 0;
        this.tempPoly = null;
        this.formId = null;
        this.menu = null;
        this.win = null;
        this.form = null;
        this.caption = "";
        this.winCaption = "";
        this.pathImages = "";
        this.followMe = false;
        this.infoTemplate = ``;
        this.popupTemplate = ``;
        this.oninfo = (info, name) => { };
        this.delay = 30000;
        this.onSave = info => { };
        this.onEdit = info => { };
        this.main = null;
        this.marks = [];
        this._info = null;
        this._winInfo = null;
        this._timer = null;
        this._form = null;
        this._lastUnitId = null;
        this.editId = null;
        this._traces = [];
        this._win = [];
        this.lastTransaction = 0;
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        //return;
        let main = (this.id) ? $(this.id) : false;
        if (!main) {
            main = $.create("div").attr("id", this.id);
        }
        this._create(main);
        Map.load(this.mapName, $.bind(this.setMapLoad, this));
    }
    _create(main) {
        this.main = main;
        this.menu = this.createMenu();
        this._win["main-menu"] = new Float.Window({
            visible: false,
            caption: this.caption,
            left: 10,
            top: 100,
            width: "280px",
            height: "250px",
            mode: "auto",
            className: ["sevian"],
            child: this.main.get()
        });
        let formMain = $.create("div").attr("id", this.formId);
        this._win["form"] = new Float.Window({
            visible: false,
            caption: this.caption,
            left: 10,
            top: 100,
            width: "280px",
            height: "250px",
            mode: "auto",
            className: ["sevian"],
            child: formMain
        });
        main.addClass("geofence-main");
        //this.createForm(this.form);
        this._info = $().create("div").addClass("win-geofence-info");
    }
    setMapLoad(map, s) {
        this.setMap(map);
        const mapControl = map.getControl("mark2"); // as TraceControl;//<TraceControl>
        const processSave = (json) => {
            this.updateData(json.data);
            if (!json.data.__error_) {
                new Float.Message({
                    "caption": "Geocercas",
                    "text": "Record was saved!!!",
                    "className": "",
                    "delay": 3000,
                    "mode": "",
                    "left": "center",
                    "top": "top"
                }).show({});
            }
            else {
                new Float.Message({
                    "caption": "Geocercas",
                    "text": "Record wasn't saved!!!!",
                    "className": "",
                    "delay": 3000,
                    "mode": "",
                    "left": "center",
                    "top": "top"
                }).show({});
            }
        };
        mapControl.onInit = () => {
            S.go({
                async: true,
                valid: false,
                blockingTarget: mapControl.getPanel(),
                requestFunctions: {
                    "f": (json) => {
                        console.log(json);
                        mapControl.setSiteList(json.list);
                        mapControl.setCategoryList(json.categoryList);
                        mapControl.setSite(json.data);
                    }
                },
                params: [
                    {
                        t: "setMethod",
                        element: "gt-site",
                        method: "get-record",
                        name: "",
                        eparams: {
                            siteId: "2"
                        },
                        iToken: "f"
                    }
                ]
            });
        };
        mapControl.onLoadSite = (id) => {
            S.go({
                async: true,
                valid: false,
                blockingTarget: mapControl.getPanel(),
                requestFunctions: {
                    "f": (json) => {
                        console.log(json);
                        mapControl.setSiteList(json.list);
                        mapControl.setCategoryList(json.categoryList);
                        mapControl.setSite(json.data);
                    }
                },
                params: [
                    {
                        t: "setMethod",
                        element: "gt-site",
                        method: "get-record",
                        name: "/form/site",
                        eparams: {
                            siteId: id
                        },
                        iToken: "f"
                    }
                ]
            });
        };
        mapControl.onsave = (data) => {
            var formData = new FormData();
            formData.append("id", data.id);
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("category_id", data.category_id);
            formData.append("longitude", data.longitude);
            formData.append("latitude", data.latitude);
            formData.append("image", data.image);
            formData.append("scale", data.scale);
            formData.append("__mode_", data.__mode_);
            if (data.__mode_ == 2) {
                this.lastTransaction = 2;
                formData.append("__record_", JSON.stringify({
                    id: data.id
                }));
            }
            else {
                this.lastTransaction = 1;
            }
            S.go({
                async: true,
                valid: false,
                form: formData,
                blockingTarget: mapControl.getPanel(),
                requestFunctions: {
                    "f": (json) => {
                        console.log(json);
                        mapControl.setSiteList(json.list);
                        mapControl.setCategoryList(json.categoryList);
                        mapControl.setSite(json.data);
                    },
                    "f2": processSave
                },
                params: [
                    {
                        t: "setMethod",
                        'mode': 'element',
                        element: "s-form",
                        method: "save",
                        name: "/form/site",
                        eparams: { getResult: true },
                        iToken: "f2"
                    },
                    {
                        t: "getDataForm",
                        fields: { id: "siteId" }
                    },
                    {
                        t: "setMethod",
                        element: "gt-site",
                        method: "get-record",
                        name: "/form/site",
                        eparams: {},
                        iToken: "f"
                    },
                ]
            });
        };
        mapControl.ondelete = (data) => {
            var formData = new FormData();
            formData.append("id", data.id);
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("type", data.type);
            formData.append("geojson", data.geojson);
            formData.append("propertys", data.propertys);
            formData.append("color", "red");
            formData.append("scope", data.propertys);
            formData.append("propertys", data.propertys);
            formData.append("__mode_", "3");
            formData.append("__record_", JSON.stringify({
                id: data.id
            }));
            S.go({
                async: true,
                valid: false,
                confirm: 'seguro?',
                form: formData,
                blockingTarget: mapControl.getPanel(),
                requestFunctions: {
                    "f": (json) => {
                        mapControl.delete();
                        mapControl.setGeogenceList(json.list);
                        mapControl.newGeofence();
                    },
                    "f2": processSave
                },
                params: [
                    {
                        t: "setMethod",
                        'mode': 'element',
                        element: "s-form",
                        method: "save",
                        name: "/form/geofence",
                        eparams: { getResult: true },
                        iToken: "f2"
                    },
                    {
                        t: "getDataForm",
                        fields: { id: "geofenceId" }
                    },
                    {
                        t: "setMethod",
                        element: "gt-geofence",
                        method: "get-record",
                        name: "/form/geofence",
                        eparams: {},
                        iToken: "f"
                    },
                ]
            });
        };
        /*
        const tool = new GeofenceTool({
            id: mapControl.getPanel(),
            form: this.geofenceForm
        });
        mapControl.ondraw = (config) => {
            console.log(config);
            tool.setConfig(config)
        }*/
        //mapControl.play();
    }
    showMenu() {
        this._win["main-menu"].show();
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
        this.map = map;
    }
    requestFun(xhr) {
        let json = JSON.parse(xhr.responseText);
        this.createForm(json);
        let id = this.editId;
        this.showSite(id, false);
        this.map.getControl("poly").play({
            type: this.dataMain[id].type,
            defaultCoordinates: this.dataMain[id].config,
            onstop: () => {
                this.showSite(id, true);
                this.editId = null;
            }
        });
    }
    updateData(data) {
        let index = this.dataMain.find(e => e.id == data.id);
        if (index) {
            if (data.__mode_ === 3) {
                let item = this.menu.getByValue(data.id);
                item.remove();
                delete this.dataMain[index];
                return;
            }
            this.dataMain[index] = data;
            let item = this.menu.getByValue(data.id);
            item.setCheckValue(true);
            //this.getMap().delete("geofence-" + id);
            item.getCaption().text(data.name);
        }
        else {
            this.dataMain.push(data);
            this.menu.add(this.createItem(data, true));
        }
        this.showSite(data.id, true);
        return;
        console.log(data);
        const id = data.id;
        if (data.__mode_ === 3) {
            let item = this.menu.getByValue(id);
            item.remove();
            delete this.dataMain[id];
            return;
        }
        if (!this.dataMain[id]) {
            this.dataMain[id] = {};
        }
        this.dataMain[id].id = data.id;
        this.dataMain[id].name = data.name;
        this.dataMain[id].description = data.description;
        //this.dataMain[id].geojson = JSON.parse(data.geojson);
        if (data.__mode_ === 1) {
            this.menu.add(this.createItem(this.dataMain[id], true));
        }
        else {
            let item = this.menu.getByValue(id);
            item.setCheckValue(true);
            //this.getMap().delete("geofence-" + id);
            item.getCaption().text(data.name);
        }
        this.showSite(id, true);
    }
    edit(id) {
        this.mode = 2;
        this.editId = id;
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
                    "element": "gt-geofence",
                    "method": "geofence-load",
                    "name": "",
                    "eparams": {
                        "geofenceId": id
                    }
                }
            ]
        });
        this.onEdit(id);
    }
    update(info) {
        this.getForm().setValue(info).setMode('update');
        this.getForm().getInput("__mode_").setValue(2);
        this.getForm().getInput("__id_").setValue(0);
        this.dataMain[info.id] = info;
        this.updatePoly(info.id);
    }
    updatePoly(id) {
        if (this.marks[id]) {
            let item = this.menu.getByValue(id);
            this.getMap().delete("geofence-" + id);
            delete this.marks[id];
            item.getCaption().text(this.dataMain[id].name);
        }
        else {
            let info = {
                id: this.dataMain[id].id,
                caption: this.dataMain[id].name,
                useCheck: true,
                value: id,
                checkValue: id,
                checkDs: { "level": "geofences", "geofenceId": id },
                ds: { "geofenceId": id },
                infoElement: $.create("span").addClass("geofence-edit").on("click", () => { this.edit(this.dataMain[id].id); }),
                check: (item, event) => {
                    this.showSite(id, event.currentTarget.checked);
                },
                action: (item, event) => {
                    let ch = item.getCheck();
                    ch.get().checked = true;
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
    getForm() {
        return this._form;
    }
    loadForm(info) {
        /*
        if(this.editId === null){

            this._form.reset();
        }else{
            this.marks[this.editId].setLngLat(info.coordinates);
            this.marks[this.editId].setImage(info.image);
        }
        */
        this._form.setValue({
            coords: info[0],
        });
    }
    createItem(info, checked) {
        const id = info.id;
        return {
            id: id,
            caption: info.name,
            useCheck: true,
            value: id,
            checkValue: id,
            checked: checked,
            checkDs: { "level": "geofence", "geofenceId": id },
            infoElement: $.create("span").addClass("geofence-edit").on("click", () => {
                //this.edit(this.dataMain[x].id);
            }),
            ds: { "geofenceId": id },
            check: (item, event) => {
                this.showSite(id, event.currentTarget.checked);
            },
            action: (item, event) => {
                let ch = item.getCheck();
                ch.get().checked = true;
                this.showSite(id, true);
                this._lastUnitId = id;
                this.setInfo(id);
                this.flyTo(id);
            }
        };
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
        for (let x in this.dataMain) {
            catId = this.dataMain[x].category_id;
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
                id: this.dataMain[x].id,
                caption: this.dataMain[x].name,
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
                    this.edit(this.dataMain[x].id);
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
    showSite(id, value) {
        console.log(this.dataMain);
        if (!this.marks[id]) {
            const site = this.dataMain.find(e => e.id = id);
            console.log(this.dataMain[id]);
            this.marks[id] = this.getMap().draw("site-" + id, 'mark', {
                coordinates: [site.longitude, site.latitude],
                height: 30,
                image: site.image,
                popupInfo: this.loadPopupInfo(id)
            });
        }
        else {
            this.marks[id].setVisible(value);
        }
    }
    createMenuNo() {
        let infoMenu = [];
        console.log(this.dataMain);
        for (let x in this.dataMain) {
            infoMenu[this.dataMain[x].id] = {
                id: this.dataMain[x].id,
                caption: this.dataMain[x].name,
                useCheck: true,
                value: x,
                checkValue: x,
                checkDs: { "level": "geofence", "geofenceId": x },
                infoElement: $.create("span").addClass("geofence-edit").on("click", () => {
                    this.edit(this.dataMain[x].id);
                }),
                ds: { "geofenceId": x },
                check: (item, event) => {
                    this.showSite(x, event.currentTarget.checked);
                },
                action: (item, event) => {
                    let ch = item.getCheck();
                    ch.get().checked = true;
                    this.showSite(x, true);
                    this._lastUnitId = x;
                    this.setInfo(x);
                    this.flyTo(x);
                    return;
                    this._traces[x] = new GTTrace({ map: this.map.map });
                    this._traces[x].play();
                }
            };
        }
        let menu = new Menu({
            caption: "",
            autoClose: false,
            target: this.main,
            items: infoMenu,
            useCheck: true,
            check: (item) => {
                let ch = item.getCheck();
                let checked = ch.get().checked;
                let list = item.queryAll("input[type='checkbox']");
                for (let x of list) {
                    x.checked = checked;
                }
            }
        });
        return menu;
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
                    this._lastUnitId = x;
                    this.setInfo(x);
                    this.flyTo(x);
                    return;
                    this._traces[x] = new GTTrace({ map: this.map.map });
                    this._traces[x].play();
                }
            };
        }
        let menu1 = new Menu({
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
        return menu1;
    }
    createForm(info) {
        if (this._form) {
            this._form.delete();
        }
        info.parentContext = this;
        info.id = this.formId;
        this._form = new Form2(info);
    }
    getInfoLayer() {
        return this._info;
    }
    showSite2(id, value) {
        console.log(id, this.dataMain);
        if (!this.marks[id]) {
            this.marks[id] = this.getMap().draw(id, "mark", {
                //feature: this.dataMain[id].geojson,
                popupInfo: this.loadPopupInfo(id)
            });
        }
        else {
            console.log(2, id);
            this.marks[id].setVisible(value);
        }
    }
    showUnits(accountId, value) {
        let e;
        for (let x in this.dataMain) {
            e = this.dataMain[x];
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
    evalHTML(html, data) {
        function auxf(str, p, p2, offset, s) {
            return data[p2];
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
        this.oninfo(this.loadInfo(id), this.dataMain[id].name);
    }
    loadPopupInfo(id) {
        return this.evalHTML(this.evalHTML(this.popupTemplate, this.dataMain[id]), this.dataMain[id]);
    }
    loadInfo(id) {
        return this.evalHTML(this.evalHTML(this.infoTemplate, this.dataMain[id]), this.dataMain[id]);
    }
    setFollowMe(value) {
        this.followMe = value;
    }
    getFollowMe() {
        return this.followMe;
    }
}
//# sourceMappingURL=Site.js.map