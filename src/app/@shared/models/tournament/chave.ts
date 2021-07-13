import { GroupPlayer } from "./group-player";
import { Stage } from "./stage";

export interface Chave {
    stage: Stage;
    groups: GroupPlayer[];
}