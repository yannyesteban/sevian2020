// JavaScript Document
if(!Sevian){
	
	var Sevian = {};
	
}

var Valid = false;
(function(namespace, $){
	var re = false,
		matchArray = false,
		aux = false,
		date = false,
		_pattern = false;
	
	var trim = function(value){
		
		re = /^\s+/i;
		matchArray = re.exec(value);
		if (matchArray){
			value = value.replace(re, "");
		}
		
		re = / +$/i;
		matchArray = re.exec(value);
		if (matchArray){
			value = value.replace(re, "");
		}
		return value;
	};
	
	var empty = function(value){
		re = /.+/;
		matchArray = re.exec(value);
		if (matchArray){
			return false;
		}
		return true;
	};
	var evalExp = function(pattern, value){
		if (!empty(value)){
			
			re = new RegExp(pattern, "gi");
			matchArray = re.exec(value);

			if (matchArray){
				return true;
			}else{
				return false;
			}
		}
		return true;
	};
	
	var getDateFrom = function(query, pattern){
		
		aux = {};
		date = / /;
		
		_pattern = pattern.replace(/\bd{1,2}\b/g,"([0-9]{1,2})");
		_pattern = _pattern.replace(/\bm{1,2}\b/g,"[0-9]{1,2}");
		_pattern = _pattern.replace(/\by{1,2}\b/g,"[0-9]{4}");
		date.compile(_pattern);

		if((matchArray = date.exec(query))){
			aux.day = matchArray[1];
		}
	
		_pattern = pattern.replace(/\bd{1,2}\b/g,"[0-9]{1,2}");
		_pattern = _pattern.replace(/\bm{1,2}\b/g,"([0-9]{1,2})");
		_pattern = _pattern.replace(/\by{1,2}\b/g,"[0-9]{4}");
		date.compile(_pattern);

		if((matchArray = date.exec(query))){
			aux.month = matchArray[1];
		}

		_pattern = pattern.replace(/\bd{1,2}\b/g,"[0-9]{1,2}");
		_pattern = _pattern.replace(/\bm{1,2}\b/g,"[0-9]{1,2}");
		_pattern = _pattern.replace(/\by{1,2}\b/g,"([0-9]{4})");
		date.compile(_pattern);
		if((matchArray = date.exec(query))){
			aux.year = matchArray[1];
		}

		return aux;
		
	};
	
	var evalDate = function(value, pattern){
		
		if(trim(value) === ""){
			return true;
		}
		
		var aux = sgDate.dateFrom(value, pattern);
		var date = new Date(aux.year, aux.month - 1, aux.day);

		if(aux.year !== date.getFullYear() || aux.month !== (date.getMonth() + 1) || aux.day !== date.getDate()){
			return false;
		}else{
			return true;
		}

	};
	
	
	Sevian.Valid = {
		msg: [],
		
		initMsg: function(lang, msg){
			this.msg = msg[lang];
		},
		evalMsg: function(key, rules, value, title){
			var msg = "";
			
			if(rules[key].msg){
				msg = rules[key].msg;
			}else{
				msg = this.msg[key];
			}

			msg = msg.replace("{=title}", title);

			if(rules[key].value){
				msg = msg.replace("{=value}", rules[key].value);
			}

			return msg;
		},
		
		send: function(rules, value, title, masterData){
			var error = false, rule = false, key = false;
			for(key in rules){
				rule = rules[key];	
				error = false;

				switch(key){
					case "required":
						if(trim(value) === ""){
							error = true;
						}
						break;
					case "alpha":
						if(!evalExp("^([ A-ZáéíóúÁÉÍÓÚüÜñÑ]+)$", value)){
							error = true;
						}
						break;
					case "alphanumeric":
						if(!evalExp("^([\\w]+)$", value)){
							error = true;
						}
						break;
					case "nospaces":
						if(evalExp("[ ]+", value)){
							error = true;
						}
						break;
					case "numeric":
						if(!evalExp("^[-]?\\d*\\.?\\d*$", value)){
							error = true;
						}
						break;
					case "integer":
						if(!evalExp("^[-]?\\d*$", value)){
							error = true;
						}
						break;
					case "positive":
						if(!evalExp("^\\d*\\.?\\d*$", value)){
							error = true;
						}
						break;
					case "exp":
						if(!evalExp(rules[rule].value, value)){
							error = true;
						}
						break;
					case "email":
						if(!evalExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", value)){
							error = true;
						}
						break;
					case "greater":
						if(value <= rule.value){
							error = true;
						}
						break;	
					case "less":
						if(value >= rule.value){
							error = true;
						}
						break;	
					case "greatestequal":
						if(value < rule.value){
							error = true;
						}
						break;	
					case "lessequal":
						if(value > rule.value){
							error = true;
						}
						break;	
					case "condition":
						if(!this.evalCondition(rule.value, value)){
							error = true;
						}
						break;	
					case "date":
						if(!evalDate(value, rule.value || "%y-%m-%d")){
							error = true;
						}
						break;	
				}
				if(error){
					return this.evalMsg(key, rules, value, title);
				}
				
			}
			
			return false;
		
		},
		
		
	};

	var valid_msg = [];
	valid_msg.spa = {
		"required": "El campo {=title} es obligatorio",
		"alpha"			:"El campo {=title} solo debe tener caracteres alfabéticos",
		"alphanumeric"	:"El campo {=title} solo debe tener caracteres alfanuméricos",
		"nospaces"		:"El campo {=title} no debe tener espacio en blancos",
		"numeric"		:"El campo {=title} debe ser un valor numérico",
		"positive"		:"El campo {=title} debe ser un número positivo",
		"integer"		:"El campo {=title} debe ser un número entero",
		"email"			:"El campo {=title} no es una dirección de correo válida",
		"date"			:"El campo {=title} no es una fecha válida",
		"time"			:"El campo {=title} no es una hora válida",
		"exp"			:"El campo {=title} no coincide con un patrón válido",
		"minlength"		:"La longitud en caracteres del campo {=title}, debe ser mayor que {=value}",
		"maxlength"		:"La longitud en caracteres del campo {=title}, debe ser menor que {=value}",
		"greater"		:"El campo {=title} debe ser mayor que {=value}",
		"less"			:"El campo {=title} debe ser menor que {=value}",
		"greatestequal"	:"El campo {=title} debe ser mayor o igual que {=value}",
		"lessequal"		:"El campo {=title} debe ser menor o igual que {=value}",
		"condition"		:"El campo {=title} no cumple la condición predefinida",

	};



	Sevian.Valid.initMsg("spa", valid_msg);
	
	
}());