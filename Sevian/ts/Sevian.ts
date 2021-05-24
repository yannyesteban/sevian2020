import {_sgQuery}  from './Query.js';
import {BlockingLayer}  from './BlockingLayer.js';
import {sgAjax, sgJson, sgFragment} from './Ajax.js';
import { Form2 as Form2 } from './Form2.js';
import {Grid2 as Grid2} from './Grid2.js';
import {Menu as Menu} from './Menu2.js';
import {Float}  from './Window.js';
//import {GTInfo}  from '../../gt/ts/Info.js';
//import {GTUnit}  from '../../gt/ts/Unit.js';
//import {Site as GTSite}  from '../../gt/ts/Site.js';
//import {GTHistory}  from '../../gt/ts/History.js';
import {InfoForm}  from '../../sevian/ts/InfoForm.js';

export var S = (($) => {

	type ParamElement = number | string | object;
	interface InfoElement {
		id: any;
		option: any;
		type: string;
	};
	interface  Param {

		async?: boolean,
		element?:ParamElement,
		id?:ParamElement,
		valid?:boolean,
		confirm?:string,
		params?: object,
		form?: FormData,
		data?: object,
		blockingTarget?: BlockingLayer,
		define?: { [name: string]: (config) => void },
		//onsubmit:()=>void,
		window?:{
			name:"",
			show:true,
			mode:"",
			title:"Basic Menu",
			set:{
				width:"400px",
				height:"600px;"
			}
		},
		onRequest?:Function
	};
	interface ITask{
		t: string;
		id: string;
		element: string;
		name: string;

	}
	interface  InfoParam {

		async: boolean,
		panel:number,
		valid:boolean,
		confirm:string,
		params: object,
		//onsubmit:()=>void,
		window:{
			name:"",
			show:true,
			mode:"",
			title:"Basic Menu",
			set:{
				width:"400px",
				height:"600px;"
			}
		}
	};

    let _winOptions = {
		visible: true,
		caption: "",
		left: "center",
		top: "middle",
		//width: "500px",
		//height: "500px",
		mode: "custom"
	};
    class Sevian{

		private static instance = null;
		private static sw = 0;
		private static sw2 = 0;

		private static wins:any[] = [];
		private static elements:any[] = [];
		private static request:any[] = [];
		private static jsComponents:any[] = [];
		private static components:any[] = [];
		private static modules:any[] = [];



		static _e:object[] = [];
		static _w:object[] = [];
		static _components:object[] = [];
		static defaultPanel:any = 0;

		static msg:object = null;

		static blockingLayer:BlockingLayer = null;
		static test(){
			alert("hello i am sevian");
		}

		static load(info:any){
			for(var x in info){
                if(this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

			this.winInit(this.wins);
			this.init(this.elements);
			this.requestPanel(this.request);
			this.setComponents(this.jsComponents);
			this.setModules(this.modules);
		}
		static winInit(info:any){
			for(let win of info){

				this._w[win.name] = new Float.Window(win);
			}
		}
		static getElement(id){
			return this._e[id];
		}

		static requestPanel(p){
			console.log(p)
			//let p = JSON.parse(xhr.responseText);

			if(p.panels){
				for(var x in p.panels){
					sgJson.iPanel(p.panels[x]);
					if(this._w[p.panels[x].id]){
						this._w[p.panels[x].id].setCaption(p.panels[x].title);

						this._w[p.panels[x].id].show();
					}else{
						if(this.defaultPanel == p.panels[x].id){
							document.title = p.panels[x].title;
						}

					}

				}
			}
			if(p.config){
				this.init(p.config);
			}
			if(p.update){
				this.updatePanel(p.update);
			}

			if(p.components){
				this.setComponents(p.components);
			}
			if(p.fragments){
				for(var x in p.fragments){
					switch(p.fragments[x].token){
						case "fragment":
							sgJson.iFragment(p.fragments[x]);
							break;
						case "dataInput":
							sgJson.iDataInput(p.fragments[x]);
							break;
						case "propertyHTML":
							sgJson.iPropertyHTML(p.fragments[x]);
							break;
						case "objectData":
							sgJson.iFragment(p.fragments[x]);
							break;
						case "message":

							this.msg = new Float.Message(p.fragments[x]);
							this.msg.show({});
							break;

					}
				}
			}


			if(p.debug){

				for(let msg of p.debug){
					db (msg);
				}


			}
        }
		static setModules(modules){
			modules.forEach(element => {
				this.register(element.name, element.component);
			});


		}
		static register(name, component){
			this.components[name] = component;
		}
		static init(info:InfoElement[]){

            for(var x of info){
				console.log(this.components[x.type])
                if(this.components[x.type] && x.option !== null){

					if(this._e[x.id]){

						delete this._e[x.id];
					}


					this._e[x.id] = new this.components[x.type](x.option);//x.option

                }
            }
        }
		static init2(info:object[]){

            for(var x of info){
				alert(x.type)
                if(window[x.type] && x.option !== null){

					if(this._e[x.id]){

						delete this._e[x.id];
					}
					this._e[x.id] = new window[x.type](x.option);

                }
            }
        }


        static updatePanel(panels){

			for(let x of panels){

				if(this._e[x.id] && x.actions){

					for(let y of x.actions){
						if(y.property !== undefined){
							this._e[x.id][y.property] = y.value;
						}
						if(y.method !== undefined){
							if(y.args !== undefined){
								this._e[x.id][y.method](...y.args);
							}else if(y.value !== undefined){
								this._e[x.id][y.method](y.value);
							}
						}
					}
				}
			}
		}

        static getForm(id:number){
            return $().query(`form[data-sg-type="panel"][data-sg-panel="${id}"]`);
        }

		static go(info: Param) {
			this.send3(info);
		}
		static send3(info:any){
			console.log("send3");
			if(info.confirm && !confirm(info.confirm)){
				return false;
			}

			if(info.window){
				this.configWin(info.window);
			}

			let elem = null;

			if(!isNaN(info.element)){
				elem = this.getElement(info.element);
			}else if(typeof(info.element) === "string"){
				elem = this.getElement(info.element);
			}else if(typeof(info.element) === "object"){
				elem = info.element;
			}
			if(elem){
				if(info.valid && elem.valid && !elem.valid(info.valid)){
					return false;
				}
				if(info.onsubmit && elem.onsubmit && !elem.onsubmit()){
					return false;
				}
			}



			let form = null;
			let formData = null;
			let params = "";

            if(info.params){
				if(typeof(info.params) === "object"){
					params = JSON.stringify(info.params);
				}else{
					params = info.params;
				}
            }
			if(info.form){
				if (typeof info.form === "string"){
					form = document.getElementById(info.form);
				}
				if(info.form instanceof HTMLFormElement){
					form = info.form;
				}
				if(info.form instanceof FormData){
					formData = info.form;
				}

			}else if(this.getForm(info.id)){

				form = this.getForm(info.id);
			}

			if(form){
				if(!info.async){
					if(form.__sg_sw.value === form.__sg_sw2.value){
						if (form.__sg_sw.value != 1){
							form.__sg_sw.value = 1;
						}else{
							form.__sg_sw.value = 0;
						}
					}
					form.__sg_params.value = params;
					form.__sg_async.value = info.async? 1: 0;
					form.submit();
					return false;
				}


				formData = new FormData(form);
			}

			if(!formData){
				formData = new FormData();
			}

			formData.set("__sg_panel", info.id);
			formData.set("__sg_ins", Sevian.instance);
			formData.set("__sg_sw", Sevian.sw);
			formData.set("__sg_params", params);
			formData.set("__sg_async", info.async);




			if (info.async) {

				let blockingLayer:BlockingLayer = null;
				if (info.blockingTarget !== undefined) {
					blockingLayer = new BlockingLayer({});

					blockingLayer.show((info.blockingTarget && info.blockingTarget.get()) || this.getForm(info.id));

				}
				let fun;

				let _onRequest = info.onRequest || (xhr => {});
				if (info.requestFunction) {
					fun = info.requestFunction;
				}else{
					/*fun = (xhr) => {
						this.requestPanel(JSON.parse(xhr.responseText));
					}*/
					fun = (json) => {
						this.requestPanel(json);
					}
				}

				fetch("",{
					method: "post",
					body:formData,
					headers:{
						//'Content-Type': 'application/json'
					  }

				}).then(res => (res.json()))
				.catch(error => {
					console.error("Error:", error);
					if (blockingLayer) {
						blockingLayer.hide();
					}

				})
				.then(json => {

					//this.requestPanel(json);
					fun(json);
					if (blockingLayer) {
						blockingLayer.hide();
					}
					_onRequest(json);
				});

				return;


				var ajax = new sgAjax({
					url: "",
					method: "post",
					form: formData,

					onSucess:(xhr) => {
						fun(xhr);
						_onRequest(xhr);
					},


					onError: function(xhr){

					},
					waitLayer:{
						class: "wait",
						target: $.create("div").get(),
						message: false,
                        icon: ""
                    },

				});


				ajax.send();
				return false;

			}else{
				// gererate a HTMLElementForm and submit !!!
			}

        }
		static send2(info/*:InfoParam*/){
			console.log("send2");
			if(info.confirm && !confirm(info.confirm)){
				return false;
			}

			if(!info.async){
				if(info.form){
					let HTMLForm = null;
					if ( typeof info.form === "string" ){
						HTMLForm = document.getElementById(info.form);
					}
					if ( typeof info.form === "number" ){
						HTMLForm = this.getForm(info.form);
					}

					if(info.form instanceof HTMLFormElement){
						HTMLForm = info.form;
					}

				}
			}else{

			}


			if(info.form){
				let form = null;
				if ( typeof info.form === "string" ){
					form = document.getElementById(info.form);
				}
				if ( typeof info.form === "number" ){
					form = this.getForm(info.form);
				}

				if(info.form instanceof HTMLFormElement){
					form = info.form;
				}
				if(info.form instanceof FormData){
					alert("FormData")
				}
				if ( typeof info.form === "object" ){
					alert("object")
				}
			}
			return;

			let panel;

			if(info.panel === undefined || panel <= 0){
				panel = this.defaultPanel;
			}else{
				panel = info.panel;
			}

			var f = this.getForm(panel);

            if(!f){

                f = this.addPanel(panel);
            }

			if(info.window ){
				let win, winName;

				if(info.window.name){
					winName = info.window.name;
				}else{
					winName = info.panel;
				}

				if(this._w[winName]){
					win = this._w[winName];
				}else{
					win = this._w[winName] = this.createWindow(info.window);
				}

				if(info.window.panel){
					win.setBody(this.getForm(info.window.panel));
				}else{
					//win.setBody(f);
				}
				//alert(winName);
				//win.show();
				/*
				if(info.window.name && this._w[info.window.name]){
					win = this._w[info.window.name];

				}else if(this._w[info.panel]){
					win = this._w[info.panel];
				}else if(info.window.name){
					win = this._w[info.window.name] = this.createWindow(info.window);
					this._w[info.window.name].setBody(f);
					//this._w[info.window.name].show({left:"center",top:"middle"});

				}else{
					win = this._w[panel] = this.createWindow(info.window);
					this._w[panel].setBody(f);
					//this._w[panel].show({left:"center",top:"middle"});
				}*/
				if(info.window.caption){
					win.setCaption(info.window.caption);
				}
				if(info.window.mode){
					win.setMode(info.window.mode);
				}
				if(info.window.show === true){
					win.show();
				}else if(info.window.show === false){
					win.setVisible(false);
				}else if(info.window.show){
					win.show(info.window.show);
				}


			}


			if(info.valid === true && panel && this._e[panel] && this._e[panel].valid && !this._e[panel].valid()){
				return false;
			}

			if(panel && this._e[panel] && this._e[panel].onsubmit && !this._e[panel].onsubmit()){
				return false;
			}

			let dataForm = null;
            let params = "";

            if(info.params){
				if(typeof(info.params) === "object"){
					params = JSON.stringify(info.params);
				}else{
					params = info.params;
				}
            }


			if(info.window){

				if(!this._w[panel]){
					//this._w[panel] = this.createWindow(info.window);
					//this._w[panel].setBody(f);
					//this._w[panel].show({left:"center",top:"middle"});
				}

				if(this._w[panel]){
					//this._w[panel].setBody(f);
					//this._w[panel].show({left:"center",top:"middle"});

				}

			}

            if(f){

				if(f.__sg_sw.value === f.__sg_sw2.value){
					if (f.__sg_sw.value != 1){
						f.__sg_sw.value = 1;
					}else{
						f.__sg_sw.value = 0;
					}
				}
				f.__sg_params.value = params;
				f.__sg_async.value = info.async? 1: 0;

				dataForm = new FormData(f);

			}else{

				dataForm = new FormData();
				dataForm.append("__sg_panel", panel);
				dataForm.append("__sg_ins", info.INS);
				dataForm.append("__sg_sw", info.SW);
				dataForm.append("__sg_params", params);
				dataForm.append("__sg_action", info.action || "");
				dataForm.append("__sg_async", true);
			}






            if(info.async){
				let fun;

				if(info.requestFunction){
					fun = info.requestFunction;
				}else{

					fun = (xhr) => {
						this.requestPanel(JSON.parse(xhr.responseText));
					}
				}



				var ME = this;
				var ajax = new sgAjax({
					url: "",
					method: "post",
					form: dataForm,

					_onSucess:(xhr) => {
						this.requestPanel(JSON.parse(xhr.responseText));
					},
					onSucess:fun,

					onError: function(xhr){

					},
					waitLayer:{
						class: "wait",
						target: f,
						message: false,
                        icon: ""
                    },

				});


				ajax.send();
				return false;
			}else{
				f.submit();
				return false;
			}

        }

        static send(info/*:InfoParam*/){

			console.log(info)
			if(info.confirm && !confirm(info.confirm)){
				return false;
			}

			let panel;

			if(info.panel === undefined || panel <= 0){
				panel = this.defaultPanel;
			}else{
				panel = info.panel;
			}

			var f = this.getForm(panel);

            if(!f){

                f = this.addPanel(panel);
            }

			if(info.window ){
				let win, winName;

				if(info.window.name){
					winName = info.window.name;
				}else{
					winName = info.panel;
				}

				if(this._w[winName]){
					win = this._w[winName];
				}else{
					win = this._w[winName] = this.createWindow(info.window);
				}

				if(info.window.panel){
					win.setBody(this.getForm(info.window.panel));
				}else{
					//win.setBody(f);
				}
				//alert(winName);
				//win.show();
				/*
				if(info.window.name && this._w[info.window.name]){
					win = this._w[info.window.name];

				}else if(this._w[info.panel]){
					win = this._w[info.panel];
				}else if(info.window.name){
					win = this._w[info.window.name] = this.createWindow(info.window);
					this._w[info.window.name].setBody(f);
					//this._w[info.window.name].show({left:"center",top:"middle"});

				}else{
					win = this._w[panel] = this.createWindow(info.window);
					this._w[panel].setBody(f);
					//this._w[panel].show({left:"center",top:"middle"});
				}*/
				if(info.window.caption){
					win.setCaption(info.window.caption);
				}
				if(info.window.mode){
					win.setMode(info.window.mode);
				}
				if(info.window.show === true){
					win.show();
				}else if(info.window.show === false){
					win.setVisible(false);
				}else if(info.window.show){
					win.show(info.window.show);
				}


			}


			if(info.valid === true && panel && this._e[panel] && this._e[panel].valid && !this._e[panel].valid()){
				return false;
			}

			if(panel && this._e[panel] && this._e[panel].onsubmit && !this._e[panel].onsubmit()){
				return false;
			}

			let dataForm = null;
            let params = "";

            if(info.params){
				if(typeof(info.params) === "object"){
					params = JSON.stringify(info.params);
				}else{
					params = info.params;
				}
            }


			if(info.window){

				if(!this._w[panel]){
					//this._w[panel] = this.createWindow(info.window);
					//this._w[panel].setBody(f);
					//this._w[panel].show({left:"center",top:"middle"});
				}

				if(this._w[panel]){
					//this._w[panel].setBody(f);
					//this._w[panel].show({left:"center",top:"middle"});

				}

			}

            if(f){

				if(f.__sg_sw.value === f.__sg_sw2.value){
					if (f.__sg_sw.value != 1){
						f.__sg_sw.value = 1;
					}else{
						f.__sg_sw.value = 0;
					}
				}
				f.__sg_params.value = params;
				f.__sg_async.value = info.async? 1: 0;

				dataForm = new FormData(f);

			}else{

				dataForm = new FormData();
				dataForm.append("__sg_panel", panel);
				dataForm.append("__sg_ins", info.INS);
				dataForm.append("__sg_sw", info.SW);
				dataForm.append("__sg_params", params);
				dataForm.append("__sg_action", info.action || "");
				dataForm.append("__sg_async", true);
			}






            if(info.async){
				let fun;

				if(info.requestFunction){
					fun = info.requestFunction;
				}else{

					fun = (xhr) => {
						this.requestPanel(JSON.parse(xhr.responseText));
					}
				}



				var ME = this;
				var ajax = new sgAjax({
					url: "",
					method: "post",
					form: dataForm,

					_onSucess:(xhr) => {
						this.requestPanel(JSON.parse(xhr.responseText));
					},
					onSucess:fun,

					onError: function(xhr){

					},
					waitLayer:{
						class: "wait",
						target: f,
						message: false,
                        icon: ""
                    },

				});


				ajax.send();
				return false;
			}else{
				f.submit();
				return false;
			}

        }

		sendForm(info){

		}
		static setComponents(info){

			let c;
			for(let x of info){

				switch(x.mode){

					case "create":
						c = this._components[x.name] = new window[x.type](x.info);
						break;
					case "setting":
						for(let y of x.info){
							if(y.property !== undefined){
								c[y.property] = y.value;
							}
							if(y.method !== undefined){
								if(y.args !== undefined){
									c[y.method](...y.args);
								}else if(y.value !== undefined){
									c[y.method](y.value);
								}
							}

						}

						break;
					case "delete":
					break;


				}

				//db (x)
				//this._e[x.panel] = new window[x.type](x.option);
			}
		}


        static createWindow(info){

			info.left = "center";
			info.top = "middle";
            let _win = new Float.Window(info || _winOptions);


			return _win;

        }

		static configWin(wins){

			if(Array.isArray(wins)){
				for(let w of wins){
					this._configWin(w);
				}
			}else{
				this._configWin(wins);
			}
		}

		static _configWin(info){
			if(!info.name){
				return;
			}

			let win = null;

			if(this._w[info.name]){
				win = this._w[info.name];
			}else{
				info.left = info.left || "center";
				info.top = info.top || "top";
				win = new Float.Window(info);
				return;
			}

			if(info.child){
				win.setBody(this.getForm(info.child));
			}

			if(info.caption){
				win.setCaption(info.caption);
			}

			if(info.mode){
				win.setMode(info.mode);
			}

			if(info.show === true){
				win.show();
			}else if(info.show === false){
				win.setVisible(false);
			}else if(info.show){
				win.show(info.show);
			}
		}

        static addPanel(id:number){

            let form = $().create({
                "tagName": "form",
                "action":'',
                "name":`form_p${id}`,
                "id":`form_p${id}`,
                "method": "GET",
                "enctype": 'multipart/form-data'
			}).ds("sgPanel", id).ds("sgType", "panel");
			form.create({
				"tagName":"input",
				"type":"text",
				"name":"__sg_async"
			});

			form.create({
				"tagName":"input",
				"type":"text",
				"name":"__sg_params"
			});
			form.create({
				"tagName":"input",
				"type":"text",
				"name":"__sg_sw"
			});
			form.create({
				"tagName":"input",
				"type":"text",
				"name":"__sg_sw2"
			});


			return form.get();

        }
    }

    return Sevian;
})(_sgQuery);

S.register("Form2", Form2);
S.register("Grid2", Grid2);
S.register("Menu", Menu);
//.register("GTInfo", GTInfo);
//S.register("GTUnit", GTUnit);
//S.register("GTHistory", GTHistory);
S.register("InfoForm", InfoForm);
//S.register("GTSite", GTSite);


S.go({
	async: true,
	form: null,
	data: {},
	define: {
		hola: (e)=>alert(e),
	},
	task: [
		{}
	]

})