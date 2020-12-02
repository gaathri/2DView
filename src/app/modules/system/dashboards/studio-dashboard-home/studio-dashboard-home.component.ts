import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { StudioDashboardComponent } from "../studio-dashboard/studio-dashboard.component";
import { NzDrawerService } from "ng-zorro-antd";
import { WorkstatusService } from "../../configs/workstatus.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { StudioDbSettingsComponent } from "../../modals/studio-db-settings/studio-db-settings.component";
import { StudioDashboardService } from "src/app/modules/system/dashboards/studio-dashboard.service";
import { DepartmentsService } from "../../configs/departments.service";

@Component({
  selector: "app-studio-dashboard-home",
  templateUrl: "./studio-dashboard-home.component.html",
  styleUrls: ["./studio-dashboard-home.component.scss"],
})
export class StudioDashboardHomeComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild(StudioDashboardComponent, { static: false })
  studioDashboardComponent: StudioDashboardComponent;

  isDashboardVisible: boolean;
  isDaybookVisible: boolean;
  drawerTitle: any;
  childDrawerRef: any;
  statuses: any;
  allWorkStatuses: any;

  overallSelectedItems: any;
  overallAssetSelectedItems: any;
  overallTaskSelectedItems: any;
  starSelectedItems: any;
  starUserSelectedItems: any;
  userSettings: any;
  departments: any;
  progressType: any;

  constructor(
    private drawerService: NzDrawerService,
    private showsService: ShowsService,
    private workstatusService: WorkstatusService,
    private dashboardService: StudioDashboardService,
    private departmentsService: DepartmentsService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.drawerTitle = "Studio Dashboard Settings";
    this.prepareData();
    this.showDashboard();
    //this.showDaybook();
    //this.getStatuses();
  }
  async prepareData() {
    await this.getUserSettings();
    if (!this.userSettings) {
      await this.getDepartments();
    }
    await this.getWorkstatusList();
    await this.getStatuses();
  }

  async getDepartments() {
    await this.departmentsService
      .getDepartmentListSearch()
      .toPromise()
      .then((resp: any) => {
        this.departments = resp.entity;
      })
      .catch((error: any) => {
        this.departments = [];
      });
  }

  async getUserSettings() {
    await this.dashboardService
      .getUsersettings()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          AppConstants.STUDIO_DASHBOARD_USER_SETTINGS_ID = resp.entity.id;
          this.userSettings = resp.entity;
        }
      })
      .catch((error: any) => {
        this.userSettings = null;
      });
  }

  async getWorkstatusList() {
    await this.workstatusService
      .getWorkstatusByRole()
      .toPromise()
      .then((resp: any) => {
        this.allWorkStatuses = resp.entity;
      })
      .catch((error: any) => {
        this.allWorkStatuses = [];
      });
  }

  async getStatuses() {
    await this.showsService
      .getAllStatusNew()
      .toPromise()
      .then((resp: any) => {
        let statuses = resp.entity;
        if (!this.userSettings) {
          this.overallSelectedItems = statuses.slice(0, 5);
          this.overallAssetSelectedItems = statuses.slice(0, 5);
          this.overallTaskSelectedItems = this.allWorkStatuses.slice(0, 5);
          this.starSelectedItems = statuses.slice(0, 4);
          this.starUserSelectedItems = statuses.slice(0, 2);
          this.setUserPref();
        } else {
          let overAllShotStatusIds = [];
          let overAllAssetStatusIds = [];
          let overAllTaskStatus = [];
          let starShowShotStatusIds = [];
          let starUserShotStatusIds = [];
          this.progressType = this.userSettings.dashboard[0].progressType;
          if (this.userSettings.dashboard[0].overAllShotStatusIds) {
            overAllShotStatusIds = this.userSettings.dashboard[0]
              .overAllShotStatusIds;
          }

          if (this.userSettings.dashboard[0].overAllAssetStatusIds) {
            overAllAssetStatusIds = this.userSettings.dashboard[0]
              .overAllAssetStatusIds;
          }

          if (this.userSettings.dashboard[0].overAllTaskStatus) {
            overAllTaskStatus = this.userSettings.dashboard[0]
              .overAllTaskStatus;
          }

          if (this.userSettings.dashboard[0].starShowShotStatusIds) {
            starShowShotStatusIds = this.userSettings.dashboard[0]
              .starShowShotStatusIds;
          }

          if (this.userSettings.dashboard[0].starUserShotStatusIds) {
            starUserShotStatusIds = this.userSettings.dashboard[0]
              .starUserShotStatusIds;
          }

          this.overallSelectedItems = statuses.filter((item: any) => {
            if (overAllShotStatusIds.includes(item.id)) {
              return item;
            }
          });

          this.overallAssetSelectedItems = statuses.filter((item: any) => {
            if (overAllAssetStatusIds.includes(item.id)) {
              return item;
            }
          });

          this.overallTaskSelectedItems = this.allWorkStatuses.filter(
            (item: any) => {
              if (overAllTaskStatus.includes(item.id)) {
                return item;
              }
            }
          );

          this.starSelectedItems = statuses.filter((item: any) => {
            if (starShowShotStatusIds.includes(item.id)) {
              return item;
            }
          });

          this.starUserSelectedItems = statuses.filter((item: any) => {
            if (starUserShotStatusIds.includes(item.id)) {
              return item;
            }
          });
        }
        //this.addColorCodes(statuses);
        this.statuses = resp.entity;
      })
      .catch((error: any) => {
        this.statuses = [];
      });
  }

  setUserPref() {
    let overAllShotStatusIds = [];
    let overAllAssetStatusIds = [];
    let overAllTaskStatus = [];
    let starShowShotStatusIds = [];
    let starUserShotStatusIds = [];

    this.overallSelectedItems.map((item: any) => {
      overAllShotStatusIds.push(item.id);
    });

    this.overallAssetSelectedItems.map((item: any) => {
      overAllAssetStatusIds.push(item.id);
    });

    this.overallTaskSelectedItems.map((item: any) => {
      overAllTaskStatus.push(item.id);
    });

    this.starSelectedItems.map((item: any) => {
      starShowShotStatusIds.push(item.id);
    });
    this.starUserSelectedItems.map((item: any) => {
      starUserShotStatusIds.push(item.id);
    });

    this.progressType = "task";

    let settingsIn = {
      dataTableType: "Dashboard",
      dashboard: [
        {
          dateRangeTypeId: 1,
          departmentIds: [this.departments[0].id],
          overAllShotStatusIds,
          overAllAssetStatusIds,
          starShowShotStatusIds,
          overAllTaskStatus,
          starUserShotStatusIds,
          progressType: this.progressType,
        },
      ],
    };

    // if (AppConstants.STUDIO_DASHBOARD_USER_SETTINGS_ID) {
    //   this.dashboardService
    //     .updateUsersettings(AppConstants.STUDIO_DASHBOARD_USER_SETTINGS_ID, settingsIn)
    //     .toPromise()
    //     .then((resp: any) => {
    //       AppConstants.STUDIO_DASHBOARD_USER_SETTINGS_ID = resp.id;
    //       this.userSettings = resp.entity;
    //     })
    //     .catch((error: any) => {
    //
    //     });
    // } else {

    // }
    this.dashboardService
      .createUsersettings(settingsIn)
      .toPromise()
      .then((resp: any) => {
        AppConstants.STUDIO_DASHBOARD_USER_SETTINGS_ID = resp.id;
        this.getUserSettings();
      })
      .catch((error: any) => {});
  }

  addColorCodes(statuses: any) {
    let colorCodes = AppConstants.SHOT_STATUS_CODES;
    statuses.map((item: any) => {
      item.code = colorCodes[item.value];
      return item;
    });
  }

  showDashboard() {
    this.isDashboardVisible = true;
    this.isDaybookVisible = false;
  }
  showDaybook() {
    this.isDashboardVisible = false;
    this.isDaybookVisible = true;
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
      StudioDbSettingsComponent,
      {
        statuses: any;
        allWorkStatuses: any;
        overallSelectedItems: any;
        overallAssetSelectedItems: any;
        overallTaskSelectedItems: any;
        starSelectedItems: any;
        starUserSelectedItems: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: StudioDbSettingsComponent,
      nzContentParams: {
        statuses: this.statuses,
        allWorkStatuses: this.allWorkStatuses,
        overallSelectedItems: this.overallSelectedItems,
        overallAssetSelectedItems: this.overallAssetSelectedItems,
        overallTaskSelectedItems: this.overallTaskSelectedItems,
        starSelectedItems: this.starSelectedItems,
        starUserSelectedItems: this.starUserSelectedItems,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        let overAllShotStatusIds = null;
        let overAllAssetStatusIds = null;
        let overAllTaskStatus = null;
        let starShowShotStatusIds = null;
        let starUserShotStatusIds = null;
        let isChanged = false;
        let result = JSON.parse(data);
        if (
          !this.helperService.isSameObject(
            this.overallSelectedItems,
            result.overallSelectedItems
          )
        ) {
          this.overallSelectedItems = result.overallSelectedItems;
          this.studioDashboardComponent.updateOverallStatus(
            this.overallSelectedItems
          );

          isChanged = true;
          overAllShotStatusIds = [];
          try {
            this.overallSelectedItems.map((item: any) => {
              overAllShotStatusIds.push(item.id);
            });
          } catch (e) {}
        }

        if (
          !this.helperService.isSameObject(
            this.overallAssetSelectedItems,
            result.overallAssetSelectedItems
          )
        ) {
          this.overallAssetSelectedItems = result.overallAssetSelectedItems;
          this.studioDashboardComponent.updateOverallAssetStatus(
            this.overallAssetSelectedItems
          );

          isChanged = true;
          overAllAssetStatusIds = [];
          try {
            this.overallAssetSelectedItems.map((item: any) => {
              overAllAssetStatusIds.push(item.id);
            });
          } catch (e) {}
        }

        if (
          !this.helperService.isSameObject(
            this.overallTaskSelectedItems,
            result.overallTaskSelectedItems
          )
        ) {
          this.overallTaskSelectedItems = result.overallTaskSelectedItems;
          this.studioDashboardComponent.updateOverallTaskStatus(
            this.overallTaskSelectedItems
          );

          isChanged = true;
          overAllTaskStatus = [];
          try {
            this.overallTaskSelectedItems.map((item: any) => {
              overAllTaskStatus.push(item.id);
            });
          } catch (e) {}
        }

        if (
          !this.helperService.isSameObject(
            this.starSelectedItems,
            result.starSelectedItems
          )
        ) {
          this.starSelectedItems = result.starSelectedItems;
          try {
            this.studioDashboardComponent.updateStarStatus(
              this.starSelectedItems
            );
          } catch (e) {}

          isChanged = true;
          starShowShotStatusIds = [];
          this.starSelectedItems.map((item: any) => {
            starShowShotStatusIds.push(item.id);
          });
        }

        if (
          !this.helperService.isSameObject(
            this.starUserSelectedItems,
            result.starUserSelectedItems
          )
        ) {
          this.starUserSelectedItems = result.starUserSelectedItems;
          try {
            this.studioDashboardComponent.updateStarUserStatus(
              this.starUserSelectedItems
            );
          } catch (e) {}

          isChanged = true;
          starUserShotStatusIds = [];
          this.starUserSelectedItems.map((item: any) => {
            starUserShotStatusIds.push(item.id);
          });
        }
        if (isChanged) {
          this.saveSettings(
            overAllShotStatusIds,
            overAllAssetStatusIds,
            overAllTaskStatus,
            starShowShotStatusIds,
            starUserShotStatusIds
          );
        }
      }
    });
  }

  async saveSettings(
    overAllShotStatusIds,
    overAllAssetStatusIds,
    overAllTaskStatus,
    starShowShotStatusIds,
    starUserShotStatusIds
  ) {
    await this.getUserSettings();

    if (overAllShotStatusIds) {
      this.userSettings.dashboard[0].overAllShotStatusIds = overAllShotStatusIds;
    }
    if (overAllAssetStatusIds) {
      this.userSettings.dashboard[0].overAllAssetStatusIds = overAllAssetStatusIds;
    }
    if (overAllTaskStatus) {
      this.userSettings.dashboard[0].overAllTaskStatus = overAllTaskStatus;
    }
    if (starShowShotStatusIds) {
      this.userSettings.dashboard[0].starShowShotStatusIds = starShowShotStatusIds;
    }
    if (starUserShotStatusIds) {
      this.userSettings.dashboard[0].starUserShotStatusIds = starUserShotStatusIds;
    }
    this.dashboardService
      .updateUsersettings(
        AppConstants.STUDIO_DASHBOARD_USER_SETTINGS_ID,
        this.userSettings
      )
      .toPromise()
      .then((resp: any) => {
        this.userSettings = resp;
      })
      .catch((error: any) => {});
  }
}
