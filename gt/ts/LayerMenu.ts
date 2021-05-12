import {_sgQuery as $}  from '../../Sevian/ts/Query.js';
import { Menu as Menu } from "../../Sevian/ts/Menu2.js";
import {Map, MapLib, MapControl}  from './Map.js';

export class LayerMenu {
    private groups: any[] = [];
    private layers: any[] = [];
    private menu: Menu = null;
    private target: any = null;
    private map: MapLib = null;

    public onShowLayer: Function = (index, value) => { };

    constructor(info) {

        for(var x in info){
            if(this.hasOwnProperty(x)) {
                this[x] = info[x];
            }
        }

        let items = [];

        let _menu: any = null;

        let layers = [{

            caption: "Camino",
            type: "x",
            color: "red",
            visible: true,
            group: 0,
            image: null

        }].concat(this.layers);

        layers.forEach((layer, index) => {

            if (layer.group >= 0) {
                if (!items[layer.group]) {
                    items[layer.group] = {
                        ds: { group: layer.group },
                        caption: this.groups[layer.group].caption,
                        useCheck: true,
                        items: [],
                    };
                }

                _menu = items[layer.group];
            } else {
                if (!items[0]) {
                    items[0].items = items[layer.group] = {
                        caption: this.groups[layer.group].caption,
                        useCheck: true,
                        items: [],
                    };
                }
                _menu = items[0];
            }
            let icon = null;

            if (layer.image) {
                icon = $(this.map.getLayerImage(layer.image).getCanvas());
                icon.addClass(["layer-icon", layer.image]);
            }

            _menu.items.push({
                caption: layer.caption,
                customIcon: icon,
                //className:layer.className,
                useCheck: true,
                className: [layer.type, layer.color],
                //imageClass:[layer.type, layer.color],
                value: "" + index,
                checked: layer.visible,
                check: (x, event) => {
                    this.onShowLayer(index, event.currentTarget.checked);
                    /*
                    this.onCheckLayer(
                        parseInt(x.ds("value"), 10),
                        event.currentTarget.checked
                    );
                    this.getTrace().showLayer(layer.id, event.currentTarget.checked);
                    */
                },
            });
        });

        this.menu = new Menu({
            autoClose: false,
            target: this.target, //this._group,
            items: items,
            type: "accordion",
            useCheck: true,
            subType: "",
        });
    }

    getMenu() {
        return this.menu;
    }
}


