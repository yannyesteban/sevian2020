import {_sgQuery as $} from './Query.js';


export class BlockingLayer{
	private id:any = null;
	private main:any = null;
	private target:any;
	private className:string = "";
	private message:string = "";
	constructor(info){
			
		for(var x in info){
			if(this.hasOwnProperty(x)) {
				this[x] = info[x];
			}
		}
		
	}

	setTarget(target){
		this.target = target;
		target.append(this.main.get());
	}
	create(){

		const main = $.create("div").attr("id", this.id || null);

		
		main.addClass("blocking-layer");
		if(this.className) {
            main.addClass(this.className);
        }

		main.style({
            position: "absolute",
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px"

        });
		if (this.message) {
            main.text(this.message);
        }

		this.main = main;
        
	}

	show(target) {
		if(!this.main){
			this.create();
		}
		let elementStyle = window.getComputedStyle(target);
		let position = elementStyle.getPropertyValue('position');
		if(position === "static"){
			target.style.position = "relative";
		}
		
		this.setTarget(target);

    }

    hide(){
		this.main.remove();
		this.main = null;
    }
}
