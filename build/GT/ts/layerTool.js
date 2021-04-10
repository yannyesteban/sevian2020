import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { Form2 as Form } from '../../Sevian/ts/Form2.js';
import { Tab } from '../../Sevian/ts/Tab.js';
export class LayerTool {
    constructor(info) {
        this.id = null;
        this.data = null;
        this.layers = [];
        this.groups = [];
        this.images = [];
        this.forms = [];
        this.main = null;
        this.onNewLayer = (index, data) => { };
        this.onEditLayer = (index, data) => { };
        this.onDeleteLayer = (index, data) => { };
        this.onNewImage = (index, data) => { };
        this.onEditImage = (index, data) => { };
        this.onDeleteImage = (index, data) => { };
        this.onNewGroup = (index, data) => { };
        this.onEditGroup = (index, data) => { };
        this.onDeletegroup = (index, data) => { };
        this.onSaveRoad = (data) => { };
        this.onSaveTrace = (data) => { };
        this.onSaveMobil = (data) => { };
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        //this.data = this.getInfo();
        this.layers = this.data.layers;
        this.groups = this.data.groups;
        this.images = this.data.images;
        //this.getLayerList();
        //return;
        let main = (this.id) ? $(this.id) : false;
        if (!main) {
            main = $.create("div").attr("id", this.id);
        }
        this.create(main);
    }
    get() {
        if (this.main) {
            return this.main.get();
        }
    }
    create(main) {
        this.main = main;
        main.addClass("layer-tool");
        const tab = new Tab({
            id: main
        });
        tab.add({ caption: "Ly", tagName: "form", active: true });
        tab.add({ caption: "Img", tagName: "form" });
        tab.add({ caption: "grp", tagName: "form" });
        tab.add({ caption: "Rd", tagName: "form" });
        tab.add({ caption: "Tr", tagName: "form" });
        this.createLayerForm(tab.getPage(0));
        this.createImageForm(tab.getPage(1));
        this.createGroupForm(tab.getPage(2));
        this.createRoadForm(tab.getPage(3));
        this.createTraceForm(tab.getPage(4));
    }
    createLayerForm(id) {
        /*
        const input = new Input({target:id,
            input:"input",
                    type:"select",
                    name:"id",
                    value:"",
                    caption:"layers"
        });

        return;
        */
        this.forms["layer"] = new Form({
            caption: "Layers Admin",
            id: id,
            fields: [
                {
                    input: "input",
                    type: "select",
                    name: "layerId",
                    value: "",
                    caption: "Layers",
                    data: this.getLayerList(),
                    events: {
                        "change": event => {
                            this.loadLayer(event.currentTarget.value);
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
                    type: "select",
                    name: "prop",
                    value: "",
                    caption: "Property",
                    data: this.getPropertysData()
                },
                {
                    input: "input",
                    type: "text",
                    name: "caption",
                    value: "",
                    caption: "Caption"
                },
                {
                    input: "input",
                    type: "select",
                    name: "image",
                    value: "circle-1",
                    caption: "Image",
                    data: this.getImageData()
                },
                {
                    input: "input",
                    type: "select",
                    name: "scale",
                    value: 1.0,
                    caption: "Scale",
                    data: this.getScalesData()
                },
                {
                    input: "input",
                    type: "select",
                    name: "valueType",
                    value: "==",
                    caption: "Value Type",
                    data: [
                        ["==", "="],
                        ["!=", "<>"],
                        ["in", "In [a, b, c...]"],
                        ["not-in", "NOT In [a, b, c...]"],
                        [">=", ">="],
                        [">", ">"],
                        ["<=", "<="],
                        ["<", "<"],
                        ["()", "(n, m)"],
                        ["[)", "[n, m)"],
                        ["[]", "[n, m]"],
                        ["(]", "(n, m]"]
                    ]
                },
                {
                    input: "input",
                    type: "text",
                    name: "value",
                    value: "",
                    caption: "Value"
                },
                {
                    input: "input",
                    type: "select",
                    name: "group",
                    value: 0,
                    caption: "Group",
                    data: this.getGroupList()
                },
                {
                    input: "input",
                    type: "select",
                    name: "visible",
                    value: 1,
                    caption: "Visible",
                    data: [
                        [1, "yes"],
                        [0, "no"]
                    ]
                }
            ],
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        id: 1,
                        caption: "New",
                        action: (item, event) => {
                            this.forms["layer"].reset();
                        }
                    },
                    {
                        id: 2,
                        caption: "Save",
                        action: (item, event) => {
                            this.saveLayer(this.forms["layer"].getValue());
                        }
                    },
                    {
                        id: 3,
                        caption: "Delete",
                        action: (item, event) => {
                            this.deleteLayer(this.forms["layer"].getValue());
                        }
                    }
                ]
            }
        });
    }
    createImageForm(id) {
        this.forms["image"] = new Form({
            caption: "Images Admin",
            id: id,
            fields: [
                {
                    input: "input",
                    type: "select",
                    name: "imageId",
                    value: "",
                    caption: "",
                    data: this.getImageList(),
                    events: {
                        "change": event => {
                            this.loadImages(event.currentTarget.value);
                        }
                    }
                },
                {
                    input: "input",
                    type: "text",
                    name: "name",
                    value: "",
                    caption: "Name"
                },
                {
                    input: "input",
                    type: "select",
                    name: "type",
                    value: "arrow",
                    caption: "Type",
                    data: [
                        ["arrow", "Arrow"],
                        ["circle", "Circle"],
                        ["pulsing", "Pulsing"]
                    ]
                },
                {
                    input: "input",
                    type: "color",
                    name: "color",
                    value: "",
                    caption: "Color"
                },
                {
                    input: "input",
                    type: "color",
                    name: "border",
                    value: "",
                    caption: "Border Color"
                },
                {
                    input: "input",
                    type: "color",
                    name: "halo",
                    value: "",
                    caption: "Halo Color"
                }
            ],
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        id: 1,
                        caption: "New",
                        action: (item, event) => {
                            this.forms["image"].reset();
                        }
                    },
                    {
                        id: 2,
                        caption: "Save",
                        action: (item, event) => {
                            this.saveImage(this.forms["image"].getValue());
                        }
                    },
                    {
                        id: 3,
                        caption: "Delete",
                        action: (item, event) => {
                            this.deleteImage(this.forms["image"].getInput("imageId").getValue());
                        }
                    }
                ]
            }
        });
    }
    createGroupForm(id) {
        this.forms["group"] = new Form({
            caption: "Groups Admin",
            id: id,
            fields: [
                {
                    input: "input",
                    type: "select",
                    name: "groupId",
                    value: "",
                    caption: "",
                    data: this.getGroupList(),
                    events: {
                        "change": event => {
                            this.loadGroups(event.currentTarget.value);
                        }
                    }
                },
                {
                    input: "input",
                    type: "hidden",
                    name: "id",
                    value: "",
                    caption: "Id"
                },
                {
                    input: "input",
                    type: "text",
                    name: "caption",
                    value: "",
                    caption: "Caption"
                },
                {
                    input: "input",
                    type: "text",
                    name: "className",
                    value: "",
                    caption: "Class"
                },
                {
                    input: "input",
                    type: "select",
                    name: "mode",
                    value: "close",
                    caption: "Mode",
                    data: [
                        ["close", "close"],
                        ["open", "open"]
                    ]
                }
            ],
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        id: 1,
                        caption: "New",
                        action: (item, event) => {
                            this.forms["group"].reset();
                        }
                    },
                    {
                        id: 2,
                        caption: "Save",
                        action: (item, event) => {
                            this.saveGroup(this.forms["group"].getValue());
                        }
                    },
                    {
                        id: 3,
                        caption: "Delete",
                        action: (item, event) => {
                            this.deleteGroup(this.forms["group"].getInput("groupId").getValue());
                        }
                    }
                ]
            }
        });
    }
    createRoadForm(id) {
        this.forms["road"] = new Form({
            caption: "Road Layer",
            id: id,
            fields: [
                {
                    input: "input",
                    type: "hidden",
                    name: "layerId",
                    value: "",
                    caption: "Layers"
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
                    name: "caption",
                    value: "Ruta Completa",
                    caption: "Caption"
                },
                {
                    input: "input",
                    type: "color",
                    name: "color",
                    value: "",
                    caption: "Line Color",
                },
                {
                    input: "input",
                    type: "select",
                    name: "width",
                    value: "2",
                    caption: "Line Width",
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(e => [e, e])
                },
                {
                    input: "input",
                    type: "select",
                    name: "opacity",
                    value: 1.0,
                    caption: "Opacity",
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(e => [e / 10, e / 10])
                },
                {
                    input: "input",
                    type: "select",
                    name: "dash",
                    value: 2,
                    caption: "Dash",
                    data: [0, 1, 2, 3, 4].map(e => [e, e])
                },
                {
                    input: "input",
                    type: "select",
                    name: "visible",
                    value: 1,
                    caption: "Visible",
                    data: [
                        [true, "yes"],
                        [false, "no"]
                    ]
                }
            ],
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        caption: "Save",
                        action: (item, event) => {
                            this.onSaveRoad(this.forms["road"].getValue());
                        }
                    }
                ]
            }
        });
        this.forms["road"].setValue(this.data.roadLayer);
    }
    createTraceForm(id) {
        /*
        const input = new Input({target:id,
            input:"input",
                    type:"select",
                    name:"id",
                    value:"",
                    caption:"layers"
        });

        return;
        */
        this.forms["trace"] = new Form({
            caption: "Trace Layer",
            id: id,
            fields: [
                {
                    input: "input",
                    type: "hidden",
                    name: "layerId",
                    value: "",
                    caption: "Layers"
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
                    name: "caption",
                    value: "Ruta Completa",
                    caption: "Caption"
                },
                {
                    input: "input",
                    type: "color",
                    name: "color",
                    value: "",
                    caption: "Line Color"
                },
                {
                    input: "input",
                    type: "select",
                    name: "width",
                    value: "2",
                    caption: "Line Width",
                    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(e => [e, e])
                },
                {
                    input: "input",
                    type: "select",
                    name: "opacity",
                    value: 1.0,
                    caption: "Opacity",
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(e => [e / 10, e / 10])
                },
                {
                    input: "input",
                    type: "select",
                    name: "dash",
                    value: 2,
                    caption: "Dash",
                    data: [0, 1, 2, 3, 4].map(e => [e, e])
                },
                {
                    input: "input",
                    type: "select",
                    name: "length",
                    value: 1000,
                    caption: "Length",
                    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(e => [e * 1000 / 2, e * 1000 / 2])
                },
                {
                    input: "input",
                    type: "select",
                    name: "visible",
                    value: 1,
                    caption: "Visible",
                    data: [
                        [true, "yes"],
                        [false, "no"]
                    ]
                }
            ],
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        caption: "Save",
                        action: (item, event) => {
                            this.onSaveTrace(this.forms["trace"].getValue());
                        }
                    },
                ]
            }
        });
        this.forms["trace"].setValue(this.data.traceLayer);
    }
    showLayer() {
    }
    getPropertysData() {
        return [
            ["", "select..."],
            ["speed", "speed"],
            ["input1", "Input 1"],
            ["input2", "Input 2"],
            ["input3", "Input 3"],
            ["input4", "Input 4"],
            ["input5", "Input 5"],
        ];
    }
    getImageData() {
        return this.images.map((x, index) => {
            return [x.name, x.name];
        });
    }
    getScalesData() {
        return [
            [0.1, "0.1"],
            [0.2, "0.2"],
            [0.3, "0.3"],
            [0.4, "0.4"],
            [0.5, "0.5"],
            [0.6, "0.6"],
            [0.7, "0.7"],
            [0.8, "0.8"],
            [0.9, "0.9"],
            [1.0, "1.0"],
            [1.2, "1.2"],
            [1.5, "1.5"],
            [2.0, "2.0"]
        ];
    }
    getGroupsData() {
        return [
            [0, "Principal"],
            [1, "Capas"],
            [2, "Velocidad"],
            [3, "Inputs"],
            [4, "Outputs"],
            [5, "Eventos"],
            [6, "Mis Alarmas"],
            [7, "Mis Eventos"]
        ];
    }
    getInfo() {
        return {
            "images": [
                {
                    "name": "pulsing-1",
                    "type": "pulsing",
                    "color": "#ff6464",
                    "border": "#ffffff",
                    "halo": "#FFC8C8"
                },
                {
                    "name": "pulsing-2",
                    "type": "pulsing",
                    "color": "#12AAC8",
                    "border": "#ffffff",
                    "halo": "#CCF2F9"
                },
                {
                    "name": "pulsing-3",
                    "type": "pulsing",
                    "color": "#FFFC84",
                    "border": "#FF4500",
                    "halo": "#FFD3C6"
                },
                {
                    "name": "circle-0",
                    "type": "circle",
                    "color": "#000000",
                    "border": "#ffffff"
                },
                {
                    "name": "circle-1",
                    "type": "circle",
                    "color": "#FFFF00",
                    "border": "#ffffff"
                },
                {
                    "name": "circle-2",
                    "type": "circle",
                    "color": "#339966",
                    "border": "#ffffff"
                },
                {
                    "name": "circle-3",
                    "type": "circle",
                    "color": "#FF0000",
                    "border": "#ffffff"
                },
                {
                    "name": "circle-4",
                    "type": "circle",
                    "color": "#3366cc",
                    "border": "#ffffff"
                },
                {
                    "name": "arrow-1",
                    "type": "arrow",
                    "color": "#ff99ff",
                    "border": "#ffffff"
                },
                {
                    "name": "arrow-2",
                    "type": "arrow",
                    "color": "#FF0000",
                    "border": "#ffffff"
                },
                {
                    "name": "arrow-3",
                    "type": "arrow",
                    "color": "#008000",
                    "border": "#ffffff"
                },
                {
                    "name": "arrow-4",
                    "type": "arrow",
                    "color": "#66ffff",
                    "border": "#ffffff"
                },
                {
                    "name": "arrow-5",
                    "type": "arrow",
                    "color": "#ffccff",
                    "border": "#ffffff"
                },
                {
                    "name": "arrow-6",
                    "type": "arrow",
                    "color": "#ff9900",
                    "border": "#ffffff"
                },
                {
                    "name": "arrow-7",
                    "type": "arrow",
                    "color": "#cc3399",
                    "border": "#FFC0CB"
                }
            ],
            "colors": [
                "#FF0000",
                "#FFFF00",
                "#0000FF",
                "#008000",
                "#FF0000",
                "#FF4500",
                "#000000",
                "#ffffff",
                "aquamarine",
                "brown",
                "fuchsia",
                "#008000#FFFF00",
                "lime",
                "magenta",
                "dark#0000FF"
            ],
            "groups": [
                {
                    "caption": "Capas",
                    "className": "x",
                    "mode": "close"
                },
                {
                    "caption": "Velocidad",
                    "className": "x",
                    "mode": "close"
                },
                {
                    "caption": "Inputs",
                    "className": "x",
                    "mode": "close"
                },
                {
                    "caption": "Opuputs",
                    "className": "x",
                    "mode": "close"
                },
                {
                    "caption": "Eventos",
                    "className": "x",
                    "mode": "close"
                },
                {
                    "caption": "Mis Alarmas",
                    "className": "x",
                    "mode": "close"
                },
                {
                    "caption": "Mis Eventos",
                    "className": "x",
                    "mode": "close"
                }
            ],
            "layers": [
                {
                    "prop": "speed",
                    "caption": "Detenido",
                    "image": "pulsing-1",
                    "scale": 1.0,
                    "type": "circle",
                    "color": "#000000",
                    "cond": "==",
                    "in": [0],
                    "group": 1,
                    "visible": true,
                    "exp": "{speed}=="
                },
                {
                    "prop": "speed",
                    "caption": "0+ a 20 Km/h",
                    "image": "pulsing-2",
                    "scale": 1.0,
                    "type": "circle",
                    "color": "fuchsia",
                    "from": 0,
                    "to_e": 20,
                    "group": 1,
                    "visible": true
                },
                {
                    "prop": "speed",
                    "caption": "20 a 40 Km/h",
                    "image": "pulsing-3",
                    "scale": 1.0,
                    "type": "arrow",
                    "color": "#FFFF00",
                    "from": 20,
                    "to_e": 40,
                    "group": 1,
                    "visible": true
                },
                {
                    "prop": "speed",
                    "caption": "40 a 60 Km/h",
                    "image": "arrow-3",
                    "scale": 1.0,
                    "type": "pulsing",
                    "color": "#0000FF",
                    "from": 40,
                    "to_e": 60,
                    "group": 1,
                    "visible": true
                },
                {
                    "prop": "speed",
                    "caption": "60 a 80 Km/h",
                    "image": "arrow-4",
                    "scale": 1.0,
                    "type": "pulsing",
                    "color": "#008000",
                    "from": 60,
                    "to_e": 80,
                    "group": 1,
                    "visible": true
                },
                {
                    "prop": "speed",
                    "caption": "80 a 100 Km/h",
                    "image": "arrow-5",
                    "scale": 1.0,
                    "type": "pulsing",
                    "color": "#FF4500",
                    "from": 80,
                    "to_e": 100,
                    "group": 1,
                    "visible": true
                },
                {
                    "prop": "speed",
                    "caption": "100+ Km/h",
                    "image": "arrow-6",
                    "scale": 1.0,
                    "type": "pulsing",
                    "color": "#FF0000",
                    "from": 100,
                    "group": 1,
                    "visible": true
                }
            ]
        };
    }
    getLayerList() {
        return this.layers.map((x, index) => {
            x.layerId = index;
            return [index, x.caption];
        });
    }
    loadLayer(index) {
        this.forms["layer"].setValue(this.layers[index]);
    }
    resetFormLayer() {
        this.forms["layer"].getInput("image").setOptionsData(this.getImageData());
        this.forms["layer"].getInput("group").setOptionsData(this.getGroupList());
        this.forms["layer"].reset();
    }
    setNewIdLayer(id) {
        this.forms["layer"].getInput("id").setValue(id);
    }
    getImageList() {
        return this.images.map((x, index) => {
            x.imageId = index;
            return [index, x.name];
        });
    }
    loadImages(index) {
        this.forms["image"].setValue(this.images[index]);
    }
    getGroupList() {
        return this.groups.map((x, index) => {
            x.groupId = index;
            return [index, x.caption];
        });
    }
    loadGroups(index) {
        this.forms["group"].setValue(this.groups[index]);
    }
    saveLayer(data) {
        if (data.layerId === "") {
            this.addLayer(data);
            this.onNewLayer(data.layerId, data);
        }
        else {
            this.setLayer(data.layerId, data);
            this.onEditLayer(data.layerId, data);
        }
        this.getData();
    }
    addLayer(data) {
        data.layerId = this.layers.length;
        this.layers.push(data);
        this.forms["layer"].getInput("layerId").setOptionsData(this.getLayerList());
        this.forms["layer"].setValue(data);
    }
    setLayer(id, data) {
        this.layers[id] = data;
        this.forms["layer"].getInput("layerId").setOptionsData(this.getLayerList());
        this.forms["layer"].setValue(data);
    }
    deleteLayer(data) {
        const id = data.layerId;
        if (id === "" || id > this.layers.length) {
            alert("nothing !!");
            return;
        }
        //this.layers.splice(parseInt(id, 10),1);
        const layerId = this.forms["layer"].getInput("layerId").getValue();
        this.layers.splice(id, 1);
        //this.layers = this.layers.filter((item, index) => index !== id);
        this.forms["layer"].getInput("layerId").setOptionsData(this.getLayerList());
        this.forms["layer"].reset();
        this.onDeleteLayer(data.id);
    }
    saveImage(data) {
        if (data.imageId === "") {
            this.addImage(data);
            this.onNewImage(data.imageId, data);
        }
        else {
            this.setImage(data.imageId, data);
            this.onEditImage(data.imageId, data);
        }
        this.resetFormLayer();
    }
    addImage(data) {
        data.imageId = this.layers.length;
        this.images.push(data);
        this.forms["image"].getInput("imageId").setOptionsData(this.getImageList());
        this.forms["image"].setValue(data);
    }
    setImage(id, data) {
        this.images[id] = data;
        this.forms["image"].getInput("imageId").setOptionsData(this.getImageList());
        this.forms["image"].setValue(data);
    }
    deleteImage(id) {
        if (id === "" || id > this.images.length) {
            alert("nothing !!");
            return;
        }
        //this.layers.splice(parseInt(id, 10),1);
        this.images.splice(id, 1);
        //this.layers = this.layers.filter((item, index) => index !== id);
        this.forms["image"].getInput("imageId").setOptionsData(this.getImageList());
        this.forms["image"].reset();
        this.resetFormLayer();
    }
    saveGroup(data) {
        if (data.groupId === "") {
            this.addGroup(data);
        }
        else {
            this.setGroup(data.groupId, data);
        }
        this.resetFormLayer();
    }
    addGroup(data) {
        data.groupId = this.groups.length;
        this.groups.push(data);
        this.forms["group"].getInput("groupId").setOptionsData(this.getGroupList());
        this.forms["group"].setValue(data);
    }
    setGroup(id, data) {
        this.groups[id] = data;
        this.forms["group"].getInput("groupId").setOptionsData(this.getGroupList());
        this.forms["group"].setValue(data);
    }
    deleteGroup(id) {
        if (id === "" || id > this.groups.length) {
            alert("nothing !!");
            return;
        }
        //this.layers.splice(parseInt(id, 10),1);
        this.groups.splice(id, 1);
        //this.layers = this.layers.filter((item, index) => index !== id);
        this.forms["group"].getInput("groupId").setOptionsData(this.getGroupList());
        this.forms["group"].reset();
        this.resetFormLayer();
    }
    getData() {
        return this.data;
    }
    reset() {
        this.data = this.getInfo();
        this.forms["layer"].reset();
        this.forms["image"].reset();
        this.forms["group"].reset();
    }
}
//# sourceMappingURL=LayerTool.js.map