var Calendar = (($) => {
    let _daysXMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let daysXMonth = function (y, m) {
        if (m === 2) {
            return 28 + (((y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0)) ? 1 : 0);
        }
        return _daysXMonth[m - 1];
    };
    let weekDate = function (y, m, d) {
        let dateOne = new Date(y, 0, 1), dayOne = dateOne.getDay(), delta = (dayOne > 4) ? 1 : 0, sum = d;
        for (var i = 0; i < m - 1; i++) {
            sum += daysXMonth(y, i + 1);
        }
        if ((Math.ceil((dayOne + sum) / 7) - delta) === 0) {
            return weekDate(y - 1, 12, 31);
        }
        else {
            return Math.ceil((dayOne + sum) / 7);
        }
    };
    let infoDate = function (y, m, d) {
        return {
            date: new Date(y, m - 1, d || 1),
            dateOne: new Date(y, m - 1, 1),
            dayOne: (new Date(y, m - 1, 1)).getDay(),
            dayLast: (new Date(y, m - 1, 1)).getDay(),
            days: daysXMonth(y, m)
        };
    };
    let fillz = function (value) {
        value = "0" + value;
        return value.substr(value.length - 2);
    };
    let evalFormat = function (date, query) {
        let y = date.getFullYear();
        let m = date.getMonth();
        let d = date.getDate();
        if (!y || !m || !d) {
            return "";
        }
        /*
        y = y *1;
        m = m *1;
        d = d *1;
        */
        query = query.replace(/%yy/g, y);
        //query = query.replace(/\byy\b/g,year);
        query = query.replace(/%mm/g, fillz(m));
        query = query.replace(/%m/g, m);
        query = query.replace(/%dd/g, fillz(d));
        query = query.replace(/%d/g, d);
        query = query.replace(/%M/g, nameMonths[2][m]);
        query = query.replace(/%MM/g, nameMonths[1][m]);
        let day = date.getDay();
        query = query.replace(/%D/g, nameDays[3][day]);
        query = query.replace(/%DD/g, nameDays[2][day]);
        query = query.replace(/%DDD/g, nameDays[1][day]);
        query = query.replace(/%ww/g, weekDate(y, m, d));
        return query;
    };
    let nameMonths = [
        ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
        ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    ];
    let nameDays = [
        ["D", "L", "M", "M", "J", "V", "S"],
        ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "S&aacute;"],
        ["Dom", "Lun", "Mar", "Mi&eacute;", "Jue", "Vie", "S&aacute;b"],
        ["Domingo", "Lunes", "Martes", "Mi&eacute;rcoles", "Jueves", "Viernes", "S&aacute;bado"]
    ];
    let weekTitle = [["S", "Sem"]];
    class Calendar {
        constructor(info) {
            this.id = null;
            this.target = null;
            this.year = null;
            this.month = null;
            this.day = null;
            this.date = null;
            this.today = null;
            this.className = null;
            this.beginDay = 0;
            this.showHolyday = true;
            this.showHolyInfo = true;
            this.showNotes = true;
            this.showBarMonth = true;
            this.showBarYear = true;
            this.showBarControl = true;
            this.showBarToday = true;
            this.showWeek = true;
            this.stringToday = "Hoy es: %D %dd de %M de %yy";
            this.popupTitle = "%d/%m/%yy";
            this._main = null;
            this._date = null;
            this.nameMonths = nameMonths;
            this.nameDays = nameDays;
            this.weekTitle = weekTitle;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            this.today = new Date();
            if (!this.year || !this.month || !this.day) {
                this.date = new Date();
            }
            else {
                this.date = new Date(this.year, this.month - 1, this.day);
            }
            let main = this._main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sgCalendar")) {
                    return;
                }
                if (main.hasClass("sg-calendar")) {
                    this._load(main);
                }
                else {
                    this._create(main);
                }
            }
            else {
                main = $("").create("div");
                this._create(main);
            }
            if (this.target) {
                $(this.target).append(main);
            }
            this.setCal(this.date);
        }
        _create(main) {
            this._main = main;
            main.addClass("sg-calendar").id(this.id);
            let i = null;
            let yBar = main.create("div").addClass("y-bar");
            for (i = 0; i < 5; i++) {
                yBar.create("span").ds("index", (i))
                    .on("click", (event) => {
                    if (event.currentTarget.dataset.index == 2) {
                    }
                    else {
                        this.addYear(event.currentTarget.dataset.index - 2);
                    }
                });
            }
            let mBar = main.create("div").addClass("m-bar");
            for (i = 0; i < 12; i++) {
                mBar.create("span").text(this.nameMonths[1][i]).ds("month", (i + 1))
                    .on("click", this._setMonth(i + 1));
            }
            let cBar = main.create("div").addClass("c-bar");
            let cMonth = cBar.create("div").addClass("c-month");
            cMonth.create("span").addClass("p-month").text("&laquo;")
                .on("click", () => this.addMonth(-1));
            ;
            let select = cMonth.create("select").addClass("m-select")
                .on("change", (event) => this.setMonth(event.currentTarget.value));
            for (i = 1; i <= 12; i++) {
                select.create("option").prop({
                    value: i,
                    text: this.nameMonths[2][i - 1]
                });
            }
            cMonth.create("span").addClass("n-month").text("--&raquo;")
                .on("click", () => this.addMonth(1));
            let cYear = cBar.create("div").addClass("c-year");
            cYear.create("span").addClass("p-year").text("&laquo;")
                .on("click", () => this.addYear(-1));
            let select2 = cYear.create("select").addClass("y-select")
                .on("change", (event) => this.setYear(event.currentTarget.value));
            for (i = this.today.getUTCFullYear() + 20; i >= this.today.getUTCFullYear() - 100; i--) {
                select2.create("option").prop({
                    value: i,
                    text: i
                });
            }
            cYear.create("span").addClass("n-year").text("&raquo;")
                .on("click", () => this.addYear(1));
            let table = main.create("table");
            let tr = table.create("thead").create("tr");
            tr.create("td").text(weekTitle[0][1]);
            for (i = 0; i < 7; i++) {
                tr.create("td").addClass("m-title").text(this.nameDays[2][(i + this.beginDay) % 7]);
            }
            table.create("tbody").addClass("grid");
            let bToday = main.create("div").addClass("today").text(evalFormat(this.today, this.stringToday))
                .on("click", () => this.setCal(this.today));
            //this.stringToday = "Hoy es: %D %dd de %M de %yy";
            //this.popupTitle = "%d/%m/%yy";
            this.grid(this.date);
        }
        _load(main) {
        }
        grid(pDate) {
            let info = infoDate(pDate.getFullYear(), pDate.getMonth() + 1, pDate.getDate());
            let day1 = info.dayOne;
            let days = info.days;
            let dayFirst = null;
            let date = new Date();
            let today = {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
            };
            let prev = new Date(pDate.getFullYear(), pDate.getMonth(), 1);
            day1 = (day1 + ((7 - this.beginDay) % 7)) % 7;
            prev.setDate(prev.getDate() - ((day1 == 0) ? 7 : day1));
            let next = new Date(pDate.getFullYear(), pDate.getMonth() + 1, 1);
            let prevDate = prev.getDate();
            if (day1 === 0) {
                dayFirst = 7;
            }
            else {
                dayFirst = day1;
            }
            let _week = null;
            let week = weekDate(prev.getFullYear(), prev.getMonth() + 1, prev.getDate());
            if (pDate.getMonth() + 1 == 1) {
                _week = weekDate(pDate.getFullYear(), pDate.getMonth() + 1, 1);
                if (dayFirst == 7 || _week != 1) {
                    _week = week;
                    week = 1;
                }
                else {
                    _week = null;
                    week = 1;
                }
            }
            let ini = 0, end = 42, cell = null, _day = 1, _nextDay = 1;
            let _info = { year: null, month: null, day: null };
            let classDay = null;
            let grid = $(this._main.query(".grid")).text("");
            let tr = null;
            for (let i = ini; i < end; i++) {
                if (i % 7 == 0) {
                    tr = grid.create("tr");
                    if (this.showWeek) {
                        if (_week !== null) {
                            tr.create("td").addClass("week").text(_week);
                            _week = null;
                        }
                        else {
                            tr.create("td").addClass("week").text(week++);
                        }
                    }
                }
                cell = tr.create("td");
                if (i < dayFirst) {
                    _info = {
                        year: prev.getFullYear(),
                        month: prev.getMonth() + 1,
                        day: prevDate++
                    };
                    classDay = "m-prev";
                }
                else if (_day <= days) {
                    _info = {
                        year: info.date.getFullYear(),
                        month: info.date.getMonth() + 1,
                        day: _day++
                    };
                    classDay = "m-now";
                }
                else {
                    _info = {
                        year: next.getFullYear(),
                        month: next.getMonth() + 1,
                        day: _nextDay++
                    };
                    classDay = "m-next";
                }
                cell.text(_info.day).addClass(classDay).on("click", this._setValue(_info));
                if (_info.year == today.year && _info.month == today.month && _info.day == today.day) {
                    cell.addClass("today");
                }
                if (_info.year == pDate.getFullYear() && _info.month == pDate.getMonth() + 1 && _info.day == pDate.getDate()) {
                    cell.addClass("active");
                }
            }
        }
        _validRules(date) {
            return true;
            var value = false;
            if (this._enable && !this.isIn(date, this._enable)) {
                return false;
            }
            else if (this._disable && this.isIn(date, this._disable)) {
                return false;
            }
            if (this.disableHoly && date.isHoly) {
                return false;
            }
            if (this.range.from && sgDate.date(date) < sgDate.date(this.range.from)) {
                return false;
            }
            if (this.range.to && sgDate.date(date) > sgDate.date(this.range.to)) {
                return false;
            }
            if (this.disableDays[date.day]) {
                return false;
            }
            return true;
        }
        setMonth(month) {
            let date = new Date(this.date.getFullYear(), month - 1, 1);
            this.setCal(date);
        }
        setYear(year) {
            let date = new Date(year, this.date.getMonth(), 1);
            this.setCal(date);
        }
        addMonth(delta) {
            let date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
            date.setMonth(date.getMonth() + delta);
            this.setCal(date);
        }
        addYear(delta) {
            let date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
            date.setFullYear(date.getFullYear() + delta);
            this.setCal(date);
        }
        setCal(date) {
            console.log(date);
            let month = date.getMonth() + 1;
            let years = this._main.queryAll(".y-bar > [data-index]");
            if (years) {
                years.forEach((item, index) => {
                    if (index < 2) {
                        $(item).text("&laquo; " + (date.getFullYear() - 2 + index));
                    }
                    else if (index > 2) {
                        $(item).text((date.getFullYear() - 2 + index) + " &raquo;");
                    }
                    else {
                        $(item).text((date.getFullYear() - 2 + index));
                    }
                });
            }
            let item = this._main.query(".m-bar > .active[data-month]");
            if (item) {
                $(item).removeClass("active");
            }
            item = this._main.query(".m-bar > [data-month='" + (month) + "']");
            if (item) {
                $(item).addClass("active");
            }
            item = this._main.query(".c-month > .p-month");
            if (item) {
                $(item).text("&laquo; " + this.nameMonths[1][(month == 1) ? 11 : month - 2]);
            }
            item = this._main.query(".c-month > .n-month");
            if (item) {
                db(month + 2);
                $(item).text(this.nameMonths[1][(month) % 12] + " &raquo;");
            }
            let select = this._main.query(".m-select");
            if (select) {
                select.value = month;
            }
            select = this._main.query(".y-select");
            if (select) {
                select.value = date.getFullYear();
            }
            this.grid(date);
            this.setValue(date);
        }
        setValue(date) {
            this.date = date;
            return;
            if (this._validRules(date)) {
                this.date.year = date.year;
                this.date.month = date.month;
                this.date.day = date.day;
                //this.onselectday(date);	
            }
        }
        getValue() {
            return {
                year: this.date.year,
                month: this.date.month,
                dday: this.date.day,
            };
        }
        _setValue(date) {
            return (event) => {
                let active = $(this._main.query(".grid .active"));
                if (active) {
                    active.removeClass("active");
                }
                $(event.currentTarget).addClass("active");
                this.setValue(new Date(date.year, date.month - 1, date.day));
            };
        }
        _setMonth(month) {
            return () => {
                this.setMonth(month);
            };
        }
        _setYear(year) {
            return () => {
                this.setYear(year);
            };
        }
    }
    $(window).on("load", () => {
        let div = $("#form_p4").create("div").text("Calendario");
        let cal = new Calendar({
            id: "cal1",
            target: div,
            year: 2019,
            month: 10,
            day: 24
        });
    });
    return Calendar;
})(_sgQuery);
