import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
//import {Form2 as Form2} from './Form2.js';
import { Menu as Menu } from '../../Sevian/ts/Menu2.js';
import { Float } from '../../Sevian/ts/Window.js';
import { S } from '../../Sevian/ts/Sevian.js';
export class UnitMenu {
    constructor(info) {
        this.unitData = [];
        this.unitStoreId = null;
        this.unitStore = null;
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
        this.window = [];
        this.lastTransaction = 0;
        console.log(info);
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
        if (this.unitStoreId) {
            this.unitStore = S.getElement(this.unitStoreId);
            this.unitStore.addEvent("unitChange", (event) => {
                const detail = event.detail;
                if (detail && detail.data && detail.data.unitId) {
                    const data = detail.data;
                    const unitId = detail.data.unitId;
                    console.log(detail.data);
                    const ele = this.menu.getMain().query(`[data-unit-id="${unitId}"] input[type="checkbox"]`);
                    if (ele) {
                        ele.checked = data.active || false;
                    }
                    return;
                }
            });
            this.unitStore.addEvent("infoChange", (event) => {
                const detail = event.detail;
                if (detail && detail.data && detail.data.unitId) {
                    console.log(detail.data);
                }
            });
        }
        this._create(main);
    }
    _create(main) {
        this.main = main;
        //this.menu = this.createMenu();
        this.window = new Float.Window({
            visible: true,
            caption: this.caption,
            left: 10,
            top: 100,
            width: "280px",
            height: "250px",
            mode: "auto",
            className: ["sevian"],
            child: this.main.get()
        });
        main.addClass("geofence-main");
        this.createUnitMenu(this.unitData);
    }
    createUnitMenu(data) {
        //console.log(this.dataUnits);return;
        let infoMenu = [];
        let cacheClient = [];
        let cacheAccount = [];
        data.forEach((info, index) => {
            const clientId = info.client_id;
            const accountId = info.account_id;
            const unitId = info.unitId;
            //console.log(clientId, this.dataUnits[x].client);
            if (!cacheClient[clientId]) {
                cacheClient[clientId] = {
                    id: clientId,
                    caption: info.client,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                    checkValue: index,
                    checkDs: { "level": "client", "clientId": clientId },
                    ds: { "clientId": clientId },
                    check: (item, event) => {
                        //this.showAccountUnits(clientId, event.currentTarget.checked);
                    },
                };
                infoMenu.push(cacheClient[clientId]);
            }
            if (!cacheAccount[accountId]) {
                cacheAccount[accountId] = {
                    id: accountId,
                    caption: info.account,
                    items: [],
                    useCheck: true,
                    useIcon: false,
                    checkValue: accountId,
                    checkDs: { "level": "account", "accountId": accountId },
                    ds: { "accountId": accountId },
                    check: (item, event) => {
                        //this.showUnits(accountId, event.currentTarget.checked);
                    },
                };
                cacheClient[clientId].items.push(cacheAccount[accountId]);
            }
            cacheAccount[accountId].items.push({
                id: unitId,
                caption: info.unitName,
                useCheck: true,
                value: index,
                checkValue: index,
                checkDs: { "level": "units", "unitId": unitId },
                ds: { "unitId": unitId, "valid": info.valid },
                check: (item, event) => {
                    if (event.currentTarget.checked) {
                        this.unitStore.loadUnit(unitId);
                    }
                    else {
                        this.unitStore.updateData({ unitId, active: false });
                    }
                    //this.showUnit(unitId, event.currentTarget.checked);
                },
                action: (item, event) => {
                    let ch = item.getCheck();
                    ch.get().checked = true;
                    this.unitStore.loadUnit(unitId);
                }
            });
        });
        this.menu = new Menu({
            caption: "",
            autoClose: false,
            target: this.main,
            items: infoMenu,
            useCheck: true,
            check: (item) => {
                let ch = item.getCheck();
                let checked = ch.get().checked;
                let list = item.queryAll(`input[type="checkbox"]`);
                for (let x of list) {
                    x.checked = checked;
                }
            }
        });
        return this.menu;
    }
    showMenu() {
        this.window.show();
    }
}
//# sourceMappingURL=UnitMenu.js.map