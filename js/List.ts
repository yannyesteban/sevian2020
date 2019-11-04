
var List = (($) => {  
    let acute = function(str){
        if(str === undefined){
            return false;
        }
        
        str = str.toLowerCase()
        str = str.replace(/á/gi,"a");
        str = str.replace(/é/gi,"e");
        str = str.replace(/í/gi,"i");
        str = str.replace(/ó/gi,"o");
        str = str.replace(/ú/gi,"u");
        str = str.replace(/ñ/gi,"n");
        return str;
        
	};

    class ListMenu{
        id:any = "";
        target:any = null;
        className:any = null;
        data:any = [];
        value:any = null;
        input:object = null;
        _main:object = null;
        _active:boolean = false;
        _index:number = -1;
        
        constructor(info:any){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = (this.id)? $(this.id): false;

            if(main){
                
                if(main.ds("sgListMenu")){
                    return;
                }
    
                if(main.hasClass("sg-list-menu")){
                    this._load(main);
                }else{
                    this._create(main);
                }
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                this._create(main);
            }

            main.ds("sgListMenu", "list-menu");
            main.on("mousemove", event => {
                if(event.target.classList.contains("option")){
                    
                    this.setIndex(event.target.dataset.index * 1);
                }
            });
            
            main.on("click", event => {
                if(event.target.classList.contains("option")){
                    this._index = event.target.dataset.value;
                    this.selectValue(event.target.dataset.value);
                }
            });

            $().on("mousedown", (event) => {
                if(this._main.get().contains(event.target)){
                    return false;
                }

                this.active(false);
            });

            $(document).on("blur", (event) => {
               this.active(false);
            });

            this.setInput(this.input);
            
            let target = (this.target)? $(this.target): false;
            if(target){
                target.append(this._main);
            }
        }

        _create(main:any){
            this._main = main.addClass("list-menu").addClass(this.className).addClass("close");;
            Float.Float.init(main.get())
        }

        _load(main:any){

        }

        get(){
            return this_main;
        }
        
        setText(index:number){
            let item = this._main.query(`.option[data-index='${index}']`);
            if(item){
                this.input.val(this.data[$(item).ds("value")].text);
            }
        }

        selectValue(index){
            let item = this._main.query(`.option[data-index='${index}']`);
            if(item){

                this.input.val(this.data[$(item).ds("value")].text);

                alert(8)
                this.setValue(this.data[$(item).ds("value")].value);
                
            }
            this.active(false);
        }
        
        setData(data){
            this.data = data;
        }
        
        setValue(value:any){
            
            if(value !== this.value){
                this.value = value;
                this.input.fire("change");
            }
            
        }
        
        getValue(){
            return this.value;
        }

        setFilter(filter, showAll:boolean = false){
           
            //this.filter = filter;
            this._main.text("");


            this._index = -1;
            
            let item:any = null;
            let index = 0, value:number = null;
            this.data.forEach((d, i)=>{

                if(showAll || filter === "" || acute(d.text).indexOf(acute(filter)) >= 0){
					
                    item = this._main.create("div")
                    .ds("value", i)
                    .ds("index", index).addClass("option").append(d.item);

                    if(acute(d.text) === acute(filter)){
                        value = index;
                    }
                    
					index++;
				}
            });

            if(value !== null){
                this.setIndex(value);
            }
           
            if(filter === ""){
                this._main.get().scrollTop = "0px";
            }

        }

        active(value){

            if(this._active === value){
                return;
            }

            this._active = value;

            if(value){
                this._main.addClass("active");
                this.show();
            }else{
                this._main.removeClass("active");
                this.hide();
            }

        }

        getActive(){
            return this._active;
        }

        show(){
           this._main.removeClass("close");
           Float.Float.showMenu({
                context:this.input.get(),
                e:this._main.get(),
                left:"left",
                top:"down"
           });
        }

        hide(){
            this._main.addClass("close");
        }
        
        move(step){
            this.setIndex(this._index + step);
        }  

        setIndex(index:number){

            if(index === this._index){
				return;
			}

            let items = this._main.queryAll(".option");

            if(index < 0){
                index = 0; 
            }else if(index >= items.length - 1){
                index = items.length - 1;
            }

            let item = $(this._main.query(".option.active"));

            if(item){
                item.removeClass("active");
            }

            $(items[index]).addClass("active");

            let offsetTop = items[index].offsetTop;
            let height = items[index].offsetHeight;
            let popup = this._main.get();

            if(offsetTop <= popup.scrollTop){
				popup.scrollTop = offsetTop;
			}else if(offsetTop + height >= popup.offsetHeight + popup.scrollTop){
				popup.scrollTop = offsetTop + height - popup.offsetHeight;
            }

            this._index = index;

        }

        setInput(input:any){
            input.on("keyup", event => {
                this._keyUp(event);
            }).on("keydown", event => {
                this._keyDown(event);
            }).on("focus", event => {
                this.setFilter(event.currentTarget.value, true);
                this.active(true);
            }).on("click", event => {
                this.active(true);
            }).on("change", event => {
                if(this.data[this._index] === undefined || event.currentTarget.value !== this.data[this._index].text){
                    this._index = -1;
                    this.value = null;
                    event.currentTarget.value = "";
                }
            });
        }
        _keyUp(event){
            if(event.keyCode !== 13 
                && event.keyCode !== 37
                && event.keyCode !== 39
                && event.keyCode !== 38 && event.keyCode !== 40 && event.keyCode !== 9){
                this.active(true);
                this.setFilter(event.currentTarget.value);
            }
        }

        _keyDown(event){

            switch (event.keyCode){
                case 9://tab
					this.active(false);
                    break;
                case 13://enter
                    this.selectValue(this._index);
                    break; 
				case 27://escape
					break;
				case 38://up arrow 
					this.move(-1);
					break;
				case 40://down arrow
					this.move(1);
					break;
				default:
                    this.active(true);
					break;
				}// end switch
        }
    }
    
    class List{
        target:object = null;
        id:string = "";
        name:string = "";
        type:string = "";
        value:string = "";
        className = "";
        data:any = false;
        propertys:object = {};
        dataset:object = null;
        style:object = {};
        events:any = false;
        placeholder:string = "";
        rules:object = null;

        childs:boolean = false;
        parent:string = "";
        parentValue:any = null;

        _main:object = null;
        _input:object = null;
        _index:number = -1;
        status:string = "valid";
        mode:string = "request";

        evalChilds:any = () => {};

        constructor(info: any){
            
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            let main = this._main = (this.id)? $(this.id): false;

            if(!main){
                
                this._create(false);
            }else{
                
                if(main.ds("sgInput")){
                    return;
                }
            }

            let target = (this.target)? $(this.target): false;

            if(target){
                target.append(this._main);
            }
            
        }

        _create(target:any){
            let info = {};
            
            if(this.id){
                info.id = this.id;
            }
            if(this.name){
                info.name = this.name;
            }
            if(this.value){
                info.value = this.value;
            }
            info.tagName = "input";
            info.type = "text";

            this.value = "";

            this._main = $.create("div").addClass("type-input").addClass("sg-input-list").addClass(this.className);
            this._input = this._main.create(info);
            

            let data = [];

            if(this.parent){
                this.data.forEach((d)=>{
                    if(!data[d[2]]){
                        data[d[2]] = {};
                    }
                    
                    data[d[0]] = {
                        value: d[0],
                        text: d[1],
                        item: d[1]
                    };
                });
            }else{
                data[0] = [];
                this.data.forEach((d)=>{
                    data[0].push({
                        value: d[0],
                        text: d[1],
                        item: d[1]
                    });
                });
            }
            
            this.menu = new ListMenu({
                input: this._input.prop("autocomplete", "off"),
                data : data[0],
                target: this._main
            }); 


            for(var x in this.events){

                //let action = $.bind(this.events[x], this._main);
				this._input.on(x, $.bind(this.events[x], this, "event"));
			}
            
            if(this.childs){
                
                this._main.on("change", $.bind(this.evalChilds, this, "event")); 
            }

			this._input.prop(this.propertys);
			this._input.style(this.style);

            if(this.data){
				//this.createOptions(this.parentValue);
            }
            this._main.ds(this.dataset);

            this._main.ds("sgName", this.name);
            this._main.ds("sgInput", "input");
            this._main.ds("sgType", this.type);
            if(this.parent){
                this._main.ds("parent", this.parent);
            }
            if(this.childs){
                this._main.ds("childs", "childs");
            }
            
            this.setValue(this.value);
        }
        setValue(value:any){
			this._input.get().value = value;
        }
        
        getValue(){
            return this._input.get().value;
		}

        _load(main:any){

        }

        get(){
            return this._main.get();
        }

        hasChilds(){
            if(this._main.ds("childs")){
                return true;
            }
            return false;
        }
        createOptions(parentValue:any){
            
            

			let i,
				option,
				vParent = [];
			
                this._main.get().length = 0;
			
			if(this.parent){
                let aux = (parentValue + "").split(",");
                
                
				for(i = 0; i < aux.length; i++){
					vParent[aux[i]] = true;
				}
			}
	
			if(this.placeholder){
			
            }
            
            let e = this._popup = this._main.create("div").addClass("list-popup");

            


			for (i in this.data){
				if(vParent[this.data[i][2]] || !this.parent || this.data[i][2] === "*"){
                    e.create("div").addClass("option").ds("value", this.data[i][0]).text(this.data[i][1]);
				}
			}
			
        }
        
        evalOptions(parentValue:any){

        }

        getName(){
            return this._main.get().name;
        }
        getId(){
            return this._main.get().id;
        }
        getText(){
            if(this._main.get().type){
                alert(8)
            }
        }
        ds(prop, value){
            this._main.ds(prop, value);
        }
        focus(){
            this._main.get().focus();
            
        }
        select(){
            this._main.get().select();
        }

        _keyUp(event){
            
            if(event.keyCode !== 38 && event.keyCode !== 40 && event.keyCode !== 9){
                this._evalText(event.currentTarget.value);
            }
        }

        _keyDown(event){
            switch (event.keyCode){
                case 13://enter
                    break; 
                    case 9://tab
					//this.hide();
					break;
				case 27://escape
					//e.returnValue = false;
					//e.cancelBubble = true;
					break;
				
				case 38://up arrow 
		
					this.move(-1);
					break;
				case 40://down arrow
						
					
					this.move(1);
					break;
				default:
					break;
				}// end switch
        }
        _setFilter(filter:string){
            this._index = -1;
            let cont = $(this._main.query(".list-popup"));
           
            cont.text("");
            let item:any = null;
            for(var x in this.data){
			
			
				
				let text = this.data[x][1];
				
				if(filter === "" || acute(text).indexOf(acute(filter)) >= 0){
					
					item = cont.create("div").addClass("option").text(this.data[x][1]);
					
				}
			}
        }
        move(step){
            this._index += step;
            let items = this._main.queryAll(".list-popup > .option");
            if(this._index<0){
                this._index = 0; 
            }
            
            if(this._index >= items.length - 1){
                this._index = items.length - 1;
            }
            

            let item = $(this._main.query(".list-popup > .option.active"));

            if(item){
                item.removeClass("active");
            }
            

            $(items[this._index]).addClass("active");


            var offsetTop = items[this._index].offsetTop;
            var height = items[this._index].clientHeight;
            
            db (offsetTop + "..."+height)
			//option.style.color = "white";
			//option.style.backgroundColor = "rgba(167,8,8,1.00)";
            let popup = this._popup.get()
            //popup.style.position = "relative";
			if(offsetTop <= popup.scrollTop){
				popup.scrollTop = offsetTop;
			}else if(offsetTop + height >= popup.clientHeight + popup.scrollTop){
				popup.scrollTop = offsetTop + height - popup.clientHeight;
			}




        }
    }
    
    I.register("list", List);
    return List;
})(_sgQuery);