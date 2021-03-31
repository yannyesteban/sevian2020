import {S}  from '../../Sevian/ts/Sevian.js';
import {_sgQuery}  from '../../Sevian/ts/Query.js';
import {MapBox}  from '../../lib/MapBox.js';

export var MAPBOX_IMAGES = 1;
export var GTMap = (($) => {
    
   window.GTMap = GTMap;
   
    class Map{

        static _instances = [];
        static _last = null;
        static _loadFuntions:Function[] = []

        id:any = null;
        map:any = null;

        //win:any = null;
        //data:any[] = [];
        //units:any[] = [];
        //main:any = null;
        //clients:any[] = [];
        //accounts:any[] = [];
        //tracking:any[] = [];
        
        info:any = null;
		//wInfo:any = null;
		
        tapName:any = null;
        
        markImages:string[] = [];
        markDefaultImage:string = "";
        iconImages:any[] = [];
        controls:string[] = [];

        static getMap(name){
            
            if(name){
               return Map._instances[name]; 
            }if (Map._last){
                return Map._last;
            }

            return null;
            
        }
        static setMap(name, map){
            Map._instances[name] = map;
        }
        static load(fn){
            Map._loadFuntions.push(fn);
        }
        constructor(info){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            
            let main = (this.id)? $(this.id): false;
           
            if(main){
            
                if(main.ds("gtMap")){
                    return;
                }
    
                if(main.hasClass("gt-map")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
			}
			
            Map.setMap(this.id, this);
            

		
        }
        _create(main:any){
            
            main.addClass(["map-main", "map-layout"]);
            this.map = new MapBox({
                id:                 `${this.id}`,
                markImages:         this.markImages, 
                markDefaultImage:   this.markDefaultImage,
                iconImages:         this.iconImages,
                controls:           this.controls
            });
            
            this.map.on("load", (event)=>{
                for(let fn of Map._loadFuntions){
                    fn(this.map, this.id);

                }

            });
			

        }   
        _load(main:any){

        } 

	}

    
	return Map;
})(_sgQuery);

S.register("GTMap", GTMap);