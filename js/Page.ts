const Page = (($) => {

    class Page{
        target: any;
        name: any;
        id: any;
        value: any;
        constructor(opt: any){
            this.target = false;
            for(var x in opt){
                if(this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
        }
    
    
    }
    
    return Page;
    
    })(_sgQuery);