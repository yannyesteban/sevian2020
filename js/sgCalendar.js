// JavaScript Document

/*

@type: 

normal,
default,
accordion,
accordionx,
accordiony,
system,


@author: yanny nuñez;
@update: 30/04/2017




*/
var sgCalendar = false, sgDate = false, sgDatePicker = false;
(function($, sgFloat, window, sgPopup){
	var _holy = [];
	//_holy[0] = [];
	sgDate = {
		
		indexHoly: function(data){
			
			var holy = [], y, m, d, x, info;
			
			for(x in data){
				y = data[x][0];
				m = data[x][1];
				d = data[x][2];
				info = data[x][3] || "";
				
				if(!holy[y]){
					holy[y] = [];
				}
								
				if(!holy[y][m]){
					holy[y][m] = [];
				}

				holy[y][m][d] = info;
				
			}
			return holy;
		},
		
		setHoly: function(data){
			_holy = this.indexHoly(data);
			
		},
		
		isHolyFrom: function(holy, y, m, d){
			if(holy[y]){
				if(holy[y][m] && holy[y][m][d]){
					return holy[y][m][d];
				}
			}
			if(holy[0] && holy[0][m] && holy[0][m][d]){
				return holy[0][m][d];
			}
			return false;
		},
		
		isHoly: function(y, m, d){
			
			return this.isHolyFrom(_holy, y, m, d);
			
			if(_holy[y]){
				if(_holy[y][m] && _holy[y][m][d]){
					return _holy[y][m][d];
				}
			}
			
			
			if(_holy[0] && _holy[0][m] && _holy[0][m][d]){
				
				return _holy[0][m][d];
			}
			
			return false;
			
		},
		
		date: function(y, m, d){
			
			if(typeof(y) === "object"){
				return new Date(y.y, y.m + 1, y.d);
			}
			return new Date(y, m + 1, d);
		},
		
		
	};
	
	var _nameMonths = [
		["", "E","F","M","A","M","J","J","A","S","O","N","D"],
		["", "Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
		["", "Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
	];
	
	var _nameDays = [
		["D","L","M","M","J","V","S"],
		["Do","Lu","Ma","Mi","Ju","Vi","S&aacute;"],
		["Dom","Lun","Mar","Mi&eacute;","Jue","Vie","S&aacute;b"],
		["Domingo","Lunes","Martes","Mi&eacute;rcoles","Jueves","Viernes","S&aacute;bado"]		
	];
	
	var _weekTitle = [["S", "Sem"]];
	
	var _daysXMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
	
	var daysXMonth = function(y, m){
		if(m === 2){
			return 28 + (((y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0))? 1: 0);
		}
		return _daysXMonth[m - 1];
	};
	
	var _weekDate = function(y, m, d){
		
		var 
			dateOne = new Date(y, 0, 1),
			dayOne = dateOne.getDay(),
			delta = (dayOne > 4)? 1: 0,
			sum = d;
		
		for(var i=0; i < m-1; i++){
			sum += daysXMonth(y, i + 1);
		}
		if((Math.ceil((dayOne + sum) /7) - delta) === 0){
			return _weekDate(y - 1, 12, 31);
		}else{
			return Math.ceil((dayOne + sum) /7);
		}
	}// end function
	
	var infoDate = function(y, m, d){
		
		return {
			date: new Date(y, m-1, d || 1),
			dateOne: new Date(y, m-1, 1),
			dayOne: (new Date(y, m-1, 1)).getDay(),
			dayLast: (new Date(y, m-1, 1)).getDay(),
			days: daysXMonth(y, m)
			
		}
		
		
	};
	
	var fillz = function(value){
		value = "0"+ value; 
		return value.substr(value.length - 2);
	};
	
	var getDateFrom = function(query, pattern){
		var 
			aux = {},
			date = / /,
			pattern_ = false,
			result = false;
		
		pattern_ = pattern.replace(/%d/g,"([0-9]{1,2})");
		pattern_ = pattern_.replace(/%m/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%y/g,"[0-9]{4}");

		date.compile(pattern_);
		if(result = date.exec(query)){
			aux.day = result[1] *1;
		}
	
		pattern_ = pattern.replace(/%d/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%m/g,"([0-9]{1,2})");
		pattern_ = pattern_.replace(/%y/g,"[0-9]{4}");

		date.compile(pattern_);
		if(result = date.exec(query)){
			aux.month = result[1] *1;
		}

		pattern_ = pattern.replace(/%d/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%m/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%y/g,"([0-9]{4})");

		date.compile(pattern_);
		if(result = date.exec(query)){
			aux.year = result[1] *1;
		}

		return aux;
	};
	
	
	sgDate.dateFrom = function(query, pattern){
		var 
			aux = {},
			date = / /,
			pattern_ = false,
			result = false;
		
		pattern_ = pattern.replace(/%dd/g,"([0-9]{1,2})");
		pattern_ = pattern_.replace(/%mm/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%yy/g,"[0-9]{4}");
		
		pattern_ = pattern_.replace(/%d/g,"([0-9]{1,2})");
		pattern_ = pattern_.replace(/%m/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%y/g,"[0-9]{4}");

		date.compile(pattern_);
		if((result = date.exec(query))){
			aux.day = result[1] *1;
		}else{
			return {day: false, month: false, year: false};
		}
	
		pattern_ = pattern.replace(/%dd/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%mm/g,"([0-9]{1,2})");
		pattern_ = pattern_.replace(/%yy/g,"[0-9]{4}");
		pattern_ = pattern_.replace(/%d/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%m/g,"([0-9]{1,2})");
		pattern_ = pattern_.replace(/%y/g,"[0-9]{4}");

		date.compile(pattern_);
		if((result = date.exec(query))){
			aux.month = result[1] *1;
		}else{
			return {day: false, month: false, year: false};
		}
		pattern_ = pattern.replace(/%dd/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%mm/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%yy/g,"([0-9]{4})");
		
		pattern_ = pattern_.replace(/%d/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%m/g,"[0-9]{1,2}");
		pattern_ = pattern_.replace(/%y/g,"([0-9]{4})");

		date.compile(pattern_);
		if((result = date.exec(query))){
			aux.year = result[1] *1;
		}else{
			return {day: false, month: false, year: false};
		}

		return aux;
	};
	
	var evalFormat = function(y, m, d, query){
		if(!y || !m || !d ){
			return "";
		}
		
		y = y *1;
		m = m *1;
		d = d *1;
		
		query = query.replace(/%yy/g, y);
		//query = query.replace(/\byy\b/g,year);
		query = query.replace(/%mm/g, fillz(m));
		query = query.replace(/%m/g, m);
		query = query.replace(/%dd/g, fillz(d));
		query = query.replace(/%d/g, d *1);

		query = query.replace(/%M/g, _nameMonths[2][m]);
		query = query.replace(/%MM/g, _nameMonths[1][m]);

		var day = (new Date(y, m-1, d)).getDay();
		
		query = query.replace(/%D/g, _nameDays[3][day]);
		query = query.replace(/%DD/g, _nameDays[2][day]);
		query = query.replace(/%DDD/g, _nameDays[1][day]);

		query = query.replace(/%ww/g, _weekDate(y, m, d));
		
		return query;	
	};
	
	sgDate.getDateFrom = getDateFrom;
	
	sgDate.evalFormat = evalFormat;
	
	sgCalendar = function(opt){
		
		this.year = false;
		this.month = false;
		this.day = false;
		
		this.className = "";
		
		this.id = false;
		this.target = false;
		
		this.sixWeeks = false;
		this.showWeek = true;
		this.useWeek = true;
		
		//this.useRange = false;
		this.range = {from: false, to: false};
		
		this.showHolyday = true;
		this.showHolyInfo = true;
		this.showNotes = true;
		
		this.notes = false;
		this.holy = false;
		this.disableHoly = false;
		
		this.showBarMonth = true;
		this.showBarYear = true;
		this.showBarControl = true;
		this.showBarToday = true;
		
		this.disableDays = {0:0,1:0,2:0,3:0,4:0,5:0,6:0};
		this.disableDates = false;
		this.enableDates = false;
		
		this.stringToday = "Hoy es: %D %dd de %M de %yy";
		this.popupTitle = "%d/%m/%yy";
		
		this.onselectday = function(year, month, day, week){};
		this.onselectweek = function(week){};
		
		this.visible = true;
		
		for(var x in opt){
			if(this[x] !== undefined){
				this[x] = opt[x];
			}
		}
		
		this.lastItemYear = false;
		this.lastItemMonth = false;
		this.lastDate = false;
		
		this._holy = false;
		this._notes = false;
		this._target = false;
		this._yItem = [];
		this._mItem = [];
		
		this._enable = false;
		this._disable = false;

		this._create = false;
		
		var today = new Date();
		this.today = {
			y: today.getFullYear(),
			m: today.getMonth() + 1,
			d: today.getDate(),
			isHoly: false,
		};
		if(!this.year || !this.month || !this.day){
			this.year = false;
			this.month = false;
			this.day = false;
			
			this._value = this.today;	
		}else{
			this._value = {
				y: this.year *1,
				m: this.month *1,
				d: this.day *1
			};
		}
		
		if(this.holy){
			this.setHoly(this.holy);
		}
		if(this.notes){
			this.setNotes(this.notes);
		}

		if(this.enableDates){
			this.setEnableDates(this.enableDates);
		}else if(this.disableDates){
			this.setDisableDates(this.disableDates);
		}
		
		
		if(this.visible){
			this.create();
			this.setCal(this._value.y, this._value.m, this._value.d);
		}
		
			
	};
	
	sgCalendar.prototype = {
		
		create: function(){
		
			if(this._create){
				return;
			}
			this._create = true;
			var target = this._target = $(this.target);
			
			this._main = target.create({
				tagName: "div",
				id: this.id,
				className: this.className,
			});
			
			this._main.ds("sgType", "sg-cal");
			this._main.addClass("sg-cal");
			
			this.barMonth();
			this.barYear();
			this.barControl();
			
			this._body = this._main.create("div");
			this._body.addClass("sg-cal-body");
			
			this.barToday();
			
			this.popupNote();
			
			
		},
		
		popupNote: function(){
			this._pNoteTitle = $.create("div").text("hola").addClass("note-title");
			this._pNoteBody = $.create("div").text("hola").addClass("note-body");
			this.popup = new sgPopup({target:this._main, className:"sg-cal-popup"});
			this.popup.append(this._pNoteTitle);	
			this.popup.append(this._pNoteBody);	
		},
		
		barMonth: function(){
			if(!this.showBarMonth){
				return true;
			}
			
			this._months = this._main.create("div");
			this._months.addClass("sg-cal-months");
			
			var item;
			for(var i = 1; i <= 12; i++){
				this._mItem[i] = item = this._months.create("span");
				item.text(_nameMonths[1][i]);
				if(i === this._value.m){
					this.lastItemMonth = item;
					item.addClass("active");
				}
				item.on("click", this._monthClick(i));
				
			}
		},

		barYear: function(){
			if(!this.showBarYear){
				return true;
			}
			
			this._years = this._main.create("div");
			
			this._years.addClass("sg-cal-years");
			
			var item, y = this._value.y - 2;
			
			for(var i = 0;i < 5; i++){
				
				this._yItem[i] = item = this._years.create("span");
				item.ds("sgCalMyValue", y);
				if(y === this._value.y){
					item.addClass("active");
				}else{
					item.on("click", this._yearClick(i - 2));
				}
				
				y++;
				
			}
		},
		
		barControl: function(){
			if(!this.showBarControl){
				return true;
			}
			
			this._control = this._main.create("div");
			this._control.addClass("sg-cal-head");
			
			var bMonth = this._control.create("span");
			var bYear = this._control.create("span");
			
			bMonth.addClass("b-month");
			bYear.addClass("b-year");
			
			var ME = this, i = 0;
			var pMonth = this._pMonth = bMonth.create("span");
			
			pMonth.on("click", function(){
				ME.setMonth(-1, true);
			});
			
			var lstMonth = this._lstMonth = bMonth.create("select");
			for(i = 1; i <= 12; i++){
				lstMonth.create("option").prop({
					value: i,
					text: _nameMonths[2][i]
				});
			}

			lstMonth.on("change", function(){
				ME.setCal(ME._value.y, this.value *1, ME._value.d);
			});

			var nMonth = this._nMonth = bMonth.create("span");

			nMonth.on("click", function(){
				ME.setMonth(1, true);
			});
			
			
			var pYear = bYear.create("span").text("&laquo;");
			pYear.addClass("sg-p-year");
			pYear.on("click", function(){
				ME.setYear(-1, true);
			});
			
			var lstYear = this._lstYear = bYear.create("select");
			
			for(i = this._value.y +20; i >= this._value.y -100; i--){
				lstYear.create("option").prop({
					value: i,
					text: i,
					_selected: (i == this._value.y)? "selected": ""
				});
			}
			
			lstYear.on("change", function(){
					
				ME.setCal(this.value*1, ME._value.m, ME._value.d);

			});
			
			var nYear = bYear.create("span").text("&raquo;");
			nYear.addClass("sg-n-year");
			nYear.on("click", function(){
				ME.setYear(1, true);
			});
		},
		
		barToday: function(){
			if(!this.showBarToday){
				return true;
			}
			
			var holy = "";
			if(this.showHolyday){
				holy = this.isHoly(this.today);
				if(holy){
					this.today.isHoly = true;
					holy = "<span class=\"info\">" + holy + "</span>";
				}
			}
			
			var foot = this._main.create("div").text(evalFormat(this.today.y, this.today.m, this.today.d, this.stringToday) + holy);
			
			foot.addClass("sg-cal-foot");
			var ME = this;
			if(this._validRules(this.today)){
				foot.on("click", function(){
					if(ME.lastDate){
						ME.lastDate.removeClass("selected");
					}
					ME.lastDate = false;
					
					ME.setValue(ME.today);
					ME.setCal(ME.today.y, ME.today.m, ME.today.d);
				});
				
			}else{
				foot.addClass("invalid");
			}
			
			
		},
		
		setCal: function(year, month, day){
			
			this._value = {
				y: year,
				m: month,
				d: day
			};
			
			this.year = year;
			this.month = month;
			this.day = day;
				
			this.table(year, month, day);
			
			this.setItemMonth(month);
			this.setItemYear(year);
			this.updateControl(year, month);
		},
		
		table: function(year, month, day){
			
			var i, r, c, _day = 1, invalid = false;
			
			
			
			var info = infoDate(year, month, day);
			
			var week =_weekDate(year, month, 1);
			
			if(week > 10 && month === 1){
				week =  1;
			}
			
			var days = info.days;
			var day1 = info.dayOne;
			
			var day_one = 0;
			
			day1 = (day1 +((7-day_one)%7))%7;
			
			//db(day1, "Red")
			
			var prev = new Date(year, month-1, 1); 
			//db(prev.toLocaleString(),"purple");
			prev.setDate(prev.getDate() - ((day1 == 0)? 7: day1));
			//db(prev.getFullYear()+" "+prev.getMonth()+" "+prev.getDate());
			//db(_weekDate(prev.getFullYear(), prev.getMonth()+1, 11),"blue","aqua")
			var week0 = _weekDate(prev.getFullYear(), prev.getMonth()+1, prev.getDate());
			
			if(week0 === week){
				week1 = week;
			}
			//db(7-day_one,"blue")
			
			var prevDate = prev.getDate();
			//db(prevDate)
			//db(prev.toLocaleString(),"green");
			
			
			var next = new Date(year, month-1, 1);
			next.setDate(next.getDate() + days -1 +7 -day_one);
			
			var week1 = _weekDate(next.getFullYear(), next.getMonth() +1, next.getDate());
			
			//db(next.toLocaleString(),"red");			
			
			var t = document.createElement("table");
			//t.border = "2";
			
			r = t.insertRow(-1);
			
			//c = r.insertCell(-1);
			//c.innerHTML = _nameDays[2][0];
				
			if(this.showWeek){
				c = r.insertCell();
				c.className = "head week";
				
				c.innerHTML = _weekTitle[0][1];
				
			}
			for(i = 0; i < 7; i++){
				c = r.insertCell(-1);
				c.className = "head";
				c.innerHTML = _nameDays[2][(i +day_one) %7];
			}
			
			var _day = 1, _nextDay = 1, _week = 0, holy = false;
			
			
			if(day1 === 0){
				dayFirst = 7;
			}else{
				dayFirst = day1;
			}
			
			var select = false;
			for(var i = 0; i < 42; i++){
				
				invalid = false;
				
				if(i%7 == 0){
					r = t.insertRow(-1);
					if(this.showWeek){
						
						
						if(i < dayFirst){
							if(week0 === week){
								_week = week++;
							}else{
								_week = week0;
							}
							
							
						}
						if(i >= dayFirst){
							if(_day <= days){
								_week = week++;
							}else{
								_week = week1;
							}
							
						}
						c = r.insertCell();
						c.className = "week";
						c.innerHTML = _week;
						if(this.useWeek){
							c.className += " active";
							c.onclick = this._selectWeek(_week);
						}
						

					}
				}
				
				c = r.insertCell();
				
				if(i < dayFirst){
					select = {
						y: prev.getFullYear(),
						m: prev.getMonth()+1,
						d: prevDate
					};
					c.className = "prev";
					c.innerHTML = prevDate++;
				}
				
				if(i >= dayFirst){
					
				 	if(_day <= days){
						select = {
							y: info.date.getFullYear(),
							m: info.date.getMonth()+1,
							d: _day
						};
						
						c.className = "date";
						c.innerHTML = _day++;
						
						if(this.today.y == select.y && this.today.m == select.m && this.today.d == select.d){
							c.className += " today";
						}
						
						if(this.year == select.y && this.month == select.m && this.day == select.d){
							this.lastDate = $(c);
							c.className += " selected";
						}
						
					}else{
						select = {
							y: next.getFullYear(),
							m: next.getMonth()+1,
							d: _nextDay
						};
						
						c.className = "next";
						c.innerHTML = _nextDay++;
					}
				
				}
				select.day = i %7;
				select.isHoly = false;
				select.hasNote = false;
				
				if(this.showHolyday){
					holy = this.isHoly(select);
				
					if(holy){
						select.isHoly = true;
						c.className += " holy";
						c.title = holy;
						if(this.showHolyInfo){
							this.setNote(c, select, holy);
						}
						
					}
				}
				
				if(this.showNotes){
					holy = this.hasNote(select);
				
					if(holy){
						select.hasNote = true;
						c.className += " note";
						this.setNote(c, select, holy, "note");
						
					}
				}
				
				
				
				if(!this._validRules(select)){
					c.className += " invalid";
					continue;
				}
				
				
				c.onclick = this._setValue(select);
				
			}
			
			this._body.text("");
			this._body.append(t);
			return t;
			
			
		},
		
		_validRules: function(date){
			var value = false;
			
			if(this._enable && !this.isIn(date, this._enable)){
				return false;
			}else if(this._disable && this.isIn(date, this._disable)){
				return false;
			}
			if(this.disableHoly && date.isHoly){
				return false;
			}
			if(this.range.from && sgDate.date(date) < sgDate.date(this.range.from)){
				return false;
			}
			if(this.range.to && sgDate.date(date) > sgDate.date(this.range.to)){
				return false;
			}
			if(this.disableDays[date.day]){
				return false;
			}
			return true;
		},
		
		setYear: function(n, delta){
			 
			this.setCal((delta)?this._value.y + n: n, this._value.m, this._value.d);
			
		},

		setMonth: function(n, delta){
			
			if(delta){
				var aux = (this._value.y - 1) *12 + this._value.m + n;
				
				var m = aux %12;
				if(m === 0){
					m = 12;
				}
				
				this.setCal(Math.ceil((aux) /12), m, this._value.d);
			}else{
				this.setCal(this._value.y, n, this._value.d);
			}
			
		},
		
		setItemYear: function(year){
			
			if(!this.showBarYear){
				return true;
			}
			
			var y = year - 2, text = "";
			
			
			for(var i = 0;i < 5; i++){
				
				text = y;
				
				if(i<2){
					text = "&laquo; " + y;
				}
				
				if(i>2){
					text = y + " &raquo;";
				}
				this._yItem[i].text(text);				
				
				this._yItem[i].ds("sgCalMyValue", y);
				
				y++;
			}
			
		},

		setItemMonth: function(month){
			if(!this.showBarMonth){
				return false;
			}
			if(this.lastItemMonth){
				this.lastItemMonth.removeClass("active");
			}
			
			this.lastItemMonth = this._mItem[month];
			this._mItem[month].addClass("active");
			
		},
		
		updateControl: function(year, month){
			
			if(!this.showBarControl){
				return true;
			}
			this._lstYear.get().value = year;
			this._lstMonth.get().value = month;

			this._pMonth.text("&laquo; " + _nameMonths[1][(month == 1)? 12: month - 1]);
			this._nMonth.text(_nameMonths[1][month %12 + 1] + " &raquo;");
		},
		
		getValue: function(){
			
			return {
				y: this.year,
				m: this.month,
				d: this.day,
				
			};
		},
		
		setValue: function(date){
			
			if(this._validRules(date)){
				this.year = date.y;
				this.month = date.m;
				this.day = date.d;
				this.onselectday(date);	
			}
			
		},
		
		setNote: function(cell, date, info, type){
			cell.style.position = "relative";
			var tip = $.create("div");
			tip.addClass("sgcal-"+(type || "ind"));
			tip.style({
				position:"absolute",
				_border:"4px solid red",
				_right:"0px",
				_top:"0px"
			});
			
			
			var ME = this;
			tip.on("click", function(event){
				event.preventDefault();
				event.returnValue = false;
				event.cancelBubble = true;
				
				ME._pNoteTitle.text(evalFormat(date.y, date.m, date.d, ME.popupTitle));
				ME._pNoteBody.text(info);
				//ME.popup.setBody(info);
				ME.popup.setClass(type || "holy");
				ME.popup.show({ref:cell, left:"front", top:"middle"});
				
			});
			cell.appendChild(tip.get());
			
			
			
		},
		
		isHoly: function(date){
			if(this._holy){
				var info = sgDate.isHolyFrom(this._holy, date.y, date.m, date.d);
				if(info){
					return info;	
				}
			}
			return sgDate.isHoly(date.y, date.m, date.d) || "";
		},
		
		setHoly: function(data){
		
			this.holy = data;
			this._holy = sgDate.indexHoly(data);
		
		},
		
		hasNote: function(date){
			if(this._notes){
				return sgDate.isHolyFrom(this._notes, date.y, date.m, date.d);
			}
			return false;
		},
		
		isIn: function(date, data){
			
			return sgDate.isHolyFrom(data, date.y, date.m, date.d);
			
		},
		
		setNotes: function(data){
		
			this.notes = data;
			this._notes = sgDate.indexHoly(data);
		
		},
		
		setEnableDates: function(data){
			this.enableDates = data;
			this._enable = sgDate.indexHoly(data);
		},
		
		setDisableDates: function(data){
			this.disableDates = data;
			this._disable = sgDate.indexHoly(data);
		},
		
		_monthClick: function(delta){
			var ME = this;
			return function(){
				ME.setMonth(delta, false);
			};
		},
		
		_yearClick: function(delta){
			var ME = this;
			return function(){
				ME.setYear(delta, true);
			};
		},
	
		_setValue: function(date){
			
			var ME = this;
			return function(){
				
				if(ME.lastDate){
					ME.lastDate.removeClass("selected");
				}
				ME.lastDate = $(this);
				ME.lastDate.addClass("selected");
				ME.setValue(date);
			};
		},
		
		_selectWeek: function(week){
			
			var ME = this;
			return function(){
				ME.onselectweek(week);
			};
			
			
		},
		
		getDateFrom: getDateFrom,
		
		evalFormat: evalFormat,
	};
	
	
	sgDatePicker = function (opt){
		opt.visible = true;
		

		
		this._popup = new sgWindow({
			className: "alfa1",
			classImage: "clock",
			mode: "auto",
			visible: false,
			caption:"Calendario",
			autoClose: true,
			delay:0,
			id: this.id,

		});
		opt.target = this._popup.getBody();
		sgCalendar.call(this, opt);
		
	};
	
	sgDatePicker.prototype = new sgCalendar({visible: false});
	
	
	sgDatePicker.prototype.show = function(opt){
		this._popup.show(opt);
	};
	
	sgDatePicker.prototype.hide = function(){
		this._popup.hide();
	};
	
	var holy = [


		[0,1,1,"Año Nuevo"],
		[0,4,19,"Declaración de la Independencia"],
		[0,5,1,"Día del Trabajador"],
		[0,6,24,"Batalla de Carabobo"],
		[0,7,5,"Firma del Acta de Independencia"],
		[0,7,24,"Natalicio del Libertador Simón Bolívar"],
		[0,10,12,"Día de la Resitencia Indigena"],
		[0,12,24,"Víspera de Navidad"],
		[0,12,25,"Navidad"],
		[0,12,31,"Fin de Año"],

		[2017,4,13,"Jueves Santo"],
		[2017,4,14,"Viernes Santo"],

		[2017,2,27,"Lunes de Carnaval"],
		[2017,2,28,"Martes de Carnaval"],




	];
	sgDate.setHoly(holy);
	
})(_sgQuery, _sgFloat, sgWindow, sgPopup);



