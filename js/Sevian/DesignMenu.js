// JavaScript Document
if(!Sevian){
	var Sevian = {};
}
if(!Sevian.Input){
	Sevian.Input = {};
}
var sgDesignMenu = false;
var m1;
(function(namespace, $){
	//alert(9)
	var dragItem = false;
	var dragObj = false;
	
	var dragStart = function(main){
	
		return function(event){
			
			if(main.type === "item"){
				main.obj.addClass("drag-start");
				event.dataTransfer.setData("text","");
				dragObj = main;
			}
			
		};
	};
	var dragEnd = function(main){
		
		return function(event){
			//opt.obj.removeClass("drag-start");
			
			
			if(main.type === "item"){
				main.obj.removeClass("drag-start");
			}
			dragObj = false;
		};
	};
	var dragOver = function(main){
		return function(event){
			
			if(main.obj.ds("dmModeItem") === "new" && dragObj && dragObj.type === "item"){
				return false;
			}
			if(dragObj && main.menuName !== dragObj.menuName){
			
				return false;
			}
			
			event.preventDefault();
			
			
			
			
			if(dragObj && (dragObj.type === "item") && main.type === "item"){
				
				var hand = main.item.getHand();
				var rect = hand.get().getBoundingClientRect();
				var diff = event.clientY - rect.top;
				//opt.obj.addClass("ul_over");
				if((diff) < this.offsetHeight / 2){
					hand.addClass("effect-up");
					hand.removeClass("effect-down");
				}else{
					hand.addClass("effect-down");
					hand.removeClass("effect-up");
				}
			}
			
				
			
		};
	};
	var dragLeave = function(opt){
		return function(event){
			
			//this.style.border = "1px solid green" ;
			if(dragObj && dragObj.type == "item"){
				opt.hand.removeClass("effect-down");
				opt.hand.removeClass("effect-up");
				//opt.obj.removeClass("ul_over");
			}
		};
	};
	var dragEnter = function(opt){
		return function(event){
			event.preventDefault();
		};
	};
	var drop = function(main){
		return function(event){
			event.preventDefault();
			
			if(dragObj && main.menuName !== dragObj.menuName){
				return false;
			}
			if(main.obj.ds("dmModeItem") === "new" && dragObj && dragObj.type === "item"){
				return false;
			}
			
			if(main.type === "submenu" && dragObj){
				
				main.menu.append(dragObj.obj);
				if(main.ondrop){
					main.ondrop(dragObj);		
				}
				main.obj.removeClass("ul_over");
				event.stopPropagation();
			}
			
			if(main.type === "submenu"){
				return false;
			}
			
			if(dragObj === false){
				
				if(event.dataTransfer.getData("text") !== ""){
					if((event.dataTransfer.getData("text")).match(/\.(png|gif|svg|jpg)$/i)){
						main.item.getImage().attr("src", event.dataTransfer.getData("text"));
					}else{
						main.item.getAction().attr("title",event.dataTransfer.getData("text"))
							.ds("dmAction", event.dataTransfer.getData("text"))
							.addClass("data-action");
					}
					if(main.ondrop){
						main.ondrop(dragObj);		
					}
					return false;
				}
			}
			if(dragObj && dragObj.type === "item" && main.type === "item"){
				
				var hand = main.hand;
				var rect = hand.get().getBoundingClientRect();
				var diff = event.clientY - rect.top;
				
				var target = main.obj.get().parentNode;
				main.obj.removeClass("ul_over");
				if((diff) < this.offsetHeight / 2){
					target.insertBefore(dragObj.obj.get(), main.obj.get());
				}else{
					target.insertBefore(dragObj.obj.get(), main.obj.get().nextSibling);
				}
				main.hand.removeClass("effect-down");
				main.hand.removeClass("effect-up");
				if(main.ondrop){
					main.ondrop(dragObj);		
				}
				
			}
			
		};
	};
	
	var _item = function(opt){
		
		this.index = false;
		this.parent = false;
		this.caption = false;
		this.action = false;
		this.image = false;
			
		this.type = "item";
		this.mode = "normal";
		//this.index = false;
		
		this.target = false;
		this._target = false;
		this.oncheck = false;
		this.ondeleteimg = false;
		this.ondeleteaction = function(){};
		this.onchange = function(){};
		for(var x in opt){
			
			if(opt[x] !== null){
				this[x] = opt[x];
			}
			
		}
		
		if(this.target){
			this._target = $(this.target);
		}
		
		this.create();
	};
	
	
	_item.prototype = {
		
		get: function(){
			return this._main;
		},
		
		create: function(){
			
			this._main = $.create("li").ds("dmIndex", this.index)
				.ds("dmTypeItem", this.type)
				.ds("dmModeItem", this.mode);
			
			
			this._option = this._main.create("span").addClass("item-option")
				.attr("draggable", true)
			;
			
			this._option
				.on("dragstart", dragStart(
					{
						type: this.type,
						obj: this._main,
						menuName: this.menuName,
						
					}
				))
				.on("dragend", dragEnd(
					{
						type: this.type,
						obj: this._main,
						hand: this._option,
						
					}
				))
				.on("dragover", dragOver(
					{
						type: this.type,
						obj: this._main,
						item: this,
						mode: this.mode,
						menuName: this.menuName,
					}
				))
				.on("dragleave", dragLeave(
					{
						type: this.type,
						obj: this._main,
						item: this,
						hand: this._option,
					}
				))
				.on("dragenter", dragEnter(
					{
						type: this.type,
						obj: this._main,
					}
				))
				.on("drop", drop(
					{
						type: this.type,
						obj: this._main,
						menu: this._menu,
						hand: this._option,
						item: this,
						mode: this.mode,
						menuName: this.menuName,
						ondrop: $.bind(this.ondrop, this),
					}
			));
			
			
			
			this._main
				.on("dragover", function(event){
					$(this).addClass("ul_over");
					event.stopPropagation();
				})
				.on("dragleave", function(event){
					$(this).removeClass("ul_over");
				})
				.on("drop", function(event){
					event.preventDefault();
					event.stopPropagation();
					
					$(this).removeClass("ul_over");
				});
			
			this._check = this._option.create("input").prop({"type": "radio", name: this.chkName, value:this.index})
			.on("change", this.oncheck({
				index: this.index,
				menuName: this.menuName,
				obj: this._main,
				menu: this._menu,
				hand: this._option,
				item: this,
			}));
			
			
			this._image = this._option.create("img").attr("src", this.image)
				.on("dblclick", this.ondeleteimg)
				.on("dragstart", dragStart({}));
			
			
			var option = this._option;
			this._text = this._option.create("input").attr("type", "text").value(this.caption)
				.on("change", this.onchange).on("dblclick", function(){
					this.select();
				})
				.on("mouseover", function(){
				$.unSelect();
				//this.setSelectionRange(this.value.length, this.value.length);
				
			});
			this._add = this._option.create("span").text("+").addClass("item-add").on("click", $.bind(this.onnew, this));
			this._remove = this._option.create("span").text("-").addClass("item-remove").on("click", $.bind(this.onremove, this));
			this._action = this._option.create("span").addClass("item-action").ds("dmAction", this.action).attr("title", this.action).text("")
				.on("dblclick", this.ondeleteaction);
			if(this.action){
				this._action.addClass("data-action");
			}
			
			this._menu = this._main.create("ul").addClass("submenu");
			this._menu.on("drop", drop({
					type: 'submenu',
					hand: this._option,
					obj: this._main,
					menu: this._menu,
					menuName: this.menuName,
					ondrop: $.bind(this.ondrop, this), mode: this.mode}))
				.on("dragover", function(event){event.preventDefault();});
			
			
			
			if(this._target){
				this._target.append(this._main);
			}
			
		},
		getMenu: function(){
			return this._menu;
		
		},
		
		getHand: function(){
			return this._option;
		},
		
		getImage: function(){
			return this._image;
		},
		getAction: function(){
			return this._action;
		},
		remove: function(){
			if(this.get().ds("dmModeItem") !== "new"){
				
				this.get().get().parentNode.removeChild(this.get().get());
			
			}
		},
		
		
		addOption: function(opt){
			var btn = false;
			if(this._option){
				btn = this._option.create(opt.tagName || "span").text(opt.text || "").addClass(opt.className || false);
				for(var x in opt.events){
					if(opt.events.hasOwnProperty(x)){
						btn.on(x, $.bind(opt.events[x], this));
					}
				}
			}
		}
	};
	
	
	
	
	var DesignMenu = function(opt){
		
		this.target = false;
		this.main = false;
		
		
		this.type = "";
		
		this.id = "";
		this.name = "";
		
		this.className = false;
		this.title = "";
		this.value = "";
		this.default = false;
		
		
		
		
		this.data = [];
		this.parent = false;
		this.propertys = {};
		this.style = {};
		this.events = {};
		this.rules = {};
		
		this.oncheck = function(opt){
			
			return function(){
				db(opt.index);
			};
			
			
		};
		
		this.modeInit = 1;
		
		this.placeholder = false;
		
		this.status = "normal";
		this.mode = "request";
		
		
		this._menu = false;
		
		this.length = 0;
		for(var x in opt){
			if(opt.hasOwnProperty(x)){
				this[x] = opt[x];
			}
			
		}
		this.input = false;
		this._item = [];
		this._target = $(this.target);
		this.create();
		
	};
	
	DesignMenu.prototype = {
		create: function(){
			var ME = this;
			
			this.length = 0;
			this._item = [];
			
			if(!this._main){
				this._main = $.create("div");
			}
			
			
			this._main.addClass("design-menu").addClass(this.className);
			this._input = this._main.create("input").attr("type", "hidden").attr("name", this.name);
			
			
			if(this.target){
				this._target = $(this.target);
				this._target.append(this._main);
			}
			var opt = {
				target: this._main.create("ul"),
				caption: this.caption,
				chkName : this.name + "_chk",
				type: "caption",
				mode: "caption",
				menuName: this.name,
				oncheck: this.oncheck,
				ondrop: function(dragObject){
					
					
					if(dragObject && dragObject.obj.ds("dmModeItem") === "new"){
						dragObject.obj.ds("dmModeItem", "normal");
						ME.addNewItem();
					}
					if(dragObject){
						dragObject.obj.addClass("drop-end");
					}
					ME.getCode();
				},
				
				onnew: function(){
					if(this.get().ds("dmModeItem") !== "new"){
						ME._newItem.get().ds("dmModeItem", "normal");
						
						ME._newItem.get().addClass("drop-end");
						this._menu.append(ME._newItem.get());
						ME.addNewItem();
					}
					ME.getCode();
				},
				onremove: function(){
					//this.remove();
				},
				ondeleteimg: function(){
					this.src = "";
					ME.getCode();
				},
				onchange: function(){
					
					ME.getCode();
				},
				
				
			};
			this.item = new _item(opt);
			this.item.addOption({
				text:"R", 
				events: {
					click: function(){
						ME.reset();
					}
					
					
			}});
			
			this._menu = this.item._menu;
			this.loadItems(this.data);

			this._main.create("div").addClass("delete-zone").text("DELETE")
				.on("dragover", function(event){
					if(dragObj && dragObj.obj.ds("dmModeItem") !== "new" && dragObj.type === "item"){
						event.preventDefault();
					}
					return false;
				})
				.on("drop", function(event){
					event.preventDefault();
				
					if(dragObj && dragObj.obj.ds("dmModeItem") !== "new" && dragObj.type === "item"){
						dragObj.obj.get().parentNode.removeChild(dragObj.obj.get());
						ME.getCode();
					}
					
				});
			
		},
		
		loadItems: function(data){
			this.length = 0;
			this._item = [];
			
			this._menu.text("");
			for(var x in data){
				this.add(data[x]);
			}	
			if(!this.newUL){
				this.newUL = this._main.create("ul").addClass("new-item");
			}else{
				this._newItem.get().get().parentNode.removeChild(this._newItem.get().get());
			}
			this.addNewItem();
			this.getCode();
			
		},
		addNewItem: function(){
			this._newItem = this.add({target:this.newUL, mode: "new", caption:"New Item "+(this.length + 1), index:this.length});
		},
		
		add: function(opt){
			var main = false;
			
			if(opt.target){
				main = opt.target;
			}else if(opt.parent !== false && opt.parent !== undefined){
				main = this._item[opt.parent].getMenu();
			}else{
				main = this._menu;
			}
			var ME = this;
			//db(opt.caption+"....", "green")
			this._item[opt.index] = new _item({
				target: main,
				index: (opt.index === false || opt.index === undefined)? this.length : opt.index,
				parent: opt.parent,
				id: this.name + "_i" + opt.index,
				caption: opt.caption,
				chkName: this.name + "_chk",
				menuName: this.name,
				menu: this,
				action: opt.action || "",
				image: opt.image || "",
				type: opt.type || null,
				mode: opt.mode || null,
				oncheck: this.oncheck,
				ondrop: function(dragObject){
					
					
					if(dragObject && dragObject.obj.ds("dmModeItem") === "new"){
						dragObject.obj.ds("dmModeItem", "normal");
						ME.addNewItem();
					}
					
					if(dragObject){
						dragObject.obj.addClass("drop-end");
					}
					
					ME.getCode();
				},
				
				onnew: function(event){
					if(this.get().ds("dmModeItem") != "new"){
						ME._newItem.get().ds("dmModeItem", "normal");
						ME._newItem.get().addClass("drop-end")
						this._menu.append(ME._newItem.get());
						ME.addNewItem();
					}
					ME.getCode();
				},
				onremove: function(event){
					this.remove();
					ME.getCode();
				},
				ondeleteimg: function(){
					this.src = "";
					ME.getCode();
				},
				ondeleteaction: function(){
					
					
					$(this).ds("dmAction", "").removeClass("data-action");
					
					ME.getCode();
				},
				
				onchange: function(){
					
					ME.getCode();
				},
				
			});
			
			
			this.length++;
			return this._item[opt.index];
			
		},
		
		
		getItems: function(node){
			
			var childs = node.queryAll("li");
			var n = childs.length;
			var 
				a = [],
				item = false,
				_index = false,
				_parent = false;
			this.recount = false;
			for(var i = 0; i < n; i++){
				
				
				
				if(this.recount){
					$(childs[i]).ds("dmNewIndex", i);
					
					
					_parent = $(childs[i].parentNode.parentNode).ds("dmNewIndex");
					
					if(_parent === undefined){
						_parent = false;
					}
					
					item = {
						index: $(childs[i]).ds("dmNewIndex"),
						parent: _parent,
						caption: $(childs[i]).query("input[type='text']").value,
						image: $(childs[i]).query("img").getAttribute("src"),
						action: $(childs[i]).query(".item-action").dataset.dmAction,
					};
					
				}else{
					item = {
						index: $(childs[i]).ds("dmIndex"),
						parent: $(childs[i].parentNode.parentNode).ds("dmIndex") || false,
						caption: $(childs[i]).query("input[type='text']").value,
						image: $(childs[i]).query("img").getAttribute("src"),
						action: $(childs[i]).query(".item-action").dataset.dmAction,
					};
				
				}
				
				
				
				a.push(item);
			}
			//this._input.value(JSON.stringify(a));
			return a;
		},
		
		reset: function(){
			this.loadItems(this.data);
		},
		
		getCode: function(){
			
			var request = {
				caption:this.item.get().query("input[type='text']").value,
				image: this.item.get().query("img").getAttribute("src"),
				items: this.getItems(this._menu),
			}
			this._input.value(JSON.stringify(request));
			
		
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
		
		getSelectedItem: function(){
			
			var s = this._main.query("input[type='radio']:checked");
			
			db(s.value)
			
		},
		
		setData:function(data){
			
		},
		
		resetUNO: function(){
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
	
	Sevian.Input.DesignMenu = DesignMenu;
	sgDesignMenu = DesignMenu;
	
}(Sevian.Input, _sgQuery));

function loadMenu(){
	var $ = _sgQuery;
	alert(999)
	
	var data = [
		
		{index:0, parent: false, caption: "cero", action:false},
		{index:1, parent: false, caption: "uno", action:false},
		{index:2, parent: false, caption: "dos", action:false},
		{index:3, parent: false, caption: "tres", action:false},
		{index:4, parent: 0, caption: "cuatro", action:false},
		{index:5, parent: false, caption: "cinco", action:false},
		{index:6, parent: false, caption: "seis", action:false},
		{index:7, parent: false, caption: "siete", action:false},
		{index:8, parent: 5, caption: "ocho", action:false},
		{index:9, parent: 5, caption: "nueve", action:false},
		{index:10, parent: 5, caption: "diez", action:false},
		{index:11, parent: 9, caption: "once", action:false},
		{index:12, parent: 9, caption: "doce", action:false},
		{index:13, parent: 9, caption: "trece", action:false},
		{index:14, parent: false, caption: "catorce", action:false},
		{index:15, parent: false, caption: "quince", action:false},
		
		
	];
	var data = [
		
		{index:0, parent: false, caption: "cero", action:"Yanny", image:"http://localhost/sevian/icons/png/021-goal.png"},
		{index:1, parent: false, caption: "uno", action:"Esteban"},
		{index:2, parent: false, caption: "dos", action:false},
		{index:3, parent: false, caption: "tres", action:false},
		{index:4, parent: false, caption: "cuatro", action:false},
		{index:5, parent: false, caption: "cinco", action:false},
		{index:6, parent: false, caption: "seis", action:false},
		{index:7, parent: false, caption: "siete", action:false},
		{index:8, parent: false, caption: "ocho", action:false},
		{index:9, parent: false, caption: "nueve", action:false},
		{index:10, parent: false, caption: "diez", action:false},
		{index:11, parent: 1, caption: "once", action:false},
		{index:12, parent: 1, caption: "doce", action:false},
		{index:13, parent: 11, caption: "trece", action:false},
		{index:14, parent: 11, caption: "catorce", action:false},
		{index:15, parent: 1, caption: "quince", action:"Nuñez"},
		
		
	];
	
	//data = [];
	m1 = new Sevian.Input.DesignMenu({
		name:"menu_1",
		caption: "Menú Principal",
		data: data,
		target: "#design",
	});
	
	data = [];
	new Sevian.Input.DesignMenu({
		name:"menu_2",
		caption: "Menú Secundario",
		data: data,
		target: "#design2",
	});
	alert(3);
	//alert($("#design").text());
	//alert(8);
	
	
}

