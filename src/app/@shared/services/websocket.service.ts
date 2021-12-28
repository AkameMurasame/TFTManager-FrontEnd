import { Injectable } from "@angular/core";
import * as SockJS from 'sockjs-client';
import { LcuService } from "./lcu.service";
import { CreateLobby } from "../models/lcu/create-lobby";
import { InvitationLobby } from "../models/lcu/invitation-lobby";
import { Player } from "../models/player/Player";
import { PlayerService } from "./player.service";
import { UpdatePlayerLobby } from "../models/lcu/update-player";
import { PlayerConnect } from "../models/socket/player-connect";
import { ToastService } from "./toast.service";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { EventList } from "../models/lcu/EventList";
import { EventLcu } from "../models/lcu/EventLcu";
import { TournamentService } from "./tournament.service";
import { Team } from "../models/team/team";
import { environment } from "src/environments/environment";
import { GroupStatus } from "../enum/groupStatus.enum";
import { MatchService } from "./match.service";
import { RxStompService } from "@stomp/ng2-stompjs";

@Injectable({ providedIn: "root" })
export class WebsocketService {

    //Socket
    player: PlayerConnect;
    intervalPartida: any;

    //vem do back
    activeGroup: number;
    teansGroup: Team[];

    //E Setado
    isPartida: boolean = false;
    eventsPartida: EventLcu[];
    lastCountEvent: number = 2;
    killNames: EventLcu[] = new Array<EventLcu>();
    isLobby: boolean = false;

    constructor(private http: HttpClient,
        private lcuService: LcuService,
        private playerService: PlayerService,
        private toastService: ToastService,
        private tournamentService: TournamentService,
        private matchService: MatchService,
        private rxStompService: RxStompService) { }

    public get getKillNames() {
        return this.killNames;
    }

    public get getisPartida() {
        return this.isPartida;
    }

    DataPartida() {
        return this.http.get<EventList>("https://127.0.0.1:2999/liveclientdata/eventdata").pipe(map((data) => {
            if (data != null) {
                if (this.eventsPartida == null) {
                    this.isPartida = true;
                    if (this.isLobby == true) {
                        this.changeMatchStatus(GroupStatus.PARTIDA_INICIADA);
                    }
                    this.eventsPartida = data.Events;
                    this.lastCountEvent = data.Events.length;
                } else {
                    if (data.Events.length > this.lastCountEvent) {
                        this.eventsPartida = data.Events;
                        for (var x = this.lastCountEvent; x < data.Events.length; x++) {
                            var event = data.Events[x];
                            if (event.EventName == "ChampionKill") {
                                this.killNames.push(event);
                            }
                            this.lastCountEvent = data.Events.length;
                        }
                    }
                }
            }
        }));
    }

    changeMatchStatus(groupStatus: GroupStatus) {
        this.matchService.changeMatchStatus(this.activeGroup, groupStatus).subscribe();
    }

    initIntervalPartida() {
        console.log(this.activeGroup)
        console.log(this.teansGroup)
        this.killNames = new Array<EventLcu>();
        this.eventsPartida = null;
        this.lastCountEvent = 2;
        this.intervalPartida = setInterval(func => this.DataPartida().subscribe(), 5 * 1000);
    }

    finishInterval() {
        this.isPartida = false;
        var posicao = this.killNames.length;
        if (posicao == 7) {
            if (this.killNames[6].KillerName != this.playerService.getPlayer.displayName) {
                setTimeout(func =>
                    this.matchService.matchResult(this.activeGroup).subscribe()
                    , 7000);
            } else {
                setTimeout(fun =>
                    this.matchService.matchResult(this.activeGroup).subscribe()
                    , 14000);
            }
        }

        clearInterval(this.intervalPartida);
    }

    initPartida(object) {
        const teans = object.players;
        this.activeGroup = object.groupId;
        this.teansGroup = teans;
        this.initIntervalPartida();
    }

    createLobby(object) {
        this.isLobby = true;
        const teans = object.players;
        this.activeGroup = object.groupId;
        this.teansGroup = teans;

        const lobby: CreateLobby = {
            //queueId: 1090
            queueId: 1130
        };

        var invitationArray = Array<InvitationLobby>();

        this.lcuService.createLobby(lobby).subscribe(lobby => {
            for (var x = 0; x < teans.length; x++) {
                let playerAtual = teans[x];
                if (teans[x].capitao.summonerId === null) {
                    this.lcuService.findPlayer(teans[x].name).subscribe(player => {
                        if (player != null) {
                            player.id = playerAtual.capitao.id;
                            player.puuid = null;

                            const invitation: InvitationLobby = {
                                toSummonerId: player.summonerId,
                                toSummonerName: player.displayName
                            };

                            invitationArray.push(invitation);

                            this.lcuService.invitePlayers(invitationArray).subscribe(invite => {
                                invitationArray = [];
                            });
                        }
                    });
                } else {
                    const invitation: InvitationLobby = {
                        toSummonerId: teans[x].capitao.summonerId,
                        toSummonerName: teans[x].capitao.displayName
                    };

                    invitationArray.push(invitation);

                    this.lcuService.invitePlayers(invitationArray).subscribe(invite => {
                        invitationArray = [];
                    });
                }
            }
        });
        this.initIntervalPartida();
    }

    initWebSocket(player: PlayerConnect) {

        this.player = player;

        this.rxStompService.publish({ destination: '/app/register', body: JSON.stringify(player) });

        this.rxStompService
            .watch('/user/' + player.summonerId)
            .subscribe((message: any) => {
                const json = JSON.parse(message.body);
                console.log(json)
                switch (json.message) {
                    case "CREATE_LOBBY":
                        this.createLobby(json);
                        break;
                    case "INIT_PARTIDA":
                        this.initPartida(json);
                        break;
                }
            });

        if (this.player.organizationId != null) {
            this.rxStompService
                .watch(`/topic/organization/${this.player.organizationId}`)
                .subscribe((message: any) => {
                    var data = JSON.parse(message.body);
                    console.log(data);
                    switch (data.organizationMessage) {
                        case "CHAVE_CRIADA":
                            this.toastService.success("Chave do torneio criada!")
                            break;
                    }
                });
        }
    }
}
