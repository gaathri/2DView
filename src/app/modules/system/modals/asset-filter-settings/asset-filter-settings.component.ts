import { Component, OnInit, Input } from "@angular/core";
import { NzDrawerRef } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { EpisodesService } from "../../shows/episodes.service";
import { SeasonsService } from "../../shows/seasons.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SequencesService } from "../../shows/sequences.service";
import { SpotsService } from "../../shows/spots.service";
import { ShowsService } from "../../shows/shows.service";
import { WorkstatusService } from "../../configs/workstatus.service";
import { ShotsService } from "../../shows/shots.service";
import { CustomFieldService } from "../../configs/custom-field.service";
import { AssetsService } from "../../shows/assets.service";

@Component({
  selector: "app-asset-filter-settings",
  templateUrl: "./asset-filter-settings.component.html",
  styleUrls: ["./asset-filter-settings.component.scss"],
})
export class AssetFilterSettingsComponent implements OnInit {
  @Input() type: any;
  @Input() showId: any;
  @Input() filters: any;
  filtersCopy: any;
  isDataReady: boolean;
  assetTypes: any;
  shots: any;
  assets: any;
  seasons: any;
  episodes: any;
  sequences: any;
  spots: any;
  statuses: any;
  workStatuses: any;
  taskPriorities: any;
  taskcomplexities: any;
  locations: any;
  artists: any;
  supervisors: any;
  customFields: any;
  taskTypes: any;
  btnName: string = "Apply";
  dataForm: FormGroup;
  operators = [
    {
      name: ">=",
      id: ">=",
    },
    {
      name: "<=",
      id: "<=",
    },
    {
      name: "=",
      id: "=",
    },
  ];
  taskColumns: any;

  parentAssets: any;
  subAssets: any;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private helperService: HelperService,
    private episodesService: EpisodesService,
    private seasonsService: SeasonsService,
    private sequencesService: SequencesService,
    private spotsService: SpotsService,
    private showsService: ShowsService,
    private customFieldService: CustomFieldService,
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
    await this.getAssetList();
    await this.getStatuses();
    await this.getAssetTypes();
    await this.getShotList();
    await this.getParentAssetList();
    await this.getSubAssetList();

    await this.getCustomfieldsByEntityId(this.showId);
    this.buildFormData();
    this.isDataReady = true;
  }

  isCustomFieldSelected() {
    if (this.dataForm.value.customFieldId) {
      return true;
    }
    return false;
  }

  customFieldChangeHandler(e: any) {
    this.dataForm.controls.customFieldValue.setValue(null);
  }

  hasViewPermission(column: any) {
    let permission = false;
    let columnInfo = this.helperService.findObjectInArrayByKey(
      this.taskColumns,
      "name",
      column
    );
    if (columnInfo) {
      permission = true;
    }
    return permission;
  }

  buildFormData() {
    this.dataForm = this.fb.group({
      assetTypeIds: [this.filtersCopy.assetTypeIds],
      parentAssetIds: [this.filtersCopy.parentAssetIds],
      subAssetIds: [this.filtersCopy.subAssetIds],
      linkedShotIds: [this.filtersCopy.linkedShotIds],
      customFieldId: [this.filtersCopy.customFieldId],
      customFieldValue: [this.filtersCopy.customFieldValue],
      completionPercentage: [this.filtersCopy.completionPercentage],
      percentOperator: [this.filtersCopy.percentOperator],
    });

    this.dataForm.addControl(
      "assetName",
      this.fb.control(this.filtersCopy.assetName)
    );
    this.dataForm.addControl(
      "status",
      this.fb.control(this.filtersCopy.status)
    );
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async getAssetTypes() {
    await this.assetsService
      .getAssetTypes()
      .toPromise()
      .then((resp: any) => {
        this.assetTypes = resp.entity;
      })
      .catch((error: any) => {
        this.assetTypes = [];
      });
  }

  async getAssetList() {
    await this.assetsService
      .getAssetListByShowId(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.assets = resp.entity;
      })
      .catch((error: any) => {
        this.assets = [];
      });
  }

  async getStatuses() {
    await this.showsService
      .getAllStatusNew()
      .toPromise()
      .then((resp: any) => {
        this.statuses = resp.entity;
      })
      .catch((error: any) => {
        this.statuses = [];
      });
  }

  async getCustomfieldsByEntityId(entityId: any) {
    await this.customFieldService
      .getCustomfieldsByEntityId(entityId, "Shot")
      .toPromise()
      .then((resp) => {
        this.customFields = resp.entity;
      })
      .catch((e) => {
        this.customFields = null;
      });
  }

  async getShotList() {
    await this.shotsService
      .getLinkedShotList(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.shots = resp.entity;
      })
      .catch((error: any) => {
        this.shots = [];
      });
  }

  async getParentAssetList() {
    await this.assetsService
      .getParentAssetList(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.parentAssets = resp.entity;
      })
      .catch((error: any) => {
        this.parentAssets = [];
      });
  }

  async getSubAssetList() {
    await this.assetsService
      .getSubAssetList(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.subAssets = resp.entity;
      })
      .catch((error: any) => {
        this.subAssets = [];
      });
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

  close(shotFiltersCopy: any): void {
    this.drawerRef.close(shotFiltersCopy);
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
