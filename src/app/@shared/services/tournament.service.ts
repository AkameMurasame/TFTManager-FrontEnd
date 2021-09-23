import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { Tournament } from "../models/tournament/tournament";
import { HttpClient } from '@angular/common/http';
import { Team } from "../models/team/team";
import { Group } from "../models/tournament/group";
import { MatchResponse } from "../models/tournament/matchResponse";


@Injectable({ providedIn: "root" })
export class TournamentService {
    constructor(private http: ApiHttpClient, private http2: HttpClient) { }
    
    tournamentRegister(tournament: Tournament): Observable<Tournament> {
        return this.http.post<Tournament>(`tournament/create`, tournament);
    }

    geMatch(groupId: number): Observable<MatchResponse> {
        return this.http.get<MatchResponse>(`tournament/getTeamsByMatch/${groupId}`);
    }

    getTournamentById(id: number): Observable<Tournament> {
        return this.http.get<Tournament>(`tournament/getById/${id}`);
    }

    getAllTournamentsJogaveis(): Observable<Tournament[]> {
        return this.http.get<Tournament[]>(`tournament/getAllActiveTournaments`);
    }

    getTournamentsByOrganization(idOrganization: number): Observable<Tournament[]> {
        return this.http.get<Tournament[]>(``);
    }

    getBattlefyTournament(idTournament: string): Observable<any> {
        return this.http2.get(`https://dtmwra1jsgyb0.cloudfront.net/tournaments/${idTournament}`);
    }

    entryTournament(idTournament: number, idPlayer: number): Observable<any> {
        return this.http.put<any>(`tournament/entryTournament`, {
            tournamentId: idTournament,
            playerId: idPlayer
        });
    }

    eliminatePlayerFromTournament(idGroup: number, summonerId: number): Observable<any> {
        return this.http.post<any>(`tournament/eliminatePlayer`, {
            groupId: idGroup,
            summonerId: summonerId
        });
    }

    auditarTournament(groupId: number, teamList: Team[]) {
        return this.http.post<void>(`tournament/auditarTournament`, {
            groupId: groupId,
            teamList: teamList
        });
    }
}
