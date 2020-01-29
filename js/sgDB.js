// JavaScript Document

var db = false, hr = false;
(function($){
	let linea = 0, div, win = null;
		
	div = $.create("div");
	div.prop("id","debug_1")
	.style({minWidth:"200px"})
	.on("dblclick",function(){
		linea = 0;
		this.innerHTML = "";
	});

	objValue = function(msg){

		let div = $.create("div").addClass("debug-object");
		for(let x in msg){
			
			let _aux = div.create("div");
			_aux.create("span").text(x +": ");
			if(typeof msg[x] === 'object'){
				_aux.create("span").append(objValue(msg[x]));
			}else{
				_aux.create("span").text(msg[x]);
			}
			
			
		}
		return div;
	}

	hr = db = (msg, color, back, clear) => {

		color = color || "black";
		back = back || "";

		linea++;

		var _div = $.create("div");

		_div.style({color: color, backgroundColor:back});


		_div.text(linea +".- "+ msg);

		div.insertFirst(_div);
		if(win){
			if(!win.getVisible()){
				win.show({});
			}
			
		}
		

	};

	ob = (msg, color, back, clear) => {

		color = color || "black";
		back = back || "";

		linea++;

		var _div = $.create("div");

		_div.style({color: color, backgroundColor:back});

		if (typeof msg === 'object'){
			

			_div.append(objValue(msg))
			
		}else{
			_div.text(linea +".- "+ msg);
		}

		

		div.insertFirst(_div);
		if(win){
			if(!win.getVisible()){
				win.show({});
			}
			
		}
		

	};

	win = new Float.Window({
		visible:true,
		caption:"Debug: Console",
		child:div,
		left:"center",
		top:"top",
	});

	
	
})(_sgQuery);