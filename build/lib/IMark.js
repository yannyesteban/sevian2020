export class IMark {
    constructor(info) {
        this.map = null;
        this.type = "mark";
        this.parent = null;
        this.name = "";
        this.visible = true;
        this.coordinates = null;
        this.coordinatesInit = null;
        this.rotation = 0;
        this.width = 15;
        this.height = 24;
        this.image = "";
        this.className = "my-class";
        this.popupClassName = "my-class";
        this.popupInfo = "";
        this.flyToSpeed = 0.8;
        this.flyToZoom = 14;
        this.panDuration = 5000;
        this._mode = 0;
        this._marker = null;
        this._image = null;
        this._play = false;
        this.callmove = () => { };
        this.callresize = () => { };
        this.ondraw = () => { };
        this._drag = () => { };
        this._click = () => { };
        this.ondrag = (info) => { };
        this.onplace = (info) => { };
        this.onsave = (info) => { };
        for (let x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        this.init();
    }
    init() {
        let map = this.map;
        let markerHeight = 24;
        let markerRadius = 0;
        let linearOffset = 0;
        let popupOffsets = {
            "top": [0, 0],
            "top-left": [0, 0],
            "top-right": [0, 0],
            "bottom": [0, -this.height / 2 + 5],
            "bottom-left": [linearOffset, (this.height - markerRadius + linearOffset) * -1],
            "bottom-right": [-linearOffset, (this.height - markerRadius + linearOffset) * -1],
            "left": [markerRadius, (this.height - markerRadius) * -1],
            "right": [-markerRadius, (this.height - markerRadius) * -1]
        };
        let popup = new mapboxgl.Popup({
            offset: popupOffsets,
            className: this.popupClassName
        })
            //.setLngLat(e.lngLat)
            .setHTML(this.popupInfo)
            .setMaxWidth("300px");
        this.setImage(this.image);
        this._marker = new mapboxgl.Marker(this._image).setLngLat(this.coordinates);
        this._marker.setPopup(popup);
        this._marker.setRotation(this.rotation);
        this.ondraw(this.coordinates);
        if (this.coordinates) {
            this.coordinatesInit = this.coordinates.slice();
        }
        this.setVisible(this.visible);
    }
    setSize(width = null, height = null) {
        if (width != null) {
            this.width = width;
            this._image.style.width = this.width + "px";
        }
        if (height != null) {
            this.height = height;
            this._image.style.height = this.height + "px";
        }
    }
    getSize() {
        return [this.width, this.height];
    }
    setImage(image) {
        if (!this._image) {
            this._image = document.createElement("img");
            this._image.className = "marker";
            this._image.style.height = this.height + "px";
        }
        this._image.src = this.parent.getImage(image);
        //return this._image;
    }
    setVisible(value) {
        if (this._marker) {
            this.visible = value;
            if (value) {
                this._marker.addTo(this.map);
            }
            else {
                this._marker.remove();
            }
        }
    }
    getLngLat() {
        return this._marker.getLngLat();
    }
    setLngLat(lngLat) {
        this._marker.setLngLat(lngLat);
    }
    setRotation(rotation) {
        if (this._marker) {
            this.rotation = rotation;
            this._marker.setRotation(rotation);
        }
        return this;
    }
    getCoordinates() {
        return [this._marker.getLngLat().lng, this._marker.getLngLat().lat];
    }
    play() {
        if (this._play) {
            return;
        }
        this.parent.stop();
        this._play = true;
        this.setVisible(true);
        this._marker.setDraggable(true);
        this._marker.on("drag", this._drag = () => {
            this.ondrag(this._marker.getLngLat());
            this.ondraw([this._marker.getLngLat().lng, this._marker.getLngLat().lat]);
        });
        this.map.on("click", this._click = (e) => {
            this.setLngLat(e.lngLat);
            this.onplace(e.lngLat);
            this.ondraw([e.lngLat.lng, e.lngLat.lat]);
        });
        this.flyTo();
    }
    stop() {
        if (this._play) {
            this._marker.setDraggable(false);
            this._play = false;
            this.map.off("click", this._click);
            this.map.off("drag", this._drag);
            this._play = false;
        }
    }
    reset() {
        if (!this._play) {
            return;
        }
        if (this.coordinatesInit) {
            this.setLngLat(this.coordinatesInit);
        }
    }
    save() {
        this.coordinatesInit = this.getCoordinates();
        this.onsave(this.coordinatesInit);
    }
    delete() {
        this.stop();
        this.setVisible(false);
        this._marker = null;
    }
    flyTo(zoom, speed) {
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
    panTo(duration) {
        this.map.panTo(this._marker.getLngLat(), { duration: duration || this.panDuration });
    }
}
//# sourceMappingURL=IMark.js.map