import { _sgQuery as $, SQObject } from '../Sevian/ts/Query.js';
import { IPoly } from './IPoly';
import { Form2 as Form } from '../Sevian/ts/Form2.js';

export class PolyControl {

    private id: string = "mapboxgl-ctrl-poly";
    private poly: IPoly = null;

    private main: SQObject = null;
    private menu: SQObject = null;
    private panel: SQObject = null;
    private bar: SQObject = null;

    private mainButton: SQObject = null;
    private subPanel: SQObject = null;

    private form: Form = null;

    private map: any = null;
    private parentControl: any = null;
    private infoForm = {
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
    }

    private fill: any = {
        color: "#2fb5f9",
        opacity: 0.4
    }
    private line: any = {
        color: "#2fb5f9",
        opacity: 1,
        width: 2,
        dasharray: [2, 2]

    }

    public onInit: Function = () => { };
    public onLoadGeofence: Function = (id) => { };
    public onstart: Function = (coords, propertys) => { };
    public onsave: Function = (coords, propertys) => { };
    public onexit: Function = (coords, propertys) => { };

    public ondraw: Function = (config) => { };
    public onlength: Function = (length) => { console.log(length) };

    constructor(object) {
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
        alert("remove")
        //this.main.parentNode.removeChild(this.main);
        //this.map = undefined;
    }

    play(info?) {
        this.parentControl.stopControls();

        this.onInit();
        this.panel.style("display", "");
        this.subPanel.style("display", "");
        this.bar.style("display", "");
        this.menu.style("display", "none");

    }

    evalPropertys(options) {

        for (let x in options.fill) {
            this.fill[x] = options.fill[x];
        }
        for (let x in options.line) {
            this.line[x] = options.line[x];
        }



        this.poly.setFill(this.fill);
        this.poly.setLine(this.line);
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
    }

    delete() {

        this.parentControl.delete(this.id);
        this.onlength("0 Km<sup>2</sup>");
    }
    reset() {
        this.onlength("0 Km<sup>2</sup>");
        this.poly.reset();
    }
    printArea(area) {
        if (area > 1000000) {
            area = area / 1000000;
            this.onlength(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km<sup>2</sup>");

        } else {
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
            console.log(coordinates)
            let radio = this.poly.getRadio();
            let area = Math.PI * Math.pow(radio, 2);
            this.onlength(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km<sup>2</sup>" + " (R: " + radio.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " Km)");
            this.ondraw({ coordinates: coordinates, type: this.poly.getType() });
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
                } else {
                    this._length.text(area.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
                    this._unit.text("m<sup>2</sup>");
                }


            } else {
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

        };
        this.poly.play();
        this._type = 2;
    }
    setPolygon() {
        this.poly = this.parentControl.draw(this.id, "polygon", {
            fill: this.fill,
            line: this.line,
            fillEdit: this.fill,
            lineEdit: this.line,
        });
        this.poly.ondraw = (coordinates) => {
            if (coordinates.length > 2) {
                console.log(coordinates)
                let coord = coordinates.slice();
                coord.push(coord[0]);
                let polygon = turf.polygon([coord]);
                this.printArea(turf.area(polygon));

            } else {
                this.onlength("0 Km<sup>2</sup>");

            }
            this.ondraw({ coordinates: coordinates, type: this.poly.getType() });
        };
        this.poly.play();
        this._type = 3;
    }

    createPropertysControl(main) {
        const colorMain = main.create("div").addClass("propertys");
        const alphaMain = main.create("div").addClass("propertys");
        const colorTitle = colorMain.create("div").addClass("color").text("Color");
        alphaMain.create("div").addClass("color").text("Opacidad");
        colorMain.create("input").prop({ "type": "color", "title": "Color", "value": this.fill.color }).
            on("change", (event) => {

                this.evalPropertys({
                    fill: {
                        color: event.currentTarget.value
                    },
                    line: {
                        color: event.currentTarget.value
                    }
                });

            });

        let options = "";
        for (let i = 0.1; i <= 1; i = i + 0.1) {
            options += `<option value=${i}>${i.toPrecision(1)}</option>`;
        }

        alphaMain.create("select").prop({ "title": "Opacidad" }).
            text(options).
            on("change", (event) => {
                this.evalPropertys({
                    fill: {
                        opacity: Number.parseFloat(event.currentTarget.value)
                    },
                    line: {
                        opacity: Number.parseFloat(event.currentTarget.value)
                    }
                });
            }).val(this.fill.opacity);
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
                    rules: {
                        required: {}
                    }
                },
                {
                    input: "input",
                    type: "text",
                    name: "type",
                    value: "",
                    caption: this.infoForm.typeCaption,
                    rules: {
                        required: {}
                    }
                },
                {
                    input: "input",
                    type: "text",
                    name: "coordinates",
                    value: "",
                    caption: this.infoForm.coordinatesCaption,
                    rules: {
                        required: {}
                    }
                },
                {
                    input: "input",
                    type: "text",
                    name: "propertys",
                    value: "",
                    caption: this.infoForm.propertysCaption,
                    rules: {

                    }
                },
                {
                    input: "input",
                    type: "text",
                    name: "__mode_",
                    value: "1",
                    default: "1",
                    caption: "__mode_",
                    rules: {

                    }
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
                            this.form.reset();
                        }
                    },
                    {
                        id: 2,
                        caption: this.infoForm.saveCaption,
                        action: (item, event) => {
                            if (this.form.valid()) {
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

    setGeogenceList(data){

        this.form.getInput("geofenceId").setOptionsData(
            data.map(e => [e.id, e.name]),
        );
    }
    setGeogence(data) {
        data.__mode_ = 2;
        this.form.setValue(data);
    }

}
