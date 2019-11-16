var MenuDesign = (($) => {
    class MenuDesign {
        constructor(info) {
            this.id = null;
            this.menu = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let _items = [
                {
                    "caption": "_Guardar",
                    "action": "S.send({\r\n\tasync:false,\r\n\tpanel:4,\r\nconfirm_:\"hola\",\r\nvalid:false,\r\n\tparams:\r\n[{\r\nt:\"setMethod\",\r\nmethod:\"save\",\r\n_element:\"sgForm\",\r\n_name:\"test_1\"\r\n\r\n},\r\n\r\n{\r\nt:\"setMethod\",\r\nmethod:\"load\",\r\n_element:\"sgForm\",\r\n_name:\"test_1\",\r\neparams:{\r\nrecordId:1\r\n}\r\n\r\n}\r\n\t\r\n]\r\n});"
                },
                {
                    "caption": "New",
                    "action": "S.send({\r\n\tasync:false,\r\n\tpanel:4,\r\nconfirm_:\"hola\",\r\nvalid:false,\r\n\tparams:\r\n[{\r\nt:\"setMethod\",\r\nmethod:\"request\",\r\nelement:\"sgForm\",\r\nname:\"test_1\"\r\n\r\n}\r\n\t\r\n]\r\n});"
                },
                {
                    "caption": "Edit",
                    "action": "S.send({\r\n\tasync: false,\r\n\tpanel:4,\r\n\tvalid:false,\r\n\tconfirm_: 'seguro?',\r\n\tparams:\t[\r\n\t\t{t:'setMethod',\r\n\t\t\t\r\n\t\t\telement:'sgForm',\r\n\t\t\tmethod:'load',\r\n\t\t\t\r\n      eparams:{\r\n        recordId:0,\r\n      }\r\n\t\t}\r\n\r\n\t]\r\n});"
                },
                {
                    "caption": "List",
                    "action": "S.send({\r\n\tasync:false,\r\n\tpanel:4,\r\nconfirm_:\"hola\",\r\nvalid:false,\r\n\tparams:\r\n[{\r\nt:\"setMethod\",\r\nmethod:\"list\",\r\nelement:\"sgForm\",\r\nname:\"test_1\"\r\n\r\n}\r\n\t\r\n]\r\n});"
                },
                {
                    "caption": "Send",
                    "action": "S.send({\r\n\tasync: false,\r\n\tpanel:4,\r\n\tvalid:false,\r\n\tconfirm_: 'seguro?',\r\n\tparams:\t[]\r\n});"
                },
                {
                    "caption": "Save All",
                    "action": "S.send({\r\n\tasync: false,\r\n\tpanel:4,\r\n\tvalid:false,\r\n\tconfirm_: 'seguro?',\r\n\tparams:\t[{\r\n    t:'setMethod',\r\n    method:'save'\r\n\r\n  }]\r\n});",
                    "items": [
                        {
                            "caption": "uno"
                        },
                        {
                            "caption": "dos",
                            "items": [
                                {
                                    "caption": "a-uno"
                                },
                                {
                                    "caption": "a-dos"
                                },
                                {
                                    "caption": "a-tres"
                                }
                            ]
                        },
                        {
                            "caption": "tres"
                        }
                    ]
                },
                {
                    "caption": "Guardar 2",
                    "action": "S.send({\r\n\tasync:true,\r\n\tpanel:4,\r\nconfirm_:\"hola\",\r\nvalid:false,\r\n\tparams:\r\n[{\r\nt:\"setMethod\",\r\nmethod:\"save\",\r\n_element:\"sgForm\",\r\n_name:\"test_1\"\r\n\r\n}\r\n\r\n\r\n\t\r\n]\r\n});"
                }
            ];
            let alpha = (menu, item) => {
                let item1 = menu.create("div").text(item.caption);
                if (item.items) {
                    let _menu = item1.create("div").addClass("sub-menu");
                    item.items.reduce(alpha, _menu);
                    //return _menu;
                }
                return menu;
            };
            let div = $(this.id).create("div").addClass("m");
            _items.reduce(alpha, div);
            //let  y = new Menu(this.menu);
            console.log(this.menu);
        }
    }
    return MenuDesign;
})(_sgQuery);
