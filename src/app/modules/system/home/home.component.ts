import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { HelperService } from "../../core/services/helper.service";
import { environment } from "src/environments/environment";
import { NzDrawerService } from "ng-zorro-antd";
import { AddNewComponent } from "../modals/add-new/add-new.component";
import { InteractionService } from "../../core/services/interaction.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { AuthenticationService } from "../../core/authentication/authentication.service";
import { Role } from "../../shared/model/role";
import { HomeService } from "../home.service";
import { NotificationsComponent } from "../modals/notifications/notifications.component";
import { NotificationsService } from "../notifications.service";
import { MyAccountFormComponent } from "../modals/my-account-form/my-account-form.component";
import { UsersService } from "../configs/users.service";
import { AdminDashboardService } from "../dashboards/admin-dashboard.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  isAlertVisible: boolean;
  isCollapsed = true;
  windowHeight: any;
  siderHeight: any;
  version: any;
  versionBE: any;
  windowWidth: any;
  antLayoutContentWidth: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  drawerRef: any;
  drawerTitle: any;
  isDataReady: boolean;
  addMenu: any;
  listMenu: any;
  sideMenu: any;
  isAdmin: boolean;
  isDotVisible: boolean;
  notificationIntervalId: any;
  userId: any;
  previleageId: any;
  adminpvgID:any;
  userOut: any;
  studioOut: any;
  appLogo: any;
  subscription: Subscription;
  canShowGantt: boolean;
  isReportAvailable: boolean;

  constructor(
    private adminDashboardService: AdminDashboardService,
    private usersService: UsersService,
    private helperService: HelperService,
    private drawerService: NzDrawerService,
    private interactionService: InteractionService,
    private authService: AuthenticationService,
    private homeService: HomeService,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe((interaction) => {
        if (
          interaction.type === "studio_update" &&
          interaction.text === "logo_update"
        ) {
          if (interaction.info && interaction.info.url) {
            this.appLogo = interaction.info.url;
          }
        }
      });
    this.version = environment.version;
    this.isCollapsed = this.helperService.getCollapsedFlag();
    this.getwindowHeight();
    this.getWindowWidth();
    this.prepareData();
    let role = this.helperService.getRole();
      this.isAdmin = false;
    if (role === Role.ADMIN || role === Role.PLATFORM_ADMIN) {
      this.isAdmin = true;
    }
    this.checkeNotification();
    this.canShowGantt = this.helperService.hasViewPermission(
      AppConstants.PERMISSIONS.SHOW
    );
  }

  ngOnDestroy(): void {
    clearInterval(this.notificationIntervalId);
  }

  async prepareData() {
    const login_info = localStorage.getItem("login_info");
    this.helperService.loginInfo = JSON.parse(login_info);
    this.previleageId = this.helperService.loginInfo.privilegeId;
    this.userId = this.helperService.loginInfo.id;
    this.addMenu = null;
    this.listMenu = null;
    this.sideMenu = null;
    await this.getVersion();
    await this.getStudio(AppConstants.MY_STUDIO_ID);
    await this.getUser(this.userId);
    await this.getAddMenu();
    await this.reportCheck();
    await this.getListMenu();
    await this.getWorklogLimit();
    await this.getWeekends();

    this.isDataReady = true;
  }

  isNotificationEnabled() {
    return this.previleageId != AppConstants.ADMIN_PRIVILEGE_ID 
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  onResize() {
    this.getwindowHeight();
    this.getWindowWidth();
  }

  toggleCollapsedFlag() {
    //this.helperService.toggleCollapsedFlag();
    //this.isCollapsed = this.helperService.getCollapsedFlag();
  }

  getwindowHeight() {
    this.windowHeight = document.documentElement.clientHeight; //window.innerHeight;
    this.siderHeight = this.windowHeight - 85;
  }

  getWindowWidth() {
    this.windowWidth = document.documentElement.clientWidth;
    this.antLayoutContentWidth = this.windowWidth - 400;
  }

  listClickHandler() {
    this.openDrawer("listing", this.listMenu);
  }

  async getWorklogLimit() {
    await this.homeService
      .getWorklogLimit()
      .toPromise()
      .then((resp) => {
        if (resp.entity && resp.entity.configKeyValue) {
          let hasPermission = this.helperService.hasViewPermission(
            AppConstants.PERMISSIONS.TIME_SHEET_REVIEW
          );
          if (hasPermission) {
            AppConstants.WORK_LOG_LIMIT = AppConstants.WORK_LOG_UNLIMITED;
          } else {
            AppConstants.WORK_LOG_LIMIT = Number(resp.entity.configKeyValue);
          }
        }
      })
      .catch((error) => {});
  }

  async getWeekends() {
    await this.homeService
      .getWeekends()
      .toPromise()
      .then((resp) => {
        if (resp.entity) {
          AppConstants.WEEK_ENDS = resp.entity;
        }
      })
      .catch((error) => {});
  }

  async reportCheck() {
    this.isReportAvailable = false;
    await this.homeService
      .reportCheck()
      .toPromise()
      .then((resp) => {
        if (this.helperService.isValidArr(resp.entity)) {
          this.isReportAvailable = true;
        }
      })
      .catch((error) => {});
  }

  async getVersion() {
    this.versionBE = "";
    await this.homeService
      .getVersion()
      .toPromise()
      .then((resp) => {
        this.versionBE = resp;
        if (this.versionBE) {
          this.versionBE = this.versionBE.split('"').join("");
        }
      })
      .catch((error) => {});
  }

  async getStudio(id: any) {
    this.appLogo = this.helperService.defaultAppLogo;
    await this.adminDashboardService
      .getStudio(id)
      .toPromise()
      .then((resp) => {
        this.studioOut = resp.entity;
        if (this.studioOut && this.studioOut.studioLogo) {
          this.appLogo = this.studioOut.studioLogo;
        }
      })
      .catch((error) => {
        this.studioOut = null;
      });
  }

  async getUser(userId: any) {
       await this.usersService
      .getUser(userId)
      .toPromise()
      .then((resp: any) => {
        this.userOut = resp.entity;
      })
      .catch((error: any) => {
        this.userOut = null;
      });
    this.helperService.userInfo = this.userOut;
  }

  async getAddMenu() {
    await this.homeService
      .getAddMenu()
      .toPromise()
      .then((resp) => {
        //this.addMenu = resp.entity;
        const ignoreAddMenus = ["Favourites" /*, "Template"*/];
        this.addMenu = resp.entity.filter(
          (o) => !ignoreAddMenus.find((o2) => o.actionName === o2)
        );
      })
      .catch((error) => {
        this.addMenu = null;
      });
  }

  async getListMenu() {
    await this.homeService
      .getListMenu()
      .toPromise()
      .then((resp) => {
        this.listMenu = resp.entity;
        if (this.isReportAvailable) {
          let reportMenu = {
            id: 129,
            actionName: "Report",
            actionDesc: "Report",
          };
          this.listMenu = [...this.listMenu, reportMenu];
        }
        this.sideMenu = this.ignoreConfigMenus(this.listMenu);
        this.sideMenu = this.ignoreNonLinkMenus(this.sideMenu);
      })
      .catch((error) => {
        this.listMenu = null;
      });
  }

  ignoreConfigMenus(menus) {
    let configMenus = AppConstants.CONFIG_MENU;
    return menus.filter((menu) => {
      return !configMenus.includes(menu.actionName);
    });
  }

  ignoreNonLinkMenus(menus: any) {
    return menus.filter((menu) => {
      let type = menu.actionName.toLowerCase().split(" ").join("");
      type = type.split("/").join("");
      return this.helperService.getLink(type);
    });
  }

  getAvatarInfo() {
    let user = {
      firstName: "U",
      lastName: "N",
      thumbnail: "",
    };
    if (this.userOut) {
      if (this.userOut.firstName) {
        user.firstName = this.userOut.firstName;
      }
      if (this.userOut.lastName) {
        user.lastName = this.userOut.lastName;
      }
      if (this.userOut.thumbnail) {
        user.thumbnail = this.userOut.thumbnail;
      }
    }
    /*if (this.helperService.loginInfo) {
      if (this.helperService.loginInfo.firstName) {
        user.firstName = this.helperService.loginInfo.firstName;
      }
      if (this.helperService.loginInfo.lastName) {
        user.lastName = this.helperService.loginInfo.lastName;
      }
      if (this.helperService.loginInfo.thumbnail) {
        user.thumbnail = this.helperService.loginInfo.thumbnail;
      }
    }*/

    return {
      ...user,
      size: "large",
    };
  }

  async addClickHandler() {
    this.openDrawer("add", this.addMenu);
  }

  supportHandler() {
    /*var root = location.protocol + "//" + location.host;
    window.open(`${root}/support`);*/
    window.open("https://studio.2dview.com/support/");
  }

  logoutHandler() {
    this.isAlertVisible = true;
  }
  logoutConfirm() {
    this.isAlertVisible = false;
    this.authService.logout();
  }
  logoutCancel() {
    this.isAlertVisible = false;
  }

  profileHandler() {
    this.drawerTitle = "My Account";
    this.drawerRef = this.drawerService.create<
      MyAccountFormComponent,
      { userOut: any },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: MyAccountFormComponent,
      nzContentParams: {
        userOut: this.userOut,
      },
      nzClosable: false,
      nzWrapClassName: "modal-wrapper",
      nzWidth: "500px",
    });

    this.drawerRef.afterOpen.subscribe(() => {});

    this.drawerRef.afterClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.getUser(this.userId);
      }
    });
  }
  openDrawer(actionType: string, menuArr: any): void {
    this.drawerTitle = actionType === "add" ? "Add New" : "Listing";
    this.drawerRef = this.drawerService.create<
      AddNewComponent,
      { actionType: string; menuArr: any },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: AddNewComponent,
      nzContentParams: {
        actionType: actionType,
        menuArr: menuArr,
      },
      nzClosable: false,
      nzWrapClassName: "modal-wrapper  no-footer",
      nzWidth: "25%",
    });

    this.drawerRef.afterOpen.subscribe(() => {});

    this.drawerRef.afterClose.subscribe((data) => {});
  }

  /*getRouterLink(type: any) {
    if (type === "list") {
      return "/system/listing/configs";
    } else if (type === "dashboard") {
      return "/system/dashboard";
    } else if (type === "time-sheet") {
      return "/system/listing/time-sheet";
    } else if (type === "playlist") {
      return "/system/listing/playlist";
    }
  }*/

  closeAddNewForm(): void {
    this.drawerRef.close();
  }

  dashboardMenu = {
    actionName: "Dashboard",
  };

  ganttMenu = {
    actionName: "Gantt",
  };

  getRouterLinkNew(menu: any) {
    let link = "";
    switch (menu.actionName) {
      case "Dashboard":
        return "/system/dashboard";
        break;
      case "Show":
        return "/system/listing/shows";
        break;
      case "Playlist":
        return "/system/listing/playlists";
        break;
      case "Time Sheet":
        return "/system/listing/time-sheet";
        break;
      case "Time Sheet Review":
        return "/system/listing/time-sheet-review";
        break;
      case "My Task":
        return "/system/listing/tasks";
        break;
      case "Report":
        return "/system/listing/report";
        break;
      case "Daybook":
        return "/system/listing/daybook";
        break;
      case "Favourites":
        return "/system/listing/favourites";
        break;
      case "Gantt":
        return "/system/listing/gantt";

      default:
        break;
    }
    return link;
  }

  getIconOld() {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none" />
    <path
      d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
  </svg>`;
  }
  getIcon(menu: any) {
    let icon = "";
    switch (menu) {
      case "Show":
        return "desktop";
        break;
      case "Playlist":
        return "play-square";
        break;
      case "Time Sheet":
        return "calendar";
        break;
      case "Time Sheet Review":
        return "schedule";
        break;
      case "My Task":
        return "desktop";
        break;
      case "list":
        return "unordered-list";
        break;
      case "Report":
        return "bar-chart";
        break;
      case "Daybook":
        return "read";
        break;
      case "Favourites":
        return "tags";
        break;
      default:
        break;
    }
    return icon;
  }

  bellHandler() {
    this.isDotVisible = false;
    this.drawerTitle = "Notifications";
    this.drawerRef = this.drawerService.create<
      NotificationsComponent,
      {},
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: NotificationsComponent,
      nzContentParams: {},
      nzClosable: false,
      nzWrapClassName: "modal-wrapper",
      nzWidth: "50%",
    });

    this.drawerRef.afterOpen.subscribe(() => {});

    this.drawerRef.afterClose.subscribe((data) => {
      //this.isDotVisible = true;
    });
  }

  async checkeNotification() {
    let page = {
      pageNumber: 0,
      size: 5,
      search: "",
      sortBy: "",
      orderBy: "",
    };
    if (!this.helperService.latestTimeStamp) {
      await this.notificationsService
        .getNotificationList(page)
        .toPromise()
        .then((resp) => {
          if (resp && resp.valid) {
            if (page.pageNumber == 0 && resp.coll && resp.coll[0].createdDate) {
              this.helperService.latestTimeStamp = resp.coll[0].createdDate;
            }
          }
        })
        .catch((error) => {});
    }
    if (environment.production) {
      this.notificationIntervalId = setInterval(() => {
        this.notificationsService
          .checkNewNotifications(this.helperService.latestTimeStamp)
          .subscribe(
            (resp) => {
              this.isDotVisible = resp.entity;
            },
            (error) => {}
          );
      }, AppConstants.NOTIFICATION_INTERVAL);
    }
  }
}
