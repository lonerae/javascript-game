import { Shout } from "../attacks/obsessions/shout.js";

export default class Psyche {
    constructor() {
        // this.width = 320;
        // this.height = 360;
        // this.isOpen = false;
        this.obsessions = [new Shout()];
        this.activeObsessions = [this.obsessions[0]];
    }
}