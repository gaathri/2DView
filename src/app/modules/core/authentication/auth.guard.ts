import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Injectable } from "@angular/core";
import { HelperService } from "../services/helper.service";
import { KeycloakService, KeycloakAuthGuard } from "keycloak-angular";

@Injectable()
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected router: Router,
    protected keycloakAngular: KeycloakService,
    private authService: AuthenticationService,
    private helperService: HelperService
  ) {
    super(router, keycloakAngular);
  }

  isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this.authenticated) {
        this.keycloakAngular.login();
        return;
      }
      const login_info = localStorage.getItem("login_info");
      if (login_info !== null && login_info !== "null") {
        this.helperService.loginInfo = JSON.parse(login_info);
      }
      let granted = false;
      if (route.data.permission) {
        if (this.helperService.hasViewPermission(route.data.permission)) {
          granted = true;
        } else {
          granted = false;
        }
      } else {
        granted = true;
      }

      let currentUserRole = this.helperService.getRole();
      if (
        route.data.roles &&
        route.data.roles.indexOf(currentUserRole) === -1
      ) {
        this.router.navigate(["/"]);
        granted = false;
      }
      if (granted === false) {
        this.router.navigate(["/"]);
      }
      resolve(granted);
      return;
    });
  }
}
