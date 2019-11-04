var S = (($) => {
	
    let _winOptions = {
		visible: true,
		caption: "",
		left: "center",
		top: "middle",
		//width: "500px",
		//height: "500px",
		mode: "custom"
	};
    class Sevian{

		static _e:object[] = [];
		static _w:object[] = [];
		static defaultPanel:any = 0;

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
            return $().query("form[data-sg-type='panel'][data-sg-panel='"+id+"']");
        }
        
        static send(info:object){
			

			if(info.confirm && !confirm(info.confirm)){
				return false;
			}

			let panel = info.panel;
			



			if(panel <= "0"){
				panel = this.defaultPanel;
			}

			if(info.valid !== false && panel && this._e[panel] && this._e[panel].valid && !this._e[panel].valid()){
				db ("error valid");
				return false;
			}

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

            if(!f){
                f = this.addPanel(info.panel);
            }
			if(info.window){
				if(!this._w[info.panel]){
					this._w[info.panel] = this.createWindow(info.window);
				}

				if(this._w[info.panel]){
					this._w[info.panel].setBody(f);
					this._w[info.panel].show({left:"center",top:"middle"});
					
				}

			}
				
            

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
					waitLayer:{
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
					if(this._w[p.panels[x].id]){
						this._w[p.panels[x].id].setCaption(p.panels[x].title);
					}else{
						if(this.defaultPanel == p.panels[x].id){
							document.title = p.panels[x].title;
						}

					}
					
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
			
			info.left = "center";
			info.top = "middle";
            let _win = new Float.Window(info || _winOptions);

			
			return _win;
			
        }
        
        static addPanel(id:number){

            let form = $().create({
                'tagName': 'form',
                'action':'',
                'name':`form_p${id}`,
                'id':`form_p${id}`,
                'method': 'GET',
                'enctype': 'multipart/form-data'         
			}).ds("sgPanel", id).ds("sgType", "panel");
			form.create({
				"tagName":"input",
				"type":"text",
				"name":"__sg_async"
			});
			
			form.create({
				"tagName":"input",
				"type":"text",
				"name":"__sg_params"
			});
			form.create({
				"tagName":"input",
				"type":"text",
				"name":"__sg_sw"
			});
			form.create({
				"tagName":"input",
				"type":"text",
				"name":"__sg_sw2"
			});
			

			return form.get();
           
        }
    }

    return Sevian;
})(_sgQuery);
