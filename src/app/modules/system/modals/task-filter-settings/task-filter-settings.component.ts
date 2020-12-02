import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ShowsService } from "../../shows/shows.service";
import { WorkstatusService } from "../../configs/workstatus.service";
import { AssetsService } from "../../shows/assets.service";
import { ShotsService } from "../../shows/shots.service";

@Component({
  selector: "app-task-filter-settings",
  templateUrl: "./task-filter-settings.component.html",
  styleUrls: ["./task-filter-settings.component.scss"],
})
export class TaskFilterSettingsComponent implements OnInit {
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
    this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
    this.prepareData();
  }

  async prepareData() {
    await this.getShows();
    if (!this.isArtist) {
      await this.getClientList();
    }
    if (this.filtersCopy.showId) {
      await this.getShotList();
      await this.getSupervisors();
      await this.getAssetList();
      await this.getArtists();
      //await this.getTaskTypes();
    }
    await this.getTaskTypes();
    await this.getTaskPriorities();
    await this.getWorkstatusList();

    this.buildFormData();
    this.isDataReady = true;
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

  async clientChangeHandler(e) {}

  async showChangeHandler(e) {
    this.dataForm.controls.assetIds.setValue(null);
    this.dataForm.controls.shotIds.setValue(null);
    this.dataForm.controls.accountableIds.setValue(null);
    if (!this.isArtist) {
      this.dataForm.controls.artistIds.setValue(null);
    }
    this.filtersCopy.showId = e;
    if (this.filtersCopy.showId) {
      if (this.type == "shot") {
        await this.getShotList();
      } else if (this.type == "asset") {
        await this.getAssetList();
      }
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
    let serviceName = "getShows";
    if (this.isArtist) {
      serviceName = "getShowsByArist";
    }
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
    await this.shotsService
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
  }
}
