var Grid = (($) => {
    class Grid {
        getValue(params) {
        }
        valid() {
        }
    }
    $(window).on("load", function () {
        let info = {
            target: "",
            id: "",
            caption: "",
            className: "",
            type: "",
            fields: [{}],
            data: [{}]
        };
        let g = new Grid(info);
    });
    return Grid;
})(_sgQuery);
