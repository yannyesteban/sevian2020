var Grid = (($) => {

    class InfoField{
        name: any = "";
        id:any = "";
        input:object = {};



    }

    class Paginator{
        
        classType = "paginator";
        totalPages:number = 80;
        maxPages:number = 8;
        page:number = 2;
        className:string = "";
        symbols:string[] = ["|&laquo;","&laquo;","&raquo;","&raquo;|"];
        change:any = (page)=>{};
        _firstPage = 1;
        _main:object = null;
        _change:any=(page)=>{};
        
        constructor(info:any){

            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            this._main = $.create("span").addClass("sg-paginator");
            this._create(this._main);

            if(this.change){
                this._change = $.bind(this.change, this, "page");  
            }
            
        }

        get(){
            return this._main.get();
        }
        _create(main){

            let ini = this.maxPages * Math.floor((this.page - 1) / this.maxPages) + 1;
            let end = ini + this.maxPages - 1;

            main.create("a").prop("href", "javascript:void(0)").text(this.symbols[0]).addClass("page").on("click",()=>this.setPage("b"));
            main.create("a").prop("href", "javascript:void(0)").text(this.symbols[1]).addClass("page").on("click",()=>this.setPage("p"));
            let cell = null;
            for(let i = ini;i <= end; i++){
                
                cell = main.create("a").prop("href", "javascript:void(0)").addClass("page");
                if(i > this.totalPages){
                    cell.text("&nbsp").addClass("hidden").ds("number", 0);
                }else{
                    cell.text(i).ds("number", i);
                }
                if(this.page == i){
                    cell.addClass("active");
                }
                
                cell.on("click",()=>this.setPage(event.currentTarget.dataset.number));
            }

            main.create("a").prop("href", "javascript:void(0)").addClass("page").text(this.symbols[2]).on("click",()=>this.setPage("n"));
            main.create("a").prop("href", "javascript:void(0)").addClass("page").text(this.symbols[3]).on("click",()=>this.setPage("e"));

            if(this.totalPages>this.maxPages){
                let selectPage = main.create("select").on("onchange",(event)=>this.setPage(event.currentTarget.value));;
                let option = null;
               
                for(let i = 1;i <= this.totalPages; i = i + this.maxPages){
                    option = $.create("option").get();
                    option.text = i;
                    option.value = i;

                    if (i >= ini && i <= end){
                        option.selected = true;
                    }else{
                        option.selected = false;
                    }
                    
                    selectPage.get().options.add(option);	
                }
            }
        }

        updatePages(){
            let cells = this._main.queryAll("[data-number]");
            let page = this.maxPages * Math.floor((this.page - 1) / this.maxPages) + 1;
            
            for(let cell of cells){
                $(cell).removeClass(["active", "hidden"]);
                if(this.page==page){
                    $(cell).addClass("active");
                }
                if(page > this.totalPages){
                    $(cell).text("&nbsp").addClass("hidden").ds("number", 0);
                }else{
                    $(cell).text(page).ds("number", page);
                }
                page++;
            }
            if(this.totalPages>this.maxPages){
                this._main.query("select").value = (Math.ceil(this.page / this.maxPages) - 1) * this.maxPages + 1;
            }
            
        }
        setPage(page:any){
            if(page == this.page || page == 0){
                return false;
            }
            switch(page){
                case "b":
                    this.page = 1;
                    break;
                case "e":
                    this.page = this.totalPages;
                    break;
                case "p":
                    this.page--;
                    break;
                case "n":
                    this.page++;
                    break;
                default:
                    this.page = page;
            }
            if(this.page < 1){
                this.page = 1;
            }
            if(this.page > this.totalPages){
                this.page = this.totalPages;
            }
            this.updatePages();

            this.change(this.page);
            
        }

    }

    class Grid{
        target: any = "";
        name: any = "";
        id:any = "";
        value: any = "";
        caption:string = "";
        className = "sevian";
        iconClass:string = "";
        type:string = "default";//"select-one,view,select-one,select-multiple,edit-one,edit-all,edit-form";
        ctrlSelect:string = "one";//one,multiple,
        editMode:string = "none";//grid,one,inline,form,custom
        showEnum = true;
        option:any[] = [];
        data:any[] = [];
        actionButtons:any[] = ["edit","delete"];

        paginator:object = {
            page:1,
            totalPages:20,
            maxPage:5,
            change:(page)=>{}

        };
        searchControl:any = {
            type:"default,forfields",
        };
        fields:any[] = []; 
        _main:object = null;
        _mainForm:object[] = [];
        _table:object = null;

        _thead:object = null;
        _tbody:object = null;
        _tfoot:object = null;

        _rowLength = 0;
        _data_grid:object = null;
        _check:object = null;
        _select = (index:number)=>{return true};
        _new = (index:number)=>{return true};
        _edit = (index:number)=>{return true};
        _delete = (index:number)=>{return true};

        _search = (index:number)=>{return true};
        _filter = (index:number)=>{return true};

        _short = (index:number)=>{return true};
        _changePage = (page:number)=>{return true};

        _fieldData:object = {};
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
            let data = [];
            
            for(let x in this.fields){
                if(data = this.fields[x].config.data){
                    this._fieldData[x] = {};
                    for(let _data of data){
                        this._fieldData[x][_data[0]] = _data[1];
                    }
                }
            }

            this._main = main.addClass("sg-grid").addClass(this.className);

            main.create({tagName:"div",className:"caption"})
            .add({tagName: "span", className: "icon" + this.iconClass})
            .add({tagName: "span", className: "text", innerHTML: this.caption})

            .add({tagName: "span", className: "arrow"});
 
            let body = main.create("div").addClass("body");
            let table = this._table = body.create("table").addClass("grid-table");

            this._thead = table.create("thead");
            this._tbody = table.create("tbody");
            
            let row = this._thead.create("tr");
           
            if(true){
                row.create("td").text("#"); 
            }

            if(this.ctrlSelect == "one" || this.ctrlSelect == "multiple"){
                let cell = row.create("td");
                this._check = cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect == "one")? "radio": "checkbox",
                    name: this.id+"_chk",
                    checked: (this.ctrlSelect == "one")? true: false,

                }).on("onchange", ()=>{this.setNew()});
            }
            
            for(let x in this.fields){

                if(this.fields[x].input == "hidden"){
                    continue;
                }
                row.create("td").text(this.fields[x].config.caption);
            }
            
            this._rowLength = 0;
            
            for(let record of this.data){
                this.createRow(record);
            }
            
            this.createEditRow({});
            let hiddenDiv = body.create("div");
            this._data_grid = I.create("input", {type:"hidden", name:"__data_grid"});
            hiddenDiv.append(this._data_grid);
            let pag = this.paginator;

            pag.change = (page)=>{

                Sevian.action.send(
                {
                    async: true,
                    panel:2,
                    valid:true,
                    confirm_: 'seguro?',
                    params:	[
                        {t:'setMethod',
                            id:2,
                            element:'sgForm',
                            method:'list',
                            name:'personas',
                            eparams:{
                                record:{codpersona:16386},
                                token:"yanny",
                                page:page
                            }
                        }
                        
                    ]
                });


            }
            this._main.append(new Paginator(pag));
   
        }

        _load(main:any){
            this._main = main.addClass("sg-grid");
        }

        createRow(data){
            this._rowLength++;
            let row = this._tbody.create("tr")
                .addClass("body-row")
                .ds("index", this._rowLength);
            
            let cell = null, 
                field = null, value = null, text = "", 
                info = null, input = null,_input = null;

            if(this.showEnum){
                cell = row.create("td").text(this._rowLength);
            }
            if(this.ctrlSelect === "one" || this.ctrlSelect === "multiple"){
                cell = row.create("td");
                let ctrl =  cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect === "one")? "radio": "checkbox",
                    name: this.id + "_chk"

                });
                ctrl.on("click", (event) => {
                    this.getRecord((event.currentTarget.parentNode.parentNode));
                });
            }

            let hiddenFields = $.create({tagName:"div", style:{cssText:"display:none;"}});

            for(let x in this.fields){
                field = this.fields[x];
                value = data[x];
                if(this._fieldData[x] && this._fieldData[x][value]){
                    text = this._fieldData[x][value];
                }else{
                    text = value;
                }

                input = (field.input === "hidden" || this.type === "default")? "input": field.input;

                info = Object.assign({}, field.config);
                info.type = (field.input === "hidden" || this.type === "default")? "hidden": field.config.type;
                info.name = field.config.name + "_" + this._rowLength;
                info.value = value;
                info.dataset = {"name": x};
                
                _input = I.create("input", info);

                if(field.input == "hidden"){
                    hiddenFields.append(_input);
                }else{
                    cell = row.create("td").ds("name", x);
                    cell.append(_input);
                    if(this.type === "default"){
                        cell.create("span").addClass("text").text(text);
                    } 
                }
            }

            if(cell){
                hiddenFields.append(I.create("input", {type:"hidden", name: "__mode_"+"_"+this._rowLength, value: data["__mode_"], dataset:{name:"__mode_"}}));
                hiddenFields.append(I.create("input", {type:"hidden", name: "__id_"+"_"+this._rowLength, value: data["__id_"], dataset:{name:"__id_"}}));
                hiddenFields.append(I.create("input", {type:"hidden", name: "__index_"+"_"+this._rowLength, value: this._rowLength, dataset:{name:"__index_"}}));
                cell.append(hiddenFields);
            }
        }

        createEditRow(data){
            if(!this._tfoot){
                this._tfoot = this._table.create("tfoot");
            }
            
            let row = this._tfoot.create("tr").addClass("edit-row");
            
            let cell = null, value = null, info = null, input = "";

            if(this.showEnum){
                cell = row.create("td").text("");
            }
            
            if(this.ctrlSelect === "one" || this.ctrlSelect === "multiple"){
                cell = row.create("td");
                cell.create("input").attr("type","button").on("click", ()=>{this.setNew()});
                cell.create("input").attr("type","button").val("s").on("click", ()=>{this.save()});
                cell.create("input").attr("type","button").val("I").on("click", ()=>{this.insert()});
            }

            let hiddenFields = $.create({tagName:"div", style:{cssText:"display:none;"}});
           
            for(let x in this.fields){
                let field = this.fields[x];
                value = field.config.default;
                info = Object.assign({}, field.config);

                input = (field.input === "hidden")? "input": field.input;
                info.type = (field.input === "hidden")? "hidden": field.config.type;
                info.value = value;
                info.dataset = {"name": x};
                this._mainForm[x] = I.create(input, info);
                
                if(field.input == "hidden"){
                    hiddenFields.append(this._mainForm[x]);
                }else{
                    cell = row.create("td").ds("name", x);
                    cell.append(this._mainForm[x]);  
                }
               
            }

            if(cell){
                hiddenFields.append(this._mainForm["__mode_"] = I.create("input", {type:"hidden", name: "__mode_", value: "", dataset:{name:"__mode_"}}));
                hiddenFields.append(this._mainForm["__id_"] = I.create("input", {type:"hidden", name: "__id_", value: "", dataset:{name:"__id_"}}));
                hiddenFields.append(this._mainForm["__index_"] = I.create("input", {type:"hidden", name: "__index_", value: "", dataset:{name:"__id_"}}));
                cell.append(hiddenFields);
            }
        }
        createCell(field){

            
        }

        setRecord(index:number, params:any) {
            
        }

        getRecord(row:any) {
            
            let inputs = $(row).queryAll("[data-sg-input][data-name]");
  
            for(let _input of inputs){
                let input = new Input({id:_input});
                this._mainForm[_input.dataset.name].setValue(input.getValue());
            }

            this.getGrid();
        }

        setValue(index:number, params:any) {
            
        }

        getValue() {
            let data = {};
            for(let x in this._mainForm){
                data[x] = this._mainForm[x].getValue();
            }
            
            return data;  
        }

        getGrid(){
            let rows = this._main.queryAll(".body-row");
            let str: string = "";
            let data = [], i = 0;
            for(let row of rows){
                let inputs = $(row).queryAll("[data-sg-input][data-name]");
                
                data[i] = {}; 
                for(let _input of inputs){
                    let input = new Input({id:_input});
                    data[i][_input.dataset.name] = input.getValue();
                }
                
                i++;
            }

            this._data_grid.get().value = JSON.stringify(data);
        }

        setNew(){
            
            this._check.get().checked =  true;
            for(let x in this.fields){
                this._mainForm[x].setValue(this.fields[x].config.default);
            }
            this._mainForm["__mode_"].setValue("1");
            this._mainForm["__id_"].setValue("");
            this._mainForm["__index_"].setValue("");
            
        }

        insert(){
            let data = this.getValue();
            this.createRow(data);
        }

        save(){
            let data = {};
            for(let x in this._mainForm){
                data[x] = this._mainForm[x].getValue();
            }
            this.saveAt(data["__index_"], data);
            return data;
        }

        saveAt(index, data){
            let cells = this._main.queryAll(".body-row[data-index='"+index+"'] > [data-name]"); 
            
            if(cells.length == 0){
                return false;
            }

            let _text:any, _input:any, input:any, name = "", value = "", text = "";
            
            for(let cell of cells){
                value = data[cell.dataset.name];
                name = cell.dataset.name;
                if(this._fieldData[name] && this._fieldData[name][value]){

                    text = this._fieldData[name][value];
                }else{
                    text = value;
                }
                _input = $(cell).query("[data-sg-input]");
                if(_input && data[cell.dataset.name]){
                    input = I.create(_input.dataset.sgInput, {id:_input});
                    input.setValue(value); 
                }
                _text = $(cell).query(".text");
                if(_text){
                    $(_text).text(text);
                }
                
            }
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
