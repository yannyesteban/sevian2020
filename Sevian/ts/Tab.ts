import {_sgQuery as $, SQObject}  from '../../Sevian/ts/Query.js';

export class Tab{

    target:any = false;
    id:any = 0;

    value:any = 0;
    mode:string = "";
    className:string = "";
    pages:any = [];

    onOpen:any = false;
	onClose:any = false;

    _onOpen = (index:number)=>{return true};
	_onClose = (index:number)=>{return true};

    _main:SQObject = null;
    _menu:SQObject = null;
    _page:SQObject = null;
    _length:number = 0;

    static _objs = [];

    static init(){
        let menus = $().queryAll(".sg-tab.sg-detect");

        for(let x of menus){
            if($(x).ds("sgTab")){
                continue;
            }
            if(x.id){
                this.create(x.id,{id:x});
            }else{
                new Tab({id:x});
            }
        }
    }

    static create(name, info:any){
        this._objs[name] = new Tab(info);
        return this._objs[name];
    }

    static getObj(name){
        return this._objs[name];
    }
    constructor(opt: any){

        for(var x in opt){
            if(this.hasOwnProperty(x)) {
                this[x] = opt[x];
            }
        }

        let main:SQObject = (this.id)? $(this.id): null;

        if(main){

            if(main.ds("sgTab")){
                //alert(888)
                //return;
            }

            if(main.hasClass("sg-tab")){
                //this._load(main);
            }else{
                //this._create(main);
            }

        }else{
             main = $.create("div").attr("id", this.id);
        }

        this._create(main);

        if(this.onOpen){
            this._onOpen = $.bind(this.onOpen, this, 'index');
        }
        if(this.onClose){
            this._onClose = $.bind(this.onClose, this, 'index');
        }
        main.ds("sgTab", "tab");

        if((this.value+1) > this.getLenght()){

            this.setValue(this.getLenght()-1);
        }else{
           this.setValue(this.value);
        }

        let target = (this.target)? $(this.target): false;

        if(target){
            target.append(this._main);
        }

    }

    get(){
        return this._main;
    }
    _load(main:any){

        this._main = main.addClass(this.className).addClass("sg-tab");
        let tab_parts = main.childs();

        this._menu = $(tab_parts[0]).addClass("menu");
        this._page = $(tab_parts[1]).addClass("body");

        let mItem = this._menu.get().children;
        let pItem = this._page.get().children;

        for(let i = 0; i < mItem.length; i++){
            $(mItem[i]).on("click", this._click(i))
            .on("focus", this._click(i)).ds("tabIndex", i)
            .removeClass("tab-active");
        }
        for(let i = 0; i < pItem.length; i++){
            $(pItem[i]).ds("tabIndex", i).removeClass("tab-active");
        }

        if(main.ds("value") >= 0){

            this.value = parseInt(main.ds("value"));

        }

    }

    _create(main:any){
        this._main = main.addClass(this.className).addClass("sg-tab");

        this._menu = main.create({
            "tagName": "div",
            "className": "menu"
        });
        this._page = main.create({
            "tagName": "div",
            "className": "body"
        });

        if(this.pages){
            for(var x in this.pages){
                if(this.pages.hasOwnProperty(x)){
                    this.add(this.pages[x]);
                }
            }
        }

    }

    add(opt:any, pos:any = false){
        let body:any = null;
        let index = this._menu.get().children.length;

        let tab = this._menu.create("a").addClass("tab-menu")
            .on("click", this._click(index))
            .on("focus", this._click(index))

            .text(opt.caption || "")
            .attr("href", "javascript:void(0);")
            .ds("tabIndex", index);

        if(opt.set){
            body = opt.set; 
            this._page.append(body);
        }else{
            body = this._page.create(opt.tagName || "div");
        }
        
        body.addClass("tab-body").ds("tabIndex", index);
        
        if(opt.child){
            body.append(opt.child);
        }else if(opt.html){
            body.text(opt.html);
        }

        if(opt.className){
            tab.addClass(opt.className);
            body.addClass(opt.className);
        }
        if(opt.active === true){
            this.show(index);
        }

        return body;

    }

    getLenght(){
        return this._menu.get().children.length;
    }

    _click(index: any){

        return ()=>{
            this.show(index);
        };

    }

    setVisible(index: any, value: any){

        let mItem = this._menu.get().children;
        let pItem = this._page.get().children;

        if(mItem[index] && pItem[index]){
            if(value){
                $(mItem[index]).addClass("tab-active");
                $(pItem[index]).addClass("tab-active");
            }else{
                $(mItem[index]).removeClass("tab-active");
                $(pItem[index]).removeClass("tab-active");
            }
        }
    }

    show (index: any){
        if(index === this.value){
            return false;
        }
        if(this.value !== false){
            var onClose = this._onClose(this.value);

            if(onClose === undefined || onClose === true){
                this.setVisible(this.value, false);
            }else{
                return false;
            }

            this._onOpen(index);
        }

        this.setVisible(index, true);
        this.value = index;


        return true;
    }

    setValue(index){
        this.value = false;
        this.show(index);
    }

    getValue(){

        return this.value;
    }

    setMode(mode:string){
        $(this.id).removeClass(this.mode)
        .addClass(mode)
        .ds("sgMenuMode", mode);

        this.mode = mode;
    }

    getMode(){
        return this.mode;
    }

    getPage(index:number){

        const page = this._main.query(".body > [data-tab-index='"+index+"']");

        if(page){

            return $(page);
        }
        return null;
    }

    getCaption(index:number){

        const caption = this._main.query(`.menu > [data-tab-index='${index}']`);

        if(caption){

            return $(caption);
        }
        return null;
    }
}