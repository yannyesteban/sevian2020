import {_sgQuery as $}  from '../Sevian/ts/Query.js';
import {Menu}  from '../Sevian/ts/Menu2.js';
import {Tab}  from '../Sevian/ts/Tab.js';


export class TraceControl{
    id:string = "mapboxgl-ctrl-trace";

	main:any = null;
	mainTool:any = null;
	mainControl:any = null;
	mainBody:any = null;
	mainMenu:any = null;
	mainButton:any = null;

    layerControl:any = null;
    playControl:any = null;
    speedControl:any = null;

	_mode:number = 0;




    private mainTab:any = null;


    private mode:string = "reset";

    constructor(object){
        this._parent = object;
    }

    setData(data){

    }
    setConfigData(config){

    }
    onAdd(map){



        this.main = $.create("div").addClass(["trace-tool"]);



        this.mainTool = this.main.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group",  "trace-tool"]);

        this.mainControl = this.main.create("div").addClass(["trace-tool", "mapboxgl-ctrl", "mapboxgl-ctrl-group"]).style("display","none");

		this.mainBody = this.mainControl.create("div").addClass(["trace-nav"], "mapboxgl-ctrlx", "mapboxgl-ctrl-group");
		this.mainMenu = this.mainControl.create("div").addClass(["trace-nav"], "mapboxgl-ctrlx", "mapboxgl-ctrl-group");


        this.mainButton = this.mainTool.create("button").prop({"type": "button", "title":"Inicia la herramienta de Traza"}).addClass("icon-trace");

        this.mainButton.on("click", ()=>{
            this.play();
        });







        //this._group_a = this._group2.create("div").addClass(["mapboxgl-ctrl","trace-nav"]);

        //this.playBar(this._group2.create("div").addClass(["mapboxgl-ctrl","trace-nav"]));

        //this._group_speed = this._group2.create("div").addClass(["mapboxgl-ctrl","trace-speed-nav"]);
        //this.speedBar(this._group_speed);
        /*this.mainControl.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group", "trace-layer"])
        .style("display","none");
*/
        const tab = this.mainTab = new Tab({
            id:this.mainBody,
            className:"trace-control",


        });

        tab.add({html:"",tagName:"form", active:true, className:"filter-form"});
        tab.add({html:"",});
        tab.add({html:"",});
        tab.add({html:"",tagName:"form"});
        tab.add({html:"",tagName:"form"});



        //this._length = this._group.create("span").addClass("rule-tool-value");
        //this._length.text("Layers");
        //this._unit = this._group.create("span");


        //this._group_b = this._group2.create("div").addClass(["mapboxgl-ctrl", "mapboxgl-ctrl-group"]);

        this.mainMenu.create("button").prop({"type": "button", "title":"Search"}).addClass(["icon-filter"])
        .on("click", ()=>{
            this.mainTab.show(0);
        });
        this.mainMenu.create("button").prop({"type": "button", "title":"Mostrar Capas"}).addClass(["icon-layer2"])
        .on("click", ()=>{
            this.mainTab.show(1);
        });

        this.mainMenu.create("button").prop({"type": "button", "title":"Configuración"}).addClass(["icon-setting-2"])
        .on("click", ()=>{
            this.mainTab.show(2);
        });

        this.mainMenu.create("button").prop({"type": "button", "title":"Info"}).addClass(["icon-info-2"])
        .on("click", ()=>{
            this.mainTab.show(3);
        });

        this.mainMenu.create("button").prop({"type": "button", "title":"Descarta Todo"}).addClass(["icon-trash"])
        .on("click", ()=>{

            this.reset();
            //this.cmdTrace("stop");
        });
        this.mainMenu.create("button").prop({"type": "button", "title":"Salir de la herramienta de medición"}).addClass(["icon-exit"])
        .on("click", ()=>{
            this.stop();
        });

        return this.main.get();

    }
    getLayerControl(control){
        return this.layerControl;
    }

    reset(){

        this.mainTab.getPage(1).text("");
        this.mainTab.getPage(2).text("");
        this.mainTab.getPage(3).text("");



        this.setMode("reset");

        this.mainTab.show(0);

    }
    setMode(mode){
        this.mode = mode;
        this._container.ds("mode", mode);
    }


    setFilterPage(form){
        this.getPage(0).append(form);
    }
    getPage(index){
        return this.mainTab.getPage(index)
    }
    createList(){
        let main = this.mainTab.getPage(2);

        const table = main.create("table").addClass("trace-list");
        const header = table.create("tr").addClass("trace-header");
        this.configData.labels.forEach((line)=>{
            header.create("th").text(line);

        });

        this.data.forEach((data, index) => {

            const row = table.create("tr").addClass("trace-row");
            this.configData.fields.forEach((line)=>{
                row.create("td").ds("value", index).text(data[line])
                .on("click", (event)=>{

                    this._trace.goTo($(event.currentTarget).ds("value"));
                });

            });


        });
    }


    onRemove(){
        this._container.parentNode.removeChild(this._container);

    }

    play(){
        this._parent.stopControls();
        if(this._mode == 0){
            this.mainTool.style("display","none");
			this.mainControl.style("display","");
            this._mode = 1;
        }

    }
    init(){

    }
    setIconPlay(value){
        if(value){
            this._playButton.removeClass("icon-pause");
            this._playButton.addClass("icon-play");
        }else{
            this._playButton.removeClass("icon-play");
            this._playButton.addClass("icon-pause");
        }
    }



    cmdTrace(cmd){
        switch(cmd){
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

    setTrace(trace){
        this._trace = trace;
        this._trace.setSpeed(this.dir * this.factorSpeed * this.speedRange[this.speed]);
        this._trace.onAddLayer = (layer)=>{
            this.showLayers();
        };
        this._trace.onUpdateLayer = (layer)=>{
            this.showLayers();
        };
        this._trace.onRemoveLayer = (id)=>{
            this.showLayers();
        };
        this._trace.onRemoveImage = (info)=>{
            this.showLayers();
        };
        this._trace.onUpdateImage = (info)=>{
            this.showLayers();
        };

        this.init();
        //this.showLayers();
    }

    getTrace(){
        return this._trace;
    }

    getTraceLayers(){
        return this.getTrace().getAllLayers();//.layers;
    }

    getTraceGroupLayers(){
        return this.getTrace().groups;
    }

    showLayers(){

        this.getPage(1).text("");

        this.groups = this.getTraceGroupLayers();
        const layers = this.getTraceLayers();
        //console.log(layers);
        //alert(889);
        //return;
        let items = [];


        let _menu:any = null;
        let index = 0;
        for(let layer of layers){
            if(layer.group >= 0){
                if(!items[layer.group]){
                    items[layer.group] = {
                        ds:{group:layer.group},
                        caption:this.groups[layer.group].caption,
                        useCheck:true,
                        items:[]
                    }
                }

                _menu = items[layer.group];
            }else{

                if(!items[0]){
                    items[0].items = items[layer.group] = {
                        caption:this.groups[layer.group].caption,
                        useCheck:true,
                        items:[]
                    };
                }
                _menu = items[0];

            }
            let icon = null;
            if(layer.image){
                 icon = $(this.getTrace().getImageObj(layer.image).getCanvas());
                icon.addClass(["layer-icon", layer.image]);
            }



            _menu.items.push({
                caption: layer.caption,
                customIcon:icon,
                //className:layer.className,
                useCheck:true,
                className:[layer.type, layer.color],
                //imageClass:[layer.type, layer.color],
                value:""+index++,
                checked:layer.visible,
                check:(x, event)=>{
                    this.onCheckLayer(parseInt(x.ds("value"), 10), event.currentTarget.checked);
                    this.getTrace().showLayer(layer.id, event.currentTarget.checked);
                }
            });


        }

        let menu = new Menu({

            autoClose: false,
            target:this.getPage(1),//this._group,
            items: items,
            type:"accordion",
            useCheck:true,
            subType:"",
        });
        return;

        this.getTrace().onAddLayer = (layer)=>{
            let icon = $(this.getTrace().getImageObj(layer.image).getCanvas());
            menu.add({
                caption: layer.caption,
                customIcon:icon,
                //className:layer.className,
                useCheck:true,
                className:[layer.type, layer.color],
                //imageClass:[layer.type, layer.color],
                value:""+index++,
                checked:layer.visible,
                check:(x, event)=>{
                    this.onCheckLayer(parseInt(x.ds("value"), 10), event.currentTarget.checked);
                    this.getTrace().showLayer(layer.id, event.currentTarget.checked);
                }
            })

        };


    }




    delete(){
        //this._line.stop();
        this._parent.delete(this.id);

    }

    stop(){

        if(this._mode == 1){

			this.mainTool.style("display","");
            this.mainControl.style("display","none");

            this._mode = 0;
        }
    }


}
