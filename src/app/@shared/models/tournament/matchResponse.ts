import { Match } from "../player/Match";
import { ITeam } from "../team/iteam";
import { Team } from "../team/team";
import { Tournament } from "./tournament";

export interface MatchResponse {

    tournament: Tournament;

    groupTeams: ITeam[];

    imgId: string;
}
