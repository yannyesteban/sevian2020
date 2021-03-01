function humanDiff (t1, t2) {
    const diff = Math.max(t1,t2) - Math.min(t1,t2) 
    const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN
    
    const hrs = Math.floor(diff/HRS)
    const min = Math.floor((diff%HRS)/MIN).toLocaleString('en-US', {minimumIntegerDigits: 2})
    const sec = Math.floor((diff%MIN)/SEC).toLocaleString('en-US', {minimumIntegerDigits: 2})
    const ms = Math.floor(diff % SEC).toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping: false})
    
    //return `${hrs}:${min}:${sec}.${ms}`
    return `${hrs}:${min}:${sec}`
  }


 var InfoMenu = (($)=>{
    
    class InfoMenu{
        public id:any = "";
        public target:any = null;
        public mainClass:string = "";
        private main:any = null;

        private types:any[] = [];

        private menu:any = null;
        constructor(info){
            
            //console.di(info);
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = (this.id)? $(this.id): false;
            
            if(!main){
            
                main = $.create("div").attr("id", this.id || "");
            }
            
            this._create(main);
        }

        public _create(main){
            
            

            const items = [];
            this.types.forEach((e:any)=>{
                items.push({
                    value: e.value,
                    caption:e.caption,
                });

            });


            return;
            this.menu = new Menu({
				caption:"uuuu", 
				autoClose: true,
				target:main,
				type:"popup",
				subType:"dropdown",
                "className":["","sevian","horizontal"],
                items:items
            });
           
                
        }

        public updateType(type, text){
            if(text === 0){
                text = "";
            }
            this.menu.getByValue(type).getCaption().text(text);
        }
    }
    return InfoMenu;

 })(_sgQuery); 


 var InfoComm = (($) => {

    
    class InfoComm{
        public id:any = "";
        public target:any = null;
        public mainClass:string = "";
        private main:any = null;


        private counts:number[] = [];

        public onread:Function = (info) =>{};
        public onadd:Function = (info) =>{};
        public ondelete:Function = (info) =>{};

        private lineId:number = 0; 

        private showType:boolean = true;
        /*
        types
        1:unit conected
        2:unit disconected
        3:unit sync message
        4:unit get position
        5:unit alarm
        6:unit event
        7:unit message
        8:unit command
        
        */


        types = {
            0:"unk",
            1:"unit conected",
            2:"unit disconected",
            3:"unit sync message",
            4:"unit get position",
            5:"unit alarm",
            6:"unit event",
            7:"unit receiving",
            8:"unit command"
        }

        cTypes:string[] = [
            "UNK", "CONN", "DISC", "SYNC", "POS", "ALARM", "EVENT","MSG","CMD"
        ];
        constructor(info){
            
            //console.di(info);
            for(let x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            for(let x in this.types){
                this.counts[x] = 0;
            }

            let main = (this.id)? $(this.id): false;
            
            if(main){
            
                
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                
            }
            
            this._create(main);
            this.initTimer();
        }

        _create(main:any){
			this.main = main;
            main.addClass(this.mainClass);
            let mainPanel = this.ul = main.create("div").addClass("info-comm").id("xxy");

        }
        public add(message:any){
            
            this.lineId++;

            const div = this.ul.createFirst("div").addClass("main").removeClass("open")
            .ds("id", message.id).ds("line", this.lineId).ds("type", message.type);

            if(message.status == 0){
                div.addClass("new");
            }
            div.on("click", ()=>{
                //div.removeClass("new");
                this.onread(message);
            });

            div.create("div").text("+").addClass("btn-new").on("click", () => {
                div.toggleClass("open");
                
            });

            div.create("div").text(message.name || "");

            const date = new Date();
            const start = date.getTime(); 

            div.create("div").text("Ahora").addClass("date").ds("date",date.toISOString()).ds("time", start);
            
            if(this.showType){
                div.create("div").addClass("type").ds("type", message.type).text(this.cTypes[message.type] || "");
            }
            
            div.create("div").text(message.message || "");
            div.create("div").text("x").addClass("btn-delete").on("click", (event)=>{
                //this.deleteLine(event.currentTarget);
                this.ondelete(message);
            });


            if(typeof(message.info) === "object"){
                const detail = div.create("div").addClass("detail");
                for(let x in message.info){
                    detail.create("span").text(x);
                    detail.create("span").text(message.info[x]);
                }

            }

            this.onadd(message);
            
        }

        public setStatus(id, status){
            
            //console.log(`.main[data-id='${id}']`, this.ul.query(`.main[data-id='${id}']`));
            const ele = $(this.ul.query(`.main[data-id='${id}']`));
            if(ele){
                if(status == 0){
                    ele.addClass("new");
                    
                }else if(status == 1){
                    ele.removeClass("new");
                }else if(status == 2){
                    
                    ele.removeClass("new");
                    ele.get().remove();
                }
            
            }
            
        }
        public get(){
            return this.main;
        }

        public initTimer(){
            setInterval(()=>{
                this.updateTime();
            }, 60000);
        }

        public updateTime(){
            const x = this.main.queryAll(".date");
            const date = new Date();
            const now = date.getTime(); 
            let start = null;
            for(let e of x){
                start = new Date($(e).ds("date"));
                
                $(e).text(humanDiff(date, start));
            }
            
        }

        public getCounts(){
            for(let x in this.types){
                //this.counts[x] = 0;
            }
            this.counts = [];
            const ele = this.main.queryAll(`.new[data-type]`);
            ele.forEach(element => {
                const type = $(element).ds("type");

                if(!this.counts[type]){
                    this.counts[type] = 0;
                }
                this.counts[type]++;
            });

            
        
            
            return this.counts;
            
        }

        public deleteLine(e){
            
            e.parentNode.remove();
            return;
            
            const ele = this.main.query(".main[data-line='${line}']");
            alert(line)
            if(ele){
                ele.remove();
                alert(8)
            }

        }

        public reset(){
            this.ul.text("");
        }
    }

    return InfoComm;
})(_sgQuery);

var InfoUnits = (($) => {

    
    class InfoUnits{
        public id:any = "";
        public target:any = null;
        public mainClass:string = "";
        private main:any = null;


        private counts:number[] = [];

        public onread:Function = (info) =>{};
        public onadd:Function = (info) =>{};

        private lineId:number = 0; 
        /*
        types
        1:unit conected
        2:unit disconected
        3:unit sync message
        4:unit get position
        5:unit alarm
        6:unit event
        7:unit message
        8:unit command
        
        */


        types = {
            0:"unk",
            1:"unit conected",
            2:"unit disconected",
            3:"unit sync message",
            4:"unit get position",
            5:"unit alarm",
            6:"unit event",
            7:"unit receiving",
            8:"unit command"
        }

        cTypes:string[] = [
            "UNK", "CONN", "DISC", "SYNC", "POS", "ALARM", "EVENT","MSG","CMD"
        ];
        constructor(info){
            
            //console.di(info);
            for(let x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            for(let x in this.types){
                this.counts[x] = 0;
            }

            let main = (this.id)? $(this.id): false;
            
            if(main){
            
                
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                
            }
            
            this._create(main);
            this.initTimer();
        }

        _create(main:any){
			this.main = main;
            main.addClass(this.mainClass);
            let mainPanel = this.ul = main.create("div").addClass("info-comm-units").id("xxy");

        }
        public add(message:any){
            const e = this.main.query(`.main[data-id='${message.id}']`);
            //console.log(message);
            //console.log(message.id, message.name);
            if(e){
                this.deleteLine(e);
                //console.log("borrando ",message.id);
            }else{
                
            }
            this.lineId++;
            

            const div = this.ul.createFirst("div").addClass("main").removeClass("open").addClass("ID-"+message.id)
            .ds("id", message.id).ds("line", this.lineId).ds("type", message.type);
            div.on("click", ()=>{
                div.removeClass("new");
                this.onread(message);
            });

            div.create("div").text("+").addClass("btn-new").on("click", ()=>{
                div.toggleClass("open");
                
            });

            div.create("div").text(message.name || "");

            const date = new Date();
            const start = date.getTime(); 

            //div.create("div").text("Ahora").addClass("date").ds("date",date.toISOString()).ds("time", start);
            div.create("div").addClass("delay").text(message.delay || "1");;
            div.create("div").addClass("type").ds("xtype", message.type).text(message.device_name || "");
            div.create("div").text(message.message || "");
            div.create("div").text("x").addClass("btn-delete").on("click", (event)=>{
                //this.deleteLine(event.currentTarget);
            });


            if(typeof(message.info) === "object"){
                const detail = div.create("div").addClass("detail");
                for(let x in message.info){
                    detail.create("span").text(x);
                    detail.create("span").text(message.info[x]);
                }

            }

            this.onadd(message);
            
        }

        public get(){
            return this.main;
        }

        public initTimer(){
            setInterval(()=>{
                this.updateTime();
            }, 20000);
        }

        public reset(){
            this.ul.text("");
        }
        public updateTime(){
            const x = this.main.queryAll(".date");
            const date = new Date();
            const now = date.getTime(); 
            let start = null;
            for(let e of x){
                start = new Date($(e).ds("date"));
                
                $(e).text(humanDiff(date, start));
            }
            
        }

        public getCounts(){
            for(let x in this.types){
                this.counts[x] = 0;
            }

            for(let x in this.counts){
                const ele = this.main.queryAll(`.new[data-type='${x}']`);
                ele.forEach(element => {
                        this.counts[x]++;
                });
                
            }
            
            return this.counts;
            
        }

        public deleteLine(e){
            const parent = e.parentNode;
            parent.removeChild(e);
            $(parent).addClass("borrada");
            return;
            
            const ele = this.main.query(".main[data-line='${line}']");
            alert(line)
            if(ele){
                ele.remove();
                alert(8)
            }

        }
    }

    return InfoUnits;
})(_sgQuery);