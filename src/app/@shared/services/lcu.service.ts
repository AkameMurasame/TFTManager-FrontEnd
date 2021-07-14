import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CreateLobby } from "../models/lcu/create-lobby";
import { InvitationLobby } from "../models/lcu/invitation-lobby";
import { Player } from "../models/player/Player";

@Injectable({ providedIn: "root" })
export class LcuService {

    lcuUrl: String = "";
    lcuPlayer: Player = new Player();

    constructor(private http: HttpClient) {

    }

    public get getlcuPlayer(): Player {
        return this.lcuPlayer;
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

    createLobby(lobby: CreateLobby) {
        return this.http.post<CreateLobby>(`${this.lcuUrl}/lol-lobby/v2/lobby`, lobby);
    }

    invitePlayers(invite: InvitationLobby[]) {
        return this.http.post<InvitationLobby[]>(`${this.lcuUrl}/lol-lobby/v2/lobby/invitations`, invite);
    }

    findPlayer(nickname: string): Observable<Player> {
        return this.http.get<Player>(`${this.lcuUrl}/lol-summoner/v1/summoners/?name=${nickname}`);
    }
}
