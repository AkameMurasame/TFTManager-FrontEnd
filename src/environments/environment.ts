// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  version: 0,
  restEndPoint: 'http://localhost:8080/api/v1',
  webSocketEndPoint: 'http://localhost:8080/websocket',
  riotApiEndPont: `.api.riotgames.com`,
  xRiotToken: `RGAPI-efedc493-a59d-4e83-8d5f-4a57c20a663e`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
