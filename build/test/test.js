import { _sgQuery as $ } from "../Sevian/ts/Query.js";
export class Test {
    constructor() {
        this.data = null;
        this.tem = {};
        let str = "return 1+1";
        let cadena = `¡Hola\n${`${str}`}!`;
        console.log(new Function(str)());
        this.data = Data();
        let template = $("templateOne").get().content.querySelector("#tm");
        this.setTemplate(template, this.data);
        $("test_one").append(template);
    }
    setTemplate(template, data, master) {
        /* eval all variables */
        const myExp = template.dataset.exp;
        if (myExp !== undefined) {
            this.evalExp(myExp, data);
        }
        template.removeAttribute("data-exp");
        this.evalAttributes(template, data, master);
        template.innerHTML = this.evalHTML(template.innerHTML, data, master);
        let child;
        while (child = template.querySelector("[data-detail]")) {
            const myKey = child.dataset.detailKey || null;
            const myIndex = child.dataset.detailIndex || null;
            const myExp = child.dataset.detailExp;
            let aKey = child.dataset.detail.split(":");
            let key = aKey[0];
            let alias = aKey[1] || key;
            child.removeAttribute("data-detail");
            child.removeAttribute("data-detail-key");
            child.removeAttribute("data-detail-index");
            child.removeAttribute("data-detail-exp");
            let mainTemplate = document.importNode(child, true);
            let lastNode = child;
            if (data[key]) {
                let auxKey = alias;
                if (master) {
                    auxKey = master + "." + key;
                }
                let i = 0;
                for (let x in data[key]) {
                    const detailData = Object.assign({}, data[key][x]);
                    if (myKey) {
                        detailData[myKey] = x;
                    }
                    if (myIndex) {
                        detailData[myIndex] = i;
                    }
                    let clone = document.importNode(mainTemplate, true);
                    if (myExp !== undefined) {
                        this.evalExp(myExp, detailData);
                    }
                    this.setTemplate(clone, detailData, auxKey);
                    child.parentNode.insertBefore(clone, lastNode.nextSibling);
                    lastNode = clone;
                    i++;
                }
            }
            child.remove();
        }
    }
    evalAttributes(element, data, key) {
        for (let i = element.attributes.length - 1; i >= 0; i--) {
            element.setAttribute(element.attributes[i].name, this.evalHTML(element.attributes[i].value, data, key));
        }
    }
    evalHTML(string, data, key) {
        let regex;
        if (key) {
            regex = new RegExp("\\{=" + key + "\.([a-z0-9-_\.]+)\}", "gi");
        }
        else {
            regex = /\{=([a-z0-9-_\.]+)\}/gi;
        }
        string = string.replace(regex, (str, index, p2, offset, s) => {
            let levels = index.split(".");
            let tempData = data;
            let valid = true;
            levels.forEach(key => {
                if (valid && tempData[key] !== undefined) {
                    tempData = tempData[key];
                    valid = true;
                }
                else {
                    valid = false;
                }
            });
            if (valid) {
                return tempData;
            }
            return str;
        });
        return string;
    }
    evalExp(exp, data, key) {
        let regex = new RegExp("({([a-z0-9-_\.]+)=([^}]+)\})", "gi");
        let info = exp.matchAll(regex);
        for (let match of info) {
            try {
                const F = $.bind("return " + match[3], data);
                data[match[2]] = F();
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}
function Data() {
    return {
        "ants": 12474737,
        "a-b": "noticias CNN",
        "name": "yanny esteban",
        "id": 12699,
        "unitId": 2002,
        "deviceId": 2024000100,
        "date_time": "2020-07-07 09:20:34",
        "longitude": -66.848768,
        "latitude": 10.502258,
        "speed": 0,
        "heading": 0,
        "altitude": 890,
        "satellite": 4,
        "eventId": 0,
        "mileage": null,
        "inputStatus": 9,
        "voltageI1": null,
        "voltageI2": null,
        "outputStatus": null,
        "batteryVoltage": null,
        "mainEvent": null,
        "dateTime": "07/07/2020 09:20:34",
        "uTime": "09:20:34",
        "uDate": "07/07/2020",
        "ts": 1594128034,
        "myEvent": null,
        "event": "Posición",
        "i1": 1,
        "i2": 0,
        "i3": 0,
        "i4": 1,
        "i5": 0,
        "i6": 0,
        "i7": 0,
        "i8": 0,
        "o1": null,
        "o2": null,
        "o3": null,
        "o4": null,
        "o5": null,
        "o6": null,
        "o7": null,
        "o8": null,
        "iInputs": [
            {
                "id": 13,
                "on": true,
                "name": "MOTOR",
                "value": "ENCENDIDO",
                "type": "i"
            },
            {
                "id": 16,
                "on": false,
                "name": "PUERTA",
                "value": "CERRADAS",
                "type": "i"
            },
            {
                "id": 6,
                "on": false,
                "name": "CAVA",
                "value": "CERRADA",
                "type": "i"
            },
            {
                "id": 3,
                "on": true,
                "name": "BOTÓN PÁNICO",
                "value": "ACTIVADO",
                "type": "i"
            },
            {
                "id": 12,
                "on": false,
                "name": "LUCES",
                "value": "APAGADAS",
                "type": "o"
            },
            {
                "id": 9,
                "on": false,
                "name": "CORNETA",
                "value": "NORMAL",
                "type": "o"
            },
            {
                "id": 1,
                "on": false,
                "name": "ARRANQUE",
                "value": "DESBLOQUEADO",
                "type": "o"
            },
            {
                "id": 14,
                "on": false,
                "name": "MOTOR OUTPUT",
                "value": "DESBLOQUEADO",
                "type": "o"
            }
        ],
        "in13": "on",
        "in16": "off",
        "in6": "off",
        "in3": "on",
        "in12": "off",
        "in9": "off",
        "in1": "off",
        "in14": "off",
        persons: [
            {
                name: "Juan",
                lastName: "rodriguez",
                childs: [
                    {
                        name: "aleimar",
                        age: {
                            a: 22,
                            m: 50
                        }
                    },
                    {
                        name: "juanjo",
                        age: {
                            a: 18,
                            m: 36
                        }
                    }
                ]
            },
            {
                name: "Anneliesse",
                lastName: "Morales",
                childs: [
                    {
                        name: "yrianny"
                    },
                    {
                        name: "yriangel"
                    }
                ]
            }
        ],
        escuela: {
            dir: "caracas",
            zip: 2022,
            mat: [
                "matemáticas", "física", "quimica", "literatura"
            ]
        },
        "mi-numero": "ocho",
        "comidas": {
            "alpha": {
                "name": "yanny"
            },
            "Beta": {
                "name": "ann"
            },
            "3": {
                "name": "Yrianny"
            },
            "4": {
                "name": "Yriangel"
            }
        }
    };
}
//# sourceMappingURL=test.js.map