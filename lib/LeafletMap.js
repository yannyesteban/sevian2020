var LeatfletMap = (($) => {
    class Rule {
    }
    class Poly {
    }
    class Circle {
    }
    class Trace {
    }
    class Mark {
        constructor() {
            this.icon = "";
            this.width = "";
            this.heigt = "";
            this.src = "";
            this.visible = true;
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
            this.marks = null;
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
    }
    return Map;
})(_sgQuery);
