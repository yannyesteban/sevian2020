import { SQObject, _sgQuery as $ } from '../../Sevian/ts/Query.js';
import { Menu as Menu } from '../../Sevian/ts/Menu2.js';

function humanDiff(t1, t2) {
    const diff = Math.max(t1, t2) - Math.min(t1, t2)
    const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN

    const hrs = Math.floor(diff / HRS)
    const min = Math.floor((diff % HRS) / MIN).toLocaleString('en-US', { minimumIntegerDigits: 2 })
    const sec = Math.floor((diff % MIN) / SEC).toLocaleString('en-US', { minimumIntegerDigits: 2 })
    const ms = Math.floor(diff % SEC).toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false })

    //return `${hrs}:${min}:${sec}.${ms}`
    return `${hrs}:${min}:${sec}`
}




export class InfoMenu {
    public id: any = "";
    public target: any = null;
    public mainClass: string = "";
    private main: any = null;

    private types: any[] = [];

    private menu: any = null;
    constructor(info) {


        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        let main = (this.id) ? $(this.id) : false;

        if (!main) {

            main = $.create("div").attr("id", this.id || "");
        }

        this._create(main);
    }

    public _create(main) {



        const items = [];
        this.types.forEach((e: any) => {
            items.push({
                value: e.value,
                caption: e.caption,
            });

        });


        return;
        this.menu = new Menu({
            caption: "uuuu",
            autoClose: true,
            target: main,
            type: "popup",
            subType: "dropdown",
            "className": ["", "sevian", "horizontal"],
            items: items
        });


    }

    getMain() {
        return this.main;
    }
    public updateType(type, text) {
        if (text === 0) {
            text = "";
        }
        if (this.menu) {
            this.menu.getByValue(type).getCaption().text(text);
        }

    }
}






export class InfoComm {
    public id: any = "";
    public target: any = null;
    
    public fields:any[] = [];
    public mainClass: string = "";
    private main: any = null;


    private counts: number[] = [];

    public onread: Function = (info) => { };
    public onadd: Function = (info) => { };
    public ondelete: Function = (info) => { };

    private lineId: number = 0;
    private maxRecords: number = 5;

    private showType: boolean = true;


    private ul: SQObject = null;

    public firstId = 0;
    public lastId = 0;
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
        0: "unk",
        1: "unit conected",
        2: "unit disconected",
        3: "unit sync message",
        4: "unit get position",
        5: "unit alarm",
        6: "unit event",
        7: "unit receiving",
        8: "unit command"
    }

    cTypes: string[] = [
        "UNK", "CONN", "DISC", "SYNC", "POS", "ALARM", "EVENT", "MSG", "CMD"
    ];
    constructor(info) {


        for (let x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        for (let x in this.types) {
            this.counts[x] = 0;
        }

        let main = (this.id) ? $(this.id) : false;

        if (main) {



        } else {
            main = $.create("div").attr("id", this.id);


        }

        this._create(main);
        this.initTimer();
    }

    _create(main: any) {
        this.main = main;
        main.addClass(this.mainClass);
        main.addClass("info-comm");
        let mainPanel = this.ul = main.create("div").addClass("grid");

    }

    public setData(data){
        this.lineId = 0;
        this.ul.text("");

        this.fields = [
            {
                name:"name",
            },
            {
                name:"ftime",
            },
            {
                name:"title",
            },
            {
                name:"speed",
            },
            {
                name:"delay",
            },
            {
                name:"attend",
            },
            {
                name:"user",
            },
            {
                name:"info",
            }

        ];
        data.forEach((message, index)=>{
            this.addMessage(message);
        });
        if(data[0]){
            this.firstId = data[0].id;
        }

        if(data[data.length - 1]){
            this.lastId = data[data.length - 1].id;
        }
        
    }
    public addMessage(message: any) {

        this.lineId++;

        if (this.lineId > this.maxRecords) {
            this.deleteLast(this.ul);
        }

        const div = this.ul.createFirst("div").addClass("row").removeClass("open")
            .ds("id", message.id).ds("line", this.lineId).ds("type", message.type)
            .ds("mode", message.mode).addClass(`ev-${message.event_id}`);

        if (message.status == 0) {
            div.addClass("new");
        }
        div.on("click", () => {
            //div.removeClass("new");
            this.onread(message);
        });
        div.on("dblclick", () => {
            //div.removeClass("new");
            this.ondelete(message);
        });

        div.create("div").text("").addClass("btn-new").on("click", () => {
            div.toggleClass("open");

        });

        this.fields.forEach(field => {
            div.create("div").addClass("cell").addClass(field.name).text(message[field.name] || "");
        });

        this.onadd(message);

        return;
        div.create("div").text(message.name || "");

        const date = new Date();
        const start = date.getTime();



        if (this.showType) {
            //div.create("div").addClass("type").ds("type", message.type).text(this.cTypes[message.type] || "");

        }
        div.create("div").addClass("ftime").text(message.ftime || "");
        div.create("div").addClass("_type").ds("type", message.type).text(message.title || "");

        div.create("div").text(message.speed || "").addClass("speed").on("click", (event) => {
            //this.deleteLine(event.currentTarget);
            //this.ondelete(message);
        });

        div.create("div").text("Ahora").addClass("date").ds("date", date.toISOString()).ds("time", start);
        //div.create("div").text(message.info || "");
        
        /*
        div.create("div").text("x").addClass("btn-delete").on("click", (event)=>{
            //this.deleteLine(event.currentTarget);
            //this.ondelete(message);
        });
        */

        if (typeof (message.info) === "object") {
            const detail = div.create("div").addClass("detail");
            for (let x in message.info) {
                detail.create("span").text(x);
                detail.create("span").text(message.info[x]);
            }

        } else {
            div.create("div").addClass("detail").text(message.info);
        }

        this.onadd(message);

    }

    getMain() {
        return this.main;
    }

    public add(message: any) {

        this.lineId++;

        if (this.lineId > this.maxRecords) {
            this.deleteLast(this.ul);
        }

        const div = this.ul.createFirst("div").addClass("main").removeClass("open")
            .ds("id", message.id).ds("line", this.lineId).ds("type", message.type)
            .ds("mode", message.mode).addClass(`ev-${message.event_id}`);

        if (message.status == 0) {
            div.addClass("new");
        }
        div.on("click", () => {
            //div.removeClass("new");
            this.onread(message);
        });
        div.on("dblclick", () => {
            //div.removeClass("new");
            this.ondelete(message);
        });

        div.create("div").text("+").addClass("btn-new").on("click", () => {
            div.toggleClass("open");

        });

        div.create("div").text(message.name || "");

        const date = new Date();
        const start = date.getTime();



        if (this.showType) {
            //div.create("div").addClass("type").ds("type", message.type).text(this.cTypes[message.type] || "");

        }
        div.create("div").addClass("ftime").text(message.ftime || "");
        div.create("div").addClass("_type").ds("type", message.type).text(message.title || "");

        div.create("div").text(message.speed || "").addClass("speed").on("click", (event) => {
            //this.deleteLine(event.currentTarget);
            //this.ondelete(message);
        });

        div.create("div").text("Ahora").addClass("date").ds("date", date.toISOString()).ds("time", start);
        //div.create("div").text(message.info || "");
        
        /*
        div.create("div").text("x").addClass("btn-delete").on("click", (event)=>{
            //this.deleteLine(event.currentTarget);
            //this.ondelete(message);
        });
        */

        if (typeof (message.info) === "object") {
            const detail = div.create("div").addClass("detail");
            for (let x in message.info) {
                detail.create("span").text(x);
                detail.create("span").text(message.info[x]);
            }

        } else {
            div.create("div").addClass("detail").text(message.info);
        }

        this.onadd(message);

    }

    public setStatus(id, status, user?) {


        const ele = $(this.ul.query(`.main[data-id='${id}']`));
        if (ele) {
            if (status == 0) {
                ele.addClass("new");

            } else if (status == 1) {
                ele.removeClass("new");
                const cellUser = $((ele).query(`.user`));
                if(cellUser){
                    cellUser.text(user || "");
                }
                

            } else if (status == 2) {


                ele.get().remove();
            }

        }

    }

    public setElementStatus(ele, status, user) {
        if (ele) {
            if (status == 0) {
                ele.addClass("new");

            } else if (status == 1) {
                ele.removeClass("new");
                const cellUser = $((ele).query(`.user`));
                if(cellUser){
                    cellUser.text(user || "");
                }
                

            } else if (status == 2) {
                ele.get().remove();
            }

        }
    }
    public setAllStatus(eventId, status, user?) {


        const list = this.ul.queryAll(`.main[data-id]`);

        for (let item of list) {
            if ($(item).ds("id") * 1 <= eventId) {
                this.setElementStatus($(item), status, user)
            }
        }
    }

    public get() {
        return this.main;
    }

    public initTimer() {
        setInterval(() => {
            this.updateTime();
        }, 5000);
    }

    public updateTime() {
        const x = this.main.queryAll(".date");
        const date = new Date();
        const now = date.getTime();
        let start = null;
        for (let e of x) {
            start = new Date($(e).ds("date"));

            $(e).text(humanDiff(date, start));
        }

    }

    public getRow(id) {


        const ele = this.main.query(`.row[data-id="${id}"]`);

        if (ele) {
            return ele;
        }
        return false;

    }

    public getCounts() {


        const ele = this.main.queryAll(`.new`);

        if (ele) {
            return ele.length;
        }
        return 0;

    }

    public getCounts1() {
        for (let x in this.types) {
            //this.counts[x] = 0;
        }
        this.counts = [];
        const ele = this.main.queryAll(`.new[data-type]`);
        ele.forEach(element => {
            const type = $(element).ds("type");

            if (!this.counts[type]) {
                this.counts[type] = 0;
            }
            this.counts[type]++;
        });




        return this.counts;

    }
    public deleteLine(e) {

        e.parentNode.remove();
        return;

        const ele = this.main.query(".main[data-line='${line}']");
        alert(line)
        if (ele) {
            ele.remove();
            alert(8)
        }

    }

    public deleteLast(main) {
        if (main.get().lastElementChild) {
            main.get().lastElementChild.remove();
            this.lineId--;
        }

    }

    public reset() {
        this.ul.text("");
        this.lineId = 0;
    }
}







export class InfoUnits {
    public id: any = "";
    public target: any = null;
    public mainClass: string = "";
    private main: any = null;


    private counts: number[] = [];

    public onread: Function = (info) => { };
    public onadd: Function = (info) => { };

    private lineId: number = 0;

    private ul: SQObject = null;
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
        0: "unk",
        1: "unit conected",
        2: "unit disconected",
        3: "unit sync message",
        4: "unit get position",
        5: "unit alarm",
        6: "unit event",
        7: "unit receiving",
        8: "unit command"
    }

    cTypes: string[] = [
        "UNK", "CONN", "DISC", "SYNC", "POS", "ALARM", "EVENT", "MSG", "CMD"
    ];
    constructor(info) {


        for (let x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        for (let x in this.types) {
            this.counts[x] = 0;
        }

        let main = (this.id) ? $(this.id) : false;

        if (main) {



        } else {
            main = $.create("div").attr("id", this.id);


        }

        this._create(main);
        this.initTimer();
    }

    _create(main: any) {
        this.main = main;
        main.addClass(this.mainClass);
        let mainPanel = this.ul = main.create("div").addClass("info-comm-units").id("xxy");

    }
    public add(message: any) {

        const connected = message.connected;
        const e = this.main.query(`.main[data-id='${message.id}']`);
        if(e){
            const value = $(e).ds("connected");
            if(value == message.connected){

                return;

            }

            this.deleteLine(e);

        }
        this.createRow(message);
        this.onadd(message);
        return;

        console.log(message.id)
        if(connected >= 0){

            if(!e){

                this.createRow(message);
            }

        }else{

            if(e){

                this.deleteLine(e);
            }
        }


        this.onadd(message);

        return;

        //console.log(message);
        //console.log(message.id, message.name);
        if (e) {
            this.deleteLine(e);
            //console.log("borrando ",message.id);
        } else {

        }
        this.lineId++;


        const div = this.ul.createFirst("div").addClass("main").removeClass("open").addClass("ID-" + message.id)
            .ds("id", message.id).ds("line", this.lineId).ds("type", message.type);
        div.on("click", () => {
            div.removeClass("new");
            this.onread(message);
        });

        div.create("div").text("+").addClass("btn-new").on("click", () => {
            div.toggleClass("open");

        });

        div.create("div").text(message.name || "");

        const date = new Date();
        const start = date.getTime();

        //div.create("div").text("Ahora").addClass("date").ds("date",date.toISOString()).ds("time", start);
        div.create("div").addClass("delay").text(message.delay || "1");;
        div.create("div").addClass("type").ds("xtype", message.type).text(message.device_name || "");
        div.create("div").text(message.message || "");
        div.create("div").text("x").addClass("btn-delete").on("click", (event) => {
            //this.deleteLine(event.currentTarget);
        });


        if (typeof (message.info) === "object") {
            const detail = div.create("div").addClass("detail");
            for (let x in message.info) {
                detail.create("span").text(x);
                detail.create("span").text(message.info[x]);
            }

        }

        this.onadd(message);

    }

    public get() {
        return this.main;
    }

    public initTimer() {
        setInterval(() => {
            this.updateTime();
        }, 20000);
    }

    public reset() {
        this.ul.text("");
        this.lineId = 0;
    }
    public updateTime() {
        const x = this.main.queryAll(".date");
        const date = new Date();
        const now = date.getTime();
        let start = null;
        for (let e of x) {
            start = new Date($(e).ds("date"));

            $(e).text(humanDiff(date, start));
        }

    }

    public getCounts() {

        const ele = this.main.queryAll(".main[data-line]");



        return ele.length || 0;



        for (let x in this.types) {
            this.counts[x] = 0;
        }

        for (let x in this.counts) {
            const ele = this.main.queryAll(`.new[data-type='${x}']`);
            ele.forEach(element => {
                this.counts[x]++;
            });

        }

        return this.counts;

    }

    public createRow(message){

        const e = this.main.query(`.s${message.connected}`);
        const div = $.create("div").addClass("main").addClass("ID-" + message.id)
            .ds("id", message.id).ds("line", this.lineId).ds("type", message.type).ds("connected", message.connected);
            div.addClass("s"+message.connected).addClass((message.connected==1)?"connected":"disconnectes");

        div.on("click", () => {
            this.onread(message);
        });

        if(e){

            const parentNode = e.parentNode;
            parentNode.insertBefore(div.get(), e);
        }else{

            if(message.connected==1){

                this.ul.insertFirst(div);

            }else{

                this.ul.append(div);
            }

        }

        /*
        const divNO = this.ul.createFirst("div").addClass("main").removeClass("open").addClass("ID-" + message.id)
        .ds("id", message.id).ds("line", this.lineId).ds("type", message.type);
        div.addClass("s"+message.connected);
        div.on("click", () => {

            this.onread(message);
        });
        */
        div.create("div").text("+").addClass("btn-new").on("click", () => {
            div.toggleClass("open");

        });

        div.create("div").text(message.name || "");

        //const date = new Date();
        //const start = date.getTime();

        //div.create("div").text("Ahora").addClass("date").ds("date",date.toISOString()).ds("time", start);
        //div.create("div").addClass("delay").text(message.delay || "1");;

        div.create("div").text(message.message || "");
        div.create("div").addClass("type").ds("xtype", message.type).text(message.device_name || "");



        if (typeof (message.info) === "object") {
            const detail = div.create("div").addClass("detail");
            for (let x in message.info) {
                detail.create("span").text(x);
                detail.create("span").text(message.info[x]);
            }

        }




    }

    public deleteLine(e) {
        const parent = e.parentNode;
        parent.removeChild(e);
        $(parent).addClass("borrada");
        return;

        const ele = this.main.query(".main[data-line='${line}']");
        alert(line)
        if (ele) {
            ele.remove();
            alert(8)
        }

    }
}


