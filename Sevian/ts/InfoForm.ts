import { _sgQuery as $, SQObject } from "../../Sevian/ts/Query.js";
import {LayerTool}  from '../../gt/ts/LayerTool.js';
import {Float}  from './Window.js';

export class InfoForm{

    public id:any = "";
    private main:SQObject = null;
    private target:any = null;
    private value:any = null;
    private data:any = null;
    private html: any = "";
    private templateHtml: any = "";
    private template:any = null;
    private context:any = null;
    private caption:any = null;
    private dataUser:any = null;
    private onDataUser:Function = null;
    private propertys:any = null;
    private className:any = null;
    private mode: string = "";
    private modePropertys: string[] = [];


    public onSetData: (data:any) => void = (data) => { };
    constructor(info:any){
        let x:string;

        for(x in info){
            if(this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        this.templateHtml = this.html;

        let main = (this.id)? $(this.id): false;

        if(!main){
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
    public getMain(){
        return this.main;
    }
    public get(){
        return this.main.get();
    }

    private create(main: any) {

        //this.template = $.create("template").text(this.templateHtml);
        this.main = main;
        this.main.addClass(this.className);
        this.main.ds("infoMode", this.mode);
        this.main.text(this.templateHtml);

        this.setTemplate(this.main.get(), this.data);

    }

    public setData(data: any) {
        this.data = data;

        this.setModeProperty(this.modePropertys);
        this.main.text(this.templateHtml);
        this.setTemplate(this.main.get(), data);

        this.onSetData(data);
        return;

        let elems = this.main.queryAll("[data-id]");

        for(let e of elems){
            const elem = $(e);
            elem.text(data[elem.ds("id")]);
        }


    }
    public setcaption(caption:any){

    }

    public setModeProperty(propertys: any) {
        propertys.forEach(e => {
            this.main.ds(e, this.data[e] || "");

        });
    }

    public setMode(mode?: string) {
        if(mode){
            this.mode = mode;
        }

        this.main.ds("infoMode", this.mode);
    }

    setTemplate(template, data, master?) {

        /* eval all variables */

        const myExp: string = template.dataset.exp;

        if (myExp !== undefined) {
            this.evalExp(myExp, data);
        }

        template.removeAttribute("data-exp");

        this.evalAttributes(template, data, master);

        template.innerHTML = this.evalHTML(template.innerHTML, data, master);

        let child;

        while (child = template.querySelector("[data-detail]")) {

            const myKey:string = child.dataset.detailKey || null;
            const myIndex: string = child.dataset.detailIndex || null;
            const myExp:string = child.dataset.detailExp;

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

    evalAttributes(element:HTMLElement, data, key?) {

        for (let i = element.attributes.length - 1; i >= 0; i--) {
            element.setAttribute(element.attributes[i].name, this.evalHTML(element.attributes[i].value, data, key));
        }
    }

    evalHTML(string, data, key?) {

        let regex;

        if (key) {
            regex = new RegExp("\\{=" + key + "\.([a-z0-9-_\.]+)\}", "gi");
        } else {
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
                } else {
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

    evalExp(exp, data, key?) {
        let regex = new RegExp("({([a-z0-9-_\.]+)=([^}]+)\})", "gi");
        let info = exp.matchAll(regex);
        for (let match of info) {
            try {
                const F =  $.bind("return "+match[3], data);
                data[match[2]] = F();
            } catch (error) {
                console.log(error);
            }
        }
    }
}