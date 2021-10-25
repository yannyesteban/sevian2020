import { _sgQuery as $ } from "../../Sevian/ts/Query.js";
export class InfoForm {
    constructor(info) {
        this.id = "";
        this.main = null;
        this.target = null;
        this.value = null;
        this.data = null;
        this.html = "";
        this.templateHtml = "";
        this.template = null;
        this.context = null;
        this.caption = null;
        this.dataUser = null;
        this.onDataUser = null;
        this.propertys = null;
        this.className = null;
        this.mode = "";
        this.modePropertys = [];
        this.onSetData = (data) => { };
        let x;
        for (x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        this.templateHtml = this.html;
        let main = (this.id) ? $(this.id) : false;
        if (!main) {
            main = $.create("div").attr("id", this.id);
        }
        this.create(main);
        if (this.data) {
            this.setData(this.data);
        }
        if (this.target) {
            let target = $(this.target);
            target.append(main);
        }
    }
    getMain() {
        return this.main;
    }
    get() {
        return this.main.get();
    }
    create(main) {
        //this.template = $.create("template").text(this.templateHtml);
        this.main = main;
        this.main.addClass(this.className);
        this.main.ds("infoMode", this.mode);
        this.main.text(this.templateHtml);
        this.setTemplate(this.main.get(), this.data);
    }
    setData(data) {
        this.data = data;
        this.setModeProperty(this.modePropertys);
        this.main.text(this.templateHtml);
        this.setTemplate(this.main.get(), data);
        this.onSetData(data);
        return;
        let elems = this.main.queryAll("[data-id]");
        for (let e of elems) {
            const elem = $(e);
            elem.text(data[elem.ds("id")]);
        }
    }
    setcaption(caption) {
    }
    setModeProperty(propertys) {
        propertys.forEach(e => {
            this.main.ds(e, this.data[e] || "");
        });
    }
    setMode(mode) {
        if (mode) {
            this.mode = mode;
        }
        this.main.ds("infoMode", this.mode);
    }
    setTemplate(template, data, master) {
        /* eval all variables */
        const myExp = template.dataset.exp;
        if (myExp !== undefined) {
            this.evalExp(myExp, data);
        }
        template.removeAttribute("data-exp");
        this.evalAttributes(template, data, master);
        template.innerHTML = this.evalHTML(template.innerHTML, data, master);
        let child;
        while (child = template.querySelector("[data-detail]")) {
            const myKey = child.dataset.detailKey || null;
            const myIndex = child.dataset.detailIndex || null;
            const myExp = child.dataset.detailExp;
            let aKey = child.dataset.detail.split(":");
            let key = aKey[0];
            let alias = aKey[1] || key;
            child.removeAttribute("data-detail");
            child.removeAttribute("data-detail-key");
            child.removeAttribute("data-detail-index");
            child.removeAttribute("data-detail-exp");
            let mainTemplate = document.importNode(child, true);
            let lastNode = child;
            if (data[key]) {
                let auxKey = alias;
                if (master) {
                    auxKey = master + "." + key;
                }
                let i = 0;
                for (let x in data[key]) {
                    const detailData = Object.assign({}, data[key][x]);
                    if (myKey) {
                        detailData[myKey] = x;
                    }
                    if (myIndex) {
                        detailData[myIndex] = i;
                    }
                    let clone = document.importNode(mainTemplate, true);
                    if (myExp !== undefined) {
                        this.evalExp(myExp, detailData);
                    }
                    this.setTemplate(clone, detailData, auxKey);
                    child.parentNode.insertBefore(clone, lastNode.nextSibling);
                    lastNode = clone;
                    i++;
                }
            }
            child.remove();
        }
    }
    evalAttributes(element, data, key) {
        for (let i = element.attributes.length - 1; i >= 0; i--) {
            element.setAttribute(element.attributes[i].name, this.evalHTML(element.attributes[i].value, data, key));
        }
    }
    evalHTML(string, data, key) {
        let regex;
        if (key) {
            regex = new RegExp("\\{=" + key + "\.([a-z0-9-_\.]+)\}", "gi");
        }
        else {
            regex = /\{=([a-z0-9-_\.]+)\}/gi;
        }
        string = string.replace(regex, (str, index, p2, offset, s) => {
            let levels = index.split(".");
            let tempData = data;
            let valid = true;
            levels.forEach(key => {
                if (valid && tempData[key] !== undefined) {
                    tempData = tempData[key] || "";
                    valid = true;
                }
                else {
                    valid = false;
                }
            });
            if (valid) {
                return tempData;
            }
            return str;
        });
        return string;
    }
    evalExp(exp, data, key) {
        let regex = new RegExp("({([a-z0-9-_\.]+)=([^}]+)\})", "gi");
        let info = exp.matchAll(regex);
        for (let match of info) {
            try {
                const F = $.bind("return " + match[3], data);
                data[match[2]] = F();
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}
//# sourceMappingURL=InfoForm.js.map