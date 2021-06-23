import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { Tab } from '../../Sevian/ts/Tab.js';
import { Form2 as Form } from '../../Sevian/ts/Form2.js';
import { S } from '../../Sevian/ts/Sevian.js';
alert(88);
export class GeofenceTool {
    constructor(info) {
        this.main = null;
        this.id = null;
        this.form = null;
        this.formMain = null;
        this.tab = null;
        this.loadGeofence = (id) => {
            S.go({
                async: true,
                valid: false,
                confirm_: 'seguro?',
                blockingTarget: this.tab.getPage(0),
                requestFunction: (json) => {
                    this.initForm(json.config[0].option);
                },
                params: [
                    {
                        t: "setMethod",
                        element: "form",
                        method: "load",
                        mode: "xx",
                        name: "/form/geofence",
                        eparams: {
                            record: {
                                id: id
                            }
                        }
                    }
                ]
            });
        };
        this.newGeofence = (id) => {
            S.go({
                async: true,
                valid: false,
                confirm_: 'seguro?',
                blockingTarget: this.tab.getPage(0),
                requestFunction: (json) => {
                    this.initForm(json.config[0].option);
                },
                params: [
                    {
                        t: "setMethod",
                        element: "form",
                        method: "request",
                        mode: "xx",
                        name: "/form/geofence",
                        eparams: {}
                    }
                ]
            });
        };
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        let main = (this.id) ? $(this.id) : false;
        if (!main) {
            main = $.create("div").attr("id", this.id);
        }
        this.create(main);
    }
    saveGeofence() {
        S.go({
            async: true,
            valid: false,
            confirm_: 'seguro?',
            form: this.formMain.getFormData(),
            blockingTarget: this.tab.getPage(0),
            _requestFunction: (json) => {
                this.initForm(json.config[0].option);
            },
            params: [
                {
                    t: "setMethod",
                    'mode': 'element',
                    element: "s-form",
                    method: "save",
                    name: "/form/geofence",
                    eparams: {}
                }
            ]
        });
    }
    create(main) {
        this.main = main;
        main.addClass("layer-tool");
        const tab = new Tab({
            id: main,
            className: "layer-tool"
        });
        this.tab = tab;
        tab.add({ id: "yy", caption: "L", tagName: "form", active: true });
        tab.add({ caption: "I", tagName: "form", body: "hola" });
        tab.add({ caption: "G", tagName: "form" });
        tab.add({ caption: "R", tagName: "form" });
        tab.add({ caption: "T", tagName: "form" });
        tab.add({ caption: "C", tagName: "form" });
        tab.getCaption(0).prop("title", "Agregar/Editar Capas");
        tab.getCaption(1).prop("title", "Agregar/Editar Imágenes");
        tab.getCaption(2).prop("title", "Agregar/Editar Grupos");
        tab.getCaption(3).prop("title", "Configurar Ruta");
        tab.getCaption(4).prop("title", "Configurar Traza");
        tab.getCaption(5).prop("title", "Configuración");
        this.initForm(this.form);
        /*
        this.createLayerForm(tab.getPage(0));
        this.createImageForm(tab.getPage(1));
        this.createGroupForm(tab.getPage(2));

        this.createRoadForm(tab.getPage(3));
        this.createTraceForm(tab.getPage(4));
        this.createConfigForm(tab.getPage(5));
        */
    }
    initForm(info) {
        this.tab.getPage(0).text("");
        info.parentContext = this;
        info.id = this.tab.getPage(0);
        this.formMain = new Form(info);
    }
    setConfig(config) {
        console.log(config);
        this.formMain.getInput("coords").setValue(config.coordinates);
        this.formMain.getInput("type").setValue(config.type);
    }
}
//# sourceMappingURL=GeofenceTool.js.map