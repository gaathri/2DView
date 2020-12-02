import { Component, OnInit, Input } from "@angular/core";
import { StudioDashboardService } from "src/app/modules/system/dashboards/studio-dashboard.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-progress-panel",
  templateUrl: "./progress-panel.component.html",
  styleUrls: ["./progress-panel.component.scss"],
})
export class ProgressPanelComponent implements OnInit {
  @Input() progressEntities: any;
  @Input() assetProgressEntities: any;
  @Input() taskProgressEntities: any;
  @Input() isStudio: boolean;
  @Input() progressType: any = "shot";

  displayNames = {
    "Not Started": "Offline",
    "On hold": "On Hold",
    WIP: "In Progress",
    "Need Assistance": "Need Assistance",
    Completed: "Completed",
  };

  selected = "shot";
  selectedEntities: any;
  userSettings: any;

  constructor(private dashboardService: StudioDashboardService) {}

  ngOnInit() {
    if (this.isStudio) {
      this.onEntityClick(this.progressType, false);
    } else {
      this.selectedEntities = this.progressEntities;
    }
  }

  getTitle(item: any) {
    return this.getDisplayName(item.name);
  }
  getValue(item: any) {
    return item.value;
  }
  getPercent(item: any) {
    return Math.round(item.per);
  }
  getTextColor(item: any) {
    return item.code;
  }
  getDisplayName(key: any) {
    return key;
    return this.displayNames[key];
  }

  getProgressConfig(item: any) {
    return {
      showInfo: true,
      type: "circle",
      strokeLinecap: "square",
      strokeWidth: 8,
      strokeColor: item.code,
    };
  }

  onEntityClick(entity: any, isSave: boolean) {
    this.selected = entity;
    if (entity === "shot") {
      this.selectedEntities = this.progressEntities;
    } else if (entity === "asset") {
      this.selectedEntities = this.assetProgressEntities;
    } else if (entity === "task") {
      this.selectedEntities = this.taskProgressEntities;
    }
    if (isSave) {
      this.saveSettings();
    }
  }
  isActive(entity: any) {
    return this.selected == entity;
  }

  async saveSettings() {
    await this.getUserSettings();
    this.userSettings.dashboard[0].progressType = this.selected;
    this.updateUserSettings();
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

  updateUserSettings() {
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
