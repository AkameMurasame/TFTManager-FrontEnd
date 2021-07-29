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

@Injectable({ providedIn: "root" })
export class WebsocketService {

    connection: Promise<any>;
    player: PlayerConnect;
    sessionId: string;
    dataPartida: any;
    isPartida: boolean = false;
    intervalPartida: any;
    eventsPartida: EventLcu[];
    lastCountEvent: number = 2;
    activeTournament: number;
    organizationTournament: number;

    constructor(private http: HttpClient, private lcuService: LcuService, private playerService: PlayerService, private toastService: ToastService) { }

    public get getconnection() {
        return this.connection;
    }

    public get getdataPartida() {
        return this.dataPartida;
    }

    public get getisPartida() {
        return this.isPartida;
    }

    DataPartida() {
        return this.http.get<EventList>("https://127.0.0.1:2999/liveclientdata/eventdata").pipe(map((data) => {
            this.isPartida = true;
            if (data != null) {
                if (this.eventsPartida == null) {
                    //this.connection.then((stompClient) => this.stompClientSendMessage(stompClient, `/topic/organization/${this.organizationTournament}`, "oplhar object"));
                    this.eventsPartida = data.Events;
                    this.lastCountEvent = data.Events.length;
                    console.log(data.Events, 51);
                } else {
                    if (data.Events.length < this.lastCountEvent) {
                        this.eventsPartida = data.Events;
                        console.log(data.Events, 56);
                        for (var x = this.lastCountEvent; x < data.Events.length; x++)
                            var event = data.Events[x];
                        if (event.EventName == "ChampionKill") {
                            console.log("jogador eliminado: " + event.KillerName);
                        }
                        this.lastCountEvent = data.Events.length;
                    }
                }
            }
        }));
    }

    initIntervalPartida() {
        console.log('init interval');
        this.intervalPartida = setInterval(func => this.DataPartida().subscribe(), 15 * 1000);
    }

    finishInterval() {
        this.isPartida = false;
        clearInterval(this.intervalPartida);
    }

    connect() {
        return new Promise((resolve, reject) => {
            let stompClient = Stomp.over(new SockJS('http://localhost:8085/websocket'))
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
        connectBtn.disabled = false
        disconnectBtn.disabled = true
        if (clicked) {
            this.stompClientSendMessage(stompClient, '/app/unregister', username)
        }
        stompClient.disconnect() //6-1
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

    connectCreateLobby(stompClient, player, initpartida) {
        this.connection.then((stompClient) => this.stompSubscribe(stompClient, '/user/lobby-' + player.summonerId, (data) => { // 7
            const teans = JSON.parse(data.body);

            const lobby: CreateLobby = {
                queueId: 1090
            };

            var invitationArray = Array<InvitationLobby>();
            var actualPlayer;
            console.log(teans);

            this.lcuService.createLobby(lobby).subscribe(lobby => {
                for (var x = 0; x < teans.length; x++) {
                    if (teans[x].capitao.summonerId === null) {
                        actualPlayer = teans[x];
                        this.lcuService.findPlayer(teans[x].name).subscribe(player => {
                            if (player != null) {
                                const invitation: InvitationLobby = {
                                    toSummonerId: 1903736,
                                    toSummonerName: "INU Kuga"
                                };

                                invitationArray.push(invitation);

                                this.lcuService.invitePlayers(invitationArray).subscribe(invite => {
                                    invitationArray = [];
                                    console.log(actualPlayer, 82);

                                    player.id = actualPlayer.capitao.id;
                                    const update: UpdatePlayerLobby = {
                                        player: player,
                                        key: "410e8677-7073-48dd-a882-8a5e53d5a833"
                                    };

                                    this.playerService.updatePlayerLobby(update).subscribe();
                                });
                            } else {
                                const invitation: InvitationLobby = {
                                    toSummonerId: 1903736,
                                    toSummonerName: "INU Kuga"
                                };

                                invitationArray.push(invitation);

                                this.lcuService.invitePlayers(invitationArray).subscribe(invite => {
                                    invitationArray = [];
                                    console.log(invitationArray);
                                });
                            }
                        });
                    }
                }
            });
            initpartida();
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
            .then((stompClient) => this.connectCreateLobby(stompClient, player, this.initIntervalPartida));
    }
}
