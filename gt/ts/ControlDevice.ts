var ControlDevice = (($) => {


    class GTSocket{

        url:string = null;
        socket:object = null;
        constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.url = "ws://127.0.0.1:3310";//= new WebSocket();



            
        }

        connect(){
            this.socket = new WebSocket(this.url);

            this.socket.onopen = this.onopen;
            this.socket.onmessage = this.onmessage;
            this.socket.onclose  = this.onclose ;
        }
        onclose (event){
            db ("on Close");
        }

        send(msg){
            this.socket.send(msg); 
        }
        onopen(event){
            db ("on OPEN")
        }
        onmessage(event){
            var server_message = event.data;
            db (server_message);
        }

    }

    class ControlDevice{
        panel:number = null;
        id:any = null;
        cmdData:any = null;
        clientData:any = null;
        paramForm:any = null;
        accountData:any = null;
        unitData:any = null;
        socket:object = null;
        form:any = null;
        form2:any = null;

        units:any[] = [];
        unitId:number = null;
        deviceId:number = null;
        commandId:number = 1200001;
        deviceName:string = "";
        deviceInfo:any = null;
        
        pageMenu: object = null;
        pageForm: object = null;

        _pageMenu: object = null;
        _pageForm: object = null;
        _tab: object = null;


        constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            this.socket = new GTSocket({});

            let main = (this.id)? $(this.id): false;
            
            if(main){
                
                if(main.ds("gtControlDevice")){
                    return;
                }
    
                if(main.hasClass("gt-control-device")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
            }

        }

        _create(main:any){
            main.addClass("gt-control-device");

            //let bar = main.create("div");
           
            let f = this.form2 = new Form({
                caption:"hello",
                parentContext: this,
                target:main,
                fields:[
                    {
                        input: "list",
                        config: {
                            type:"text",
                            name:"client_id",
                            caption:"Cliente",
                            data:this.clientData,
                            childs: true,
                            value:86
                        }
                    },
                    
                    {
                        input: "list",
                        config: {
                            type:"text",
                            name:"count_id",
                            caption:"Cuenta",
                            data: this.accountData,
                            parent:"client_id",
                            childs: true,
                            parentValue:86,
                            value:103,
                            propertys:{
                                
                            }
                        }
                    }
                    ,
                    {
                        input: "list",
                        config: {
                            type:"text",
                            name:"unit_id",
                            caption:"Unit",
                            parent:"count_id",
                            parentValue:'103',
                            value:2109,
                            data: this.unitData,
                            events:{
                                "change":function(){
                                    
                                    //const getFruit = infoData.find(fruit => fruit.unit_id === this.form2.getInput("unit_id").getValue());
                                    //console.log(infoData);
                                    this.setUnitId(this.form2.getInput("unit_id").getValue());
                                    
                                    this.setDeviceId(this.units[this.form2.getInput("unit_id").getValue()].device_id);
                                    this.setDeviceName(this.units[this.form2.getInput("unit_id").getValue()].device_name);
                                    
                                    this.form2.getInput("device_id").setValue(this.getDeviceId());


                                    S.send({
                                        async : true,
                                        panel: this.panel,
                                        params:[{
                                            t:"setMethod",
                                            id: this.panel,
                                            element:'gtControlDevice',
                                            method:"load_commands",
                                            eparams:{
                                                cmd: "",
                                                cmdId: "",
                                                unitId: 0,
                                                deviceId: this.getDeviceId(),
                                                
                                            }
                                        },
                                        {
                                            t:"setMethod",
                                            id: this.panel,
                                            element:'gtControlDevice',
                                            method:"h_commands",
                                            eparams:{
                                                cmd: "",
                                                cmdId: "",
                                                unitId: 0,
                                                deviceId: this.getDeviceId(),
                                                
                                            }
                                        }
                                    ]
                        
                                    });

                                   
                                    
                                }
                            }
                        }
                    },
                    {
                        input: "input",
                        config: {
                            type:"text",
                            name:"device_id",
                            caption:"device Id",
                            
                        }
                    }
                    

                ]


            });

            let d = $().create("input").attr("type","button").val("connect");

            d.on("click", (event)=>{
                this.socket.connect();
            });
            f.add(d);
            //let bar2 = main.create("div");

            let tab = this._tab = new Tab({
                target: main,
                pages:[
                    {
                        caption:"Parámetros",
                    },
                    {
                        caption:"Funciones"
                    },
                    {
                        caption:"Eventos",html:"Opps",
                    },
                    {
                        caption:"Identificación",html:"Cuatro"
                    },
               
                ]
            });



            let page = this.pageMenu = this._page0 = tab.getPage(0);
            page.id(this.id + "_tpage_0").addClass("gt-control-p1");
            //let bar3 = page.create("div");
            page.addClass("main_command");
            this._pageMenu = page.create("div").addClass("menu_command");
            this._pageForm = page.create("div").addClass("form_command");
            
            // page = tab.getPage(0);
            this.paramForm.target = page;
            this.paramForm.id= this.id+"_form_1";
            //let f2 = new Form(this.paramForm);
            /*
            this.nav = [
                ["uno"], ["dos"]
            ]
            items = [];
            for(let x in this.nav){
                items.push({
                    caption: this.nav[x][0],
                    
                    action: () => {
                        //act.params[0].eparams.cmd = this.nav[x][1];
                        
                        //S.send(act);
                    }
                })
            }


            let menu2 = new Menu({caption:"", target:page, items: items});
            */
        }
        _load(main:any){}

        loadMenuCommands(cmdData){
            this.cmdData = cmdData;

            let items = [];

            let act = {
                async : true,
                panel: this.panel,
                params:[{
                    t:"setMethod",
                    id: this.panel,
                    element:'gtControlDevice',
                    method:"load_cmd",
                    eparams:{
                        cmd: "",
                        cmdId: "",
                        unitId: 0,
                        deviceId: 0,
                        
                    }
                }]

            };

            for(let x in this.cmdData){
                items.push({
                    caption: this.cmdData[x][1],
                    action_: "db('"+this.cmdData[x][1]+"')",
                    action: () => {
                        
                        act.params[0].eparams.cmd = this.cmdData[x][1];
                        act.params[0].eparams.cmdId = this.cmdData[x][0];
                        act.params[0].eparams.deviceId = this.getDeviceId();
                        this.setCommandId(this.cmdData[x][0]);
                        S.send(act);
                    }
                })
            }

            this.pageMenu.addClass("HHHHHHH");
            this._pageMenu.text("");
            let menu = new Menu({caption:"", target:this._pageMenu, items: items});
        }

        loadCmdForm(f){
           
            
            //$(this.id+"_form_1").get().parentNode.removeChild($(this.id+"_form_1").get());

           
            //this._page0
            //$(this.id+"_form_1").text("");
            this._pageForm.text("");
            f.target = this._pageForm;
            //f.id = this.id+"_form_1";
            f.parentContext = this;
            let f2 = new Form(f);

            this.form = f2;
        }

        setDeviceInfo(info){

        }

        setUnitId(id){
            this.unitId = id;
        }
        getUnitId(){
            return this.unitId*1;
        }
        setCommandId(id){
            this.commandId = id;
        }
        getCommandId(){
            return this.commandId*1;
        }
        setDeviceId(id){
            this.deviceId = id;
        }
        getDeviceId(){
            return this.deviceId*1;
        }

        setDeviceName(name){
            this.deviceName = name;
        }
        getDeviceName(){
            return this.deviceName;
        }

        listCommands(){
            let page = this._tab.getPage(1);
            
        }

        sendCMD(){
            let inputs = this.form.getInputs();
            let str = "$WP+"+this.form.getInput("param_name").getValue()+"="+inputs["param_pass"].getValue();
            let cmdValues = [];
            for(let i in inputs){
                if(inputs[i].ds("cmd")){
                    
                   str += ","+inputs[i].getValue(); 
                   cmdValues.push(inputs[i].getValue());
                }
                
            }

            //str += ":"+this.deviceInfo[this.form2.getInput("device_id").getValue()].device_name;
            
            //let value = this.form.getInput("param_tag").getValue();

            let str1 = JSON.stringify({
                type:"set",
                deviceId: this.getDeviceId(),
                deviceName: "2012000520",//;this.getDeviceName(),
                commandId: this.getCommandId(),
                unitId: this.getUnitId(),
                comdValues: cmdValues,
                msg : str,
                name: "esteban"
                //,
                //destino:this.deviceInfo[this.form2.getInput("device_id").getValue()].device_name

            });
            db (str1, "pink")
            this.socket.send(str1);
        }

        sendCMD2(){
            let inputs = this.form.getInputs();
            let str = "$WP+"+this.form.getInput("param_name").getValue()+"="+inputs["param_pass"].getValue();
            let cmdValues = [];
            for(let i in inputs){
                if(inputs[i].ds("cmd")){
                    
                   str += ","+inputs[i].getValue(); 
                   cmdValues.push(inputs[i].getValue());
                }
                
            }

            //str += ":"+this.deviceInfo[this.form2.getInput("device_id").getValue()].device_name;
            
            //let value = this.form.getInput("param_tag").getValue();

            let str1 = JSON.stringify({
                type:"get",
                deviceId: this.getDeviceId(),
                deviceName: "2012000520",//;this.getDeviceName(),
                commandId: this.getCommandId(),
                unitId: this.getUnitId(),
                comdValues: cmdValues,
                msg : str,
                name: "esteban"
                //,
                //destino:this.deviceInfo[this.form2.getInput("device_id").getValue()].device_name

            });
            db (str1, "pink")
            this.socket.send(str1);
        }
    }
    
    return ControlDevice;
})(_sgQuery);