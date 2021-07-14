import { Injectable } from "@angular/core";
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { LcuService } from "./lcu.service";
import { CreateLobby } from "../models/lcu/create-lobby";
import { InvitationLobby } from "../models/lcu/invitation-lobby";
import { Player } from "../models/player/Player";
import { PlayerService } from "./player.service";
import { UpdatePlayerLobby } from "../models/lcu/update-player";

@Injectable({ providedIn: "root" })
export class WebsocketService {

    connection: Promise<any>;
    player: string;

    constructor(private lcuService: LcuService, private playerService: PlayerService) { }

    connect(username) {
        return new Promise((resolve, reject) => {
            let stompClient = Stomp.over(new SockJS('http://localhost:8085/websocket'))
            stompClient.connect({}, (frame) => resolve(stompClient))
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

    initWebSocket(player: string) {
        this.player = player;
        this.connection = this.connect(player);
        this.connection.then((stompClient) => this.stompSubscribe(stompClient, '/topic/newMember', (data) => {
            console.log(data);
        })).then((stompClient) => this.stompClientSendMessage(stompClient, '/app/register', this.player))
            .then((stompClient) => {
                return stompClient;
            }).then((stompClient) => this.stompSubscribe(stompClient, '/topic/disconnectedUser', (data) => { // 7
                console.log(data);
            })).then((stompClient) => this.stompSubscribe(stompClient, '/topic/lobby', (data) => { // 7

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
                })
            }))
    }
}
