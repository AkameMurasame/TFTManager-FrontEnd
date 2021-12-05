// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

 /*export const environment = {
   production: false,
   version: 0,
   restEndPoint: 'http://localhost:8080/api/v1',
   webSocketEndPoint: 'http://localhost:8080/websocket',
   riotApiEndPont: `.api.riotgames.com`,
   xRiotToken: `RGAPI-b04c8d5f-4195-46d0-baae-751826cabc5a`
 };*/

 export const environment = {
  production: true,
  restEndPoint: 'https://tft-manager.herokuapp.com/api/v1',
  webSocketEndPoint: 'https://tft-manager.herokuapp.com/websocket',
  riotApiEndPont: `.api.riotgames.com`,
  xRiotToken: `RGAPI-b04c8d5f-4195-46d0-baae-751826cabc5a`
}; 

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
