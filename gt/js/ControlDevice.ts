var ControlDevice = (($) => {

    
    class ControlDevice{
        id:any = null;
        cmdData:any = null;
        paramForm:any = null;
        constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = (this.id)? $(this.id): false;
            
            if(main){
                
                if(main.ds("gtControlDevice")){
                    return;
                }
    
                if(main.hasClass("gt-control-device")){
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
            main.addClass("gt-control-device")
            
            


            //let bar = main.create("div");

            let f = new Form({
                caption:"hello",
                target:main,
                fields:[
                    {
                        input: "input",
                        config: {
                            type:"text",
                            name:"client_id",
                            caption:"Cliente"
                        }
                    },
                    {
                        input: "input",
                        config: {
                            type:"text",
                            name:"count_id",
                            caption:"Cuenta"
                        }
                    }
                    ,
                    {
                        input: "input",
                        config: {
                            type:"text",
                            name:"device_id",
                            caption:"Device"
                        }
                    }

                ]


            });

            //let bar2 = main.create("div");

            let tab = new Tab({
                target: main,
                pages:[
                    {
                        caption:"Parámetros",
                    },
                    {
                        caption:"Funciones"
                    },
                    {
                        caption:"Eventos",html:"Opps",
                    },
                    {
                        caption:"Identificación",html:"Cuatro"
                    },
               
                ]
            });

            let page = tab.getPage(0);
            page.addClass("gt-control-p1");
            //let bar3 = page.create("div");
            let items = [];
            for(let x in this.cmdData){
                items.push({
                    caption: this.cmdData[x][1],
                    action: "db('"+this.cmdData[x][1]+"')"
                })
            }


            let menu = new Menu({caption:"", target:page, items: items});
            
            // page = tab.getPage(0);
            this.paramForm.target = page;
            let f2 = new Form(this.paramForm);

        }
        _load(main:any){}
    }
    
    return ControlDevice;
})(_sgQuery);