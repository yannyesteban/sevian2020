var GT = { c: {} };
GT.c = function (name, param_name, id) {
    S.send({
        async: true,
        panel: 4,
        params: [{
                t: 'addReq',
                param: {
                    [param_name]: id
                }
            }, {
                t: 'setMethod',
                id: 5,
                element: 'fcatalogue',
                method: 'load',
                name: name,
                eparams: {
                    cmd: '',
                    cmdId: '',
                    unitId: 0,
                    deviceId: 1000,
                }
            }],
        window: { name: 5, panel: 5,
            caption: 'ventana',
            mode: 'custom',
            width: '800px', height: '600px',
            left: 'center',
            top: 'middle', show: true
        }
    });
};
