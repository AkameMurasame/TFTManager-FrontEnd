import { Organization } from "../organization/organization";
import { Game } from "./game";

export class Tournament {
    id!: number;
    name!: string;
    date!: string;
    time!: string;
    organization!: Organization;
    // tournamentPlayers;
    //championship;
    game!: Game;
}