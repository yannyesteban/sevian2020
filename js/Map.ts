var sgMap = (($) => {
    
    class Map{
        id:any = null;
        map:any = null;
        device:object[] = null;

        constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = (this.id)? $(this.id): false;
            if(main){
                
                if(main.ds("sgMap")){
                    return;
                }
    
                if(main.hasClass("sg-map")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
            }

            _sgQuery(window).on("load", ()=> {
               // this.loadMap(main);
            });
            
      
        }
        loadMap(main){

        }
        _createGoogleMap(main:any){
            main.addClass("sg-map")
            let map = new google.maps.Map(main.get(), {
                center: {lat: 10.480594, lng: -66.903603},
                zoom: 14
              });

        }
        _create(main:any){
           this.map = new LeatfletMap({id:this.id});
            
        }
        _load(main:any){}
    }
    return Map;
})(_sgQuery);