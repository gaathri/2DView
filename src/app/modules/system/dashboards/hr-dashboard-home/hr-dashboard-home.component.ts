import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-hr-dashboard-home",
  templateUrl: "./hr-dashboard-home.component.html",
  styleUrls: ["./hr-dashboard-home.component.scss"],
})
export class HrDashboardHomeComponent implements OnInit {
  isDashboardVisible: boolean;

  constructor() {}

  ngOnInit() {
    this.isDashboardVisible = true;
  }
}
