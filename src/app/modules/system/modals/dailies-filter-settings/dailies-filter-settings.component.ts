import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ShowsService } from "../../shows/shows.service";
import { AssetsService } from "../../shows/assets.service";
import { ShotsService } from "../../shows/shots.service";

@Component({
  selector: "app-dailies-filter-settings",
  templateUrl: "./dailies-filter-settings.component.html",
  styleUrls: ["./dailies-filter-settings.component.scss"],
})
export class DailiesFilterSettingsComponent implements OnInit {
  @Input() filters: any;

  filtersCopy: any;
  isDataReady: boolean;
  shows: any;
  shots: any;
  assets: any;
  supervisors: any;
  artists: any;
  taskTypes: any;
  statusList: any;

  btnName: string = "Apply";
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private helperService: HelperService,
    private showsService: ShowsService,
    private shotService: ShotsService,

    private assetsService: AssetsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
    this.prepareData();
  }

  async prepareData() {
    await this.getShows();
    if (this.filtersCopy.showId) {
      await this.getShotList();
      await this.getSupervisors();
      await this.getAssetList();
      await this.getArtists();
    }
    await this.getTaskTypes();
    this.statusList = AppConstants.PLAYLIST_STATUS_LIST;

    this.buildFormData();
    this.isDataReady = true;
  }

  async showChangeHandler(e) {
    this.dataForm.controls.assetIds.setValue(null);
    this.dataForm.controls.shotIds.setValue(null);
    this.dataForm.controls.accountableIds.setValue(null);
    this.dataForm.controls.artistIds.setValue(null);
    this.filtersCopy.showId = e;
    if (this.filtersCopy.showId) {
      await this.getShotList();
      await this.getAssetList();
      await this.getSupervisors();
      await this.getArtists();
      //await this.getTaskTypes();
    }
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      showId: [this.filtersCopy.showId],
      assetIds: [this.filtersCopy.assetIds],
      shotIds: [this.filtersCopy.shotIds],
      taskTypeIds: [this.filtersCopy.taskTypeIds],
      accountableIds: [this.filtersCopy.accountableIds],
      artistIds: [this.filtersCopy.artistIds],
      status: [this.filtersCopy.status],
    });
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

  close(filters: any): void {
    this.drawerRef.close(filters);
  }

  async getShows() {
    let serviceName = "getShows";
    await this.showsService[serviceName]()
      .toPromise()
      .then((resp) => {
        this.shows = resp.entity;
        if (this.shows && this.shows.length > 0) {
        }
      })
      .catch((error) => {
        this.shows = null;
      });
  }

  async getShotList() {
    await this.shotService
      .getShotsByShowId(this.filtersCopy.showId)
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
      .getSupervisorsByShowId(this.filtersCopy.showId)
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
      .getAssetListByShowId(this.filtersCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.assets = resp.entity;
      })
      .catch((error: any) => {
        this.assets = [];
      });
  }

  async getArtists() {
    await this.showsService
      .getArtistsByShowId(this.filtersCopy.showId)
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
    /*await this.showsService
      .getTaskTypesByShowId(this.filtersCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.taskTypes = resp.entity;
      })
      .catch((error: any) => {
        this.taskTypes = [];
      });*/
  }
}
