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
 
    class Input{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "";
        caption:string = "";
        value:string = "";
        default:string = "";
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
        parentValue:any = null;

        _main:object = null;
        _input:object = null;

        status:string = "valid";
        mode:string = "request";

        evalChilds:any = () => {};
        getParentValue: any = () => {};

        constructor(info: any){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
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
            
            this._input = this._main = $.create(info).addClass("type-input").addClass(this.className);

            for(var x in this.events){

                //let action = $.bind(this.events[x], this._main);
				this._main.on(x, $.bind(this.events[x], this, "event"));
			}
            
            if(this.childs){
                this._main.ds("childs", "childs");
                this._main.on("change", $.bind(this.evalChilds, this, "event")); 
            }

			this._main.prop(this.propertys);
			this._main.style(this.style);

            if(this.type === "select" || this.type === "multiple"){
				this.createOptions(this.parentValue);
            }
            this._main.ds(this.dataset);

            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "input");
            this._main.ds("sgType", this.type);
            if(this.parent){
                this._main.ds("parent", this.parent);
            }
           
            
            this.setValue(this.value);
        }
        setValue(value:any){

            if(this.parent){
                let parentValue = this.getParentValue();

                if(parentValue != this.parentValue){
                    this.createOptions(parentValue);
                }
            }
			this._input.val(value);
        }
        
        getValue(){
            return this.get().value;
		}

        _load(main:any){

        }

        get(){
            
            return this._main.get();
        }
        main(){
            
            return this._main;
        }

        hasChilds(){
            if(this._main.ds("childs")){
                return true;
            }
            return false;
        }
        createOptions(parentValue:any){
            
            

			let i,
				option,
				vParent = [];
			
                this._main.get().length = 0;
			
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
				this._main.get().options.add(option);
            }
            

			for (i in this.data){
				if(vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*"){
                    
					option = document.createElement("OPTION");
					option.value = this.data[i][0];
					option.text = this.data[i][1];
					this._main.get().options.add(option);
				}
			}
			
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

        reset(){
            this.setValue(this.default);
        }
    }
    
    I.register("input", Input);
    return Input;
})(_sgQuery);

var Hidden = (($) => {  
 
    class Hidden{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "hidden";
        caption:string = "";
        value:string = "";
        default:string = "";
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
        parentValue:any = null;

        _main:object = null;
        _input:object = null;

        status:string = "valid";
        mode:string = "request";

        evalChilds:any = () => {};
        getParentValue: any = () => {};

        constructor(info: any){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
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
            
            info.tagName = "input";
            info.type = "hidden";
            if(this.id){
                info.id = this.id;
            }
            if(this.name){
                info.name = this.name;
            }
            if(this.value){
                info.value = this.value;
            }
            
            this._input = this._main = $.create(info).addClass("type-input").addClass(this.className);


			this._main.prop(this.propertys);
			this._main.style(this.style);

            this._main.ds(this.dataset);

            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "input");
            this._main.ds("sgType", this.type);
           
            
            this.setValue(this.value);
        }
        setValue(value:any){
            this._input.val(value);
            return this;
        }
        
        getValue(){
            return this.get().value;
		}

        _load(main:any){

        }

        get(){
            
            return this._main.get();
        }
        main(){
            
            return this._main;
        }

        hasChilds(){
            return false;
        }
        
        createOptions(parentValue:any){
			
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

        reset(){
            this.setValue(this.default);
        }
    }
    
    I.register("hidden", Hidden);
    return Hidden;
})(_sgQuery);

var InputDate = (($) => {
    
    class InputCalendar{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "calendar";
        caption:string = "";
        value:string = "";
        default:string = "";
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
        main(){
            return this._main;
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
        reset(){
            this.setValue(this.default);
        }
    }


    I.register("date", InputCalendar);
    return InputCalendar;
})(_sgQuery);

var InputInfo = (($) => {  
 
    class InputInfo{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "";
        caption:string = "";
        value:string = "";
        default:string = "";
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
        parentValue:any = null;

        _main:object = null;
        _input:object = null;

        status:string = "valid";
        mode:string = "request";

        _data:object = null;
        evalChilds:any = () => {};
        getParentValue: any = () => {};

        constructor(info: any){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
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
            
            info.tagName = "input";
            info.type = "hidden";
            if(this.id){
                info.id = this.id;
            }
            if(this.name){
                info.name = this.name;
            }
            if(this.value){
                info.value = this.value;
            }
            
            this._main = $.create("div").addClass("input-info").addClass(this.className);
            this._input = this._main.create(info);
            this._text = this._main.create("div").addClass("text");

            for(var x in this.events){
				this._main.on(x, $.bind(this.events[x], this, "event"));
			}
            
            if(this.childs){
                this._main.ds("childs", "childs");
                this._input.on("change", $.bind(this.evalChilds, this, "event")); 
            }

			this._main.prop(this.propertys);
			this._main.style(this.style);

            if(this.data){
				this.createOptions(this.parentValue);
            }
            this._main.ds(this.dataset);

            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "inputInfo");
            this._main.ds("sgType", "default");
            if(this.parent){
                this._main.ds("parent", this.parent);
            }
           
            
            this.setValue(this.value);
        }
        setValue(value:any){


            if(this.parent){
                let parentValue = this.getParentValue();

                if(parentValue != this.parentValue){
                    this.createOptions(parentValue);
                }
            }

            if(this._data){
                if(this._data[value]){
                    this._text.text(this._data[value]);
                    this._input.val(value);
                }else{
                    this._text.text("");
                    this._input.val("");
                }
            }else{
                this._text.text(value);
                this._input.val(value);
            }

            
            
        }
        
        getValue(){
            return this._input.val();
		}

        _load(main:any){

        }

        get(){
            
            return this._main.get();
        }
        main(){
            
            return this._main;
        }

        hasChilds(){
            if(this._main.ds("childs")){
                return true;
            }
            return false;
        }
        createOptions(parentValue:any){
            
            this._data = {};

			let i,
				option,
				vParent = [];
			
			if(this.parent){
                let aux = (parentValue + "").split(",");
                
                for(i = 0; i < aux.length; i++){
					vParent[aux[i]] = true;
				}
			}

			for (i in this.data){
                
                if(vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*"){
                    this._data[this.data[i][0]] = this.data[i][1];
				}
			}
			
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
            this._input.get().select();
        }

        reset(){
            this.setValue(this.default);
        }
    }
    
    I.register("inputInfo", InputInfo);
    return InputInfo;
})(_sgQuery);

var Multi = (($) => {
    class Multi1{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "";
        caption:string = "";
        value:string = "";
        default:string = "";
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
        parentValue:any = "";
        _main:object = null;
        _input:object = null;
        _value:object = null;
        status:string = "valid";
        mode:string = "request";

        evalChilds:any = () => {};
        getParentValue: any = () => {};
        doValues:Function = (inputs:any) => {
            let value = "";
            inputs.forEach((e)=>{
                value += ((value !== "")? ",": "") + e.value;
            });
            
            return value;
        }; 

        constructor(info: any){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = this._main = (this.id)? $(this.id): false;

            if(!main){
               
                this._create(false);
            }else{
                
                if(main.ds("sgInput")){
                    //return;
                }
            }
            if(info.doValues){
                this.doValues = $.bind(info.doValues, this, "inputs");
            }
            
            


            let target = (this.target)? $(this.target): false;

            if(target){
                target.append(this._main);
            }
            
        }

        _create(target:any){
            let info = {};

            switch(this.type){
                case "radio":
                case "checkbox":
                    break;
                default:
                    this.type = "radio";
                    break;
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
            
            this._main = $.create("div").addClass("input-multi").addClass("type-input").addClass(this.className);
            if(this.type === "checkbox"){
                this._input = this._main.create({tagName:"input", type: "text", name: this.name});
            }
            
            this._main.ds(this.dataset);
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "multi");
            this._main.ds("sgType", this.type);

            if(this.parent){
                this._main.ds("parent", this.parent);
            }
            if(this.childs){
                this._main.ds("childs", "childs");
            }
            
            this.createOptions(this.parentValue);
            
            this.setValue(this.value);
           
        }
        setValue(value:any){

            this.value = value;


            if(Array.isArray(value)){
                let data = [];
                value.forEach((v) => {
                    data[v] = v;
                });

                let input = this._main.queryAll("input.option");

                input.forEach((input) => {
                    if(data[input.value] !== undefined){
                        input.checked = true;
                    }else{
                        input.checked = false;
                    }
                });

            }
            
            if(Array.isArray(value)){
                this._input.val(JSON.stringify(value));
            }else{
                //this._input.val(value);
            }
            
            return false;
        }
        
        getValue(){

            if(this.type === "radio"){
                let input = this._main.query("input.option:checked");
                
                if(input){
                
                    return input.value;
                }
                
            }else{
                let inputs = this._main.queryAll("input.option:checked");
                if(inputs){
                    return this.doValues(inputs);
                }
            }
            
            return "";
        }

        
        
        _load(main:any){

        }

        get(){
            return this._main.get();
        }
        main(){
            return this._main;
        }
        hasChilds(){
            if(this._main.ds("childs")){
                return true;
            }
            return false;
        }

        createInputs(data){
            data.forEach((d, index) => {
                let div = this._main.create("span");
              
                div.create(
                    {tagName:"input",
                    type: this.type,
                    name: this.name + ((this.type === "checkbox")?"_" + index: ""),
                    id:this.id + "_" + index,
                    className: "option",
                    value:d[0]})
                .on("click", (event) => {
                    
                })
                ;
                div.create({tagName:"label", htmlFor:this.id + "_" + index}).text(d[1]);
            });
            

        }

        _setPropertys(){

            let inputs = this._main.queryAll("input.option");
            inputs.forEach((e, index) => {
                for(var x in this.events){
                    $(e).on(x, $.bind(this.events[x], this, "event"));
                }
                if(this.childs){
                
                    $(e).on("change", $.bind(this.evalChilds, this, "event")); 
                }
                
            });
            

        }
        createOptions(parentValue:any){

			let i,
				vParent = {};
			
			if(this.parent){
                let aux = (parentValue + "").split(",");
				for(i = 0; i < aux.length; i++){
					vParent[aux[i]] = true;
				}
			}
	
            let inputs = this._main.queryAll("span");
            inputs.forEach((e)=>{
                e.parentNode.removeChild(e);
            });
            
            this.data.forEach((d, index) => {
                if(vParent[d[2]] || !this.parent || d[2] === "*"){
                    let div = this._main.create("span");
                    div.create(
                        {tagName:"input",
                        type: this.type,
                        name: this.name + ((this.type === "checkbox")?"_" + index: ""),
                        id:this.id + "_" + index,
                        className: "option",
                        value:d[0]});
                    
                        div.create({tagName:"label", htmlFor:this.id + "_" + index}).text(d[1]);
                }
                
            });

            this._setPropertys();
			
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

        reset(){
            this.setValue(this.default);
        }
    }
    
    
    class Multi{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "";
        caption:string = "";
        value:string = "";
        default:string = "";
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
        parentValue:any = "";
        _main:object = null;
        _input:object = null;
        _value:object = null;
        status:string = "valid";
        mode:string = "request";
        subForm:object = null;
        
        _form:object = null;

        evalChilds:any = () => {};
        getParentValue: any = () => {};
        doValues:Function = (inputs:any) => {
            let value = "";
            inputs.forEach((e)=>{
                value += ((value !== "")? ",": "") + e.value;
            });
            
            return value;
        }; 

        constructor(info: any){

            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = this._main = (this.id)? $(this.id): false;

            if(!main){
               
                this._create(false);
            }else{
                
                if(main.ds("sgInput")){
                    //return;
                }
            }
            if(info.doValues){
                this.doValues = $.bind(info.doValues, this, "inputs");
            }
            
            


            let target = (this.target)? $(this.target): false;

            if(target){
                target.append(this._main);
            }
            
        }

        _create(target:any){
            let info = {};

            switch(this.type){
                case "radio":
                case "checkbox":
                    break;
                default:
                    this.type = "radio";
                    break;
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
            
            this._main = $.create("div").addClass("input-multi").addClass("type-input").addClass(this.className);
            if(this.type === "checkbox"){
                this._input = this._main.create({tagName:"textarea", type: "text", name: this.name});
            }
            
            this._main.ds(this.dataset);
            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "multi");
            this._main.ds("sgType", this.type);

            if(this.parent){
                this._main.ds("parent", this.parent);
            }
            if(this.childs){
                this._main.ds("childs", "childs");
            }
            
            this.createOptions(this.parentValue);
           
            if(this.subForm){
                
                this._form = new FormDetail(this.subForm);
                
                this._form.setValue(this.value);
            }

            this.setValue(this.value);
            
           
        }

        onchange(item){

            let value = this._form.setOn(item.get().value, item.get().checked);
            
            this._input.val(JSON.stringify(value));
            
        }

        check(values){

            let data = [];

            values.forEach((v) => {
                data[v] = v;
            });

            let input = this._main.queryAll("input.option");

            input.forEach((input) => {
                
                if(data[input.value] !== undefined){
                    input.checked = true;
                }else{
                    input.checked = false;
                }
            }); 
        }
        
        setValue(value:any){

            this.value = value;

            if(this._form){
                this.check(this._form.getList());
            }
            
            if(Array.isArray(value)){
                this._input.val(JSON.stringify(value));
            }else{
                //this._input.val(value);
            }
            
            return false;
        }
        
        getValue(){

            return this._input.val();
        }

        
        
        _load(main:any){

        }

        get(){
            return this._main.get();
        }
        main(){
            return this._main;
        }
        hasChilds(){
            if(this._main.ds("childs")){
                return true;
            }
            return false;
        }

        createInputs(data){
            data.forEach((d, index) => {
                let div = this._main.create("span");
              
                div.create(
                    {tagName:"input",
                    type: this.type,
                    name: this.name + ((this.type === "checkbox")?"_" + index: ""),
                    id:this.id + "_" + index,
                    className: "option",
                    value:d[0]})
                .on("click", (event) => {
                    
                })
                ;
                div.create({tagName:"label", htmlFor:this.id + "_" + index}).text(d[1]);
            });
            

        }

        _setPropertys(){

            let inputs = this._main.queryAll("input.option");
            inputs.forEach((e, index) => {
                for(var x in this.events){
                    $(e).on(x, $.bind(this.events[x], this, "event"));
                }
                if(this.childs){
                
                    $(e).on("change", $.bind(this.evalChilds, this, "event")); 
                }
                
            });
            

        }
        createOptions(parentValue:any){

			let i,
				vParent = {};
			
			if(this.parent){
                let aux = (parentValue + "").split(",");
				for(i = 0; i < aux.length; i++){
					vParent[aux[i]] = true;
				}
			}
	
            let inputs = this._main.queryAll("span");
            inputs.forEach((e)=>{
                e.parentNode.removeChild(e);
            });
            
            this.data.forEach((d, index) => {
                if(vParent[d[2]] || !this.parent || d[2] === "*"){
                    let div = this._main.create("span");
                    div.create(
                        {tagName:"input",
                        type: this.type,
                        name: this.name + ((this.type === "checkbox")? "_" + index: ""),
                        id:this.id + "_" + index,
                        className: "option",
                        value:d[0]}).on("change", event => {
                            
                            this.onchange($(event.currentTarget));
                        });
                    
                    div.create({tagName:"label", htmlFor:this.id + "_" + index}).text(d[1]);
                }
                
            });

            this._setPropertys();
			
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

        reset(){
            this.setValue(this.default);
        }
    }
    
    I.register("multi", Multi);
    return Multi;
})(_sgQuery);