import { Organization } from "../organization/organization";
import { Game } from "./game";

export interface Tournament {
    id?: number;
    name: string;
    date: string;
    time: string;
    organization: Organization;
    // tournamentPlayers;
    //championship;
    game: Game;
    qtdJogadores: number;
    qtdJogPorTime: number;
}