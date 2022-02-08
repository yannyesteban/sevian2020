export class Mark{

    private image: string = "";
    map:object = null;
    icon="";
    width:string="15px";
    height:string="24px";
    
    src:string = "";
    visible:boolean = true;


	private latitude:number = 0;
	private longitude:number = 0;
    heading:number = 0;

    popupInfo:string | HTMLElement = "";
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
            "top": [0, 0],
            "top-left": [0,0],
            "top-right": [0,0],
            "bottom": [0, -markerHeight/2+5],
            "bottom-left": [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            "bottom-right": [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            "left": [markerRadius, (markerHeight - markerRadius) * -1],
            "right": [-markerRadius, (markerHeight - markerRadius) * -1]
            };
        let popup = new mapboxgl.Popup({
            offset: popupOffsets,
            className: "my-class"})
             //.setLngLat(e.lngLat)

             .setMaxWidth("300px");//.addTo(map);

        if (typeof this.popupInfo === "string") {
            popup.setHTML(this.popupInfo);
        } else {
            popup.setDOMContent(this.popupInfo);
        }



        let el = document.createElement("img");
        el.className = "marker";

        el.src = this.image;
        //el.style.width = this.width;
        el.style.height = this.height;

        let M = this._marker = new mapboxgl.Marker(el)


        .setLngLat([this.longitude, this.latitude]);
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
        this._marker.setRotation(heading);
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

    flyTo(zoom?, speed?){

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

    panTo(duration?){
        this.map.panTo(this._marker.getLngLat(), {duration: duration || this.panDuration });
    }


}