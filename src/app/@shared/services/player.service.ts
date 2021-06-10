import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiHttpClient } from "src/app/@core/services/api-http-client";
import { Player } from "../models/player/Player";
import { RequestPartidas } from "../models/player/RequestPartidas";

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

  getPlayerByUserId(id: number): Observable<Player> {
    return this.http.get<Player>(`player/getById/${id}`).pipe(
      map((player) => {
        localStorage.setItem("currentPlayer", JSON.stringify(player));
        this.player.next(player);
        return player;
      })
    );
  }

  registerPlayer(player: Player): Observable<any> {
    return this.http.post<any>(`player/create`, player).pipe(
      map((player) => {
        localStorage.setItem("currentPlayer", JSON.stringify(player));
        this.player.next(player);
        return player;
      })
    );
  }

  getPartidasTft(request: RequestPartidas): Observable<any> {
    return this.http.post(`player/getPartidasTft`, request);
  }

  getPlayersLike(nickName: string) : Observable<Player[]> {
    return this.http.get<Player[]>(`player/getPLayersByNick/${nickName}`);
  }
}
