(function () {
    var _old__setPos = L.Marker.prototype._setPos;
    L.Marker.include({
        _updateImg: function (i, a, s) {
            a = L.point(s).divideBy(2)._subtract(L.point(a));
            var transform = '';
            transform += ' translate(' + -a.x + 'px, ' + -a.y + 'px)';
            transform += ' rotate(' + this.options.iconAngle + 'deg)';
            transform += ' translate(' + a.x + 'px, ' + a.y + 'px)';
            i.style[L.DomUtil.TRANSFORM] += transform;
        },
        setIconAngle: function (iconAngle) {
            this.options.iconAngle = iconAngle;
            if (this._map)
                this.update();
        },
        _setPos: function (pos) {
            if (this._icon) {
                this._icon.style[L.DomUtil.TRANSFORM] = "";
            }
            if (this._shadow) {
                this._shadow.style[L.DomUtil.TRANSFORM] = "";
            }
            _old__setPos.apply(this, [pos]);
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
    console.log(L.DomUtil);
}());
var LeatfletMap = (($) => {
    class Rule {
    }
    class Poly {
    }
    class Circle {
    }
    class Trace {
    }
    class Popup {
        constructor() {
        }
    }
    class Mark {
        constructor(info) {
            this.map = null;
            this.icon = "";
            this.width = "";
            this.heigt = "";
            this.src = "";
            this.visible = true;
            this.lat = 0;
            this.lng = 0;
            this.popupInfo = "";
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            var greenIcon = L.icon({
                iconUrl: '../images/vehiculo_0000.png',
                //shadowUrl: 'leaf-shadow.png',
                iconSize: [25, 25],
                //shadowSize:   [50, 64], // size of the shadow
                iconAnchor: [25 / 2, 25 / 2],
                //shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [0, -25 / 2] // point from which the popup should open relative to the iconAnchor
            });
            let M = L.marker([this.lat, this.lng], { icon: greenIcon })
                .bindPopup(this.popupInfo)
                .addTo(this.map);
            M.setIconAngle(45);
        }
        setLatLng(lat, lng) {
        }
        setHeading(heading) {
        }
        show(value) {
        }
        hide() {
        }
        flyTo(value) {
        }
    }
    class Group {
        constructor() {
            this.marks = null;
            this.groups = null;
        }
        show(value) {
        }
    }
    class Map {
        constructor(info) {
            this.id = null;
            this.target = null;
            this.className = "map-main-layer";
            this.map = null;
            this.marks = [];
            this.groups = null;
            this.latlng = L.latLng(10.480594, -66.903603);
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("LeatfletMap")) {
                    return;
                }
                if (main.hasClass("leatflet-map")) {
                    this._load(main);
                }
                else {
                    this._create(main);
                }
            }
            else {
                main = $.create("div").attr("id", this.id);
                this._create(main);
            }
            $(window).on("load", () => {
                // this.loadMap(main);
            });
        }
        _create(main) {
            //https://www.endpoint.com/blog/2019/03/23/switching-google-maps-leaflet
            main.addClass("leatflet-map");
            this.map = L.map(this.id).setView(this.latlng, 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11'
            }).addTo(this.map);
        }
        _load(main) {
        }
        zoom(value) {
        }
        flyTo(opt) {
        }
        addMark(name, info) {
            info.map = this.map;
            db(info.lat);
            this.marks[name] = new Mark(info);
        }
    }
    return Map;
})(_sgQuery);
//# sourceMappingURL=LeafletMap.js.map