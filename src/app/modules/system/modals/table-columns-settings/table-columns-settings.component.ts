import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd/drawer";
import { AppConstants } from "src/app/constants/AppConstants";
import { ShotsService } from "../../shows/shots.service";
import { TasksService } from "../../shows/tasks.service";
import { AssetsService } from "../../shows/assets.service";
import { DaybookService } from "../../dashboards/daybook.service";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-table-columns-settings",
  templateUrl: "./table-columns-settings.component.html",
  styleUrls: ["./table-columns-settings.component.scss"],
})
export class TableColumnsSettingsComponent implements OnInit {
  @Input() entity: any;
  @Input() tableColumnsArr: any;
  @Input() selectedTableColumns: any;
  @Input() type: any;
  @Input() dateTypeId: any;

  tableColumnsArrCopy: any;
  selectedTableColumnsCopy: any;
  radioValue: any;
  selectAll: boolean;
  constructor(
    private shotsService: ShotsService,
    private tasksService: TasksService,
    private assetsService: AssetsService,
    private daybookService: DaybookService,
    private helperService: HelperService,
    private drawerRef: NzDrawerRef<string>
  ) {}

  ngOnInit() {
    this.selectedTableColumnsCopy = JSON.parse(
      JSON.stringify(this.selectedTableColumns)
    );

    this.tableColumnsArrCopy = JSON.parse(JSON.stringify(this.tableColumnsArr));
    /*if (this.type && this.type === "asset") {
      this.tableColumns = this.tableColumns.filter((item) => {
        return item.name != "shotCode";
      });
    }*/
  }

  allChangeHandler(e) {
    /*if (e) {
      this.selectedTableColumns = this.tableColumns;
    } else {
      this.selectedTableColumns = this.selectedTableColumnsCopy;
    }*/
  }

  changeHandler(e, i) {
    for (let j = 0; j < this.tableColumnsArrCopy[i].fields.length; j++) {
      let field = this.tableColumnsArrCopy[i].fields[j];
      if (this.isPresent(e, field)) {
        field.defaultDisplay = true;
      } else {
        field.defaultDisplay = false;
      }
    }
  }

  isPresent(parent, child) {
    let present = false;
    for (let i = 0; i < parent.length; i++) {
      if (child.name == parent[i].name) {
        present = true;
        break;
      }
    }
    return present;
  }

  displayCheckAll(arr: any) {
    if (this.helperService.isValidArr(arr) && arr.length > 1) {
      return true;
    }
    return false;
  }

  isAllChecked(index) {
    let allChecked = true;
    for (let i = 0; i < this.tableColumnsArrCopy[index].fields.length; i++) {
      if (!this.tableColumnsArrCopy[index].fields[i].defaultDisplay) {
        allChecked = false;
        break;
      }
    }
    return allChecked;
  }

  updateAllChecked(flag, index) {
    for (let i = 0; i < this.tableColumnsArrCopy[index].fields.length; i++) {
      this.tableColumnsArrCopy[index].fields[i].defaultDisplay = flag;
    }
  }

  isChecked(column, i, j) {
    return this.tableColumnsArrCopy[i].fields[j].defaultDisplay;
    /*let obj = this.selectedTableColumns.find(
      (data) => data.name === column.name
    );
    if (obj) {
      return true;
    } else {
      return false;
    }*/
  }

  clickHandler() {
    if (
      JSON.stringify(this.tableColumnsArr) !==
      JSON.stringify(this.tableColumnsArrCopy)
    ) {
      let columns = [];
      let count = 1;
      for (let i = 0; i < this.tableColumnsArrCopy.length; i++) {
        for (let j = 0; j < this.tableColumnsArrCopy[i].fields.length; j++) {
          let item = this.tableColumnsArrCopy[i].fields[j];
          if (item.defaultDisplay) {
            columns.push({
              indexId: count++,
              columnName: item.name,
            });
          }
        }
      }
      if (this.entity === "SHOT") {
        let settingsIn = {
          dataTableType: "shot",
          columns: columns,
        };

        if (AppConstants.SHOT_USER_SETTINGS_ID) {
          this.shotsService
            .updateUsersettings(AppConstants.SHOT_USER_SETTINGS_ID, settingsIn)
            .toPromise()
            .then((resp: any) => {})
            .catch((error: any) => {});
        } else {
          this.shotsService
            .createUsersettings(settingsIn)
            .toPromise()
            .then((resp: any) => {
              AppConstants.SHOT_USER_SETTINGS_ID = resp.id;
            })
            .catch((error: any) => {});
        }
      } else if (this.entity === "TASK") {
        let settingsIn = {
          dataTableType: "task",
          columns: columns,
        };

        if (AppConstants.TASK_USER_SETTINGS_ID) {
          this.tasksService
            .updateUsersettings(AppConstants.TASK_USER_SETTINGS_ID, settingsIn)
            .toPromise()
            .then((resp: any) => {})
            .catch((error: any) => {});
        } else {
          this.tasksService
            .createUsersettings(settingsIn)
            .toPromise()
            .then((resp: any) => {
              AppConstants.TASK_USER_SETTINGS_ID = resp.id;
            })
            .catch((error: any) => {});
        }
      } else if (this.entity === "ASSET") {
        let settingsIn = {
          dataTableType: "asset",
          columns: columns,
        };

        if (AppConstants.ASSET_USER_SETTINGS_ID) {
          this.assetsService
            .updateUsersettings(AppConstants.ASSET_USER_SETTINGS_ID, settingsIn)
            .toPromise()
            .then((resp: any) => {})
            .catch((error: any) => {});
        } else {
          this.assetsService
            .createUsersettings(settingsIn)
            .toPromise()
            .then((resp: any) => {
              AppConstants.ASSET_USER_SETTINGS_ID = resp.id;
            })
            .catch((error: any) => {});
        }
      } else if (this.entity === "DAYBOOK") {
        /*let settingsIn = {
          dataTableType: "daybook",
          columns: columns,
        };*/

        let settingsIn = {
          dataTableType: "Daybook",
          dayBookSettings: {
            columns: columns,
            dateRangeType: this.dateTypeId,
          },
        };

        if (AppConstants.DAYBOOK_USER_SETTINGS_ID) {
          this.daybookService
            .updateUsersettings(
              AppConstants.DAYBOOK_USER_SETTINGS_ID,
              settingsIn
            )
            .toPromise()
            .then((resp: any) => {})
            .catch((error: any) => {});
        } else {
          this.daybookService
            .createUsersettings(settingsIn)
            .toPromise()
            .then((resp: any) => {
              AppConstants.DAYBOOK_USER_SETTINGS_ID = resp.id;
            })
            .catch((error: any) => {});
        }
      }
    }
    this.drawerRef.close(this.tableColumnsArrCopy);
  }

  clickHandlerOld() {
    if (
      JSON.stringify(this.selectedTableColumns) !==
      JSON.stringify(this.selectedTableColumnsCopy)
    ) {
      let columnNames = this.selectedTableColumns.map((item: any) => {
        return item.name;
      });

      if (this.entity === "SHOT") {
        let settingsIn = {
          dataTableType: "shot",
          columns: columnNames,
        };

        if (AppConstants.SHOT_USER_SETTINGS_ID) {
          this.shotsService
            .updateUsersettings(AppConstants.SHOT_USER_SETTINGS_ID, settingsIn)
            .toPromise()
            .then((resp: any) => {})
            .catch((error: any) => {});
        } else {
          this.shotsService
            .createUsersettings(settingsIn)
            .toPromise()
            .then((resp: any) => {
              AppConstants.SHOT_USER_SETTINGS_ID = resp.id;
            })
            .catch((error: any) => {});
        }
      } else if (this.entity === "TASK") {
        let settingsIn = {
          dataTableType: "task",
          columns: columnNames,
        };

        if (AppConstants.TASK_USER_SETTINGS_ID) {
          this.tasksService
            .updateUsersettings(AppConstants.TASK_USER_SETTINGS_ID, settingsIn)
            .toPromise()
            .then((resp: any) => {})
            .catch((error: any) => {});
        } else {
          this.tasksService
            .createUsersettings(settingsIn)
            .toPromise()
            .then((resp: any) => {
              AppConstants.TASK_USER_SETTINGS_ID = resp.id;
            })
            .catch((error: any) => {});
        }
      }
    }
    this.drawerRef.close(this.selectedTableColumns);
  }
}
