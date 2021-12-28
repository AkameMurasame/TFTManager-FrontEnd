import { InjectableRxStompConfig } from '@stomp/ng2-stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './@shared/services/websocket.service';

export const myRxStompConfig: InjectableRxStompConfig = {
    // Which server?
    brokerURL: environment.webSocketEndPoint,
    
    // How often to heartbeat?
    // Interval in milliseconds, set to 0 to disable
    heartbeatIncoming: 0, // Typical value 0 - disabled
    heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

    webSocketFactory: function () {
        // Note that the URL is different from the WebSocket URL
        return new SockJS(environment.webSocketEndPoint);
    },

    // Wait in milliseconds before attempting auto reconnect
    // Set to 0 to disable
    // Typical value 500 (500 milli seconds)
    reconnectDelay: 200,

    // Will log diagnostics on console
    // It can be quite verbose, not recommended in production
    // Skip this key to stop logging to console
    debug: (msg: string): void => {
        console.log(new Date(), msg);
    },
};