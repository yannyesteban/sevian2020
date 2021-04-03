import { _sgQuery as $ } from '../Sevian/ts/Query.js';
export class PolyControl {
    constructor(object) {
        this.id = "mapboxgl-ctrl-poly";
        this.type = "circle";
        this._map = null;
        this._container = null;
        this._line = null;
        this._mode = 0;
        this._parent = null;
        this._meter = 1;
        this._type = null;
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
        this._fill = null;
        this._alpha = null;
        this.length = 0;
        this.defaultCoordinates = null;
        this.fill = {
            color: "#2fb5f9",
            opacity: 0.4
        };
        this.line = {
            color: "#2fb5f9",
            opacity: 1,
            width: 2,
            dasharray: [2, 2]
        };
        this.onstart = (coords, propertys) => { };
        this.onsave = (coords, propertys) => { };
        this.onexit = (coords, propertys) => { };
        this._parent = object;
    }
    onAdd(map) {
        this._map = map;
        this._container = $.create("div").addClass(["poly-tool-main"]);
        this._group = this._container.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "poly-tool-info"])
            .style("display", "none");
        this._groupi = this._group.create("div").addClass(["info"]);
        this._length = this._groupi.create("span").addClass("poly-tool-value");
        this._length.text("0 Km<sup>2</sup>");
        this._group0 = this._group.create("div").addClass(["propertys"]);
        this._group0.create("span").text("Color: ");
        this._fill = this._group0.create("input").prop({ "type": "color", "title": "Color", "value": this.fill.color }).
            on("change", (event) => {
            this.evalPropertys();
        });
        this._group0.create("span").text("Opacidad: ");
        let options = "";
        for (let i = 0.1; i <= 1; i = i + 0.1) {
            options += `<option value=${i}>${i.toPrecision(1)}</option>`;
        }
        this._alpha = this._group0.create("select").prop({ "title": "Opacidad" }).
            text(options).
            on("change", (event) => {
            this.evalPropertys();
        }).val(this.fill.opacity);
        this._group1 = this._container.create("div");
        this._group1.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool"]);
        this._btnRule = this._group1.create("button").prop({ "type": "button", "title": "Inicia la herramienta de Polígonos" }).addClass("icon-poly");
        this._btnRule.on("click", () => {
            this.play({});
        });
        this._group2 = this._container.create("div").style("display", "none");
        this._group2.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "rule-tool"]);
        this._btnLine = this._group2.create("button").prop({ "type": "button", "title": "Dibujar un Círculo" }).addClass("icon-circle")
            .on("click", () => {
            this.delete();
            this.setCircle();
        });
        this._btnMultiLine = this._group2.create("button").prop({ "type": "button", "title": "Dibujar un Rectángulo" }).addClass(["icon-rectangle"])
            .on("click", () => {
            this.delete();
            this.setRectangle();
        });
        this._group2.create("button").prop({ "type": "button", "title": "Dibuja un Polígono" }).addClass(["icon-poly"])
            .on("click", () => {
            this.delete();
            this.setPolygon();
        });
        this._btnUnit = this._group2.create("button").prop({ "type": "button", "title": "Guardar" }).addClass(["icon-save"])
            .on("click", () => {
            this.onsave(this._line.getCoordinates());
        });
        this._btnTrash = this._group2.create("button").prop({ "type": "button", "title": "Descarta la medición actual" }).addClass(["icon-trash"])
            .on("click", () => {
            this._length.text("0");
            this._line.reset();
        });
        this._btnExit = this._group2.create("button").prop({ "type": "button", "title": "Salir" }).addClass(["icon-exit"])
            .on("click", () => {
            this._line.stop();
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
        this.defaultCoordinates = info.defaultCoordinates || [];
        this.type = info.type || this.type;
        if (this._mode == 0) {
            this._group.style("display", "");
            this._group1.style("display", "none");
            this._group2.style("display", "");
            this._mode = 1;
        }
        switch (this.type) {
            case "circle":
                this.setCircle();
                break;
            case "rectangle":
                this.setRectangle();
                break;
            case "polygon":
                this.setPolygon();
                break;
        }
    }
    evalPropertys() {
        this.fill = {
            color: this._fill.val(),
            opacity: this._alpha.val() * 1
        };
        this.line = {
            color: this._fill.val(),
            dasharray: [2, 2],
            opacity: 1,
            width: 2
        };
        this._line.setFill(this.fill);
        this._line.setLine(this.line);
    }
    setLength(length) {
    }
    toggleUnit() {
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
    delete() {
        this._length.text("0 Km<sup>2</sup>");
        this._parent.delete(this.id);
    }
    printArea(area) {
        if (area > 1000000) {
            area = area / 1000000;
            this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km<sup>2</sup>");
        }
        else {
            this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m<sup>2</sup>");
        }
    }
    setCircle() {
        this._line = this._parent.draw(this.id, "circle", {
            fill: this.fill,
            line: this.line,
            fillEdit: this.fill,
            lineEdit: this.line,
            coordinates: this.defaultCoordinates,
        });
        this._line.ondraw = (coordinates) => {
            let radio = this._line.getRadio();
            let area = Math.PI * Math.pow(radio, 2);
            this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km<sup>2</sup>" + " (R: " + radio.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km)");
            return;
            if (coordinates.length > 2) {
                let coord = coordinates.slice();
                coord.push(coord[0]);
                let polygon = turf.polygon([coord]);
                let area = turf.area(polygon);
                if (area > 1000000) {
                    area = area / 1000000;
                    this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                    this._unit.text("Km<sup>2</sup>");
                }
                else {
                    this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                    this._unit.text("m<sup>2</sup>");
                }
            }
            else {
                this._length.text("0");
                this._unit.text("Km<sup>2</sup>");
            }
        };
        this._line.play();
        this._type = 1;
    }
    setRectangle() {
        this._line = this._parent.draw(this.id, "rectangle", {
            fill: this.fill,
            line: this.line,
            fillEdit: this.fill,
            lineEdit: this.line,
            coordinates: this.defaultCoordinates,
        });
        this._line.ondraw = (coordinates) => {
            this.printArea(this._line.getArea());
        };
        this._line.play();
        this._type = 2;
    }
    setPolygon() {
        this._line = this._parent.draw(this.id, "polygon", {
            fill: this.fill,
            line: this.line,
            fillEdit: this.fill,
            lineEdit: this.line,
        });
        this._line.ondraw = (coordinates) => {
            if (coordinates.length > 2) {
                let coord = coordinates.slice();
                coord.push(coord[0]);
                let polygon = turf.polygon([coord]);
                this.printArea(turf.area(polygon));
            }
            else {
                this._length.text("0 Km<sup>2</sup>");
            }
        };
        this._line.play();
        this._type = 3;
    }
}
//# sourceMappingURL=PolyControl.js.map