// JavaScript Document

if(!Sevian){
	var Sevian = {};
}
if(!Sevian.Input){
	Sevian.Input = {};
}

var Upload = false;


(function(namespace, $){
	

	
	Upload = function(opt){
		
		for(var x in opt){
			
			if(opt.hasOwnProperty(x)){
				
				this[x] = opt[x];
			}
			
		}
		
		
		if(this.target){
			this._target = $(this.target);
		}
		db(222)
		this.create();
		
	};
	
	
	Upload.prototype = {
		
		create: function(){
			if(!this.main){
				db(444)
				this.main = $.create("div");
				
				this.main.addClass("upload-main");
				
			}
			
			var preview = $("panel_p6").create("div").get();
			
			this.main
			
				.on("click", function(){
					//db("yan")
					//$("#archivo").attr("value", "c:\www\wallpapers\105.jpg");
				
				})
			
				.on("dragover", function(event){
				
					event.preventDefault();
					
				
				})
				.on("drop", function(event){
					event.preventDefault();
					event.stopPropagation();
					var files = event.target.files || event.dataTransfer.files;
				
				
					db(files.length, "red");
				
				
					//var d = $(this).create("input");
					//d.attr("type", "file");
					//d.attr("value", files);

					//$("#archivo").style({display:"none"})
					$("#archivo").attr("files", files);
					for(var x =0;x<files.length;x++){

						db(x+"..."+files[x].type, "green")
					}
				
				for (var i = 0; i < files.length; i++) {
						var file = files[i];
						var imageType = /image.*/;

						if (!file.type.match(imageType)) {
						  continue;
						}

						var img = document.createElement("img");
					  img.src = window.URL.createObjectURL(file);
					  img.height = 60;
					  img.onload = function() {
						window.URL.revokeObjectURL(this.src);
					  };
					  preview.appendChild(img);
					
					/*
						var img = document.createElement("img");
						img.classList.add("obj");
						img.file = file;
						preview.appendChild(img);

						var reader = new FileReader();
						reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
						reader.readAsDataURL(file);
						*/
				}
					
				});
			
			
			
			if(this._target){
				
				
				this._target.append(this.main);
			}
		}
		
		
		
		
	};
	
	
}(Sevian, _sgQuery));
function l1(){
	
	var uu = new Upload({
		target: "main_upload",
		main: false,


	});
	
}


_sgQuery(window).on("load", l1);

	