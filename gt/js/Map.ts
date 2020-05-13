var GTMap = (($) => {
   
    class Map{

		static _instances = [];

        id:any = null;
        map:any = null;

        //win:any = null;
        //data:any[] = [];
        //units:any[] = [];
        //main:any = null;
        //clients:any[] = [];
        //accounts:any[] = [];
        //tracking:any[] = [];
        
        info:any = null;
		//wInfo:any = null;
		
		tapName:any = null;
        static getMap(name){
            return Map._instances[name];
        }
        constructor(info){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            
            let main = (this.id)? $(this.id): false;
           
            if(main){
            
                if(main.ds("gtMap")){
                    return;
                }
    
                if(main.hasClass("gt-map")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
			}
			
			Map._instances[this.id] = this;

		
        }
        _create(main:any){
            main.addClass("map-main");
			this.map = new MapBox({id:`${this.id}`});
			

        }   
        _load(main:any){

        } 

	}


	return Map;
})(_sgQuery);