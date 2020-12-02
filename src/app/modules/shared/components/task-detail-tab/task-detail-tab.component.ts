import { Component, OnInit, Input } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { Role } from "../../model/role";
import { ShowsService } from "src/app/modules/system/shows/shows.service";

@Component({
  selector: "app-task-detail-tab",
  templateUrl: "./task-detail-tab.component.html",
  styleUrls: ["./task-detail-tab.component.scss"],
})
export class TaskDetailTabComponent implements OnInit {
  @Input() showName: any;
  @Input() shotIn: any;
  @Input() assetIn: any;
  @Input() taskIn: any;
  @Input() taskInfo: any = {};

  taskColumns: any;
  isDataReady: boolean;

  constructor(
    private helperService: HelperService,
    private showsService: ShowsService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  async prepareData() {
    await this.getTaskColumnList();
    this.isDataReady = true;
  }

  hasViewPermission(column: any) {
    let permission = false;
    let columnInfo = this.helperService.findObjectInArrayByKey(
      this.taskColumns,
      "name",
      column
    );
    if (columnInfo) {
      permission = true;
    }
    return permission;
  }

  async getTaskColumnList() {
    let params = `?entityId=${this.taskIn.showId}`;
    await this.showsService
      .getTaskColumnList(params)
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity && resp.entity.fields) {
          this.taskColumns = resp.entity.fields;
        }
      })
      .catch((error: any) => {
        this.taskColumns = null;
      });
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }

  isSubTask(taskIn) {
    if (taskIn && taskIn.isSubTask === 1) {
      return "Yes";
    }
    return "No";
  }
  getProgress(taskIn) {
    if (taskIn && taskIn.completionPercentage) {
      return Number(taskIn.completionPercentage) + " %";
    }
    return "0 %";
  }
}
