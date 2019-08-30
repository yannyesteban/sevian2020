//import { Query as $} from './Query.js';
const Form = (($) => {
    class Form {
        constructor(opt) {
            this.target = false;
            this.name = "";
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let _target = $(this.target);
            if (_target && _target.get().tagName != "FORM") {
                let form = _target.create({
                    tagName: "form",
                    name: this.name
                }).ds("sgType", "sg-form");
            }
        }
        create() {
        }
    }
    let json = {
        caption: "Formulario Uno",
        className: "summer",
        elements: [
            {
                element: "input",
                input: "ssInput",
                type: "text",
                id: "",
                name: "cedula",
                caption: "Cédula",
                value: "12474737",
                data: [],
                parent: false,
                propertys: {},
                style: {},
                rules: {},
                events: {},
            },
            {
                element: "page",
                caption: "Datos Personales",
                elements: [
                    { input: "text" },
                    { input: "text" },
                ]
            },
            {
                element: "tab",
                caption: "categorias",
                pages: [
                    {
                        caption: "pagina Uno",
                        elements: [
                            { input: "text" },
                            { input: "text" },
                        ]
                    },
                    {
                        caption: "pagina Dos",
                        elements: [
                            { input: "text" },
                            { input: "text" },
                        ]
                    },
                ]
            }
        ],
    };
    return Form;
})(_sgQuery);
