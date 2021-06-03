import { _sgQuery as $ } from '../Sevian/ts/Query.js';
import { Form2 as Form } from '../Sevian/ts/Form2.js';
export class PolyControl {
    constructor(object) {
        this.newId = "mapboxgl-ctrl-poly";
        this.id = "";
        this.name = "";
        this.color = "";
        this.opacity = "";
        this.mode = 1;
        this.feature = {};
        this.poly = null;
        this.main = null;
        this.menu = null;
        this.panel = null;
        this.bar = null;
        this.mainButton = null;
        this.subPanel = null;
        this.colorInput = null;
        this.opacityInput = null;
        this.form = null;
        this.map = null;
        this.parentControl = null;
        this.infoForm = {
            className: "filter-form",
            caption: "Geocerca",
            geoFenceCaption: "Seleccione una Geocerca",
            nameCaption: "Nombre",
            descriptionCaption: "Descripción",
            coordinatesCaption: "Coordenadas",
            propertysCaption: "Propiedades",
            typeCaption: "Tipo",
            saveCaption: "Guardar",
            newCaption: "Nuevo+",
            deleteCaption: "Eliminar"
        };
        this.onInit = () => { };
        this.onLoadGeofence = (id) => { };
        this.onstart = (coords, propertys) => { };
        this.onsave = (coords, propertys) => { };
        this.onexit = (coords, propertys) => { };
        this.onNew = () => { };
        this.ondraw = (config) => { };
        this.onlength = (length) => { console.log(length); };
        this.parentControl = object;
    }
    getMain() {
        return this.main;
    }
    getPanel() {
        return this.panel;
    }
    onAdd(map) {
        this.map = map;
        this.main = $.create("div").addClass(["poly-tool"]);
        this.menu = this.main.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "menu"]);
        this.panel = this.main.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "panel"]).style("display", "none");
        this.subPanel = this.main.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "sub-panel"]).style("display", "none");
        this.bar = this.main.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "bar"]).style("display", "none");
        this.createPropertysControl(this.subPanel);
        this.mainButton = this.menu.create("button").prop({ "type": "button", "title": "Inicia la herramienta de Polígonos" }).addClass("icon-poly");
        this.mainButton.on("click", () => {
            this.play({});
        });
        //this.body = this._container.create("div").style("display","none");
        //this.body.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group"]);
        this.bar.create("button").prop({ "type": "button", "title": "Dibujar un Círculo" }).addClass("icon-circle")
            .on("click", () => {
            this.delete();
            this.setCircle();
        });
        this.bar.create("button").prop({ "type": "button", "title": "Dibujar un Rectángulo" }).addClass(["icon-rectangle"])
            .on("click", () => {
            this.delete();
            this.setRectangle();
        });
        this.bar.create("button").prop({ "type": "button", "title": "Dibuja un Polígono" }).addClass(["icon-poly"])
            .on("click", () => {
            this.delete();
            this.setPolygon();
        });
        this.bar.create("button").prop({ "type": "button", "title": "Guardar" }).addClass(["icon-save"])
            .on("click", () => {
            this.onsave(this.poly.getCoordinates());
        });
        this.bar.create("button").prop({ "type": "button", "title": "Descarta la medición actual" }).addClass(["icon-trash"])
            .on("click", () => {
            this.reset();
        });
        this.bar.create("button").prop({ "type": "button", "title": "Salir" }).addClass(["icon-exit"])
            .on("click", () => {
            this.stop();
        });
        this.createForm(this.panel);
        return this.main.get();
    }
    onRemove() {
        alert("remove");
        //this.main.parentNode.removeChild(this.main);
        //this.map = undefined;
    }
    getId() {
        if (this.mode === 1) {
            return this.newId;
        }
        return this.id;
    }
    play(info) {
        this.parentControl.stopControls();
        this.onInit();
        this.panel.style("display", "");
        this.subPanel.style("display", "");
        this.bar.style("display", "");
        this.menu.style("display", "none");
    }
    evalPropertys(options) {
        this.poly.setProperties(options);
    }
    setLength(length) {
    }
    toggleUnit() {
    }
    stop() {
        this.menu.style("display", "");
        this.panel.style("display", "none");
        this.subPanel.style("display", "none");
        this.bar.style("display", "none");
        if (this.poly) {
            this.poly.stop();
        }
    }
    delete() {
        this.parentControl.delete(this.id);
        console.log("delete");
        this.onlength("0 Km<sup>2</sup>");
    }
    reset() {
        this.onlength("0 Km<sup>2</sup>");
        console.log("reset");
        this.poly.reset();
    }
    printArea(area) {
        if (area > 1000000) {
            area = area / 1000000;
            this.onlength(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km<sup>2</sup>");
        }
        else {
            this.onlength(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " m<sup>2</sup>");
        }
    }
    setCircle() {
        this.poly = this.parentControl.draw(this.id, "circle", {
            fill: this.fill,
            line: this.line,
            fillEdit: this.fill,
            lineEdit: this.line,
            coordinates: this.defaultCoordinates,
        });
        this.poly.ondraw = (coordinates) => {
            console.log(coordinates);
            let radio = this.poly.getRadio();
            let area = Math.PI * Math.pow(radio, 2);
            this.onlength(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km<sup>2</sup>" + " (R: " + radio.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km)");
            this.ondraw({ coordinates: coordinates, type: this.poly.getType() });
            this.updateForm({ coordinates: coordinates, type: this.poly.getType() });
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
        this.poly.play();
        this._type = 1;
    }
    setRectangle() {
        this.poly = this.parentControl.draw(this.id, "rectangle", {
            fill: this.fill,
            line: this.line,
            fillEdit: this.fill,
            lineEdit: this.line,
            coordinates: this.defaultCoordinates,
        });
        this.poly.ondraw = (coordinates) => {
            this.printArea(this.poly.getArea());
            this.ondraw({ coordinates: coordinates, type: this.poly.getType() });
            this.updateForm({ coordinates: coordinates, type: this.poly.getType() });
        };
        this.poly.play();
        this._type = 2;
    }
    setPolygon(feature) {
        this.feature = feature;
        console.log(this.getId());
        this.poly = this.parentControl.draw(this.getId(), "polygon", { feature: this.feature });
        this.poly.ondraw = (feature) => {
            const coordinates = feature.geometry.coordinates;
            console.log(feature);
            if (coordinates.length > 2) {
                console.log(coordinates);
                let coord = coordinates.slice();
                coord.push(coord[0]);
                let polygon = turf.polygon([coord]);
                this.printArea(turf.area(polygon));
            }
            else {
                this.onlength("0 Km<sup>2</sup>");
            }
            this.ondraw(feature);
            this.updateForm(feature);
        };
        this.poly.play();
        this._type = 3;
    }
    createPropertysControl(main) {
        const colorMain = main.create("div").addClass("propertys");
        const alphaMain = main.create("div").addClass("propertys");
        colorMain.create("div").addClass("color").text("Color");
        alphaMain.create("div").addClass("color").text("Opacidad");
        this.colorInput = colorMain.create("input").prop({ "type": "color", "title": "Color", "value": this.color }).
            on("change", (event) => {
            this.color = event.currentTarget.value;
            this.evalPropertys({
                color: event.currentTarget.value
            });
        });
        let options = "";
        for (let i = 0.1; i <= 1; i = i + 0.1) {
            options += `<option value=${i.toPrecision(1)}>${i.toPrecision(1)}</option>`;
        }
        this.opacityInput = alphaMain.create("select").prop({ "title": "Opacidad" }).
            text(options).
            on("change", (event) => {
            this.opacity = event.currentTarget.value;
            this.evalPropertys({
                opacity: Number.parseFloat(event.currentTarget.value),
            });
        }).val(this.opacity);
    }
    createForm(main) {
        this.form = new Form({
            caption: this.infoForm.caption,
            className: this.infoForm.className,
            id: main,
            fields: [
                {
                    input: "input",
                    type: "select",
                    name: "geofenceId",
                    value: "",
                    caption: this.infoForm.caption,
                    //data:this.getLayerList(),
                    events: {
                        "change": event => {
                            this.onLoadGeofence(event.currentTarget.value);
                            //this.loadLayer(event.currentTarget.value);
                        }
                    }
                },
                {
                    input: "input",
                    type: "hidden",
                    name: "id",
                    value: "",
                    caption: "id"
                },
                {
                    input: "input",
                    type: "text",
                    name: "name",
                    value: "",
                    caption: this.infoForm.nameCaption,
                    rules: {
                        required: {}
                    }
                },
                {
                    input: "input",
                    type: "text",
                    name: "description",
                    value: "",
                    caption: this.infoForm.descriptionCaption,
                    rules: {}
                },
                {
                    input: "input",
                    type: "hidden",
                    name: "type",
                    value: "",
                    caption: this.infoForm.typeCaption,
                    rules: {}
                },
                {
                    input: "input",
                    type: "textarea",
                    name: "geojson",
                    value: "",
                    caption: this.infoForm.coordinatesCaption,
                    rules: {}
                },
                {
                    input: "input",
                    type: "hidden",
                    name: "propertys",
                    value: "",
                    caption: this.infoForm.propertysCaption,
                    rules: {}
                },
                {
                    input: "input",
                    type: "hidden",
                    name: "__mode_",
                    value: "1",
                    default: "1",
                    caption: "__mode_",
                    rules: {}
                }
            ],
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        id: 1,
                        caption: this.infoForm.newCaption,
                        action: (item, event) => {
                            this.newForm();
                        }
                    },
                    {
                        id: 2,
                        caption: this.infoForm.saveCaption,
                        action: (item, event) => {
                            if (this.form.valid()) {
                                console.log(this.form.getValue());
                                this.onsave(this.form.getValue());
                                //this.saveLayer(this.forms["layer"].getValue());
                            }
                        }
                    },
                    {
                        id: 3,
                        caption: this.infoForm.deleteCaption,
                        action: (item, event) => {
                            //this.deleteLayer(this.forms["layer"].getValue());
                        }
                    }
                ]
            }
        });
    }
    setGeogenceList(data) {
        this.form.getInput("geofenceId").setOptionsData(data.map(e => [e.id, e.name]));
    }
    setGeogence(data) {
        const geojson = JSON.parse(data.geojson);
        console.log(geojson);
        this.mode = 2;
        data.__mode_ = 2;
        this.name = data.name;
        this.id = data.id;
        this.form.setValue(data);
        this.colorInput.val(geojson.properties.color);
        this.opacityInput.val(geojson.properties.opacity);
        this.setPolygon(geojson);
    }
    updateForm(feature) {
        this.form.getInput("geojson").setValue(JSON.stringify(feature));
    }
    newForm() {
        this.mode = 1;
        this.reset();
        this.form.reset();
        this.onNew();
    }
}
//# sourceMappingURL=PolyControl2.js.map