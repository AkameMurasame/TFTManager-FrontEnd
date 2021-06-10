import { Organization } from "../organization/organization";
import { Game } from "./game";

export interface Tournament {
    id?: number;
    name: string;
    date: string;
    time: string;
    organization: number;
    // tournamentPlayers;
    //championship;
    game: number;
}