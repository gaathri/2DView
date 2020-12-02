import { KeycloakConfig } from "keycloak-angular";

const keycloakConfig: KeycloakConfig = {
  //url: "https://spellbound.2dview.com/auth",
  url: "http://ec2-18-223-32-145.us-east-2.compute.amazonaws.com:8080/auth",
  //url: "https://studio.2dview.com/auth",
  //url: "http://139.59.62.225:3000/auth",
  //url: "http://qa.2dview.com/auth",
  realm: "2dView",
  clientId: "spa-2dView",
};

export const environment = {
  production: true,
 // apiUrl: `https://spellbound.2dview.com:8443/portal/api/`,
 // apiUrl: `http://ec2-3-135-62-120.us-east-2.compute.amazonaws.com:8080/portal/api/`,
  //apiUrl: `https://studio.2dview.com:8443/portal/api/`,
  //apiUrl: `http://139.59.62.225:8080/portal/api/`,
    apiUrl: `http://localhost:8080/portal/api/`,
  //apiUrl: `http://qa.2dview.com:8080/portal/api/`,
  version: `1.0.11`,
  apiUrlLocal: `http://192.168.0.44:2000/mock-`,
  isLocal: false,
  keycloak: keycloakConfig,
};
