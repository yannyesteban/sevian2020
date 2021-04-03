import { _sgQuery as $ } from '../Sevian/ts/Query.js';
export class MarkControl {
    constructor(object) {
        this.id = "mapboxgl-ctrl-mark";
        this._map = null;
        this._container = null;
        this._line = null;
        this._mode = 0;
        this._parent = null;
        this._meter = 1;
        this._group = null;
        this._length = null;
        this._unit = null;
        this._group1 = null;
        this._group2 = null;
        this._btnRule = null;
        this._btnLine = null;
        this._btnUnit = null;
        this._btnMultiLine = null;
        this._btnTrash = null;
        this._btnExit = null;
        this._inpLng = null;
        this._inpLat = null;
        this.length = 0;
        this.coordinates = [];
        this.images = [];
        this.image = null;
        this.defaultImage = null;
        this.defaultCoordinates = null;
        this.onnew = () => { };
        this.onplay = (coords, propertys) => { };
        this.onsave = (coords, propertys) => { };
        this.onstop = (coords, propertys) => { };
        this.onchange = (coords, propertys) => { };
        this._parent = object;
    }
    onAdd(map) {
        this._map = map;
        this._container = $.create("div").addClass(["mark-tool-main"]);
        this._group = this._container.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "mark-tool-text"])
            .style("display", "none");
        this._length = this._group.create("div").addClass("mark-tool-value");
        let images = null;
        let g1 = this._length.create("div").addClass("mark-tool-g1");
        let g2 = this._length.create("div").addClass("mark-tool-g2");
        this._inpLng = g1.create("input").prop({ type: "text" }).
            on("change", (event) => {
            this._line.setLngLat([this._inpLng.val(), this._inpLat.val()]);
        });
        this._inpLat = g1.create("input").prop({ type: "text" }).
            on("change", (event) => {
            this._line.setLngLat([this._inpLng.val(), this._inpLat.val()]);
        });
        this.defaultImage = this._parent.markDefaultImage;
        for (let x in this._parent.markImages) {
            images = g2.create("div").create("img");
            images.prop("src", this._parent.markImages[x]);
            images.on("click", () => {
                this.image = x;
                this._line.setImage(x);
                this.onchange({
                    coordinates: this.coordinates,
                    image: this.image,
                    size: this._line.getSize()
                });
            });
        }
        //this._unit = this._group.create("span");
        //this._unit.addClass("rule-tool-unit").text("km")
        this._group1 = this._container.create("div");
        this._group1.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "mark-tool"]);
        this._btnRule = this._group1.create("button").prop({ "type": "button", "title": "Inicia la herramienta de Marcas / Sitios" }).addClass("icon-marker");
        this._btnRule.on("click", () => {
            this.play();
            this.onnew({
                coordinates: this.coordinates,
                image: this.image,
                size: this._line.getSize()
            });
        });
        this._group2 = this._container.create("div").style("display", "none");
        this._group2.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "mark-tool"]);
        /*
        this._btnLine = this._group2.create("button").prop({"type": "button", "title":"Seleccionar imagen a mostrar"}).addClass("icon-image")
        .on("click", ()=>{
            
        });
        */
        this._group2.create("button").prop({ "type": "button", "title": "Aumentar [+] Tamaño" }).addClass("icon-max")
            .on("click", () => {
            let size = this._line.getSize();
            this._line.setSize(null, size[1] * 1.2);
            this.onchange({
                coordinates: this.coordinates,
                image: this.image,
                size: this._line.getSize()
            });
            //this._line.setMax(1);
        });
        this._group2.create("button").prop({ "type": "button", "title": "Disminuir [-] Tamaño" }).addClass("icon-min")
            .on("click", () => {
            let size = this._line.getSize();
            this._line.setSize(null, size[1] * 0.8);
            this.onchange({
                coordinates: this.coordinates,
                image: this.image,
                size: this._line.getSize()
            });
        });
        this._group2.create("button").prop({ "type": "button", "title": "Guardar" }).addClass(["icon-save"])
            .on("click", () => {
            this.onsave({ coordinates: this._line.getCoordinates(), image: this.image });
        });
        this._btnTrash = this._group2.create("button").prop({ "type": "button", "title": "Descartar" }).addClass(["icon-trash"])
            .on("click", () => {
            //this._length.text("0");
            this._line.reset();
        });
        this._btnExit = this._group2.create("button").prop({ "type": "button", "title": "Salir" }).addClass(["icon-exit"])
            .on("click", () => {
            this.stop();
        });
        return this._container.get();
    }
    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
    play(info) {
        this._parent.stopControls();
        if (this._mode == 0) {
            this._group.style("display", "");
            this._group1.style("display", "none");
            this._group2.style("display", "");
            this._mode = 1;
        }
        if (info) {
            this.defaultImage = info.defaultImage;
            this.defaultCoordinates = info.defaultCoordinates;
            this.onstop = info.onstop;
        }
        else {
            this.coordinates = [this._map.getCenter().lng, this._map.getCenter().lat];
            this.defaultCoordinates = this.coordinates.slice();
        }
        this.image = this.defaultImage;
        this._line = this._parent.draw(this.id, "mark", {
            coordinates: this.defaultCoordinates,
            height: 30,
            image: this.image,
        });
        this._inpLng.val(this.defaultCoordinates[0].toFixed(8));
        this._inpLat.val(this.defaultCoordinates[1].toFixed(8));
        this._line.ondraw = (coord) => {
            this.coordinates = coord;
            this._inpLng.val(coord[0].toFixed(8));
            this._inpLat.val(coord[1].toFixed(8));
            this.onchange({
                coordinates: this.coordinates,
                image: this.image,
                size: this._line.getSize()
            });
        };
        this._line.play();
        this.onplay();
    }
    setLength(length) {
    }
    toggleUnit() {
    }
    delete() {
        //this._line.stop();
        this._line.stop();
        this._parent.delete(this.id);
    }
    stop() {
        if (this._mode == 1) {
            this.delete();
            this._group.style("display", "none");
            this._group1.style("display", "");
            this._group2.style("display", "none");
            this._mode = 0;
            this.onstop();
        }
    }
}
//# sourceMappingURL=MarkControl.js.map