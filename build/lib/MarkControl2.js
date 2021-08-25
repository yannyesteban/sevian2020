import { _sgQuery as $ } from "../Sevian/ts/Query.js";
import { Form2 as Form } from "../Sevian/ts/Form2.js";
import { I } from '../Sevian/ts/Input.js';
export class MarkControl {
    constructor(object) {
        this.newId = "mapboxgl-ctrl-mark";
        this.id = "";
        this.mark = null;
        this.name = "";
        this.color = "#460046";
        this.opacity = 0.2;
        this.latitude = 0.22222;
        this.longitude = 0.55555;
        this.image = "";
        this.size = 30;
        this.defaultImage = "img_29";
        this.defaultSize = 30;
        this.mode = 1;
        this.rol = "polygon";
        this.feature = null;
        this.poly = null;
        this.main = null;
        this.menu = null;
        this.panel = null;
        this.bar = null;
        this.mainButton = null;
        this.subPanel = null;
        this.latInput = null;
        this.lngInput = null;
        this.scaleInput = null;
        this.form = null;
        this.map = null;
        this.parentControl = null;
        this.infoForm = {
            className: "filter-form",
            caption: "Sitios",
            geoFenceCaption: "Seleccione un Sitio",
            nameCaption: "Nombre",
            categoryCaption: "Category",
            descriptionCaption: "Descripción",
            coordinatesCaption: "Coordenadas",
            longitudeCaption: "Longitud",
            latitudeCaption: "Latitud",
            imageCaption: "Imagen",
            scaleCaption: "Tamaño",
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
        this.onInit = () => { };
        this.onLoadSite = (id) => { };
        this.onstart = (coords, propertys) => { };
        this.onsave = (coords, propertys) => { };
        this.ondelete = (coords, propertys) => { };
        this.onexit = (coords, propertys) => { };
        this.onNew = () => { };
        this.ondraw = (config) => { };
        this.onlength = (length) => {
            console.log(length);
        };
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
        this.main = $.create("div").addClass(["mark-tool"]);
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
        });
        this.bar
            .create("button")
            .prop({ type: "button", title: "Dibujar un Rectángulo" })
            .addClass(["icon-rectangle"])
            .on("click", () => {
        });
        this.bar
            .create("button")
            .prop({ type: "button", title: "Dibuja un Polígono" })
            .addClass(["icon-poly"])
            .on("click", () => {
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
    }
    getId() {
        if (this.mode === 1) {
            return this.newId;
        }
        return "site-" + this.id;
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
    setLength(length) { }
    stop() {
        this.reset();
        this.menu.style("display", "");
        this.panel.style("display", "none");
        this.subPanel.style("display", "none");
        this.bar.style("display", "none");
        if (this.mark) {
            this.mark.stop();
        }
    }
    delete() {
        this.parentControl.delete(this.getId());
        this.onlength("0 Km<sup>2</sup>");
    }
    reset() {
        if (this.mark) {
            this.mark.reset();
        }
        this.form.reset();
    }
    printArea(area) {
        if (area > 1000000) {
            area = area / 1000000;
            this.onlength(area.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }) + " Km<sup>2</sup>");
        }
        else {
            this.onlength(area.toLocaleString("de-DE", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }) + " m<sup>2</sup>");
        }
    }
    setMark(info) {
        //this.feature = feature;
        //this.defaultFeature = JSON.parse(JSON.stringify(this.feature));
        //console.log(this.rol, this.feature.properties.rol);
        this.poly = this.parentControl.draw(this.getId(), 'mark', info);
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
        const latMain = main.create("div").addClass("propertys");
        const lngMain = main.create("div").addClass("propertys");
        const imageMain = main.create("div").addClass("mark-tool-g2");
        latMain.create("div").addClass("color").text("Latitud");
        lngMain.create("div").addClass("color").text("Longitud");
        this.latInput = latMain
            .create("input")
            .prop({ type: "text", title: "Latitud", value: this.latitude })
            .on("change", (event) => {
            this.color = event.currentTarget.value;
            this.evalPropertys({
                color: event.currentTarget.value,
            });
        });
        this.lngInput = lngMain
            .create("input")
            .prop({ type: "text", title: "Longitud", value: this.longitude })
            .on("change", (event) => {
            this.color = event.currentTarget.value;
            this.evalPropertys({
                color: event.currentTarget.value,
            });
        });
        this.scaleInput = I.create("input", {
            type: "select",
            data: [20, 24, 26, 28, 30, 32, 36, 40, 44, 50, 60].map(e => [e, e]),
            target: latMain,
            events: {
                "onchange": (event) => {
                    this.setSize(event.currentTarget.value);
                }
            }
        });
        this.parentControl.markImages.forEach((image) => {
            const images = imageMain.create("div").create("img");
            images.prop("src", image.src);
            images.on("click", () => {
                this.image = image.src;
                this.mark.setImage(image.name);
                this.form.getInput("image").setValue(image.name);
                /*
                this.onchange({
                    coordinates: this.coordinates,
                    image: this.image,
                    size: this._line.getSize()
                });
                */
            });
        });
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
                                this.newSite();
                            }
                            else {
                                this.onLoadSite(event.currentTarget.value);
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
                    rules: {
                        required: {},
                    }
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
                    name: "image",
                    default: this.defaultImage,
                    caption: this.infoForm.imageCaption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "text",
                    name: "longitude",
                    value: "",
                    caption: this.infoForm.longitudeCaption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "text",
                    name: "latitude",
                    value: "",
                    caption: this.infoForm.latitudeCaption,
                    rules: {},
                },
                {
                    input: "input",
                    type: "text",
                    name: "scale",
                    default: this.defaultSize,
                    caption: this.infoForm.scaleCaption,
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
                            this.newSite();
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
    newMark() {
        alert(4);
        console.log([this.map.getCenter().lng, this.map.getCenter().lat]);
        this.mark = this.parentControl.draw(this.getId(), "mark", {
            coordinates: [this.map.getCenter().lng, this.map.getCenter().lat],
            height: 30,
            image: "img_31",
        });
        this.mark.ondraw = (coord) => {
            this.form.getInput("longitude").setValue(coord[0]);
            this.form.getInput("latitude").setValue(coord[1]);
            this.lngInput.val(coord[0]);
            this.latInput.val(coord[1]);
            console.log("x", coord);
        };
        this.mark.play();
    }
    setSiteList(data) {
        data = [{ id: "", name: "" }].concat(data);
        this.form
            .getInput("siteId")
            .setOptionsData(data.map((e) => [e.id, e.name]));
    }
    setCategoryList(data) {
        console.log(data);
        data = [{ id: "", name: "" }].concat(data);
        this.form
            .getInput("category_id")
            .setOptionsData(data.map((e) => [e.id, e.name]));
    }
    newSite() {
        this.newForm();
        this.updateForm("");
        this.newMark();
        //this.setEmptyPolygon();
    }
    setSite(data) {
        if (this.mode == 1) {
            this.parentControl.delete(this.newId);
        }
        if (data === null) {
            this.mode = 1;
            this.image = this.defaultImage;
            this.longitude = this.map.getCenter().lng;
            this.latitude = this.map.getCenter().lat;
            this.size = this.defaultSize,
                this.reset();
            this.form.reset();
            this.form.getInput("longitude").setValue(this.longitude);
            this.form.getInput("latitude").setValue(this.latitude);
        }
        else {
            this.mode = 2;
            data.__mode_ = 2;
            this.name = data.name;
            this.image = data.image;
            this.id = data.id;
            this.longitude = data.longitude;
            this.latitude = data.latitude;
            this.size = data.scale;
            this.form.setValue(data);
        }
        this.scaleInput.setValue(this.size);
        this.lngInput.val(this.longitude);
        this.latInput.val(this.latitude);
        console.log(this.image);
        this.mark = this.parentControl.draw(this.getId(), "mark", {
            coordinates: [this.longitude, this.latitude],
            height: this.size,
            image: this.image,
        });
        this.mark.ondraw = (coord) => {
            this.form.getInput("longitude").setValue(coord[0]);
            this.form.getInput("latitude").setValue(coord[1]);
            this.lngInput.val(coord[0]);
            this.latInput.val(coord[1]);
            console.log("x", coord);
        };
        this.mark.play();
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
    updateMark(info) {
    }
    setSize(size) {
        this.form.getInput("scale").setValue(size);
        this.mark.setSize(null, size);
    }
    setScale(scale) {
        let size = this.mark.getSize();
        this.mark.setSize(null, size[1] * scale);
        this.form.getInput("scale").setValue(scale);
    }
}
//# sourceMappingURL=MarkControl2.js.map