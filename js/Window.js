var Win = (($) => {
    class InfoElem {
        constructor() {
            this.e = false;
            this.left = null;
            this.top = null;
            this.z = null;
            this.deltaX = null;
            this.deltaY = null;
        }
    }
    let zIndex = 10000;
    let getIndex = () => {
        return zIndex++;
    };
    let on = function (obj, _event, _function) {
        if (obj.addEventListener) {
            _event = _event.replace(/^\s*on/gi, "");
            obj.addEventListener(_event, _function, false);
        }
        else if (obj.attachEvent) {
            obj.attachEvent(_event, _function);
        }
    };
    let off = function (obj, _event, _function) {
        if (obj.removeEventListener) {
            _event = _event.replace(/^\s*on/gi, "");
            obj.removeEventListener(_event, _function, false);
        }
        else if (obj.detachEvent) {
            obj.detachEvent(_event, _function);
        }
    };
    class Float {
        static init(e) {
            on(e, "mousedown", (event) => {
                e.style.zIndex = getIndex();
            });
            on(e, "touchstart", (event) => {
                e.style.zIndex = getIndex();
            });
        }
        static setIndex(e) {
            e.style.zIndex = getIndex();
        }
        static getXY(e) {
            let cW = document.documentElement.clientWidth, cH = document.documentElement.clientHeight, sT = document.documentElement.scrollTop, sL = document.documentElement.scrollLeft, width = e.offsetWidth, height = e.offsetHeight, rect = e.getBoundingClientRect();
            return {
                left: rect.left,
                top: rect.top,
                width: width,
                height: height,
                cW: cW, cH: cH, sT: sT, sL: sL
            };
        }
        static showElem(opt) {
            let e = opt.e, left = opt.left || 0, top = opt.top || 0, z = (opt.z !== undefined) ? opt.z : undefined;
            e.style.top = top + "px";
            e.style.left = left + "px";
            if (z !== undefined) {
                if (z > 0) {
                    e.style.zIndex = z;
                }
            }
            else {
                z = e.style.zIndex = getIndex();
            }
            return { e: e, left: left, top: top, z: z };
        }
        static show(opt) {
            let e = opt.e, xx = (opt.left === undefined) ? "center" : opt.left, yy = (opt.top === undefined) ? "middle" : opt.top, z = opt.z || undefined, deltaX = opt.deltaX || 0, deltaY = opt.deltaY || 0, left = false, top = false, c = {};
            if (typeof xx !== "number" || yy !== "number") {
                c = this.getXY(e);
            }
            if (typeof xx !== "number") {
                switch (xx) {
                    case "center":
                        left = c.sL + (c.cW - c.width) / 2;
                        break;
                    case "left":
                        left = c.sL;
                        break;
                    case "right":
                        left = c.sL + c.cW - c.width;
                        break;
                    case "acenter":
                        left = (c.cW - c.width) / 2;
                        break;
                }
            }
            else {
                left = xx;
            }
            if (typeof yy !== "number") {
                switch (yy) {
                    case "middle":
                        top = c.sT + (c.cH - c.height) / 2;
                        break;
                    case "top":
                        top = c.sT;
                        break;
                    case "bottom":
                        top = c.sT + c.cH - c.height;
                        break;
                    case "amiddle":
                        top = (c.cH - c.height) / 2;
                        break;
                }
            }
            else {
                top = yy;
            }
            return this.showElem({ e: e, left: left + (deltaX || 0), top: top + (deltaY || 0), z: z });
        }
        static showMenu(opt) {
            let e = opt.e, ref = opt.ref, xx = opt.left || "", yy = opt.top || "", deltaX = opt.deltaX || 0, deltaY = opt.deltaY || 0, z = (opt.z !== undefined) ? opt.z : undefined, left = null, top = null, c = this.getXY(ref), fixed = (e.style.position === "fixed"), width = e.offsetWidth, height = e.offsetHeight, cW = c.cW, cH = c.cH, sL = c.sL, sT = c.sT;
            switch (xx) {
                case "center":
                    left = c.left + c.width / 2 - width / 2;
                    break;
                case "left":
                    left = c.left;
                    break;
                case "front":
                    left = c.left + c.width;
                    break;
                case "back":
                    left = c.left - width;
                    break;
                case "right":
                    left = c.left + c.width - width;
                    break;
                default:
                    left = c.left + c.width - 10;
            }
            switch (yy) {
                case "middle":
                    top = c.top + c.height / 2 - height / 2;
                    break;
                case "top":
                    top = c.top;
                    break;
                case "bottom":
                    top = c.top + c.height - height;
                    break;
                case "down":
                    top = c.top + c.height;
                    break;
                case "up":
                    top = c.top - height;
                    break;
                default:
                    top = c.top + c.height - 10;
            }
            if (!fixed) {
                top = top + sT;
                left = left + sL;
            }
            left = left + deltaX;
            top = top + deltaY;
            if ((left + width) > (cW + sL)) {
                left = cW + sL - width;
            }
            if (left < sL) {
                left = sL;
            }
            if ((top + height) > (cH + sT)) {
                top = cH + sT - height;
            }
            if (top < sT && !fixed) {
                top = sT;
            }
            return this.showElem({ e: e, left: left, top: top, z: z });
        }
        static dropDown(opt) {
            let e = opt.e, ref = opt.ref, xx = opt.left || "", yy = opt.top || "", deltaX = opt.deltaX || 0, deltaY = opt.deltaY || 0, z = (opt.z !== undefined) ? opt.z : undefined, left = null, top = null, c = this.getXY(ref), width = e.offsetWidth, height = e.offsetHeight, cW = c.cW, cH = c.cH, sL = c.sL, sT = c.sT;
            switch (xx) {
                case "center":
                    left = c.left + c.width / 2;
                    break;
                case "left":
                    left = c.left;
                    break;
                case "right":
                    left = c.left + c.width;
                    break;
                case "back":
                    left = c.left - width;
                    break;
                default:
                    left = c.left + c.width - 10;
            }
            switch (yy) {
                case "middle":
                    top = c.top + c.height / 2;
                    break;
                case "top":
                    top = c.top;
                    break;
                case "bottom":
                    top = c.top + c.height;
                    break;
                case "up":
                    top = c.top - height;
                    break;
                default:
                    top = c.top + c.height - 10;
            }
            left = left + deltaX;
            top = top + deltaY;
            if ((left + width) > (cW + sL)) {
                left = cW + sL - width;
            }
            if (left < sL) {
                left = sL;
            }
            if ((top + height) > (cH + sT)) {
                //top = cH + sT - height; 
            }
            if (top < sT) {
                top = sT;
            }
            if ((c.top + c.height + height) > (cH + sT)) {
                top = c.top - height;
            }
            return this.showElem({ e: e, left: left, top: top, z: z });
        }
        static center(e) {
            e.style.position = "fixed";
            e.style.top = "50%";
            e.style.left = "50%";
            e.style.transform = "translate(-50%, -50%)";
        }
        static move(e, left, top) {
            //e.style.position = "fixed";
            e.style.left = left;
            e.style.top = top;
        }
        static float(opt) {
            let e = opt.e, left = opt.left, top = opt.top;
            let tx = null, ty = null;
            switch (left) {
                default:
                case "center":
                    e.style.left = "50%";
                    tx = "-50%";
                    break;
                case "left":
                    e.style.left = "0%";
                    tx = "0%";
                    break;
                case "right":
                    e.style.left = "100%";
                    tx = "-100%";
                    break;
            }
            switch (top) {
                default:
                case "middle":
                    e.style.top = "50%";
                    ty = "-50%";
                    break;
                case "top":
                    e.style.top = "0%";
                    ty = "0%";
                    break;
                case "bottom":
                    e.style.top = "100%";
                    ty = "-100%";
                    break;
            }
            e.style.transform = "translate(" + tx + "," + ty + ")";
        }
        static max(e) {
            e.style.position = "fixed";
            e.style.top = "0%";
            e.style.left = "0%";
            e.style.width = "100%";
            e.style.height = "100%";
            e.style.border = "3px solid green";
            //e.style.transform = "translate(-50%, -50%)";
        }
    }
    class Drag {
        static init(opt_x) {
            let opt = {
                main: null,
                onstart: () => { },
                oncapture: (clientX, clientY, iniX, iniY, offsetLeft, offsetTop) => { },
                onrelease: (clientX, clientY, iniX, iniY, offsetLeft, offsetTop) => { }
            };
            for (let x in opt_x) {
                opt[x] = opt_x[x];
            }
            let e = opt.main;
            e.onmousedown = (event) => {
                this.iniX = event.clientX;
                this.iniY = event.clientY;
                let offsetLeft = e.offsetLeft;
                let offsetTop = e.offsetTop;
                opt.onstart();
                if (this.capture) {
                    off(document, "mousemove", this.capture);
                }
                if (this.release) {
                    off(document, "mouseup", this.release);
                }
                on(document, "mousemove", this.capture = (event) => {
                    opt.oncapture(event.clientX, event.clientY, this.iniX, this.iniY, offsetLeft, offsetTop);
                });
                on(document, "mouseup", this.release = (event) => {
                    event.preventDefault();
                    off(document, "mousemove", this.capture);
                    off(document, "mouseup", this.release);
                    opt.onrelease(event.clientX, event.clientY, this.iniX, this.iniY, offsetLeft, offsetTop);
                });
            };
            e.ontouchstart = (event) => {
                //event.preventDefault();
                event = event.changedTouches[0];
                event = event || window.event;
                this.iniX = event.clientX;
                this.iniY = event.clientY;
                let offsetLeft = e.offsetLeft;
                let offsetTop = e.offsetTop;
                opt.onstart();
                if (this.capture) {
                    off(document, "touchmove", this.capture);
                }
                if (this.release) {
                    off(document, "touchend", this.release);
                }
                on(document, "touchmove", this.capture = (event) => {
                    event.preventDefault();
                    event = event.changedTouches[0];
                    event = event || window.event;
                    opt.oncapture(event.clientX, event.clientY, this.iniX, this.iniY, offsetLeft, offsetTop);
                });
                on(document, "touchend", this.release = (event) => {
                    event = event.changedTouches[0];
                    off(document, "touchmove", this.capture);
                    off(document, "touchend", this.release);
                    opt.onrelease(event.clientX, event.clientY, this.iniX, this.iniY, offsetLeft, offsetTop);
                });
            };
        }
    }
    Drag.iniX = 0;
    Drag.iniY = 0;
    Drag.capture = null;
    Drag.release = null;
    class Move {
        static init(info) {
            Drag.init({
                main: info.hand,
                onstart: this.start(info.main, info),
                oncapture: this.capture,
                onrelease: this.release
            });
        }
        static start(main, info) {
            return function () {
                this.main = main;
                this.info = info;
                this.sX = main.offsetLeft;
                this.sY = main.offsetTop;
                if (this.info.onstart) {
                    this.info.onstart({ left: this.sX, top: this.sY });
                }
            };
        }
        static restart() {
            this.sX = this.main.offsetLeft;
            this.sY = this.main.offsetTop;
        }
        static capture(left, top, iniX, iniY) {
            this.posX = this.sX + (left - iniX);
            this.posY = this.sY + (top - iniY);
            if (this.posX <= 0) {
                this.posX = 0;
            }
            if (this.posY <= 0) {
                this.posY = 0;
            }
            this.main.style.left = this.posX + "px";
            this.main.style.top = this.posY + "px";
            if (this.info.onmove && this.info.onmove(this.posX, this.posY, left, top)) {
                this.restart();
            }
        }
        static release(left, top, iniX, iniY) {
            let info = Float.getXY(this.main);
            if (info.left > info.cW - 80 || info.top > info.cH - 20) {
                left = (info.left > info.cW - 80) ? info.cW - 80 : info.left;
                top = (info.top > info.cH - 20) ? info.cH - 20 : info.top;
                Float.move(this.main, left + "px", top + "px");
            }
            if (this.info.onrelease) {
                this.info.onrelease(this.posX, this.posY, left, top, iniX, iniY);
            }
        }
    }
    Move.main = null;
    Move.info = null;
    Move.sX = null;
    Move.sY = null;
    Move.posX = null;
    Move.posY = null;
    ;
    class Resize {
        static init(opt) {
            this.setHolders(opt.main, opt);
        }
        static start(main, info, mode) {
            return function () {
                this.main = main;
                this.info = info;
                this.xA = main.offsetWidth;
                this.yA = main.offsetHeight;
                this.mode = mode;
                this.cW = document.documentElement.clientWidth;
                this.cH = document.documentElement.clientHeight;
                let _info = Float.getXY(main);
                this.sX = _info.left;
                this.sY = _info.top;
                /*mH = sY + sgFloat.getXY(_main).height;
    */
                this.maxWidth = info.maxWidth || 500;
                this.minWidth = info.minWidth || 30;
                this.maxHeight = info.maxHeight || 500;
                this.minHeight = info.minHeight || 30;
                if (this.info.onstart) {
                    this.info.onstart({ left: info.left, top: info.top, width: this.xA, height: this.yA });
                }
            };
        }
        static capture(_left, _top, iniX, iniY, offsetLeft, offsetTop) {
            if (_left < 0 || _left > this.cW) {
                return;
            }
            if (_top < 0 || _top > this.cH) {
                return;
            }
            var dx = (_left - iniX), dy = (_top - iniY), W = null, H = null, top = null, left = null, delta = null;
            switch (this.mode) {
                case "t":
                    top = this.sY + dy;
                    H = this.yA - dy;
                    break;
                case "l":
                    left = this.sX + dx;
                    W = this.xA - dx;
                    break;
                case "r":
                    W = this.xA + _left - iniX;
                    break;
                case "b":
                    H = this.yA + _top - iniY;
                    break;
                case "lt":
                    //_main.style.left = (left - offsetLeft)+"px";
                    //_main.style.top = (top - offsetTop) + "px";
                    //_main.style.left = left+"px";
                    //_main.style.top = top + "px" ;	
                    //_main.style.left = (sX + dx)+ "px";
                    //_main.style.top = (sY + dy) + "px";
                    left = this.sX + dx;
                    top = this.sY + dy;
                    W = this.xA - dx;
                    H = this.yA - dy;
                    break;
                case "rt":
                    top = this.sY + dy;
                    W = this.xA + _left - iniX;
                    H = this.yA - dy;
                    break;
                case "lb":
                    left = this.sX + dx;
                    W = this.xA - dx;
                    H = this.yA + _top - iniY;
                    break;
                case "rb":
                    W = this.xA + _left - iniX;
                    H = this.yA + _top - iniY;
                    break;
            }
            /*
                    if(W > maxWidth){
                        W = maxWidth;
                    }else if(W < minWidth){
                        W = minWidth;
                    }
            
                    if(H > maxHeight){
                        H = maxHeight;
                    }else if(W < minHeight){
                        H = minHeight;
                    }
            
                */
            /**/
            if (W !== null && W <= 0) {
                return;
            }
            if (H !== null && H <= 0) {
                return;
            }
            if (W !== null) {
                this.main.style.width = W + "px";
            }
            if (H !== null) {
                this.main.style.height = H + "px";
            }
            if (left !== null) {
                this.main.style.left = left + "px";
            }
            if (top !== null) {
                this.main.style.top = top + "px";
            }
            if (this.info.onresize) {
                this.info.onresize(this.xA + left - iniX, this.yA + top - iniY);
            }
        }
        static release(left, top, iniX, iniY) {
            var info = Float.getXY(this.main);
            if (info.left > info.cW - 80 || info.top > info.cH - 20) {
                left = (info.left > info.cW - 80) ? info.cW - 80 : info.left;
                top = (info.top > info.cH - 20) ? info.cH - 20 : info.top;
                Float.move(this.main, left + "px", top + "px");
            }
            if (this.info.onrelease) {
                this.info.onrelease(left, top, iniX, iniY);
            }
        }
        static setHolders(main, opt) {
            let rs = ["t", "r", "b", "l", "lt", "rt", "rb", "lb"];
            let left = ["0", "100%", "0", "0", "0", "100%", "100%", "0"];
            let top = ["0", "0", "100%", "0", "0", "0%", "100%", "100%"];
            let width = ["100%", "", "100%", "", "10px", "10px", "10px", "10px"];
            let height = ["", "100%", "", "100%", "10px", "10px", "10px", "10px"];
            let margin = ["-2px", "-2px", "-2px", "-2px", "-5px", "-5px", "-5px", "-5px"];
            //let margin = ["-20px","-20px","-20px","-20px","-20px","-20px","-20px","-20px"];
            let bg = ["", "", "", "", "", "", "blue", ""];
            //let bg = ["yellow","red","purple","green","brown","purple","blue","#ea1234"];
            let cursor = "s-resize,e-resize,n-resize,w-resize,nwse-resize,sw-resize,nwse-resize,ne-resize".split(",");
            let lt, k = [];
            for (let i in rs) {
                k[i] = lt = document.createElement("div");
                lt.style.cssText = "position:absolute;min-height:3px;min-width:3px;z-index:10";
                lt.className = "rs " + rs[i];
                lt.style.backgroundColor = bg[i];
                lt.style.width = width[i];
                lt.style.height = height[i];
                lt.style.left = left[i];
                lt.style.top = top[i];
                lt.style.cursor = cursor[i];
                lt.style.margin = margin[i];
                Drag.init({
                    main: k[i],
                    ref: main,
                    onstart: this.start(main, opt, rs[i]),
                    oncapture: this.capture,
                    onrelease: this.release
                });
                main.appendChild(lt);
            }
        }
        ;
    }
    Resize.main = null;
    Resize.info = {};
    Resize.mode = null;
    Resize.xA = null;
    Resize.yA = null;
    Resize.sX = null;
    Resize.sY = null;
    Resize.cW = null;
    Resize.cH = null;
    Resize.maxWidth = 800;
    Resize.minWidth = 200;
    Resize.maxHeight = 800;
    Resize.minHeight = 200;
    class Win {
        constructor() {
        }
    }
    $(window).on("load", function () {
        let div = $().create("div").addClass("drag2");
        let div2 = $().create("div").addClass("drag2");
        Float.init(div.get());
        Float.show({ e: div.get(), left: "center", top: "middle" });
        Move.init({ main: div.get(), hand: div.get() });
        Float.init(div2.get());
        Resize.init({ main: div2.get() });
        Float.show({ e: div2.get(), left: "center", top: "middle" });
        //Move.init({main:div2.get(),hand:div2.get()});
    });
    $(window).on("load_", function () {
        let div = $().create("div").addClass("drag");
        let a = div.create("div").addClass("a").text("a");
        let b = div.create("div").addClass("b").text("b");
        let c = div.create("div").addClass("c").text("c");
        let d = div.create("div").addClass("d").text("d");
        let e = div.create("div").addClass("e").text("e");
        a.on("click", (e) => {
            let rect = a.get().getBoundingClientRect();
            // db (a.get())
            //a.get().style.flex = "0 0 "+(a.get().offsetWidth-5)+"px";
            db(a.get().offsetWidth);
            let _a = (a.get().offsetWidth + 5) + "px";
            let _b = (b.get().offsetWidth - 5) + "px";
            div.get().style.gridTemplateColumns = `${_a} ${_b} auto`;
        });
        b.on("click", (e) => {
            let rect = a.get().getBoundingClientRect();
            let _a = (a.get().offsetWidth - 5) + "px";
            let _b = (b.get().offsetWidth + 5) + "px";
            div.get().style.gridTemplateColumns = `${_a} ${_b} auto`;
        });
        d.on("click", (e) => {
            let rect = a.get().getBoundingClientRect();
            let _a = (a.get().offsetHeight + 1) + "px";
            let _b = (d.get().offsetHeight - 1) + "px";
            div.get().style.gridTemplateRows = `${_a} auto`;
        });
        e.on("click", (e) => {
            let xx = document.defaultView.getComputedStyle(div.get());
            db(xx.gridTemplateRows);
            let rect = a.get().getBoundingClientRect();
            let _a = (a.get().offsetHeight - 1) + "px";
            let _b = (d.get().offsetHeight + 1) + "px";
            div.get().style.gridTemplateRows = `${_a} auto`;
        });
        db(document.defaultView.getComputedStyle(div.get()).gridTemplateColumns);
    });
    return { Window: Win, Float: Float, Resize: Resize, Move: Move };
})(_sgQuery);
//alert(Win.Float.token)
