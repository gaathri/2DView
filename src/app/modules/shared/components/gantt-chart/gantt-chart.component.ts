import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Input,
  TemplateRef,
} from "@angular/core";

import { TasksService } from "src/app/modules/system/shows/tasks.service";
import { TasktypesService } from "src/app/modules/system/configs/tasktypes.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { Router } from "@angular/router";
import { ShowsService } from "src/app/modules/system/shows/shows.service";
import { ShotsService } from "src/app/modules/system/shows/shots.service";
import { AssetsService } from "src/app/modules/system/shows/assets.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { PeopleGanttComponent } from "../people-gantt/people-gantt.component";
import { ShowGanttComponent } from "../show-gantt/show-gantt.component";
import { GanttFilterSettingsComponent } from "src/app/modules/system/modals/gantt-filter-settings/gantt-filter-settings.component";
import { NzDrawerService } from "ng-zorro-antd";

@Component({
  selector: "app-gantt-chart",
  templateUrl: "./gantt-chart.component.html",
  styleUrls: ["./gantt-chart.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class GanttChartComponent implements OnInit {
  @ViewChild(PeopleGanttComponent, { static: false })
  peopleGantt: PeopleGanttComponent;
  @ViewChild(ShowGanttComponent, { static: false })
  showGantt: ShowGanttComponent;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;

  isEmptyData: boolean;
  shows: any;
  showId: any;
  shots: any;
  shotIds: any;
  assets: any;
  assetIds: any;
  isDataReady;
  drawerTitle: any;
  isFilterApplied: boolean;
  childDrawerRef: any;
  taskFilters: any;
  disabled = false;
  period: any = "day";
  gtype: any = "show";
  type: any = "shot";
  value1 = 100;
  value2 = 20;

  constructor(
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private assetsService: AssetsService,
    private tasksService: TasksService,
    private tasktypeService: TasktypesService,
    private router: Router,
    private helperService: HelperService,
    private notificationService: NotificationService,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  onSlider(e) {
    if (this.gtype === "show") {
      if (this.showGantt) {
        this.showGantt.onSlider(e);
      }
    } else if (this.gtype === "people") {
      if (this.peopleGantt) {
        this.peopleGantt.onSlider(e);
      }
    }
  }

  onZoomSlider(e) {
    if (this.gtype === "show") {
      if (this.showGantt) {
        this.showGantt.onZoomSlider(e);
      }
    } else if (this.gtype === "people") {
      if (this.peopleGantt) {
        this.peopleGantt.onZoomSlider(e);
      }
    }
  }

  onPeriodChange(e) {
    if (this.gtype === "show") {
      if (this.showGantt) {
        this.showGantt.onPeriodChange(e);
      }
    } else if (this.gtype === "people") {
      if (this.peopleGantt) {
        this.peopleGantt.onPeriodChange(e);
      }
    }
  }

  radioChangeHandler(e) {
    this.period = "day";
    this.type = e;
    if (this.showGantt) {
      this.showGantt.radioChangeHandler(e);
    }
  }

  radioChangeHandler2(e) {
    this.value1 = 100;
    this.period = "day";
    //this.type = "shot";
  }

  //---[Changes Hariharan]---//
  async prepareData() {
    this.setFilters();
    this.isDataReady = true;
  }
  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  filterHandler() {
    this.drawerTitle = "Filter Settings";
    this.openFilterSettingsForm();
  }

  openFilterSettingsForm(): void {
    this.childDrawerRef = this.drawerService.create<
      GanttFilterSettingsComponent,
      {
        type: any;
        filters: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: GanttFilterSettingsComponent,
      nzContentParams: {
        type: this.type,
        filters: this.taskFilters,
      },
      nzClosable: false,
      nzWidth: "40%",
      nzWrapClassName: "modal-wrapper",
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((data) => {
      if (data) {
        if (JSON.stringify(this.taskFilters) !== JSON.stringify(data)) {
          this.taskFilters = data;
          let filterParams = this.getFilterParams();
          this.isFilterApplied = false;
          let params = ""; //"shotIds=19&showId=2";
          if (filterParams !== "") {
            this.isFilterApplied = true;
            params += `${filterParams}`;
          }
          this.showGantt.submitHandler(this.type, filterParams);
        } else {
        }
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  setFilters() {
    this.taskFilters = {
      showId: null,
      shotIds: [],
      assetIds: [],
      workStatusIds: [],
    };
  }

  getFilterParams() {
    let filterParams = "";
    for (let i in this.taskFilters) {
      let item = this.taskFilters[i];
      if (item && item.length > 0) {
        if (filterParams != "") {
          filterParams += "&";
        }
        filterParams += `${i}=${item.toString()}`;
      }
    }

    if (this.taskFilters.showId) {
      if (filterParams != "") {
        filterParams += "&";
      }
      filterParams += `showId=${this.taskFilters.showId}`;
    }

    return filterParams;
  }

  //---[Changes Hariharan]---//
}
