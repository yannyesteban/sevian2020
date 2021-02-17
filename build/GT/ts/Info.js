var GTInfo = (($) => {
    class Info {
        constructor(info) {
            this.id = null;
            this.caption = "INFO";
            this.form = null;
            this._main = null;
            this._form = null;
            this._infoBody = null;
            this._win = [];
            for (var x in info) {
                if (this.hasOwnProperty(x)) {
                    this[x] = info[x];
                }
            }
            let main = (this.id) ? $(this.id) : false;
            if (main) {
                if (main.ds("gtInfo")) {
                    return;
                }
                if (main.hasClass("gt-info")) {
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
            this._main = main;
            main.addClass("gt-info-main");
            this._win["info-main"] = new Float.Window({
                visible: true,
                caption: this.caption,
                //left:1180 -160,
                //top:100,
                left: "right",
                top: "top",
                deltaX: -50,
                deltaY: 100,
                width: "330px",
                height: "200px",
                mode: "custom",
                className: ["sevian"],
                child: main.get()
            });
        }
        show() {
            this._win["info-main"].show();
        }
        setCaption(caption) {
            this._win["info-main"].setCaption(caption);
        }
        setText(text) {
            this._main.text(text);
        }
    }
    return Info;
})(_sgQuery);
//# sourceMappingURL=Info.js.map