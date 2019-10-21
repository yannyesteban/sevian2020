// JavaScript Document

var db = false, hr = false;
(function($){
	let linea = 0, div, win = null;
		
	div = $.create("div");
	div.prop("id","debug_1")
	.style({width:"200px"})
	.on("dblclick",function(){
		linea = 0;
		this.innerHTML = "";
	});

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

	win = new Float.Window({
		visible:true,
		caption:"Debug: Console",
		child:div,
		left:"right",
		top:"top",
	});

	
	
})(_sgQuery);