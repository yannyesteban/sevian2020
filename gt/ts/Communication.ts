var GTCommunication = (($) => {
   
	let n=0;

    class Socket{

		url:string = '127.0.0.1';
		port:string = '3310';
        socket:object = null;
        constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            
        }

        connect(){
            this.socket = new WebSocket('ws://' + this.url + ':' + this.port);

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
			db ("on OPEN");
			
			let openMessage = JSON.stringify({
				type:"connect",
				clientName:"oper4",
				config:[]
                

            });

			this.send(openMessage)
        }
		
		onmessage(event){
			
            var server_message = event.data;
            db (server_message);
        }

    }
    class Communication{
		
        public id:any = null;
        public target:any = null;

        public mainClass:string = "gt-comm";
        public mainDS:string = "gtComm";
        
        private main:any = null;
        private mainForm:any = null;
        private mainPanel:any = null;
        private menuPanel:any = null;
        private historyPanel:any = null;

        private paramCommandId = "xxx1"; 
        private paramCommand = null;

        private _formCommand = null;
        private formCommandId = "formCommand";

        private _commandPanel:any = null;
        private commandPanelId:string = "gtcomm-panel-1";

        private _bodyPanel:any = null;
        private bodyPanelId:string = "gtcomm-panel-2";

        public _ws = null;
        
        private unitId:number = null;

        constructor(info){
			
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
			}
			
			let main = (this.id)? $(this.id): false;
            
            if(main){
            
                if(main.ds(this.mainDS)){
                    //return;
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                
			}
            this._create(main);
            this._ws = new Socket({});
			
			

		}

		_create(main:any){
			this.main = main;
            main.addClass(this.mainClass);
            main.text("");
            main.removeDs("sgForm");
            main.removeClass("sg-form");

            this.mainPanel = main.create("div").addClass("mainPanel");
            this._commandPanel = main.create("div").addClass("command-panel").id(this.commandPanelId);
            this._bodyPanel = main.create("div").addClass("body-panel").id(this.bodyPanelId);
            this._formCommand = main.create("div").addClass("formCommand").id(this.formCommandId);

            this.historyPanel = main.create("div").addClass("historyPanel").id("his");
            //this.paramCommandId = "xxx1";
            this.paramCommand = main.create("div").addClass("paramCommand").id(this.paramCommandId);

            this.mainForm.id = this.mainPanel;
            this.mainForm.parentContext =  this;
            this.form = new Form2(this.mainForm);
          
            if(this.unitId){
                this.loadUnit(this.unitId);
            }
			
        }
        test(){
            alert("Communication")
        }

        send(unitId:any){
            S.send({
				"async":true,
				"panel":4,
				"params":[
					{
						"t":"setMethod",
						"id":"99",
						"element":"gt-communication",
						"method":"unit-init",
						"name":"x",
						"eparams":{
							"a":'yanny',
                            "targetId":'x25',
                            "unitId":unitId,
						}

					}
                ],
                
			});
        }

        send2(unitId:any){
            S.send({
				"async":true,
				"panel":4,
				"params":[
					{
						"t":"setMethod",
						"id":"4",
						"element":"s-form",
						"method":"request",
						"name":"/form/brands",
						"eparams":{
							
						}

					}
				]
			});
        }
        test2(){
            
            let f  = this.form.getFormData();
            f.set("super","man");
            console.log(f);
            for(let [name, value] of f){
               // alert(name+": "+value);
            }
            //this._formCommand.text("ddd");
            S.send3({
                "async":1,
                "form":f,
                //id:4,
                
				
				"params":[
                    {
                        "t":"setMethod",
                        'mode':'element',
						"id":this.formCommandId,
						"element":"form",
						"method":"request",
						"name":"/forms/gt/form_command",
						"eparams":{
							"a":'yanny',
                            "mainId":this.formCommandId,
                            "unitId":5555555,
						}

                    },
					{
                        "t":"setMethod",
                        'mode':'element',
						"id":"his",
						"element":"form",
						"method":"list",
						"name":"/form/h_commands",
						"eparams":{
							"a":'yanny',
                            "mainId":'his',
                            "unitId":5555555,
						}

                    },
                    {
                        "t":"setMethod",
                        'mode':'element',
						"id":"his2",
						"element":"h-command",
						"method":"request",
						"name":"/form/h_commands",
						"eparams":{
							"a":'yanny',
                            "mainId":'his2',
                            "unitId":5555555,
						}

                    }
                ],
                onRequest:(x)=>{
                   // alert(x)
                }
			});

        }

        loadUnit(unitId){
            let f  = this.form.getFormData();
            
            S.send3({
                "async":1,
                "form":f,
                //id:4,
               
				
				"params":[
                    {
                        "t":"setMethod",
                        'mode':'element',
						//"id":this.formCommandId,
						"element":"gt-communication",
						"method":"load-unit",
						"name":"",
						"eparams":{
							"a":'yanny',
                            //"mainId":this.formCommandId,
                            "unitId":unitId,
						}

                    },
                    {
                        "t":"setMethod",
                        'mode':'element',
						"id":this.commandPanelId,
						"element":"form",
						"method":"request",
						"name":"/gt/forms/form_command",
						"eparams":{
							"a":'yanny',
                            "mainId":this.commandPanelId,
                            "unitId":5555555,
						}

                    },
					{
                        "t":"setMethod",
                        'mode':'element',
						"id":this.bodyPanelId,
						"element":"form",
						"method":"list",
						"name":"/gt/forms/h_commands",
						"eparams":{
							"a":'yanny',
                            "mainId":this.bodyPanelId,
                            "unitId":5555555,
						}

                    }
                ],
                onRequest:(x)=>{
                    
                    S.getElement(this.commandPanelId).setContext(this);
                    
                   // alert(x)
                }
			});
        }

        uTest(){
            alert("Comunication.ts");
        }
        setFormCommand(info){
			this.menuPanel.text("");
            this.menuPanel.removeDs("sgForm");
            this.menuPanel.removeClass("sg-form");
            
			info.id = this.menuPanel;
			info.parentContext =  this;
			this._formCommand = new Form2(info);
        }

        paramLoad(commandId){
            let unitId = this.form.getInput("unit_idx").getValue();

            let f  = this.form.getFormData();
            S.send3({
                "async":1,
                "form":f,
                //id:4,
                
				
				"params":[
                    
                    {
                        "t":"setMethod",
                        'mode':'element',
						"id":this.bodyPanelId,
						"element":"h-command",
						"method":"request",
						"name":"/form/h_commands",
						"eparams":{
							"a":'yanny',
                            "mainId":this.bodyPanelId,
                            "unitId":unitId,
                            "commandId":commandId
						}

                    }
                ],
                onRequest:(x)=>{
                    //S.getElement(this.commandPanelId).setContext(this);
                    S.getElement(this.bodyPanelId).setContext(this);
                   // alert(x)
                }
			});
        }
        
        getConfigParam(commandId){


            let unitId = this.form.getInput("unit_idx").getValue();
            

            let f  = this.form.getFormData();
            S.send3({
                "async":1,
                "form":f,
                //id:4,
                
				
				"params":[
                    
                    {
                        "t":"setMethod",
                        'mode':'element',
						"id":this.bodyPanelId,
						"element":"h-command",
						"method":"load-config",
						"name":"/form/h_commands",
						"eparams":{
							"a":'yanny',
                            "mainId":this.bodyPanelId,
                            "unitId":unitId,
                            "commandId":commandId
						}

                    }
                ],
                onRequest:(x)=>{
                    //S.getElement(this.commandPanelId).setContext(this);
                    S.getElement(this.bodyPanelId).setContext(this);
                   // alert(x)
                }
			});
        }
        
        loadHistory(){
            let unitId = this.form.getInput("unit_idx").getValue();

            let f  = this.form.getFormData();
            S.send3({
                "async":1,
                "form":f,
                //id:4,
                
				
				"params":[
                    
                    {
                        "t":"setMethod",
                        'mode':'element',
						"id":this.bodyPanelId,
						"element":"form",
						"method":"list",
						"name":"/gt/forms/h_commands",
						"eparams":{
							"a":'yanny',
                            "mainId":this.bodyPanelId,
                            "unitId":5555555,
						}

                    }
                ],
                onRequest:(x)=>{
                    //S.getElement(this.commandPanelId).setContext(this);
                    S.getElement(this.bodyPanelId).setContext(this);
                   // alert(x)
                }
			});
        }

        getDetail(){
            //let inputs = this._formBody.getInputs();
            
            let inputs = S.getElement(this.bodyPanelId).getInputs(this);
			
			let str = "";
			let cmdValues = [];
			let _data = [];
			let n = 0;
            for(let i in inputs){
				
                if(inputs[i].ds("cmd")){
                   
                   _data.push(
					{
						"h_command_id":'',
						"param_id":inputs[i].ds("cmd"),
						"value":inputs[i].getValue(),
						"__mode_":inputs["param_mode"].getValue(),
						"__id_": n++
					});   
					
					
                }
                
            }
            S.getElement(this.bodyPanelId).getInput('_detail').setValue(JSON.stringify(_data));
            //console.log(JSON.stringify(_data));
			//this._formCommand.getInput("d").setValue(JSON.stringify(_data));
			

        }
        getUnitId(){
            return this.form.getInput("unit_idx").getValue()*1;
        }
        getCommandId(){
            return S.getElement(this.commandPanelId).getInput("command_idx").getValue()*1;

        }
        save(commandId){
            this.getDetail();

            let unitId = this.form.getInput("unit_idx").getValue();

            let f  = S.getElement(this.bodyPanelId).getFormData();
            S.send3({
                "async":1,
                "form":f,
                //id:4,
                
				
				"params":[
                    
                    {
                        "t":"setMethod",
                        'mode':'element',
						"id":this.bodyPanelId,
						"element":"h-command",
						"method":"save",
						"name":"/form/h_commands",
						"eparams":{
							"a":'yanny',
                            "mainId":this.bodyPanelId,
                            "unitId":unitId,
                            "commandId":commandId
						}

                    }
                ],
                onRequest:(x)=>{
                    //S.getElement(this.commandPanelId).setContext(this);
                    S.getElement(this.bodyPanelId).setContext(this);
                   // alert(x)
                }
			});
        }

        connect(){
			
			this._ws.connect();
		}

        s(type:number=0){

            let commandId = this.getCommandId();
			let unitId = this.getUnitId();
			if(type == 1){
				let str1 = JSON.stringify({
					type:"get",
					deviceId: 1,
					deviceName: "2012000520",//;this.getDeviceName(),
					commandId: commandId,
					unitId: unitId,
					comdValues: [],
					msg : "yanny",
					name: "caracas"
					//,
					//destino:this.deviceInfo[this.form2.getInput("device_id").getValue()].device_name
	
				});
				this._ws.send(str1);
				return;
			}else if(type == 2){
				
				let str1 = JSON.stringify({
					type:"h",
					deviceId: 1,
					deviceName: "2012000520",//;this.getDeviceName(),
					commandId: commandId,
					unitId: unitId,
					comdValues: [],
					msg : "yanny",
					name: "valencia"
					//,
					//destino:this.deviceInfo[this.form2.getInput("device_id").getValue()].device_name
	
				});
				this._ws.send(str1);
				return;
			}

			
			let inputs = this._formBody.getInputs();
            let str = "$WP+"+this._formBody.getInput("command_name").getValue()+"=0000";
            let cmdValues = [];
            for(let i in inputs){
                if(inputs[i].ds("cmd")){
                    
                   str += ","+inputs[i].getValue(); 
                   cmdValues.push(inputs[i].getValue());
                }
                
			}
			
			let str1 = JSON.stringify({
                type:"set",
                deviceId: 1,
                deviceName: "2012000520",//;this.getDeviceName(),
                commandId: commandId,
				unitId: unitId,
                comdValues: cmdValues,
                msg : str,
                name: "san carlos"
                //,
                //destino:this.deviceInfo[this.form2.getInput("device_id").getValue()].device_name

            });
			this._ws.send(str1);
		}
	}
	


    return Communication;
    
})(_sgQuery);