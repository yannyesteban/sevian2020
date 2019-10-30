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
        }
        _create(main) {
            main.addClass("sg-map");
            let map = new google.maps.Map(main.get(), {
                center: { lat: 10.480594, lng: -66.903603 },
                zoom: 14
            });
        }
        _load(main) { }
    }
    return Map;
})(_sgQuery);
