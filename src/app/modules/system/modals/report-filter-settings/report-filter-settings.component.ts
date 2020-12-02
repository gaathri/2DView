import { Component, OnInit, Input } from '@angular/core';
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShowsService } from '../../shows/shows.service';
import { DepartmentsService } from '../../configs/departments.service';


@Component({
  selector: 'app-report-filter-settings',
  templateUrl: './report-filter-settings.component.html',
  styleUrls: ['./report-filter-settings.component.scss']
})
export class ReportFilterSettingsComponent implements OnInit {

  @Input() filters: any;
  @Input() reportTypeId: any;

  filtersCopy: any;
  isDataReady: boolean;
  shows: any;
  departments: any;
  btnName: string = "Apply";
  dataForm: FormGroup;
  enableShowFilter: boolean;
  enableDepartmentFilter: boolean;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private helperService: HelperService,
    private showsService: ShowsService,
    private departmentsService: DepartmentsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    let reportIdsWithShowFilter = AppConstants.SHOW_FILTER_REPORT_IDS;
    let reportIdsWithDepartmentFilter = AppConstants.DEPARTMENT_FILTER_REPORT_IDS;
    if (reportIdsWithShowFilter.includes(this.reportTypeId)) {
      this.enableShowFilter = true;
    }
    if (reportIdsWithDepartmentFilter.includes(this.reportTypeId)) {
      this.enableDepartmentFilter = true;
    }

    this.filtersCopy = JSON.parse(JSON.stringify(this.filters));
    this.prepareData();
  }

  async prepareData() {
    if (this.enableShowFilter) {
      await this.getShows();
    }
    if (this.enableDepartmentFilter) {
      await this.getDepartmentListSearch();
    }
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
    });
    if (this.enableShowFilter) {
      this.dataForm.addControl('showIds', this.fb.control(this.filtersCopy.showIds));
    }
    if (this.enableDepartmentFilter) {
      this.dataForm.addControl('departmentIds', this.fb.control(this.filtersCopy.departmentIds));
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

  close(filters: any): void {
    this.drawerRef.close(filters);
  }

  async getShows() {
    let serviceName = "getShows";
    await this.showsService[serviceName]()
      .toPromise()
      .then(resp => {
        this.shows = resp.entity;
        if (this.shows && this.shows.length > 0) {
        }
      })
      .catch(error => {
        this.shows = null;
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
