var ctMap = ctMap || [];
var Mark;
var MapBox = (($) => {
    var createGeoJSONCircle = function(center, radiusInKm, points) {
        if(!points) points = 64;
    
        var coords = {
            latitude: center[1],
            longitude: center[0]
        };
    
        var km = radiusInKm;
    
        var ret = [];
        var distanceX = km/(111.320*Math.cos(coords.latitude*Math.PI/180));
        var distanceY = km/110.574;
    
        var theta, x, y;
        for(var i=0; i<points; i++) {
            theta = (i/points)*(2*Math.PI);
            x = distanceX*Math.cos(theta);
            y = distanceY*Math.sin(theta);
    
            ret.push([coords.longitude+x, coords.latitude+y]);
        }
        ret.push(ret[0]);
    
        return {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [ret]
                    }
                }]
            }
        };
    };

    //map.addSource("polygon", createGeoJSONCircle([-93.6248586, 41.58527859], 0.5));
    /*
    map.addLayer({
    "id": "polygon",
    "type": "fill",
    "source": "polygon",
    "layout": {},
    "paint": {
        "fill-color": "blue",
        "fill-opacity": 0.6
    }
}); */
    let ii = 0;
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

    class Line{
        map:object = null;
        coordinates:any[] = [
            [-66.94205514843668, 10.364101919393633],
            [-66.74704782421789, 10.455948588617758],
            [-66.87957040722598, 10.561268658842579],
            [-66.99698678906188, 10.49511024268891]
    ];

      

       
        nodesId:string = "n-"+String(new Date().getTime());
        lineId:string = "l-"+String(new Date().getTime());
        lineWidth:number = 5;
        

        _nodes:any = null;
        _line:any = null;
        constructor(info:object){
            
            for(let x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let map = this.map;

            this._nodes = {
                'type': 'FeatureCollection',
                'features': []
            };
            this._line = {
				
				'type': 'geojson',
				
				'data': {
					'type': 'Feature',
					'properties': {},
					'geometry': {
						'type': 'LineString',
						'coordinates': this.coordinates
					}
				}
            };
            this.coordinates.forEach((el, index)=>{
                let point = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [el[0],el[1]]
                },
                'properties': {
                    'id': String(new Date().getTime()),
                    'index': index
                    }
                };
             
                this._nodes.features.push(point);
            });
            map.addSource(this.nodesId, {
                'type': 'geojson',
                'data': this._nodes
            });
            this.map.addSource(this.lineId, this._line);
			this.map.addLayer({
				'id': this.lineId,
				'type': 'line',
				'source': this.lineId,
				'layout': {
					'line-join': 'round',
					'line-cap': 'round'
				},
				'paint': {
					'line-color': 'red',
					'line-width': this.lineWidth
				}
			});
            map.addLayer({
                id: this.nodesId,
                type: 'circle',
                source: this.nodesId,
                paint: {
                    'circle-radius': 8,
                    'circle-color': '#000'
                },
                filter: ['in', '$type', 'Point']
            });
  
           

        }


        setCoordinates(coordinates){
            
            this.coordinates = coordinates;
            this._nodes = {
                'type': 'FeatureCollection',
                'features': []
            };
            this._line = {
				
				'type': 'geojson',
				
				'data': {
					'type': 'Feature',
					'properties': {},
					'geometry': {
						'type': 'LineString',
						'coordinates': this.coordinates
					}
				}
            };
            this.coordinates.forEach((el, index)=>{
                let point = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [el[0],el[1]]
                },
                'properties': {
                    'id': String(new Date().getTime()),
                    'index': index
                    }
                };
             
                this._nodes.features.push(point);
            });
            
        }

        redraw(){
            let map = this.map;
           
            map.getSource(this.lineId).setData(this._line.data);
            map.getSource(this.nodesId).setData(this._nodes);
        }
        add(lngLat){
            this.coordinates.push([lngLat.lng, lngLat.lat]);
            this.setCoordinates(this.coordinates);
            this.redraw();
        }
        play(){
            let map =  this.map;
            let point = null;
            let fnMove = (e)=>{
                this.coordinates[point] = [e.lngLat.lng, e.lngLat.lat];
                this.setCoordinates(this.coordinates);
                this.redraw();
            }
            let fnUp = (e)=>{
                point = null;
                map.off('mousemove', fnMove)
            }
            map.on('mousedown', this.nodesId, (e)=> {
                // Prevent the default map drag behavior.
                e.preventDefault();
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                
                if (features.length) {
                    var id = features[0].properties.id;
                    
                }
                point = features[0].properties.index;
                db (features[0].properties.index)
                //canvas.style.cursor = 'grab';
                 
                map.on('mousemove', fnMove);
                map.once('mouseup', fnUp);
                });
            map.on('mousedown',  (e) => {
                
                // Prevent the default map drag behavior.
                //e.preventDefault();

            });
            map.on('mouseup',  (e) => {
                
                // Prevent the default map drag behavior.
                //e.preventDefault();

            });
            map.on('mousemove',  (e) => {
                
                // Prevent the default map drag behavior.
                //e.preventDefault();
            });
            map.on('click', (e)=> {
                ii++;
                var features = map.queryRenderedFeatures(e.point, {
                    layers: [this.nodesId]
                });
                if(ii>=6){
                    //console.log(this.geojson.features);
                    //return;

                }
                this.add(e.lngLat);
                db (545454)
                
                
                //map.getSource('geojson').setData(this.geojson);
            
            }
            return;
            map.on('mousedown',  (e) => {
                // Prevent the default map drag behavior.
                e.preventDefault();
                
                this.data.data.geometry.coordinates.push([e.lngLat.lng, e.lngLat.lat]);
                console.log (this.data.data)
			    // then update the map
                this.map.getSource(this.id).setData(this.data.data);
                db (this.id, "aqua")
                db (e.lngLat, "white"); 
                
             });

        }
        pause(){

        }
        stop(){

        }
        
        delete(){

        }
        reset(){
            
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

            function HelloWorldControl() { }
 
            HelloWorldControl.prototype.onAdd = function(map) {
                this._map = map;
                this._container = document.createElement('div');
                this._container.className = 'mapboxgl-ctrl';
                this._container.textContent = 'Hello, world';
                return this._container;
            };
             
            HelloWorldControl.prototype.onRemove = function () {
                this._container.parentNode.removeChild(this._container);
                this._map = undefined;
            };
            map.addControl(new HelloWorldControl(), 'top-right');
            map.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
                },
                trackUserLocation: true
                }));
                map.addControl(new mapboxgl.AttributionControl({
                compact: true
                }));    
            map.addControl(new mapboxgl.FullscreenControl());
            

            mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js');
            map.addControl(new MapboxLanguage({
              defaultLanguage: 'es'
            }));

            map.addControl(new mapboxgl.NavigationControl());

            var draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true
                },
                styles: [
                    // default themes provided by MB Draw
                    // default themes provided by MB Draw
                    // default themes provided by MB Draw
                    // default themes provided by MB Draw
        
        
                    {
                        'id': 'gl-draw-polygon-fill-inactive',
                        'type': 'fill',
                        'filter': ['all', ['==', 'active', 'false'],
                            ['==', '$type', 'Polygon'],
                            ['!=', 'mode', 'static']
                        ],
                        'paint': {
                            'fill-color': '#3bb2d0',
                            'fill-outline-color': '#3bb2d0',
                            'fill-opacity': 0.1
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-midpoint',
                        'type': 'circle',
                        'filter': ['all', ['==', '$type', 'Point'],
                            ['==', 'meta', 'midpoint']
                        ],
                        'paint': {
                            'circle-radius': 3,
                            'circle-color': '#fbb03b'
                        }
                    },
                    {
                        'id': 'gl-draw-polygon-fill-active',
                        'type': 'fill',
                        'filter': ['all', ['==', 'active', 'true'],
                            ['==', '$type', 'Polygon']
                        ],
                        'paint': {
                            'fill-color': '#fbb03b',
                            'fill-outline-color': '#fbb03b',
                            'fill-opacity': 0.1
                        }
                    }
                ]
                
            });
                map.addControl(draw);
                draw.add({ type: 'Point', coordinates: [-66.903603, 10.480594] });
                draw.add({ type: 'Point', coordinates: [-66.87957040722598, 10.561268658842579] });
            map.on('load', (event) => {
                

return;
                //this.load(event);
              
                map.addImage('pulsing-dot', new Pulsing(map, 200), { pixelRatio: 2 });
                map.addImage('pulsing-dot2', new Pulsing(map, 100), { pixelRatio: 2 });
                map.addImage('pulsing-dot3', new Pulsing(map, 300), { pixelRatio: 2 });
                
                //return;
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

        addRule(name:string, info:object){
            info.map = this.map;
            return new Line(info);
        }

    }
    return Map;
})(_sgQuery);