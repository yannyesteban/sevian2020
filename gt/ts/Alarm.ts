import { _sgQuery as $, SQObject } from '../../Sevian/ts/Query.js';
import {Menu as Menu} from '../../Sevian/ts/Menu2.js';
import { Float } from '../../Sevian/ts/Window.js';
import {I, Input, Hidden, InputDate, InputInfo, Multi}  from '../../Sevian/ts/Input.js';
import { Form2 as Form } from '../../Sevian/ts/Form2.js';
import {Tab}  from '../../Sevian/ts/Tab.js';
import { S } from '../../Sevian/ts/Sevian.js';


export class Alarm {
    public id: any = null;
    public caption: string = "";

    public className: any = null;
    private main: any = null;
    private target: any = null;

    private listInput: any = null;

    private wins: any[] = [];
    private forms: Form[] = [];
    private tab: Tab = null;

    private data: {alarm:any, geofence:any, mark:any, input:any, unit:any}[] = [];
    //private alarmData: any[] = [];
    //private geofenceData: any[] = [];
    //private markData: any[] = [];
    //private inputData: any[] = [];
    //private unitData: any[] = [];


    constructor(info:Alarm){

		for(var x in info){
			if(this.hasOwnProperty(x)) {
				this[x] = info[x];
			}
		}

		let main = (this.id)? $(this.id): false;

		if(main){

			if(main.ds("gtType") === "alarm"){
				return;
			}

		}else{
			main = $.create("div").attr("id", this.id);
		}

        this.create(main);
    }

    create(main:any){

		this.main = main;

        main.addClass("alarm-main");
        main.ds("gtType", "alarm");

        this.listInput = new Input(
            {
                target: main,
                input: "input",
                type: "select",
                name: "mode",
                value: "1",
                caption: "Alarmas",
                data: ["Traza completa", "Traza ajustada al Recorrido", "Traza hasta al Recorrido"].map((e, index) => [index, e]),
                events:{
                    change: event => this.getRecord(event.currentTarget.value)
                }

            });


            this.tab = new Tab({
                target:main,
                className:"layer-tool"
            });

            this.tab.add({caption:"Definición", tagName:"form", active:true});
            this.tab.add({caption:"Geocercas", tagName:"form"});
            this.tab.add({caption:"Inputs", tagName:"form"});
            this.tab.add({caption:"Sitios", tagName:"form"});
            this.tab.add({caption:"Vehículos", tagName:"form"});


        this.createMainForm(this.tab.getPage(0));

        const menu = new Menu({
            caption: "",
            target:main,
            autoClose: false,
            className: ["sevian", "horizontal"],
            items: [

                {
                    caption: "+",
                    action: (item, event) => {
                        this.initRecord();
                    }
                },
                {
                    caption: "Guardar",
                    action: (item, event) => {
                        this.save();
                    }
                },
                {
                    caption: "Eliminar",
                    action: (item, event) => {
                        this.delete();
                    }
                },
            ]
        });

        this.loadRecord(this.data);

		this.wins["main"] = new Float.Window({
			visible:false,
			caption: this.caption,
			child:main,
			left:10,
			top:100,
			width: "280px",
			height: "250px",
			mode:"auto",
			className:["sevian"]
		});
    }
    initRecord() {

        S.go({
            async: true,
            valid: false,
            confirm_: 'seguro?',
            blockingTarget: this.main,
            requestFunctions: {
                "f": (json) => {

                    console.log(json)
                    this.loadRecord(json);
                }
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-alarm",
                    method: "init-record",
                    name: "/form/geofence",
                    eparams: {

                    },
                    iToken: "f"
                }
            ]
        });
    }

    getRecord(id) {
        S.go({
            async: true,
            valid: false,
            confirm_: 'seguro?',
            blockingTarget: this.main,
            requestFunctions: {
                "f": (json) => {

                    console.log(json)
                    this.loadRecord(json);
                }
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-alarm",
                    method: "get-record",
                    name: "/form/geofence",
                    eparams: {
                        id: id
                    },
                    iToken: "f"
                }
            ]
        });
    }

    newRecord() {
        this.forms["config"].reset();
        this.loadGeofences(this.tab.getPage(1), []);
        this.loadInputs(this.tab.getPage(2), []);
        this.loadMarks(this.tab.getPage(3), []);
        this.loadUnits(this.tab.getPage(4), []);
    }
    loadRecord(data) {
        const listData = [{ id: "", name: " + nueva" }].concat(data.alarm).map((e, index) => [e.id, e.name])
        this.listInput.setOptionsData(listData);

        if (data.record && data.record !== null) {
            data.record.__mode_ = 2;
            this.forms["config"].setValue(data.record);
            this.listInput.setValue(data.record.id);
        } else {
            //data.record = { __mode_: 1 };
            this.forms["config"].reset();
        }
        this.loadGeofences(this.tab.getPage(1), data.geofence);
        this.loadInputs(this.tab.getPage(2), data.input);
        this.loadMarks(this.tab.getPage(3), data.mark);
        this.loadUnits(this.tab.getPage(4), data.unit);
    }
    createMainForm(main) {
		this.forms["config"] = new Form({
            caption: "Alarmas",
            id:main,
            fields: [
                {
                    input: "input",
                    type: "hidden",
                    name: "id",
                    caption: "Id",
                },
                {
                    input: "input",
                    type: "text",
                    name: "name",
                    caption: "Nombre",
                },

                {
                    input: "input",
                    type: "textarea",
                    name: "description",
                    caption: "Descripción",
                },

                {
                    input: "input",
                    type: "text",
                    name: "min_speed",
                    caption: "Mínima Velocidad",
                },
                {
                    input: "input",
                    type: "text",
                    name: "max_speed",
                    caption: "Máxima Velocidad",
                },

                {
                    input: "input",
                    type: "select",
                    name: "scope",
                    value: "0",
                    default: "0",
                    caption: "Ámbito",
                    data: ["Usuario", "Cuenta Cliente", "Cliente"].map((e, index) => [index, e]),
                    events: {

                    }

                },
                {
                    input: "input",
                    type: "select",
                    name: "event_id",
                    value: 0,
                    default: "0",
                    caption: "Tipo",
                    data: [[205, "Alarma"], [206, "Advertenica"]],
                    events: {

                    }

                },
                {
                    input: "input",
                    type: "date",
                    name: "from",
                    caption: "Activar Desde",
                },
                {
                    input: "input",
                    type: "date",
                    name: "to",
                    caption: "Activar Hasta",
                },
                {


                    name: "week",
                    caption: "Activar x Días Específicos",
                    input: "multi",
                    type: "checkbox",
                    check: (value, inputs) => {

                        //const bin = Number(value).toString(2);
                        //const values = (bin || "").split("");
                        //console.log(values)




                        inputs.forEach((input:HTMLInputElement) => {
                            console.log(parseInt(value, 10), parseInt(input.value, 10), parseInt(value, 10) & parseInt(input.value, 10))
                            if ((parseInt(value, 10) & parseInt(input.value, 10)) == parseInt(input.value)) {
                                input.checked = true;
                            } else {
                                input.checked = false;
                            }
                        });
                    },
                    onchange(item) {

                            let input = this._main.queryAll("input.option:checked");
                            if (input) {
                                let str = 0;

                                input.forEach((i) => {
                                    str += Number(i.value);
                                });
                                this._input.val(str);

                            }
                    },
                    data: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"].map((e, index) => [2 ** (index), e]),
                },
                {
                    input: "input",
                    type: "select",
                    name: "mode_geo",
                    value: "0",
                    default: "0",
                    caption: "Lógica sobre las Geocercas",
                    data: ["Para Cualquiera", "Para Todos"].map((e, index) => [index, e]),
                },
                {
                    input: "input",
                    type: "select",
                    name: "mode_mark",
                    value: "0",
                    default: "0",
                    caption: "Lógica sobre las Geocercas de Sitios",
                    data: ["Para Cualquiera", "Para Todos"].map((e, index) => [index, e]),
                },
                {
                    input: "input",
                    type: "select",
                    name: "mode_input",
                    value: "0",
                    default: "0",
                    caption: "Lógica sobre los Inputs",
                    data: ["Para Cualquiera", "Para Todos"].map((e, index) => [index, e]),
                },
                {
                    input: "input",
                    type: "select",
                    name: "status_id",
                    value: 1,
                    default: "1",
                    caption: "Activar",
                    data: ["No", "Si"].map((e, index) => [index, e]),
                    events: {

                    }

                },



                {
                    input: "input",
                    type: "hidden",
                    name: "__mode_",
                    caption: "__mode_",
                    value: 1,
                    default: 1
                },

            ]
        });

    }

    loadGeofences(main, data) {
        main.text("");


        this.forms["geofence"] = new Form({
            caption: "Geocercas",
            id: main,
            mapValue: () => {
                const values = this.forms["geofence"].getValue();

                const result = [];
                data.forEach(e => {
                    if (values["geo_" + e.id] > 0) {
                        result.push({
                            id: e.id,
                            mode: values["geo_" + e.id],
                        })
                    }
                });

                return result;
            }
        });

        data.forEach(e => {
            this.forms["geofence"].addField({

                input: "input",
                type: "select",
                name: "geo_"+e.id,
                dataset: {
                  id:e.id
                },
                value: e.mode || 0,
                default: 0,
                caption: e.name,
                data: ["No Aplica", "Activar Dentro", "Activar Afuera"].map((e, index) => [index, e]),

            })
        });
        return;
        data.forEach(e => {
            const container = main.create("div");
            container.create("div").text(e.name);
            new Input(
                {
                    target: container,
                    input: "input",
                    type: "select",
                    name: "mode",
                    value: e.mode || 0,
                    caption: "Alarmas",
                    data: ["No Aplica", "Activar Dentro", "Activar Afuera"].map((e, index) => [index, e]),

                });
        });
    }

    loadMarks(main, data) {
        main.text("");

        this.forms["mark"] = new Form({
            caption: "Sitios",
            id: main,
            mapValue: () => {
                const values = this.forms["mark"].getValue();

                const result = [];
                data.forEach(e => {
                    if (values["mark_radius_" + e.id] > 0 && values["mark_mode_" + e.id] > 0) {
                        result.push({
                            id: e.id,
                            radius: values["mark_radius_" + e.id],
                            mode: values["mark_mode_" + e.id]
                        })
                    }
                });

                return result;
            }
        });

        data.forEach(e => {
            this.forms["mark"].createGroupInputs({
                caption: e.name,
                inputs: [
                    {
                        input: "input",
                        type: "text",
                        name: "mark_radius_" + e.id,
                        value: e.radius,
                        propertys: { placeholder: "Radio (m)", size: 8 },
                        dataset: {
                            id: e.id
                        }
                    },
                    {
                        input: "input",
                        type: "select",
                        name: "mark_mode_" + e.id,
                        value: e.mode,
                        caption: "Alarmas",
                        default: 0,
                        data: ["No Aplica", "Activar Dentro", "Activar Afuera"].map((e, index) => [index, e]),
                        dataset: {
                            id: e.id
                        }
                    }
                ],

            })
        });

        return;


        data.forEach(e => {
            const container = main.create("div");
            container.create("div").text("..."+e.name);
            new Input(
                {
                    target: container,
                    input: "input",
                    type: "text",

                    value: e.radius,
                    propertys: { placeholder: "Radio (m)", size:8 }



                });
            new Input(
                {
                    target: container,
                    input: "input",
                    type: "select",

                    value: "0",
                    caption: "Alarmas",
                    data: ["No Aplica", "Activar Dentro", "Activar Afuera"].map((e, index) => [index, e]),

                });
        });
    }

    loadUnits(main, data) {
        main.text("");

        const values = data.filter(e => e.mode == 1).map(e => e.id).join();

        this.forms["unit"] = new Form({

            id: main,
            fields: [
                {
                    input: "multi",
                    type: "checkbox",
                    name: "units",
                    caption: "Unidades",
                    value: values,
                    data: data.map((e, index) => [e.id, e.name]),
                }
            ],
            mapValue: () => {
                const values = this.forms["unit"].getValue("units");
                if (values != "") {
                    return values.split(",");
                }
                return [];


                const result = [];
                data.forEach(e => {
                    if (values["input_" + e.id] != 2) {
                        result.push({
                            id: e.id,
                            mode: values["input_" + e.id],
                        })
                    }
                });

                return result;
            }
        });
        return;
        const container = main.create("div");
        container.create("div").text("Todos");
            new Input(
                {
                    target: container,
                    input: "input",
                    type: "checkbox",
                    name: "mode",
                    value: "1",




                });
        data.forEach(e => {

            container.create("div").text(e.name);
            new Input(
                {
                    target: container,
                    input: "input",
                    type: "checkbox",
                    name: "mode",
                    value: e.id,
                    propertys: {
                        checked: (e.mode) ? true : false
                    }


                });
        });
    }

    loadInputs(main, data) {

        this.forms["input"] = new Form({
            caption: "Inputs",
            id: main,
            mapValue: () => {
                const values = this.forms["input"].getValue();

                const result = [];
                data.forEach(e => {
                    if (values["input_" + e.id] != 2) {
                        result.push({
                            id: e.id,
                            mode: values["input_" + e.id],
                        })
                    }
                });

                return result;
            }
        });

        data.forEach(e => {
            this.forms["input"].addField({
                caption: e.name,
                input: "input",
                type: "select",
                name: "input_" + e.id,
                value: e.mode,
                default: 2,
                data: [["2", "No Aplica"], ["1", e.value_on], ["0", e.value_off]],
            })
        });
        return;

        main.text("");
        data.forEach(e => {
            const container = main.create("div");
            container.create("div").text(e.name);
            new Input(
                {
                    target: container,
                    input: "input",
                    type: "select",
                    value: e.mode,
                    caption: "Alarmas",
                    data: [["2", "No Aplica"], ["1", e.value_on], ["0", e.value_off]],

                });
        });
    }
    reset() {
        this.forms["config"].reset();
        this.forms["geofence"].reset();
        this.forms["mark"].reset();
        this.forms["unit"].reset();
        this.forms["input"].reset();
    }
    save() {
        console.log(this.forms["geofence"].mapValue());
        console.log(this.forms["mark"].mapValue());
        console.log(this.forms["unit"].mapValue());
        console.log(this.forms["input"].mapValue());


        const formData = this.forms["config"].getFormData();
        if (this.forms["config"].getValue("__mode_") == 2) {
            formData.append("__record_", JSON.stringify({
                id: this.forms["config"].getValue("id")
            }));
        }

        formData.append("config", JSON.stringify({
            geofence: this.forms["geofence"].mapValue(),
            mark: this.forms["mark"].mapValue(),
            unit: this.forms["unit"].mapValue(),
            input: this.forms["input"].mapValue(),


        }));




				S.go({
					async: true,
					valid: false,
					confirm_: 'seguro?',
					form: formData,
					//blockingTarget: mapControl.getPanel(),
					requestFunctions: {
						"f": (json) => {
                            console.log(json)

                            this.loadRecord(json);


						},
                        "f2": (json) => {
                            if (!json.data.__error_) {
                                new Float.Message({
                                    "caption": "Alarma",
                                    "text": "Record was saved!!!",
                                    "className": "",
                                    "delay": 3000,
                                    "mode": "",
                                    "left": "center",
                                    "top": "top"
                                }).show({});
                            } else {
                                new Float.Message({
                                    "caption": "Alarma",
                                    "text": "Record wasn't saved!!!!",
                                    "className": "",
                                    "delay": 3000,
                                    "mode": "",
                                    "left": "center",
                                    "top": "top"
                                }).show({});
                            }
                        }

					},
					_requestFunction: (json) => {

					},
					params: [
						{
							t: "setMethod",
							'mode': 'element',
							element: "gt-alarm",
							method: "save",

							name: "/form/geofence",
							eparams: { getResult: true },
							iToken: "f2"
                        },
                        {
                            t: "setMethod",
                            element: "gt-alarm",
                            method: "get-record",
                            name: "/form/geofence",
                            eparams: {

                            },
                            iToken: "f"
                        }
					]
				});
    }

    delete() {



        const formData = this.forms["config"].getFormData();
        if (this.forms["config"].getValue("__mode_") == 2) {
            formData.append("__mode_", 3);
            formData.append("__record_", JSON.stringify({
                id: this.forms["config"].getValue("id")
            }));
        } else {
            return;
        }






				S.go({
					async: true,
					valid: false,
					confirm_: 'seguro?',
					form: formData,
					//blockingTarget: mapControl.getPanel(),
					requestFunctions: {
						"f": (json) => {
                            console.log(json)

                            this.loadRecord(json);


						},
                        "f2": (json) => {
                            this.reset();
                            if (!json.data.__error_) {
                                new Float.Message({
                                    "caption": "Alarma",
                                    "text": "Record was saved!!!",
                                    "className": "",
                                    "delay": 3000,
                                    "mode": "",
                                    "left": "center",
                                    "top": "top"
                                }).show({});
                            } else {
                                new Float.Message({
                                    "caption": "Alarma",
                                    "text": "Record wasn't saved!!!!",
                                    "className": "",
                                    "delay": 3000,
                                    "mode": "",
                                    "left": "center",
                                    "top": "top"
                                }).show({});
                            }
                        }

					},
					_requestFunction: (json) => {

					},
					params: [
						{
							t: "setMethod",
							'mode': 'element',
							element: "gt-alarm",
							method: "delete",

							name: "/form/geofence",
							eparams: { getResult: true },
							iToken: "f2"
                        }
                        ,
                        {
                            t: "setMethod",
                            element: "gt-alarm",
                            method: "get-record",
                            name: "/form/geofence",
                            eparams: {

                            },
                            iToken: "f"
                        }
					]
				});
    }

    showMenu(){
		this.wins["main"].show();
	}
}
