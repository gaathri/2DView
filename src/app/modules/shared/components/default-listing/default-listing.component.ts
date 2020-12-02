import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Router } from "@angular/router";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd/drawer";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { HomeService } from "src/app/modules/system/home.service";
//import { AddNewComponent } from "../modals/add-new/add-new.component";
//import { InteractionService } from "../../core/services/interaction.service";
//import { Subscription } from "rxjs";
//import { HelperService } from "../../core/services/helper.service";

@Component({
  selector: "app-default-listing",
  templateUrl: "./default-listing.component.html",
  styleUrls: ["./default-listing.component.scss"],
})
export class DefaultListingComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  drawerRef: any;
  listArr: any;
  iconDefaultColor = "white";
  isDataReady: boolean;
  listMenu: any;
  isReportAvailable: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private drawerService: NzDrawerService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.prepareData();
  }

  async prepareData() {
    await this.reportCheck();
    await this.getListMenu();
    this.generateList();
    this.isDataReady = true;
  }

  async reportCheck() {
    this.isReportAvailable = false;
    await this.homeService
      .reportCheck()
      .toPromise()
      .then((resp) => {
        if (this.helperService.isValidArr(resp.entity)) {
          this.isReportAvailable = true;
        }
      })
      .catch((error) => {});
  }

  async getListMenu() {
    await this.homeService
      .getListMenu()
      .toPromise()
      .then((resp) => {
        this.listMenu = resp.entity;
        if (this.isReportAvailable) {
          let reportMenu = {
            id: 129,
            actionName: "Report",
            actionDesc: "Report",
          };
          this.listMenu = [...this.listMenu, reportMenu];
        }
      })
      .catch((error) => {
        this.listMenu = null;
      });
  }

  getList() {
    return this.listArr.filter((item) => item.link);
  }

  generateList() {
    this.listArr = this.listMenu.map((item: any) => {
      item.name = item.actionName;
      item.type = item.actionName.toLowerCase().split(" ").join("");
      item.icon = this.helperService.getIcon(item.type);
      item.link = this.helperService.getLink(item.type);
      return item;
    });
    /*this.listArr.push({
      name: "Add New",
      icon: "add_circle_outline",
      iconColor: "gray",
      link: "/add-new",
    });*/
  }
  clickHandler = (item: any) => {
    //let routerLink = this.router.url + "/listing/" + item.link;
    let routerLink = "/system/listing" + item.link;
    this.router.navigate([routerLink]);
  };

  closeForm() {}
}
