const Page = (($) => {
    /*
    @date: September 01, 2019
    */
    class Page{
        
        target: any = "";;
        name: any = "";;
        id:any = "";
        value: any = "";
        caption:string = "";
        type:string = "dropdown";
        iconClass:string = "";
        child:any = null;
        open:boolean = true;
        text:string = "";

        _main:object = null;

        static _objs = [];

        static init(){
            let pages = $().queryAll(".sg-page.sg-detect");
    
            for(let x of pages){
                if($(x).ds("sgPage")){
                    continue;
                }
                if(x.id){
                    this.create(x.id,{id:x});
                }else{
                    new Page({id:x});
                }
            }
        }

        static create(name, info:any){
            this._objs[name] = new Page(info);
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

            let main = (this.id)? $(this.id): false;

            if(main){
                
                if(main.ds("sgPage")){
                    return;
                }
    
                if(main.hasClass("sg-page")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                
                let target = (this.target)? $(this.target): false;

                if(target){
                    main = target.create("div").attr("id", this.id);
                }else{
                    main = $.create("div").attr("id", this.id); 
                }
               
                this._create(main);
            }

            main.ds("sgPage", "page").addClass(`page-${this.type}`);

            if(this.child){
                this.add(this.child);
            }
            
            if(this.type === "dropdown"){
                let children = this._main.get().children;
                for(let x of children){
                    if($(x).hasClass("caption")){
                        $(x).on("click", ()=>{
                            this.toggle();
                        });
                    }
                }
            }
                
            main.addClass(this.open? "open": "close");

        }

        _create(main:any){
            
            this._main = main.addClass("sg-page");

            main.create({tagName:"div",className:"caption"})
            .add({tagName: "span", className: "icon" + this.iconClass})
            .add({tagName: "span", className: "text", innerHTML: this.caption})

            .add({tagName: "span", className: "arrow"});

            let page = main.create({tagName:"div",className:"page"});
            if(this.text){
                page.text(this.text);
            }

        }

        _load(main:any){
            this._main = main.addClass("sg-page");
        }
    
        get(){
            return this._main; 
        }
        getPage(){
            let children = this._main.get().children;
            for(let child of children){
                if($(child).hasClass("page")){
                    return $(child);
                }
            }
           
        }
        add(child:any){
            let children = this._main.get().children;
            for(let x of children){
                if($(x).hasClass("page")){
                    
                    if(typeof(child) === "string"){
                        $(x).text(child);
                    }else{
                        $(x).append(child); 
                    }
                    break;
                }
            }
           
        }

        toggle(){
            if(this._main.hasClass("close")){
                this.show(true);
            }else{
                this.show(false);
            }
        }

        show(value:boolean){
            let children = this._main.get().children;
            for(let x of children){
                if(value === true){
                    this._main.removeClass("close").addClass("open");
                }else{
                    this._main.removeClass("open").addClass("close");
                }
            }
        }
    }

    $(window).on("load", function(){

        Page.init();

        if(1==2){
            let p = new Page({
                caption:"Page ONE",
                id:"page_one",
                text:"<div id='cont'>Hello Word</div>"
            });
            
        }
     })
    
    return Page;
    
    })(_sgQuery);