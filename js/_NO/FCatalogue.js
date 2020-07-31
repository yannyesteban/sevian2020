var SGFCatalogue = (($) => {
    class FCatalogue {
        constructor(info) {
            this.id = null;
            this.form = null;
            this.catalogue = null;
            this._main = null;
            this._form = null;
            this._infoBody = null;
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("sg-f-catalogue")) {
                    return;
                }
                if (main.hasClass("sg-f-catalogue")) {
                    this._load(main);
                }
                else {
                    this._create(main);
                }
            }
            else {
                main = $.create("div").attr("id", this.id);
                this._create(main);
            }
        }
        _create(main) {
            main.addClass("sg-f-catalogue");
            if (this.form) {
                this.form.target = main.id();
                this.form.parentContext = this;
                this._form = new Form2(this.form);
            }
            this._infoBody = main.create("div").addClass(["cat"]);
            if (this.catalogue) {
                this.loadCatalogue(this.catalogue);
            }
        }
        loadCatalogue(info) {
            this._infoBody.text(info.html);
        }
    }
    return FCatalogue;
})(_sgQuery);
