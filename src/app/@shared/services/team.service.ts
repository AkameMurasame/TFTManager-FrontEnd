import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { Team } from "../models/team/team";

@Injectable({ providedIn: "root" })
export class TeamService {
    constructor(private http: ApiHttpClient) { }

    teamRegister(team: Team): Observable<Team> {
        return this.http.post<Team>(`team/create`, team);
    }

    getTeamsByPlayerId(): Observable<Team[]>  {
        return this.http
            .get<Team[]>(`team/getTeamsByUser`);
    }
}