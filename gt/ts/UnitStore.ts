import { _sgQuery as $, SQObject } from '../../Sevian/ts/Query.js';
import { S } from '../../Sevian/ts/Sevian.js';

const obj = $.create("div").get();
const eventUnitChange = 'unitChange';
const eventVisibleChange = 'visibleChange';
const eventInfoChange = 'infoChange'
export class UnitStore {

    private unit:any = null;
    private timer:number = null;
    private delay: number = 5;
    private lastTime: string = null;

    public id:string = null;
    public caption: string = "Store"
    
    constructor(config) {
        const self:any = this;

        for (let x in config) {
            if (this.hasOwnProperty(x)) {
                this[x] = config[x];
            }
        }

        this.play();
       
    }

    setUnit(unit) {

        this.unit = unit;
        this.unit.active = true;
        this.dispatchEvent(eventUnitChange, this.unit);
        console.log("dispatchEvent");
        
    }

    updateData(data){
        this.dispatchEvent(eventInfoChange, Object.assign(this.unit || {}, data));
    }

    loadUnit(unitId){
        
        this.goFindUnit(unitId).then((unit)=>{
            this.setUnit(unit);
        });
    }
    
    goFindUnit(unitId){
        return new Promise((resolve, reject)=>{
            S.go({
                async: true,
                valid: false,
                requestFunctions: {
                    info: (json) => {
                        const data = Object.assign({}, json.unitData);
                      
    
    
                        resolve(data);
                    },
                },
                params: [
                    {
                        t: "setMethod",
                        element: "gt-unit-store",
                        method: "get-unit-data",//(type == "0") ? "get-event" : "get-command",
                        name: "",
                        eparams: {
                            unitId,
    
                        },
                        iToken: "info",
                    }
                ],
            });
        });
        
	
    }

    public play() {


		if (this.timer) {
			window.clearTimeout(this.timer);
		}

		this.timer = setInterval(() => {

			S.go({
				async: true,
				valid: false,
				requestFunctions: {
					info: (json) => {
						
						json.tracking.forEach(data => {
							this.dispatchEvent(eventInfoChange, data);
						});
					},
				},

				params: [
					{
						t: "setMethod",
						id: this.id,
						element: "gt-unit-store",
						method: "tracking",
						name: "",
						eparams: {
							lastTime: this.lastTime
						},
						iToken: "info",
					}
				]
			});
		}, this.delay * 1000);
	}

	public stop() {
		if (this.timer) {
			window.clearTimeout(this.timer);
		}
	}

    public addEvent(eventName, fn) {

        obj.addEventListener(eventName, fn);

    }

    public dispatchEvent(eventName, data: any) {
        const event = new CustomEvent(eventName, {
            detail: {
                data
            }
        });

        obj.dispatchEvent(event);
    }
    
}