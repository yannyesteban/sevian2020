var test = (($) => {

	class test{
		id:any = "";
		tag:string = "";

		grid:object = null;
		constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
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
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
            }

			//alert(this.tag);



		}
		_create(main:any){
			this.grid.target = "#testgrid_2";
			let g = new Grid(this.grid);

		}
		_load(main:any){

		}

		ver(msg){
			alert(msg);
		}

	}



	return test;

})(_sgQuery);