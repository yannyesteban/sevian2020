// JavaScript Document
/*

@author: yanny nuñez;
@update: 25/04/2017

*/

var sgWindow;


(function($, sgFloat, sgDragDrop){
	
	var lastWindow = false;
	
	var setActive = function(window){
		if(lastWindow){
			
			lastWindow.active = false;
			lastWindow._main.removeClass("active");
			
		}
		window._main.addClass("active");
		window.active = true;
		lastWindow = window;
	}
	
	var _window = function(opt){
		this.id = "";
		this.name = "";
		
		this.caption = "";
		this.className = false;
		
		this.x = 50;
		this.y = 50;
		
		this._main = false;
		this._caption = false;
		this._header = false;
		this._body = false;
		
		this._btnMin = false;
		this._btnMax = false;
		this._btnAuto = false;
		this._btnClose = false;
		this._divIcon = false;
		this._icon = false;
		
		this.onHide = function(){};
		this.onShow = function(){};
		
		this.wIcon = true;
		this.wMenu = true;
		this.wFoot = true;
		this.classImage = false;
		this.draggable = true;
		this.resizable = true;
		this.autoClose = false;
		this.delay = 3000;
		
		this.mode = "auto";
		this.visible = true;
		this.activeMode = true;
		
		this.btnMin = true;
		this.btnAuto = true;
		this.btnMax = true;
		this.btnClose = true;
		
		this.width = "400px";
		this.height = "400px";
		
		this.maxMargin = 10;
		
		this._active = true;
		this._timer = false;
		
		this._begin = false;
		for(var x in opt){
			this[x] = opt[x];
		}
		
		this.create();
		
		if(this.autoClose){
			var ME = this;
			$().on("click", function(){
				if(ME._active === true || ME._active === null){
					if(ME._active === null){
						ME._active = false;
					}
					return;	
				}
				ME.hide();			
			});
			
			this._main.on("mouseover", function(event){
				ME._active = true;
				ME.resetTimer();
			});
	
			this._main.on("mouseout", function(event){
				ME._active = false;
				ME.setTimer();
			});
		}
		
		this.setMode(this.mode);
		
		if(this.mode === "custom"){
			this.resize(this.width, this.height);
		}
		
		if(this.visible){
			this.show();
			//this.setVisible(this.visible);
		}
		
	};
	
	_window.prototype = {
				
		create: function(){
			var ME = this;
			var main = this._main = $.create("div");

			if(this.activeMode){
				main.on("mousedown", function(){
					setActive(ME);
				});
			}
				
			sgFloat.init(main.get());
			$().append(main);
			
			main.ds("sgType", "sgWindow");
			
			if(this.id){
				main.ds("sgWindowId", this.id);
			}
			if(this.name){
				main.ds("sgWindowName", this.name);
			}
			
			main.addClass("sgWindow");
			
			if(this.className){
				main.addClass(this.className);
			}
			
			this.createHeader();
			
			main.style({
				position:"fixed",
				visibility: "hidden",
				maxWidth: "100vw",
				maxHeight: "100vh",
				
			});
			
			if(this.resizable){
				sgDragDrop.resize({
					main: main.get(),
					
					onstart: function(){
						ME._main.addClass("resize");
					},
					
					onresize: function(opt){
						if(ME.mode !== "custom"){
							ME.setMode("custom");
						}			
					},
					onrelease: function(left, top, iniX, iniY){
						ME._main.removeClass("resize");
						
					}
				});
			}
			
			if(this.draggable){
				if(!this.hand){
					this.hand = this._header || this._body;
				}
				
				sgDragDrop.move({
					main: this._main.get(), 
					hand: this.hand.get(),
					
					onstart: function(){
						ME._main.addClass("move");	
					},
					onmove: function(posX, posY, eX, eY){

						if(ME.mode === "max"){
							var w = ME._main.get().offsetWidth;

							ME.setMode("auto");
							var w2 = ME._main.get().offsetWidth;	
							ME._main.get().style.left = (eX - (w2 * (eX - posX) /w))+"px";

							return true;// restart capture
						}

					},
					onrelease: function(left, top, iniX, iniY){
						ME._main.removeClass("move");
					}});				
				
				
			}
			
			
			
			this._body = main.create("div");
			this._body.ds("sgType", "win-body");
			this._body.addClass("body");
			
			
			if(this.id){
				this._body.prop({id:this.id});
				this._body.text("BODY");
			}
			if(this.child){
				this.setBody(this.child);
			}
			
			
			
		},
		
		createHeader: function(){
			
			var ME = this;
			
			var header = this._header = $.create("div");
			
			header.on("dblclick", function(){
				if(ME.mode !== "max"){
					ME.setMode("max");
				}else{
					ME.setMode("auto");
				}
			});
			
			header.addClass("header");
			
			this._main.append(header);
			
			if(this.wIcon){
				var divIcon = this._divIcon = header.create("div");
				divIcon.addClass("icon");
				
				if(this.classImage){
					divIcon.addClass(this.classImage);
				}
				if(this.icon){
					var icon = this._icon = divIcon.create("img");
					
					icon.get().src = this.icon;
				}
				
			}
			
			var caption = this._caption = header.create("div");
			caption.addClass("caption");
			caption.text(this.caption);
			
			if(this.btnMin){
				this._btnMin = header.create("div");
				this._btnMin.addClass("btn_min");
				this._btnMin.on("click", function(){
					ME.setMode("min");
				});					
			}

			if(this.btnAuto){
				this._btnAuto = header.create("div");
				this._btnAuto.addClass("btn_auto");
				this._btnAuto.on("click", function(){
					ME.setMode("auto");
				});					
			}
			
			if(this.btnMax){
				this._btnMax = header.create("div");
				this._btnMax.addClass("btn_max");
				this._btnMax.on("click", function(){
					ME.setMode("max");
				});					
			}
			
			if(this.btnClose){
				this._btnClose = header.create("div");
				this._btnClose.addClass("btn_close");
				this._btnClose.on("click", function(){
					ME.hide();
				});					
			}
			
			
		},
		
		setClassName: function(className){
			if(className){
				this._main.addClass(className);
			}	
		},
		setIcon: function(url){
			if(this._icon){
				this._icon.get().src = url;
			}
		},
		
		setClassImage: function(classImage){
			
			if(this._divIcon){
				this._divIcon.removeClass(this.classImage);
				this._divIcon.addClass(classImage);
				this.classImage = classImage;
			}
			
		},
		
		setCaption: function(text){
			if(this._caption){
				this._caption.text(text);
			}
		},

		getCaption: function(){
			return this._caption;
		},
		
		getBody: function(){
			return this._body;
		},
		
		setBody: function(ele){
			if (typeof(ele) === "object"){
				this._body.text("");
				this._body.append(ele);
			}else{
				this._body.text(ele);
			}// end if
		},
		
		setButton: function(opt){
			
			if(this._btnMin){
				this._btnMin.get().style.display = opt[0];
			}
			if(this._btnMax){
				this._btnMax.get().style.display = opt[1];
			}
			if(this._btnAuto){
				this._btnAuto.get().style.display = opt[2];
			}
			
		},
		
		setWinStatus: function(mode){
			switch(mode){

			case "auto":
				this.setButton(["","","none"]);
				break;
			case "min":
				this.setButton(["none","",""]);
				break;
			case "max":
				this.setButton(["","none",""]);
				break;
			case "custom":
				this.setButton(["","",""]);
				break;
			}// end switch			
			
		},
		
		setMode: function(mode){
			
			this._main.ds("sgMode", mode);
			this._main.removeClass(this.mode);
			this._main.addClass(mode);
			
			this.mode = mode;

			switch(mode){
				case "min":
					
					this._body.get().style.height = "0px";
					this._body.get().style.width = "200px";

					this._main.get().style.height = "auto";
					this._main.get().style.width = "auto";
					break;	
				case "max":
					this._body.get().style.width = "auto";
					this._body.get().style.height = "auto";
			
					this.move(this.maxMargin, this.maxMargin, 0, 0);
					this._main.get().style.width = "calc(100% - " + this.maxMargin *2 + "px)";
					this._main.get().style.height = "calc(100% - " + this.maxMargin *2 + "px)";
					break;	
				case "custom":
					/*
					this._main.get().style.width = this.width;								
					this._main.get().style.height = this.height;
					*/
					this._body.get().style.width = "auto";
					this._body.get().style.height = "auto";
					
					break;	
				case "auto":
					this._body.get().style.width = "auto";
					this._body.get().style.height = "auto";

					this._main.get().style.height = "auto";
					this._main.get().style.width = "auto";					
					break;	
			}// end switch				
			
			this.setWinStatus(mode);
			
		},
		
		setVisible: function(value){
			
			this.visible = value;
			
			if(this.visible){
				this._main.removeClass("hidden");
				this._main.addClass("visible");
				this._main.style("visibility", "visible");
				this._main.ds("popupVisible", "visible");
				this.setTimer();
			}else{
				this._main.removeClass("visible");
				this._main.addClass("hidden");
				this._main.style("visibility", "hidden");
				this._main.ds("popupVisible", "hidden");
				this.resetTimer();
			}
			
		},
		
		setParams: function(opt){
			for(var x in opt){
				
				if(opt[x] !== false){
					if(x === "mode"){
						this.setMode(opt[x]);
						continue;
					}
					if(x === "className"){
						this.setClassName(opt[x]);
						continue;
					}
					if(x === "caption"){
						this.setCaption(opt[x]);
						continue;
					}
					if(x === "classImage"){
						this.setClassImage(opt[x]);
						continue;
					}
					if(x === "icon"){
						this.setIcon(opt[x]);
						continue;
					}
					this[x] = opt[x];
				}
					
				
			}	
			
		},
		
		show: function(opt){
			this._active = null;
			
			if(!this._begin && opt === undefined){
				opt = {};
				opt.e = this._main.get();
				opt.left = this.x;
				opt.top = this.y;
				opt.z = 0;
				
				
			}else if(opt){
				opt.e = this._main.get();
				opt.left = opt.left || this.x;
				opt.top = opt.top || this.y;
				opt.z = 0;
				
			}
			
			if(opt.ref){
				sgFloat.showMenu(opt);
			}else if(opt.left !== true && opt.top !== true){
				
				sgFloat.show(opt);
			}else{
				
			}
			
			
			this.onShow();
			this._begin = true;
			sgFloat.setIndex(this._main.get());
			
			if(this.activeMode){
				setActive(this);
			}
			
			this.setVisible(true);
				
		},
		
		hide: function(remote){
			
			if(!this.visible){
				return false;	
			}
			
			var request = true;
			
			if(!remote){
				request = this.onHide();
			}
			
			if(request === true || request === undefined){
				this.setVisible(false);
			}
			
			return true;			
			
		},
		
		resetTimer: function(){
			if(this._timer){
				clearTimeout(this._timer);
			}
		},
		
		setTimer: function(){
			
			if(this.autoClose && this.delay > 0){
				var ME = this;

				this.resetTimer();
				this._timer = setTimeout(function(){
					ME.hide();
				}, this.delay);				
			}
		
		},
		
		move: function(x, y, deltaX, deltaY){

			var xy = sgFloat.show({e:this._main.get(), left: x, top: y, deltaX: deltaX, deltaY: deltaY});	
			this.x = xy.x;
			this.y = xy.y;			
			
		},
		
		resize: function(width, height){
			this._main.get().style.width = width;								
			this._main.get().style.height = height;

			this._body.get().style.width = "auto";
			this._body.get().style.height = "auto";
		},
		
	};
	
	
	sgWindow = _window;
	
})(_sgQuery, _sgFloat, _sgDragDrop);
var sgPopup;
(function($, sgFloat, sgDragDrop){
	
	sgPopup = function(opt){
		this.id = "";
		this.name = "";
		this.target = false;
		this.className = false;
		
		this.x = 50;
		this.y = 50;
		
		this._main = false;
		this.hand = false;
		
		
		this.draggable = false;
		
		this.autoClose = true;
		this.modoTip = true;
		this.delay = 3000;
		
		
		this.visible = false;
		
		
		this.width = "400px";
		this.height = "400px";
		
		this.maxMargin = 10;
		
		this._active = false;
		this._timer = false;
		
		for(var x in opt){
			this[x] = opt[x];
		}
		
		this.create();
		
		if(this.autoClose){
			var ME = this;
			$().on("click", function(event){
				
				if(ME.modoTip){
					
					//event.preventDefault();
					//event.returnValue = false;
					//event.cancelBubble = true;
					
					ME.hide();
					return;
					
				}
				  
				if(ME._active === true || ME._active === null){
					if(ME._active === null){
						ME._active = false;
					}
					
					return;	
				}
				
				ME.hide();			
			});
			
			this._main.on("mouseover", function(event){
				ME._active = true;
				ME.resetTimer();
			});
	
			this._main.on("mouseout", function(event){
				ME._active = false;
				ME.setTimer();
			});
			
		}
		
		if(this.visible){
			this.show();
		}
	};
	
	sgPopup.prototype = {
		
		create: function(){
			if(this.target){
				this._main = this.target.create("div");
			}else{
				this._main = $.create("div");
				$().append(this._main);
			}
			
			var main = this._main;
				
			sgFloat.init(main.get());
			
			
			
			main.ds("sgType", "sgPopup");
			
			if(this.id){
				main.ds("sgPopupId", this.id);
			}
			if(this.name){
				main.ds("sgPopupName", this.name);
			}
			
			main.addClass("sgPopup");
			
			if(this.className){
				main.addClass(this.className);
			}
			
			
			
			main.style({
				position:"fixed",
				visibility: "hidden"
				
			});
			
			if(this.child){
				main.append(this.child);
			}
			if(this.draggable){
				if(!this.hand){
					this.hand = this._main;
				}
				
				sgDragDrop.move({
					main: this._main.get(), 
					hand: this.hand.get(),
				});
			}
			
		},
		
		setVisible: function(value){
			
			this.visible = value;
			
			if(this.visible){
				this._main.removeClass("hidden");
				this._main.addClass("visible");
				this._main.style("visibility", "visible");
				this._main.ds("popupVisible", "visible");
				this.setTimer();
			}else{
				this._main.removeClass("visible");
				this._main.addClass("hidden");
				this._main.style("visibility", "hidden");
				this._main.ds("popupVisible", "hidden");
				this.resetTimer();
			}
			
		},
		
		setBody: function(ele){
			if (typeof(ele) === "object"){
				this._main.text("");
				this._main.append(ele);
			}else{
				this._main.text(ele);
			}// end if
		},
		
		append: function(ele){
			if (typeof(ele) === "object"){
				
				this._main.append(ele);
			}else{
				this._main.text(ele);
			}// end if
		},
		
		show: function(opt){
			//this._active = null;
			
			if(opt === undefined){
				opt = {};
				opt.e = this._main.get();
				opt.left = this.x;
				opt.top = this.y;
				
				
				
			}else if(opt){
				opt.e = this._main.get();
				opt.left = opt.left || this.x;
				opt.top = opt.top || this.y;
				
				
			}
			if(opt.ref){
				sgFloat.showMenu(opt);
			}else{
				sgFloat.show(opt);
			}
		
			this.setVisible(true);
				
		},
		
		hide: function(remote){
			if(!this.visible){
				return false;	
			}
			this.setVisible(false);
						
			
		},
		
		resetTimer: function(){
			if(this._timer){
				clearTimeout(this._timer);
			}
		},
		
		setTimer: function(){
			
			if(this.autoClose && this.delay > 0){
				var ME = this;

				this.resetTimer();
				this._timer = setTimeout(function(){
					ME.hide();
				}, this.delay);				
			}
		
		},		
		
		setClass: function(className){
			if(className){
				this._main.removeClass(this.className);
				this.className = className;
				this._main.addClass(this.className);	
			}
				
		}
		
	};



})(_sgQuery, _sgFloat, _sgDragDrop);



