import { Injectable } from "@angular/core";
import { HttpService } from "../services/http.service";
import { HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router, NavigationExtras } from "@angular/router";
import { LoggerService } from "../services/logger.service";
import { environment } from "src/environments/environment";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "../services/helper.service";
import { KeycloakService } from "keycloak-angular";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  loginPath: any;
  //token = 'rtoken';

  constructor(
    private http: HttpService,
    private router: Router,
    private logger: LoggerService,
    private helperService: HelperService,
    private keycloakService: KeycloakService
  ) {}

  login(credentials: any) {
    this.log("**** INIT LOGIN ****");
    this.loginPath = environment.apiUrl + AppConstants.ACCOUNT_LOGIN;
    const headers = this.prepareHeader(null);
    return this.http
      .post<any>(this.loginPath, credentials, headers as HttpHeaders)
      .pipe(
        map((response) => {
          console.log(response);
          if (response && response.sessionId) {
            //localStorage.setItem(this.token, JSON.stringify(response));
            localStorage.setItem("login_info", JSON.stringify(response));
            this.helperService.loginInfo = response;
            return response;
          } else {
            return response;
          }
        })
      );
  }

  loginValidate() {
    this.log("**** INIT loginValidate ****");
    let url = environment.apiUrl + "session/validate";
    return this.http.get<any>(url).pipe(
      map((response) => {
        localStorage.setItem("login_info", JSON.stringify(response));
        this.helperService.loginInfo = response;
        return response;
      })
    );
  }

  refreshToken() {
    const headers = this.prepareHeader(null);
    //const token = this.getToken()['rtoken'];
    const refreshToken = this.helperService.loginInfo["rtoken"];
    const credentails = `refresh_token=${refreshToken}&grant_type=refresh_token`;
    const ref = this;
    return this.http
      .post(this.loginPath, credentails, headers as HttpHeaders)
      .pipe(
        map(
          (user) => {
            if (user && user.hasOwnProperty("access_token")) {
              const data = {
                token: user["access_token"],
                rtoken: user["refresh_token"],
                info: user["userid"],
              };
              //localStorage.setItem(ref.token, JSON.stringify(data));
              localStorage.setItem("login_info", JSON.stringify(data));
            }
            return user;
          },
          (error) => {
            this.log("Refresh Error :" + error);
          }
        )
      );
  }

  /*getToken() {
    const token = localStorage.getItem(this.token);
    if (token !== null) {
      return JSON.parse(token);
    }
    return null;
  }*/

  getAuthToken(): string {
    /*const token = this.getToken();
    if (token !== null) {
      return token['sessionId'];
    }
    return '';*/
    let token = "";
    const login_info = localStorage.getItem("login_info");
    if (login_info !== null) {
      this.helperService.loginInfo = JSON.parse(login_info);
      token = this.helperService.loginInfo["sessionId"];
    }
    return token;
  }

  async logout() {
    const navigationExtras: NavigationExtras = { state: { action: "logout" } };
    localStorage.removeItem("login_info");
    this.router.navigate(["/login"], navigationExtras);
    //await this.keycloakService.logout();
  }

  isLoggedIn(): boolean {
    //return true;
    const token = this.getAuthToken();
    if (
      token === null ||
      token === undefined ||
      token === "" ||
      token === "null"
    ) {
      return false;
    }
    return true;
  }

  prepareHeader(headers: HttpHeaders | null): object {
    headers = headers || new HttpHeaders();
    headers = headers.set("Content-Type", "application/json");
    /*headers = headers.set(
      'Authorization',
      'Basic dXRyYWNrQXV0aDpESkI4enZBMkI0aXY4ODc='
    );*/
    return {
      headers: headers,
    };
  }

  log(s: any) {
    this.logger.log("<AuthenticationService> " + s);
  }
}
