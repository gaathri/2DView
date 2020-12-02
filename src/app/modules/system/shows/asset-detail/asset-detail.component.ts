import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";
import { ShowsService } from "../shows.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
//import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { AssetFormComponent } from "../../modals/asset-form/asset-form.component";
import { AssetsService } from "../assets.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-asset-detail",
  templateUrl: "./asset-detail.component.html",
  styleUrls: ["./asset-detail.component.scss"],
})
export class AssetDetailComponent implements OnInit {
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  childDrawerRef: any;
  isDataReady: boolean;
  isDataRefreshReady: boolean;
  isEmptyData: boolean;
  assetId: any;
  assetIn: any;
  assetOut: any;
  assetStatus: any;
  overviewPanel = {
    active: true,
    disabled: false,
    name: "Asset Overview",
    customStyle: {
      "border-radius": "4px",
      "margin-bottom": "8px",
      border: "0px",
    },
  };
  cardData: any;
  mode = "update";
  isReadOnly: boolean;
  constructor(
    private assetsService: AssetsService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private helperService: HelperService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService //private interactionService: InteractionService
  ) {}

  ngOnInit() {
    this.activatedRouter.params.subscribe((params) => {
      this.assetId = params["assetId"];
      this.prepareData();
    });
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.ASSET
    );
  }

  linkClickHandler(type: any) {
    let routerLink = "";
    if (type === "show-listing") {
      routerLink = "/system/listing/shows";
    } else if (type === "shot-listing") {
      routerLink = "/system/listing/shows/" + this.assetIn.showId + "/shots";
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
    await this.getAssetInfo();
    await this.getAssetStatus();
    if (this.assetIn && this.assetStatus) {
      /*let showName = this.assetIn.showName
        ? this.assetIn.showName
        : this.assetIn.showId;
      this.interactionService.sendInteraction(
        "breadcrumb",
        "asset-task-listing",
        {
          showId: this.assetIn.showId,
          showName: showName,
          assetName: this.assetIn.assetName,
          assetId: this.assetId
        }
      );*/
      this.prepareCardData();
    } else {
      this.isEmptyData = true;
    }
  }

  async getAssetInfo() {
    await this.assetsService
      .getAssetInfo(this.assetId)
      .toPromise()
      .then((resp: any) => {
        this.assetIn = resp.entity;
      })
      .catch((error: any) => {
        this.assetIn = null;
      });
  }

  async getAssetStatus() {
    await this.assetsService
      .getAssetStatus(this.assetId)
      .toPromise()
      .then((resp: any) => {
        this.assetStatus = resp.entity;
      })
      .catch((error: any) => {
        this.assetStatus = null;
      });
  }

  prepareCardData() {
    this.cardData = {
      headerTitle: this.assetIn.assetName,
      footerTitle: "Description",
      footerSubTitle: this.assetIn.description,
      thumbnail: this.assetIn.thumbnail,
      descriptions: [
        {
          name: "Status",
          class: "label",
          value: this.assetIn.status ? this.assetIn.status : "-",
        },
        {
          name: "Asset Type",
          class: "label label-green",
          value: this.assetIn.assetTypeName,
        },
        {
          name: "Creative Brief",
          class: "label label-green",
          value: this.assetIn.creativeBrief,
        },
        {
          name: "Task Template",
          class: "label label-green",
          value: this.assetIn.templateName,
        },

        /*{
          name: "Progress",
          class: "label label-green",
          value: this.helperService.getValidPercentage(
            this.assetIn.completionPercentage
          )
        }*/
      ],
    };
    this.isDataRefreshReady = true;
    this.isDataReady = true;
  }

  async editHandler() {
    await this.getAsset(this.assetId);
    if (this.assetOut) {
      this.openAssetForm();
    }
  }

  async getAsset(id: any) {
    this.assetOut = null;
    await this.assetsService
      .getAsset(id)
      .toPromise()
      .then((resp) => {
        if (resp && resp.valid && resp.entity) {
          this.assetOut = resp.entity;
        }
      })
      .catch((error) => {});
  }

  openAssetForm(): void {
    this.childDrawerRef = this.drawerService.create<
      AssetFormComponent,
      {
        assetOut: any;
        mode: string;
        disableShowSelect?: boolean;
        showName?: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: AssetFormComponent,
      nzContentParams: {
        assetOut: this.assetOut,
        mode: this.mode,
        disableShowSelect: true,
        showName: this.assetIn.showName,
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
