import { _sgQuery as $, SQObject } from "../Sevian/ts/Query.js";
import { IPoly } from "./IPoly";
import { Form2 as Form } from "../Sevian/ts/Form2.js";

export class MarkControl {
    private newId: string = "mapboxgl-ctrl-mark";
    private id: any = "";
    private name: string = "";
    private color: string = "#460046";
    private opacity: number = 0.2;
    private mode: number = 1;
    private rol: string = "polygon";

    private feature = null;
    private poly: IPoly = null;

    private main: SQObject = null;
    private menu: SQObject = null;
    private panel: SQObject = null;
    private bar: SQObject = null;

    private mainButton: SQObject = null;
    private subPanel: SQObject = null;

    private colorInput: SQObject = null;
    private opacityInput: SQObject = null;

    private form: Form = null;

    private map: any = null;
    private parentControl: any = null;
    private infoForm = {
        className: "filter-form",
        caption: "Sitios",
        geoFenceCaption: "Seleccione un Sitio",
        nameCaption: "Nombre",
        categoryCaption: "Category",
        descriptionCaption: "Descripción",
        coordinatesCaption: "Coordenadas",
        resetCaption: "Reiniciar",

        addressCaption: "Dirección",
        phone1Caption: "Teléfono 1",
        phone2Caption: "Teléfono 2",
        phone3Caption: "Teléfono 3",
        emailCaption: "Correo Electrónico",

        propertysCaption: "Propiedades",
        typeCaption: "Tipo",
        saveCaption: "Guardar",
        newCaption: "+",
        deleteCaption: "Eliminar",
        warnningDelete: "Seguro?",
    };

    public onInit: Function = () => { };
    public onLoadGeofence: Function = (id) => { };
    public onstart: Function = (coords, propertys) => { };
    public onsave: Function = (coords, propertys) => { };
    public ondelete: Function = (coords, propertys) => { };
    public onexit: Function = (coords, propertys) => { };
    public onNew: Function = () => { };

    public ondraw: Function = (config) => { };
    public onlength: Function = (length) => {
        console.log(length);
    };

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
        this.menu = this.main
            .create("div")
            .addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "menu"]);
        this.panel = this.main
            .create("div")
            .addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "panel"])
            .style("display", "none");
        this.subPanel = this.main
            .create("div")
            .addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "sub-panel"])
            .style("display", "none");
        this.bar = this.main
            .create("div")
            .addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "bar"])
            .style("display", "none");

        this.createPropertysControl(this.subPanel);

        this.mainButton = this.menu
            .create("button")
            .prop({ type: "button", title: "Inicia la herramienta de Polígonos" })
            .addClass("icon-poly");
        this.mainButton.on("click", () => {
            this.play({});
        });

        //this.body = this._container.create("div").style("display","none");
        //this.body.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group"]);

        this.bar
            .create("button")
            .prop({ type: "button", title: "Dibujar un Círculo" })
            .addClass("icon-circle")
            .on("click", () => {
                this.setRol("circle");
            });

        this.bar
            .create("button")
            .prop({ type: "button", title: "Dibujar un Rectángulo" })
            .addClass(["icon-rectangle"])
            .on("click", () => {
                this.setRol("rectangle");
            });

        this.bar
            .create("button")
            .prop({ type: "button", title: "Dibuja un Polígono" })
            .addClass(["icon-poly"])
            .on("click", () => {
                this.setRol("polygon");
            });

        /*this.bar
            .create("button")
            .prop({ type: "button", title: "Descarta la medición actual" })
            .addClass(["icon-trash"])
            .on("click", () => {
                this.reset();
            });*/
        this.bar
            .create("button")
            .prop({ type: "button", title: "Salir" })
            .addClass(["icon-exit"])
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

    play(info?) {
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

    setLength(length) { }

    toggleUnit() { }

    stop() {
        this.reset();
        this.menu.style("display", "");
        this.panel.style("display", "none");
        this.subPanel.style("display", "none");
        this.bar.style("display", "none");
        if (this.poly) {
            this.poly.stop();
        }
    }

    delete() {
        this.parentControl.delete(this.getId());

        this.onlength("0 Km<sup>2</sup>");
    }
    reset() {
        if (this.poly) {
            this.poly.reset();
        }
    }
    printArea(area) {
        if (area > 1000000) {
            area = area / 1000000;
            this.onlength(
                area.toLocaleString("de-DE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }) + " Km<sup>2</sup>"
            );
        } else {
            this.onlength(
                area.toLocaleString("de-DE", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }) + " m<sup>2</sup>"
            );
        }
    }



    setPolygon(rol, info) {
        //this.feature = feature;

        //this.defaultFeature = JSON.parse(JSON.stringify(this.feature));

        //console.log(this.rol, this.feature.properties.rol);

        this.poly = this.parentControl.draw(this.getId(), rol, info);
        this.poly.ondraw = (feature) => {
            /*
                        const coordinates = feature.geometry.coordinates;
                        console.log(feature)
                        if (coordinates.length > 2) {
                            console.log(coordinates)
                            let coord = coordinates.slice();
                            coord.push(coord[0]);
                            let polygon = turf.polygon([coord]);
                            this.printArea(turf.area(polygon));

                        } else {
                            this.onlength("0 Km<sup>2</sup>");

                        }
                        */
            this.ondraw(feature);
            this.updateForm(feature);
        };
        this.poly.play();
    }

    createPropertysControl(main) {
        const colorMain = main.create("div").addClass("propertys");
        const alphaMain = main.create("div").addClass("propertys");
        colorMain.create("div").addClass("color").text("Color");
        alphaMain.create("div").addClass("color").text("Opacidad");
        this.colorInput = colorMain
            .create("input")
            .prop({ type: "color", title: "Color", value: this.color })
            .on("change", (event) => {
                this.color = event.currentTarget.value;
                this.evalPropertys({
                    color: event.currentTarget.value,
                });
            });

        let options = "";
        for (let i = 0.1; i <= 1; i = i + 0.1) {
            options += `<option value=${i.toPrecision(1)}>${i.toPrecision(
                1
            )}</option>`;
        }

        this.opacityInput = alphaMain
            .create("select")
            .prop({ title: "Opacidad" })
            .text(options)
            .on("change", (event) => {
                this.opacity = event.currentTarget.value;
                this.evalPropertys({
                    opacity: Number.parseFloat(event.currentTarget.value),
                });
            })
            .val(this.opacity);
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
                    name: "siteId",
                    value: "",
                    caption: this.infoForm.caption,
                    //data:this.getLayerList(),
                    events: {
                        change: (event) => {
                            if (event.currentTarget.value === "") {
                                this.newGeofence();
                            } else {
                                this.onLoadGeofence(event.currentTarget.value);
                            }
                        },
                    },
                },
                {
                    input: "input",
                    type: "hidden",
                    name: "id",
                    value: "",
                    caption: "id",
                },
                {
                    input: "input",
                    type: "text",
                    name: "name",
                    value: "",
                    caption: this.infoForm.nameCaption,
                    rules: {
                        required: {},
                    },
                },
                {
                    input: "input",
                    type: "select",
                    name: "category_id",
                    value: "",
                    caption: this.infoForm.categoryCaption,
                    //data:this.getLayerList(),

                },
                {
                    input: "input",
                    type: "text",
                    name: "description",
                    value: "",
                    caption: this.infoForm.descriptionCaption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "text",
                    name: "address",
                    value: "",
                    caption: this.infoForm.addressCaption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "text",
                    name: "phone1",
                    value: "",
                    caption: this.infoForm.phone1Caption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "text",
                    name: "phone2",
                    value: "",
                    caption: this.infoForm.phone2Caption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "text",
                    name: "phone3",
                    value: "",
                    caption: this.infoForm.phone3Caption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "text",
                    name: "email",
                    value: "",
                    caption: this.infoForm.emailCaption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "hidden",
                    name: "type",
                    value: "",
                    caption: this.infoForm.typeCaption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "textarea",
                    name: "geojson",
                    value: "",
                    caption: this.infoForm.coordinatesCaption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "hidden",
                    name: "propertys",
                    value: "",
                    caption: this.infoForm.propertysCaption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "hidden",
                    name: "__mode_",
                    value: "1",
                    default: "1",
                    caption: "__mode_",
                    rules: {},
                },
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
                            this.newGeofence();
                        },
                    },
                    {
                        id: 2,
                        caption: this.infoForm.saveCaption,
                        action: (item, event) => {
                            if (this.form.valid()) {
                                this.onsave(this.form.getValue());
                                //this.saveLayer(this.forms["layer"].getValue());
                            }
                        },
                    },
                    {
                        id: 3,
                        caption: this.infoForm.deleteCaption,
                        action: (item, event) => {
                            this.ondelete(this.form.getValue());
                            //this.deleteLayer(this.forms["layer"].getValue());
                        },
                    },
                    {
                        id: 4,
                        caption: this.infoForm.resetCaption,
                        action: (item, event) => {
                            this.reset();
                            //this.deleteLayer(this.forms["layer"].getValue());
                        },
                    },
                ],
            },
        });
    }

    setEmptyPolygon() {
        this.setPolygon(this.rol, {
            color: this.colorInput.val(),
            opacity: Number(this.opacityInput.val()),
        });
    }
    setRol(rol) {
        this.rol = rol;
        this.delete();
        //this.feature.properties.rol = this.rol;
        //this.feature.geometry.coordinates = null;
        this.setEmptyPolygon();
    }
    setGeogenceList(data) {
        data = [{ id: "", name: "" }].concat(data);

        this.form
            .getInput("geofenceId")
            .setOptionsData(data.map((e) => [e.id, e.name]));
    }
    setSiteList(data) {
        data = [{ id: "", name: "" }].concat(data);

        this.form
            .getInput("siteId")
            .setOptionsData(data.map((e) => [e.id, e.name]));
    }
    setCategoryList(data) {
        console.log(data)
        data = [{ id: "", name: "" }].concat(data);

        this.form
            .getInput("category_id")
            .setOptionsData(data.map((e) => [e.id, e.name]));
    }
    newSite() {
        this.newForm();

        this.updateForm("");
        this.setEmptyPolygon();
    }
    newGeofence() {
        this.newForm();

        this.updateForm("");
        this.setEmptyPolygon();
    }
    setGeogence(data) {

        if (this.mode == 1) {
            this.parentControl.delete(this.newId);
        }
        const geojson = JSON.parse(data.geojson);

        this.mode = 2;
        data.__mode_ = 2;
        this.name = data.name;
        this.id = data.id;
        this.form.setValue(data);
        this.colorInput.val(geojson.properties.color);
        this.opacityInput.val(geojson.properties.opacity);
        this.setPolygon(geojson.properties.rol, { feature: geojson });
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
