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
        ctrlSelect = "one";//one,multiple,
        showEnum = true;
        option:any[] = [];
        data:any[] = [];
        actionButtons:any[] = ["edit","delete"];
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
        _mainForm:object[] = [];
        _table:object = null;
        _rowLength = 0;
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
            let table = this._table = body.create("table").addClass("grid-table");
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
                let row = table.create("tr").addClass("body-row");
                if(true){
                    let cell = row.create("td").text(index + 1); 
                }
                if(this.type == "select-one"){
                    let cell = row.create("td").create({tagName:"input",type:"radio", name:this.id+"_chk", value:index}); 
                    cell.on("click", (event)=>{this.getRecord((event.currentTarget.parentNode.parentNode));});
                }
                let hiddenFields = $.create({tagName:"div"});
                let cellAux = false;
                for(let x in this.fields){
                    let value = record[x]?record[x]:"";
                    if(this.fields[x].input == "hidden"){
                       // hiddenFields.create()                        
                    }else{
                        let cell = row.create("td").ds("name", x).ds("index", index);
                        let input = new Input({
                            target: cell,
                            type: "text", 
                            name: this.fields[x].name+"_"+index,
                            value: value});
                        if(!cellAux){
                            cellAux = cell;
                        }


                    }
                    

                }
                if(cellAux){
                    cellAux.append(hiddenFields);
                }
                
                row.ds("recordMode", record["__mode_"]);
                row.ds("recordId", record["__id_"]);
                this._rowLength = ++index;
            }

            if(1==1){
                let row = table.create("tr");
                if(true){
                    let cell = row.create("td").text("&nbsp"); 
                }
                if(this.type == "select-one"){
                    let cell = row.create("td").text("&nbsp"); 
                    
                }
                let cols = 0;
                for(let x in this.fields){
                    
                    let cell = row.create("td").ds("name", x).ds("index", index);
                    
                    if(cols==0){
                        this._mainForm["__mode_"] = new Input({target:cell, type:"text", name: "__mode_", value: "0"});
                        this._mainForm["__id_"] = new Input({target:cell, type:"text", name: "__mode_", value: "1"});
                    }

                    this._mainForm[x] = new Input({target:cell, type:"text", name:this.fields[x].name, value:""});


                    cols++;
                }
            }


            let hiddenForm = body.create({tagName:"div",style:"display:inline",className:"hidden-form"});
            for(let x in this.fields){
                //let span = hiddenForm.create("span");
                //this._mainForm[x] = new Input({target:span, type:"hidden", name:this.fields[x].name, value: ""});
               
            }
            let length = this._table.queryAll(".body-row").length;
            db (length, "green");


            

        }

        _load(main:any){
            this._main = main.addClass("sg-grid");
        }

        createRow(fields:object, data){
            let row = this._table.create("tr");
            let hiddenInputs = $.create("span");
            let cell = null, value = null;


            if(this.showEnum){
                cell = row.create("td").text(this._rowLength);
            }
            if(this.ctrlSelect == "one" || this.ctrlSelect == "multiple"){
                cell = row.create("td");
                let ctrl =  cell.create({
                    tagName:"input",
                    type:(this.ctrlSelect == "one")? "radio": "checkbox",

                });
            }
            for(let x in fields){
                value = data[fields[x]];
                if(fields[x].input == "hidden"){
                    let hidden = I.create("input",{type:"hidden", value:value});
                }else{
                    switch(fields[x].type){
                        case "select-one":
                            cell = row.create("td").text(value);
                            cell.append(I.create("input", {type:"hidden", value:value}));
                            break;
                    }
                }
            }
        }

        createCell(field){

            
        }

        setRecord(index:number, params:any) {
            
        }

        getRecord(row:any) {
            let cells = $(row).queryAll("[data-name]");
            let form = $(row).query("input").form;
            
            for(let cell of cells){
               // alert (cell.dataset.name)
               let _input = $(cell).query("[data-sg-input]");
               let input = new Input({id:_input});
              
               this._mainForm[cell.dataset.name].setValue(input.getValue());


               
            }
            this._mainForm["__mode_"].setValue($(row).ds("recordMode"));
            this._mainForm["__id_"].setValue($(row).ds("recordId"));

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