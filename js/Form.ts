//import { Query as $} from './Query.js';


var Form = (($) => {

    class Form{
        
        target: any = "";;
        name: any = "";;
        id:any = "";
        value: any = "";
        caption:string = "";
        type:string = "dropdown";
        className = "sevian";
        iconClass:string = "";
        child:any = null;
        open:boolean = false;
        text:string = "";
        elements:object[] = [];

        _main:object = null;
        _page:object = null;

        static _objs = [];

        static init(){
            let pages = $().queryAll(".sg-form.sg-detect");
    
            for(let x of pages){
                if($(x).ds("sgForm")){
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
                
                if(main.ds("sgForm")){
                    return;
                }
    
                if(main.hasClass("sg-form")){
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

        }

        _create(main:any){
            
            this._main = main.addClass("sg-form").addClass(this.className);

            main.create({tagName:"div",className:"caption"})
            .add({tagName: "span", className: "icon" + this.iconClass})
            .add({tagName: "span", className: "text", innerHTML: this.caption})

            .add({tagName: "span", className: "arrow"});

            let page = this._page = main.create({tagName:"div",className:"page"});
            
            if(this.text){
                page.text(this.text);
            }

            if(this.elements){
                this._addElements(page, this.elements);

            }

        }

        _load(main:any){
            this._main = main.addClass("sg-page");
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
            info.parentContext = this;
            let _menu = new Menu(info);
            return $(_menu.get());
        }
        createPage(info:any){
            
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
            return new $I["std"](info);
            return new Input(info)
        }
        createField(info:any){
            let field = this._page.create("div").addClass("field");
            field.create("label").addClass("label").prop("htmlFor", info.id).text(info.caption);
            field.create("div").addClass("input").append(this.createInput(info).get());
            return field;
        }
        get(){
            return this._main; 
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

