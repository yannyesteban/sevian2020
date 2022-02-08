import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { Float } from '../../Sevian/ts/Window.js';
import { S } from '../../Sevian/ts/Sevian.js';
import { InfoForm } from '../../Sevian/ts/InfoForm.js';
export class UnitInfo {
    constructor(info) {
        this.unitData = {};
        this.unitStoreId = null;
        this.unitStore = null;
        this.infoForm = null;
        this.main = null;
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
        this.window = null;
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
        this._create(main);
    }
    _create(main) {
        this.main = main;
        const infoForm = new InfoForm(this.infoForm);
        //this.menu = this.createMenu();
        this.window = new Float.Window({
            visible: true,
            caption: this.caption,
            left: "right",
            top: "top",
            deltaX: -50,
            deltaY: 100,
            width: "330px",
            height: "200px",
            mode: "custom",
            className: ["sevian"],
            closable: false
        });
        this.main.addClass("geofence-main");
        if (this.unitStoreId) {
            this.unitStore = S.getElement(this.unitStoreId);
            this.unitStore.addEvent("unitChange", (event) => {
                const detail = event.detail;
                if (detail && detail.data && detail.data.unitId) {
                    const data = detail.data;
                    infoForm.setMode("");
                    this.window.setBody(infoForm.get());
                    this.window.setCaption(data.unitName || "");
                    console.log("la unidad es " + this.unitId);
                    this.unitId = data.unitId;
                    this.unitData = data;
                    infoForm.setData(data);
                    return;
                }
                infoForm.setMode("error");
                this.window.setCaption("No Unit Selected!");
                this.unitId = null;
                this.unitData = {};
            });
            this.unitStore.addEvent("infoChange", (event) => {
                const detail = event.detail;
                if (detail && detail.data && detail.data.unitId && detail.data.unitId === this.unitId) {
                    const data = detail.data;
                    this.unitData = Object.assign(this.unitData || {}, data);
                    infoForm.setData(this.unitData);
                }
            });
        }
    }
    showMenu() {
        this.window.show();
    }
}
//# sourceMappingURL=UnitInfo.js.map