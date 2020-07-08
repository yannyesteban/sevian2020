var WebSockect = (($) => {


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
	
	return Socket;

})(_sgQuery);

var Command = (($) => {
	class Command{
		id:any = "";
		panel:any = "";
		tag:string = "";

		grid:object = null;
		form:object = null;
		menu:object = null;

		panelCommand:object = null;
		panelBody:object = null;
		

		main:object = null;
		
		_form:object = null;
		_formCommand:object = null;
		_formBody:object = null;

		_ws:object = null;

		constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
			}
			let main = (this.id)? $(this.id): false;

			if(!main){
                main = $.create("div").attr("id", this.id);
			}
			this.main = main;
			this._create(main);

			this._ws = new WebSockect({});
			
		}
		_create(main:any){
			
			main.ds("gtType","command");
			main.addClass("gt-command");
			//main.text("Mis Comandos");
			
			

			if(this.form){
				this.form.target = main.id();
				this.form.parentContext =  this;
				
				this._form = new Form2(this.form);
			}
			
			this.panelCommand = main.create("div");
			this.panelBody = main.create("div");
			
		}

		setFormCommand(form){
			this.panelCommand.text("");

			form.target = this.panelCommand;
			form.parentContext =  this;
			this._formCommand = new Form2(form);
		}

		setGrid(grid){
			this.panelBody.text("");

			grid.target = this.panelBody;
			grid.parentContext =  this;
				
			this._formBody = new Grid2(grid);
		}
		
		setFormParams(form){
			this.panelBody.text("");

			form.target = this.panelBody;
			form.parentContext =  this;
				
			this._formBody = new Form2(form);
		}

		setData(data, page, totalPages){

			this._formBody.setData(data, page, totalPages);
			
			//this.grid.setPage(1);
			//this.grid.setPage(1);
			
		}
		setPage(page){
			this._formBody.pag.page = page;
			
			//this.grid.setPage(page);
		}
		
		getDetail(info:any){
			let inputs = this._formBody.getInputs();
			
			let str = "";
			let cmdValues = [];
			let _data = [];
			let n = 0;
            for(let i in inputs){
				
                if(inputs[i].ds("cmd")){
                   
                   _data.push(
					{
						"h_command_id":410,
						"param_id":inputs[i].ds("cmd"),
						"value":inputs[i].getValue(),
						"__mode_":inputs["param_mode"].getValue(),
						"__id_": n++
					});   
					
					
                }
                
			}
			this._formCommand.getInput("d").setValue(JSON.stringify(_data));
			

		}

		test(){
			alert("hello world!");
		}

		clearForm(){

		}

		valid(){
			
			this.getDetail({});
			return true;
		}

		connect(){
			this._ws.connect();
		}
		send(type:number=0){
			
			if(type == 1){
				let str1 = JSON.stringify({
					type:"get",
					deviceId: this._form.getInput('unit_idx').getValue()*1,
					deviceName: "2012000520",//;this.getDeviceName(),
					commandId: this._formCommand.getInput('command_idx').getValue()*1,
					unitId: this._form.getInput('unit_idx').getValue()*1,
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
					deviceId: this._form.getInput('unit_idx').getValue()*1,
					deviceName: "2012000520",//;this.getDeviceName(),
					commandId: this._formBody._mainForm.getInput("id").getValue()*1,
					unitId: this._form.getInput('unit_idx').getValue()*1,
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
                deviceId: this._form.getInput('unit_idx').getValue()*1,
                deviceName: "2012000520",//;this.getDeviceName(),
                commandId: this._formCommand.getInput('command_idx').getValue()*1,
                unitId: this._form.getInput('unit_idx').getValue()*1,
                comdValues: cmdValues,
                msg : str,
                name: "san carlos"
                //,
                //destino:this.deviceInfo[this.form2.getInput("device_id").getValue()].device_name

            });
			this._ws.send(str1);
		}
	}

	return Command;

})(_sgQuery);