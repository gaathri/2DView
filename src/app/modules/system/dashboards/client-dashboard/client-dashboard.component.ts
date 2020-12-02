import { Component, OnInit } from "@angular/core";
import { ShowsService } from "../../shows/shows.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-client-dashboard",
  templateUrl: "./client-dashboard.component.html",
  styleUrls: ["./client-dashboard.component.scss"],
})
export class ClientDashboardComponent implements OnInit {
  showList: any;
  shows: any;
  isEmptyData: boolean;
  constructor(
    private showsService: ShowsService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.getShowList();
  }

  getShowList() {
    this.showsService.getShowListByClient().subscribe(
      (resp) => {
        //this.showList = resp;
        /*this.showList = [
          {
            id: 295,
            showName:
              "Golf wf2_sequ_asset_task Show 2020_01_13 17_28_37.870027",
            thumbnail: "",
            hasTask: false,
            approvedPercentage: 0,
          },
          {
            id: 298,
            showName: "Jan20-Show-Dev",
            thumbnail: "",
            showStartDate: "2019-07-12 00:00:00",
            showEndDate: "2019-12-20 00:00:00",
            daysLeft: 1098768,
            hasTask: false,
            revisionStatusCount: [
              {
                status: "PENDING",
                count: 2,
              },
              {
                status: "APPROVED",
                count: 1,
              },
            ],
            approvedPercentage: 33.33,
          },
        ];
        this.shows = this.showList;*/
        if (resp && resp.valid && resp.entity && resp.entity.length > 0) {
          this.showList = resp.entity;
          this.shows = this.showList;
        } else {
          this.onDataError(resp);
        }
      },
      (error) => {
        this.onDataError(error);
      }
    );
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  getCompletedCount(show: any) {
    let key1 = "status";
    let key2 = "count";
    let value1 = "COMPLETED";
    return this.getStatusCount(show.revisionStatusCount, key1, value1, key2);
  }

  getPendingCount(show: any) {
    let key1 = "status";
    let key2 = "count";
    let value1 = "PENDING";
    return this.getStatusCount(show.revisionStatusCount, key1, value1, key2);
  }

  getApprovedCount(show: any) {
    let key1 = "status";
    let key2 = "count";
    let value1 = "APPROVED";
    return this.getStatusCount(show.revisionStatusCount, key1, value1, key2);
  }

  getRejectedCount(show: any) {
    let key1 = "status";
    let key2 = "count";
    let value1 = "REJECTED";
    return this.getStatusCount(show.revisionStatusCount, key1, value1, key2);
  }

  getStatusCount(objArr: any, key1: any, value1: any, key2: any) {
    if (objArr && objArr.length > 0) {
      return this.helperService.getValueInObject(objArr, key1, value1, key2);
    }
    return "0";
  }

  getPercent(show: any) {
    if (show && show.completedPercentage) {
      //return Math.floor(show.completedPercentage);
      return show.completedPercentage;
    }
    return 0;
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }
}
