var test = (($) => {

	class test{
		id:any = "";
		tag:string = "";

		grid:object = null;
		constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
			}
			let main = (this.id)? $(this.id): false;

            if(main){
                
                if(main.ds("sgForm")){
                    return;
                }
    
                if(main.hasClass("sg-form")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
            }

			//alert(this.tag);



		}
		_create(main:any){
			this.grid.target = "#testgrid_2";
			this.grid.type = "default";
			this.grid.selectMode = "one";
			this.grid.editMode = "simple";
			let g = this.grid = new Grid2(this.grid);

		}




		_load(main:any){

		}
		setData(data, page, totalPages){
			db ("page actual: " + page, "red")
			db ("total pages: "+totalPages)
			this.grid.setData(data, page, totalPages);
			
			//this.grid.setPage(1);
			//this.grid.setPage(1);
			
		}
		setPage(page){
			this.grid.pag.page = page;
			
			//this.grid.setPage(page);
		}
		ver(msg){
			alert(msg);
		}

		setTotalPages(pages){
			//
			this.grid.pag.totalPages = pages;
			this.grid.pag.updatePages();
			
		}

	}



	return test;

})(_sgQuery);