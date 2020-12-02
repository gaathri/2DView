import { Component,ViewEncapsulation } from "@angular/core";
import { Spinkit } from "ng-http-loader";
import { LoaderComponent } from "./modules/shared/components/loader/loader.component";
import { AppConstants } from "./constants/AppConstants";
import { AdminDashboardService } from "./modules/system/dashboards/admin-dashboard.service";
import { environment } from "src/environments/environment";
import { HelperService } from "./modules/core/services/helper.service";
//import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public spinkit = Spinkit;
  public loaderComponent = LoaderComponent;
  isCollapsed = false;
  studioOut;
  public constructor(
    private adminDashboardService: AdminDashboardService,
    private helperService: HelperService
  ) {
    //this.helperService.setFavicon();
  }

  async getStudio(id: any) {
    await this.adminDashboardService
      .getStudio(id)
      .toPromise()
      .then((resp) => {
        this.studioOut = resp.entity;
        if (this.studioOut && this.studioOut.studioLogo) {
          if (this.studioOut.studioFav) {
            //setFavicon(this.studioOut.studioFav);
          }
        }
      })
      .catch((error) => {
        this.studioOut = null;
      });
  }

  /*public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }*/
}
