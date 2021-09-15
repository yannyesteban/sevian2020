import { _sgQuery as $ } from '../../Sevian/ts/Query.js';

export class Socket {

    url: string = '127.0.0.1';
    port: string = '3310';
    socket: WebSocket = null;
    user: string = "juan";
    key: string = "";
    error: any = null;
    name: string = "";
    onopen: Function = function(event) {
        let openMessage = JSON.stringify({
            type: "connect",
            name: this.name,
            user: this.user,
            config: []


        });

        this.send(openMessage);
        db("Websockect Connected...!");
    };

    onclose: Function = function(event) {
        db("Connection lost...!!!");
        // Try to reconnect in 5 seconds
        setTimeout(() => {
            //db ("Connection lost...!!!");
            this.connect();
        }, 5000);
    }
    onmessage: Function = (event) => {


        var server_message = event.data;
        db(server_message);




        try {
            let json = JSON.parse(server_message);
            console.log(json);
            //alert(json.message)
            db(json.message);
        } catch (e) {
            //alert(e)
        }
    };

    constructor(info: object) {

        for (var x in info) {

            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        this.socket = new WebSocket('ws://' + this.url + ':' + this.port);


        this.socket.onopen = $.bind(this.onopen, this);
        this.socket.onmessage = $.bind(this.onmessage, this);//this.onmessage;
        this.socket.onclose = $.bind(this.onclose, this);//this.onclose ;
        /*
        this.socket.onclose = () => {
            // Try to reconnect in 5 seconds
            setTimeout(() => {
                this.connect();
            }, 5000);
        };
        */
    }

    connect() {


        try {

            if (this.socket && this.socket.readyState == 1) {
                db("is still connected...");
                return;
            }
            this.socket = new WebSocket('ws://' + this.url + ':' + this.port);


            this.socket.onopen = $.bind(this.onopen, this);
            this.socket.onmessage = $.bind(this.onmessage, this);//this.onmessage;
            this.socket.onclose = $.bind(this.onclose, this);//this.onclose ;

            /*this.socket.onclose = () => {
                // Try to reconnect in 5 seconds
                setTimeout(() => {
                    this.connect();
                }, 5000);
            };*/

            //this.socket = new WebSocket('ws://' + this.url + ':' + this.port);


        } catch (e) {
            this.error = e;
        }

    }



    send(msg) {
        //console.log( this.socket);

        if (this.socket && this.socket.readyState == 1) {
            this.socket.send(msg);
            return;
        }

        alert("Connecting, wait !!!");

    }



    onmessage1(event) {
        alert(1.001)
        var server_message = event.data;
        db(server_message);




        try {
            let json = JSON.parse(server_message);
            console.log(json);
            //alert(json.message)
            db(json.message);
        } catch (e) {
            //alert(e)
        }

    }

}