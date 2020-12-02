import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../core/authentication/authentication.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LoggerService } from "../../core/services/logger.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { environment } from "src/environments/environment";
import { KeycloakService } from "keycloak-angular";
import { NotificationService } from "../../core/services/notification.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @ViewChild("username", { static: true }) username;
  loginForm: FormGroup;
  passwordVisible = false;
  loginErrMsg = AppConstants.LOGIN_ERROR;
  loginFailed = AppConstants.LOGIN_FAILED;
  isDataReady: boolean = false;
  isLogout: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: LoggerService,
    private keycloakService: KeycloakService,
    private notificationService: NotificationService
  ) {
    try {
      const navigation = this.router.getCurrentNavigation();
      const state = navigation.extras.state as { action: string };
      if (state && state.action === "logout") {
        this.isLogout = true;
        this.keycloakService.logout();
      }
    } catch (e) {}
  }

  ngOnInit(): void {
    if (this.isLogout) {
      return;
    }

    this.authService.loginValidate().subscribe(
      (response) => {
        if (response) {
          const retUrl = this.route.snapshot.queryParamMap.get("returnUrl");
          if (retUrl) {
            this.router.navigate([retUrl]);
          } else {
            this.router.navigate(["/system"]);
          }
        } else {
          this.showNotification({
            type: "warning",
            title: "Permission Denied",
            content: "Please contact administrator for more information",
            duration: AppConstants.NOTIFICATION_DURATION,
          });

          setTimeout(() => {
            this.keycloakService.logout();
          }, AppConstants.NOTIFICATION_DURATION);
        }
      },
      (error) => {
        this.showNotification({
          type: "warning",
          title: "Permission Denied",
          content: "Please contact administrator for more information",
          duration: AppConstants.NOTIFICATION_DURATION,
        });

        setTimeout(() => {
          this.keycloakService.logout();
        }, AppConstants.NOTIFICATION_DURATION);
      }
    );

    /*if (this.authService.isLoggedIn()) {
      this.router.navigate(["/system"]);
    } else {
      let u = null;
      let p = null;
      if (!environment.production) {
        u = "supervisor@ymail.com";
        p = "test12";
      }

      this.loginForm = this.fb.group({
        userName: [null, [Validators.required]],
        password: [null, [Validators.required]],
      });

      this.loginForm.setValue({
        userName: u,
        password: p,
      });
    }*/
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  submitForm(): void {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (!this.loginForm.valid) {
      return;
    }
    //const loginParams = `loginId=${this.loginForm.value.userName}&password=${this.loginForm.value.password}`;
    const loginParams = {
      loginId: this.loginForm.value.userName,
      password: this.loginForm.value.password,
    };

    //this.router.navigate(["/system"]);
    //return;
    this.authService.login(loginParams).subscribe(
      (response) => {
        if (response) {
          this.log("Login Success" + response);
          //this.interactionService.sendInteraction('LOGIN_SUCCESS');
          const retUrl = this.route.snapshot.queryParamMap.get("returnUrl");
          this.router.navigate([retUrl || "/system"]);
          this.resetLoginForm();
        } else {
          //this.interactionService.sendInteraction('LOGIN_ERROR');
          this.resetLoginForm();
          this.loginForm.setErrors({ loginError: true });
        }
      },
      (error) => {
        //this.interactionService.sendInteraction('LOGIN_ERROR');
        this.resetLoginForm();
        this.loginErrMsg = this.loginFailed;
        this.log("Error " + error);
        this.log("Login Error : " + this.loginErrMsg);
        this.loginForm.setErrors({ loginError: true });
      }
    );
  }

  resetLoginForm() {
    this.username.nativeElement.focus();
    this.loginForm.reset();
  }

  log(s) {
    this.logger.log("<LoginComponent> " + s);
  }
}
