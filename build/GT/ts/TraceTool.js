import { _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { Tab } from '../../Sevian/ts/Tab.js';
export class TraceTool {
    constructor(info) {
        this.id = null;
        this.data = null;
        this.dataUnits = [];
        this.tracking = [];
        this.main = null;
        this.onTrace = (unitId, value) => { };
        this.onFollow = (unitId, value) => { };
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        //this.data = this.getInfo();
        //this.getLayerList();
        //return;
        let main = (this.id) ? $(this.id) : false;
        if (!main) {
            main = $.create("div").attr("id", this.id);
        }
        this.create(main);
    }
    create(main) {
        this.main = main;
        main.addClass("layer-tool");
        this.createUnitMenu(this.dataUnits);
        return;
        const tab = new Tab({
            id: main,
            className: "layer-tool"
        });
        tab.add({ caption: "L", tagName: "form", active: true });
        tab.add({ caption: "I", tagName: "form" });
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
    }
    createUnitMenu(unitData) {
        const ul = this.main.create("ul").addClass("trace-tool");
        unitData.forEach(unit => {
            const li = ul.create("li");
            li.create("a").text(unit.unitName);
            li.create("input").prop({
                "type": "checkbox",
                "title": "iniciar Trace Tool",
                "disabled": ((unit.noTracking == 1) ? "disabled" : "")
            })
                .on("click", (event) => {
                this.onTrace(unit.unitId, event.currentTarget.checked);
            });
            li.create("input").prop({
                "type": "checkbox",
                "title": "iniciar Follow Me",
                "disabled": ((unit.valid == 0) ? "disabled" : "")
            })
                .on("click", (event) => {
                this.onFollow(unit.unitId, event.currentTarget.checked);
            });
            ;
        });
    }
}
//# sourceMappingURL=TraceTool.js.map