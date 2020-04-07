var One = (($) => {
    class One {
        constructor(info) {
            this.id = null;
            this.target = null;
            this.form = null;
            this._main = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (!main) {
                main = $.create("div").attr("id", this.id);
            }
            this._create(main);
        }
        _create(main) {
            main.create("div").addClass("X").text("test ONE One");
        }
    }
    return One;
})(_sgQuery);
