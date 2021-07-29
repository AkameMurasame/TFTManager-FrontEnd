import { Organization } from "../organization/organization";
import { Game } from "./game";

export interface Tournament {
    id?: number;
    name?: string;
    date?: Date;
    organization: Organization;
    // tournamentPlayers;
    //championship;
    game?: Game;
    qtdJogadores?: number;
    qtdJogPorTime?: number;
    battlefyLink?: string;
    battlefyId?: string;
    tournamentStatus?: string;
}