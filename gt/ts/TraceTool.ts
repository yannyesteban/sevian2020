import {_sgQuery as $}  from '../../Sevian/ts/Query.js';
import {Form2 as Form} from '../../Sevian/ts/Form2.js';
import {Menu as Menu} from '../../Sevian/ts/Menu2.js';
import {Float}  from '../../Sevian/ts/Window.js';
import {Tab}  from '../../Sevian/ts/Tab.js';
import {I, Input, Hidden, InputDate, InputInfo, Multi}  from '../../Sevian/ts/Input.js';

import {History}  from '../../lib/History.js';


export class TraceTool{
	private id:any = null;
    private data:any = null;
	private dataUnits:any[] = [];
	private tracking:any[] = [];
	private main: any = null;

    public onTrace: (unitId: number, value: boolean) => void = (unitId, value) => { };
    public onFollow: (unitId: number, value: boolean) => void = (unitId, value) => { };

	constructor(info){

        for(var x in info){
            if(this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        //this.data = this.getInfo();


        //this.getLayerList();
        //return;
        let main = (this.id)? $(this.id): false;

        if(!main){
            main = $.create("div").attr("id", this.id);
        }

        this.create(main);


    }
	create(main:any){

        this.main = main;
        main.addClass("layer-tool");

        this.createUnitMenu(this.dataUnits);
        return;
        const tab = new Tab({
            id:main,
            className:"layer-tool"
        });

        tab.add({caption:"L", tagName:"form", active:true});
        tab.add({caption:"I",tagName:"form"});
        tab.add({caption:"G", tagName:"form"});
        tab.add({caption:"R", tagName:"form"});
        tab.add({caption:"T", tagName:"form"});
        tab.add({caption:"C", tagName:"form"});

        tab.getCaption(0).prop("title", "Agregar/Editar Capas");
        tab.getCaption(1).prop("title", "Agregar/Editar Imágenes");
        tab.getCaption(2).prop("title", "Agregar/Editar Grupos");
        tab.getCaption(3).prop("title", "Configurar Ruta");
        tab.getCaption(4).prop("title", "Configurar Traza");
        tab.getCaption(5).prop("title", "Configuración");




    }

    createUnitMenu(unitData) {
        const qDiv = this.main.create("input").prop({"type":"text","placeholder":"...SEARCH"}).addClass("trace-tool-search")
        .on("keyup", (event)=>{
            //event.preventDefault()
           
            const value = event.currentTarget.value.toUpperCase();
            if(value != ""){
                
                let elements = this.main.queryAll(`li:not([data-unit-name*="${value}"])`);
                
                elements.forEach((e)=>{
                    e.style.display="none";
                });
                elements = this.main.queryAll(`li[data-unit-name*="${value}"]`);
                
                elements.forEach((e)=>{
                    e.style.display="";
                });
            }else{
                const elements = this.main.queryAll(`li[data-unit-name]`);
                
                elements.forEach((e)=>{
                    e.style.display="";
                });
            }
            
        });
        const ul = this.main.create("ul").addClass("trace-tool");
        const data = unitData.sort((a, b)=>{
            if (a.unitName > b.unitName) {
                return 1;
              }
              if (a.unitName < b.unitName) {
                return -1;
              }
              // a must be equal to b
              return 0;
        });
        
        data.forEach(unit => {
            const li = ul.create("li").ds("unitId", unit.unitId).ds("unitName", (unit.unitName || "").toUpperCase());
            li.addClass((unit.noTracking == 1) ? "" : "active");
            li.create("a").text(unit.unitName);
            li.create("input").prop(
                {
                    "type": "checkbox",
                    "title": "Iniciar Trace Tool",
                    "value": unit.unitId,
                    "disabled": ((unit.noTracking == 1) ? "disabled" : ""),
                    
                   
                })
                .ds("role", "trace")
                .on("click", (event) => {

                    if(event.currentTarget.checked){
                        li.addClass("checked");
                    }else{
                        li.removeClass("checked");
                    }
                    this.onTrace(unit.unitId, event.currentTarget.checked);
                });
            li.create("input").prop(
                {
                    "type": "checkbox",
                    "title": "Iniciar Follow Me",
                    "value": unit.unitId,
                    "disabled": ((unit.valid == 0) ? "disabled" : ""),
                   
                })
                .ds("role", "follow")
                .on("click", (event) => {
                    this.onFollow(unit.unitId, event.currentTarget.checked);
                });;
        });

    }

    validUnit(unitId: number, value: boolean) {

        const nodes = this.main.queryAll(`[data-unit-id="${unitId}"] input`);
        nodes.forEach(ele => {
            ele.disabled = false;
        });


    }

    setFollowCheck(unitId: number, value: boolean){
        const nodes = this.main.queryAll(`[data-unit-id="${unitId}"] input[data-role="follow"]`);
        nodes.forEach(ele => {
            ele.checked = value;
        });
    }

    setTraceCheck(unitId: number, value: boolean){
        const nodes = this.main.queryAll(`[data-unit-id="${unitId}"] input[data-role="trace"]`);
        nodes.forEach(ele => {
            ele.checked = value;
        });
    }


}
