import { _sgQuery as $, SQObject } from "../../Sevian/ts/Query.js";
import { Menu as Menu } from "../../Sevian/ts/Menu2.js";
import { Float } from "../../Sevian/ts/Window.js";
import {
    I,
    Input,
    Hidden,
    InputDate,
    InputInfo,
    Multi,
} from "../../Sevian/ts/Input.js";
import { Form2 as Form } from "../../Sevian/ts/Form2.js";
import { Tab } from "../../Sevian/ts/Tab.js";
import { S } from "../../Sevian/ts/Sevian.js";
import { InfoComm } from "./InfoMenu.js";

export class Report {
    public id: any = null;
    public caption: string = "";
    public formId: string = "form-" + String(new Date().getTime());

    public className: any = null;
    private main: SQObject = null;

    private wins: any[] = [];

    private commandConfig: any = null;
    private unitConfig: any = null;
    private unitPending: any = null;
    private eventList: any = null;

    private form: Form = null;

    private unitId: number = null;
    private index: number = 100;
    private eventId: number = null;

    private listEvent: Input;

    constructor(info: Report) {
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        let main = this.id ? $(this.id) : null;

        if (!main) {
            main = $.create("div").attr("id", this.id);
        }

        this.create(main);
    }

    public create(main: SQObject) {
        
        main.addClass("event-tool");
        
        this.main = main;

        this.wins["main"] = new Float.Window({
            visible: true,
            caption: this.caption,
            child: main,
            left: 10,
            top: 100,
            width: "280px",
            height: "250px",
            mode: "auto",
            className: ["sevian"],
        });

        this.listEvent = new Input(
            {
                target: main,
                input: "input",
                type: "select",
                name: "event_list",
                value: "1",
                caption: "Alarmas",
                data: [[100,100],[101,101]],

                onAddOption: (option, data)=>{
                    if(data[3] !== undefined){
                        $(option).addClass("mode-" + data[3]);
                    }
                },

                events:{
                   change: (event) => {
                        this.setIndex(event.currentTarget.value);
                        this.start();
                   },
                   
                }

            });
        
        //main.style("height", "300px");
        this.wins["main"].getMain().on("dblclick", (event) => {
            this.unitId = 4032;
            this.start(this.unitId, this.index);
        });
    }


    public setUnitId(unitId){
        this.unitId = unitId;
    }
    public getUnitId(){
        return this.unitId;
    }
    public setIndex(index){
        this.index = index;
    }
    public getIndex(index){
        return this.index;
    }
    public start(unitId?: number, index?:number) {
        if(unitId !== undefined){
            this.unitId = unitId;
        }

        if(index !== undefined){
            this.index = index;
        }


        this.goConfig(this.unitId, this.index);
    }

    private goConfig(unitId: number, index:number) {
        S.go({
            async: true,
            valid: false,

            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    
                    this.commandConfig = json.commandConfig;
                    this.unitConfig = json.unitConfig;
                    this.unitPending = json.unitPending;
                    this.eventList = json.eventList;
                    this.createMainForm();
                },
            },

            params: [
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-config",
                    name: "",
                    eparams: {
                        unitId: unitId,
                        index: index,
                    },
                    iToken: "f",
                },
            ],
        });
    }

    public goSave() {

        let params = {};
        console.log(this.form.getValue());
        this.commandConfig.params.fields.forEach(element => {
            console.log(element.name)
            params[element.name] = this.form.getInput(element.name).getValue();
        });

        this.form.getInput("params").setValue(JSON.stringify(params));
        
        S.go({
            async: true,
            valid: false,
            //confirm_: 'seguro?',
            form: this.form.getFormData(),
            blockingTarget: this.main,
            requestFunctions: {
                f: (json) => {
                    
                    this.commandConfig = json.commandConfig;
                    this.unitConfig = json.unitConfig;
                    this.unitPending = json.unitPending;
                    this.eventList = json.eventList;
                    this.createMainForm();
                },
            },
            params: [
                {
                    t: "setMethod",
                    'mode': 'element',
                    element: "s-form",
                    method: "save",

                    name: "/gt/forms/unit_command",
                    eparams: {},
                    iToken: "f2"
                },
                {
                    t: "setMethod",
                    element: "gt-report",
                    method: "get-config",
                    name: "",
                    eparams: {
                        unitId: this.unitId,
                        index: this.index,
                    },
                    iToken: "f",
                }
            ]
        });
    }

    private createMainForm() {
        const unitEvent = this.unitConfig.event;

        const indexField = this.commandConfig.params.indexField;
        const eventRange = this.commandConfig.params.eventRange;
console.log(this.eventList)
        const range = [];
        let data = null;
        for (let i = eventRange[0]; i <= eventRange[1]; i++) {
            const found = this.eventList.find(e => e.event_id == i);
            if (found) {
                range.push([i, `${i} :  ${found.name}`, "*", found.status]);

            } else {
                range.push([i, i + ": ---"]);
            }

        }

        this.listEvent.setOptionsData(range);
        this.listEvent.setValue(this.index);
        const id = this.unitPending.id;
        const commandId = this.unitPending.command_id;
        const unitId = this.unitPending.unit_id;
        const index = this.unitPending.index;
        const name = this.unitPending.name;
        const status = this.unitPending.status;
        const mode = this.unitPending.__mode_;
        const fields = [];

        
        
        //const fields = this.commandConfig.params.fields.map((item) => {
        this.commandConfig.params.fields.forEach((item) => {            
            //let input = "input";
            //let type = "text";
            //let caption = item.label;
            //let events = {};
            //let value = item.value || "";
            console.log(item.name, item.value)
            
            const info:any = {
                caption: item.label,
                name: item.name,
                input: "input",
                type: "text",
                value: item.value,
            }

            if (item.name == indexField) {
                info.type = "hidden";
                /*info.data = range;
                info.events = {change: (event) => {
                    this.setIndex(event.currentTarget.value);
                    this.start();
                }};*/
                info.value = this.index;
                fields.push(info);
                fields.push({
                    caption: "Description",
                    name: "name",
                    input: "input",
                    type: "text",
                    value: name
                });
                return;
            }

            if (item.type == "select") {
                info.type = "select";
                info.data = item.data;
                fields.push(info);
                return;
            }

            if (item.type == "bit") {
                info.input = "multi";
                info.type = "checkbox";
                info.data = item.data;
                
                info.check = (value, inputs) => {

                    inputs.forEach((input:HTMLInputElement) => {
                        if ((parseInt(value, 10) & parseInt(input.value, 10)) == parseInt(input.value)) {
                            input.checked = true;
                        } else {
                            input.checked = false;
                        }
                    });
                };

                info.onchange = function(item) {
                    const parent = $(item.get().parentNode.parentNode);
                    
                    let input = parent.queryAll("input.option:checked");
                    if (input) {
                        let str = 0;

                        input.forEach((i) => {
                            str += Number(i.value);
                        });
                        this._input.val(str);
                    }
                };

                fields.push(info);
                return;
            }
            fields.push(info);

       
        });

        
        
        let record = "";
        if(this.unitPending.__record_){
            record =  JSON.stringify(this.unitPending.__record_);
        }
        
        let params = "";
        if(this.unitPending.params){
            params = JSON.stringify(this.unitPending.params);
        }

        fields.push({
            caption: "ID",
            name: "id",
            input: "input",
            type: "hidden",
            value: id
        });
        fields.push({
            caption: "Unit ID",
            name: "unit_id",
            input: "input",
            type: "hidden",
            value: unitId
        });
        fields.push({
            caption: "Command ID",
            name: "command_id",
            input: "input",
            type: "hidden",
            value: commandId
        });
        fields.push({
            caption: "Index",
            name: "index",
            input: "input",
            type: "hidden",
            value: index
        });
        
        fields.push({
            caption: "Status",
            name: "status",
            input: "input",
            type: "hidden",
            value: status
        });
        fields.push({
            caption: "Params",
            name: "params",
            input: "input",
            type: "hidden",
            value: params
        });
        fields.push({
            caption: "__mode_",
            name: "__mode_",
            input: "input",
            type: "hidden",
            value: mode
        });
        fields.push({
            caption: "__record_",
            name: "__record_",
            input: "input",
            type: "hidden",
            value: record
        });
        this.form = new Form({
            target: this.main,
            id: this.formId,
            caption: "event",
            fields: fields,
            menu: {
                caption: "",
                autoClose: false,
                className: ["sevian", "horizontal"],
                items: [
                    {
                        caption: "Save",
                        action: (item, event) => {
                            this.goSave();
                        }
                    },
                    {
                        caption: "Send",
                        action: (item, event) => { }
                    },
                    {
                        caption: "Recibir",
                        action: (item, event) => { }
                    },
                    {
                        caption: "Último Reportado",
                        action: (item, event) => { }
                    }
                ]
            }
        });
        if(mode == 2){
            this.form.setValue(this.unitPending.params);
       
        }

        this.setMode(status);
        
    }

    public setMode(mode:number){
        this.main.ds("mode", "mode-"+mode);
        
    }
}
