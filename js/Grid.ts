var Grid = (($) => {

    class Grid{
        target: any = "";;
        name: any = "";;
        id:any = "";
        value: any = "";
        caption:string = "";
        className = "sevian";
        iconClass:string = "";
        type:string = "view,select-one,select-multiple,edit-one,edit-all,edit-form";
        option:any[] = [];
        data:any[] = [];
        paginator:any = {
            page:2,
            pages:20,
            maxPage:5,

        };
        searchControl:any = {
            type:"default,forfields",
        };
        _main:object = null;
       
        static _objs = [];
        static init(){
            let grids = $().queryAll(".sg-grid.sg-detect");
    
            for(let x of grids){
                if($(x).ds("sgGrid")){
                    continue;
                }
                if(x.id){
                    this.create(x.id,{id:x});
                }else{
                    new Grid({id:x});
                }
            }
        }
        static create(name, info:any){
            this._objs[name] = new Page(info);
            return this._objs[name];
        }

        static get(name){
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
                
                if(main.ds("sgGrid")){
                    return;
                }
    
                if(main.hasClass("sg-grid")){
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

            main.ds("sgGrid", "grid").addClass(`grid-${this.type}`);


        }
       
        _create(main:any){
            
            this._main = main.addClass("sg-grid").addClass(this.className);


            main.create({tagName:"div",className:"caption"})
            .add({tagName: "span", className: "icon" + this.iconClass})
            .add({tagName: "span", className: "text", innerHTML: this.caption})

            .add({tagName: "span", className: "arrow"});

            
            let body = main.create("div").addClass("body");
            let table = body.create("table");
            //table.create("caption").text("consulta");
           
            for(let record of this.data){
                let row = table.create("tr");
                for(let y in record){
                    let cell = row.create("td").text(record[y]);
                }
            }



            

        }

        _load(main:any){
            this._main = main.addClass("sg-page");
        }

        setRecord(index:number, params:any) {
            
        }

        getrecord(index:number) {
            
        }

        setValue(index:number, params:any) {
            
        }

        getValue(index:number) {
            
        }

        valid(){

        }
    }
     



     $(window).on("load", function(){
        return;
        let info = {
            target:"",
            id:"",
            caption:"",
            className:"",
            type:"",
            fields:[{}],
            data:[{}]


        };

        let g = new Grid(info);

        
     };


     return  Grid;
})(_sgQuery);