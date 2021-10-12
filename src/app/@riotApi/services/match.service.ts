import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RiotApiCore } from "src/app/@riotApi/index";
import { MatchDTO } from "src/app/@riotApi/index";

@Injectable({ providedIn: "root" })
export class MatchService {

    private codigos: BehaviorSubject<string[]>;
    public observableCodigos: Observable<String[]>;
    private qtdePesquisa = 0;
    private pesquisado = 0;
    private historico: BehaviorSubject<MatchDTO[]>;
    public observableHistory: Observable<MatchDTO[]>;


    constructor(private riotApiCore: RiotApiCore) {
        this.historico = new BehaviorSubject<MatchDTO[]>(
            JSON.parse(localStorage.getItem("history")!)
        );
        this.observableHistory = this.historico.asObservable();

        this.codigos = new BehaviorSubject<string[]>(
            JSON.parse(localStorage.getItem("codigos")!)
        );
        this.observableCodigos = this.codigos.asObservable();
    }

    public get historicoPartidas(): MatchDTO[] {
        return this.historico.value;
    }

    public get codigosPartidas(): string[] {
        return this.codigos.value;
    }

    getCodigoPartidasTft(puuid: string, quantidade: number): Observable<string[]> {
        return this.riotApiCore.get<string[]>(`/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${quantidade}`, "americas").pipe(
            map((partidas) => {
                if (!this.codigos.value) {
                    localStorage.setItem('codigos', JSON.stringify(partidas));
                    this.qtdePesquisa = partidas.length;
                    return partidas;
                } else {
                    partidas.forEach(e => {
                        if (!this.codigosPartidas.includes(e)) {
                            this.qtdePesquisa++;
                        }
                    });
                    return partidas;
                }
            })
        );
    }

    getPartidasTft(matchId: String): Observable<MatchDTO> {    
        console.log(this.qtdePesquisa, this.pesquisado)
        if (this.qtdePesquisa != 0 && this.pesquisado != this.qtdePesquisa) {
            return this.riotApiCore.get<MatchDTO>(`/tft/match/v1/matches/${matchId}`, "americas").pipe(
                map((partida) => {
                    let historico = this.historico.value;
                    if (!historico) {
                        historico = [];
                    }
                    historico.unshift(partida);
                    localStorage.setItem('history', JSON.stringify(historico));
                    this.pesquisado++;
                    return partida;
                })
            );
        } else {
            return null;
        }
    }
}