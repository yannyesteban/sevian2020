import { InfoForm } from "./../Sevian/ts/InfoForm.js";
export interface IMark {
    id: number;
    latitude: number;
    longitude: number;
    popupInfo?: string | HTMLAnchorElement;
    map?: any;
    info?: any;
    activeFollow?: boolean;
    infoForm?: InfoForm;
    flyToZoom?: number;
    flyToSpeed?: number;
    panDuration?: number;
    
}