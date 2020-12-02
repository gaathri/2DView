import { KeycloakConfig } from "keycloak-angular";

const keycloakConfig: KeycloakConfig = {
  //url: "https://spellbound.2dview.com/auth",
  url: "http://ec2-18-223-32-145.us-east-2.compute.amazonaws.com:8080/auth",
  //url: "https://studio.2dview.com/auth",
  //url: "http://139.59.62.225:3000/auth",
  realm: "2dView",
  clientId: "spa-2dView",
};

export const environment = {
  production: false,
  //apiUrl: `https://spellbound.2dview.com:8443/portal/api/`,
  //apiUrl: `http://ec2-3-135-62-120.us-east-2.compute.amazonaws.com:8080/portal/api/`,
  //apiUrl: `https://studio.2dview.com:8443/portal/api/`,
  //apiUrl: `http://139.59.62.225:8080/portal/api/`,
  apiUrl: `http://localhost:8080/portal/api/`,
  version: "1.0.11",
  apiUrlLocal: "http://localhost:2000/mock-",
  isLocal: false,
  keycloak: keycloakConfig,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
