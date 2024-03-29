import {_sgQuery as $, SQObject}  from '../../Sevian/ts/Query.js';
//import {Form2 as Form2} from './Form2.js';
//import {Menu as Menu} from '../../Sevian/ts/Menu2.js';
import {Float}  from '../../Sevian/ts/Window.js';




export class GTInfo{
    id:any = null;
    caption:string = "INFO";
    form:object = null;
    _main:SQObject = null;
    _form:object = null;

    _infoBody:object = null;

    private _win:any[] = [];


    constructor(info){

        for(var x in info){
            if(this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        let main = (this.id)? $(this.id): false;

        if(main){

            if(main.ds("gtInfo")){
                return;
            }

            if(main.hasClass("gt-info")){
                this._load(main);
            }else{
                this._create(main);
            }

        }else{
            main = $.create("div").attr("id", this.id);

            this._create(main);
        }


    }
    _create(main:any){

        this._main = main;

        main.addClass("gt-info-main");

        this._win["info-main"] = new Float.Window({
            visible:true,//true
            caption: this.caption,
            //left:1180 -160,
            //top:100,

            left:"right",
            top:"top",
            deltaX: -50,
            deltaY: 100,

            width: "330px",
            height: "200px",
            mode:"custom",
            className:["sevian"],
            child:main.get(),
            closable: false
        });





    }

    get(){
        return this._main;
    }
    show(){
        this._win["info-main"].show();
    }
    setCaption(caption:string){
        this._win["info-main"].setCaption(caption);
    }
    setText(text:string){
        this._main.text(text);
    }
    setBody(body:any){
        this._main.text("");
        this._main.append(body);
    }
}
