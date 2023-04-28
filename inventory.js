import { Sword } from "./weapons.js";

export default class Inventory {
    constructor() {
        this.width = 320;
        this.height = 360;
        this.isOpen = false;
        this.weapon = new Sword("Rapier");
    }
}