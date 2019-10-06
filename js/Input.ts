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

        childs:boolean = false;
        parent:string = "";
        _main:object = null;

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

            
            this._main.ds("sgInput", "input");


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
			
			this._main.prop(this.propertys);
			this._main.style(this.style);

            if(this.type === "select" || this.type === "multiple"){
				this.createOptions(this.value, false);
            }
            this._main.ds(this.dataset);
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

        createOptions(value:any, parentValue:any){
		
			var i,
				option,
				vParent = [],
				_ele = this.get();
			
			_ele.length = 0;
			
			if(this.parent){
				var aux = (parentValue + "").split(",");
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
				if(vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*"){
					option = document.createElement("OPTION");
					option.value = this.data[i][0];
					option.text = this.data[i][1];
					_ele.options.add(option);
				}
			}
			
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
    }
    $I.std = Input;
    I.register("input", Input);
    return Input;
})(_sgQuery);