import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RiotApiCore } from "src/app/@riotApi/index";
import { MatchDTO } from "src/app/@riotApi/index";

@Injectable({ providedIn: "root" })
export class MatchService {

    private codigos: string[] = [];

    private historico: BehaviorSubject<MatchDTO[]>;
    public observableHistory: Observable<MatchDTO[]>;

    constructor(private riotApiCore: RiotApiCore) {
        this.historico = new BehaviorSubject<MatchDTO[]>(
            JSON.parse(localStorage.getItem("history")!)
        );
        this.observableHistory = this.historico.asObservable();
    }

    public get historicoPartidas(): MatchDTO[] {
        return this.historico.value;
    }

    public get codigosPartidas(): string[] {
        return this.codigos;
    }

    getCodigoPartidasTft(puuid: string, quantidade: number): Observable<string[]> {
        return this.riotApiCore.get<string[]>(`/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${quantidade}`, "americas").pipe(
            map((partidas) => {
                if (!this.codigos) {
                    this.codigos = partidas
                } else if (this.codigos[0] != partidas[0]) {
                    this.codigos = partidas;
                }
                return this.codigos;
            })
        );
    }

    getPartidaTft(matchId: string): Observable<MatchDTO> {
        return this.riotApiCore.get<MatchDTO>(`/tft/match/v1/matches/${matchId}`, "americas").pipe(
            map((partida) => {
                let historico = this.historico.value;
                if (!historico) {
                    historico = [];
                }
                historico.push(partida);
                localStorage.setItem('history', JSON.stringify(historico));
                return partida;
            })
        );
    }
}