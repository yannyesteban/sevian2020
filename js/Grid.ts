var Grid = (($) => {

    class InfoField{
        name: any = "";
        id:any = "";
        input:object = {};



    }


    class Grid{
        target: any = "";
        name: any = "";
        id:any = "";
        value: any = "";
        caption:string = "";
        className = "sevian";
        iconClass:string = "";
        type:string = "select-one";//"view,select-one,select-multiple,edit-one,edit-all,edit-form";
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
        fields:any[] = []; 
        _main:object = null;
        
        _select = (index:number)=>{return true};
        _new = (index:number)=>{return true};
        _edit = (index:number)=>{return true};
        _delete = (index:number)=>{return true};

        _search = (index:number)=>{return true};
        _filter = (index:number)=>{return true};

        _short = (index:number)=>{return true};
        _changePage = (page:number)=>{return true};

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
            let row = table.create("tr");
           
            if(true){
                let cell = row.create("td").text("#"); 
            }

            if(this.type == "select-one"){
                let cell = row.create("td").create({tagName:"input",type:"radio", name:this.id+"_chk"}); 
            }
            
            for(let x in this.fields){


                let cell = row.create("td").text(this.fields[x].caption);
            }
            let index = 0;
            for(let record of this.data){
                let row = table.create("tr");
                if(true){
                    let cell = row.create("td").text(index + 1); 
                }
                if(this.type == "select-one"){
                    let cell = row.create("td").create({tagName:"input",type:"radio", name:this.id+"_chk"}); 
                }
                for(let x in record){
                    let cell = row.create("td");
                    let input = new Input({target:cell, type:"text", name:this.fields[x].name+"_"+index, value:record[x]});
                }
                index++;
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