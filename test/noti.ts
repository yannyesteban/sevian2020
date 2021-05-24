
import { _sgQuery as $ } from "../Sevian/ts/Query.js";

export class Noti
{
    private data = null;
    private tem = {};

    constructor() {
        Notification.requestPermission((e) => {
            console.log(e)
        });
        Notification.requestPermission().then(function(result) {
            console.log(result);
          });


          if (Notification.permission === "granted") {
            // Si esta correcto lanzamos la notificación
            var notification = new Notification("Holiwis :D");
          }
    }

}

