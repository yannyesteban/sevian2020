//import { Query as $} from './Query.js';


var Form2 = (($) => {

    

    
    class Field{
        caption:string = "";
        input:string = "input";
        config:object = {};
        className:string = "";

        _main:object = null;
        _input:object = null;
        _label:object = null;

        constructor(){
            let field = this._page.create("div").addClass("field");
            field.create("label").addClass("label").prop("htmlFor", info.id).text(info.caption);
            field.create("div").addClass("input").append(this.createInput(info).get());
            return field;
        }
        _create(main:any){

            main.addClass("field");
            main.create("label").addClass("label").prop("htmlFor", config.id).text(config.caption);
            main.create("div").addClass("input").append(this.createInput(info).get());
        }
    }



    class Form{
        
        target: any = "";
        name: any = "";
        id:any = "";
        value: any = "";
        caption:string = "";
        type:string = "dropdown";
        className = "sevian";
        iconClass:string = "";

        fields:any[] = null;
        pages:any[] = [];
        menu:object = null;

        child:any = null;
        open:boolean = false;
        //text:string = "";
        elements:object[] = [];

        _main:object = null;
        _page:object = null;
        _pg:object = [];
        _tab:object = null;
        _inputs:object[] = [];

        parentContext:any = null;

        static _objs = [];

        static init(){
            let pages = $().queryAll(".sg-form.sg-detect");
    
            for(let x of pages){
                if($(x).ds("sgForm")){
                    continue;
                }
                if(x.id){
                    Form.create(x.id,{id:x});
                }else{
                    new Form({id:x});
                }
            }
        }

        static create(name, info:any){
            Form._objs[name] = new Page(info);
            return Form._objs[name];
        }

        static get(name){
            return Form._objs[name];
        }

        constructor(info: any){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = (this.id)? $(this.id): false;

            if(main){
                
                if(main.ds("sgForm")){
                    return;
                }
    
                if(main.hasClass("sg-form")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
            }

            main.ds("sgForm", "form").addClass(`form-${this.type}`);

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

            let target = (this.target)? $(this.target): false;
            if(target){
                target.append(this._main);
            }
            
        }

        _create(main:any){
            
            this._main = main.addClass("sg-form").addClass(this.className);

            main.create({tagName:"div",className:"caption"})
            .add({tagName: "span", className: "icon" + this.iconClass})
            .add({tagName: "span", className: "text", innerHTML: this.caption})

            .add({tagName: "span", className: "arrow"});

            let page = this._page = main.create({tagName:"div",className:"page"});
            /*
            if(this.text){
                page.text(this.text);
            }
            */
            if(this.pages){
                this.addPages(this._page, this.pages);
               
            }
            if(this.fields){
                this.addFields(this.fields);
               
            }
            if(this.elements){
                //this._addElements(page, this.elements);

            }
            if(this.menu){
                main.append(this.createMenu(this.menu));
            }

        }

        _load(main:any){
            this._main = main.addClass("sg-page");
        }
        
        addField(field){
            if(field.page){
                
                if(this._pg[field.page]){
                    this._page = this._pg[field.page];
                }
            }else{
                //return;
            }
            this.createField(field);
            
        }

        addFields(fields){
            for(let x in fields){
                fields[x].context = this.getContext();
                this.addField(fields[x]);
            }
            return;
            for(let field of fields){
                this.addField(field);
            }
        }
        addPages(body, pages:any){

            for(let page of pages){
               
                switch(page.type){
                    case "page":
                        let ele = new Page(page.config);
                        this._pg[page.name] = ele.getPage();
                        body.append(this._pg[page.name].get());
                        break;
                    case "tab":
                        this._tab = new Tab(page.config);
                        body.append(this._tab.get());
                        this._pg[page.name] = false;
                        break;
                    case "tab_page":
                        this._pg[page.name] = this._tab.add(page.config);
                        this._tab.setValue(0);
                        break;
                    case "tag":
                        let _page = this._pg[page.name] = $.create(page.config.tagName).addClass(["page","container"]);
                        body.append(_page.get());
                        break;
                }
                
                if(page.pages){
                    this.addPages(this._pg[page.name], page.pages);
                }
                
            }
        }


        _addElements(page:any, elements:any){

            for(let x in elements){

                let info = elements[x];

                switch(info.set){
                    case "input":
                        let input = new Input(info);
                        page.append(input.get());
                        break;
                    case "field":
                        page.append(this.createField(info));
                        break;
                    case "page":
                        page.append(this.createPage(info));
                        break;
                    case "tab":
                        page.append(this.createTab(info));
                        break;
                    case "menu":
                        page.append(this.createMenu(info));
                        break;
                    case "tag":
                        page.append(this.createTag(info));
                        break;
                }

            }

        }
        createTag(info:any){
            
            let _page = $.create(info.tagName).addClass(["page","container"]);
            
            if(info.elements){
                
                this._addElements(_page, info.elements);
            }

            return _page;
          
        }
        createMenu(info:any){
            info.context = this.getContext();
            let _menu = new Menu(info);
            return $(_menu.get());
        }
        createPage(info:any){
            return new Page(info);
            let _page = new Page(info);
            
            if(info.elements){
                
                this._addElements(_page.getPage(), info.elements);
            }

            return $(_page.get());
          
        }

        createTab(info:any){
           
            let _tab = new Tab(info);
            
            if(info.elements){
                
                for(let _info of info.elements){
                    let page = _tab.add(_info);
                    if(_info.elements){
                        this._addElements(page, _info.elements);
                    }

                }
                _tab.setValue(0);
            }
            return $(_tab.get());
        }
        createInput(info:any){
            this._inputs[info.name] = I.create(info.input, info)
            return this._inputs[info.name];
           
        }
        createField(input:string, info:any){
			info = input;
            
            if(input.type === "hidden"){
                input.input = "input";
				//info.type = "hidden";
				input.type = "hidden";
				
                this._inputs[info.name] = I.create(input.input, input);
                this._main.append(this._inputs[input.name]);
                return false;

            }
            
            let field = this._page.create("div").addClass("field");

            let ind = "";

            if(info.rules && info.rules.required){
                ind = "<span class='ind'>*</span>";
            }
            if(info.parent){
                info.getParentValue = () =>{
                    return this.getInput(info.parent).getValue();
                }
            }
            if(info.childs){
                
                info.evalChilds = (event)=>{
                    this.evalChilds(info.name)
                }
            }
            if(!input.input){
				return;
			}
            this._inputs[info.name] = I.create(input.input, info);
            field.create("label").addClass("label").prop("htmlFor", info.id).text(info.caption + ind);
            field.create("div").addClass("input").append(this._inputs[info.name]);
            return field;
        }
        get(){
            return this._main; 
        }

        delete(){
            this._main.removeDs("sgForm");
            this._main.removeClass("sg-form");
            this._main.text("");
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
        getInput(name){
            
            return this._inputs[name];
        }
        
        getInputs(){
            let inputs = {};
            
            let elem = null, e = null;
            
            let elems = this._main.queryAll("[data-sg-input][data-sg-name]");
            
            for(e of elems){
                
                elem = $(e);
                
                inputs[elem.ds("sgName")] = I.create(elem.ds("sgInput"),{
                    id: elem,
                    name: elem.ds("sgName"),
                    type: elem.ds("sgInput")
                });
            }

            return inputs;
        }
        setValue(data){
            
            for(let x in data){
            
                if(this._inputs[x]){
                    this._inputs[x].setValue(data[x]);
                }
                
            }
            
            return this;
            
        }
        reset(){
            
            for(let name in this._inputs){
                this._inputs[name].reset();
                            
            }
            return this;
        }
        getValue(){
            
            let data = {};
            
            for(let name in this._inputs){
              
                data[name] = this._inputs[name].getValue();
                
                
            }

            return data;
            /*
            let inputs = this.getInputs();
            let data = [];
            let name = null;
            
            for(name in inputs){
                data[name] = inputs[name].getValue();
            }

            return data;
            */
        }
        getFormData(){
            let formData = new FormData();
            for(let name in this._inputs){
                formData.append(name, this._inputs[name].getValue());
            }
            
            return formData;
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


           
            return;
            let inputx = null, e = null, elem = null, value = null;
            e = this._main.query(`[data-sg-name='${parent}']`);
            elem = $(e);
            input = I.create(elem.ds("sgInput"),{id:elem, parent:parent}); 
            value = input.getValue();
            let elems = this._main.queryAll(`[data-sg-input][data-parent='${parent}']`);
            
            for(e of elems){
                elem = $(e);
                input = I.create(elem.ds("sgInput"),{id:elem, parent:parent});
                input.createOptions(value);
                if(input.hasChilds()){
                    this.evalChilds(input.getName());
                }
            }


        }
        valid(){
            let data = this.getValue();
            let rules = null, config = null;
            let inputs = this._inputs;
            let msg = null;

            for(let x in this.fields){
                config = this.fields[x].config;
                rules = config.rules;

                if(rules){
                    msg = Sevian.Valid.send(rules, inputs[config.name].getValue(), config.caption, data);
                    if(msg){
                        alert(msg);
                        inputs[config.name].focus();
                        inputs[config.name].select();
                        return false;
                    }
                }
                
            }
            return true;
        }

        setContext(context){
            this.parentContext = context;
            return this;
        }

        getContext(){
            if(this.parentContext){
                return this.parentContext;
            }
            return this;
            
        }

        setMode(value){
            this._main.addClass("mode-" + value);
            return this;
            
        }
    }


let json = {
    caption:"Formulario Uno",
    className:"summer",
    elements:[
        {
            element:"input",
            input:"ssInput",
            type:"text",
            id:"",
            name:"cedula",
            caption:"Cédula",
            value:"12474737",
            data:[],
            parent:false,
            propertys: {},
		    style: {},
            rules:{},
            events:{},
        },
        {
            element:"page",
            caption:"Datos Personales",
            elements:[
                {input:"text"},
                {input:"text"},
            ]
        },
        {
            element:"tab",
            caption:"categorias",
            pages:[
                {
                    caption:"pagina Uno",
                    elements:[
                        {input:"text"},
                        {input:"text"},
                    ]
                },
                {
                    caption:"pagina Dos",
                    elements:[
                        {input:"text"},
                        {input:"text"},
                    ]
                },

            ]
        }
    ],
    

}
$(window).on("load", function(){

    Form.init();

    if(false){
        let p = new Form({
            caption:"Form ONE",
            id:"form_one",
            elements:[
                {
                    set:"input",
                    type:"text",
                    id:"xy",
                    value:"yanny esteban",
                },
                {
                    set:"field",
                    name:"cedula",
                    id:"f_cedula",
                    caption:"Cédula",
                    type:"text",
                },
                {
                    set:"field",
                    name:"nombre",
                    id:"f_nombre",
                    caption:"Nombre",
                    type:"text",
                },
                {
                    set:"field",
                    name:"apellido",
                    id:"f_apellido",
                    caption:"Apellido",
                    type:"text",
                },
                {
                    set:"page",
                    
                    //id:"f_apellido",
                    caption:"Datos Personales",
                   
                    elements:[
                        {
                            set:"field",
                            name:"nacimiento",
                            id:"f_nacimiento",
                            caption:"Fecha de Nacimiento",
                            type:"text",
                        },
                        {
                            set:"field",
                            name:"lugar_nac",
                            id:"f_lugar_nac",
                            caption:"Lugar de Nacimiento",
                            type:"text",
                        },
                        {
                            set:"menu",
                            name:"modo",
                            //id:"f_modo",
                            caption:"",
                            type:"accordion",
                            subType:"system",
                            className:["sevian", "nav"],
                            useIcon: true,
                            tagLink:"button",
                            items:[
                                {
                                    caption:"Guardar",
                                    //useCheck:true,
                                },
                                {
                                    caption:"Volver"
                                },
                            ]
                        },
                    ]
                },
                {
                    set:"tab",
                    tabs:[
                        {
                            title:"tab I",
                            elements:[
                                {
                                    set:"field",
                                    name:"edad",
                                    id:"f_edad",
                                    caption:"Edad",
                                    type:"text",
                                },
                                {
                                    set:"field",
                                    name:"Ciudad",
                                    id:"f_ciudad",
                                    caption:"Ciudad",
                                    type:"text",
                                },
                            ]
                        },
                        {
                            title:"tab II",
                            elements:[
                                {
                                    set:"field",
                                    name:"estado",
                                    id:"f_estado",
                                    caption:"Estado",
                                    type:"text",
                                },
                                {
                                    set:"field",
                                    name:"municipio",
                                    id:"f_municipio",
                                    caption:"Municipio",
                                    type:"text",
                                },
                            ]
                        },
                        {
                            title:"tab III",
                            elements:[
                                {
                                    set:"field",
                                    name:"parroquia",
                                    id:"f_parroquia",
                                    caption:"Parroquia",
                                    type:"text",
                                },
                                {
                                    set:"field",
                                    name:"localidad",
                                    id:"f_localidad",
                                    caption:"Localidad",
                                    type:"text",
                                },
                            ]
                        },
                        {
                            title:"tab IV",
                            elements:[
                                {
                                    set:"page",
                                    
                                    //id:"f_apellido",
                                    caption:"Datos Personales",
                                   
                                    elements:[
                                        {
                                            set:"field",
                                            name:"nacimiento",
                                            id:"f_nacimiento",
                                            caption:"Fecha de Nacimiento",
                                            type:"text",
                                        },
                                        {
                                            set:"field",
                                            name:"lugar_nac",
                                            id:"f_lugar_nac",
                                            caption:"Lugar de Nacimiento",
                                            type:"text",
                                        },
                                    ]
                                },
                            ]
                        }

                    ]
                },
                {
                    set:"tab",
                    tabs:[
                        {
                            title:"tab I",
                            elements:[
                                {
                                    set:"field",
                                    name:"edad",
                                    id:"f_edad",
                                    caption:"Edad",
                                    type:"text",
                                },
                                {
                                    set:"field",
                                    name:"Ciudad",
                                    id:"f_ciudad",
                                    caption:"Ciudad",
                                    type:"text",
                                },
                            ]
                        },
                        {
                            title:"tab II",
                            elements:[
                                {
                                    set:"field",
                                    name:"estado",
                                    id:"f_estado",
                                    caption:"Estado",
                                    type:"text",
                                },
                                {
                                    set:"field",
                                    name:"municipio",
                                    id:"f_municipio",
                                    caption:"Municipio",
                                    type:"text",
                                },
                            ]
                        },
                        {
                            title:"tab III",
                            elements:[
                                {
                                    set:"field",
                                    name:"parroquia",
                                    id:"f_parroquia",
                                    caption:"Parroquia",
                                    type:"text",
                                },
                                {
                                    set:"field",
                                    name:"localidad",
                                    id:"f_localidad",
                                    caption:"Localidad",
                                    type:"text",
                                },
                            ]
                        },
                        {
                            title:"tab IV",
                            elements:[
                                {
                                    set:"page",
                                    
                                    //id:"f_apellido",
                                    caption:"Datos Personales",
                                   
                                    elements:[
                                        {
                                            set:"field",
                                            name:"nacimiento",
                                            id:"f_nacimiento",
                                            caption:"Fecha de Nacimiento",
                                            type:"text",
                                        },
                                        {
                                            set:"field",
                                            name:"lugar_nac",
                                            id:"f_lugar_nac",
                                            caption:"Lugar de Nacimiento",
                                            type:"text",
                                        },
                                    ]
                                },
                            ]
                        }

                    ]
                },
                {
                    set:"field",
                    name:"modo",
                    id:"f_modo",
                    caption:"Modo",
                    type:"select",
                },
                {
                    set:"menu",
                    name:"modo",
                    //id:"f_modo",
                    caption:"",
                    type:"accordion",
                    subType:"system",
                    className:["sevian", "nav"],
                    useIcon: true,
                    tagLink:"button",
                    items:[
                        {
                            caption:"Save",
                            action:function(){
                                alert(this.className)
                            }
                            //useCheck:true,
                        },
                        {
                            caption:"Restore"
                        },
                    ]
                },
                {
                    set:"tag",
                    tagName:"div",
                    elements:[
                        {
                            set:"field",
                            caption:"Profesion",
                            type:"text",
                            name:"prop",
                            id:"f_prop",
                        },
                        {
                            set:"field",
                            caption:"Estudios",
                            type:"text",
                            name:"estudio",
                            id:"f_estudio",
                        },
                        {
                            set:"field",
                            caption:"Estudios II",
                            type:"text",
                            name:"estudio2",
                            id:"f_estudio2",
                        },
                    ]
                }

            ]

        });
        
    }
 })
/*
let f = new Form();

f.add({

    set:"Page",
    name:"xxx",
    caption:"",
    elements:{

    }
    
});
*/


//f.page("xxx").add({});
//f.tab("xxx").add({});
//f.add();

return Form;

})(_sgQuery);

