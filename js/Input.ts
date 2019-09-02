const Input = (($) => {  
      
    class Input{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "";
        
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
            this._main = $.create(info);

        }
        _load(main:any){

        }

        get(){
            return this._main.get();
        }

    }
    
    return Input;
})(_sgQuery);