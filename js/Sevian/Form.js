// JavaScript Document

if(!Sevian){
	var Sevian = {};
}

Sevian.Input = {};

(function(namespace, $, Tab, popup){
	/*$(document).on("wheel", function(event){
				
	});*/
	var tip = false;
	
	(function(){
		$(window).on("load", function(){
			var tipPopup = new popup({id:"yanny", className:"sg-tips-popup"});
			
			var _title = $.create("div").addClass("note-title");
			var _body = $.create("div").addClass("note-body");

			tipPopup.append(_title);	
			tipPopup.append(_body);			

			tip = {
				
				init: function(ref, title, body){
					return function(event){
						event.preventDefault();
						event.returnValue = false;
						event.cancelBubble = true;
						_title.text(title);
						_body.text(body);
						
						tipPopup.show({ref:ref, left:"front", top:"middle"});
						
					};	
				},
			};

		});
		
	}());
	
	var createInput = function(opt){
		
		if(opt.control){
			return new namespace.Input[opt.control](opt);
		}else{
			return new namespace.Input.Std(opt);
		}
	};
	
	var mixin = function(source, target){
		for(var x in source){
			if(source.hasOwnProperty(x)) {
				target[x] = source[x];
			}
		}
	};
	
	var Field = function(opt){
		
		this.id = false;
		this.name = false;
		this.value = "";
		
		this.caption = false;
		this.className = "";
		this.rules = false;
		this.control = "";
		this.input = {};
		
		//this.locate = {page:1};
		this.locateTab = false;
		this.locatePage = false;
		
		//this.id = false;
		this.target = false;
		this.main = false;
		
		this.mode = "";
		this.status = "";
		
		this.comment = false;
		
		this.useRow = true;
		
		
		
		for(var x in opt){
			if(this.hasOwnProperty(x)) {
				this[x] = opt[x];
			}
		}
		
		this._main = false;
		this._caption = false;
		this._body = false;
		this._input = false;
		
		this.create();
		
	};
	
	Field.prototype = {
		get: function(){
			return this._main;
			
		},
		
		create: function(){
			
			this.input.control = this.input.control || this.control;
			
			this.input.name = this.input.name || this.name;
			this.input.id = this.input.id || this.id;
			this.input.title = this.input.title || this.caption;
			this.input.value = this.input.value || this.value;
			this.input.default = this.input.default || this.default;
			
			this._input = createInput(this.input);
			
			if(!this.useRow){
				
				this._main = $(this._input.get());
				return true;
			}
			
			if(this.main){
				this._main = $(this.main);
				this._caption = $(this._main.query(".field-caption"));
				this._body = $(this._main.query(".field-input"));
				
			}else{
				this._main = $.create("div");
				this._main.addClass("field");
			}
			
			if(this.caption !== false){
				this.setCaption(this.caption);
			}

			if(!this._body){
				this._body = this._main.create("div").addClass("field-input");
			
			}
			
			if(!this._input.main){
				this._body.append(this._input.get());
			}

			if(this.comment){

				var btn = this._body.create("div").
					addClass("sg-tips-popup-btn").
					text(" ? ");
				
					btn.on("click", tip.init(btn.get(), this.caption, this.comment));

			}
		},
		
		setCaption: function(caption){
			if(!this._caption){
				this._caption = this._main.create("div");
				this._caption.addClass("caption");
				this._caption.addClass("td");
			}
			
			this._caption.text(caption);
		},
		getCaption: function(){
			return this._caption;
		},
		
		getInput: function(){
			return this._input;
		},
		
		setMode: function(mode){
			
			this._main.removeClass(this.mode);
			this._main.addClass(mode);
			this._main.ds("sgMenuMode", mode);
			
			this.mode = mode;
		},
		
		
		
		getMode: function(){
			return this.mode;	
		},
		
		setStatus: function(status){
			this._main.removeClass(this.status);
			this._main.addClass(status);
			this.status = status;
		},
		getStatus: function(){
			return this.status;
		},
		
		valid: function(){
			
			
		},
		
		
		
	};
	
	var Page = function(opt){
		
		this.type = "page";
		this.sgType = "sg-page";
		this.sgMain = "sg-page-main";
		
		this.id = false;
		this.name = false;
		this.target = false;
		this.className = false;
		this.caption = false;
		
		this._main = false;
		this._caption = false;
		this._body = false;
		
		for(var x in opt){
			if(this.hasOwnProperty(x)){
				this[x] = opt[x];
			}
				
		}
		
		
		
		if(opt){
			this.create();
		}
		
		
	};
	
	Page.prototype = {
		
		create: function(){
			
			if(this.main){
				this._main = $(this.main);
				this._caption = $(this._main.query(".caption"));
				this._body =  $(this._main.query(".body"));
				
				if(!this._body){
					this._body = this._main;
				}
				
			}else{
				this._main = $.create({
					tagName: "div",
					id: this.id,
					className: this.className
				});
			}
			
			if(!this._caption && this.caption){
				this.setCaption(this.caption);
			}
			
			if(!this._body){
				this._body = this._main.create({
					tagName: "div",
					className: "body"
				});
			}
			
			if(this.target){
				this._target = $(this.target);
				this._target.append(this._main);
			}
			
			this._main.ds("sgType",this.sgType);
			this._main.addClass(this.sgMain);
			
		},
		
		
		getType: function(){
			return this.type;	
		},
		
		get: function(){
			return this._main;	
		},
		
		getBody: function(){
			return this._body;	
		},
		
		appendTo: function(obj){
			obj.append(this._main);
		},
		
		setCaption: function(caption){
			if(!this._caption){
				this._caption = this._main.create("div");
				this._caption.addClass("caption");
			}
			
			this._caption.text(caption);
		},
		
		appendChild: function(e){
			this._body.append(e);	
		},
		append: function(e){
			this._body.append(e);	
		},
	};
	
	var Form = function(opt){
		Page.call(this);
		
		this.sgType = "sg-form";
		this.sgMain = "sg-form-main";
		
		this.id = false;
		this.name = false;
		this.className = false;
		this.target = false;
		
		this.form = false;
		
		this.fields = false;
		this._fields = [];
		
		this._last = false;
		this._lastPage = false;
		this._lastTab = false;
	
		this.fieldCount = 0;
		this.tabCount = 0;
		this.pageCount = 0;
		
		this.tabs = [];
		this.pages = [];
		
		this.onValid = function(){};
		this.onReset = function(){};
		this.onValue = function(){};
		this._main = false;
		
		for(var x in opt){
			if(opt.hasOwnProperty(x)){
				this[x] = opt[x];
			}
		}
		
		this.create();

	};

	Form.prototype = Object.create(Page.prototype);
	Form.prototype.constructor = Form;
	
	var _Form = {
		get: function(){
			return this._main;	
		},
		
		create: function(){
			Page.prototype.create.call(this);
			this.initPages();
			
			this._setPage(this._body, false, false);
			
			if(this.tabs){
				alert(88888)
				for(var x in this.tabs){
					if(this.tabs.hasOwnProperty(x)){
						this.addTab(this.tabs[x]);
					}
				}
			}
			if(this.fields){
				for(var x in this.fields){
					if(this.fields.hasOwnProperty(x)){
						this.addField(this.fields[x]);
					}
				}
			}
			
		},

		setValue: function(data){
			for(var name in data){
				if(this._fields[name]){
					this._fields[name].getInput().setValue(data[name]);
				}
			}	
		},
		
		reset: function(){
			for(var name in this.fields){
				if(this._fields.hasOwnProperty(name)){
					this._fields[name].getInput().reset();
				}
			}	
		},
		
		getValue: function(){
			var data = [];
			for(var name in this.fields){
				if(this._fields.hasOwnProperty(name)){
					data[name] = this._fields[name].getInput().getValue();
				}
			}
			return data;
		},
		
		getField: function(name){
			if(this._fields[name]){
				return this._fields[name];
			}
			return false;
		},
		
		addField: function(opt){
			var field = new Field(opt);
			
			if(field.input.name){
				this._fields[field.input.name] = field;
			}else{
				this._fields[this.fieldCount] = field;
			}
			this.fieldCount++;
			
			if(field.locatePage || field.locatePage >= 0){
				this._setLocate(opt.locatePage, field.locateTab);
			}
			
			field.locateTab = this._lastTab;
			field.locatePage = this._lastPage;
			
			if(!field.main){
				this.getPage().append(field.get());
			}
			
		},
		
		addInput: function(opt){
			opt.useRow = false;
			this.addField(opt);
		},
		
		setMain: function(){
			this._setPage(this._body, false, false);
		},
		
		setPage: function(index){
			this._setLocate(index, false);
		},
		addPage: function(opt){
			if(opt.locatePage || opt.locatePage >= 0){
				this._setLocate(opt.locatePage, opt.locateTab || false);
			}
			
			opt.target = this.getPage();
			this._page = new Page(opt);
			this._setPage(this._page, this.pageCount, false);
			
			this.pages[this.pageCount++] = this._page;
			
		},
		
		addTab: function(opt){
			if(opt.locatePage || opt.locatePage >= 0){
				this._setLocate(opt.locatePage, opt.locateTab || false);
			}
			
			opt.target = this.getPage();
			var tab = this._tab = new Tab(opt);
			this.lastTab = this.tabCount;
			this.tabs[this.tabCount++] = tab;
			return tab;
		},
		
		addTabPage: function(opt){
			var tabPage = this._tab.add(opt);
			
			this._lastPage = tabPage.iBody;
			
			this._setPage(tabPage.iBody, this._tab.item.length - 1, this.lastTab);
		},
		
		getPage: function(){
			return this._last;
		},
		
		_setLocate: function(pageIndex, tabIndex){
			if(pageIndex === -1){
				this.setMain();
			}else if(tabIndex >= 0 && this.tabs[tabIndex] && this.tabs[tabIndex].getPage(pageIndex)){
				this._setPage(this.tabs[tabIndex].getPage(pageIndex), pageIndex, tabIndex);
			}else if(pageIndex >= 0 && this.pages[pageIndex]){
				this._setPage(this.pages[pageIndex], pageIndex, false);
			}
			
		},
		_setPage: function(page, pageIndex, tabIndex){
			this._last = page;
			this._lastPage = pageIndex;
			this._lastTab = tabIndex;
		},
		
		valid: function(){
			var field = false,
				msg = false;
			for(var x in this._fields){
				
				if(this._fields[x].rules){
					
					field = this._fields[x];
					
					msg = namespace.Valid.send(field.rules, field.getInput().getValue(), field.caption, this.getValue());
					
					if(msg){
						
						field.setStatus("invalid");
						if(field.locateTab !== false){
							
							if(this.tabs[field.locateTab].item[field.locatePage]){
								this.tabs[field.locateTab].show(field.locatePage);
							}
						}
						
						alert(msg);
						field.getInput().focus();
						field.getInput().selectText();
						this.onValid(false);
						return false;
						
					}else{
						field.setStatus("valid");
					}
				}
				
			}
			this.onValid(true);
			return true;
		},
		
		initPages: function(){
			var f = this._main.queryAll(".sg-page-main");
			[].forEach.call(f, function(e, index){
				this.pages[index] = new Page({_main: $(e)});
			}, this);
			
			var t = this._main.queryAll(".sg-tab-main");
			[].forEach.call(t, function(e, index){
				this.tabs[index + 1] = new Tab({main: $(e)});
			}, this);
			
		},
		
	};
	
	
	mixin(_Form, Form.prototype);
	
	namespace.Form = Form;
	
	
}(Sevian, _sgQuery, Tab, sgPopup));