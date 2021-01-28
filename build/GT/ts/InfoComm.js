var InfoComm = (($) => {
    class InfoComm {
        constructor(info) {
            this.id = null;
            this.target = null;
            this.mainClass = "";
            this.main = null;
            //console.di(info);
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
            }
            else {
                main = $.create("div").attr("id", this.id);
            }
            this._create(main);
        }
        _create(main) {
            this.main = main;
            main.addClass(this.mainClass);
            let mainPanel = main.create("div").addClass("mainPanel").id("xxy");
        }
        add(options) {
        }
    }
    return InfoComm;
})(_sgQuery);
//# sourceMappingURL=InfoComm.js.map