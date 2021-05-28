import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { PlayerModule } from "src/app/main/player/player.module";
import { Player } from "../models/player/Player";

@Injectable({ providedIn: "root" })
export class LcuService {

    lcuUrl: String = "";
    lcuPlayer: Player = new Player();

    constructor(private http: HttpClient) {

    }

    getClientLcu(): String {
        let lcu = localStorage.getItem('Api');
        if (lcu) {
            this.lcuUrl = lcu;
            return this.lcuUrl;
        }
        return "";
    }

    getLcuPlayer(): Observable<Player> {
        return this.http.get<Player>(`${this.lcuUrl}/lol-summoner/v1/current-summoner`).pipe(
            map((player) => {
                this.lcuPlayer = player;
                return this.lcuPlayer;
            })
        );
    }
}
