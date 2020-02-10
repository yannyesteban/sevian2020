var sgMap = (($) => {
   

    class Events{
        win:any = null;
        data:any[] = [];
        units:any[] = [];
        main:any = null;
        constructor(info){
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            this.main = $().create("div").addClass("win-events");
            this.win = new Float.Window({
                visible:true,
                caption:"Events",
                child:this.main,
                left:"right",
                top:"top",
                width: "300px",
                height: "300px",
                mode:"auto",
                className:["sevian"]
            });
            this.loadData(this.data);
        }

        loadData(data){

            let acc = new Accordion({target:this.main});
            this.data.forEach((e)=>{

                let line = $.create("ul").addClass("line").text("33");
                acc.add({
                    caption:this.units[e.unit_id].vehicle_name,
                    child:line,
                });
                //line.text(this.units[e.unit_id].vehicle_name);

            })
        }
    }

    function evalHTML(html, data){

        function auxf(str, p, p2, offset, s){
            return data[p2];
        }
        
        for(let x in data){
            let regex = new RegExp('\(\{=('+x+')\})', 'gi'); 
            html= html.replace(regex, auxf);
           
        }
        return html;

    }

    function replacer(str, p1, offset, s)
    {
      return " <<" + p1 + ">> ";
    }

    class Map{
        id:any = null;
        map:any = null;

        clients:any = [];
        accounts:any = [];

        units:object[] = [];
        tracking:object[] = [];
        events:object[] = [];

        constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = (this.id)? $(this.id): false;
            if(main){
                
                if(main.ds("sgMap")){
                    return;
                }
    
                if(main.hasClass("sg-map")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
            }

            _sgQuery(window).on("load", ()=> {
               // this.loadMap(main);
            });
            
      
        }
        loadMap(main){

        }
        _createGoogleMap(main:any){
            main.addClass("sg-map")
            let map = new google.maps.Map(main.get(), {
                center: {lat: 10.480594, lng: -66.903603},
                zoom: 14
              });

        }
        _create(main:any){

            main.addClass("map-main");
            let mapMenu = main.create("div").addClass("map-menu");
            let mapItems = main.create("div").addClass("map-items");
            let mapBody = main.create("div").addClass("map-body").id(`${this.id}_map`);
           //this.map = new LeatfletMap({id:this.id});
           //return;
           let items = [];

           let i = 0;
           let infoMenu = [];
            for(let x in this.clients){
                infoMenu[this.clients[x].id] = {
                    id: this.clients[x].id,
                    caption:this.clients[x].client,
                    items:[], 
                };    
            }
            let ev = new Events({
                data:this.events,
                units: this.units,
            });
            
            for(let x in this.accounts){
                infoMenu[this.accounts[x].client_id].items[this.accounts[x].id] = {
                    id: this.accounts[x].id,
                    caption:this.accounts[x].account,
                    items:[],  
                };
            }

           for(let x in this.units){

            infoMenu[this.units[x].client_id].items[this.units[x].account_id].items[this.units[x].unit_id] = {
                id: this.units[x].unit_id,
                caption:this.units[x].vehicle_name,
                action:()=>{
                    db (this.tracking[x].latitude);

                    this.map.flyTo(this.tracking[x].latitude*1,
                        this.tracking[x].longitude*1);
                }
                
            };
            


           }

           let menu = new Menu({
               caption:"Devices", 
               autoClose: false,
               target:mapItems,items: infoMenu});

           return;
           this.map = new MapBox({id:`${this.id}_map`});
           
           
       
           var html = `<div class="wecar_info">
                <div>{=vehicle_name}</div>
                <div>{=device_name}</div>
                <div>{=brand}: {=model}<br>{=plate}, {=color} </div>
            
                <div>{=latitude}, {=longitude}</div>
            
                <div>Velocidad: {=speed}</div>
            
            </div>`;

            let popup = "";
            
            for(let x in this.tracking){
                
                
                popup = evalHTML(html, this.devices[x]);
                popup = evalHTML(popup, this.tracking[x]);
                

                this.map.addMark(x, {
                    lat:this.tracking[x].latitude,
                    lng:this.tracking[x].longitude,
                    heading:this.tracking[x].heading,
                    popupInfo: popup
                });
                //db (this.devices[x].device_name, "red");
            }
           
            
            
        }
        _load(main:any){}
    }
    return Map;
})(_sgQuery);