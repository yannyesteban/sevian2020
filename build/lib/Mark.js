export class Mark {
    constructor(info) {
        this.map = null;
        this.icon = "";
        this.width = "15px";
        this.height = "24px";
        this.image = '';
        this.src = "";
        this.visible = true;
        this.latitude = 0;
        this.longitude = 0;
        this.heading = 0;
        this.popupInfo = "";
        this.flyToSpeed = 0.8;
        this.flyToZoom = 14;
        this.panDuration = 5000;
        this._marker = null;
        for (let x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let markerHeight = 24, markerRadius = 0, linearOffset = 0;
        let popupOffsets = {
            "top": [0, 0],
            "top-left": [0, 0],
            "top-right": [0, 0],
            "bottom": [0, -markerHeight / 2 + 5],
            "bottom-left": [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            "bottom-right": [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
            "left": [markerRadius, (markerHeight - markerRadius) * -1],
            "right": [-markerRadius, (markerHeight - markerRadius) * -1]
        };
        let popup = new mapboxgl.Popup({
            offset: popupOffsets,
            className: "my-class"
        })
            //.setLngLat(e.lngLat)
            .setMaxWidth("300px"); //.addTo(map);
        if (typeof this.popupInfo === "string") {
            popup.setHTML(this.popupInfo);
        }
        else {
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
        if (this.visible) {
            this._marker.addTo(this.map);
        }
    }
    setLngLat(lngLat) {
        this._marker.setLngLat(lngLat);
    }
    setHeading(heading) {
        this._marker.setRotation(heading);
    }
    setPopup(html) {
        this._marker.getPopup().setHTML(html);
    }
    show(value) {
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
    hide() {
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
//# sourceMappingURL=Mark.js.map