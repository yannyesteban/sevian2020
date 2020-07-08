(function($, Float){
    db=db;


    class Drag{

    }

    class Item{

        caption:string = "";
        className:string = "";

        withCheck:boolean = false;
		withIcon:boolean = false;

        iconSource:string = "";

        onOpen = (index:number)=>{return true};
        onClose = (index:number)=>{return true};



        constructor(opt: any){
        
            for(var x in opt){
                if(this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
        }

        create(){

        }
        load(){

        }
    }

    class Menu{

        type:string = "nav";//default,nav,dropdown,accordion[x|y]

        id:string = "";
        target:string = "";
        caption:string = "";
        className:string = "";
        items:object[] = [];

        context:object = null;

        _menu:object = null;
        _main:object = null;
        
        action:any = null;
        check:any = null;
        useIcon:boolean = false;

        _isCheck:boolean = false;
        _isItem:boolean = false;

        static init(){
            let menus = $().queryAll(".sg-menu")

            alert(menus.length);

        }

        constructor(opt: any){
        
            for(var x in opt){
                if(this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }

            let main = $(this.id);

            if(main){

                if(main.hasClass("sg-menu")){
                    this.load(main);
                }else{
                    this.create(main);
                }
                this._main = main;
            }else{
                return;
            }

            if(this.context){
                let context = $(this.context).on("click", ()=>{
                    main.style({
                        position:"absolute",
                        visibility:"visible",
                    })
                    Float.showMenu({
                        ref:context.get(),
                        e:main.get(),
                        left:"front",
                        top:"top"

            
                    })
                });

                Float.init(main.get());
                main.style({
                    position:"absolute",
                    visibility:"hidden",
                });

                $().on("mousedown", (event:Event)=>{
                    if(main.ds("active") == "0"){
                        main.style({
                            position:"absolute",
                            visibility:"hidden",
                        });
                    }
                });
                $().on("click", (event:Event)=>{
                    if(main.ds("active") == "1" && !this._isCheck && this._isItem){
                        main.style({
                            position:"absolute",
                            visibility:"hidden",
                        });
                    }
                });

            }


            main.on("mouseenter", (event:Event)=>{
                main.ds("active", "1");
            });

            main.on("mouseleave", (event:Event)=>{
                main.ds("active", "0");
            })

            $().on("mousedown", (event:Event)=>{
                if(main.ds("active") == "0"){
                    this.closeAll();
                }
            });
            
            $().on("click", (event:Event)=>{
                if(main.ds("active") == "1" && !this._isCheck && this._isItem){
                    this.closeAll();
                }
            });

        }

        setType(type:string){

        }
        getType(){
            return this.type;
        }
        create(main:any){
            main.addClass("sg-menu").addClass(this.className)
            .addClass(this.useIcon? "w-icon": "n-icon");
            this.add(main, {caption:this.caption, items:this.items});
            main.addClass(`menu-${this.getType()}`)
            return;

            db("create");
            
            
            
            
            if(this.caption){
                main.create({
                    tagName:"div",
                    innerHTML:this.caption,
                    className:"caption",
                })
            }

            this.createMenu(main, this.items);
            
        }

        load(main:any){
            db ("load")
        }

        createMenu(main:any, items:any, submenu:boolean = true){
          
            

            let menu = main.create({
                tagName:"div",
                className:"menu",
            });
            if(submenu){
                
                menu.addClass("submenu");
                if(this.type == "dropdown" || this.type == "system" || this.type == "nav"){
                    menu.style({
                        position: "fixed",
                        userSelect: "none",
                        MozUserSelect: "none",
                        visibility: "hidden",
                        overflow: "none",
                        zIndex: 150000000,
                        //border:"4px solid red",
                        

                    });
                }
                main.addClass("close");
            }
            
            if(items){
                for(let x in items){
                    if(items.hasOwnProperty(x)){
                        this.add(menu, items[x]);
                    }
                }
            }
            return menu;
        }
        add(main:any, info:any){

            let item = main.create("div").addClass("item");
            
            let tagType = "a";
            if((this.type === "system1" || this.type === "nav") && !main.hasClass("submenu")){
                tagType = "button";    
            }
           
            
            let link = item.create(tagType)
                .addClass("option")
                .prop("href", info.url || "javascript:void(0)")
                .ds("value", info.value || "");

            if(info.useCheck || true){
                let chk = link.create("input").attr("type","checkbox")
                    .on("click", ()=>{
                        if(this._main.ds("active")=="1"){
                            event.stopPropagation();
                        }
                    })
                    .on("mouseenter", ()=>{
                        this._isCheck = true;
                    })
                    .on("mouseleave", ()=>{
                        this._isCheck = false;
                    });
                
                

                if(this.check){
					chk.on("click", (event)=>{
                        this.check(this, item);
                    });
				}
                  
            }    
            link.create("span").addClass("icon").addClass(info.iconClass || "");
            link.create("span").addClass("text").text(info.caption);
            

            if(info.items){

                link.addClass("m-menu").create("span").addClass("ind").ds("sgMenuType", "ind");
                let menu = this.createMenu(item, info.items, true);
                link.on("click", (event:Event)=>{
                   
                    switch(this.type){


                        case "dropdown":
                        case "system":
                        case "default":   
                        case "nav":
                            if(item.hasClass("open")){
                                return false;
                            }    
                            this._closeBrothers(item);                     
                                menu.style({
                                    visibility: "visible"
                                 });
                                 item.removeClass("close")
                                 item.addClass("open");
                                 //Float.setIndex(menu.get());
                                 if((this.type === "system" || this.type === "nav") && !main.hasClass("submenu")){
                                    Float.showMenu({
                                        ref: item.get(), e: menu.get(), 
                                        left: "left", top: "down", 
                                        deltaX: 0, deltaY: 0, z: 0
                                    });
                                 }else{
                                     Float.showMenu({
                                        ref: item.get(), e: menu.get(), 
                                        left: "front", top: "top", 
                                        deltaX: -2, deltaY: 5, z: 0
                                    });
                                 }
                                
                        
                            break;
                        case "accordion":
                        case "accordionx":
                            this._closeBrothers(item); 
                        case "accordiony":    
                            menu.style({
                                visibility: "visible"
                            });
                            if(item.hasClass("open")){
                                item.removeClass("open").addClass("close");
                            }else{
                                item.removeClass("close").addClass("open");
                            
                            }
                            break;    
                    }
                
                    //event.stopPropagation();
					    //event.cancelBubble = true; 
					//event.preventDefault();
                });
    
                
            }else{
                link.addClass("m-item")
                    .on("mouseenter", ()=>{
                        this._isItem = true;
                    })
                    .on("mouseleave", ()=>{
                        this._isItem = false;
                    });
                if(info.action){
					link.on("click", $.bind(info.action, this));
                }
                if(this.action){
					link.on("click", (event)=>{this.action(this, item);});
                }
                
            }
        }
        closeMenu(menu:any){
            let menus = menu.queryAll(".submenu");

            menus.forEach((e)=>{
                 $(e.parentNode).removeClass("open")
                 .addClass("close");
                 $(e).style({
                     visibility: "hidden"
                 });
             })

        }
        _closeBrothers(menu:any){

            let parent = menu.get().parentNode;

            let menus = $(parent).queryAll(".submenu");
            menus.forEach((e)=>{
                
                 if(e.parentNode === menu.get()){
                     return;
                 }
                
                 $(e.parentNode).removeClass("open")
                 .addClass("close");
                 $(e).style({
                     visibility: "hidden"
                 });
             })

        }

        closeAll(){
           
            if(this.type == "default" || this.type == "dropdown" 
                || this.type == "system" || this.type == "nav" || this.type == "accordion"){
                  
                this.closeMenu(this._main);
            }
            

        }

    }

    
    $(window).on("load", function(){
        newMenus();
    })
    /*
    window.onload = function(event){
        Menu.init();
        newMenus();
    }
      */      
    let newMenus = function (){
        let m = new Menu({
            id:"menu1",
            className:"summer",
            type:"dropdown"

        });

let Info = {
    id:"menu2",
    caption:"Menu Opciones",
    type:"dropdown",
    className:"summer",
    useIcon: false,
    
    action:function(menu, item){
        //alert(item.get());
    },
    check:function(menu, item){
       // db ("checkeando")
        //db (item.get());    
    },
    items:[
        {
            caption:"uno",
            action:"db('action UNO')",
        },
        {
            caption:"dos"
        },
        {
            caption:"tres",
            iconClass:"fruit",
            items:[
            {
                caption:"tres:a",
                action:"db('aaaaaa','yellow','red');",
            },
            {
                caption:"tres:b",
                items:[{caption:"caracas",
                    items:[{caption:"alpha"},{caption:"betha"},{caption:"gamma"}]
                },{caption:"valencia"},{caption:"san carlos"},{caption:"yaritagua"}],
            },
            {
                caption:"tres:c",
                items:[{caption:"caracas II"},{caption:"valencia II"},{caption:"san carlos II"},{caption:"yaritagua II"}],
            },
            ]
        },
        {
            caption:"IV"
        }
        ,
        {
            caption:"V",
            items:[
                {caption:"Perla"},{caption:"diamante"},{caption:"esmeralda"}
            ]
        }
    ]
};
Info.context = "cedula";
        let m2 = new Menu(Info);
        Info.context = false;
        Info.id = "menu4";
        let m3 = new Menu(Info);
    }
})(_sgQuery, _sgFloat);