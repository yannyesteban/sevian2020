(function () {
    var _old__setPos = L.Marker.prototype._setPos;
    L.Marker.include({
        _updateImg: function(i, a, s) {
            a = L.point(s).divideBy(2)._subtract(L.point(a));
            var transform = '';
            transform += ' translate(' + -a.x + 'px, ' + -a.y + 'px)';
            transform += ' rotate(' + this.options.iconAngle + 'deg)';
            transform += ' translate(' + a.x + 'px, ' + a.y + 'px)';
            i.style[L.DomUtil.TRANSFORM] += transform;
        },

        setIconAngle: function (iconAngle) {
            this.options.iconAngle = iconAngle;

            if (this._map) this.update();
        },

        _setPos: function (pos) {
            if (this._icon) {
                this._icon.style[L.DomUtil.TRANSFORM] = "";
            }
            if (this._shadow) {
                this._shadow.style[L.DomUtil.TRANSFORM] = "";
            }

            _old__setPos.apply(this,[pos]);

            if (this.options.iconAngle) {
                var a = this.options.icon.options.iconAnchor;
                var s = this.options.icon.options.iconSize;
                var i;
                if (this._icon) {
                    i = this._icon;
                    this._updateImg(i, a, s);
                }

            }
        }
    });
    console.log(L.DomUtil)
}());


var MapBox = (($) => {

    class Rule{

    }
    class Poly{}

    class Circle{}

    class Trace{}

    class Popup{
        constructor(){

        }
    }

    class Mark{
        map:object = null;
        icon="";
        width:string="30px";
        heigt:string="30px";
        src:string = "";
        visible:boolean = true;

        lat:number = 0;
        lng:number = 0;
        heading:number = 0;

        popupInfo:string = "";

        constructor(info:object){
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            var markerHeight = 50, markerRadius = 10, linearOffset = 25;
            var popupOffsets = {
                'top': [0, 0],
                'top-left': [0,0],
                'top-right': [0,0],
                'bottom': [0, -markerHeight],
                'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                'left': [markerRadius, (markerHeight - markerRadius) * -1],
                'right': [-markerRadius, (markerHeight - markerRadius) * -1]
                };
               var popup = new mapboxgl.Popup({ className: 'my-class'})
                 //.setLngLat(e.lngLat)
                 .setHTML(this.popupInfo)
                 .setMaxWidth("300px")
                 ;//.addTo(map);
            var greenIcon = L.icon({
                iconUrl: '../images/vehiculo_0000.png',
                //shadowUrl: 'leaf-shadow.png',
            
                iconSize:     [25, 25], // size of the icon
                //shadowSize:   [50, 64], // size of the shadow
                iconAnchor:   [25/2, 25/2], // point of the icon which will correspond to marker's location
                //shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor:  [0, -25/2] // point from which the popup should open relative to the iconAnchor
            });

            var el = document.createElement('img');
            el.className = 'marker';
            el.src = '../images/vehiculo_0000.png';
            el.style.width = this.width;
            el.style.height = this.height;

            let M = new mapboxgl.Marker(el)
            
            //.bindPopup(this.popupInfo)
            .setLngLat([this.lng, this.lat])
            .addTo(this.map);
M.setPopup(popup);
            M.setRotation(this.heading);
        }

        setLatLng(lat:number, lng:number){

        }

        setHeading(heading:number){

        }

        show(value:boolean){

        }

        hide(){

        }

        flyTo(lat, lng){

                
        }


    }

    class Group{
        marks:any[] = null;
        groups:any[] = null;
        constructor(){


        }

        show(value:boolean){

        }
    }

    class Map{
        id:any = null;
        target:any = null;
        className:string = "map-main-layer";
        map:any = null;
        marks:any[] = [];
        groups:any[] = null;
        latlng = L.latLng(10.480594, -66.903603);
        constructor(info:object){
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id)? $(this.id): false;
            if(main){
                
                if(main.ds("LeatfletMap")){
                    return;
                }
    
                if(main.hasClass("leatflet-map")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
            }

            $(window).on("load", ()=> {
               // this.loadMap(main);
            });
        }
        _create(main){


            //main.addClass("leatflet-map");
            mapboxgl.accessToken = 'pk.eyJ1IjoieWFubnkyNCIsImEiOiJjazYxZnM5dzMwMzk1M21xbjUyOHVmdjV0In0.4ifqDgs5_PqZd58N1DcVaQ';
            let map = this.map = new mapboxgl.Map({
            container: this.id,
            style: 'mapbox://styles/mapbox/streets-v10',
            zoom: 3,
            center: this.latlng,
            
            });
            mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
            map.addControl(new MapboxLanguage({
              defaultLanguage: 'es'
            }));


        }
        _load(main){

        }

        zoom(value:number){

        }

        flyTo(lat, lng){

            this.map.flyTo({
                center: [lng, lat],
                zoom: 16,
                speed: 3.0,
                curve: 1,
                easing(t) {
                  return t;
                });
        }

        addMark(name:string, info:object){
            info.map = this.map;
            this.marks[name] = new Mark(info);
        }

    }
    return Map;
})(_sgQuery);