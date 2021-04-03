import { _sgQuery as $ } from './Query.js';
export class InfoForm {
    constructor(info) {
        this.id = null;
        this.main = null;
        this.target = null;
        this.value = null;
        this.data = null;
        this.html = "";
        this.context = null;
        this.caption = null;
        this.dataUser = null;
        this.onDataUser = null;
        this.propertys = null;
        this.className = null;
        this.mode = "";
        let x;
        for (x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = (this.id) ? $(this.id) : false;
        if (!main) {
            main = $.create("div").attr("id", this.id);
        }
        this.create(main);
        /*
        this.data = {
            name:"yanny esteban"
        }
        */
        if (this.data) {
            this.setData(this.data);
        }
    }
    create(main) {
        this.main = main;
        this.main.addClass(this.className);
        this.main.ds("infoMode", this.mode);
        this.main.text(this.html);
    }
    setData(data) {
        let elems = this.main.queryAll("[data-id]");
        //console.log(data);
        for (let e of elems) {
            const elem = $(e);
            //console.log(this.data[elem.ds("id")]);
            elem.text(data[elem.ds("id")]);
        }
    }
    setcaption(caption) {
    }
    setMode(mode) {
        if (mode) {
            this.mode = mode;
        }
        this.main.ds("infoMode", this.mode);
    }
}
//# sourceMappingURL=InfoForm.js.map