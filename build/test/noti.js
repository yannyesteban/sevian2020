export class Noti {
    constructor() {
        this.data = null;
        this.tem = {};
        Notification.requestPermission((e) => {
            console.log(e);
        });
        Notification.requestPermission().then(function (result) {
            console.log(result);
        });
        if (Notification.permission === "granted") {
            // Si esta correcto lanzamos la notificación
            var notification = new Notification("Holiwis :D");
        }
    }
}
//# sourceMappingURL=noti.js.map