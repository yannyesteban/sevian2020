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
