import { Sword } from "../attacks/weapons/sword.js";

export default class Equipment {
    constructor() {
        this.width = 320;
        this.height = 360;
        this.isOpen = false;
        this.weapon = new Sword("Rapier");
    }
}