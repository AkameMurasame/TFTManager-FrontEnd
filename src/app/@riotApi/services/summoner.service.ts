import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RiotApiCore } from "src/app/@riotApi/index";
import { SummonerDTO } from "src/app/@riotApi/index";

@Injectable({ providedIn: "root" })
export class SummonerService {

    constructor(private riotApiCore: RiotApiCore) { }

    getTftSummoner(nickname: string): Observable<SummonerDTO> {
        return this.riotApiCore.get<SummonerDTO>(`/tft/summoner/v1/summoners/by-name/${nickname}`, "br1");
    }
}