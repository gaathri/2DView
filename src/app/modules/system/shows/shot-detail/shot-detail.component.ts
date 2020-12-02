import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ShowsService } from "../shows.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { ShotFormComponent } from "../../modals/shot-form/shot-form.component";
//import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { Router } from "@angular/router";

@Component({
  selector: "app-shot-detail",
  templateUrl: "./shot-detail.component.html",
  styleUrls: ["./shot-detail.component.scss"],
})
export class ShotDetailComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  childDrawerRef: any;
  isDataReady: boolean;
  isDataRefreshReady: boolean;
  isEmptyData: boolean;
  isLoading: boolean;
  shotId: any;
  shotIn: any;
  shotOut: any;
  shotStatus: any;
  overviewPanel = {
    active: true,
    disabled: false,
    name: "Shot Overview",
    customStyle: {
      "border-radius": "0px",
      "margin-bottom": "8px",
      border: "0px",
    },
  };
  cardData: any;
  mode = "update";
  isReadOnly: boolean;
  constructor(
    private showsService: ShowsService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private helperService: HelperService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService //private interactionService: InteractionService
  ) {}

  ngOnInit() {
    this.activatedRouter.params.subscribe((params) => {
      this.shotId = params["shotId"];
      this.prepareData();
    });
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.SHOT
    );
  }

  linkClickHandler(type: any) {
    let routerLink = "";
    if (type === "show-listing") {
      routerLink = "/system/listing/shows";
    } else if (type === "shot-listing") {
      routerLink = "/system/listing/shows/" + this.shotIn.showId + "/shots";
    }
    if (routerLink !== "") {
      this.router.navigate([routerLink]);
    }
  }

  onPageUpdate(e: any) {
    this.prepareData();
  }

  async prepareData() {
    this.isDataRefreshReady = false;
    this.isLoading = true;
    this.isEmptyData = true;
    await this.getShotInfo();
    await this.getShotStatus();
    if (this.shotIn && this.shotStatus) {
      /*let showName = this.shotIn.showName
        ? this.shotIn.showName
        : this.shotIn.showId;
      this.interactionService.sendInteraction(
        "breadcrumb",
        "shot-task-listing",
        {
          showId: this.shotIn.showId,
          showName: showName,
          shotName: this.shotIn.shotCode,
          shotId: this.shotId
        }
      );*/
      this.prepareCardData();
    } else {
      this.isEmptyData = true;
    }
    this.isLoading = false;
  }

  async getShotInfo() {
    await this.showsService
      .getShotInfo(this.shotId)
      .toPromise()
      .then((resp: any) => {
        this.isEmptyData = false;
        this.shotIn = resp.entity;
      })
      .catch((error: any) => {
        this.shotIn = null;
      });
  }

  async getShotStatus() {
    await this.showsService
      .getShotStatus(this.shotId)
      .toPromise()
      .then((resp: any) => {
        this.shotStatus = resp.entity;
      })
      .catch((error: any) => {
        this.shotStatus = null;
      });
  }

  prepareCardData() {
    this.cardData = {
      headerTitle: this.shotIn.shotCode,
      footerTitle: "Description",
      footerSubTitle: this.shotIn.description,
      thumbnail: this.shotIn.thumbnail,
      descriptions: [
        {
          name: "Status",
          class: "label",
          value: this.shotIn.status,
        },
        {
          name: "Frames Per Sec",
          class: "label label-green",
          value: this.shotIn.framesPerSec,
        },
        {
          name: "Shooting Date",
          class: "label label-green",
          value: this.getDisplayDate(this.shotIn.shootingDate),
          /*value: this.helperService.transformDate(
            this.shotIn.shootingDate,
            "MMM dd, yyyy"
          ),*/
        },
        {
          name: "Shot Info",
          class: "label label-green",
          value: this.shotIn.info,
        },
      ],
    };
    this.isDataRefreshReady = true;
    this.isDataReady = true;
  }

  getDisplayDate(date: any) {
    return this.helperService.transformDate(
      date,
      AppConstants.DISPLAY_DATE_FORMAT
    );
  }

  async editHandler() {
    await this.getShot(this.shotId);
    if (this.shotOut) {
      this.openShotForm();
    }
  }

  async getShot(id: any) {
    this.shotOut = null;
    await this.showsService
      .getShot(id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid && resp.entity) {
          this.shotOut = resp.entity;
        }
      })
      .catch((error) => {});
  }

  openShotForm(): void {
    this.childDrawerRef = this.drawerService.create<
      ShotFormComponent,
      {
        shotOut: any;
        mode: string;
        disableShowSelect?: boolean;
        showName?: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: ShotFormComponent,
      nzContentParams: {
        shotOut: this.shotOut,
        mode: this.mode,
        disableShowSelect: true,
        showName: this.shotIn.showName,
      },
      nzClosable: false,
      nzWidth: "500px",
      nzWrapClassName: "modal-wrapper",
      nzOnCancel: () =>
        new Promise((resolve, reject) => {
          this.modalService.confirm({
            nzTitle: AppConstants.EXIT_WARNING_MESSAGE,
            nzOkText: "Yes",
            nzOkType: "primary",
            nzOnOk: () => resolve(true),
            nzCancelText: "No",
            //nzCancelType: "primary",
            nzOnCancel: () => resolve(false),
            nzNoAnimation: true,
          });
          return;
        }),
    });

    this.childDrawerRef.afterOpen.subscribe(() => {});

    this.childDrawerRef.afterClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.prepareData();
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }
}
