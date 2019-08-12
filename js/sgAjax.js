// JavaScript Document

var sgAjax = false, sgFragment = false;
var SgAjax = (function($){
	var index = 0;
	var active = [];
	
	var ie = navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("Trident") > -1 || navigator.userAgent.indexOf("Edge") > -1;
	var moz = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	var ch = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
	
	var nav = (ie)?"isie":(moz)?"ismoz":(ch)?"ischr":"";
	
	sgFragment = {
		evalJson: function(opt){
			var x = false;
			var target = $(opt.targetId);
			
			if(opt.targetId !== false && opt.targetId !== ""){
				
				if(!target.get()){
					target = $("").create({
						tagName: "div",
						style: {display:"none"},
						id: opt.targetId
					});
					opt.hidden = true;
				}

				if(target.get()){

					if(opt.hidden){
						target.get().style.display = "none";
					}else{
						target.get().style.display = "";
					}

					if(opt.typeAppend){

						switch(opt.typeAppend){
							case 1:
								target.text(opt.html);
								break;
							case 2:
								target.text(opt.html, true);
								break;
							case 3:
								target.insertFirst(opt.html);
								break;

						}
					}

					if(opt.options){
						var option = false;
						target.get().length = 0;
						for(x in opt.options){
							option = target.create("option");
							option.prop({
								value: opt.options[x].value,
								text: opt.options[x].text
							});
						}
					}

					if(opt.propertys){
						for(var x in opt.propertys){
							target.get()[x] = opt.propertys[x];
						}
					}

					if(opt.style){
						for(x in opt.style){
							target.style()[x] = opt.style[x];
						}
					}
				}
			}else if(opt.targetId === false){
				
				$("").text(opt.html);
				if(opt.title){
					document.title = opt.title;
				}
			}
			
			
			if(opt.script){
				$.appendScript(opt.script);
			}
			
			if(opt.css){
				$.appendStyle(opt.css);
			}
		},
	};
	
	var waitLayer = function(opt){
		
		this.target = false;
		this.text = false;
		this.className = false;
		this._main = false;
		this._target = false;
		
		for(var x in opt){
			this[x] = opt[x];
		}
		
		this.create();
		//this.show();
		
	};
	
	waitLayer.prototype = {
		create: function(){
			
			this._target = $(this.target);
			if(!this._target.style().position){
				this._target.style().position = "relative";
			}
			this._main = this._target.create("div");
			this._main.ds("sgType", "sg-ajax");
			this._main.style({
				position: "absolute",
				top: "0px",
				bottom: "0px",
				left: "0px",
				right: "0px",
				visibility: "hidden"
				
			});
			
			if(this.message){
				this._main.text(this.message);
			}
			
			if(this.className){
				this._main.addClass(this.className);
			}
			this._main.addClass(nav);
			
		},
		
		show: function(){
			this._main.style().visibility = "visible";
			this._main.removeClass("sg-wait-close");
			this._main.addClass("sg-wait-open");
			
		},
		
		hide: function(){
			this._main.style().visibility = "hidden";
			this._main.removeClass("sg-wait-open");
			this._main.addClass("sg-wait-close");
		},
		
		
	};
	
	
	var getFormData = function(form){
		
		
		
		
		var f = $(form).get();
		
		var str = "";
		var n = f.elements.length;
		
		for(var x = 0; x < n; x++){
			if(f.elements[x].name){
				str += f.elements[x].name + "=" + encodeURIComponent(f.elements[x].value) + "&";
			}
		}
		return str;
	};
	
	var HttpRequest = function(){
		if(window.XMLHttpRequest){
			return new XMLHttpRequest();
		}else if(window.ActiveXObject){
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	};	
	
	var onReady = function(onSucess, onError, waitLayer, index){
		
		return function(){
			
			if (this.readyState === 4){
				
				//delete active[index];
				
				if(waitLayer){
					waitLayer.hide();
					//waitLayer = null;
				}
				if(this.status === 200){
					onSucess(this);
					return true;
				}
				if(onError){
					onError(this, this.status);
				}
				
				return false;				
				
			}
			
		};
	};
	
	
	
	sgAjax = function(opt){
		
		this.url = "";
		this.method = "GET";
		this.charset = "utf-8";
		this.async = true;
		this.form = true;
		
		this.params = false;
		
		this.onSucess = false;
		this.onError = false;
		this.onAbort = false;
		this.waitLayer = false;
		this.priority = 0;//0:
		this._wait = false;
		for(var x in opt){
			if(this.hasOwnProperty(x)){
				this[x] = opt[x];
			}
		}
		this.index = index++;
		
		this.XHR = HttpRequest();
		
		if(this.waitLayer){
			
			this._wait = new waitLayer(this.waitLayer);
		}
		
		if(this.onSucess){
			this.XHR.onreadystatechange = onReady(this.onSucess, this.onError, this._wait, this.index);
		}
		
		if(this.params !== false){
			this.send();
		}
		
	};
	
	sgAjax.prototype = {
		send: function(opt){
			
			if(opt){
				for(var x in opt){
					if(this.hasOwnProperty(x)){
						this[x] = opt[x];
					}
				}
				if(opt.onSucess){
					this.XHR.onreadystatechange = onReady(this.onSucess, this.onError, this._wait, this.index);
				}
			}
			
			if(this.XHR.readyState !== 0 && this.XHR.readyState !== 4){
				if(this.priority === 1){
					this.XHR.abort();
					
				}else{
					return this.XHR;
				}
			}
			
			var 
				date = new Date(),
				XHR = this.XHR,
				rnd =  date.getTime() + (Math.random() * 100).toFixed(0);
			//db(this._wait)
			if(this._wait){
				
				this._wait.show();
			}
			
			var formData = "";
			if(this.form){
				
				if(this.form instanceof FormData){
					formData = this.form;
				}else{
					formData = new FormData($(this.form).get());
				}
				//formData = getFormData($(this.form).get());
			}else{
				formData = this.params;
			}
			
			if(this.method.toUpperCase() === "GET"){
				XHR.open("GET", this.url + "?" + "rnd=" + rnd + this.params + "&" + formData, this.async);
				XHR.open("GET", this.url, this.async);
				XHR.setRequestHeader("Content-Type", "text/plain;charset=utf-8");
				XHR.send(null);

			}else{
				
				//db(formData.get("cedula"),"red");
				XHR.open("POST", this.url, this.async);
				//XHR.setRequestHeader("Content-Type", "multipart/form-data;charset=utf-8");
				/*multipart/form-data OR application/x-www-form-urlencoded*/
				//XHR.send(/*"&rnd=" + rnd + this.params + "&" + */formData);
				XHR.send(formData);
			}// end if
			return this.XHR;
		},
		
		getStatus: function(){
			return this.XHR.readyState;
		},
		abort: function(){
			this.XHR.abort();
			
			if(this._wait){
				this._wait.hide();
			}
			
			if(this.onAbort){
				this.onAbort();
			}
		}
		
	};
	
	
	return {
		create: function(opt){
			return new sgAjax(opt);
		},
		
		createWL: function(opt){
			return new waitLayer(opt);
		},
		
	};
	
	
})(_sgQuery);


