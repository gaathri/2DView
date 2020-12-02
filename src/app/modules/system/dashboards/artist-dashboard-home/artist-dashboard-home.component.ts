import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { ArtistDbSettingsComponent } from "../../modals/artist-db-settings/artist-db-settings.component";
import { NzDrawerService } from "ng-zorro-antd";
import { WorkstatusService } from "../../configs/workstatus.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ArtistDashboardComponent } from "../artist-dashboard/artist-dashboard.component";
import { KanbanComponent } from "src/app/modules/shared/components/kanban/kanban.component";
import { ArtistDashboardService } from "../artist-dashboard.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-artist-dashboard-home",
  templateUrl: "./artist-dashboard-home.component.html",
  styleUrls: ["./artist-dashboard-home.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ArtistDashboardHomeComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild(ArtistDashboardComponent, { static: false })
  artistDashboardComponent: ArtistDashboardComponent;
  //@ViewChild('kanbanChart', { static: false }) kanbanChart: KanbanComponent;
  @ViewChild(KanbanComponent, { static: false }) kanbanChart: KanbanComponent;

  title = "jkanban";

  isDashboardVisible: boolean;
  isKanbanVisible: boolean;
  drawerTitle: any;
  childDrawerRef: any;
  workStatusesKanban: any;
  workStatuses: any;
  overallSelectedItems: any;
  starSelectedItems: any;
  kanbanSelectedItems: any;
  startDate: any;
  endDate: any;
  userSettings: any;
  kanbanUserSettings: any;

  constructor(
    private drawerService: NzDrawerService,
    private workstatusService: WorkstatusService,
    private helperService: HelperService,
    private dashboardService: ArtistDashboardService
  ) {}

  ngOnInit() {
    this.drawerTitle = "Artist Dashboard Settings";
    this.prepareData();
    this.showDashboard();
    //this.showKanban();
    //this.getWorkstatusList();
    //this.getKanbanWorkstatus();
  }

  async prepareData() {
    await this.getUserSettings();
    await this.getWorkstatusList();
    /*if (this.userSettings) {      
      await this.getKanbanWorkstatus();
    } else {
      let id = setTimeout(async () => {
        await this.getKanbanWorkstatus();
      }, 500);
    }*/
  }

  async getKanbanUserSettings() {
    await this.dashboardService
      .getKanbanUserSettings()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          AppConstants.KANBAN_USER_SETTINGS_ID = resp.entity.id;
          this.kanbanUserSettings = resp.entity;
        }
      })
      .catch((error: any) => {
        this.kanbanUserSettings = null;
      });
  }

  async getUserSettings() {
    await this.dashboardService
      .getUsersettings()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          AppConstants.ARTIST_DASHBOARD_USER_SETTINGS_ID = resp.entity.id;
          this.userSettings = resp.entity;
        }
      })
      .catch((error: any) => {
        this.userSettings = null;
      });
  }

  async getWorkstatusList() {
    await this.workstatusService
      .getWorkstatusList()
      .toPromise()
      .then((resp: any) => {
        let workStatuses = resp.entity;
        if (!this.userSettings) {
          this.overallSelectedItems = workStatuses.slice(0, 5);
          this.starSelectedItems = workStatuses.slice(0, 4);
          this.setUserPref();
        } else {
          let overAllTaskStatus = [];
          let starUserTaskStatus = [];

          if (this.userSettings.dashboard[0].overAllTaskStatus) {
            overAllTaskStatus = this.userSettings.dashboard[0]
              .overAllTaskStatus;
          }

          if (this.userSettings.dashboard[0].starUserTaskStatus) {
            starUserTaskStatus = this.userSettings.dashboard[0]
              .starUserTaskStatus;
          }

          this.overallSelectedItems = workStatuses.filter((item: any) => {
            if (overAllTaskStatus.includes(item.id)) {
              return item;
            }
          });

          this.starSelectedItems = workStatuses.filter((item: any) => {
            if (starUserTaskStatus.includes(item.id)) {
              return item;
            }
          });
        }
        this.workStatuses = resp.entity;
      })
      .catch((error: any) => {
        this.workStatuses = [];
      });
  }

  setKanbanUserPref() {
    let kanbanAllTaskStatus = [];
    this.kanbanSelectedItems.map((item: any) => {
      kanbanAllTaskStatus.push(item.id);
    });
    let settingsIn = {
      dataTableType: "Kanban",
      kanbanSettings: {
        workStatusIds: kanbanAllTaskStatus,
      },
    };

    if (AppConstants.KANBAN_USER_SETTINGS_ID) {
      this.kanbanUserSettings.kanbanSettings.workStatusIds = kanbanAllTaskStatus;
      this.dashboardService
        .updateUsersettings(
          AppConstants.KANBAN_USER_SETTINGS_ID,
          this.kanbanUserSettings
        )
        .toPromise()
        .then((resp: any) => {
          AppConstants.KANBAN_USER_SETTINGS_ID = resp.id;
          this.kanbanUserSettings = resp;
        })
        .catch((error: any) => {});
    } else {
      this.dashboardService
        .createUsersettings(settingsIn)
        .toPromise()
        .then((resp: any) => {
          AppConstants.KANBAN_USER_SETTINGS_ID = resp.id;
          this.kanbanUserSettings = resp;
        })
        .catch((error: any) => {});
    }
  }

  setUserPref() {
    let overAllTaskStatus = [];
    let starUserTaskStatus = [];
    this.overallSelectedItems.map((item: any) => {
      overAllTaskStatus.push(item.id);
    });
    this.starSelectedItems.map((item: any) => {
      starUserTaskStatus.push(item.id);
    });

    let settingsIn = {
      dataTableType: "Dashboard",
      dashboard: [
        {
          overAllTaskStatus,
          starUserTaskStatus,
        },
      ],
    };

    if (AppConstants.ARTIST_DASHBOARD_USER_SETTINGS_ID) {
      this.userSettings.dashboard[0].overAllTaskStatus = overAllTaskStatus;
      this.userSettings.dashboard[0].starUserTaskStatus = starUserTaskStatus;
      this.dashboardService
        .updateUsersettings(
          AppConstants.ARTIST_DASHBOARD_USER_SETTINGS_ID,
          this.userSettings
        )
        .toPromise()
        .then((resp: any) => {
          AppConstants.ARTIST_DASHBOARD_USER_SETTINGS_ID = resp.id;
          this.userSettings = resp;
          this.onSetUserPref();
        })
        .catch((error: any) => {});
    } else {
      this.dashboardService
        .createUsersettings(settingsIn)
        .toPromise()
        .then((resp: any) => {
          AppConstants.ARTIST_DASHBOARD_USER_SETTINGS_ID = resp.id;
          this.userSettings = resp.entity;
          this.onSetUserPref();
        })
        .catch((error: any) => {});
    }
  }

  async onSetUserPref() {
    //await this.getKanbanWorkstatus();
  }

  async getKanbanWorkstatus() {
    await this.workstatusService
      .getKanbanWorkstatus()
      .toPromise()
      .then((resp: any) => {
        this.workStatusesKanban = resp.entity;
        //this.kanbanSelectedItems = this.workStatusesKanban.slice(0, 5);
        //this.workStatusesKanban.length
        if (
          !this.kanbanUserSettings ||
          !this.kanbanUserSettings.kanbanSettings ||
          !this.kanbanUserSettings.kanbanSettings.workStatusIds
        ) {
          this.kanbanSelectedItems = this.workStatusesKanban.slice(0, 5);
          this.setKanbanUserPref();
        } else {
          let kanbanTaskStatus = [];
          if (this.kanbanUserSettings.kanbanSettings.workStatusIds) {
            kanbanTaskStatus = this.kanbanUserSettings.kanbanSettings
              .workStatusIds;
          }
          this.kanbanSelectedItems = this.workStatusesKanban.filter(
            (item: any) => {
              if (kanbanTaskStatus.includes(item.id)) {
                return item;
              }
            }
          );
        }
      })
      .catch((error: any) => {
        this.workStatusesKanban = [];
      });
  }

  showDashboard() {
    this.drawerTitle = "Artist Dashboard Settings";
    this.isDashboardVisible = true;
    this.isKanbanVisible = false;
  }

  async showKanban() {
    await this.getKanbanUserSettings();
    if (!this.helperService.isValidArr(this.workStatusesKanban)) {
      await this.getKanbanWorkstatus();
    }

    this.drawerTitle = "Kanban Settings";
    this.isDashboardVisible = false;
    this.isKanbanVisible = true;
  }

  showSettings() {
    this.openDashboardSettings();
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  openDashboardSettings(): void {
    this.childDrawerRef = this.drawerService.create<
      ArtistDbSettingsComponent,
      {
        workStatusesKanban: any;
        workStatuses: any;
        overallSelectedItems: any;
        starSelectedItems: any;
        kanbanSelectedItems: any;
        isDashboardVisible: any;
        startDate: any;
        endDate: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ArtistDbSettingsComponent,
      nzContentParams: {
        workStatusesKanban: this.workStatusesKanban,
        workStatuses: this.workStatuses,
        overallSelectedItems: this.overallSelectedItems,
        starSelectedItems: this.starSelectedItems,
        kanbanSelectedItems: this.kanbanSelectedItems,
        isDashboardVisible: this.isDashboardVisible,
        startDate: this.startDate,
        endDate: this.endDate,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        let overAllTaskStatus = null;
        let starUserTaskStatus = null;
        let kanbanTaskStatus = null;
        let isChanged = false;
        let result = JSON.parse(data);
        if (
          !this.helperService.isSameObject(
            this.overallSelectedItems,
            result.overallSelectedItems
          )
        ) {
          this.overallSelectedItems = result.overallSelectedItems;
          try {
            this.artistDashboardComponent.updateOverallStatus(
              this.overallSelectedItems
            );
          } catch (e) {}

          isChanged = true;
          overAllTaskStatus = [];
          this.overallSelectedItems.map((item: any) => {
            overAllTaskStatus.push(item.id);
          });
        }
        if (
          !this.helperService.isSameObject(
            this.starSelectedItems,
            result.starSelectedItems
          )
        ) {
          this.starSelectedItems = result.starSelectedItems;
          try {
            this.artistDashboardComponent.updateStarStatus(
              this.starSelectedItems
            );
          } catch (e) {}

          isChanged = true;
          starUserTaskStatus = [];
          this.starSelectedItems.map((item: any) => {
            starUserTaskStatus.push(item.id);
          });
        }

        if (
          !this.helperService.isSameObject(
            this.kanbanSelectedItems,
            result.kanbanSelectedItems
          )
        ) {
          this.kanbanSelectedItems = result.kanbanSelectedItems;
          try {
            this.kanbanChart.updateKanbanStatus(
              this.kanbanSelectedItems,
              this.startDate,
              this.endDate
            );
          } catch (e) {}
          isChanged = true;
          kanbanTaskStatus = [];
          this.kanbanSelectedItems.map((item: any) => {
            kanbanTaskStatus.push(item.id);
          });
        }

        if (
          this.startDate !== result.startDate ||
          this.endDate !== result.endDate
        ) {
          this.kanbanSelectedItems = result.kanbanSelectedItems;
          this.startDate = result.startDate;
          this.endDate = result.endDate;
          this.kanbanChart.updateKanbanStatus(
            this.kanbanSelectedItems,
            this.startDate,
            this.endDate
          );
        }

        if (isChanged) {
          if (kanbanTaskStatus) {
            this.kanbanUserSettings.kanbanSettings.workStatusIds = kanbanTaskStatus;
            /*let kanbanUserSettings = {
              dataTableType: "Kanban",
              kanbanSettings: {
                workStatusIds: kanbanTaskStatus,
              },
            };*/

            this.dashboardService
              .updateUsersettings(
                AppConstants.KANBAN_USER_SETTINGS_ID,
                this.kanbanUserSettings
              )
              .toPromise()
              .then((resp: any) => {
                this.kanbanUserSettings = resp;
              })
              .catch((error: any) => {});
          } else {
            if (overAllTaskStatus) {
              this.userSettings.dashboard[0].overAllTaskStatus = overAllTaskStatus;
            }
            if (starUserTaskStatus) {
              this.userSettings.dashboard[0].starUserTaskStatus = starUserTaskStatus;
            }
            this.dashboardService
              .updateUsersettings(
                AppConstants.ARTIST_DASHBOARD_USER_SETTINGS_ID,
                this.userSettings
              )
              .toPromise()
              .then((resp: any) => {
                this.userSettings = resp;
              })
              .catch((error: any) => {});
          }
        }
      }
    });
  }
}
