export class Cluster{
    private id: string = "p" + String(new Date().getTime());
    private map = null;
    private data: any[] = [];

    private points: any[] = [];
    private mainSourceId: string = "";
    private clusterLayerId: string = "";
    private textLayerId: string = "";
    private pointLayerId: string = "";

    private popup:any = null;
    public onShowInfo:Function = (info)=>{};

    private funContextMenu:Function = null;

    private popupInfo: any = null;

    constructor(info: object) {

        for (let x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        this.mainSourceId = "cms-" + this.id;
        this.clusterLayerId = "cml-" + this.id;
        this.textLayerId = "ctl-" + this.id;
        this.pointLayerId = "cpl-" + this.id;



    }

    init(data?) {
        if (data !== undefined) {
            this.data = data;
        }
        //this.registerImages(this.images);
        //console.log(this.map);

        this.popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        /*
        if (typeof this.popupInfo === "string") {
            this.popup.setHTML(this.popupInfo);
        } else {
            this.popup.setDOMContent(this.popupInfo);
        }
        */
        this.initSource(this.data);

        this.createLayers();



    }


    addPoint(point) {

    }
    removePoint(index) {

    }


    createGeoJson(data){

        const geojson = {
            "type": "geojson",
            "data": {
                "type": "FeatureCollection",
                "features": []
            },
            "cluster": true,
            "clusterMaxZoom": 14, // Max zoom to cluster points on
            "clusterRadius": 50 // Radius of each cluster when clustering
        };

        data.forEach((e, index) => {

            let point = {
                "type": "Feature",
                "properties": e,
                "geometry": {
                    "type": "Point",
                    "coordinates": [e.longitude, e.latitude]
                }
            };
            geojson.data.features.push(point);
        });

        return geojson;
    }

    initSource(data){
        this.map.addSource(this.mainSourceId, this.createGeoJson(data));
    }

    updateSource(data) {
        if (this.map.getSource(this.mainSourceId)) {
            this.map.getSource(this.mainSourceId).setData(this.createGeoJson(data).data);
        }

    }

    createLayers(info?){
        const map = this.map;

        map.addLayer({
            id: "clusters",
            type: "circle",
            source: this.mainSourceId,
            filter: ["has", "point_count"],
            paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                "circle-color": [
                    "step",
                    ["get", "point_count"],
                    "#51bbd6",
                    100,
                    "#f1f075",
                    750,
                    "#f28cb1"
                ],
                "circle-radius": [
                    "step",
                    ["get", "point_count"],
                    20,
                    100,
                    30,
                    750,
                    40
                ]
            }
        });

        map.addLayer({
            id: this.textLayerId,
            type: "symbol",
            source: this.mainSourceId,
            filter: ["has", "point_count"],
            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                "text-size": 12
            }
        });

        map.addLayer({
            id: this.pointLayerId,
            type: "circle",
            source: this.mainSourceId,
            filter: ["!", ["has", "point_count"]],
            paint: {
                "circle-color": "#11b4da",
                "circle-radius": 4,
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff"
            }
        });

        // inspect a cluster on click
        map.on("click", this.clusterLayerId, function (e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: [this.clusterLayerId]
            });
            var clusterId = features[0].properties.cluster_id;
            map.getSource(this.mainSourceId).getClusterExpansionZoom(
                clusterId,
                function (err, zoom) {
                    if (err) return;

                    map.easeTo({
                        center: features[0].geometry.coordinates,
                        zoom: zoom
                    });
                }
            );
        });

        // When a click event occurs on a feature in
        // the unclustered-point layer, open a popup at
        // the location of the feature, with
        // description HTML from its properties.
        map.on("click", this.pointLayerId, function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var mag = e.features[0].properties.mag;
            var tsunami;

            if (e.features[0].properties.tsunami === 1) {
                tsunami = "yes";
            } else {
                tsunami = "no";
            }

            // Ensure that if the map is zoomed out such that
            // multiple copies of the feature are visible, the
            // popup appears over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                    "magnitude: " + mag + "<br>Was there a tsunami?: " + tsunami
                )
                .addTo(map);
        });

        map.on("mouseenter", this.clusterLayerId, function () {
            map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", this.clusterLayerId, function () {
            map.getCanvas().style.cursor = "";
        });

    }

}