var Grid = (($) => {

    class Form{

        _inputs:any[] = [];

        createInput(input, info:any){

            if(info.parent){
                info.getParentValue = () =>{
                    return this.getInput(info.parent).getValue();
                }
            }

            if(info.childs){
                info.evalChilds = () => {
                    this.evalChilds(info.name)
                }
            }

            this._inputs[info.name] = I.create(input, info);
            
            return this._inputs[info.name];
        }
        
        getValue(){
            let data = {};
            
            for(let name in this._inputs){

                if(!this._inputs[name].dataName){
                   data[name] = this._inputs[name].getValue(); 
                }else{
                   data[this._inputs[name].dataName] = this._inputs[name].getValue(); 
                }
                
            }

            return data;
        }

        setValue(data){

            for(let name in this._inputs){

                if(this._inputs[name].parent){
                   // this._inputs[name].createOptions(this._inputs[this._inputs[name].parent].getValue());
                }

                if(!this._inputs[name].dataName){
                   this._inputs[name].setValue(data[name]); 
                }else{
                   this._inputs[name].setValue(data[this._inputs[name].dataName]); 
                }
                
            }

            return this;
        }
        
        reset(){
            
            for(let name in this._inputs){
                this._inputs[name].reset();
            }
        }

        evalChilds(parent:string){
            let input = this._inputs[parent];

            for(let i in this._inputs){

                if(this._inputs[i].parent === parent){
                    this._inputs[i].createOptions(input.getValue(), i);

                    if(this._inputs[i].hasChilds()){
                        this.evalChilds(i);
                    }
                }
            }
        }

        getInput(name){
            
            return this._inputs[name];
        }
        getInputs(){
            
            return this._inputs;
        }
        valid(){
            
            let data = this.getValue();
            let rules = null, config = null;
            let inputs = this._inputs;
            let msg = null;

            for(let name in this._inputs){
                let input = this._inputs[name];
                config = input.config;
                rules = input.rules;

                if(rules){
                    msg = Sevian.Valid.send(rules, input.getValue(), input.caption, data);

                    if(msg){
                        alert(msg);
                        input.focus();
                        input.select();
                        
                        return false;
                    }
                }
                
            }
            
            return true;
        }
    }




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
                
                if(page < 1 || page > this.totalPages){
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

            this._change(this.page);
            
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
        type:string = "default";//"edit";//"default";//"select-one,view,select-one,select-multiple,edit-one,edit-all,edit-form";
        ctrlSelect:string = "one";//one,multiple,
        editMode:string = "multi";//simple,grid,one,inline,form,custom

        actionButton:boolean = false;
        deleteButton:boolean = false;

        searchValue:string = '';

        showEnum = true;
        allowSearch = true;
        option:any[] = [];
        data:any[] = [];
        menu:object = null;
        actionButtons:any[] = ["edit","delete"];

        optionText:object = {
            new:"+",
            edit:"edit",
            delete:"&#215;",
            save:"save",
            search:"...Search",
            search_go:"GO",
            delete_confirm: "delete?",
            select_record: "select one option, please!"

        };

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
        _mainForm:Form = null;
        _table:object = null;

        _thead:object = null;
        _tbody:object = null;
        _tfoot:object = null;

        _forms:Form[] = [];
        _rowLength = 0;
        _data_grid:object = null;
        _check:object = null;

        pag:object = null;
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
            if(opt.search){
                this._search = $.bind(opt.search, this, "q");  
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

            this._main = main.addClass("sg-grid").addClass("type-" + this.type)
            .addClass(this.className);

            main.create({tagName:"div",className:"caption"})
                .add({tagName: "span", className: "icon" + this.iconClass})
                .add({tagName: "span", className: "text", innerHTML: this.caption})
                .add({tagName: "span", className: "arrow"});

            let _search = main.create("div").addClass("grid-search");
            let q = _search.create("input").attr("type","search").attr("name", "q").attr("placeholder", this.optionText.search)
                .addClass("search").val(this.searchValue)
                
                
                .on("keyup", (event)=> {
                    // Number 13 is the "Enter" key on the keyboard
                    if (event.keyCode === 13) {
                      // Cancel the default action, if needed
                      event.preventDefault();
                      // Trigger the button element with a click
                      this._search(q.val());
                    }
                  });
                ;
            _search.create("input").attr("type","button").val(this.optionText.search_go+"").addClass("btn-search")
                .on("click", (event)=>{this._search(q.val())});;


            if(this.ctrlSelect === "one" || this.ctrlSelect === "multiple"){
                let _auxMenu = main.create("div").addClass("grid-aux-menu");
                
                _auxMenu.create("button").attr("type", "button").text(this.optionText.new).on("click", ()=>{this.setNew()});
                _auxMenu.create("button").attr("type", "button").text(this.optionText.delete).on("click", ()=>{
                    let index = this.getIndex();

                    if(index === null || index === false || index < 0 ||  index >= this._rowLength){
                        alert(this.optionText.select_record);
                        return;
                    }

                    if(confirm(this.optionText.delete_confirm)){
                        this.delete(this.getIndex());
                    }
                    
                });
                _auxMenu.create("button").attr("type", "button").text(this.optionText.save).on("click", ()=>{this.save()});

            }

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

                }).on("change", ()=>{this.setNew()});
            }
            if(this.actionButton){
                row.create("td").text("&nbsp;");
            }
            if(this.deleteButton){
                row.create("td").text("&nbsp;");
            }
            this.fields["__index_"] = {
                input: "hidden",
                config:{
                    type:"hidden",
                    name:"__index_"
                }
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
            this._data_grid = hiddenDiv.create({tagName:"input", type:"hidden", name:"__data_"});
            let pag = this.paginator;
            pag.change = $.bind(pag.change, this, "page");
            


        
            this._main.append(this.pag = new Paginator(pag));
   
            if(this.menu){
                this._main.append(this.createMenu(this.menu));
            }
        }

        _load(main:any){
            this._main = main.addClass("sg-grid");
        }

        createRow(data){
            
            let row = this._tbody.create("tr")
                .addClass("body-row")
                .ds("index", this._rowLength);
            
            let cell = null, 
                field = null, value = null, text = "", 
                info = null, input = null,_input = null, type = null;

            if(this.showEnum){
                cell = row.create("td").text(this._rowLength + 1);
            }
            if(this.ctrlSelect === "one" || this.ctrlSelect === "multiple"){
                cell = row.create("td");
                let ctrl =  cell.create({
                    tagName: "input",
                    type: (this.ctrlSelect === "one")? "radio": "checkbox",
                    name: this.id + "_chk",
                    value: this._rowLength,

                });
                ctrl.on("click", event => {
                    this.getRecord(event.currentTarget.value);
                });
            }

            if(this.actionButton){
                row.create("td").create("button").attr("type", "button").text("&raquo;");
            }
            if(this.deleteButton){
                row.create("td").create("button").attr("type", "button").text("&#215;");
            }
            data["__index_"] = this._rowLength;
            let hiddenFields = $.create({tagName:"div", style:{cssText:"display:none;"}});
            let f = this._forms[this._rowLength] = new Form;
            
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
                info.type = field.config.type;
                info.name = field.config.name + "_" + this._rowLength;
                info.value = value;
                
                if(field.config.parent){
                    info.parent = field.config.parent + "_" + this._rowLength;
                    info.parentValue = f.getInput(info.parent).getValue();
                }
                
                info.dataset = {"name": x};
                _input = f.createInput(input, info);
                _input.dataName = x;
                if(field.input == "hidden"){
                    hiddenFields.append(_input);
                }else{
                    cell = row.create("td").ds("name", x);
                    if(this.type === "default"){
                        cell.text(text);
                    }else{
                        cell.append(f.getInput(info.name));
                    }
                    
                    
                   
                }
            }

            if(cell){
                cell.append(hiddenFields);
            }

            this._rowLength++;
        }
        createRowORG(data){
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
                    
                    cell.create("div").addClass("zone-edit");

                    if(this.type === "default"){
                        cell.create("span").addClass("text").text(text);
                    } 
                }
            }

            if(cell){
                hiddenFields.append(I.create("input", {type:"hidden", name: "__mode_"+this._rowLength, value: data["__mode_"], dataset:{name:"__mode_"}}));
                hiddenFields.append(I.create("input", {type:"hidden", name: "__id_"+this._rowLength, value: data["__id_"], dataset:{name:"__id_"}}));
                hiddenFields.append(I.create("input", {type:"hidden", name: "__index_"+this._rowLength, value: this._rowLength, dataset:{name:"__index_"}}));
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
            
            cell = row.create("td").text("");
            if(this.actionButton){
                row.create("td").text("&nbsp;");
            }
            if(this.deleteButton){
                row.create("td").text("&nbsp;");
            }
            let hiddenFields = $.create({tagName:"div", style:{cssText:"display:none;"}});
            this._mainForm = new Form();
            for(let x in this.fields){
                let field = this.fields[x];
                value = field.config.default;
                info = Object.assign({}, field.config);

                input = (field.input === "hidden")? "input": field.input;
                info.type = (field.input === "hidden")? "hidden": field.config.type;
                //info.value = value;
                info.dataset = {"name": x};


                this._mainForm.createInput(input, info);//I.create(input, info);
                
                if(field.input == "hidden"){
                    hiddenFields.append(this._mainForm.getInput(x));
                }else{
                    cell = row.create("td").ds("name", x);
                    cell.append(this._mainForm.getInput(x));  
                }
               
            }
            this._mainForm.reset();
            if(cell){
                //hiddenFields.append(this._mainForm.createInput("input", {type:"hidden", name: "__mode_", value: "1", dataset:{name:"__mode_"}}));
                //hiddenFields.append(this._mainForm.createInput("input", {type:"hidden", name: "__id_", value: "", dataset:{name:"__id_"}}));
                //hiddenFields.append(this._mainForm.createInput("input", {type:"text", name: "__index_", value: "", dataset:{name:"__id_"}}));
                cell.append(hiddenFields);
            }
            
        }
        createCell(field){

            
        }

        setRecord(index:number, params:any) {
            
        }
        getRecord(index:number) {


            this._main.addClass("record-edit");
            
            let rows = this._tbody.queryAll(".body-row.active");

            rows.forEach(row => {
                $(row).removeClass("active");

            })
            let row = this._tbody.query(`.body-row[data-index='${index}']`);
            //let inputs = $(row).addClass("active").queryAll("td[data-name]");

            this._mainForm.setValue(this._forms[index].getValue());

            return;
            for(let _input of inputs){

                let context =  $(_input).query(".zone-edit");
                let input =  $(_input).query("[data-sg-input][data-name]");

                this._mainForm.getInput(_input.dataset.name).setValue();
                $(context).append(this._mainForm.getInput(_input.dataset.name).main())
                //$(_input).text(this._mainForm.getInput(_input.dataset.name));
                //let input = I.create("input", {id:_input});
                //this._mainForm.getInput(_input.dataset.name).setValue(input.getValue());
               
            }

            //this.getGrid();
        }
        getRecordORG(row:any) {
            


            let inputs = $(row).queryAll("[data-sg-input][data-name]");
  
            for(let _input of inputs){
                let input = I.create("input", {id:_input});
                this._mainForm.getInput(_input.dataset.name).setValue(input.getValue());
               
            }

            this.getGrid();
        }

        setValue(index:number, params:any) {
            
        }

        getValue() {
            
            return this._mainForm.getValue();  
        }

        getGrid(){
            let data = [], i = 0;

            for(let f of this._forms){
                data.push(this._forms[i++].getValue());
            }

            return data;
            
            
        }

        onsubmit(){
            this._data_grid.val(JSON.stringify(this.getGrid()));
            return true;
        }
        setData(data){
            this.data = data;
            this._rowLength = 0;
            this._tbody.text("");
            
            for(let record of this.data){
                this.createRow(record);
            } 
        }
        
        getIndex(){
            let index = null;
            if(this.ctrlSelect == "one"){
                let check = this._tbody.query(".body-row >td>input:checked");
                if(check){
                    index = check.value;
                }

            }else{
                let checks = this._tbody.queryAll(".body-row >td>input:checked");
                console.log(checks)
            }
            
            return index;

        }
        setNew(){
            this._check.get().checked =  true;
            this._main.removeClass("record-edit");
            this._mainForm.reset();
/*
            for(let x in this.fields){
                this._mainForm[x].setValue(this.fields[x].config.default);
            }*/
            this._mainForm.getInput("__mode_").setValue("1");
            this._mainForm.getInput("__id_").setValue("");
            this._mainForm.getInput("__index_").setValue("");

            
        }
        getSearchValue(){
            let input = this._main.query("input.search");

            return input.value;

        }
        insert(){
            let data = this.getValue();
            this.createRow(data);
        }

        delete(index){
            
            if(index >= this._rowLength || index === null){
                alert(this.optionText.select_record);
                return false;
            }

            let mode = this._forms[index].getInput("__mode__" + index).getValue();
            let classMode = "delete";
            switch(mode){
                case "1":
                    mode = "0";
                    break;
                case "2":
                    mode = "3";
                    break;
                case "3":
                    mode = "2";
                    classMode = "";
                    break;
                case "0":
                    mode = "1";
                    classMode = "";
                    break;
            }
            if(classMode === ""){
                this.getRow(index).removeClass("delete");
            }else{
                this.getRow(index).addClass(classMode);
            }
            
            this._forms[index].getInput("__mode__" + index).setValue(mode);
            
        }

        save(){
            let data = {};

            if(this._mainForm.valid()){
               
                data = this._mainForm.getValue();
                
                if(data["__mode_"] == '1' && data["__index_"] === ''){
                    this.createRow(data);
                    this.setNew();
                }else{
                    this.saveAt(data["__index_"], data);
                }
                
            }

            return data;
        }

        saveAt(index, data){
            
            if(this.type === "default"){
                let value = null;
                let cells = this._tbody.queryAll(`.body-row[data-index='${index}'] td[data-name]`);

                for(let cell of cells){
                    let name = $(cell).ds("name");
                    value = data[name];
                    
                    if(this._fieldData[name] && this._fieldData[name][value]){
                        $(cell).text(this._fieldData[name][value]);
                    }else{
                        $(cell).text(value);
                    }
                }
            }
            this._forms[index].setValue(data);
        }

        saveAtORG(index, data){



            let cells = this._main.queryAll(".body-row[data-index='"+index+"'] > [data-name]"); 
            
            if(cells.length == 0){
                return false;
            }

            let _text:any, _input:any, input:any, name = "", value = "", text = "";
            db (99)
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
        createMenu(info:any){
            info.parentContext = this;
            let _menu = new Menu(info);
            return $(_menu.get());
        }
        valid(){

        }

        setCaption(text:string){
            let caption = this._main.query(".caption > .text");
            caption.innerHTML = text;
            
        }

        setPage(page:number){
            this.pag.setPage(page);
        }

        getRow(index){
            let row = this._tbody.query(`.body-row[data-index='${index}']`);

            if(row){
                
                return $(row);
            }

            return false;
        }

    }




     return  Grid;
})(_sgQuery);