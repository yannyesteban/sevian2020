import { _sgQuery as $ } from "../Sevian/ts/Query.js";
export class Sound
{

    public test(fuente){
        const sonido = document.createElement("audio");
    sonido.src = fuente;
    sonido.setAttribute("preload", "auto");
    sonido.setAttribute("controls", "none");
    sonido.setAttribute("loop", "true");
    sonido.setAttribute("autoplay", "autoplay");
    //sonido.style.display = "none"; // <-- oculto
    document.body.appendChild(sonido);
    return sonido;
    }

}