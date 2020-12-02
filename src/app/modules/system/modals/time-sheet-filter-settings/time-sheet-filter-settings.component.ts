import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ShowsService } from "../../shows/shows.service";
import { DepartmentsService } from "../../configs/departments.service";

@Component({
  selector: "app-time-sheet-filter-settings",
  templateUrl: "./time-sheet-filter-settings.component.html",
  styleUrls: ["./time-sheet-filter-settings.component.scss"],
})
export class TimeSheetFilterSettingsComponent implements OnInit {
  @Input() filters: any;
  filtersCopy: any;
  isDataReady: boolean;
  shows: any;
  taskTypes: any;
  departments: any;
  btnName: string = "Apply";
  dataForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private helperService: HelperService,
    private showsService: ShowsService,
    private departmentsService: DepartmentsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
    this.prepareData();
  }

  async prepareData() {
    await this.getShows();
    await this.getTaskTypes();
    await this.getDepartmentListSearch();
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      showIds: [this.filtersCopy.showIds],
      taskTypeIds: [this.filtersCopy.taskTypeIds],
      departmentIds: [this.filtersCopy.departmentIds],
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

  close(taskFiltersCopy: any): void {
    this.drawerRef.close(taskFiltersCopy);
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

  async showChangeHandler(e) {
    this.filtersCopy.showIds = e;
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
}
