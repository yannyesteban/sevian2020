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


var _sgFloat, _sgDrag;
(function(a){
	
		
	var isFirefox = typeof InstallTrigger !== "undefined";
	
	var zIndex = 10000;
	
	var getIndex = function(){
		return zIndex++;
	};
	
	var on = function(obj, _event, _function){
		if(obj.addEventListener){
			_event = _event.replace(/^\s*on/gi, "");
			obj.addEventListener(_event, _function, false);
		}else if(obj.attachEvent){
			obj.attachEvent(_event, _function);
		}// end if		
	};

	var off = function(obj, _event, _function) {
		if(obj.removeEventListener){
			_event = _event.replace(/^\s*on/gi, "");
			obj.removeEventListener(_event, _function, false);
		}else if(obj.detachEvent){
			obj.detachEvent(_event, _function);
		}// end if
	};

	var float = {
		
		init: function(e){
			on(e, "mousedown", function(event){
				e.style.zIndex = getIndex();
			});
			on(e, "touchstart", function(event){
				e.style.zIndex = getIndex();
			});
		},

		setIndex: function(e){
			e.style.zIndex = getIndex();
		},
			
		getXY: function(e){
			
			var 
				cW = document.documentElement.clientWidth,
				cH = document.documentElement.clientHeight,
				sT = document.documentElement.scrollTop,
				sL = document.documentElement.scrollLeft,

				width = e.offsetWidth,
				height = e.offsetHeight,

				rect = e.getBoundingClientRect();
		
			
			return {
				left: rect.left,
				top: rect.top,
				width: width,
				height: height,
				cW: cW, cH: cH, sT: sT,sL: sL
			};
			
		},
		
		getXYOLD: function(e){
			/*
			var el=e;
			var xPos=0;
			var yPos=0;
			
			
			var rect = el.getBoundingClientRect();
			var d= window.getComputedStyle(el, null);
			db(d.getPropertyValue('border'),"red")
			
			
			var width = el.offsetWidth;
			var height = el.offsetHeight;
			
			return {
				left: rect.left,
				top: rect.top,
				width: width,
				height: height,
			}
			
			while(el){
				
				if(el.tagName == "BODY"){
					
					var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
					var yScroll = el.scrollTop || document.documentElement.scrollTop;
					
					
					xPos += el.offsetLeft - xScroll + el.clientLeft;
					yPos += el.offsetTop - yScroll + el.clientTop;
					
				}else{
					xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
					yPos += el.offsetTop - el.scrollTop + el.clientTop;
					
				}
				el = el.offsetParent;
			}
			return {
				left: xPos,
				top: yPos,
				width: width,
				height: height,
			}
			*/
			var 
				cW = document.documentElement.clientWidth,
				cH = document.documentElement.clientHeight,
				sT = document.documentElement.scrollTop,
				sL = document.documentElement.scrollLeft,

				width = e.offsetWidth,
				height = e.offsetHeight,
				left = e.offsetLeft,
				top = e.offsetTop,
				
				clientLeft = 0,
				clientTop = 0,

				ctlTag = e.offsetParent,
				dX = 0,
				dY = 0,
				aux = false;
			
			if(ctlTag){
				//clientLeft = ctlTag.clientLeft;
				//clientTop = ctlTag.clientTop;
			}
			var rect = e.getBoundingClientRect();
			var rect2 = e.getClientRects();
			db(rect2)
			return {
				left: rect.left + clientLeft,
				top: rect.top + clientTop,
				width: width,
				height: height,
				cW: cW, cH: cH, sT: sT,sL: sL
			};
			
			
			while(ctlTag !== null){
				
				if(!isFirefox){
					var aux = window.getComputedStyle(ctlTag, null);
				
					//dX = parseInt(aux.getPropertyValue("border-left-width"), 10) || 0;
					//dY = parseInt(aux.getPropertyValue("border-top-width"), 10) || 0;
					
					dX = ctlTag.clientLeft;
					dY = ctlTag.clientTop;
					
					db(dX, "aqua","blue");
				
				}
				
				
				
				left += ctlTag.offsetLeft - ctlTag.scrollLeft + dX;
				top += ctlTag.offsetTop - ctlTag.scrollTop + dY;
				
				ctlTag = ctlTag.offsetParent;
			}

			return {
				left: left,
				top: top,
				width: width,
				height: height,
				cW: cW, cH: cH, sT: sT,sL: sL};
		},

		showElem: function(opt){
			
			var 
				e = opt.e,
				left = opt.left || 0,
				top = opt.top || 0,
				z = (opt.z !== undefined)? opt.z: undefined;
			
			e.style.top = top + "px";
			e.style.left = left + "px";
			
			if(z !== undefined){
				if(z > 0){
					e.style.zIndex = z;
				}
			}else{
				
				z = e.style.zIndex = getIndex();
				
			}

			return {e: e, left: left, top: top, z: z};

		},

		show: function(opt){
			
			var 
				e = opt.e,
				xx = (opt.left === undefined)? "center": opt.left,
				yy = (opt.top === undefined)? "middle": opt.top,
				z = opt.z || undefined,
				deltaX = opt.deltaX || 0,
				deltaY = opt.deltaY || 0,
				
				left = false,
				top = false,
				c = {};
			

			if(typeof xx !== "number" || yy !== "number"){
				c = this.getXY(e);
			}

			if(typeof xx !== "number"){
				switch(xx){
					case "center":
						left = c.sL +(c.cW - c.width) /2;
						break;	
					case "left":
						left = c.sL;
						break;	
					case "right":
						left = c.sL + c.cW - c.width;
						break;	
					case "acenter":
						left = (c.cW - c.width) /2;
						break;
				}// end switch
			}else{
				left = xx;
			}// end if

			if(typeof yy !== "number"){
				switch(yy){
					case "middle":
						top = c.sT + (c.cH - c.height) /2;
						break;	
					case "top":
						top = c.sT;
						break;	
					case "bottom":
						top = c.sT + c.cH - c.height;
						break;
					case "amiddle":
						top = (c.cH - c.height) /2;
						break;
				}// end switch
			}else{
				top = yy;
			}// end if

			return this.showElem({e: e, left: left + (deltaX || 0) ,top: top + (deltaY || 0),z: z});

		},

		showMenu: function(opt){
			
			var 
				e = opt.e,
				ref = opt.ref,
				xx = opt.left || "",
				yy = opt.top || "",
				deltaX = opt.deltaX || 0,
				deltaY = opt.deltaY || 0,
				z = (opt.z !== undefined)? opt.z: undefined,
				
				
				left = false,
				top = false,
				c = this.getXY(ref),
			
				fixed = (e.style.position === "fixed"),
				width = e.offsetWidth,
				height = e.offsetHeight,
				cW = c.cW,
				cH = c.cH,
				sL = c.sL,
				sT = c.sT;

			switch(xx){
				case "center":
					left = c.left + c.width /2 - width /2;
					break;	
				case "left":
					left = c.left;
					break;	
				case "front":
					left = c.left + c.width;
					break;
				case "back":
					left = c.left - width;
					break;
				case "right":
					left = c.left + c.width - width;
					break;
				default:
					left = c.left + c.width - 10;

			}// end switch

			switch(yy){
				case "middle":
					top = c.top + c.height /2 - height /2;
					break;	
				case "top":
					top = c.top;
					break;	
				case "bottom":
					top = c.top  + c.height - height;
					break;
				case "down":
					top = c.top  + c.height;
					break;
				case "up":
					top = c.top - height;
					break;
				default:
					top = c.top + c.height - 10;	
			}// end switch

			if(!fixed){
				top = top + sT;	
				left = left + sL;
			}

			left = left + deltaX;
			top = top + deltaY;

			if ((left + width) > (cW + sL)){
				left = cW + sL - width;
			}// end if
			if (left < sL){
				left = sL;
			}// end if

			if ((top + height) > (cH + sT)){
				top = cH + sT - height; 
			}// end if

			if (top < sT && !fixed){
				top = sT; 
			}// end if	

			return this.showElem({e: e, left: left, top: top, z: z});
		},

		dropDown: function(opt){

			var 
				e = opt.e,
				ref = opt.ref,
				xx = opt.left || "",
				yy = opt.top || "",
				deltaX = opt.deltaX || 0,
				deltaY = opt.deltaY || 0,
				z = (opt.z !== undefined)? opt.z: undefined,
				
				left = false,
				top = false,
				c = this.getXY(ref),
				
				width = e.offsetWidth,
				height = e.offsetHeight,
				cW = c.cW,
				cH = c.cH,
				sL = c.sL,
				sT = c.sT;
			
			switch(xx){
				case "center":
					left = c.left + c.width /2;
					break;	
				case "left":
					left = c.left;
					break;	
				case "right":
					left = c.left + c.width;
					break;
				case "back":
					left = c.left - width;
					break;
				default:
					left = c.left + c.width - 10;

			}// end switch

			switch(yy){
				case "middle":
					top = c.top + c.height /2;
					break;	
				case "top":
					top = c.top;
					break;	
				case "bottom":

					top = c.top + c.height;
					break;
				case "up":

					top = c.top - height;
					break;
				default:
					top = c.top + c.height - 10;	
			}// end switch

			left = left + deltaX;
			top = top + deltaY;

			if ((left + width) > (cW + sL)){
				left = cW + sL - width;
				//left = c.left - width;
			}// end if
			if (left < sL){
				left = sL;
			}// end if
			if ((top + height) > (cH + sT)){
				//top = cH + sT - height; 
			}// end if
			if (top < sT){

				top = sT; 
			}// end if	

			if ((c.top + c.height + height) > (cH + sT)){
				top = c.top - height;
			}// end if

			return this.showElem({e: e, left: left, top: top, z: z});

		},	

		center: function(e){
			e.style.position = "fixed";
			e.style.top = "50%";
			e.style.left = "50%";
			e.style.transform = "translate(-50%, -50%)";
			
		},
		
		move: function(e, left, top){
			//e.style.position = "fixed";
			e.style.left = left;
			e.style.top = top;
		},
		
		float: function(opt){
			
			
			var 
				e = opt.e,
				left = opt.left,
				top = opt.top;
			
			var tx = false, ty = false;
			

			switch(left){
				default:
				case "center":
					e.style.left = "50%";
					tx = "-50%";
					break;
				case "left":
					e.style.left = "0%";
					tx = "0%";
					break;
				case "right":
					e.style.left = "100%";
					tx = "-100%";
					break;
			}

			switch(top){
				default:
				case "middle":
					e.style.top = "50%";
					ty = "-50%";
					break;
				case "top":
					e.style.top = "0%";
					ty = "0%";
					break;
				case "bottom":
					e.style.top = "100%";
					ty = "-100%";
					break;
			}
			
			e.style.transform = "translate("+tx+","+ty+")";

		},
		
		max: function(e){
			e.style.position = "fixed";
			e.style.top = "0%";
			e.style.left = "0%";
			e.style.width = "100%";
			e.style.height = "100%";
			e.style.border = "3px solid green";
			//e.style.transform = "translate(-50%, -50%)";
			
		},
		
	};// end object	
	
	var drag = {
		
		iniX: false,
		iniY: false,

		init: function(opt_x) {
			
			var opt = {
				main: false,
				onstart: function(){},
				oncapture: function(clientX, clientY, iniX, iniY, offsetLeft, offsetTop){},
				onrelease: function(clientX, clientY, iniX, iniY, offsetLeft, offsetTop){}
			};
			
			for(var x in opt_x){
				opt[x] = opt_x[x];
			}
			
			var e = opt.main;
			var ME = this;

			//e.style.userSelect = "none";
			
			
			//e.style.userSelect = "none";
			//e.style.MozUserSelect = "none";
			//e.style.overflow = "auto";
			/*e.style.userSelect = "none";
			e.style.webkitUserSelect = "none";
			
			e.setAttribute("unselectable", "on");
			*/
			e.onmousedown = function(event){

				event = event || window.event;
				ME.iniX = event.clientX;
				ME.iniY = event.clientY;
				var offsetLeft = this.offsetLeft;
				var offsetTop = this.offsetTop;
				
				opt.onstart();

				if(ME.capture){
					off(document, "mousemove", ME.capture);
				}

				if(ME.release){
					off(document, "mouseup", ME.release);			
				}

				on(document, "mousemove", ME.capture = function(event){
					
					event = event || window.event;
					
					
					opt.oncapture(event.clientX, event.clientY, ME.iniX, ME.iniY, offsetLeft, offsetTop);				
				});

				on(document, "mouseup", ME.release = function(event){
					event = event || window.event;
					event.preventDefault();
					off(document, "mousemove", ME.capture);
					off(document, "mouseup", ME.release);
					opt.onrelease(event.clientX, event.clientY, ME.iniX, ME.iniY, offsetLeft, offsetTop);
				});
				
				
			};
			e.ontouchstart = function(event){
				//event.preventDefault();
				
				
				event = event.changedTouches[0];
				
				event = event || window.event;
				ME.iniX = event.clientX;
				ME.iniY = event.clientY;
				var offsetLeft = this.offsetLeft;
				var offsetTop = this.offsetTop;
				
				opt.onstart();

				if(ME.capture){
					off(document, "touchmove", ME.capture);
				}

				if(ME.release){
					off(document, "touchend", ME.release);			
				}

				on(document, "touchmove", ME.capture = function(event){
					event.preventDefault();
					event = event.changedTouches[0];
					event = event || window.event;
					opt.oncapture(event.clientX, event.clientY, ME.iniX, ME.iniY, offsetLeft, offsetTop);				
				});

				on(document, "touchend", ME.release = function(event){
					event = event.changedTouches[0];
					off(document, "touchmove", ME.capture);
					off(document, "touchend", ME.release);
					opt.onrelease(event.clientX, event.clientY, ME.iniX, ME.iniY, offsetLeft, offsetTop);
				});
				
					
							
				
			};
		},// end function


	
};// end object	
	
	_sgFloat = float;
	_sgDrag = drag;
	
})();

var _sgDragDrop = (function(){
	var sgFloat = _sgFloat, sgDrag = _sgDrag;
	
	var xA;
	var yA;
	var sX;
	var sY;
	var posX;
	var posY;
	var cW;//document.documentElement.clientWidth;
	var cH;//document.documentElement.clientHeight;

	var _main;
	var _hand;
	var _opt;	
	
	var _rs_mode;
	
	var maxWidth = 800;
	var minWidth = 200;
	var maxHeight = 800;
	var minHeight = 200;
	
	var mH = false;
	var lastH = false;
	var info = false;
	var info2 = false;
	var info3 = false;
	
	var _rs_onstart = function(main, opt, mode){
		
		return function(){
			
			_main = main;
			_opt = opt;
			xA = _main.offsetWidth;
			yA = _main.offsetHeight;
			
			_rs_mode = mode;

			cW = document.documentElement.clientWidth;
			cH = document.documentElement.clientHeight;
			
			info = info3 = sgFloat.getXY(_main);
			
			sX = info.left;
			sY = info.top;
			/*mH = sY + sgFloat.getXY(_main).height;
*/
			maxWidth = opt.maxWidth || 500;
			minWidth = opt.minWidth || 30;
			maxHeight = opt.maxHeight || 500;
			minHeight = opt.minHeight || 30;
			
			if(_opt.onstart){
				_opt.onstart({left: sX, top: sY, width: xA, height: yA});
			}
			
		};
	};

	var rs_oncapture = function(_left, _top, iniX, iniY, offsetLeft, offsetTop){
		

		if(_left < 0 || _left > cW){
			return;
		}

		if(_top < 0 || _top > cH){
			return;
		}
				
		var dx = (_left - iniX),
			dy = (_top - iniY),
			W = false,
			H = false,
			top = false,
			left = false,
			delta = false;
		
		switch(_rs_mode){
			case "t":
				top = sY + dy;
				H = yA - dy;
				break;			
			case "l":
				left = sX + dx;
				W = xA - dx;
				break;	
			case "r":
				W = xA + _left - iniX;
				break;					
			case "b":
				H = yA + _top - iniY;
				break;
			case "lt":
				//_main.style.left = (left - offsetLeft)+"px";
				//_main.style.top = (top - offsetTop) + "px";
				//_main.style.left = left+"px";
				//_main.style.top = top + "px" ;	

				//_main.style.left = (sX + dx)+ "px";
				//_main.style.top = (sY + dy) + "px";
				left = sX + dx;
				top = sY + dy;
				W = xA - dx;
				H = yA - dy;
				break;	
			case "rt":
				top = sY + dy;
				W = xA + _left - iniX;
				H = yA - dy;
				break;	
			case "lb":
				left = sX + dx;
				W = xA - dx;
				H = yA + _top - iniY;
				break;	
			case "rb":
				W = xA + _left - iniX;
				H = yA + _top - iniY;
				break;	
		}
/*		
		if(W > maxWidth){
			W = maxWidth;
		}else if(W < minWidth){
			W = minWidth;
		}

		if(H > maxHeight){
			H = maxHeight;
		}else if(W < minHeight){
			H = minHeight;
		}

	*/
		
		
		/**/
		if(W !== false && W <= 0){
			return;
		}
		if(H !== false && H <= 0){
			return;
		}
		
		
		
		
		
		if(W !== false){
			_main.style.width = W + "px"; 
		}
		if(H !== false){
			_main.style.height = H + "px";
		}
		
		if(left !== false){
			_main.style.left = left + "px";
		}
		if(top !== false){
			_main.style.top = top + "px";
		}
		
		
		if(_opt.onresize){
			_opt.onresize(xA + left - iniX, yA + top - iniY);
		}
		
		return;
		
		

		if(info2.height === info3.height){
			
			if(_rs_mode === "t" || _rs_mode === "l" || _rs_mode === "lt" || _rs_mode === "rt"){
				delta = (info.top+info.height) - (info3.top+info3.height);
			}else{
				delta = 0;
			}
			top = info3.top + delta;
			_main.style.top = top + "px";
		}
		if(info2.width === info3.width){
			
			if(_rs_mode === "t" || _rs_mode === "l" || _rs_mode === "lt"  || _rs_mode === "lb"){
				delta = (info.left+info.width) - (info3.left+info3.width);
			}else{
				delta = 0;
			}
			
			left = info3.left + delta;
			_main.style.left = left + "px";
		}
		
		info3 = sgFloat.getXY(_main);
		
		
			
	};
	
	var rs_onrelease = function(left, top, iniX, iniY){

		var info = sgFloat.getXY(_main);
		
		if(info.left > info.cW - 80 || info.top > info.cH - 20){
			
			left = (info.left > info.cW - 80)?info.cW - 80: info.left; 
			top = (info.top > info.cH - 20)?info.cH - 20: info.top; 

			sgFloat.move(_main, left + "px", top + "px");
		}
		
		if(_opt.onrelease){
			_opt.onrelease(left, top, iniX, iniY);
		}					

	};

	var _mv_onstart = function(main, opt){
		
		return function(){
			_main = main;
			_opt = opt;
			sX = _main.offsetLeft;
			sY = _main.offsetTop;
			if(_opt.onstart){
				_opt.onstart({left: sX, top: sY});
			}
		};
	};

	var mv_restart = function(){
		sX = _main.offsetLeft;
		sY = _main.offsetTop;		
	};

	var mv_oncapture = function(left, top, iniX, iniY){
	
		posX = sX + (left - iniX);
		posY = sY + (top - iniY);

		if(posX <= 0){
			posX = 0;	
		}
		
		if(posY <= 0){
			posY = 0;	
		}
		
		_main.style.left = posX + "px";
		_main.style.top = posY + "px";
		
		if(_opt.onmove && _opt.onmove(posX, posY, left, top)){
			mv_restart();
		}					
	
	};

	var mv_onrelease = function(left, top, iniX, iniY){
		
		var info = sgFloat.getXY(_main);
		
		if(info.left > info.cW - 80 || info.top > info.cH - 20){
			
			left = (info.left > info.cW - 80)?info.cW - 80: info.left; 
			top = (info.top > info.cH - 20)?info.cH - 20: info.top; 

			sgFloat.move(_main, left + "px", top + "px");
		}		
		
		if(_opt.onrelease){
			_opt.onrelease(posX, posY, left, top, iniX, iniY);
		}			
	};

	
	var setHolders = function(main, opt){
		var rs = ["t","r","b","l","lt","rt","rb","lb"];
		
		var left = ["0","100%","0","0","0","100%","100%","0"];
		var top = ["0","0","100%","0","0","0%","100%","100%"];
		var width = ["100%","","100%","","10px","10px","10px","10px"];
		var height = ["","100%","","100%","10px","10px","10px","10px"];
		var margin = ["-2px","-2px","-2px","-2px","-5px","-5px","-5px","-5px"];
		//var margin = ["-20px","-20px","-20px","-20px","-20px","-20px","-20px","-20px"];
		var bg = ["","","","","","","blue",""];
		//var bg = ["yellow","red","purple","green","brown","purple","blue","#ea1234"];
		var cursor = "s-resize,e-resize,n-resize,w-resize,nwse-resize,sw-resize,nwse-resize,ne-resize".split(",");
		var lt, k=[];
		
		for(var i in rs){
			k[i] = lt = document.createElement("div");
			lt.style.cssText = "position:absolute;min-height:3px;min-width:3px;z-index:10";
			
			lt.className = "rs "+rs[i];
			
			lt.style.backgroundColor = bg[i];
			
			lt.style.width = width[i];
			lt.style.height = height[i];
			
			lt.style.left = left[i];
			lt.style.top = top[i];
			lt.style.cursor = cursor[i];
			lt.style.margin = margin[i];
			
			sgDrag.init({
				main:k[i],
				ref:main,
				onstart: _rs_onstart(main, opt, rs[i]),
				oncapture: rs_oncapture,
				onrelease: rs_onrelease
			});	
			
			
			
			main.appendChild(lt);
		}
		
		
	};
	
	var _resize1 = function(main, holder, opt){

		for(var x in holder){
			if(holder[x].e)
			sgDrag.init(holder[x].e, {		
				onstart: _rs_onstart(main, opt, holder[x].m),
				oncapture: rs_oncapture,
				onrelease: rs_onrelease
			});			
			
		}// next

	};	
	var _resize = function(opt){
		setHolders(opt.main, opt);
		
		
		
		return;
		for(var x in holder){
			if(holder[x].e){
				sgDrag.init({
					main: opt.hand,
					onstart: _mv_onstart(opt.hand, opt),
					oncapture: mv_oncapture,
					onrelease: mv_onrelease
				});
				
				
			}
			sgDrag.init(holder[x].e, {		
				onstart: _rs_onstart(main, opt, holder[x].m),
				oncapture: rs_oncapture,
				onrelease: rs_onrelease
			});			
			
		}// next

	};	
	var _move = function(opt){
		
		sgDrag.init({
			main: opt.hand,
			onstart: _mv_onstart(opt.main, opt),
			oncapture: mv_oncapture,
			onrelease: mv_onrelease
		});
		
		

	};
	
	var _move1 = function(main, hand, opt){
		
		sgDrag.init(hand, {		
			onstart: _mv_onstart(main, opt),
			oncapture: mv_oncapture,
			onrelease: mv_onrelease
		});		
		
	};
	
	
	return {
		resize: _resize,
		move: _move

	};	
	
	
})();
if(1==2){
document.getElementById("h").style.cssText = "position:fixed;";
document.getElementById("m11").style.cssText = "position:fixed;";
sgFloat.init(document.getElementById("m11"));
sgFloat.init(document.getElementById("h"));
/*
sgFloat.show({
	e: document.getElementById("h"),
	xx:"center",
	yy:"middle"
});
*/
sgFloat.show({e:document.getElementById("h"), left: "center", top:"middle"});
sgFloat.show({e:document.getElementById("m11"), left: "center", top:"top"});

sgDragDrop.move({main: document.getElementById("h"), hand: document.getElementById("r")});
sgDragDrop.move({main: document.getElementById("m11"), hand: document.getElementById("hand")});

sgDragDrop.resize({main: document.getElementById("h")});
sgDragDrop.resize({main: document.getElementById("m11")});


}