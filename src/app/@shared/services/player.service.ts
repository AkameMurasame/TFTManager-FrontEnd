import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { UpdatePlayerLobby } from "../models/lcu/update-player";
import { Player } from "../models/player/Player";
import { RequestPartidas } from "../models/player/RequestPartidas";
import { Group } from "../models/tournament/group";
import { Tournament } from "../models/tournament/tournament";

@Injectable({ providedIn: "root" })
export class PlayerService {

  private player: BehaviorSubject<Player>;
  public observablePlayer: Observable<Player>;

  constructor(private http: ApiHttpClient) {
    this.player = new BehaviorSubject<Player>(
      JSON.parse(localStorage.getItem("currentPlayer")!)
    );
    this.observablePlayer = this.player.asObservable();
  }

  public get getPlayer(): Player {
    return this.player.value;
  }
  //
  getActiveMatchByPlayer(): Observable<Group> {
    return this.http.get<Group>(`tournament/getActiveMatchByPlayer/${this.player.value.id}`);
  }

  getTournamentsByPlayer(): Observable<Tournament[]> {
    return this.http.get<Tournament[]>(`tournament/getByPlayerId/${this.player.value.id}`);
  }

  getMatchesByPlayer(): Observable<any[]> {
    return this.http.get<any[]>(`tournament/getMatchesByPlayer/${this.player.value.id}`);
  }

  getNextTournamentByTeam(): Observable<Tournament> {
    return this.http.get<Tournament>(`tournament/getNextTournamentByTeam/${this.player.value.id}`);
  }

  getPlayerByUserId(id: number): Observable<Player> {
    return this.http.get<Player>(`player/getById/${id}`).pipe(
      map((player: Player) => {
        localStorage.setItem("currentPlayer", JSON.stringify(player));
        this.player.next(player);
        return player;
      })
    );
  }

  registerPlayer(player: Player): Observable<any> {
    return this.http.post<any>(`player/create`, player).pipe(
      map((player: Player) => {
        localStorage.setItem("currentPlayer", JSON.stringify(player));
        this.player.next(player);
        return player;
      })
    );
  }

  getPartidasTft(request: RequestPartidas): Observable<any> {
    return this.http.post(`player/getPartidasTft`, request);
  }

  getHistory(request: String[], puuid: String): Observable<any> {
    return this.http.post(`player/getHistory`, {
      idsPartida: request,
      puuid: puuid
    });
  }

  getPlayersLike(nickName: string): Observable<Player[]> {
    return this.http.get<Player[]>(`player/getPLayersByNick/${nickName}`);
  }

  updatePlayerLobby(player: UpdatePlayerLobby): Observable<Player> {
    return this.http.put<Player>(`player/updateSchedulePlayer`, player);
  }

  updatePlayer(player: Player) {
    return this.http.put<Player>(`player/update`, player);
  }
}
