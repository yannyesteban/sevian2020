import { S } from '../../Sevian/ts/Sevian.js';
import { SQObject, _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { MapBoxLib, MapControl as _MapControl } from '../../lib/MapBoxLib.js';

import {IMark}  from '../../lib/MapType.js';

import * as Google from '../../lib/googleMaps/Map.js';
import * as OpenStreet from '../../lib/OpenStreet/Map.js';
//import { UnitAdmin } from './UnitMap.js';
//import { Mark } from 'lib/Mark.js';

interface MapInitFunctions {
    [key: string]: Function[]
}

interface MapAdminClient {
    setMap: (map: MapAdmin) => {}
}


const eventMapChange = 'map-change';
const obj = $.create("div").get();

export type MapApi = MapBoxLib;
export type MapLib = MapBoxLib;
export type MapControl = _MapControl;

export class MapAdmin {

    private main: SQObject = null;
    private type: string = "googleMaps";

    private clients: string[] = [];
    private unitAdminId: string = null;
    //private unitAdmin: UnitAdmin = null;


    private id: any = null;
    private api: any = null;

    private mobiles:Google.Mark[] = [];
    private marks:Google.Mark[] = [];


    constructor(options: any) {
        console.log(options)
        for (let key in options) {
            if (this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
        }

        let main = (this.id) ? $(this.id) : null;

        if (!main) {
            main = $.create("div").attr("id", this.id);
        }

        this.create(main);
        //Map.setMap(this.name, this);
    }

    create(main: SQObject) {
        this.main = main;

        this.createMap(this.type);

        this.clients.forEach(c => {
            const client = S.getElement(this.unitAdminId) as MapAdminClient;
            //client.setMap(this);
        });

    }

    private createMap(type) {

        
        let map;
        this.mobiles = [];
        this.type = type;
        this.main.addClass("map-layout");
        switch (this.type) {
            case "googleMaps":
                this.api = map = new Google.Map({
                    container: this.main.get(),
                    className: ["map-layout"],
                    longitude: -66.903603, 
                    latitude: 10.480594,
                    onLoad: (map1:any)=>{
                        this.dispatchEvent(eventMapChange, {map});
        
                    }
        
                });
                this.api.init();
                
                break;
            case "openStreet":
                console.log(this.main);
                this.api = map = new OpenStreet.Map({
                    container: this.main.get(),
                    className: ["map-layout"],
                    longitude: -66.903603, 
                    latitude: 10.480594,
                    onLoad: (map1:any)=>{
                        this.dispatchEvent(eventMapChange, {map});
                    }

                });

                
                this.api.init();
                
                break;
        }
    }

    public toggleMap(){
        
        if(this.type === "googleMaps"){
            this.createMap("openStreet");
        }else{
            this.createMap("googleMaps");
        }
        
    }

    

   
    drawMark(id, info: any) {
        return this.api.drawMark(id, info);
    }

    

    getMark(id) {
        return this.api.getMark(id);
    }

    addMobil(info: IMark){
        const found = this.mobiles.find(element => element.id === info.id);
        if(found){
            console.log("error return found")
            return found;
        }
        console.log(this.api.API_TYPE);
        const movil = this.api.drawMark(info);
        this.mobiles.push(movil);
        

        return movil;
    }

    getMobil(id){
        return this.mobiles.find(element => element.id === id);
    }

    removeMobil(id){
        const index = this.mobiles.findIndex(element => element.id === id);
        if(index >= 0){
            this.mobiles[index].remove(); 
            this.mobiles.splice(index, 1);
        }
        
    }

    public addEvent(eventName, fn) {

		obj.addEventListener(eventName, fn);

	}

	public dispatchEvent(eventName, data) {
		const event = new CustomEvent(eventName, {
			detail: {
				data
			}
		});

		obj.dispatchEvent(event);
	}
}