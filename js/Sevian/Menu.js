// JavaScript Document
/*

@type: 

normal,
default,
accordion,
accordionx,
accordiony,
system,


@author: yanny nuñez;
@update: 25/04/2017




*/

if(!Sevian){
	var Sevian = {};
}

var sgMenu;

(function($, sgFloat, namespace){
	
	var Item = function(opt){
		
		this.main = false;
		this.caption = "";
		
		
		
		this.className = false;
		this.classImage = false;
		this.icon = false;
		
		this.mode = "close";
		this.checked = false;
		this.disabled = false;
		
		
		this.url = false;
		this.urlTarget = false;
		
		this.pull = false;
		
		this.pullX = "front";
		this.pullY = "top";

		this.pullDeltaX = 20;
		this.pullDeltaY = 20;
		
		
		this._divIcon = false;
		this._icon = false;
		
		this._check = false;
		this.type = "default";
		this._popup = false;
		
		this.onOpen = false;
		this.onClose = false;
		//this.onCheck = false;
		
		this.wCheck = false;
		this.wIcon = false;
		this.useButton = false;
		this.level = 0;
	
		this._checkOver = false;
		
		for(var x in opt){
			if(opt.hasOwnProperty(x)){
				this[x] = opt[x];
			}
			
		}
		this._main = false;
		this._item = false;
		this._mainCheck = false;
		this._mainIcon = false;
		this._caption = false;

		this._check = false;
		this._icon = false;
		this._text = false;
		
		this._menu = false;
		this._popup = false;
		this.create();
		
	};
	
	Item.prototype = {
		
		create: function(){
			
			if(this.main){
				
				this._main = $(this.main);
				this._item = $(this._main.query(".option"));
				this._mainCheck = $(this._main.query(".option > .checkbox"));
				this._mainIcon = $(this._main.query(".option > .icon"));
				this._caption = $(this._main.query(".option > .caption"));

				this._check = $(this._main.query(".option > .checkbox > input[type=checkbox]"));
				this._icon = $(this._main.query(".option > .icon > img"));
				
				this._menu = $(this._main.query(".submenu"));
				
			}else{
				this._main = $.create("li");
			}
			
			if(this.id){
				this._main.id(this.id);
			}
			
			this._main.ds("sgMenuType", "item");
			
			this._main.addClass("item").addClass(this.className).ds("sgMenuType", "item").ds("sgMenuItemId", this.index);
			
			this.setMode(this.mode);
			
			if(!this._item){
				if(this.useButton){
					this._item = this._main.create("button");
					this._item.prop("type", "button");
				}else{
					this._item = this._main.create("a");
				}
				
			}
			this._item.addClass("option").ds("sgMenuType", "option");
			
			if(this.urlTarget){
				this._item.get().target = this.urlTarget;
			}
			this._item.get().href = this.url || "javascript:void(0)";
			
			
			var ME = this;

			if(this.wCheck){
				
				if(!this._mainCheck){
					this._mainCheck = $.create("div");
					this._item.insertFirst(this._mainCheck );
					this._check = this._mainCheck.create({tagName: "input", type: "checkbox", tabIndex:"-1"});
					
				}
			  
			}
			
			if(this._mainCheck){
				this._mainCheck.addClass("checkbox");
			}
			
			if(this._check){

				this._check.get().disabled = this.disabled;
				this._check.get().checked = this.checked;

				if(this.onCheck){
					
					this._check.on("click", function(event){
						ME.onCheck(this.checked, ME.index, ME.parent, ME.level, event);
					});
				}

				this._check.on("click", function(event){ 
					event.stopPropagation();
					//event.cancelBubble = true; 
					event.preventDefault();
				});

				this._check.on("mouseover", function(){ME._checkOver = true;});
				this._check.on("mouseout", function(){ME._checkOver = false;});
				
			}
			
			
			if(this.wIcon){
				this._mainIcon = this._item.create("div");
				this._mainIcon.addClass("icon");

				if(!this._icon && this.icon){
					this._icon = this._mainIcon.create("img");
				}
				
			}
			
			if(this._mainIcon){
				this._mainIcon.addClass(this.classImage);
			}
			
			if(this._icon && this.icon){
				this._icon.get().src = this.icon;
			}

			if(!this.disabled){
				for(var x in this.events){
					this._item.on(x, $.bind(this.events[x], this));
				}

				if(this.action){
					this._item.on("click", $.bind(this.action, this));
				}

				if(this.onaction){
					this._item.on("click", function(){ME.onaction(ME.index, ME.parent, ME.level);});
				}
			}else{
				this._main.addClass("disabled");
			}
			
			if(!this._caption){
				this._caption = this._item.create("span");
			}
			this._caption.addClass("caption");
			this.setCaption(this.caption);
			
			if(this.target){
				this.target.append(this._main);	
			}
			
			
		},
		
		setCaption: function(caption){
			this.caption = caption;
			if(this._caption && caption){
				this._caption.text(caption);
			}
			
		},
		
		getCaption: function(){
			return this._caption;	
		},

		get: function(){
			return this._main.get();
		},
		
		getItem: function(){
			return this._item;
		},
		
		getCheck: function(){
			return this._check;	
		},
		
		createMenu: function(typePopup, classMenu){
			
			if(!this._menu){
				this._menu = this._main.create("ul");
			}
			
			if(!this._item.query(".ind")){
				this._item.create("div").addClass("ind").ds("sgMenuType", "ind");
			}
			
			this._menu.addClass("submenu");
			
			if(classMenu){
				this._menu.addClass(classMenu);
			}
			
			if(typePopup){
				this._popup = this._menu;
				//this._menu.ds("sgMenuType", "submenu");
				//this._menu.addClass("popup");
				//this._menu.get().style.visibility ="hidden";
				this._menu.style({
					position: "fixed",
					userSelect: "none",
					MozUserSelect: "none",
					visibility: "hidden",
					overflow: "none",
					zIndex: 150000000,
					//border:"4px solid red",
					

				});				
			}else{
				this._menu.ds("sgMenuType", "smenu");
			}
			
			return this._menu;
		},
		
		getMenu: function(){
			return this._menu;
		},
		
		append: function(child){
			this._menu.append(child);
		},
		
		open: function(){
			
			if(this.mode === "open"){
				if(this._popup){
					sgFloat.setIndex(this._popup.get());
				}
				return true;
			}
			
			this.setMode("open");
			
			if(this._popup){
			
				this._popup.style({
					visibility: "visible"
				});
				this._popup.removeClass("close");
				this._popup.addClass("open");
				
				sgFloat.showMenu({
					ref: this._main.get(), e: this._popup.get(), 
					left: this.pullX, top: this.pullY, 
					deltaX: this.pullDeltaX, deltaY: this.pullDeltaY, z: 0
				});
				
			}
		},
		
		close: function(){
			
			if(this.mode === "close"){
				return true;
			}
			
			if(this.onClose && !this.onClose(this.index)){
				
				return false;
			}
			
			this.setMode("close");
			
			if(this._popup){
				this._popup.removeClass("open");
				this._popup.addClass("close");
				this._popup.style({
					visibility: "hidden"
				});
				
			}			
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
		
		isCheckOver: function(){
			return this._checkOver;	
		},
		
	};
	
	var Menu = function(opt){
		this.id = "";
		this.target = false;
		this.type = "normal";
		this.mode = "default";
		this.caption = false;
		this.lastMenuId = false;
		this.wCheck = false;
		this.wIcon = false;
		this.useButton = false;
		this.value = false;
		
		this.className = false;
		
		this.items = false;
		this._items = [];
		this.smenu = [];

		
		this._target = false;
		this._main = false;
		this._menu = false;
		this._caption = false;
		
		this._onOpen = false;
		
		this.new = true;

		this.pullX = "front";
		this.pullY = "top";

		this.pullDeltaX = -3;
		this.pullDeltaY = 5;		
		
		this.oncheck = false;//function(checked, index, parent, level){};
		
		this._id = 0;
		var x = false;
		for(x in opt){
			if(opt.hasOwnProperty(x)){
				this[x] = opt[x];
			}
		}
		if(this.target){
			this._target = $(this.target);
		}
		this.setType(this.type);
		this.create();
		
		if(this.items){
			for(x in this.items){
				if(this.items.hasOwnProperty(x)){
					this.add(this.items[x]);
				}
			}
		}
		
	};
	
	Menu.prototype = {
		
		_loadMenu: function(menu, parent){
			//var d = menu.query("ul>li");
			var d = menu.childs();
			
			//$(menu).addClass("SUBMENU");
			
			var ME = this;
			
			d.forEach(function(e){
				e = $(e);
				var opt = {
					index: ME._id,
					parent: parent,
					main: e,
					wIcon: false
					
				};
					
				ME.add(opt);
				
				if(e.query("ul")){
					
					ME._loadMenu($(e.query("ul")), opt.index);
				}
				
			})	;	
		},
		
		getIndex: function(){
			return this._id;
		},
		
		create: function(){

			if(this.main){
				
				this._main = $(this.main);
				this._caption = $(this._main.query(".caption"));
				this._menu = $(this._main.query(".menu"));
				this._id = 0;
				this._loadMenu(this._menu, false);
				
			}
			
			if(!this._main){
				this._main = $.create("div");
			}
			if(this.id){
				this._main.prop("id", this.id);
			}
			this._main.addClass(this.className).addClass("sg-menu").addClass("type-"+this.type).addClass("mode-"+this.mode);
			
			if(this.caption !== false){
				this.setCaption(this.caption);
			}
			if(!this._menu){
				this._menu = this._main.create("ul");
			}
			this._menu.addClass("menu");
			
			if(this._target){
				this._target.append(this._main);
			}
			
		},
		
		setMode: function(mode){
			this._menu.ds("sgMenuMode", this.mode);	
			this._menu.removeClass("mode_"+this.mode);
			this._menu.addClass("mode_"+mode);
			
			this.mode = mode;
		},
		
		setType: function(type){
			
			var ME = this;
			this.type = type;
			switch(type){
				case "default":
				case "system":
				case "accordionx":	
					$(document).on("mousedown", function(){
						if(ME.active){
							return;	
						}
						ME.hidePopup(ME.lastMenuId);
						ME.lastMenuId = null;
					});
					break;
				case "accordion":
					break;
				case "accordiony":
					break;
			}
			
		},
		
		get: function(){
			return this._main;
		},

		setCaption: function(caption){
			
			this.caption = caption;
			
			if(!this._caption){
				this._caption = $.create("div");
				this._main.append(this._caption);
			}

			//this._caption.ds("sgMenuType", "caption");
			this._caption.addClass("caption");
			this._caption.text(caption);
			
		},
		
		getCaption: function(){
			return this._caption;
		},
		
		add: function(opt){
			
			opt.wCheck = (opt.wCheck !== undefined)? opt.wCheck: this.wCheck;
			opt.wIcon = (opt.wIcon !== undefined)? opt.wIcon: this.wIcon;
			
			opt.pullX = (opt.pullX !== undefined)? opt.pullX: this.pullX;
			opt.pullY = (opt.pullY !== undefined)? opt.pullY: this.pullY;
			opt.pullDeltaX = (opt.pullDeltaX !== undefined)? opt.pullDeltaX: this.pullDeltaX;
			opt.pullDeltaY = (opt.pullDeltaY !== undefined)? opt.pullDeltaY: this.pullDeltaY;

			if(opt.wCheck){
				opt.oncheck = this.oncheck;
			}
			
			if(opt.index === this.value){
				opt.mode = "open";
			}
			
			if(this.useButton){
				opt.useButton = true;
			}
			this._id++;
			
			var item = this._items[opt.index] = new Item(opt);
			var ME = this;
			var menu = this._menu;
			if(item.getCheck()){
				item.getCheck().on("mouseover", function(){ME.active = true;});
				item.getCheck().on("mouseout", function(){ME.active = false;});

				
			}
			if(item.parent !== null && item.parent !== undefined && item.parent !== false){
				
			
				var parent = menu = this._items[item.parent];
				
				if(parent.disabled){
					return;
				}
				
				if(!this.smenu[item.parent]){
					this.smenu[item.parent] = parent;
					parent.createMenu(this.type === "default" || this.type === "system", this.class);
					parent.getItem().on("mouseover", function(){ME.active = true;});
					parent.getItem().on("mouseout", function(){ME.active = false;});

					parent.getItem().on("click", function(){
						if(ME.type !== "default" && ME.type !== "system"){
							ME.lastMenuId = item.parent;
						}
					}.bind(parent));

					parent.getItem().on("click", this._showMenu(this.type).bind(parent));
				}
								
				item.level = parent.level + 1;
			}
			
			if(item.sep){
				var sep = $.create("li");
				sep.addClass("sep");
				menu.append(sep);
			}
			
			if(!item.main){
				menu.append(item.get());
			}
			
			if(this.type === "system" && item.level === 0){
				item.pullX = "left";
				item.pullY = "down";
				item.pullDeltaX = 0;
				item.pullDeltaY = 0;
			}
			
			return item;
			
		},
		
		_showMenu: function(type){

			var ME = this;
			
			if(type === "default" || type === "system"){
				return function(){
					if(this.isCheckOver()){
						return false;
					}
					
					this.open();
					if(ME.lastMenuId === this.index){
						return false;
					}
					if(ME._items[this.index].parent !== ME.lastMenuId){
						ME.hidePopup(ME.lastMenuId, ME._items[this.index].parent);
					}
					ME.lastMenuId = this.index;
				};
			}
										
			if(type ===  "accordion" || type ===  "accordionx"){
				return function(){
					if(this.isCheckOver()){
						return false;
					}

					if(this.getMode() === "open"){
						this.close();
					}else{
						for(var x in ME._items){
							if(this.parent === ME._items[x].parent){
								ME._items[x].close();
							}
						}
						this.open();
					}
				};
			}
			
			if(type ===  "accordiony"){
				return function(){
					if(this.isCheckOver()){
						return false;
					}
					
					if(this.getMode() === "open"){
						this.close();
					}else{
						this.open();
					}
				};
			}
		},
		
		hidePopup: function(index, parent){
			
			if(index !== false){
				if(this._items[index]){
					this._items[index].close();
				}else{
					return;
				}
				if(this._items[index].parent === parent){
					return;	
				}
				this.hidePopup(this._items[index].parent, parent);
			}

		},
		
				
	};
	
	sgMenu = namespace.Menu = Menu;
	
	
}(_sgQuery, _sgFloat, Sevian));