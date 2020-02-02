var sgMap = (($) => {
   
    function evalHTML(html, data){

        function auxf(str, p, p2, offset, s){
            return data[p2];
        }
        
        for(let x in data){
            let regex = new RegExp('\(\{=('+x+')\})', 'gi'); 
            html= html.replace(regex, auxf);
           
        }
        return html;

    }

    function replacer(str, p1, offset, s)
    {
      return " <<" + p1 + ">> ";
    }

    class Map{
        id:any = null;
        map:any = null;
        devices:object[] = [];
        tracking:object[] = [];

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
           //this.map = new LeatfletMap({id:this.id});
           this.map = new MapBox({id:this.id});
           //return;
           
           var html = `<div class="wecar_info">
           <div>{=vehicle_name}</div>
           <div>{=device_name}</div>
           <div>{=brand}: {=model}<br>{=plate}, {=color} </div>
       
           <div>{=latitude}, {=longitude}</div>
       
           <div>Velocidad: {=speed}</div>
       
       </div>`;

            let popup = "";
            
            for(let x in this.tracking){
                
                
                popup = evalHTML(html, this.devices[x]);
                popup = evalHTML(popup, this.tracking[x]);
                

                this.map.addMark(x, {
                    lat:this.tracking[x].latitude,
                    lng:this.tracking[x].longitude,
                    heading:this.tracking[x].heading,
                    popupInfo: popup
                });
                //db (this.devices[x].device_name, "red");
            }
           
            
        }
        _load(main:any){}
    }
    return Map;
})(_sgQuery);