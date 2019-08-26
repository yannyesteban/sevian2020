(function($, Float){

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

        id:string = "";
        target:string = "";
        caption:string = "";
        className:string = "";
        items:object[] = [];
        _menu:object = null;

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
                
            }
        }
        create(main:any){   
            db("create");
            main.addClass("sg-menu");
            if(this.caption){
                main.create({
                    tagName:"div",
                    innerHTML:this.caption,
                    className:"caption",
                })
            }

            this.createMenu(main, this.items);
            return;
            this._menu = main.create({
                tagName:"div",
                
                className:"menu",
            });
            if(this.items){
                for(let x in this.items){
                    if(this.items.hasOwnProperty(x)){
                        this.add(this.items[x], main);
                    }
                }
            }
        }

        load(main:any){
            db ("load")
        }

        createMenu(main:any, items:any){
          
            let menu = main.create({
                tagName:"div",
                className:"menu",
            });

            if(items){
                for(let x in items){
                    if(items.hasOwnProperty(x)){
                        this.add(menu, items[x]);
                    }
                }
            }
        }
        add(main:any, info:any){


            let item = main.create("div").addClass("item").addClass("close");
            let link = item.create("a").addClass("option").prop("href","javascript:void(0)");
            link.text(info.caption);
            

            if(info.items){
                
                link.on("click", function(event){
                    if(item.hasClass("open")){
                        item.removeClass("open").addClass("close");
                    }else{
                        item.removeClass("close").addClass("open");
                    }
                    event.stopPropagation();
					//event.cancelBubble = true; 
					event.preventDefault();
                });
    
                this.createMenu(item, info.items);
            }
        }


    }

    let m = new Menu({
        id:"menu1",

    });
    let m2 = new Menu({
        id:"menu2",
        caption:"Menu Opciones",
        items:[
            {
                caption:"uno"
            },
            {
                caption:"dos"
            },
            {
                caption:"tres",
                items:[
                {
                    caption:"tres:a",
                },
                {
                    caption:"tres:b",
                    items:[{caption:"caracas"},{caption:"valencia"},{caption:"san carlos"},{caption:"yaritagua"}],
                },
                {
                    caption:"tres:c",
                },
                ]
            },
            {
                caption:"IV"
            }
        ]
    });

})(_sgQuery, _sgFloat);