var ctMap = ctMap || [];
var Mark;
var MapBox = (($) => {


    class Pulsing{
        map:any = null;
        width: number = 10;
        height: number = 10;
        size: number = 200;
        data:any = null;
        context:any = null;
        constructor(map, size:number){
            this.map = map;
            this.size = size;
            this.width = size;
            this.height = size;
            this.data = new Uint8Array(this.width * this.height * 4);
            
        }

        onAdd(){
            
            let canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d')
        }

        render(){
            
            let duration = 1000;
            let t = (performance.now() % duration) / duration;
             
            let radius = (this.size / 2) * 0.3;
            let outerRadius = (this.size / 2) * 0.7 * t + radius;
            let context = this.context;
             
            // draw outer circle
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                outerRadius,
                0,
                Math.PI * 2
            );
            //context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
            context.fillStyle = 'rgba(255, 165, 62,' + (1 - t) + ')';
            context.fill();
             
            // draw inner circle
            context.beginPath();
            context.arc(
                this.width / 2,
                this.height / 2,
                radius,
                0,
                Math.PI * 2
            );
            //context.fillStyle = 'rgba(255, 100, 100, 1)';
            context.fillStyle = 'rgba(255, 165, 62, 1)';

            //242, 255, 62
            context.strokeStyle = 'white';
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();
             
            // update this image's data with data from the canvas
            this.data = context.getImageData(
                0,
                0,
                this.width,
                this.height
            ).data;
             
            // continuously repaint the map, resulting in the smooth animation of the dot
            this.map.triggerRepaint();
             
            // return `true` to let the map know that the image was updated
            return true;
        }
    }

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
        width:string="15px";
        height:string="24px";
        image:string='';
        src:string = "";
        visible:boolean = true;
        

        lat:number = 0;
        lng:number = 0;
        heading:number = 0;

        popupInfo:string = "";
        flyToSpeed:number = 0.8;
        flyToZoom:number = 14;
        panDuration:number = 5000;
        private _marker:any = null;


        constructor(info:object){
            
            for(let x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let markerHeight = 24, markerRadius = 0, linearOffset = 0;
            let popupOffsets = {
                'top': [0, 0],
                'top-left': [0,0],
                'top-right': [0,0],
                'bottom': [0, -markerHeight/2+5],
                'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
                'left': [markerRadius, (markerHeight - markerRadius) * -1],
                'right': [-markerRadius, (markerHeight - markerRadius) * -1]
                };
            let popup = new mapboxgl.Popup({ 
                offset: popupOffsets,
                className: 'my-class'})
                 //.setLngLat(e.lngLat)
                 .setHTML(this.popupInfo)
                 .setMaxWidth("300px")
                 ;//.addTo(map);
            

            let el = document.createElement('img');
            el.className = 'marker';
            
            el.src = this.image;
            //el.style.width = this.width;
            el.style.height = this.height;

            let M = this._marker = new mapboxgl.Marker(el)
            
            
            .setLngLat([this.lng, this.lat]);
            M.setPopup(popup);
            M.setRotation(this.heading);

            if(this.visible){
                this._marker.addTo(this.map);
            }
        }

        setLngLat(lngLat){
            this._marker.setLngLat(lngLat);
        }

        setHeading(heading:number){
           
        }

        setPopup(html){
            this._marker.getPopup().setHTML(html);
        }

        show(value:boolean){
            if(this._marker){
                this.visible = value;
                if(value){
                    this._marker.addTo(this.map);
                }else{
                    this._marker.remove();
                }
            }
        }

        hide(){

        }

        flyTo(zoom, speed){
           
            this.map.flyTo({
                center: this._marker.getLngLat(),
                zoom: zoom || this.flyToZoom,
                speed: speed || this.flyToSpeed,
                curve: 1,
                easing(t) {
                  return t;
                }
              });
                
        }

        panTo(duration){
            this.map.panTo(this._marker.getLngLat(), {duration: duration || this.panDuration });
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
        name:string = null;
        target:any = null;
        className:string = "map-main-layer";
        map:any = null;
        marks:any[] = [];
        groups:any[] = null;
        layers:any[] = [];
        latlng = new mapboxgl.LngLat(-66.903603, 10.480594);
        
        load:any = (event)=>{};
        
        constructor(info:object){
            for(let x in info){
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

            ctMap[this.name || this.id] = this;
            
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
            zoom: 10,
            center: this.latlng,
            
            });

            

            mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
            map.addControl(new MapboxLanguage({
              defaultLanguage: 'es'
            }));

            map.addControl(new mapboxgl.NavigationControl());
            map.on('load', (event) => {
                //this.load(event);
              
                map.addImage('pulsing-dot', new Pulsing(map, 200), { pixelRatio: 2 });
                map.addImage('pulsing-dot2', new Pulsing(map, 100), { pixelRatio: 2 });
                map.addImage('pulsing-dot3', new Pulsing(map, 300), { pixelRatio: 2 });
                
                return;
                map.addSource('points', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': 
                            [
                                {
                                    'type': 'Feature',
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [0, 0]
                                    }
                                }
                            ]
                        }
                    }
                );
                map.addSource('points2', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': 
                            [
                                {
                                    'type': 'Feature',
                                    'properties':{
                                        'micon':"pulsing-dot3"
                                    },
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [-71.65522800, 10.59577000]
                                    }
                                },
                                {
                                    'type': 'Feature',
                                    'properties':{
                                        'micon':"pulsing-dot2"
                                    },
                                    'geometry': {
                                        'type': 'Point',
                                        'coordinates': [-69.39774800, 10.06782300]
                                    }
                                }
                            ]
                        }
                    }
                );
                map.addLayer({
                    'id': 'points2',
                    'type': 'symbol',
                    'source': 'points2',
                    'layout': {
                        'icon-image': ['get', 'micon']
                    }
                });

                map.addLayer({
                    'id': 'points',
                    'type': 'symbol',
                    'source': 'points',
                    'layout': {
                        'icon-image': 'pulsing-dot'
                    }
                });

                map.getSource("points").setData( {
                    'type': 'FeatureCollection',
                    'features': 
                        [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-66.903603, 10.480594]
                                }
                            },
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-67.52839800, 10.22430800]
                                }
                            }
                        ]
                    });

                let ele = document.createElement("div");
                $(ele).addClass("marker-alpha");

                var marker = new mapboxgl.Marker({element:ele})
                    .setLngLat([-66.84444000, 10.28113600])
                    .addTo(map);





            };

            

        }
        _load(main){

        }

        on(event, func){
            this.map.on(event, func);
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
                }
            });
        }

        createMark(info){
            info.map = this.map;
            return new Mark(info);  
        }
        addMark(name:string, info:object){
            info.map = this.map;
            this.marks[name] = new Mark(info);
        }

        addSource(id, source){
            this.map.addSource(id, source);
        }
        setDataSource(sourceId, source){
            this.map.getSource(sourceId).setData(source);
        }
        addPulse(layerId, sourceId){
           let map = this.map;

           this.map.addLayer({
                'id': layerId,
                'type': 'symbol',
                'source': sourceId,
                'layout': {
                    'icon-image': ['get', 'micon']
                }
            });
            return;

            map.addSource('points', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': 
                        [
                            {
                                'type': 'Feature',
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [0, 0]
                                }
                            }
                        ]
                    }
                }
            );
            map.addSource('points2', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': 
                        [
                            {
                                'type': 'Feature',
                                'properties':{
                                    'micon':"pulsing-dot3"
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-71.65522800, 10.59577000]
                                }
                            },
                            {
                                'type': 'Feature',
                                'properties':{
                                    'micon':"pulsing-dot2"
                                },
                                'geometry': {
                                    'type': 'Point',
                                    'coordinates': [-69.39774800, 10.06782300]
                                }
                            }
                        ]
                    }
                }
            );
            map.addLayer({
                'id': 'points2',
                'type': 'symbol',
                'source': 'points2',
                'layout': {
                    'icon-image': ['get', 'micon']
                }
            });

            map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'points',
                'layout': {
                    'icon-image': 'pulsing-dot'
                }
            });

            map.getSource("points").setData( {
                'type': 'FeatureCollection',
                'features': 
                    [
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-66.903603, 10.480594]
                            }
                        },
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-67.52839800, 10.22430800]
                            }
                        }
                    ]
                });

               return;
            this.map.addLayer({
                'id': layerId,
                'type': 'symbol',
                'source': sourceId,
                'layout': {
                    'icon-image': ['get', 'micon']
                }
            });

            alert(layerId);
            alert(sourceId)
        }

    }
    return Map;
})(_sgQuery);