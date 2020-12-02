import { Component, OnInit, Input } from "@angular/core";
import { ShowsService } from "../../shows/shows.service";
import { SequencesService } from "../../shows/sequences.service";
import { AssetsService } from "../../shows/assets.service";
import { SpotsService } from "../../shows/spots.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NzDrawerRef } from "ng-zorro-antd";
import { ShotsService } from "../../shows/shots.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-shot-all-fields",
  templateUrl: "./shot-all-fields.component.html",
  styleUrls: ["./shot-all-fields.component.scss"],
})
export class ShotAllFieldsComponent implements OnInit {
  @Input() shotOutCopy: any;
  @Input() mode: any;
  @Input() parentDrawerRef: any;
  @Input() callback: any;
  @Input() id: any;

  isDataReady: boolean;
  supervisors: any;
  sequences: any;
  spots: any;
  assets: any;
  parentShots: any;
  subShots: any;
  taskTemplates: any;
  mainForm: FormGroup;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private sequencesService: SequencesService,
    private spotsService: SpotsService,
    private assetsService: AssetsService,
    private fb: FormBuilder,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.prepareData();
    this.drawerRef.afterClose.subscribe((data) => {
      this.callback(this.mainForm.value);
    });
  }

  async prepareData() {
    //await this.getSupervisorList();
    await this.getSupervisors();
    await this.getSequenceList();
    await this.getSpotList();
    await this.getAssetList();
    await this.getParentShotList();
    await this.getSubShotList();
    await this.getTaskTemplates();
    this.buildFormData();
    this.isDataReady = true;
  }

  buildFormData() {
    this.mainForm = this.fb.group({
      info: [this.shotOutCopy.info],
      platePath: [this.shotOutCopy.platePath],
      cutIn: [this.shotOutCopy.cutIn],
      cutOut: [this.shotOutCopy.cutOut],
      headIn: [this.shotOutCopy.headIn],
      tailOut: [this.shotOutCopy.tailOut],
      frameRange: [this.shotOutCopy.frameRange],
      handles: [this.shotOutCopy.handles],
      framesPerSec: [this.shotOutCopy.framesPerSec],
      focalLength: [this.shotOutCopy.focalLength],
      workingRange: [this.shotOutCopy.workingRange],
      shootingDate: [this.shotOutCopy.shootingDate],
      shootingSupervisorId: [this.shotOutCopy.shootingSupervisorId],
      assetIds: [this.shotOutCopy.assetIds],
      parentShotIds: [this.shotOutCopy.parentShotIds],
      subShotIds: [this.shotOutCopy.subShotIds],
      taskTemplateId: [this.shotOutCopy.taskTemplateId],
    });
  }

  async getSupervisors() {
    await this.showsService
      .getSupervisorsByShowId(this.shotOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.supervisors = resp.entity;
      })
      .catch((error: any) => {
        this.supervisors = [];
      });
  }

  async getSupervisorList() {
    await this.showsService
      .getSupervisorList()
      .toPromise()
      .then((resp: any) => {
        this.supervisors = resp.entity;
      })
      .catch((error: any) => {
        this.supervisors = [];
      });
  }

  async getSequenceList() {
    await this.sequencesService
      .getSequenceList(this.shotOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.sequences = resp.entity;
      })
      .catch((error: any) => {
        this.sequences = [];
      });
  }

  async getSpotList() {
    await this.spotsService
      .getSpotList(this.shotOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.spots = resp.entity;
      })
      .catch((error: any) => {
        this.spots = [];
      });
  }

  async getAssetList() {
    await this.assetsService
      .getAssetListByShowId(this.shotOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.assets = resp.entity;
      })
      .catch((error: any) => {
        this.assets = [];
      });
  }

  async getParentShotList() {
    await this.shotsService
      .getParentShotList(this.shotOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.parentShots = resp.entity;
        if (this.id) {
          this.parentShots = this.helperService.filterSelfId(
            resp.entity,
            this.id
          );
        }
      })
      .catch((error: any) => {
        this.parentShots = [];
      });
  }

  async getSubShotList() {
    await this.shotsService
      .getSubShotList(this.shotOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.subShots = resp.entity;
        if (this.id) {
          this.subShots = this.helperService.filterSelfId(resp.entity, this.id);
        }
      })
      .catch((error: any) => {
        this.subShots = [];
      });
  }

  getParentShots() {
    let parentShots = this.parentShots;
    let subShotIds = null;
    if (
      this.mainForm &&
      this.mainForm.value &&
      this.mainForm.value.subShotIds
    ) {
      subShotIds = this.mainForm.value.subShotIds;
      let c = this.parentShots.filter(
        (o) => !subShotIds.find((id) => o.id === id)
      );
      return c;
    }

    return parentShots;
  }

  getSubShots() {
    let subShots = this.subShots;
    let parentShotIds = null;
    if (
      this.mainForm &&
      this.mainForm.value &&
      this.mainForm.value.parentShotIds
    ) {
      parentShotIds = this.mainForm.value.parentShotIds;

      let c = this.subShots.filter(
        (o) => !parentShotIds.find((id) => o.id === id)
      );
      return c;
    }

    return subShots;
  }

  async getTaskTemplates() {
    await this.showsService
      .getTaskTemplates()
      .toPromise()
      .then((resp: any) => {
        this.taskTemplates = resp.entity;
      })
      .catch((error: any) => {
        this.taskTemplates = [];
      });
  }

  onChange($event: any): void {}

  /*disabledShootingDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    let today = new Date();
    let yesterday = new Date(today.setDate(today.getDate() - 1));
    return startValue.getTime() < yesterday.getTime();
  };*/

  submitHandler() {
    this.parentDrawerRef.nzOffsetX = 0;
    for (const i in this.mainForm.controls) {
      this.mainForm.controls[i].markAsDirty();
      this.mainForm.controls[i].updateValueAndValidity();
    }

    if (!this.mainForm.valid) {
      return;
    }
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
