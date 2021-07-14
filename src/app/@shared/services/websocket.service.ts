import { Injectable } from "@angular/core";
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { LcuService } from "./lcu.service";
import { CreateLobby } from "../models/lcu/create-lobby";

@Injectable({ providedIn: "root" })
export class WebsocketService {

    connection: Promise<any>;
    player: string;

    constructor(private lcuService: LcuService) { }

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

                this.lcuService.createLobby(lobby).subscribe(lobby => {
                    console.log(lobby)
                })
            }))
    }
}
