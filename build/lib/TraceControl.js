import { _sgQuery as $ } from '../Sevian/ts/Query.js';
import { Menu } from '../Sevian/ts/Menu2.js';
import { Tab } from '../Sevian/ts/Tab.js';
export class TraceControl {
    constructor(object) {
        this.id = "mapboxgl-ctrl-trace";
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
        this.groups = null;
        this._trace = null;
        this._playButton = null;
        this._factorIndex = 0;
        this.factorSpeed = 0.005; //[0.005, 0.01, 0.05, 0.09, 0.13, 0.20];
        this.onCheckLayer = (layerId, checked) => { };
        this.mainTab = null;
        this.data = [];
        this.configData = null;
        this.mode = "reset";
        this.speed = 2;
        this.speedRange2 = [-32, -16, -8, -4, -2, -1, 1, 2, 4, 8, 16, 32];
        this.speedRange = [1, 2, 4, 8, 16, 32];
        this.dir = 1;
        this._parent = object;
    }
    setData(data) {
        this.data = data;
    }
    setConfigData(config) {
        this.configData = config;
    }
    onAdd(map) {
        this._map = map;
        this._container = $.create("div").addClass(["trace-tool"]);
        this._group1 = this._container.create("div");
        this._group1.addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "trace-tool"]);
        this._btnRule = this._group1.create("button").prop({ "type": "button", "title": "Inicia la herramienta de Traza" }).addClass("icon-trace");
        this._btnRule.on("click", () => {
            this.play();
        });
        this._group2 = this._container.create("div").style("display", "none");
        this._group2.addClass(["trace-nav"]);
        //this._group_a = this._group2.create("div").addClass(["mapboxgl-ctrl","trace-nav"]);
        this.playBar(this._group2.create("div").addClass(["mapboxgl-ctrl", "trace-nav"]));
        this._group_speed = this._group2.create("div").addClass(["mapboxgl-ctrl", "trace-speed-nav"]);
        this.speedBar(this._group_speed);
        this._group = this._group2.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "trace-layer"])
            .style("display", "none");
        const tab = this.mainTab = new Tab({
            id: this._group,
            className: "trace-control",
        });
        tab.add({ tagName: "form", active: true, className: "filter-form" });
        tab.add({});
        tab.add({});
        tab.add({ tagName: "form" });
        tab.add({ tagName: "form" });
        //this._length = this._group.create("span").addClass("rule-tool-value");
        //this._length.text("Layers");
        //this._unit = this._group.create("span");
        this._group_b = this._group2.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group"]);
        this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Filtro" }).addClass(["icon-filter"])
            .on("click", () => {
            this.mainTab.show(0);
        });
        this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Mostrar Capas" }).addClass(["icon-layer2"])
            .on("click", () => {
            this.mainTab.show(1);
        });
        this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Mostrar Puntos" }).addClass(["icon-grid"])
            .on("click", () => {
            this.mainTab.show(2);
        });
        this._group_b.create("button").prop({ "type": "button", "title": "Configuración" }).addClass(["icon-setting-2"])
            .on("click", () => {
            this.mainTab.show(3);
        });
        this._group_b.create("button").prop({ "type": "button", "title": "Info" }).addClass(["icon-info-2"])
            .on("click", () => {
            this.mainTab.show(4);
        });
        this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Descarta la medición actual" }).addClass(["icon-trash"])
            .on("click", () => {
            this.reset();
            //this.cmdTrace("stop");
        });
        this._btnExit = this._group_b.create("button").prop({ "type": "button", "title": "Salir de la herramienta de medición" }).addClass(["icon-exit"])
            .on("click", () => {
            this.stop();
        });
        //this.showLayers();
        this.setSpeed(this.speed);
        this.setMode(this.mode);
        return this._container.get();
    }
    reset() {
        this.setIconPlay(true);
        this.mainTab.getPage(1).text("");
        this.mainTab.getPage(2).text("");
        this.setSpeed(8);
        this.setModeSpeed(8);
        this.setMode("reset");
        this.getTrace().delete();
        this.mainTab.show(0);
    }
    setMode(mode) {
        this.mode = mode;
        this._container.ds("mode", mode);
    }
    setModeSpeed(speed) {
        if (this.dir > 0) {
            this._container.ds("modeSpeed", "f-" + speed);
        }
        else {
            this._container.ds("modeSpeed", "r-" + speed);
        }
    }
    setSpeed(speed) {
        console.log("set speed index", speed, " speedRange", this.speedRange[speed]);
        //this._trace.setSpeed(speed);
        this.speed = speed;
        this.setModeSpeed(speed);
    }
    setFilterPage(form) {
        this.getPage(0).append(form);
    }
    getPage(index) {
        return this.mainTab.getPage(index);
    }
    createList() {
        let main = this.mainTab.getPage(2);
        const table = main.create("table").addClass("trace-list");
        const header = table.create("tr").addClass("trace-header");
        this.configData.labels.forEach((line) => {
            header.create("th").text(line);
        });
        this.data.forEach((data, index) => {
            const row = table.create("tr").addClass("trace-row");
            this.configData.fields.forEach((line) => {
                row.create("td").ds("value", index).text(data[line])
                    .on("click", (event) => {
                    this._trace.goTo($(event.currentTarget).ds("value"));
                });
            });
        });
    }
    playBar(bar) {
        //bar.create("button").prop({"type": "button", "title":"+"}).addClass("").text("16x");
        //bar.create("button").prop({"type": "button", "title":"+"}).addClass("").text("&raquo;");
        bar.create("button").prop({ "type": "button", "title": "Rewind" }).addClass("icon-fb")
            .on("click", () => {
            //this.getTrace().setReverse(false);
            let speed = (this.speed + 1) % this.speedRange.length;
            console.log("foward ", this.speed);
            this.dir = -1;
            this.setSpeed(speed);
            this._trace.setSpeed(this.dir * this.factorSpeed * this.speedRange[speed]);
            this.getTrace().setReverse(true);
            console.log("reverse");
            return;
            this.dir = -1;
            speed = this.speed - 1; // % this.speedRange.length;
            if (speed > 6) {
                speed -= 6;
            }
            if (speed < 0) {
                speed = 5;
            }
            this.setSpeed(speed);
            if (this._factorIndex <= 0) {
                //this._factorIndex = this._factorValue.length;
            }
            //this.speed = (this.speed - 1 ) % this.speedRange.length+6;
            //this._factorIndex = (this._factorIndex - 1 ) % this._factorValue.length;
            //this._trace.setSpeedFactor(this._factorValue[this._factorIndex]);
        });
        /*

        
        */
        bar.create("button").prop({ "type": "button", "title": "+" }).addClass("icon-go_begin")
            .on("click", () => {
            this.cmdTrace("go-begin");
        });
        bar.create("button").prop({ "type": "button", "title": "+" }).addClass("icon-sb")
            .on("click", () => {
            this.cmdTrace("sb");
        });
        this._playButton = bar.create("button").prop({ "type": "button", "title": "-" }).addClass("icon-play")
            .on("click", () => {
            if (this._trace.getStatus() == 1) {
                this.cmdTrace("pause");
            }
            else {
                this.cmdTrace("play");
            }
        });
        bar.create("button").prop({ "type": "button", "title": "-" }).addClass("icon-sf")
            .on("click", () => {
            this.cmdTrace("sf");
        });
        bar.create("button").prop({ "type": "button", "title": "Play" }).addClass("icon-go_end")
            .on("click", () => {
            this.cmdTrace("go-end");
        });
        bar.create("button").prop({ "type": "button", "title": "fast forward" }).addClass("icon-ff")
            .on("click", () => {
            //this.getTrace().setReverse(false);
            let speed = (this.speed + 1) % this.speedRange.length;
            console.log("foward ", this.speed);
            this.dir = 1;
            this.setSpeed(speed);
            this._trace.setSpeed(this.dir * this.factorSpeed * this.speedRange[speed]);
        });
    }
    speedBar(bar, value) {
        this.speedRange.forEach((e, index) => {
            const speed = this.speedRange.length - index - 1;
            bar.create("div").addClass(["speed", `r-${speed}`])
                .on("click", () => {
                this.dir = -1;
                this.setSpeed(speed);
                this._trace.setSpeed(this.dir * this.factorSpeed * this.speedRange[speed]);
            });
        });
        this.speedRange.forEach((e, speed) => {
            bar.create("div").addClass(["speed", `f-${speed}`])
                .on("click", () => {
                this.dir = 1;
                this.setSpeed(speed);
                this._trace.setSpeed(this.dir * this.factorSpeed * this.speedRange[speed]);
            });
        });
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
    }
    init() {
    }
    setIconPlay(value) {
        if (value) {
            this._playButton.removeClass("icon-pause");
            this._playButton.addClass("icon-play");
        }
        else {
            this._playButton.removeClass("icon-play");
            this._playButton.addClass("icon-pause");
        }
    }
    cmdTrace(cmd) {
        switch (cmd) {
            case "play":
                this.setIconPlay(false);
                this._trace.play();
                break;
            case "pause":
                this.setIconPlay(true);
                this._trace.pause();
                break;
            case "fb":
                this.setIconPlay(true);
                this._trace.play("fb");
                break;
            case "ff":
                this.setIconPlay(true);
                this._trace.play("ff");
                break;
            case "go-begin":
                this.setIconPlay(true);
                this._trace.goBegin();
                break;
            case "go-end":
                this.setIconPlay(true);
                this._trace.goEnd();
                break;
            case "sb":
                this.setIconPlay(true);
                this._trace.step(-1);
                break;
            case "sf":
                this.setIconPlay(true);
                this._trace.step(1);
                break;
            case "stop":
                this.setIconPlay(true);
                this._trace.stop();
                break;
        }
    }
    setTrace(trace) {
        this._trace = trace;
        this._trace.setSpeed(this.dir * this.factorSpeed * this.speedRange[this.speed]);
        this._trace.onAddLayer = (layer) => {
            this.showLayers();
        };
        this._trace.onUpdateLayer = (layer) => {
            this.showLayers();
        };
        this._trace.onRemoveLayer = (id) => {
            this.showLayers();
        };
        this._trace.onRemoveImage = (info) => {
            this.showLayers();
        };
        this._trace.onUpdateImage = (info) => {
            this.showLayers();
        };
        this.init();
        //this.showLayers();
    }
    getTrace() {
        return this._trace;
    }
    getTraceLayers() {
        return this.getTrace().getAllLayers(); //.layers;
    }
    getTraceGroupLayers() {
        return this.getTrace().groups;
    }
    showLayers() {
        this.getPage(1).text("");
        this.groups = this.getTraceGroupLayers();
        const layers = this.getTraceLayers();
        //console.log(layers);
        //alert(889);
        //return;
        let items = [];
        let _menu = null;
        let index = 0;
        for (let layer of layers) {
            if (layer.group >= 0) {
                if (!items[layer.group]) {
                    items[layer.group] = {
                        ds: { group: layer.group },
                        caption: this.groups[layer.group].caption,
                        useCheck: true,
                        items: []
                    };
                }
                _menu = items[layer.group];
            }
            else {
                if (!items[0]) {
                    items[0].items = items[layer.group] = {
                        caption: this.groups[layer.group].caption,
                        useCheck: true,
                        items: []
                    };
                }
                _menu = items[0];
            }
            let icon = null;
            if (layer.image) {
                icon = $(this.getTrace().getImageObj(layer.image).getCanvas());
                icon.addClass(["layer-icon", layer.image]);
            }
            _menu.items.push({
                caption: layer.caption,
                customIcon: icon,
                //className:layer.className,
                useCheck: true,
                className: [layer.type, layer.color],
                //imageClass:[layer.type, layer.color],
                value: "" + index++,
                checked: layer.visible,
                check: (x, event) => {
                    this.onCheckLayer(parseInt(x.ds("value"), 10), event.currentTarget.checked);
                    this.getTrace().showLayer(layer.id, event.currentTarget.checked);
                }
            });
        }
        let menu = new Menu({
            autoClose: false,
            target: this.getPage(1),
            items: items,
            type: "accordion",
            useCheck: true,
            subType: "",
        });
        return;
        this.getTrace().onAddLayer = (layer) => {
            let icon = $(this.getTrace().getImageObj(layer.image).getCanvas());
            menu.add({
                caption: layer.caption,
                customIcon: icon,
                //className:layer.className,
                useCheck: true,
                className: [layer.type, layer.color],
                //imageClass:[layer.type, layer.color],
                value: "" + index++,
                checked: layer.visible,
                check: (x, event) => {
                    this.onCheckLayer(parseInt(x.ds("value"), 10), event.currentTarget.checked);
                    this.getTrace().showLayer(layer.id, event.currentTarget.checked);
                }
            });
        };
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
            //this.delete();
            this._group.style("display", "none");
            this._group1.style("display", "");
            this._group2.style("display", "none");
            this.setIconPlay(true);
            this._mode = 0;
        }
    }
}
//# sourceMappingURL=TraceControl.js.map