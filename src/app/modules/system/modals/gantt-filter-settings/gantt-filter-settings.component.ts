import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ShowsService } from "../../shows/shows.service";
import { AssetsService } from "../../shows/assets.service";
import { ShotsService } from "../../shows/shots.service";
import { WorkstatusService } from "../../configs/workstatus.service";
import { DepartmentsService } from "src/app/modules/system/configs/departments.service";
import { RolesService } from "src/app/modules/system/configs/roles.service";
import { UserListFormComponent } from "src/app/modules/system/modals/user-list-form/user-list-form.component";

@Component({
  selector: "app-gantt-filter-settings",
  templateUrl: "./gantt-filter-settings.component.html",
  styleUrls: ["./gantt-filter-settings.component.scss"],
})
export class GanttFilterSettingsComponent implements OnInit {
  @Input() filters: any;
  @Input() type: any;

  filtersCopy: any;
  isDataReady: boolean;
  artist :any;
  shows: any;
  shots: any;
  assets: any;
  workStatuses: any;
  taskTypes: any;
  departments: any;
  departmentId: any;
  artists: any;
  artistId: any;
  btnName: string = "Apply";
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private helperService: HelperService,
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private assetsService: AssetsService,
    private workstatusService: WorkstatusService,
    private departmentsService: DepartmentsService,
    private rolesService: RolesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
    console.log(this.filtersCopy);
    this.prepareData();
  }

  async prepareData() {
    await this.getShows();
    
    await this.getWorkstatusList();
    if (this.filtersCopy.showId) {
      await this.getShotList();
      await this.getAssetList();
    }
    await this.getTaskTypes();
    await this.getDepartmentListSearch(); 
    await this.getUsersByPrivilege(5); 
   
    await this.buildFormData();
    this.isDataReady = true;
  }

  async showChangeHandler(e) {
    this.dataForm.controls.assetIds.setValue(null);
    this.dataForm.controls.shotIds.setValue(null);
    this.filtersCopy.showId = e;
    if (this.filtersCopy.showId) {
      if (this.type == "shot") {
        await this.getShotList();
      } else if (this.type == "asset") {
        await this.getAssetList();
      }
    }
  }

  buildFormData() {
    console.log(this.filtersCopy.artistIds);
    this.dataForm = this.fb.group({
      showId: [this.filtersCopy.showId],
      assetIds: [this.filtersCopy.assetIds],
      shotIds: [this.filtersCopy.shotIds],
      workStatusIds: [this.filtersCopy.workStatusIds],
      taskTypeIds: [this.filtersCopy.taskTypeIds],
      departmentIds: [this.filtersCopy.departmentIds],
      artistIds: [this.filtersCopy.artistIds],
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
    console.log(this.dataForm.value);
    this.close(this.dataForm.value);
  }

  close(taskFiltersCopy: any): void {
    this.drawerRef.close(taskFiltersCopy);
  }

  async getShows() {
    await this.showsService
      .getShows()
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
  async getDepartmentListSearch() {
    await this.departmentsService
      .getDepartmentListSearch()
      .toPromise()
      .then((resp: any) => {
        this.departments = resp.entity;
      })
      .catch((error: any) => {
        this.departments = [];
      });
  }
  async getUsersByPrivilege(privilegeId: any) {
    await this.rolesService
      .getUsersByPrivilege(privilegeId)
      .toPromise()
      .then((resp: any) => {
        this.artists = resp.entity;
        console.log(this.artists);
      })
      .catch((error: any) => {
        this.artists = [];
      });
  }
  getArtistName(artist: any) {
    let name = "";
    if (artist.firstName) {
      name += artist.firstName + " ";
    }
    if (artist.lastName) {
      name += artist.lastName;
    }
    return name;
  }
  
}
