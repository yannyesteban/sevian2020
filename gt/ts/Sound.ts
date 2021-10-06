
export class Sound {

    private sound: HTMLAudioElement = null;
    private soundIndex = 0;
    private src = [
        "../../sounds/mixkit-classic-alarm-995.wav",
        "../../sounds/mixkit-security-facility-breach-alarm-994.wav"
    ];

    private status: number = 0;

    constructor(info: any) {

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
    public play(id?) {

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

    public getStatus() {
        return this.status;
    }

    public pause() {
        this.sound.pause();
        this.status = 0;
    }



}