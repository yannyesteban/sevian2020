
var $I = {};
var Input = (($) => {  

    class I{


        static get(_id){
            let main = $(_id);
        }
    }


    class SGDate{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "calendar";//
        value:string = "";
        className = "";
        data:any = false;
        propertys:any = false;
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
            
            this._main = $.create(info).addClass("type-input");

            for(var x in this.events){

                //let action = $.bind(this.events[x], this._main);
				this._main.on(x, $.bind(this.events[x], this, "event"));
			}
			
			this._main.prop(this.propertys);
			this._main.style(this.style);

            if(this.type === "select" || this.type === "multiple"){
				this.createOptions(this.value, false);
			}

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

    }
    $I.std = Input;
    return Input;
})(_sgQuery);