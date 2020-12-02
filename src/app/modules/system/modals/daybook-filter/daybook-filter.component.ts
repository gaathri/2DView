import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ShowsService } from "../../shows/shows.service";
import { WorkstatusService } from "../../configs/workstatus.service";
import { AssetsService } from "../../shows/assets.service";
import { ShotsService } from "../../shows/shots.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-daybook-filter",
  templateUrl: "./daybook-filter.component.html",
  styleUrls: ["./daybook-filter.component.scss"],
})
export class DaybookFilterComponent implements OnInit {
  //@Input() showId: any;
  @Input() filters: any;
  @Input() type: any;
  @Input() isArtist: boolean;

  filtersCopy: any;
  isDataReady: boolean;
  //showId: any;
  clients: any;
  shows: any;
  shots: any;
  supervisors: any;
  artists: any;
  taskTypes: any;
  assets: any;
  workStatuses: any;
  taskPriorities: any;
  btnName: string = "Apply";
  dataForm: FormGroup;
  isClient: boolean;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private helperService: HelperService,
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private assetsService: AssetsService,
    private workstatusService: WorkstatusService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    let privilegeId = this.helperService.getPrivilegeId();
    if (privilegeId === AppConstants.CLIENT_PRIVILEGE_ID) {
      this.isClient = true;
    }
    this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
    this.prepareData();
  }

  async prepareData() {
    await this.getShows();
    await this.getTaskTypes();
    if (!this.isArtist) {
      await this.getClientList();
    }
    await this.getShotList();
    await this.getSupervisors();
    await this.getAssetList();
    await this.getArtists();

    await this.getTaskPriorities();
    await this.getWorkstatusList();

    this.buildFormData();
    this.isDataReady = true;
  }

  getShotLabel(shot) {
    let shotCode = "";
    let showName = "";
    if (shot.shotCode) {
      shotCode = shot.shotCode;
    }
    if (shot.showName) {
      showName = shot.showName;
    }

    return shotCode + " ( " + showName + " )";
  }

  getAssetLabel(asset) {
    let assetName = "";
    let showName = "";
    if (asset.assetName) {
      assetName = asset.assetName;
    }
    if (asset.showName) {
      showName = asset.showName;
    }

    return assetName + " ( " + showName + " )";
  }

  async getClientList() {
    await this.showsService
      .getClientList()
      .toPromise()
      .then((resp) => {
        this.clients = resp.entity;
      })
      .catch((error) => {
        this.clients = null;
      });
  }

  async clientChangeHandler(e) {
    this.dataForm.controls.showId.setValue(null);
    this.filtersCopy.clientIds = e;
    this.getShows();
  }

  async showChangeHandler(e) {
    this.dataForm.controls.assetIds.setValue(null);
    this.dataForm.controls.shotIds.setValue(null);
    this.dataForm.controls.accountableIds.setValue(null);
    this.dataForm.controls.artistIds.setValue(null);

    this.filtersCopy.showId = e;
    /*if (this.filtersCopy.showId) {
      await this.getShotList();
      await this.getAssetList();
      await this.getSupervisors();
      await this.getArtists();
    }*/
    await this.getShotList();
    await this.getAssetList();
    await this.getSupervisors();
    await this.getArtists();
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      showId: [this.filtersCopy.showId],
      assetIds: [this.filtersCopy.assetIds],
      shotIds: [this.filtersCopy.shotIds],
      workStatusIds: [this.filtersCopy.workStatusIds],
      taskPriorityIds: [this.filtersCopy.taskPriorityIds],
      taskTypeIds: [this.filtersCopy.taskTypeIds],
    });
    this.dataForm.addControl(
      "accountableIds",
      this.fb.control(this.filtersCopy.accountableIds)
    );
    if (!this.isArtist) {
      this.dataForm.addControl(
        "clientIds",
        this.fb.control(this.filtersCopy.clientIds)
      );
      this.dataForm.addControl(
        "artistIds",
        this.fb.control(this.filtersCopy.artistIds)
      );
    }
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  resetHandler() {
    this.dataForm.reset();
    this.close(this.dataForm.value);
  }

  submitHandler() {
    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    if (!this.dataForm.valid) {
      return;
    }
    this.close(this.dataForm.value);
  }

  close(taskFiltersCopy: any): void {
    this.drawerRef.close(taskFiltersCopy);
  }

  async getShows() {
    if (this.filtersCopy.clientIds) {
      await this.showsService
        .getShowsByClient(this.filtersCopy.clientIds)
        .toPromise()
        .then((resp) => {
          this.shows = resp;
        })
        .catch((error) => {
          this.shows = null;
        });
    } else {
      let serviceName = "getShows";
      if (this.isArtist) {
        serviceName = "getShowsByArist";
      }
      await this.showsService[serviceName]()
        .toPromise()
        .then((resp) => {
          this.shows = resp.entity;
        })
        .catch((error) => {
          this.shows = null;
        });
    }
  }

  async getShotList() {
    await this.shotsService
      .getDaybookShots(this.filtersCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.shots = resp.entity;
      })
      .catch((error: any) => {
        this.shots = [];
      });
  }

  async getSupervisors() {
    await this.showsService
      .getDaybookSupervisors(this.filtersCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.supervisors = resp.entity;
      })
      .catch((error: any) => {
        this.supervisors = [];
      });
  }

  async getAssetList() {
    await this.assetsService
      .getDaybookAssets(this.filtersCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.assets = resp.entity;
      })
      .catch((error: any) => {
        this.assets = [];
      });
  }

  async getTaskPriorities() {
    await this.showsService
      .getTaskPriorities()
      .toPromise()
      .then((resp: any) => {
        this.taskPriorities = resp.entity;
      })
      .catch((error: any) => {
        this.taskPriorities = [];
      });
  }

  async getWorkstatusList() {
    await this.workstatusService
      .getWorkstatusList()
      .toPromise()
      .then((resp: any) => {
        this.workStatuses = resp.entity;
      })
      .catch((error: any) => {
        this.workStatuses = [];
      });
  }

  async getArtists() {
    await this.showsService
      .getDaybookArtists(this.filtersCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.artists = resp.entity;
      })
      .catch((error: any) => {
        this.artists = [];
      });
  }

  async getTaskTypes() {
    await this.showsService
      .getTaskTypes()
      .toPromise()
      .then((resp: any) => {
        this.taskTypes = resp.entity;
      })
      .catch((error: any) => {
        this.taskTypes = [];
      });
  }
}
