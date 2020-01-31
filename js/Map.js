var sgMap = (($) => {
    class Map {
        constructor(info) {
            this.id = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sgMap")) {
                    return;
                }
                if (main.hasClass("sg-map")) {
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
            _sgQuery(window).on("load", () => {
                // this.loadMap(main);
            });
        }
        loadMap(main) {
            main.addClass("sg-map");
            var mymap = L.map(this.id).setView([10.480594, -66.903603], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11'
            }).addTo(mymap);
        }
        _create2(main) {
            main.addClass("sg-map");
            let map = new google.maps.Map(main.get(), {
                center: { lat: 10.480594, lng: -66.903603 },
                zoom: 14
            });
        }
        _create(main) {
            main.addClass("sg-map");
            var mymap = L.map(this.id).setView([10.480594, -66.903603], 13);
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11'
            }).addTo(mymap);
        }
        _load(main) { }
    }
    return Map;
})(_sgQuery);
