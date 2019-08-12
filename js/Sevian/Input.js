// JavaScript Document

if(!Sevian){
	
	var Sevian = {};
	
}

if(!Sevian.Input){
	
	Sevian.Input = {};
	
}

var ssInput = false;
(function(namespace, $){
	
	
	ssInput = function(opt){
		
		
		this.type = "";
		
		this.id = "";
		this.name = "";
		this.className = false;
		this.title = "";
		this.value = "";
		this.default = false;
		
		this.target = false;
		this.main = false;
		
		
		
		this.data = [];
		this.parent = false;
		this.propertys = {};
		this.style = {};
		this.events = {};
		this.rules = {};
		
		this.modeInit = 1;
		
		this.placeholder = false;
		
		this.status = "normal";
		this.mode = "request";		
		
		for(var x in opt){
			if(this.hasOwnProperty(x)){
				this[x] = opt[x];
			}
				
		}
		
		
		
		this._main = false;
		this._target = false;
		this.create();
		
		
	};
	
	ssInput.prototype = {
		
		get: function(){
			return this._main;
		},
		
		create: function(){
			
			if(this.main){
				this._main = $(this.main);
			}else{
				var opt = {};

				switch(this.type){
					case "text":
					case "password":
					case "hidden":
					case "button":
					case "submit":
					case "color":
					case "range":	
						opt.tagName = "input";
						opt.type = this.type;
						break;
					case "select":
						opt.tagName = this.type;
						break;
					case "multiple":
						opt.tagName = "select";
						this.propertys.multiple = "multiple";
						break;
					case "textarea":
						opt.tagName = this.type;
						break;
					default:
						opt.tagName = "input";
						opt.type = "text";

				}
				this._main = $.create(opt);
				
			}
			this.addClass(this.className);

			if(this.placeholder){
				this._main.get().placeholder = this.placeholder;	
			}
			
			for(var x in this.events){
				this.on(x, this.events[x]);
			}
			
			this._main.prop(this.propertys);
			this._main.style(this.style);
			
			if(this.type === "select" || this.type === "multiple"){
				this.createOptions(this.value, false);
			}
			
			this.setValue(this.value);
			
			this.setStatus(this.status);
			this.setMode(this.mode);
			
		},
		
		setValue: function(value){
			this._main.get().value = value;
		},
		getValue: function(){
			return this._main.get().value;
		},
		addClass: function(className){
			if(className){
				this._main.addClass(className);
			}
		},
		setClass: function(value){
			
		},
		getClass: function(){
			
		},
		
		on: function(event, fn){
			if(typeof(fn) === "function"){
				this._main.on(event, fn.bind(this));
			}else if(typeof(fn) === "string"){
				this._main.on(event, Function(fn).bind(this));
			}
		},
		off: function(event, fn){
			
		},
		
		getText: function(){
			if(this.type === "select"){
				return this._main.get().options[this._main.get().selectedIndex].text;	
			}
			return this._main.get().value;
		},
		
		readOnly:function(value){
			
		},
		
		disabled:function(value){
			
		},
	
		setStatus:function(value){
			this.status = value;
			this._main.ds("status", value);
		},	
		
		setMode:function(value){
			this.mode = value;
			this._main.ds("mode", value);
		},	
		
		show:function(value){
			
		},	
	
		focus:function(){
			this._main.get().focus();
		},	
		
		selectText: function(){
			if(this._main.get().select){
				this._main.get().select();
			}
			
			
		},
		
		setData:function(data){
			
		},
		
		reset: function(){
			if(this.default !== false){
				this.setValue(this.default);
			}
				
		},
		
		valid: function(){
			
			var result = valid.valid(this.rules, this.getValue(), this.title);
			
			if(result){
					
				this.focus();
				this.setStatus("invalid");
				return false;
			}else{
				this.setStatus("valid");
				
			}
			
			return true;
		},	
		
		createOptions: function(value, parentValue){
		
			var i = 0,
				option = false,
				vParent = [],
				_ele = this._main.get();
			
			_ele.length = 0;
			
			if(this.parent){
				var aux = (parentValue + "").split(",");
				for(i = 0; i < aux.length; i++){
					vParent[aux[i]] = true;
				}
			}
	
			if(this.placeholder){
				option = document.createElement("OPTION");
				option.value = "";
				option.text = this.placeholder;
				_ele.options.add(option);
			}
			
			for (i in this.data){
				if(vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*"){
					option = document.createElement("OPTION");
					option.value = this.data[i][0];
					option.text = this.data[i][1];
					_ele.options.add(option);
				}
			}
			
		},
		
	};
	
	namespace.InputStd = ssInput;
	
	namespace.Input.Std = ssInput;
	
}(Sevian, _sgQuery));

var ssDateInput = false;
(function(namespace, $, sgDate, Calendar, Window){
	
	
	var ssDateInput = function(opt){
		
		
		
		
		this.type = "calendar";
		
		this.id = "";
		this.name = "";
		this.className = false;
		this.title = "";
		this.value = "";
		this.default = false;
		
		this.target = false;
		
		this.format = "%yy-%mm-%dd";
		this.maskFormat = "%d/%m/%yy";
		
		
		
		this.data = [];
		this.parent = false;
		this.propertys = {};
		this.style = {};
		this.events = {};
		this.rules = {};
		
		this.modeInit = 1;
		
		this.placeholder = false;
		
		this.status = "normal";
		this.mode = "request";		
		
		this._popup = false;
		this._mask = false;
		
		for(var x in opt){
			if(opt.hasOwnProperty(x)){
				this[x] = opt[x];
			}
				
		}
		
		
		
		this._main = false;
		this._target = false;
		this.create();
		
		
	};
	
	//ssDateInput.prototype = Object.create(Calendar.prototype);
	//ssDateInput.prototype.constructor = ssDateInput;
	
	
	ssDateInput.prototype = {
		
		get: function(){
			return this._main;
		},
		
		
		setDate: function(date){
			
			//ME._mask.get().value = this.evalFormat(date.y, date.m, date.d, "%d/%m/%yy");
			this.setValue(sgDate.evalFormat(date.y, date.m, date.d, this.format));
		},
		
		createCalendar: function(target){
			
			var ME = this;
			
			var opt = {};
			
		
			this.cal = new Calendar({
				visible: true,
				target: target,
				onselectday: function(date){
					
					ME.setDate(date);
					if(ME._popup){
						ME._popup.hide();
					}
				}
			});	
			
		},
		
		createPopup: function(){
			
			
		
			this._popup = new Window({
				className: "alfa1",
				classImage: "clock",
				mode: "auto",
				visible: false,
				caption: this.title,
				autoClose: true,
				delay:0,
				//id: this.id,

			});
			
			this.createCalendar(this._popup.getBody());
			
			
		},
		
		createPicker: function(){
			
			
		},
		
		create: function(){
			
			if(this.main){
			
				this._main = $(this.main);
				this._input  = $(this._main.query(".input"));
				this._mask  = $(this._main.query(".mask"));
				//this._input.get().type = "hidden";
				
			}else{
				this._main = $.create("span");
				this._input = this._main.create({tagName: "input", type: "hidden"});
				
			}
			
			
			if(!this._mask){
				this._mask = this._main.create({tagName:"input", type:"text", placeholder:this.placeholder});
			
			}
			
			if(this.type === "calendar" || this.type === "text"){
				this.createPopup();
			}
			this.addClass(this.className);	
			var ME = this;
			this._mask.on("change", function(){
				var aux = sgDate.dateFrom(this.value, ME.maskFormat);
				
				if(aux.year === false){
					ME._input.get().value = this.value;
				}else{
					ME._input.get().value = sgDate.evalFormat(aux.year, aux.month, aux.day, ME.format);
				}
				
			});

			this._main.create({tagName:"input", type:"button"}).on("click", function(){
			
				var opt = {};
				opt.ref = this;
				opt.left = "front";
				opt.top = "middle";
				
				var aux = sgDate.dateFrom(ME._input.get().value, ME.format);
				if(aux.year === false){
					
					aux = {
						year:  (new Date()).getFullYear(),
						month: (new Date()).getMonth()+1,
						day: (new Date()).getDate()
					};
				}
					
				ME.cal.setCal(aux.year, aux.month, aux.day);
				ME._popup.setMode("auto");
				ME._popup.show(opt);
				
			});
		
			for(var x in this.events){
				this.on(x, this.events[x]);
			}
			
			var input = (this._mask)?this._mask:this._input;
			
			input.prop(this.propertys);
			input.style(this.style);
			
			if(this.type === "select"){
				this.createOptions(this.value, false);
			}
			
			this.setValue(this.value);
			
			this.setStatus(this.status);
			this.setMode(this.mode);
			
			if(this.target){
			
				$(this.target).append(this._main);	
			}
			
		},
		
		
		
		setValue: function(value){
			
			this._input.get().value = value;
			
			if(this._mask){
				var aux = sgDate.dateFrom(value, this.format);
				this._mask.get().value = sgDate.evalFormat(aux.year, aux.month, aux.day, this.maskFormat);
			}
			
		},
		getValue: function(){
			return this._input.get().value;
		},
		addClass: function(className){
			if(className){
				this._mask.addClass(className);
			}
		},
		setClass: function(value){
			
		},
		getClass: function(){
			
		},
		
		on: function(event, fn){
			
			if(typeof(fn) === "function"){
				this._mask.on(event, fn.bind(this));
			}else if(typeof(fn) === "string"){
				this._mask.on(event, Function(fn).bind(this));
			}
		},
		off: function(event, fn){
			
		},
		
		getText: function(){
			
		},
		
		readOnly:function(value){
			
		},
		disabled:function(value){
			
		},
	
		setStatus:function(value){
			this.status = value;
			this._main.ds("status", value);
		},	
		setMode:function(value){
			this.mode = value;
			
			this._main.ds("mode", value);
		},	
		
		show:function(value){
			
		},	
	
		focus:function(value){
			if(this._mask){
				this._mask.get().focus();
			}else{
				this._input.get().focus();
			}
			
		},	
	
		selectText: function(){
			if(this._mask){
				this._mask.get().select();
			}else{
				this._input.get().select();
			}
		},
		setData:function(data){
			
		},
		
		reset: function(){
			if(this.default !== false){
				this.setValue(this.default);
			}
				
		},
		
		valid: function(){
			
			var result = valid.valid(this.rules, this.getValue(), this.title);
			
			if(result){
					
				this.focus();
				this.setStatus("invalid");
				return false;
			}else{
				this.setStatus("valid");
				
			}
			
			return true;
			
			
		},	
		
		
		
	};
	
	//mixin(_prototype, ssDateInput.prototype);
	
	namespace.DateInput = ssDateInput;
	namespace.Input.DateInput = ssDateInput;
	
}(Sevian, _sgQuery, sgDate, sgCalendar, sgWindow));