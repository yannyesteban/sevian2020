var Cota = (($) => {
   
    class Cota{

        id:any = null;
        map:any = null;

        win:any = null;
        data:any[] = [];
        units:any[] = [];
        main:any = null;
        clients:any[] = [];
        accounts:any[] = [];
        tracking:any[] = [];
        
        info:any = null;
		wInfo:any = null;
		
        tapName:any = null;
        
        unit:any = null;
        
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
            this.map = new MapBox({id:`${this.id}`});
            //            console.log (this.unit.info)
            this.unit.info.map = this.map;
            let unit = new GTUnit(this.unit.info);
            unit.play();

        }   
        _load(main:any){

        } 

	}


	return Cota;
})(_sgQuery);