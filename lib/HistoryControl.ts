import { _sgQuery as $, SQObject } from '../Sevian/ts/Query.js';
import { Menu } from '../Sevian/ts/Menu2.js';
import { Float } from '../Sevian/ts/Window.js';
import { Tab } from '../Sevian/ts/Tab.js';
import { History } from './History.js';

export class HistoryControl {

    private caption: string = "History";
    id: string = "mapboxgl-ctrl-trace";

    layerControl: any = null;
    playControl: any = null;
    speedControl: any = null;

    _map: any = null;
    _container: any = null;
    _line: any = null;
    _mode: number = 0;
    _parent: any = null;
    _meter: number = 1;


    _group: any = null;
    _length: any = null;
    _unit: any = null;
    _group1: any = null;
    _group2: any = null;

    _btnRule: any = null;
    _btnLine: any = null;
    _btnUnit: any = null;
    _btnMultiLine: any = null;
    _btnTrash: any = null;
    _btnExit: any = null;
    propertys: object = {
        color: "#ff0000",
        opacity: 0.4
    }
    length: number = 0;

    private groups: any[] = null;

    private _trace: History = null;
    private _playButton: any = null;
    private _factorIndex = 0;
    private factorSpeed = 0.005;//[0.005, 0.01, 0.05, 0.09, 0.13, 0.20];

    public onCheckLayer: Function = (layerId: number, checked: boolean) => { };

    private mainTab: any = null;
    private data: any[] = [];
    private configData: any = null;

    private mode: string = "reset";
    private speed: number = 6;
    private speedRange2: number[] = [-32, -16, -8, -4, -2, -1, 1, 2, 4, 8, 16, 32];
    //private speedRange: number[] = [1, 2, 4, 8, 16, 32];
    private speedRange: number[] = [-32, -16, -8, -4, -2, -1, 1, 2, 4, 8, 16, 32];
    private dir = 1;
    private win: any[] = [];

    private pageLayer: SQObject = null;
    private pageGrid: SQObject = null;

    public onOpen: () => void = () => { };
    public onClose: () => void = () => { };
    public onProgress: (info) => void = (info) => { };
    constructor(object) {
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

        this._btnRule = this._group1.create("button").prop({ "type": "button", "title": "Inicia la herramienta de Historial" }).addClass("icon-calendar_001");
        this._btnRule.on("click", () => {
            this.play();
        });



        this._group2 = this._container.create("div").style("display", "none");
        this._group2.addClass(["trace-nav"]);
        //this._group_a = this._group2.create("div").addClass(["mapboxgl-ctrl","trace-nav"]);

        this.playBar(this._group2.create("div").addClass(["mapboxgl-ctrl", "trace-nav"]));

        this._group_speed = this._group2.create("div").addClass(["mapboxgl-ctrl", "trace-speed-nav"]);
        this.speedBar(this._group_speed);
        this.layerControl = this._group = this._group2.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "trace-layer"])
            .style("display", "none");


        this.pageGrid = $.create("div").addClass("grid");
        this.setGridPage(this.pageGrid);
        const tab = this.mainTab = new Tab({
            id: this._group,
            className: "trace-control",


        });

        tab.add({ tagName: "form", active: true, className: "filter-form" });
        tab.add({});
        tab.add({  });
        tab.add({ tagName: "form" });
        tab.add({ tagName: "form" });


        //this.pageGrid = this.mainTab.getPage(2);
        //this._length = this._group.create("span").addClass("rule-tool-value");
        //this._length.text("Layers");
        //this._unit = this._group.create("span");


        this._group_b = this._group2.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group"]);

        this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Filtro" }).addClass(["icon-filter"])
            .on("click", () => {
                this.mainTab.show(0);
            });

        const ff = this._group_b.create("button").prop({ "type": "button", "title": "Follow Me", "value": "f" }).text("f")
            .on("click", (event) => {
                if (ff.val() == "F") {
                    ff.text('f');
                    ff.val('f');
                    this._trace.enableFollowMe(false);
                } else {
                    ff.text('F');
                    ff.val('F');
                    this._trace.enableFollowMe(true);
                }
            });


        this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Mostrar Capas" }).addClass(["icon-layer2"])
            .on("click", () => {
                this.mainTab.show(1);
            });

        this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Mostrar Puntos" }).addClass(["icon-grid"])
            .on("click", () => {
                this.createList();
                
                this.win["grid"].show({});
            });

        this._group_b.create("button").prop({ "type": "button", "title": "Configuración" }).addClass(["icon-setting-2"])
            .on("click", () => {
                this.mainTab.show(3);
            });

        this._group_b.create("button").prop({ "type": "button", "title": "Info" }).addClass(["icon-info-2"])
            .on("click", () => {
                this.win["info"].show({});
            });

        this._btnTrash = this._group_b.create("button").prop({ "type": "button", "title": "Descarta Todo" }).addClass(["icon-trash"])
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
    getLayerControl() {
        return this.layerControl;
    }

    reset() {
        this.setIconPlay(true);
        this.mainTab.getPage(1).text("");
        this.mainTab.getPage(2).text("");
        this.mainTab.getPage(3).text("");
        //this.mainTab.getPage(4).text("");
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
        if (speed > 0) {
            this._container.ds("modeSpeed", "f-" + speed);
        } else {
            this._container.ds("modeSpeed", "r" + speed);
        }

    }
    setSpeed(speed) {
        this.speed = speed;
        this.setModeSpeed(this.speedRange[speed]);
    }
    setFilterPage(form) {
        this.getPage(0).append(form);
    }
    getPage(index) {
        return this.mainTab.getPage(index)
    }

    createLayerFilter(condition, values, value) {

        if (typeof value === "number") {
            values[0] = Number(values[0] || null);
            values[1] = Number(values[1] || null);
        }

        switch (condition) {
            case "==":
                if (value == values[0]) {
                    return true;
                }
                return false;
            case "!=":
                if (value != values[0]) {
                    return true;
                }
                return false;
            case ">=":
                if (value >= values[0]) {
                    return true;
                }
                return false;
            case ">":
                if (value > values[0]) {
                    return true;
                }
                return false;
            case "<=":
                if (value <= values[0]) {
                    return true;
                }
                return false;
            case "<":
                if (value < values[0]) {
                    return true;
                }
                return false;
            case "()":
                if (value > values[0] && value < values[1]) {
                    return true;
                }
                return false;
            case "[)":
                if (value >= values[0] && value < values[1]) {
                    return true;
                }
                return false;
            case "[]":
                if (value >= values[0] && value <= values[1]) {
                    return true;
                }
                return false;
            case "(]":
                if (value > values[0] && value <= values[1]) {
                    return true;
                }
                return false;
        }

        return true;
    }
    activeRow(ts) {
        let tr = this.pageGrid.query(`.trace-row.now`);
        if (tr) {
            $(tr).removeClass("now");
        }
        tr = this.pageGrid.query(`.trace-row[data-ts="${ts}"]`);



        if (tr) {
            $(tr).addClass("now");
        }
    }

    focus() {
        const childs = this.pageGrid.queryAll(`.trace-row`);
        let height = 0;

        Array.from(childs).every((node: any) => {

            if (node.classList.contains("now")) {

                return false;
            }
            height += node.firstChild.getBoundingClientRect().height;

            return true;

        });
        
        this.pageGrid.get().scrollTop = height;

        
    }
    async createList() {
        const layers = this.getTraceLayers();
        const activeLayers = layers.filter((layer, index) => {
            if (this.pageLayer.query(`input[type="checkbox"][value="${index}"]:checked`)) {
                return true;
            }
            return false;
        });

        let main = this.pageGrid;

        main.text("");

        const data = this.data.filter(d => {

            for (let layer of activeLayers) {

                if (layer.prop) {
                    const property = layer.prop;


                    const condition = layer.valueType;
                    const values: any = (layer.value || "").toString().split(",");

                    const value = d[property];
                    if (this.createLayerFilter(condition, values, value)) {
                        return true;
                    }
                }

            }
            return false;
        });


        const table = main.create("div").addClass("trace-grid");
        const header = table.create("div").addClass("trace-header");
        this.configData.labels.forEach((line) => {
            header.create("div").text(line);

        });

        data.forEach((data, index) => {

            const row = table.create("div").addClass("trace-row").
                ds("ts", data.ts).
                on("click", (event) => {
                    //this.activeRow(data.ts);
                    //this._trace.goTo($(event.currentTarget).ds("value"));
                    this._trace.setProgress(data.ts)
                });;
            this.configData.fields.forEach((line) => {
                row.create("div").ds("value", index).text(data[line])


            });


        });
    }
    playBar(bar) {

        bar.create("button").prop({ "type": "button", "title": "Rewind" }).addClass("icon-fb")
            .on("click", () => {

                this.speed--;
                if (this.speed < 0) {
                    this.speed = 0;
                }

                this.setSpeed(this.speed);
                this._trace.setSpeed(this.factorSpeed * this.speedRange[this.speed]);


            });


        bar.create("button").prop({ "type": "button", "title": "Ir al Principio" }).addClass("icon-go_begin")
            .on("click", () => {
                this.cmdTrace("go-begin");
                this.focus();
            });

        bar.create("button").prop({ "type": "button", "title": "Retroceder un Paso" }).addClass("icon-sb")
            .on("click", () => {
                this.cmdTrace("sb");
                this.focus();
            });

        this._playButton = bar.create("button").prop({ "type": "button", "title": "Iniciar Movimiento" }).addClass("icon-play")
            .on("click", () => {
                if (this._trace.getStatus() == 1) {
                    this.cmdTrace("pause");
                    this.focus();
                } else {
                    this.cmdTrace("play");
                    this.focus();
                }

            });


        bar.create("button").prop({ "type": "button", "title": "Avanzar un Paso" }).addClass("icon-sf")
            .on("click", () => {
                this.cmdTrace("sf");
                this.focus();
            });

        bar.create("button").prop({ "type": "button", "title": "Ir al Final" }).addClass("icon-go_end")
            .on("click", () => {
                this.cmdTrace("go-end");
                this.focus();
            });

        bar.create("button").prop({ "type": "button", "title": "fast forward" }).addClass("icon-ff")
            .on("click", () => {


                this.speed++;
                if (this.speed >= this.speedRange.length) {
                    this.speed = this.speedRange.length - 1;
                }

                this.setSpeed(this.speed);
                this._trace.setSpeed(this.factorSpeed * this.speedRange[this.speed]);
            });
    }
    speedBar(bar: any, value?: number) {

        this.speedRange.forEach((e, index) => {
            //const speed = this.speedRange.length - index - 1;  /
            const className = (this.speedRange[index] >= 0) ? `f-${this.speedRange[index]}` : `r${this.speedRange[index]}`
            bar.create("div").addClass(["speed", className]).prop("title", "x" + this.speedRange[index])
                .on("click", () => {

                    this.setSpeed(index);
                    this._trace.setSpeed(this.factorSpeed * this.speedRange[index]);
                });
        });

        return;

        this.speedRange.forEach((e, index) => {
            const speed = this.speedRange.length - index - 1;
            bar.create("div").addClass(["speed", `r-${speed}`]).prop("title", "x" + this.speedRange[speed])
                .on("click", () => {
                    this.dir = -1;
                    this.setSpeed(speed);
                    this._trace.setSpeed(this.dir * this.factorSpeed * this.speedRange[speed]);
                });
        });

        this.speedRange.forEach((e, speed) => {
            bar.create("div").addClass(["speed", `f-${speed}`]).prop("title", "x" + this.speedRange[speed])
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
            this.onOpen();
        }

    }
    init() {

    }
    setIconPlay(value) {
        if (value) {
            this._playButton.removeClass("icon-pause");
            this._playButton.addClass("icon-play");
        } else {
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
        this._trace.onProgress = (ts, info) => {
            
            this.activeRow(ts);
            this.onProgress(info);
        };
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
        return this.getTrace().getAllLayers();//.layers;
    }

    getTraceGroupLayers() {
        return this.getTrace().groups;
    }

    showLayers() {
        this.pageLayer = this.getPage(1);
        this.pageLayer.text("");

        this.groups = this.getTraceGroupLayers();
        const layers = this.getTraceLayers();

        //alert(889);
        //return;
        let items = [];


        let _menu: any = null;
        //let index = 0;
        layers.forEach((layer, index: number) => {
            if (layer.group >= 0) {
                if (!items[layer.group]) {
                    items[layer.group] = {
                        ds: { group: layer.group },
                        caption: this.groups[layer.group].caption,
                        useCheck: true,
                        items: []
                    }
                }

                _menu = items[layer.group];
            } else {

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
                value: index.toString(),
                checked: layer.visible,
                checkValue: index,
                check: (x, event) => {

                    this.onCheckLayer(parseInt(x.ds("value"), 10), event.currentTarget.checked);
                    this.getTrace().showLayer(layer.id, event.currentTarget.checked);
                    this.createList();

                }
            });
        });

        for (let layer of layers) {



        }

        let menu = new Menu({

            autoClose: false,
            target: this.getPage(1),//this._group,
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
            })

        };


    }
    setLength(length) {
        this.length = length;
        if (this._meter == 0) {
            this._length.text((this.length / 1000).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            this._unit.text("Km");
        } else {
            this._length.text(this.length.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
            this._unit.text("m");
        }


    }
    toggleUnit() {

        if (this._meter == 0) {
            this._meter = 1;
        } else {
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
            this.onClose();
        }
    }

    setInfoPage(page) {
        this.win["info"] = new Float.Window({
            visible: false,
            caption: this.caption + "- Info",
            left: "center",
            top: "middle",
            //width: "600px",
            //height: "250px",
            mode: "auto",
            className: ["sevian"],
            child: page
        });
    }
    setGridPage(page) {
        this.win["grid"] = new Float.Window({
            visible: false,
            caption: this.caption + "- Data",
            left: "center",
            top: "middle",
            width: "300px",
            height: "300px",
            mode: "auto",
            className: ["sevian"],
            child: page
        });
    }


}
