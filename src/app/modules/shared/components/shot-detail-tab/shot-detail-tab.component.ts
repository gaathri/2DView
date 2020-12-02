import { Component, OnInit, Input } from "@angular/core";
import { AppConstants } from "src/app/constants/AppConstants";
import { HelperService } from "src/app/modules/core/services/helper.service";

@Component({
  selector: "app-shot-detail-tab",
  templateUrl: "./shot-detail-tab.component.html",
  styleUrls: ["./shot-detail-tab.component.scss"],
})
export class ShotDetailTabComponent implements OnInit {
  @Input() shotIn: any;
  constructor(private helperService: HelperService) {}

  ngOnInit() {}

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }

  displayDate(dateStr) {
    if (dateStr) {
      return this.helperService.transformDate(new Date(dateStr));
    } else {
      return "";
    }
  }

  getProgress(shotIn) {
    if (shotIn && shotIn.completionPercentage) {
      return Number(shotIn.completionPercentage) + " %";
    }
    return "0 %";
  }
}
