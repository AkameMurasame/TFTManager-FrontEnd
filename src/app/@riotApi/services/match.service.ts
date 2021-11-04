import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RiotApiCore } from "src/app/@riotApi/index";
import { MatchDTO } from "src/app/@riotApi/index";
import { Match } from "src/app/@shared/models/player/Match";

@Injectable({ providedIn: "root" })
export class MatchService {

    private codigos: BehaviorSubject<string[]>;
    public observableCodigos: Observable<String[]>;
    private qtdePesquisa = 0;
    private pesquisado = 0;
    private historico: BehaviorSubject<MatchDTO[]>;
    public observableHistory: Observable<MatchDTO[]>;


    constructor(private riotApiCore: RiotApiCore) {

        localStorage.removeItem('codigos');
        localStorage.removeItem('history');

        this.historico = new BehaviorSubject<MatchDTO[]>(
            JSON.parse(localStorage.getItem("history")!)
        );
        this.observableHistory = this.historico.asObservable();

        this.codigos = new BehaviorSubject<string[]>(
            JSON.parse(localStorage.getItem("codigos")!)
        );
        this.observableCodigos = this.codigos.asObservable();

        console.log(this.codigos.value)
        console.log(this.historico.value)
    }

    public get historicoPartidas(): MatchDTO[] {
        return this.historico.value;
    }

    public get codigosPartidas(): string[] {
        return this.codigos.value;
    }

    public get qtdPesquisa(): number {
        return this.qtdePesquisa;
    }

    getCodigoPartidasTft(puuid: string, quantidade: number): Observable<string[]> {
        return this.riotApiCore.get<string[]>(`/tft/match/v1/matches/by-puuid/${puuid}/ids?count=${quantidade}`, "americas").pipe(
            map((partidas) => {
                this.qtdePesquisa = 0;
                if (!this.codigos.value) {
                    localStorage.setItem('codigos', JSON.stringify(partidas));
                    this.codigos.next(partidas);
                    this.qtdePesquisa = partidas.length;
                    return partidas;
                } else {

                    partidas.forEach(e => {
                        if (!this.codigosPartidas.includes(e)) {
                            this.qtdePesquisa++;
                        }
                    });
                    localStorage.setItem('codigos', JSON.stringify(partidas));
                    this.codigos.next(partidas);
                    return partidas;
                }
            })
        );
    }

    setNewMatch(list: MatchDTO[]): MatchDTO[] {
        if (!this.historico.value) {
            localStorage.setItem('history', JSON.stringify(list));
            this.historico.next(list);
            return this.historico.value;
        } else {
            list.forEach(e => {
                let historico = this.historico.value;
                console.log(historico)
                if (historico.length == 0) {
                    historico.push(e);
                } else {
                    historico.unshift(e);
                }
                localStorage.setItem('history', JSON.stringify(historico));
                this.historico.next(historico);
            })

            return this.historico.value;
        }
    }
}