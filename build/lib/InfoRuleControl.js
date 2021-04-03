import { _sgQuery as $ } from '../Sevian/ts/Query.js';
export class InfoRuleControl {
    constructor(object) {
        this.id = "mapboxgl-ctrl-rule";
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
        this.propertys = {
            color: "#ff0000",
            opacity: 0.4
        };
        this.length = 0;
        this._parent = object;
    }
    onAdd(map) {
        this._map = map;
        this._container = $.create("div").addClass(["rule-tool-main"]);
        this._group = this._container.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool-text"])
            .style("display", "none");
        this._length = this._group.create("span").addClass("rule-tool-value");
        this._length.text("0");
        this._unit = this._group.create("span");
        this._unit.addClass("rule-tool-unit").text("km")
            .on("click", () => {
            //this.toggleUnit();
        });
        this._group1 = this._container.create("div");
        this._group1.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool"]);
        this._btnRule = this._group1.create("button").prop({ "type": "button", "title": "Inicia la herramienta de medición" }).addClass("icon-rule");
        this._btnRule.on("click", () => {
            this.play();
        });
        this._group2 = this._container.create("div").style("display", "none");
        this._group2.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool"]);
        this._btnLine = this._group2.create("button").prop({ "type": "button", "title": "Dibujar una línea recta" }).addClass("icon-line")
            .on("click", () => {
            this._length.text("0");
            this._line.setMaxLines(1);
        });
        this._btnMultiLine = this._group2.create("button").prop({ "type": "button", "title": "Dibujar una línea de varios segmentos" }).addClass(["icon-multi-line"])
            .on("click", () => {
            this._length.text("0");
            this._line.setMaxLines(0);
        });
        this._btnUnit = this._group2.create("button").prop({ "type": "button", "title": "Cambiar la unidad de metros a kilometros y viceversa" }).addClass(["icon-unit"]).text("K")
            .on("click", () => {
            this.toggleUnit();
        });
        this._btnTrash = this._group2.create("button").prop({ "type": "button", "title": "Descarta la medición actual" }).addClass(["icon-trash"])
            .on("click", () => {
            this._length.text("0");
            this._line.reset();
        });
        this._btnExit = this._group2.create("button").prop({ "type": "button", "title": "Salir de la herramienta de medición" }).addClass(["icon-exit"])
            .on("click", () => {
            this._length.text("0");
            this.stop();
        });
        return this._container.get();
    }
    onRemove() {
        this._container.parentNode.removeChild(this._container);
        this._map = undefined;
    }
    play() {
        this._parent.stopControls();
        if (this._mode == 0) {
            this._group.style("display", "");
            this._group1.style("display", "none");
            this._group2.style("display", "");
            this._mode = 1;
        }
        this._line = this._parent.draw(this.id, "rule", {
            maxLines: 1,
            ondraw: (coordinates) => {
                if (coordinates.length > 1) {
                    let line = turf.lineString(coordinates);
                    //turf.length(linestring).toLocaleString()
                    this.setLength(turf.length(line, { units: "meters" }));
                    //this.length = ;
                    //this._length.text(this.length.toLocaleString());
                }
            }
        });
        this._line.play();
    }
    setLength(length) {
        this.length = length;
        if (this._meter == 0) {
            this._length.text((this.length / 1000).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            this._unit.text("Km");
        }
        else {
            this._length.text(this.length.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            this._unit.text("m");
        }
    }
    toggleUnit() {
        if (this._meter == 0) {
            this._meter = 1;
        }
        else {
            this._meter = 0;
        }
        this.setLength(this.length);
    }
    delete() {
        //this._line.stop();
        this._parent.delete(this.id);
    }
    stop() {
        if (this._mode == 1) {
            this.delete();
            this._group.style("display", "none");
            this._group1.style("display", "");
            this._group2.style("display", "none");
            this._mode = 0;
        }
    }
}
//# sourceMappingURL=InfoRuleControl.js.map