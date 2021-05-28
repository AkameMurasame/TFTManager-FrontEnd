import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { Tournament } from "../models/tournament/tournament";

@Injectable({ providedIn: "root" })
export class TournamentService {
    constructor(private http: ApiHttpClient) { }

    tournamentRegister(tournament: Tournament): Observable<Tournament> {
        return this.http.post<Tournament>(`tournament/create`, tournament);
    }

    getTournamentById(id: number): Observable<Tournament> {
        return this.http.get<Tournament>(`tournament/getById/${id}`);
    }

    getAllTournamentsJogaveis(): Observable<Tournament[]> {
        return this.http.get<Tournament[]>(``);
    }

    getTournamentsByOrganization(idOrganization: number): Observable<Tournament[]> {
        return this.http.get<Tournament[]>(``);
    }
}
