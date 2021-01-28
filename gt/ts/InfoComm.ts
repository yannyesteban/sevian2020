var InfoComm = (($) => {

    class InfoComm{
        public id:any = null;
        public target:any = null;
        public mainClass:string = "";
        private main:any = null;
        constructor(info){
            
            //console.di(info);
            for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }


            let main = (this.id)? $(this.id): false;
            
            if(main){
            
                
    
            }else{
                main = $.create("div").attr("id", this.id);
                
                
            }
            
            this._create(main);
        }

        _create(main:any){
			this.main = main;
            main.addClass(this.mainClass);
            let mainPanel = main.create("div").addClass("mainPanel").id("xxy");

        }
        public add(options:any){

        }
    }

    return InfoComm;
})(_sgQuery);