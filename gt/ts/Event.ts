import { _sgQuery as $, SQObject } from "../../Sevian/ts/Query.js";
import { Menu as Menu } from "../../Sevian/ts/Menu2.js";
import { Float } from "../../Sevian/ts/Window.js";
import { Map, MapApi, MapControl } from './Map.js';


import {
    I,
    Input,
    Hidden,
    InputDate,
    InputInfo,
    Multi,
} from "../../Sevian/ts/Input.js";
import { Form2 as Form } from "../../Sevian/ts/Form2.js";
import { Tab } from "../../Sevian/ts/Tab.js";
import { S } from "../../Sevian/ts/Sevian.js";

import { Communication } from "./Communication.js";
import { UnitConfig } from "./UnitConfig.js"
import { InfoComm, InfoMenu, InfoUnits } from './InfoMenu.js';

import { InfoForm } from '../../Sevian/ts/InfoForm.js';

export class Event {
    public id: any = null;
    public caption: string = "";
    public formId: string = "form-" + String(new Date().getTime());
    public formAId: string = "forma-" + String(new Date().getTime());
    public formWId: string = "formw-" + String(new Date().getTime());
    public formMId: string = "formm-" + String(new Date().getTime());
    public formIds = {};

    private infoForm:any = null;
    private infoFormMain: InfoForm = null;
    public className: any = null;
    private main: SQObject = null;

    private wins: any[] = [];

    private commandConfig: any = null;
    private unitConfig: any = null;
    private unitPending: any = null;
    private eventList: any = null;
    private commandList: any = null;

    private form: Form = null;
    private forms: { [key: string]: Form } = {};

    private unitId: number = null;
    private unitName: string = "";
    private index: number = 100;
    private eventId: number = null;

    //private listCommand["0"]: any;
    private tab: Tab = null;
    private tabs: any[] = [];

    private listCommand: any[] = [];


    private socketId: string = "";
    private socket: Communication = null;

    private unitPanelId: string = "";
    private unitPanel: any = null;


    private timer = null;
    private delay: number = 10000;

    private infoMenuId:string = null;
    private infoMenu:any = null;
    private totalPending = -1;

    public onSubTotal: (unitId:number, total:number)=>void = (unitId, total)=>{};

    private subtotalButton: any = null;

    private map:MapApi;
    private mapName: string = "";

    private mark: any = null;
    private popup: any = null;

    constructor(info: Event) {

        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        let main = this.id ? $(this.id) : null;



        if (!main) {
            main = $.create("div").attr("id", this.id);
            main.on("click", (event) => {

            })
        }





        if (this.unitPanelId) {
            this.unitPanel = S.getElement(this.unitPanelId);
            this.unitPanel.addEvent((unitId: number) => {


                if (this.wins["main"].getVisible()) {
                    this.show(unitId);
                }

            });
            this.unitPanel.onPending = (unitId: number) => {

                this.show(unitId);
            };



        }

        if (this.socketId) {

            this.socket = S.getElement(this.socketId) as Communication;

        }

        //this.formIds["0"] = "form-" + String(new Date().getTime());

        Map.load(this.mapName, (mapApi: MapApi, map) => {


            this.infoFormMain = new InfoForm(this.infoForm);

			this.map = mapApi;
            this.popup = this.map.createPopup( { 
                focusAfterOpen: true,
                closeOnClick: false 
            }
            );

            this.map.map.on("click", ()=>{
                this.popup.remove();
            });

            this.popup.setDOMContent(this.infoFormMain.get());                
                
        });
        this.create(main);
        //this.play();

    }

    public create(main: SQObject) {
        this.main = main;
        main.addClass("event-tool");
    }

    public showEvent(eventId){
        this.goShowEvent(eventId);
	}

    public getUnit() {
        if (this.unitPanel) {
            return this.unitPanel.getLastUnit();
        }

        return null;

    }

    public show(unitId?) {



    }

    public setUnitId(unitId) {
        this.unitId = unitId;
    }
    public getUnitId() {
        return this.unitId;
    }



    public play() {
        if (this.timer) {
			window.clearTimeout(this.timer);
		}

        this.timer = setInterval(() => {
            //this.goLoadPending(this.getUnit());
         }, this.delay);

    }

    stop() {
		if (this.timer) {
			window.clearTimeout(this.timer);
		}
	}




    private goShowEvent(eventId: number) {


        console.log(this.infoFormMain.get());

        S.go({
            async: true,
            valid: false,

            blockingTarget: this.infoFormMain,
            requestFunctions: {
                getEven: (json) => {
                    console.log(json);
                    this.infoFormMain.setData(json);

                    this.popup.setLngLat([json.longitude, json.latitude]);
                    
                    this.popup.addTo(this.map.map);
                    this.map.flyTo(json.longitude, json.latitude);
                    return;

                    if (!this.mark) {
                        this.mark = this.map.createMark({
                            latitude: json.latitude,
                            longitude: json.longitude,
                            heading: 0,//json.heading,
                            image: "http://localhost/sevian2020/images/marks/squat_marker_orange-31px2.png",
                            popupInfo: this.infoFormMain.get(),
                            visible: true,//this.visible
                        });
                    } else {
                        this.mark.setLngLat([json.longitude, json.latitude]);
                        //this.mark.setHeading(json.heading || 0);
                    }

                    this.mark.panTo();

                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-event",
                    method: "get-event",
                    name: "",
                    eparams: {
                        eventId: eventId,

                    },
                    iToken: "getEven",
                },
            ],
        });
    }







}
