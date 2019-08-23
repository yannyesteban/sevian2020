//import { Query as $} from './Query.js';

(function($){
class Tab{
    target: any = false;
    name: string = "";
    id: any = 0;
    value: any = 0;
    mode:string = "";
    className:string = "";
    pages:any = [];

    onOpen = (index:number)=>{return true};
	onClose = (index:number)=>{return true};
    constructor(opt: any){
        
        for(var x in opt){
            if(this.hasOwnProperty(x)) {
             
                this[x] = opt[x];
            }
        }
       
        let _target = $(this.target);
        if(_target){
            
           this.create();
            
        }else{
            this.load();
        }
    }

    load(){
       
        let main = $(this.id);
        main.addClass("sg-tab");
        let tab_parts = main.childs();

        let menu = tab_parts[0];
        let page = tab_parts[1];

        let mItem = menu.children;

        for(let i=0; i<mItem.length;i++){
            $(mItem[i]).on("click", this._click(i)).on("focus", this._click(i)).removeClass("sg-tab-active"); 
        }
        $(menu).addClass("sg-tab-menu");
        $(page).addClass("sg-tab-body");
        
        this.setValue(this.value);

    }

    create(){

        let _target = $(this.target);
        
            
        _target.create({
            tagName:"div",
            id:this.id,
            className: this.className})

            .ds("sgType", "sg-tab")
            .addClass("sg-tab")
            .add({
                "tagName": "div",
                "className": "sg-tab-menu"
            })
            .add({
                "tagName": "div",
                "className": "sg-tab-body"
            });
        if(this.pages){
            for(var x in this.pages){
                if(this.pages.hasOwnProperty(x)){
                    this.add(this.pages[x]);
                }
                
            }
            
        }

    }

    add(opt:any){
        let main = $(this.id);
        
        let tab_parts = main.childs();
        let menu = tab_parts[0];
        let page = tab_parts[1];

        let index = menu.children.length;
        

        $(menu).create("a").on("click", this._click(index)).on("focus", this._click(index))
        .addClass("sg-tab-imenu")
        .text(opt.title || "")
        .attr("href", "javascript:void(0);")
        
        .ds("sgTabIndex",index)

        return;
        var iBody = this._body.create("div");
        iBody.addClass("sg-tab-ibody");
        if(opt.child){
            iBody.append(opt.child);
        }
        
        iBody.ds().sgTabIndex = this._index;
        
        this.item[this._index] = {iMenu: iMenu, iBody: iBody};
        
        if(this.value === this._index){
            this.setVisible(this._index, true);
        }
        
        return this.item[this._index++];
    }

    _click(index: any){
        var ME = this;
        return function(){
            ME.show(index);
        };
        
    }
    setVisible(index: any, value: any){
        
        let main = $(this.id);
        
        let tab_parts = main.childs();
        let menu = tab_parts[0];
        let page = tab_parts[1];

        let mItem = menu.children;
        let pItem = page.children;

        if(mItem[index] && pItem[index]){
            
            if(value){
                $(mItem[index]).addClass("sg-tab-active");
                $(pItem[index]).addClass("sg-tab-active");
            }else{
                $(mItem[index]).removeClass("sg-tab-active");
                $(pItem[index]).removeClass("sg-tab-active");
            }
        }

        
    }
    
    show (index: any){
        if(index === this.value){
            return false;
        }
        if(this.value !== false){
            var onClose = this.onClose(index);
            
            if(onClose === undefined || onClose === true){
                this.setVisible(this.value, false);
            }else{
                return false;
            }
        }
        
        this.setVisible(index, true);
        this.value = index;
        this.onOpen(index);
        return true;
    }
    
    setValue(index){
        this.value = false;
        this.show(index);
        
    }
    setMode(mode:string){
        $(this.id).removeClass(this.mode)
        .addClass(mode)
        .ds("sgMenuMode", mode);
        
        this.mode = mode;
    }
    getMode(){
        return this.mode;	
    }
    
}
    


let tab = new Tab({
    "id":"tab01"
});



let tab2 = new Tab({
    target: "tabii",
    id:"tab_x01",
    pages:[
        {
            title:"tab001",
        },
        {
            title:"tab0012",
        },
    ],

    
});
})(_sgQuery);
const Input = (($) => {
    class Input{
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

    return Input;
})(_sgQuery);


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

const Form = (($) => {

class Form{
    target: any;
    name: any;
    id: any;
    value: any;
    constructor(opt: any){
        this.target = false;
        this.name = "";
        for(var x in opt){
			if(this.hasOwnProperty(x)) {
				this[x] = opt[x];
			}
        }
        
        let _target = $(this.target);
        if(_target && _target.get().tagName != "FORM"){
            
            let form = _target.create({
                tagName:"form",
                name:this.name}).ds("sgType", "sg-form");
        }
    }

    create(){

    }

    
}

return Form;

})(_sgQuery);

let F = new Form({
    target: "_f100",
    name:"form_100"


});