import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { Stage } from "../models/tournament/stage";
import { Tournament } from "../models/tournament/tournament";
import { map } from "rxjs/operators";
import { Group } from "../models/tournament/group";
import { Chave } from "../models/tournament/chave";

@Injectable({ providedIn: "root" })
export class ActiveTournamentService {

    private activeTournament: Tournament;
    private stages: Stage[];
    private groups: Chave[];

    constructor(private http: ApiHttpClient) {
        this.groups = new Array<Chave>();
    }

    public get getTournament() : Tournament {
        return this.activeTournament;
    }

    public get getGroups(): Array<Chave> {
        return this.groups;
    }

    public set setGroups(chave: Chave) {
        this.groups.push(chave);
    }

    getTournamentById(id: number): Observable<Tournament> {
        return this.http.get<Tournament>(`tournament/getById/${id}`)
            .pipe(
                map((tournament: Tournament) => {
                    this.activeTournament = tournament;
                    return tournament;
                })
            );
    }

    getTournamentStages(): Observable<Stage[]> {
        return this.http.get<Stage[]>(`tournament/getStages/${this.activeTournament.id}`)
            .pipe(
                map((stages: Stage[]) => {
                    this.stages = stages;
                    return stages;
                })
            );
    }

    gerarProximaFase() {
        return this.http.post<any>(`tournament/generateNextGroups`, {
            tournamentId: this.activeTournament.id
        });
    }
}
