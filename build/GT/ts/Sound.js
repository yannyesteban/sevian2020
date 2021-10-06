export class Sound {
    constructor(info) {
        this.sound = null;
        this.soundIndex = 0;
        this.src = [
            "http://web.bestsecurity.com:8008/gtcomm/sounds/mixkit-classic-alarm-995.wav",
            "http://web.bestsecurity.com:8008/gtcomm//sounds/mixkit-security-facility-breach-alarm-994.wav"
        ];
        this.status = 0;
        for (var x in info) {
            if (this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }
        this.sound = document.createElement("audio");
        this.sound.src = this.src[this.soundIndex];
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.setAttribute("loop", "true");
        this.sound.style.display = "none"; // <-- oculto
        document.body.appendChild(this.sound);
    }
    play(id) {
        if (this.status == 1 && (id === undefined || this.soundIndex === id)) {
            return;
        }
        if (id !== undefined) {
            this.soundIndex = id;
            this.sound.setAttribute("src", this.src[this.soundIndex]);
        }
        this.sound.play();
        this.status = 1;
    }
    getStatus() {
        return this.status;
    }
    pause() {
        this.sound.pause();
        this.status = 0;
    }
}
//# sourceMappingURL=Sound.js.map