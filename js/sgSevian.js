// JavaScript Document

/*****************************************************************
Modificado: 12/08/2017
por: Yanny Nuñez
Version: 1.0
*****************************************************************/




if(!Sevian){
	var Sevian = {};
}


(function(namespace, $, sgWindow){
	var _p = [];
	
	var _winOptions = {
		visible: true,
		caption: "",
		x: "acenter",
		y: "amiddle",
		width: "240px",
		height: "240px",
		mode: "custom"
	};
	var divHidden = false;
	var _sgObject = function(type, opt){
		
		if(window[type]){
			return new window[type](opt);
		}else{
			return new _sgPanel(opt);
		}
		
		
	};
	
	
	$(window).on("load", function(){
		divHidden = $.create("div").style({"display":"none"});
		
		
		$("").append(divHidden);
	});
	
	var _sgPanel = function(opt){
		
		
		this.panel = 0;
		this.title = "default";
		for(var x in opt){
			
			this[x] = opt[x];
		}
		
		this._form = false;
		this._main = false;
		
		
		
		if($.byId("panel_p" + this.panel)){
			this._main = $("panel_p" + this.panel);
		}else{
			this._main = $.create({tagName:"div", id:"panel_p" + this.panel});
		}
		
		if($.byId("form_p" + this.panel)){
			this._form = $("form_p" + this.panel);
		}else{
			//this._main = $.create({tagName:"div", id:"panel_p" + this.panel});
		}
		
		
	};
	_sgPanel.prototype = {
		
		getForm: function(){

			if(this._form){
				return this._form.get();
			}else if(document.forms["form_p" + this.panel]){
				return document.forms["form_p" + this.panel];
			}else{
				return false;
			}
			
		},
		
		getDataForm: function(){
			
		},
		submit: function(){
			
			//db(this._form.name,"green")
			this._form.get().submit();	
		},
	
		send: function(){

		},
		
		focus: function(){
		
		},
		
		valid: function(opt){
			
		},
		
		setWindow: function(opt){
			//db("panel_p"+this.panel);
			//db($.byId("panel_p"+this.panel));
			
			//$.byId("panel_p"+this.panel).style.border = "2px solid red";
			this._win = new sgWindow(opt || _winOptions);
			this._win.setBody(this._main);
			
			return this._win;
			
		},
		getWindow: function(){
			
			return this._win;
			
		}
		
	};
	/*
	var opt = {
		async: true,
		panel: 4,
		form:"#form1",
		valid: false,
		confirm: "",
		params:[],
	}
	*/
	sevian = {
		
		INS: 0,
		SW: 0,
		mainPanel: 4,
		defaultFormMethod: "GET",

		mPanel:[],
		
		
		
		
		win: [],
		
		init: function(opt){
			
			var x = false;
			
			for(x in opt){
				
				this[x] = opt[x];
			}
			
			if(opt.request){
				
				this.requestPanel(opt.request);
				
			}
			
			if(opt.panels){
				this.initPanels(opt.panels);
				
				
			}
			
			if(opt.fragments){
				
				for(var x in opt.fragments){
					
					this.loadFragment(opt.fragments[x]);
				}
			}
			
		},
		updatePanel(panels){
			
			for(let x of panels){
				
				if(this.mPanel[x.panel]){
					for(let y of x.actions){
						if(y.property !== undefined){
							this.mPanel[x.panel][y.prop] = y.value;
						}
						if(y.method !== undefined){

							if(y.args !== undefined){
								this.mPanel[x.panel][y.method](...y.args);
							}else if(y.value !== undefined){
								this.mPanel[x.panel][y.method](y.value);
							}
							
						}
					}
				}
				
				
			}
		}, 
		initPanel: function(panels){
			for(var x of panels){
				
				if(window[x.type]){
					this.mPanel[x.panel] = new window[x.type](x.option);
				}	
			}

		},

		initPanels: function(panels){

			for(x in panels){
				
				this.setPanel(panels[x].panel, panels[x].type, panels[x].opt);
			}
		},
		
		loadFragment: function(fragment){
			
			sgFragment.evalJson(fragment);	
		},
		
		requestPanel: function(p){
			


			if(p.panels){
				for(var x in p.panels){
					
					sgJson.iPanel(p.panels[x]);
				}
			}

			if(p.config){
				this.initPanel(p.config);
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
			return;
			var isNew = false;
			
			for(var x in p){
				if(p[x].panel !== false){
					isNew = false;
					if(p[x].title && p[x].panel && p[x].panel == this.mainPanel){
						document.title = p[x].title;
					}

					if(!this.getPanel(p[x].panel)){
						isNew = true;
					}

					sgFragment.evalJson(p[x]);	

					if(isNew){

						$(p[x].targetId).style().display = "";
						this.newPanel(p[x].panel);

					}

					if(this.win[p[x].panel]){
						if(p[x].window){
							this.win[p[x].panel].setParams(p[x].window);
						}

						this.win[p[x].panel].show({});

					}
				}else{
					sgFragment.evalJson(p[x]);	
				}
					

				if(p[x].debug && sgDebug){

					sgDebug.console(p[x].debug);
					continue;
				}
				
				
			}
		},
		
		sgObject: function(type, opt){
			
			
			if(window[type]){
				return new window[type](opt);
			}else{
				
				return new _sgPanel(opt);
			}
		},
		
		setPanel: function(panel, type, opt){
			
			_p[panel] = this.sgObject(type, opt);
			
			if(panel === this.mainPanel && _p[panel].title){
				
				
				document.title = _p[panel].title;
			}
			
		},
		
		newPanel: function(panel){

			_p[panel] = new _sgPanel({panel:panel});
			//_p[panel].setWindow();
			
			//this.win[panel] = _p[panel].getWindow();
			return _p[panel];
		},
		
		getPanel: function(panel){
			
			if(_p[panel]){
				return _p[panel];
			}
			
			return false;
			
			
		},
		
		send: function(opt, obj){

			
			if(opt.confirm && !confirm(opt.confirm)){
				return false;
			}
			
			var panel = this.getPanel(opt.panel);
			
			if(opt.valid !== false && panel && panel.valid && !panel.valid(opt.valid)){
				//db ("error valid");
				//return false;
			}
			
			if(!panel){
				panel = this.newPanel(opt.panel);
			}
			
			var dataForm = false;
			var f = panel.getForm();
			
			if(opt.params){
				if(typeof(opt.params) === "object"){
					params = JSON.stringify(opt.params);
				}else{
					params = opt.params;
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
				f.__sg_async.value = opt.async? 1: 0;
				
				dataForm = new FormData(f);
				
			}else{
				dataForm = new FormData();
				dataForm.append("__sg_panel", opt.panel);
				dataForm.append("__sg_ins", this.INS);
				dataForm.append("__sg_sw", this.SW);
				dataForm.append("__sg_params", params);
				dataForm.append("__sg_action", opt.action || "");
				dataForm.append("__sg_async", true);
			}
			
			if(opt.async){
				var ME = this;
				var ajax = new sgAjax({
					url: "",
					method: "post",
					form: dataForm,
					
					onSucess:function(xhr){
						return ME.requestPanel(JSON.parse(xhr.responseText));
					},

					onError: function(xhr){

					},
					waitLayer:{
						class: "wait",
						target: f,
						message: false,
						icon: ""},

				});				
				
				
				ajax.send();
				return false;
			}else{
				panel.submit();
				return false;
			}
			
		},
		
				
		loadPanels: function(opt){
			
			for(var x in opt){
				
				this.setPanel(opt[x].panel, opt[x].type, opt[x].opt);
			}
			
		}
		
	};
		

	
	namespace.action = sevian;
	
	
})(Sevian, _sgQuery, sgWindow);


