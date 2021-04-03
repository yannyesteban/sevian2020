import {_sgQuery as $}  from './Query.js';
import {Float}  from './Window.js';

export class InfoForm{

    private id:any = null;
    private main:any = null;
    private target:any = null; 
    private value:any = null;
    private data:any = null;
    private html:any = "";
    private context:any = null;
    private caption:any = null;
    private dataUser:any = null;
    private onDataUser:Function = null;
    private propertys:any = null;
    private className:any = null;
    private mode:string = "";

    constructor(info:any){
        let x:string;

        for(x in info){
            if(this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        let main = (this.id)? $(this.id): false;
            
        if(!main){
            main = $.create("div").attr("id", this.id);

        }
        this.create(main);
        /*
        this.data = {
            name:"yanny esteban"
        }
        */
        if(this.data){
            this.setData(this.data);
        }
    }

    private create(main:any){
        this.main = main;
        this.main.addClass(this.className);
        this.main.ds("infoMode", this.mode);
        this.main.text(this.html);
    }

    public setData(data:any){
        let elems = this.main.queryAll("[data-id]");
        //console.log(data);
        for(let e of elems){
            
            const elem = $(e);

            //console.log(this.data[elem.ds("id")]);
            elem.text(data[elem.ds("id")]);
            
        }

    }
    public setcaption(caption:any){

    }
    public setMode(mode?:string){
        if(mode){
            this.mode = mode;
        }

        this.main.ds("infoMode", this.mode);
    }
}