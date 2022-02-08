import { InfoForm } from "./../../Sevian/ts/InfoForm.js";
const loadScriptFile = (url, async) => {
    return new Promise((resolve, reject) => {
        try {
            const myScript = document.createElement("script");
            //const key = "AIzaSyDZ4BkTZxNRh8GZTqmgGfDI4c2PgcbSuMM";
            //const url = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&libraries=&v=weekly`;
            myScript.setAttribute("src", url); //"../../build/test/google/index.js"
            myScript.setAttribute("async", async);
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
        }
        catch (error) {
            reject({
                status: false,
                msg: error
            });
        }
    });
};
export class Mark {
    constructor(info) {
        this.id = 0;
        this.latitude = 0;
        this.longitude = 0;
        this.popupInfo = null;
        this.map = null;
        this.info = {};
        this.onLoadInfo = () => { console.log("nada"); };
        this.infoForm = null;
        this.flyToSpeed = 0.8;
        this.flyToZoom = 14;
        this.panDuration = 5000;
        this.marker = null;
        this.activeFollow = true;
        this.popup = null;
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
            content: popup.get()
        });
        infowindow.addListener("content_changed", (event) => {
            console.log(event, "wwwww");
        });
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
        console.log("position", latLng);
        if (this.activeFollow) {
            console.log("ok");
            this.panTo();
        }
    }
    setHeading(heading) {
    }
    setPopup(html) {
    }
    show(value) {
    }
    flyTo(zoom, speed) {
        this.map.panTo({ lat: this.latitude, lng: this.longitude });
        this.map.setZoom(16);
    }
    setCenter() {
        console.log({ lat: this.latitude, lng: this.longitude });
        this.map.setCenter({ lat: this.latitude, lng: this.longitude });
    }
    panTo(duration) {
        console.log("panTo", { lat: this.latitude, lng: this.longitude });
        this.map.panTo({ lat: this.latitude, lng: this.longitude });
    }
    setFollow(value) {
        this.activeFollow = value;
    }
    setInfo(info) {
        this.info = info;
        if (this.popup) {
            this.popup.setData(this.info);
        }
    }
    getInfo() {
        return this.info;
    }
    updateInfo(info) {
        this.info = Object.assign(this.info || {}, info);
        if (this.popup) {
            this.popup.setData(this.info);
        }
    }
    remove() {
        this.marker.setMap(null);
    }
}
export class Map {
    constructor(options) {
        this.API_TYPE = "GOOGLE";
        this.images = [];
        this.symbols = [];
        this._map = null;
        this.longitude = null;
        this.latitude = null;
        this.onLoad = (map) => { };
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
            });
        });
    }
    loadMap() {
        const map = new google.maps.Map(this.container, {
            zoom: 10,
            center: { lat: this.latitude, lng: this.longitude },
        });
        this._map = map;
        this.onLoad(map);
        ;
    }
    init(message) {
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
    panTo(position) {
        const latLng = { lat: position.latitude, lng: position.longitude };
        this._map.panTo(latLng);
    }
    setCenter(position) {
        console.log("set center 1");
        const latLng = { lat: position.latitude, lng: position.longitude };
        this._map.setCenter(new google.maps.LatLng(-34, 151));
        console.log("set center 2");
    }
    setZoom(zoom) {
        this._map.setZoom(zoom);
    }
    drawMark(info) {
        console.log(info);
        info.map = this._map;
        return new Mark(info);
    }
    getMark(id) {
        return this.marks[id] || null;
    }
    setMarkFollow(id, value) {
        if (this.marks[id]) {
            this.marks[id].setFollow(value);
        }
    }
}
Map.scriptLoaded = false;
//# sourceMappingURL=Map.js.map