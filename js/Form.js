const mTab = (($) => {
    class Tab {
        constructor(opt) {
            this.target = false;
            this.name = "";
            this.id = "";
            this.value = 0;
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let _target = $(this.target);
            if (_target && _target.get().tagName != "FORM") {
                let form = _target.create({
                    tagName: "form",
                    name: this.name
                }).ds("sgType", "sg-form");
            }
            else {
                this.load();
            }
        }
        load() {
            let main = $(this.id);
            main.addClass("sg-tab");
            let tab_parts = main.childs();
            let menu = tab_parts[0];
            let page = tab_parts[1];
            let mItem = menu.children;
            for (let i = 0; i < mItem.length; i++) {
                $(mItem[i]).on("click", this._click(i)).on("focus", this._click(i)).removeClass("sg-tab-active");
            }
            $(page).addClass("sg-tab-body");
            this.setValue(this.value);
        }
        _click(index) {
            var ME = this;
            return function () {
                ME.show(index);
            };
        }
        setVisible(index, value) {
            let main = $(this.id);
            let tab_parts = main.childs();
            let menu = tab_parts[0];
            let page = tab_parts[1];
            let mItem = menu.children;
            let pItem = page.children;
            if (mItem[index] && pItem[index]) {
                if (value) {
                    $(mItem[index]).addClass("sg-tab-active");
                    $(pItem[index]).addClass("sg-tab-active");
                }
                else {
                    $(mItem[index]).removeClass("sg-tab-active");
                    $(pItem[index]).removeClass("sg-tab-active");
                }
            }
        }
        show(index) {
            if (index === this.value) {
                return false;
            }
            if (this.value !== false) {
                var onClose = true; // =this.onClose(index);
                if (onClose === undefined || onClose === true) {
                    this.setVisible(this.value, false);
                }
                else {
                    return false;
                }
            }
            this.setVisible(index, true);
            this.value = index;
            //this.onOpen(index);
            return true;
        }
        setValue(index) {
            this.value = false;
            this.show(index);
        }
    }
    return Tab;
})(_sgQuery);
let tab = new mTab({
    id: "tab01"
});
const Input = (($) => {
    class Input {
        constructor(opt) {
            this.target = false;
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
        }
    }
    return Input;
})(_sgQuery);
const Page = (($) => {
    class Page {
        constructor(opt) {
            this.target = false;
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
        }
    }
    return Page;
})(_sgQuery);
const Form = (($) => {
    class Form {
        constructor(opt) {
            this.target = false;
            this.name = "";
            for (var x in opt) {
                if (this.hasOwnProperty(x)) {
                    this[x] = opt[x];
                }
            }
            let _target = $(this.target);
            if (_target && _target.get().tagName != "FORM") {
                let form = _target.create({
                    tagName: "form",
                    name: this.name
                }).ds("sgType", "sg-form");
            }
        }
        create() {
        }
    }
    return Form;
})(_sgQuery);
let F = new Form({
    target: "f100",
    name: "form_100"
});
