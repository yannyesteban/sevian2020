import { InfoForm } from "./../../Sevian/ts/InfoForm.js";
import { IMark } from "./../MapType.js";

export interface MapAdminOption {
    longitude?: number;
    latitude?: number;
    container?: HTMLElement;
    marks?: any[];
    mobil?: any[];
    polygons?: any[];
    layers?: any[];
    traces?: any[];
    images?: any[];
    symbols?: any[];
    className?: string | string[];
    onLoad?:(map:any) => void;
}



const loadScriptFile = (url, async) => {
    return new Promise((resolve, reject) => {
        try {
            const myScript = document.createElement("script");
            //const key = "AIzaSyDZ4BkTZxNRh8GZTqmgGfDI4c2PgcbSuMM";
            //const url = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&libraries=&v=weekly`;
            myScript.setAttribute("src", url);//"../../build/test/google/index.js"
            myScript.setAttribute("async", async)

            myScript.addEventListener("load", (event) => {
                resolve({
                    status: true
                });
            });

            myScript.addEventListener("error", (event) => {
                reject({
                    status: false,
                    msg: "error"
                });
            });

            document.body.appendChild(myScript);
        } catch (error) {
            reject({
                status: false,
                msg: error
            })

        }
    });

};


export class Mark implements IMark {
    public id: number = 0;
    public latitude: number = 0;
    public longitude: number = 0;
    public popupInfo: string | HTMLAnchorElement = null;
    public map: Map = null;
    public info: any = {};
    public onLoadInfo: () => void = () => { console.log("nada") };
    public infoForm?: InfoForm = null;
    public flyToSpeed: number = 0.8;
    public flyToZoom: number = 14;
    public panDuration?: number = 5000;
    private marker: any = null;
    public activeFollow = true;
    private popup: InfoForm = null;
    constructor(info) {
        for (let x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        const latLng = { lat: this.latitude, lng: this.longitude };

        const marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
        });

        const popup = new InfoForm(this.infoForm);
        /*
        data.popupInfo = popup.get();
        data.onLoadInfo = () => {

            popup.setData(this.info);
        };
        */
        const infowindow = new google.maps.InfoWindow({
            content: popup.get() as HTMLElement
        });

        infowindow.addListener("content_changed", (event) => {
            console.log(event, "wwwww");
        })

        marker.addListener("click", () => {
            //this.onLoadInfo();
            popup.setData(this.info);
            infowindow.open({
                anchor: marker,
                map: this.map,
                shouldFocus: false,
            });
        });
        this.marker = marker;
        this.popup = popup;
    }

    setImage(image) {

    }
    setPosition({ latitude, longitude }) {
        this.longitude = longitude;
        this.latitude = latitude;
        const latLng = { lat: latitude, lng: longitude };
        this.marker.setPosition(latLng);
        console.log("position", latLng)
        if (this.activeFollow) {
            console.log("ok")
            this.panTo();
        }
    }

    setHeading(heading: number) {

    }

    setPopup(html) {


    }

    show(value: boolean) {

    }

    flyTo(zoom?: number, speed?: number) {

        this.map.panTo({ lat: this.latitude, lng: this.longitude });
        this.map.setZoom(16);
    }

    setCenter() {
        console.log({ lat: this.latitude, lng: this.longitude });
        this.map.setCenter({ lat: this.latitude, lng: this.longitude });
    }

    panTo(duration?) {
        console.log("panTo", { lat: this.latitude, lng: this.longitude })
        this.map.panTo({ lat: this.latitude, lng: this.longitude });
    }

    setFollow(value) {
        this.activeFollow = value;
    }

    public setInfo(info: any) {
        this.info = info;
        if (this.popup) {
            this.popup.setData(this.info);
        }
    }

    public getInfo() {
        return this.info;
    }


    public updateInfo(info) {
        this.info = Object.assign(this.info || {}, info);
        if (this.popup) {
            this.popup.setData(this.info);
        }
    }

    public remove(){
        this.marker.setMap(null);

    }
}

export class Map {

    public API_TYPE = "GOOGLE";

    private container: HTMLElement;





    private images: any[] = [];
    private symbols: any[] = [];
    private className?: string | string[];

    private _map = null;

    private longitude: number = null;
    private latitude: number = null;

    private static scriptLoaded = false;

    public onLoad = (map:any)=>{};

    constructor(options: MapAdminOption) {
        for (let key in options) {
            this[key] = options[key];
            if (this.hasOwnProperty(key)) {

            }
        }
    }


    getMap() {
        return this._map;
    }

    static loadScript() {

        return new Promise((resolve, reject) => {

            const key = "AIzaSyBhPsH8OjHCypjgwt_Dl7A_W8wlBbyPink";
            const url = "https://maps.google.com/maps/api/js?key=AIzaSyCr8MljMe17YC07PuG9CtOdHSZDZgAvmew&libraries=drawing";


            loadScriptFile(url, true)
                .then(message => {
                    console.log(message);

                    Map.scriptLoaded = true;
                    resolve({
                        status: true
                    });

                })
                .catch(message => {
                    Map.scriptLoaded = false;
                    reject({
                        status: true
                    });

                })


        });




    }



    public loadMap() {
        
        
        const map = new google.maps.Map(this.container, {
            zoom: 10,
            center: { lat: this.latitude, lng: this.longitude },
        });
        

        this._map = map;

        
        this.onLoad(map);;
        
    }

    public init(message?) {

        if (!Map.scriptLoaded) {
            Map.loadScript()
                .then(() => {
                    this.loadMap();
                }).catch(() => {
                    alert("error");
                });
            return;
        }

        this.loadMap();


    }

    public panTo(position) {
        const latLng = { lat: position.latitude, lng: position.longitude };
        this._map.panTo(latLng);

    }

    public setCenter(position) {
        console.log("set center 1")
        const latLng = { lat: position.latitude, lng: position.longitude };
        this._map.setCenter(new google.maps.LatLng(-34, 151));
        console.log("set center 2")

    }

    public setZoom(zoom: number) {
        this._map.setZoom(zoom);
    }

    public drawMark(info: IMark) {

        console.log(info)
        info.map = this._map;
        return new Mark(info);
    }

    public getMark(id): Mark {
        return this.marks[id] || null;
    }

    setMarkFollow(id, value) {
        if (this.marks[id]) {
            this.marks[id].setFollow(value);
        }
    }
}