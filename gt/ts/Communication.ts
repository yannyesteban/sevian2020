
var GTCommunication = (($) => {
   
	let n=0;

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
			
			

		}

		_create(main:any){
			this.main = main;
            main.addClass(this.mainClass);
            main.text("");
            main.removeDs("sgForm");
            main.removeClass("sg-form");

            this.mainPanel = main.create("div").addClass("mainPanel");
            this.menuPanel = main.create("div").addClass("menuPanel");
            this.historyPanel = main.create("div").addClass("historyPanel");

            this.mainForm.id = this.mainPanel;
            this.mainForm.parentContext =  this;
            this.form = new Form2(this.mainForm);
          
            
			
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
				]
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

        setFormCommand(info){
			this.menuPanel.text("");
            this.menuPanel.removeDs("sgForm");
            this.menuPanel.removeClass("sg-form");
            
			info.id = this.menuPanel;
			info.parentContext =  this;
			this._formCommand = new Form2(info);
		}
		
	}
	


    return Communication;
    
})(_sgQuery);