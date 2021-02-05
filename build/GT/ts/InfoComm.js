function humanDiff(t1, t2) {
    const diff = Math.max(t1, t2) - Math.min(t1, t2);
    const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN;
    const hrs = Math.floor(diff / HRS);
    const min = Math.floor((diff % HRS) / MIN).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    const sec = Math.floor((diff % MIN) / SEC).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    const ms = Math.floor(diff % SEC).toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false });
    //return `${hrs}:${min}:${sec}.${ms}`
    return `${hrs}:${min}:${sec}`;
}
var InfoMenu = (($) => {
    class InfoMenu {
        constructor(info) {
            this.id = "";
            this.target = null;
            this.mainClass = "";
            this.main = null;
            this.types = [];
            this.menu = null;
            //console.di(info);
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (!main) {
                main = $.create("div").attr("id", this.id || "");
            }
            this._create(main);
        }
        _create(main) {
            const items = [];
            this.types.forEach((e) => {
                items.push({
                    value: e.value,
                    caption: e.caption,
                });
            });
            return;
            this.menu = new Menu({
                caption: "uuuu",
                autoClose: true,
                target: main,
                type: "popup",
                subType: "dropdown",
                "className": ["", "sevian", "horizontal"],
                items: items
            });
        }
        updateType(type, text) {
            if (text === 0) {
                text = "";
            }
            this.menu.getByValue(type).getCaption().text(text);
        }
    }
    return InfoMenu;
})(_sgQuery);
var InfoComm = (($) => {
    class InfoComm {
        constructor(info) {
            this.id = "";
            this.target = null;
            this.mainClass = "";
            this.main = null;
            this.counts = [];
            this.onread = (info) => { alert(info.name); };
            this.onadd = (info) => { };
            this.lineId = 0;
            /*
            types
            1:unit conected
            2:unit disconected
            3:unit sync message
            4:unit get position
            5:unit alarm
            6:unit event
            7:unit message
            8:unit command
            
            */
            this.types = {
                1: "unit conected",
                2: "unit disconected",
                3: "unit sync message",
                4: "unit get position",
                5: "unit alarm",
                6: "unit event",
                7: "unit message",
                8: "unit command"
            };
            //console.di(info);
            for (let x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            for (let x in this.types) {
                this.counts[x] = 0;
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
            }
            else {
                main = $.create("div").attr("id", this.id);
            }
            this._create(main);
            this.initTimer();
        }
        _create(main) {
            this.main = main;
            main.addClass(this.mainClass);
            let mainPanel = this.ul = main.create("div").addClass("info-comm").id("xxy");
        }
        add(message) {
            this.lineId++;
            const div = this.ul.createFirst("div").addClass("main").removeClass("open").addClass("new")
                .ds("line", this.lineId).ds("type", message.type);
            div.on("click", () => {
                div.removeClass("new");
                this.onread(message);
            });
            div.create("div").text(message.name || "")
                .on("click", () => {
                div.toggleClass("open");
            });
            const date = new Date();
            const start = date.getTime();
            div.create("div").text("Ahora").addClass("date").ds("date", date.toISOString()).ds("time", start);
            div.create("div").text(message.cType || "");
            div.create("div").text(message.message || "");
            if (typeof (message.info) === "object") {
                const detail = div.create("div").addClass("detail");
                for (let x in message.info) {
                    detail.create("span").text(x);
                    detail.create("span").text(message.info[x]);
                }
            }
            this.onadd(message);
        }
        get() {
            return this.main;
        }
        initTimer() {
            setInterval(() => {
                this.updateTime();
            }, 60000);
        }
        updateTime() {
            const x = this.main.queryAll(".date");
            const date = new Date();
            const now = date.getTime();
            let start = null;
            for (let e of x) {
                start = new Date($(e).ds("date"));
                $(e).text(humanDiff(date, start));
            }
        }
        getCounts() {
            for (let x in this.types) {
                this.counts[x] = 0;
            }
            for (let x in this.counts) {
                const ele = this.main.queryAll(`.new[data-type='${x}']`);
                ele.forEach(element => {
                    this.counts[x]++;
                });
            }
            return this.counts;
        }
    }
    return InfoComm;
})(_sgQuery);
//# sourceMappingURL=InfoComm.js.map