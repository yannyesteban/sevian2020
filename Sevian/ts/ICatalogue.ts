var SGICatalogue = (($)=>{
	
	class ICatalogue{
		id:any = null;
        form:object = null;
        catalogue:object = null;
		_main:object = null;
		_form:object = null;

        _infoBody:object = null;
		constructor(info){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            
            let main = (this.id)? $(this.id): false;
            
            if(main){
                
                if(main.ds("sg-f-catalogue")){
                    return;
                }
    
                if(main.hasClass("sg-f-catalogue")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
            }

		
        }
        _create(main:any){
            main.addClass("sg-f-catalogue");

            if(this.form){
				this.form.target = main.id();
				this.form.parentContext =  this;
				
				this._form = new Form2(this.form);
			}
            
            this._infoBody = main.create("div").addClass(["cat"]);

            
            if(this.catalogue){
                this.loadCatalogue(this.catalogue);
            }
        }

        getForm(){
            return this._form;
        }

        loadCatalogue(html){
			
            this._infoBody.text(html);
            
        }
	}

	return ICatalogue;


})(_sgQuery);