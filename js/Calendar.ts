var Calendar = (($) => {
    let _daysXMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    
    let daysXMonth = function(y, m){
		if(m === 2){
			return 28 + (((y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0))? 1: 0);
		}
		return _daysXMonth[m - 1];
    };
    
    let weekDate = function(y, m, d){
		
		let 
			dateOne = new Date(y, 0, 1),
			dayOne = dateOne.getDay(),
			delta = (dayOne > 4)? 1: 0,
			sum = d;
		
		for(var i=0; i < m-1; i++){
			sum += daysXMonth(y, i + 1);
		}
		if((Math.ceil((dayOne + sum) /7) - delta) === 0){
			return weekDate(y - 1, 12, 31);
		}else{
			return Math.ceil((dayOne + sum) /7);
		}
    
    }

    let infoDate = function(y, m, d){
		
		return {
			date: new Date(y, m-1, d || 1),
			dateOne: new Date(y, m-1, 1),
			dayOne: (new Date(y, m-1, 1)).getDay(),
			dayLast: (new Date(y, m-1, 1)).getDay(),
			days: daysXMonth(y, m)
			
		}
		
		
    };
    
    let nameMonths = [
		["E","F","M","A","M","J","J","A","S","O","N","D"],
		["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
		["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
    ];
    
    let nameDays = [
		["D","L","M","M","J","V","S"],
		["Do","Lu","Ma","Mi","Ju","Vi","S&aacute;"],
		["Dom","Lun","Mar","Mi&eacute;","Jue","Vie","S&aacute;b"],
		["Domingo","Lunes","Martes","Mi&eacute;rcoles","Jueves","Viernes","S&aacute;bado"]		
    ];
    
    let weekTitle = [["S", "Sem"]];

    class Calendar{

        id:any = null;
        target:any = null;

        date:object = {};
        today:object = {};
        className:any = null; 

        beginDay:number = 0;
        showHolyday:boolean = true;
		showHolyInfo:boolean = true;
        showNotes:boolean = true;
        
        showBarMonth:boolean = true;
		showBarYear:boolean = true;
		showBarControl:boolean = true;
		showBarToday:boolean = true;

        _main:object = null;
        nameMonths:any[] = nameMonths;
        nameDays:any[] = nameDays;
        weekTitle:any[] = weekTitle;
        
        constructor(info){

            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }

            var today = new Date();
            this.today = {
                y: today.getFullYear(),
                m: today.getMonth() + 1,
                d: today.getDate(),
                isHoly: false,
            };

            let main = this._main = (this.id)? $(this.id) : false;
            if(main){
                
                if(main.ds("sgCalendar")){
                    return;
                }

                if(main.hasClass("sg-calendar")){
                    this._load(main);
                }else{
                   
                    this._create(main);
                }

            }else{
                
                main = $("").create("div");
                this._create(main);

            }

            if(this.target){
                $(this.target).append(main);


            }


        }

        _create(main:any){
            this._main = main;
            main.addClass("sg-calendar").id(this.id);
            let i:number = null;

            let mBar = main.create("div").addClass("m-bar");
            for(i=0; i < 12; i++){
                mBar.create("span").text(this.nameMonths[1][i]).ds("month", (i+1));
            }
            let yBar = main.create("div").addClass("y-bar");
            for(i=0; i < 5; i++){
                yBar.create("span").text(i).ds("index", (i+1));
            }

            let cBar = main.create("div").addClass("c-bar");

            let cMonth = main.create("div").addClass("c-month");
            cMonth.create("span").text("&laquo;");
            let select = cMonth.create("select");
            for(i = 1; i <= 12; i++){
				select.create("option").prop({
					value: i,
					text: this.nameMonths[2][i]
				});
			}
            cMonth.create("span").text("&raquo;");

            let cYear = main.create("div").addClass("c-year");
            cYear.create("span").text("&laquo;");
            let select2 = cYear.create("select");
            for(i = 1950; i <= 2040; i++){
				select2.create("option").prop({
					value: i,
					text: i
				});
			}
            cYear.create("span").text("&raquo;");


            let table = main.create("table");

            let tr = table.create("thead").create("tr");
            tr.create("td").text(weekTitle[0][1]);
            for(i=0; i < 7; i++){
                tr.create("td").text(this.nameDays[2][(i + this.beginDay) % 7]);
            }
            table.create("tbody").addClass("grid");

            this.grid(this.date.year, this.date.month, this.date.day);
        }
        _load(main:any){

        }

        grid(year, month, day){

            let info = infoDate(year, month, day);

            var day_one = 1;
			var day1 = info.dayOne;
			day1 = (day1 +((7-day_one)%7))%7;

            let prev = new Date(year, month -1, 1); 

            prev.setDate(prev.getDate() - ((day1 == 0)? 7: day1));

            let date = new Date(year, month -1, day); 
            let next = new Date(year, month, 1); 

            console.log(info)

            db (prev+" <hr>"+date+" <hr>"+next,"red")

            let grid = $(this._main.query(".grid"));
            grid.text("");

            let tr = null;
            for(let i=0;i<31;i++){
                
                if(i % 7 == 0){
                    tr = grid.create("tr");

                }

                tr.create("td").text(i);
            }
        }




    }


    $(window).on("load", ()=>{
        let div = $("#form_p4").create("div").text("Calendario");

        let cal = new Calendar({
            id:"cal1",
            target:div,
            date:{
                year:2019,
                month:12,
                day:15
            }

        });

    }


    return Calendar;

})(_sgQuery);