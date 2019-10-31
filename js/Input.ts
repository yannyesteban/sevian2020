class I{
    static _ele_ = [];
    static create(name, info){
        return new I._ele_[name](info);
    }
    static register(name, classInput){
        I._ele_[name] = classInput;
    }
}

var $I = {};
var Input = (($) => {  

    


    class SGDate{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "calendar";//
        value:string = "";
        className = "";
        data:any = false;
        propertys:any = false;
        dataset:object = null;
        events:any = false;
        placeholder:string = "";

        childs:boolean = false;
        parent:string = "";
        _main:object = null;

        status:string = "valid";
        mode:string = "request";
    }  
    class Input{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "";
        value:string = "";
        className = "";
        data:any = false;
        propertys:object = {};
        dataset:object = null;
        style:object = {};
        events:any = false;
        placeholder:string = "";
        rules:object = null;

        childs:boolean = false;
        parent:string = "";

        _main:object = null;

        status:string = "valid";
        mode:string = "request";

        evalChilds:any = () => {};

        constructor(opt: any){
            
            for(var x in opt){
                if(this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }

            let main = this._main = (this.id)? $(this.id): false;

            if(!main){
                
                this._create(false);
            }else{
                
                if(main.ds("sgInput")){
                    return;
                }
            }

            
            


            let target = (this.target)? $(this.target): false;

            if(target){
                target.append(this._main);
            }
            
        }

        _create(target:any){
            let info = {};
            switch(this.type){
                case "text":
                case "password":
                case "hidden":
                case "button":
                case "submit":
                case "color":
                case "range":	
                    info.tagName = "input";
                    info.type = this.type;
                    break;
                case "select":
                    info.tagName = this.type;
                    break;
                case "multiple":
                    info.tagName = "select";
                    this.propertys.multiple = "multiple";
                    break;
                case "textarea":
                    info.tagName = this.type;
                    break;
                default:
                    info.tagName = "input";
                    info.type = "text";

            }
            if(this.id){
                info.id = this.id;
            }
            if(this.name){
                info.name = this.name;
            }
            if(this.value){
                info.value = this.value;
            }
            
            this._main = $.create(info).addClass("type-input").addClass(this.className);

            for(var x in this.events){

                //let action = $.bind(this.events[x], this._main);
				this._main.on(x, $.bind(this.events[x], this, "event"));
			}
            
            if(this.childs){
                
                this._main.on("change", $.bind(this.evalChilds, this, "event")); 
            }

			this._main.prop(this.propertys);
			this._main.style(this.style);

            if(this.type === "select" || this.type === "multiple"){
				this.createOptions(false);
            }
            this._main.ds(this.dataset);

            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "input");
            this._main.ds("sgType", this.type);
            if(this.parent){
                this._main.ds("parent", this.parent);
            }
            if(this.childs){
                this._main.ds("childs", "childs");
            }
            /*
            if(this.dataset){
                for(let x in this.dataset){
                    this._main.ds(x, this.dataset[x]);
                }
            }*/
            this.setValue(this.value);
        }
        setValue(value:any){
			this.get().value = value;
        }
        
        getValue(){
			return this.get().value;
		}
        _load(main:any){

        }

        get(){
            return this._main.get();
        }

        hasChilds(){
            if(this._main.ds("childs")){
                return true;
            }
            return false;
        }
        createOptions(parentValue:any){
            
            if(!this.data){

                let data = this._main.queryAll("option");

                this.data = [];
                data.forEach((e)=>{
                    
                    this.data.push([e.value, e.text, e.dataset.parentValue]);


                });


                
                
            }

			let i,
				option,
				vParent = [],
				_ele = this.get();
			
			_ele.length = 0;
			
			if(this.parent){
                let aux = (parentValue + "").split(",");
                
                
				for(i = 0; i < aux.length; i++){
					vParent[aux[i]] = true;
				}
			}
	
			if(this.placeholder){
				option = document.createElement("OPTION");
				option.value = "";
				option.text = this.placeholder;
				_ele.options.add(option);
            }
            
            
			for (i in this.data){
                option = document.createElement("OPTION");
                option.value = this.data[i][0];
                option.text = this.data[i][1];
                option.dataset.parentValue = this.data[i][2] || "";
               
                

				if(vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*"){
                    
                }else{
                   
                   option.style.display = "none";
                }
                _ele.options.add(option);
			}
			/*for (i in this.data){
				if(vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*"){
					option = document.createElement("OPTION");
					option.value = this.data[i][0];
					option.text = this.data[i][1];
					_ele.options.add(option);
				}
			}*/
			
        }
        
        evalOptions(parentValue:any){

        }

        getName(){
            return this._main.get().name;
        }
        getId(){
            return this._main.get().id;
        }
        getText(){
            if(this._main.get().type){
                alert(8)
            }
        }
        ds(prop, value){
            this._main.ds(prop, value);
        }
        focus(){
            this._main.get().focus();
            
        }
        select(){
            this._main.get().select();
        }
    }
    $I.std = Input;
    I.register("input", Input);
    return Input;
})(_sgQuery);


var InputDate = (($) => {
    class InputCalendar{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "calendar";
        value:string = "";
        className = "";
        data:any = false;
        propertys:object = {};
        dataset:object = null;
        style:object = {};
        events:any = false;
        placeholder:string = "";

        outFormat:string = "%d/%m/%yy";
        format:string = "%yy-%mm-%dd";

        childs:boolean = false;
        parent:string = "";
        _main:object = null;
        _input:object = null;
        status:string = "valid";
        mode:string = "request";
        constructor(opt: any){
            
            for(var x in opt){
                if(this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }

            let main = this._main = (this.id)? $(this.id): false;


            if(!main){

                
                this._create(false);
            }else{
                
                if(main.ds("sgInput")){
                    return;
                }
            }

            
           


            let target = (this.target)? $(this.target): false;

            if(target){
                target.append(this._main);
            }
            
        }

        _create(target:any){
            let info = {};

            let main = this._main = $.create("div").addClass("input-calendar");
            switch(this.type){
                case "text":
                    info.tagName = "input";
                    info.type = "hidden";
                    break;
                case "calendar":
                    info.tagName = "input";
                    info.type = "hidden";
                    break;
                case "hidden":
                default:
                    info.tagName = "input";
                    info.type = "hidden";

            }
            if(this.id){
                info.id = this.id;
            }
            if(this.name){
                info.name = this.name;
            }
            if(this.value){
                info.value = this.value;
            }
            let input = this._input = main.create(info).addClass("type-input").addClass(this.className);

            let auxTxt = main.create({tagName: "input", type: "text", value: "", name:this.name+"_aux"})
            .on("change", (event)=>{
                
                let date = sgDate.dateFrom(event.currentTarget.value, this.outFormat);
                
                if(date){
                    input.val(sgDate.evalFormat(date, this.format)); 
                }else{
                    input.val(event.currentTarget.value);
                }
                

            }).addClass("type-input-out");

            for(var x in this.events){
				auxTxt.on(x, $.bind(this.events[x], this, "event"));
			}
			
			auxTxt.prop(this.propertys);
			auxTxt.style(this.style);

            this._main.ds(this.dataset);
            
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "date");
            this._main.ds("sgType", this.type);

            this.setValue(this.value);
            
            let div2 = $.create("div");
            let p = this.picker = new sgDate.Picker({
                id_:this.id+"_calendar",
                target:div2,
                onselectday: (date)=>{
                   
                    auxTxt.val(sgDate.evalFormat(date, this.outFormat));
                    input.val(sgDate.evalFormat(date, this.format));
                    this.hide();
                }
            });
           

            let btn = main.create({tagName: "button", type: "button", innerHTML: "&raquo;"})
            .on("click", (event)=>{

                
                let date = sgDate.dateFrom(input.val(), "%yy-%mm-%dd");

                p.setCal(date || new Date());
                p.show({context:event.currentTarget});
                
            });
        }
        hide(){
            this.picker.hide();
        }
        setValue(value:any){

            
            let date = sgDate.dateFrom(value, this.format);
            let auxTxt = $(this._main.query(".type-input-out"));
            let value2 = "";
            if(date){
                value2 = sgDate.evalFormat(date, this.outFormat);
            }else{
                value = "";
            }

            this._input.val(value);

            if(auxTxt){
                auxTxt.val(value2);
            }
			
        }
        
        getValue(){
            let elem = this._main.query(".type-input");
            if(elem){
                return elem.value;
            } 
            return "";
            
		}
        _load(main:any){

        }

        get(){
            return this._main.get();
        }

        
        getName(){
            return this._main.get().name;
        }
        getId(){
            return this._main.get().id;
        }
        getText(){
            if(this._main.get().type){
                alert(8)
            }
        }
        ds(prop, value){
            this._main.ds(prop, value);
        }
        focus(){
            let elem = this._main.query(".type-input-out");
            if(elem){
                elem.focus();
            }
            
        }
        select(){
            let elem = this._main.query(".type-input-out");
            if(elem){
                elem.select();
            }
            
        }
    }


    I.register("date", InputCalendar);
    return InputCalendar;
})(_sgQuery);