var S = (($) => {
	
	interface  InfoParam {
		async: boolean,
		panel:number,
		valid:boolean,
		confirm:string,
		params: object,
		//onsubmit:()=>void,
		window:{
			name:"",
			show:true,
			mode:"",
			title:"Basic Menu",
			set:{
				width:"400px",
				height:"600px;"
			}
		}
	};

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
		
		static msg:object = null;
		

		static winInit(info:any){
			for(let win of info){
				
				this._w[win.name] = new Float.Window(win);	
			}
		}
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
							this._e[x.panel][y.property] = y.value;
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
        
        static send(info/*:InfoParam*/){
			
			if(info.confirm && !confirm(info.confirm)){
				return false;
			}

			let panel;
			
			if(info.panel === undefined || panel <= 0){
				panel = this.defaultPanel;
			}else{
				panel = info.panel;
			}

			var f = this.getForm(panel);

            if(!f){
				
                f = this.addPanel(panel);
            }

			if(info.window ){
				let win;

				if(info.window.name && this._w[info.window.name]){
					win = this._w[info.window.name];

				}else if(this._w[info.panel]){
					win = this._w[info.panel];
				}else if(info.window.name){
					win = this._w[info.window.name] = this.createWindow(info.window);
					this._w[info.window.name].setBody(f);
					//this._w[info.window.name].show({left:"center",top:"middle"});
				
				}else{
					win = this._w[panel] = this.createWindow(info.window);
					this._w[panel].setBody(f);
					//this._w[panel].show({left:"center",top:"middle"});
				}
				if(info.window.caption){
					win.setCaption(info.window.caption);
				}
				if(info.window.mode){
					win.setMode(info.window.mode);
				}
				if(info.window.show === true){
					win.show();
				}else if(info.window.show === false){
					win.setVisible(false);
				}else if(info.window.show){
					win.show(info.window.show);
				}

				
			}

			
			if(info.valid === true && panel && this._e[panel] && this._e[panel].valid && !this._e[panel].valid()){
				return false;
			}

			if(panel && this._e[panel] && this._e[panel].onsubmit && !this._e[panel].onsubmit()){
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
            
            
			if(info.window){
				
				if(!this._w[panel]){
					//this._w[panel] = this.createWindow(info.window);
					//this._w[panel].setBody(f);
					//this._w[panel].show({left:"center",top:"middle"});
				}

				if(this._w[panel]){
					//this._w[panel].setBody(f);
					//this._w[panel].show({left:"center",top:"middle"});
					
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
				dataForm.append("__sg_panel", panel);
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
						
						this._w[p.panels[x].id].show();
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
							
							this.msg = new Float.Message(p.fragments[x]);
							this.msg.show({})
							break;
							
					}
				}
			}

			if(p.debug){

				for(let msg of p.debug){
					db (msg);
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
