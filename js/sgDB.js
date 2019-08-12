// JavaScript Document

var db = false, hr = false;
(function($){
		var linea = 0;
		var div = $.create("div");
		div.prop("id","debug_1");
		div.style({
			width:"200px",

		});
		//div.text("bienvenidos");
		var win = new sgWindow({
			visible:true,
			caption:"Debug: Console",
			child:div,
			x:"right",
			y:"top",
		})	

		div.on("dblclick",function(){
			linea = 0;
			this.innerHTML = "";
		});
		
		
		hr = db = function(msg, color, back, clear){

			color = color || "black";
			back = back || "";

			linea++;

			var _div = $.create("div");

			_div.style({color: color, backgroundColor:back});
			_div.text(linea +".- "+ msg);

			div.insertFirst(_div);
			win.show({});

		}
		
		
		
	
	
		
	
})(_sgQuery);