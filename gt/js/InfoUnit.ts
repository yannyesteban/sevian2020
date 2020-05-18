var GTInfoUnit = (($)=>{
	
	class InfoUnit{
		id:any = null;
		form:object = null;
		_main:object = null;
		_form:object = null;

		constructor(info){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            
            let main = (this.id)? $(this.id): false;
            
            if(main){
                
                if(main.ds("gtCota")){
                    return;
                }
    
                if(main.hasClass("gt-cota")){
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
            main.addClass("cota-main").addClass("map-main");

            if(this.form){
				this.form.target = main.id();
				this.form.parentContext =  this;
				
				this._form = new Form2(this.form);
			}


         
        }
	}

	return InfoUnit;


})(_sgQuery);