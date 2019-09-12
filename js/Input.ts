
var $I = {};
var Input = (($) => {  
      
    class Input{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "";
        value:string = "";
        className = "";
        data:any = false;
        propertys:any = false;
        events:any = false;
        placeholder:string = "";

        childs:boolean = false;
        parent:string = "";
        _main:object = null;
        constructor(opt: any){
            
            for(var x in opt){
                if(this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }

            let main = (this.id)? $(this.id): false;

            if(main){
                
                if(main.ds("sgPage")){
                    return;
                }
    
                if(main.hasClass("sg-page")){
                    this._load(main);
                }else{
                    this._create(main);
                }
            }else{
                
                let target = (this.target)? $(this.target): false;

                if(target){
                    main = target.create("div").attr("id", this.id);
                }else{
                    main = $.create("div"); 
                }
                
                this._create(main);
            }
        }

        _create(main:any){
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
            info.id = this.id;
            info.name = this.name;
            info.value = this.value;
            this._main = $.create(info);

            if(this.type === "select" || this.type === "multiple"){
				this.createOptions(this.value, false);
			}
            this.setValue(this.value);
        }
        setValue(value:any){
			this.get().value = value;
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