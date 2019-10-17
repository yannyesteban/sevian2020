var S = (($) => {
    let _winOptions = {
		visible: true,
		caption: "",
		x: "center",
		y: "middle",
		width: "auto",
		height: "auto",
		mode: "custom"
	};
    class Sevian{

        static _e:object[] = [];

        static init(info:object[]){
            for(var x of info){
                if(window[x.type]){
                    this._e[x.panel] = new window[x.type](x.option);
                }	
            }
        }

        static updatePanel(panels){
			for(let x of panels){
				if(this._e[x.panel]){
					for(let y of x.actions){
						if(y.property !== undefined){
							this._e[x.panel][y.prop] = y.value;
						}
						if(y.method !== undefined){
							if(y.args !== undefined){
								this._e[x.panel][y.method](...y.args);
							}else if(y.value !== undefined){
								this._e[x.panel][y.method](y.value);
							}
						}
					}
				}
			}
		}

        static getForm(id:number){
            return $().query("[data-sg-panel='"+id+"'],[data-type='panel']");
        }
        
        static send(info:object){
            


            

            

         
            let dataForm = null;
            let params = "";

            if(info.params){
				if(typeof(info.params) === "object"){
					params = JSON.stringify(info.params);
				}else{
					params = info.params;
				}
            }
            
            var f = this.getForm(info.panel);

            if(f){
                
            }

            let w = this.createWindow({

                caption:"hola"
            });
            w.setBody(f2.get());

            if(f){
				
				if(f.__sg_sw.value === f.__sg_sw2.value){
					if (f.__sg_sw.value != 1){
						f.__sg_sw.value = 1;
					}else{
						f.__sg_sw.value = 0;
					}
				}
				f.__sg_params.value = params;
				f.__sg_async.value = info.async? 1: 0;
				
				dataForm = new FormData(f);
				
			}else{
                
				dataForm = new FormData();
				dataForm.append("__sg_panel", info.panel);
				dataForm.append("__sg_ins", info.INS);
				dataForm.append("__sg_sw", info.SW);
				dataForm.append("__sg_params", params);
				dataForm.append("__sg_action", info.action || "");
				dataForm.append("__sg_async", true);
			}
            if(info.async){
				var ME = this;
				var ajax = new sgAjax({
					url: "",
					method: "post",
					form: dataForm,
					
					onSucess:(xhr) => {
						return this.requestPanel(JSON.parse(xhr.responseText));
					},

					onError: function(xhr){

					},
					waitLayer_:{
						class: "wait",
						target: f,
						message: false,
                        icon: ""
                    },

				});				
				
				
				ajax.send();
				return false;
			}else{
				f.submit();
				return false;
			}
           
        }

        static requestPanel(p){

			if(p.panels){
				for(var x in p.panels){
					sgJson.iPanel(p.panels[x]);
				}
			}
			if(p.config){
				this.init(p.config);
			}
			if(p.update){
				this.updatePanel(p.update);
			}
			if(p.fragments){
				for(var x in p.fragments){
					switch(p.fragments[x].token){
						case "fragment":
							sgJson.iFragment(p.fragments[x]);
							break;
						case "dataInput":
							sgJson.iDataInput(p.fragments[x]);
							break;
						case "propertyHTML":
							sgJson.iPropertyHTML(p.fragments[x]);
							break;
						case "objectData":
							sgJson.iFragment(p.fragments[x]);
							break;
						case "message":
							break;
					}
				}
			}
        }
        static createWindow(info){

            let _win = new sgWindow(info || _winOptions);

			
			return _win;
			
        }
        
        static addPanel(id:number){

            return $("#form_p1").create({
                'tagName': 'form',
                'action':'',
                'name':`form_p${id}`,
                'id':`form_p${id}`,
                'method': 'GET',
                'data-sg-panel': id,
                'data-sg-type': 'panel',
                'enctype': 'multipart/form-data'         
            });
           
        }
    }

    return Sevian;
})(_sgQuery);
