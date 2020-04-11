var Command = (($) => {
	class Command{
		id:any = "";
		panel:any = "";
		tag:string = "";

		grid:object = null;
		form:object = null;
		menu:object = null;

		panelListCommands:object = null;
		panelGrid:object = null;
		panelCommand:object = null;

		main:object = null;

		_formParams:object = null;
		_formCommand:object = null;

		constructor(info:object){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
			}
			let main = (this.id)? $(this.id): false;

			if(!main){
                main = $.create("div").attr("id", this.id);
			}
			this.main = main;
			this._create(main);

			
		}
		_create(main:any){
			
			main.ds("gtType","command");
			main.addClass("gt-command");
			//main.text("Mis Comandos");
			
			let g = null;

			if(this.form){
				this.form.target = main.id();
				this.form.parentContext =  this;
				
				g = this.form = new Form2(this.form);
			}
			this.panelListCommands = main.create("div").id("list-commands").addClass("list-commands");
			this.panelGrid = main.create("div");
			this.panelCommand = main.create("div");
			
		}
	
		setGrid(grid){
			this.panelGrid.text("");
			this.panelCommand.text("");

			grid.target = this.panelGrid;
			grid.parentContext =  this;
				
			this.grid = new Grid2(grid);
		}

		setForm(form){
			this.panelGrid.text("");
			this.panelCommand.text("");

			form.target = this.panelGrid;
			form.parentContext =  this;
			this._formCommand = new Form2(form);
			//this.panelCommand.text("yanny");
		}
		setFormX(form){
			this.panelGrid.text("");

			form.target = this.panelGrid;
			form.parentContext =  this;
			this._formParams = new Form2(form);
			
		}
		setData(data, page, totalPages){

			this.grid.setData(data, page, totalPages);
			
			//this.grid.setPage(1);
			//this.grid.setPage(1);
			
		}
		setPage(page){
			this.grid.pag.page = page;
			
			//this.grid.setPage(page);
		}
		
		getDetail(info:any){
			let inputs = this._formParams.getInputs();
			
			let str = "";
			let cmdValues = [];
			let _data = [];
			let n = 0;
            for(let i in inputs){
				
                if(inputs[i].ds("cmd")){
                   
                   _data.push(
					{
						"h_command_id":410,
						"param_id":inputs[i].ds("cmd"),
						"value":inputs[i].getValue(),
						"__mode_":inputs["param_mode"].getValue(),
						"__id_": n++
					});   
					
					
                }
                
			}
			this._formCommand.getInput("d").setValue(JSON.stringify(_data));
			

		}

		test(){
			alert("hello world!");
		}

		clearForm(){
			if(this.panelListCommands){
				this.panelListCommands.text("");
			}
			
			alert("borrando")
		}

		valid(){
			
			this.getDetail({});
			return true;
		}
	}

	return Command;

})(_sgQuery);