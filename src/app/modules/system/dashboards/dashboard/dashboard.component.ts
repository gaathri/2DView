import { Component, OnInit } from "@angular/core";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { Router } from "@angular/router";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  dashboardType: any;
  constructor(private helperService: HelperService, private router: Router) {}

  ngOnInit() {
    this.dashboardType = this.setDashboardType();
  }
  setDashboardType() {
    let dashboardType = "default"; //artist //studio
    let privilegeId = this.helperService.getPrivilegeId();
    switch (privilegeId) {
      case AppConstants.ADMIN_PRIVILEGE_ID:
        dashboardType = "admin";
        break;
      case AppConstants.ARTIST_PRIVILEGE_ID:
        dashboardType = "artist";
        break;
      case AppConstants.CLIENT_PRIVILEGE_ID:
        dashboardType = "client";
        break;
      case AppConstants.PRODUCER_PRIVILEGE_ID:
      case AppConstants.SUPERVISOR_PRIVILEGE_ID:
      case AppConstants.IO_PRIVILEGE_ID:
      case AppConstants.HOS_PRIVILEGE_ID:
        dashboardType = "studio";
        break;
      case AppConstants.HR_PRIVILEGE_ID:
        dashboardType = "hr";
        break;
    }

    if (dashboardType === "") {
    } else {
      return dashboardType;
    }
  }
}
