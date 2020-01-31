var sgMap = (($) => {
    
    class Map{
        id:any = null;

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
//https://www.endpoint.com/blog/2019/03/23/switching-google-maps-leaflet
            main.addClass("sg-map")
            var mymap = L.map(this.id).setView([10.480594, -66.903603], 13);

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11'
            }).addTo(mymap);

            //layers: new L.TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png")

/*

Quite similar, isn’t it? The main difference is that, in Leaflet, we need to provide a tile layer for the base map because there isn’t one by default. There are a lot of excellent tile layers available to use at no cost. Here are some of them:

    Bright: https://a.tiles.mapbox.com/v3/mapbox.world-bright/{z}/{x}/{y}.png
    Topographic: https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png
    Black and white: https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png

*/
        }
        _create2(main:any){
            main.addClass("sg-map")
            let map = new google.maps.Map(main.get(), {
                center: {lat: 10.480594, lng: -66.903603},
                zoom: 14
              });

        }
        _create(main:any){
            main.addClass("sg-map")
            var mymap = L.map(this.id).setView([10.480594, -66.903603], 13);

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11'
            }).addTo(mymap);
            
        }
        _load(main:any){}
    }
    return Map;
})(_sgQuery);