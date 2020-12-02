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
  selector: "app-shot-filter-settings",
  templateUrl: "./shot-filter-settings.component.html",
  styleUrls: ["./shot-filter-settings.component.scss"],
})
export class ShotFilterSettingsComponent implements OnInit {
  @Input() type: any;
  @Input() showId: any;
  @Input() filters: any;
  @Input() viewType: any;
  filtersCopy: any;
  isDataReady: boolean;
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
  assetTypes: any;
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
    await this.getShotList();
    if (this.viewType == "asset") {
      await this.getAssetList();
      await this.getAssetTypes();
    }

    await this.getTaskColumnList();
    if (this.viewType != "asset") {
      await this.getSeasonList();
      await this.getEpisodeList();
      await this.getSequenceList();
      await this.getSpotList();
    }
    await this.getStatuses();
    await this.getLocations();
    await this.getCustomfieldsByEntityId(this.showId);
    if (this.type === "task") {
      this.taskcomplexities = [
        {
          id: "Easy",
          title: "Easy",
        },
        {
          id: "Medium",
          title: "Medium",
        },
        {
          id: "Hard",
          title: "Hard",
        },
      ];
      await this.getTaskPriorities();
      await this.getWorkstatusList();
      await this.getArtists();
      await this.getSupervisors();
      await this.getTaskTypes();
    }

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
      seasonIds: [this.filtersCopy.seasonIds],
      episodeIds: [this.filtersCopy.episodeIds],
      sequenceIds: [this.filtersCopy.sequenceIds],
      spotIds: [this.filtersCopy.spotIds],
      customFieldId: [this.filtersCopy.customFieldId],
      customFieldValue: [this.filtersCopy.customFieldValue],
      completionPercentage: [this.filtersCopy.completionPercentage],
      percentOperator: [this.filtersCopy.percentOperator],
    });
    if (this.type === "shot") {
      this.dataForm.addControl(
        "shotCode",
        this.fb.control(this.filtersCopy.shotCode)
      );
      /*this.dataForm.addControl(
        "completionPercentage",
        this.fb.control(this.filtersCopy.completionPercentage)
      );*/
    }
    if (this.type === "task") {
      this.dataForm.addControl(
        "taskName",
        this.fb.control(this.filtersCopy.taskName)
      );

      this.dataForm.addControl(
        "shotIds",
        this.fb.control(this.filtersCopy.shotIds)
      );
      this.dataForm.addControl(
        "assetIds",
        this.fb.control(this.filtersCopy.assetIds)
      );
      this.dataForm.addControl(
        "assetTypeIds",
        this.fb.control(this.filtersCopy.assetTypeIds)
      );
      this.dataForm.addControl(
        "taskTypeIds",
        this.fb.control(this.filtersCopy.taskTypeIds)
      );
      this.dataForm.addControl(
        "taskPriorityIds",
        this.fb.control(this.filtersCopy.taskPriorityIds)
      );
      this.dataForm.addControl(
        "complexityIds",
        this.fb.control(this.filtersCopy.complexityIds)
      );
      this.dataForm.addControl(
        "workStatusIds",
        this.fb.control(this.filtersCopy.workStatusIds)
      );
      this.dataForm.addControl(
        "artistIds",
        this.fb.control(this.filtersCopy.artistIds)
      );
      this.dataForm.addControl(
        "accountableIds",
        this.fb.control(this.filtersCopy.accountableIds)
      );

      this.dataForm.addControl(
        "locationIds",
        this.fb.control(this.filtersCopy.locationIds)
      );

      this.dataForm.addControl(
        "startDateRange",
        this.fb.control(this.filtersCopy.startDateRange)
      );

      this.dataForm.addControl(
        "endDateRange",
        this.fb.control(this.filtersCopy.endDateRange)
      );

      this.dataForm.addControl(
        "clientEtaRange",
        this.fb.control(this.filtersCopy.clientEtaRange)
      );

      this.dataForm.addControl(
        "deliveryDateRange",
        this.fb.control(this.filtersCopy.deliveryDateRange)
      );

      this.dataForm.addControl(
        "clientBid",
        this.fb.control(this.filtersCopy.clientBid)
      );

      this.dataForm.addControl(
        "clientBidOperator",
        this.fb.control(this.filtersCopy.clientBidOperator)
      );

      this.dataForm.addControl(
        "artistBid",
        this.fb.control(this.filtersCopy.artistBid)
      );

      this.dataForm.addControl(
        "artistBidOperator",
        this.fb.control(this.filtersCopy.artistBidOperator)
      );
    } else {
      this.dataForm.addControl(
        "status",
        this.fb.control(this.filtersCopy.status)
      );
    }
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async getShotList() {
    await this.shotsService
      .getShotsByShowId(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.shots = resp.entity;
      })
      .catch((error: any) => {
        this.shots = [];
      });
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

  async getTaskColumnList() {
    let params = `?entityId=${this.showId}`;
    await this.showsService
      .getTaskColumnList(params)
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity && resp.entity.fields) {
          this.taskColumns = resp.entity.fields;
        }
      })
      .catch((error: any) => {
        this.taskColumns = null;
      });
  }

  async getSeasonList() {
    await this.seasonsService
      .getSeasonList(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.seasons = resp.entity;
      })
      .catch((error: any) => {
        this.seasons = [];
      });
  }

  async getEpisodeList() {
    await this.episodesService
      .getEpisodeList(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.episodes = resp.entity;
      })
      .catch((error: any) => {
        this.episodes = [];
      });
  }

  async getSequenceList() {
    await this.sequencesService
      .getSequenceList(this.showId)
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
      .getSpotList(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.spots = resp.entity;
      })
      .catch((error: any) => {
        this.spots = [];
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

  async getArtists() {
    await this.showsService
      .getDaybookArtists(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.artists = resp.entity;
      })
      .catch((error: any) => {
        this.artists = [];
      });
  }

  async getSupervisors() {
    await this.showsService
      .getDaybookSupervisors(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.supervisors = resp.entity;
      })
      .catch((error: any) => {
        this.supervisors = [];
      });
  }

  async getCustomfieldsByEntityId(entityId: any) {
    let cfType = "Shot";
    if (this.type == "task") {
      cfType = "Task";
    }
    await this.customFieldService
      .getCustomfieldsByEntityId(entityId, cfType)
      .toPromise()
      .then((resp) => {
        this.customFields = resp.entity;
      })
      .catch((e) => {
        this.customFields = null;
      });
  }

  async getLocations() {
    await this.showsService
      .getLocations()
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          this.locations = resp.entity;
        }
      })
      .catch((error: any) => {
        this.locations = null;
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
