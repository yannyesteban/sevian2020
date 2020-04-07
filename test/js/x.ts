var One = (($) => {


	class One{
		id:any = null;
		target:any = null;

		form:object = null;

		_main:object = null;

		
		constructor(info:object){
        
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
			}
			
			let main = (this.id)? $(this.id): false;

            if(!main){
                main = $.create("div").attr("id", this.id);
            }
			
			this._create(main);

		}
		_create(main:any){
			main.create("div").addClass("X").text("test ONE One");
		}


	}



	return One;

})(_sgQuery);