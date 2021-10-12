import { Match } from "../player/Match";
import { Team } from "../team/team";
import { Tournament } from "./tournament";

export interface MatchResponse {

    tournament: Tournament;

    groupTeams: Team[];

    playerMatch: Match;

    imgId: string;
}
