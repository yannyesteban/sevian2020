// JavaScript Document
var sgTab = false, Tab;
(function($){
	
	sgTab = function(opt){
		this.type =  "tab";
		
		this.main = false;
		this.target = false;
		this.id = false;
		
		this.menuId = false;
		this.bodyId = false;
		
		
		
		this.className = false;
		this.item = [];
		this.value = 0;
		this.onOpen = function(index){};
		this.onClose = function(index){};
		this.pages = false;
		
		for(var x in opt){
			this[x] = opt[x];
		}
		
		this._menu = false;
		this._body = false;
		this._index = 0;
		
		this.create();
		
		this.setValue(this.value);
		
	};
	
	sgTab.prototype = {
		
		create: function(){

			if(this.main){
				this._main = $(this.main);
				this.setTab();
				return;
			}
			
			this._main = $.create({
				tagName: "div",
				id: this.id,
				className: this.className
			});
			
			this._main.ds("sgType","sgTab");
			this._main.addClass("sg-tab-main");
			
			this._menu = this._main.create({
				tagName: "div",
				className: "sg-tab-menu"
			});
			this._body = this._main.create({
				tagName: "div",
				className: "sg-tab-body"
			});
			if(this.target){
				this._target = $(this.target);
				this._target.append(this._main);
			}
			
			if(this.pages){
				for(var x in this.pages){
					if(this.pages.hasOwnProperty(x)){
						this.add(this.pages[x]);
					}
					
				}
				
			}
		},
		
		add: function(opt){
			
			var iMenu = this._menu.create("a").on("click", this._click(this._index)).on("focus", this._click(this._index));
			iMenu.addClass("sg-tab-imenu");
			iMenu.text(opt.title || "");
			iMenu.get().href = "javascript:void(0);";
			
			iMenu.ds().sgTabIndex = this._index;
			
			var iBody = this._body.create("div");
			iBody.addClass("sg-tab-ibody");
			if(opt.child){
				iBody.append(opt.child);
			}
			
			iBody.ds().sgTabIndex = this._index;
			
			this.item[this._index] = {iMenu: iMenu, iBody: iBody};
			
			if(this.value === this._index){
				this.setVisible(this._index, true);
			}
			
			return this.item[this._index++];
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
		
		setValue: function(index){
			this.value = false;
			this.show(index);
			
		},
		
		show: function(index){
			if(index === this.value){
				return false;
			}
			if(this.value !== false){
				var onClose = this.onClose(index);
				
				if(onClose === undefined || onClose === true){
					this.setVisible(this.value, false);
				}else{
					return false;
				}
			}
			
			this.setVisible(index, true);
			this.value = index;
			this.onOpen(index);
			return true;
		},
		getItem: function(index){
			if(this.item[index]){
				return this.item[index];	
			}
			return false;	
			
		},
		getMenu: function(index){
			if(this.item[index]){
				return this.item[index].iMenu;	
			}
			return false;
		},
		
		getPage: function(index){
			if(this.item[index]){
				return this.item[index].iBody;	
			}
			return false;
		},
		setVisible: function(index, value){
			if(this.item[index]){
				
				if(value){
					this.item[index].iMenu.addClass("sg-tab-active");
					this.item[index].iBody.addClass("sg-tab-active");
				}else{
					this.item[index].iMenu.removeClass("sg-tab-active");
					this.item[index].iBody.removeClass("sg-tab-active");
				}
			}
		},
		
		_click: function(index){
			var ME = this;
			return function(){
				ME.show(index);
			};
			
		},
		
		
		setTab: function(){
			var 
				menu = false, 
				body = false,
				id = this._main.id();
			
			if(id){
				menu = $.queryAll("#" + id + ">.sg-tab-menu>.sg-tab-imenu");//:scope>
				body = $.queryAll("#" + id + ">.sg-tab-body>.sg-tab-ibody");//:scope>
			}else{
				menu = this._main.queryAll(".sg-tab-menu>.sg-tab-imenu");//:scope>
				body = this._main.queryAll(".sg-tab-body>.sg-tab-ibody");//:scope>
			}
			
			[].forEach.call(menu, function(e, index){
				
				this.item[index] = {};
				this.item[index].iMenu = $(e).on("click", this._click(index)).on("focus", this._click(index)).removeClass("sg-tab-active");
			}, this);
			[].forEach.call(body, function(e, index){

				e.style.cssText = "border:4px solid green;padding:4px;margin:4px;";
				this.item[index].iBody = $(e).removeClass("sg-tab-active");
			}, this);
			
		},
		
		loadFrom: function(menuId, bodyId){
			
			
			var menu = $(menuId);
			var body = $(bodyId);
			
			var _menu = menu.get().childNodes;
			var _body = body.get().childNodes;
			
			var index = 0;
			
			for(var x = 0; x < _menu.length; x++){
				if(_menu[x].nodeType === 1){

					this.item[index] = {};
					this.item[index].iMenu = $(_menu[x]).on("click", this._click(index)).on("focus", this._click(index));
					
					index++;
				}
			}

			index = 0;

			for(x = 0; x < _body.length; x++){
				if(_body[x].nodeType === 1){
					this.item[index].iBody = $(_body[x]);
					index++;
				}
			}

		},
		
	};
	
	Tab = sgTab;
	
})(_sgQuery);
/*

var tab = new sgTab({
	target:"#tab1",
	value:0,
	
});

tab.add({
	title:"Opción 1",
	child:"Hola"
});
tab.add({
	title:"Opción 2",
	child: "jejeje "
});
tab.add({
	title:"Opción 3",
	child: "Bye "
});
*/