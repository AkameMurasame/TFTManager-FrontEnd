import { Injectable } from "@angular/core";
import { Stomp } from '@stomp/stompjs';
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

@Injectable({ providedIn: "root" })
export class WebsocketService {

    connection: Promise<any>;
    player: PlayerConnect;
    sessionId: string;
    intervalPartida: any;
    activeGroup: number;
    organizationTournament: number;
    teansGroup: Team[];
    dataPartida: any;
    isPartida: boolean = false;
    eventsPartida: EventLcu[];
    lastCountEvent: number = 2;
    killNames: Team[] = new Array<Team>();
    isLobby: boolean = false;

    constructor(private http: HttpClient, private lcuService: LcuService, private playerService: PlayerService, private toastService: ToastService, private tournamentService: TournamentService) { }

    public get getconnection() {
        return this.connection;
    }

    public get getKillNames() {
        return this.killNames;
    }

    public get getisPartida() {
        return this.isPartida;
    }

    DataPartida() {
        console.log(this.killNames)
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
                            console.log(event);
                            if (event.EventName == "ChampionKill") {
                                this.teansGroup.forEach(e => {
                                    if (e.name == event.KillerName) {
                                        this.killNames.push(e);
                                    }
                                })
                                console.log(this.killNames)
                            }
                            this.lastCountEvent = data.Events.length;
                        }
                    }
                }
            }
        }));
    }

    changeMatchStatus(groupStatus: GroupStatus) {
        this.tournamentService.changeMatchStatus(this.activeGroup, groupStatus).subscribe();
    }

    initIntervalPartida() {
        this.intervalPartida = setInterval(func => this.DataPartida().subscribe(), 5 * 1000);
    }

    finishInterval() {
        this.isPartida = false;
        clearInterval(this.intervalPartida);
    }

    connect() {
        return new Promise((resolve, reject) => {
            let stompClient = Stomp.over(new SockJS(environment.webSocketEndPoint))
            stompClient.connect({}, (frame) => {
                var url = stompClient.ws._transport.url;
                this.sessionId = url.split("/")[5];
                resolve(stompClient)
            });
        })
    }

    stompSubscribe(stompClient, endpoint, callback) {
        stompClient.subscribe(endpoint, callback)
        return stompClient
    }

    stompClientSendMessage(stompClient, endpoint, message) {
        stompClient.send(endpoint, {}, message)
        return stompClient
    }

    disconnect(stompClient, username, connectBtn, disconnectBtn, clicked = false) {
        if (clicked) {
            this.stompClientSendMessage(stompClient, '/app/unregister', username)
        }
        stompClient.disconnect() //6-1
    }

    initPartida(object) {
        const teans = object.players;
        this.activeGroup = object.groupId;
        this.teansGroup = teans;
        this.initIntervalPartida();
    }

    connectTopicOrganization(stompClient) {
        if (this.player.organizationId != null) {
            this.stompSubscribe(stompClient, `/topic/organization/${this.player.organizationId}`, (data) => {
                var message = JSON.parse(data.body);
                console.log(message);
                switch (message.organizationMessage) {
                    case "CHAVE_CRIADA":
                        this.toastService.success("Chave do torneio criada!")
                        break;
                }
                return stompClient
            });
        }
        return stompClient
    }

    createLobby(object, stompClient) {

        this.isLobby = true;
        const teans = object.players;
        this.activeGroup = object.groupId;
        this.teansGroup = teans;

        const lobby: CreateLobby = {
            queueId: 1090
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
                            const update: UpdatePlayerLobby = {
                                player: player,
                                key: "410e8677-7073-48dd-a882-8a5e53d5a833"
                            };

                            console.log(update, 161)

                            this.playerService.updatePlayerLobby(update).subscribe(playera => {
                                console.log(playera, "UPDATE")
                            });

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

    connectCreateLobby(stompClient, player) {
        this.connection.then((stompClient) => this.stompSubscribe(stompClient, '/user/' + player.summonerId, (data) => { // 7
            const json = JSON.parse(data.body);
            switch (json.message) {
                case "CREATE_LOBBY":
                    this.createLobby(json, stompClient);
                    break;
                case "INIT_PARTIDA":
                    this.initPartida(json);
                    break;
            }
        }));
        return stompClient;
    }

    initWebSocket(player: PlayerConnect) {
        this.player = player;
        this.connection = this.connect();

        this.connection.then((stompClient) => this.stompClientSendMessage(stompClient, '/app/register', JSON.stringify(player)))
            .then((stompClient) => {
                return stompClient;
            }).then((stompClient) => this.connectTopicOrganization(stompClient))
            .then((stompClient) => this.connectCreateLobby(stompClient, player));
    }
}
