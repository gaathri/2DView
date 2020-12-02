import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from "@angular/core";
import { Page } from "src/app/modules/shared/model/page";
import { EpisodesService } from "../episodes.service";
import { NzDrawerService, NzModalService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { SeasonsService } from "../seasons.service";
import { EpisodeFormComponent } from "../../modals/episode-form/episode-form.component";
import { InteractionService } from "src/app/modules/core/services/interaction.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-episodelist-tab",
  templateUrl: "./episodelist-tab.component.html",
  styleUrls: ["./episodelist-tab.component.scss"],
})
export class EpisodelistTabComponent implements OnInit, OnDestroy {
  @Input() showIn: any;
  @ViewChild("drawerHeader", { static: false }) drawerHeader: TemplateRef<{}>;
  @ViewChild("myTable", { static: false }) table: any;
  @Input() isReadOnly: boolean;

  showDummy: boolean;
  childDrawerRef: any;
  isEmptyData: boolean;
  isDataReady: boolean;
  isLoading: boolean = true;
  rows: any;
  showId: any;
  page = new Page();
  selectedPageSize: any;
  pageSizeOptions: any;
  editing = {};
  tableColumns: any;
  selectedTableColumns: any;
  selected = [];
  isEditSuccess: boolean;
  isAlertVisible: boolean;
  episodeToDelete: any;

  /** Dropdown inline edit vars - START */
  isVisible: boolean;
  modalTitle: any;
  myrow: any;
  mycol: any;

  isSeasonSelect: boolean;
  seasons: any;
  selectedSeasonId: any;

  /** Dropdown inline edit vars - END*/

  episodeOut: any;
  currPageInfo: any;

  isSearching: boolean;
  searchPattern = "";
  sortBy: any = "";
  orderBy: any = "";
  subscription: Subscription;
  drawerTitle: any;
  tableHeight: any = "calc(100vh - 200px)";

  constructor(
    private seasonService: SeasonsService,
    private episodeService: EpisodesService,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private drawerService: NzDrawerService,
    private modalService: NzModalService,
    private interactionService: InteractionService
  ) {
    this.page.pageNumber = 0;
    this.page.size = 10;
    this.pageSizeOptions = AppConstants.TABLE_PAGE_SIZE_OPTIONS;
    this.selectedPageSize = this.page.size;
  }

  ngOnInit() {
    this.isReadOnly = this.helperService.isReadOnly(
      AppConstants.PERMISSIONS.EPISODE
    );
    this.showId = this.showIn.id;
    /*this.helperService.isGlobalAddEnabled = false;
    this.subscription = this.interactionService
      .getInteraction()
      .subscribe(interaction => {
        if (interaction.type === "global-add") {
          this.createEpisode();
        }
      });*/
    this.getTableColumns();
  }

  ngOnDestroy() {
    //this.subscription.unsubscribe();
  }

  setPageSize() {
    let pageInfo = {
      pageSize: this.selectedPageSize,
      offset: 0,
    };
    this.setPage(pageInfo);
  }

  getTableColumns() {
    this.tableColumns = [
      {
        name: "episodeName",
        displayName: "Episode Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: false,
      },
      {
        name: "description",
        displayName: "Description",
        defaultDisplay: true,
        sortable: false,
        isEditable: this.isReadOnly ? false : true,
      },
      {
        name: "seasonName",
        displayName: "Season Name",
        defaultDisplay: true,
        sortable: true,
        isEditable: this.isReadOnly ? false : true,
      },
      {
        name: "completionPercentage",
        displayName: "Progress",
        defaultDisplay: true,
        sortable: false,
        isEditable: false,
      },
    ];
    this.frameSelectedColumns();
    this.isDataReady = true;
  }

  frameSelectedColumns() {
    this.selectedTableColumns = this.tableColumns.filter((item, index) => {
      item["index"] = index;
      return item.defaultDisplay;
    });
  }

  searchHandler() {
    this.isSearching = true;
  }

  searchDetails() {
    if (this.searchPattern == "") {
      this.isSearching = false;
    }
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  searchBlur() {
    if (this.searchPattern == "") {
      this.isSearching = false;
      this.currPageInfo.offset = 0;
      this.setPage(this.currPageInfo);
    }
  }

  clearSearch() {
    this.searchPattern = "";
    this.isSearching = false;
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  getSpace(value: any) {
    //return 0;
    if (value < 10) {
      return 2;
    } else if (value >= 10 && value < 100) {
      return 1;
    } else {
      return 0;
    }
  }

  getProgressConfig(row: any) {
    //let defaultCode = "#038e4e";
    //let code = this.getStatusColorCode(row); // && row.statusColorCode ? row.statusColorCode : defaultCode;
    return {
      showInfo: false,
      type: "line",
      strokeLinecap: "square",
      //strokeWidth: 8,
      //strokeColor: code,
    };
  }

  setPage(pageInfo: any) {
    //this.rows = [];
    this.currPageInfo = pageInfo;
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.page.size = pageInfo.pageSize;
    this.page.search = this.searchPattern;
    this.page.sortBy = this.sortBy;
    this.page.orderBy = this.orderBy;
    this.showDummy = true;
    this.episodeService.getEpisodeTableList(this.page, this.showId).subscribe(
      (resp) => {
        if (resp && resp.valid) {
          this.page.totalElements = resp.total;
          this.page.totalPages = Math.ceil(resp.total / this.page.size);
          this.rows = resp.coll;
          //this.framePercent(this.rows);
          setTimeout(() => {
            this.isLoading = false;
            this.table.recalculate();
            try {
              let parentHeight = this.table.bodyComponent.scroller.parentElement.getBoundingClientRect()
                .height;
              let childHeight = this.table.bodyComponent.scroller.element.getBoundingClientRect()
                .height;
              if (childHeight > parentHeight) {
                this.showDummy = false;
              } else {
                this.showDummy = true;
              }
              if (this.rows.length <= 10) {
                this.showDummy = true;
              }
            } catch (e) {}
          }, 500);
        } else {
          this.isLoading = false;
          this.onDataError(resp);
        }
        this.setTableHeight();
      },
      (error) => {
        this.isLoading = false;
        this.onDataError(error);
      }
    );
  }

  framePercent(rows) {
    for (let i = 0; i < rows.length; i++) {
      rows[i].completionPercentage = i * 20;
    }
  }

  onDataError(error: any) {
    this.isEmptyData = true;
  }

  createEpisode() {
    this.drawerTitle = "Add Episode";
    let episodeInfo = {
      showId: this.showId,
    };
    this.openEpisodeForm("create", episodeInfo);
  }

  async editHandler(row: any) {
    await this.getEpisode(row.id);
    if (this.episodeOut) {
      this.drawerTitle = "Edit Episode";
      this.openEpisodeForm("update", this.episodeOut);
    }
  }

  async getEpisode(id: any) {
    await this.episodeService
      .getEpisode(id)
      .toPromise()
      .then((resp) => {
        this.episodeOut = resp.entity;
      })
      .catch((error) => {
        this.episodeOut = null;
      });
  }

  openEpisodeForm(mode: any, episodeOut: any): void {
    this.childDrawerRef = this.drawerService.create<
      EpisodeFormComponent,
      {
        episodeOut: any;
        mode: string;
        disableShowSelect?: boolean;
        showName?: any;
      },
      string
    >({
      nzTitle: this.drawerHeader,
      nzContent: EpisodeFormComponent,
      nzContentParams: {
        episodeOut: episodeOut,
        mode: mode,
        disableShowSelect: true,
        showName: this.showIn.showName,
      },
      nzClosable: false,
      nzWidth: "30%",
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
        this.setPage(this.currPageInfo);
      }
    });
  }

  closeForm(): void {
    this.childDrawerRef.close();
  }

  onSort(event) {
    this.sortBy = event.sorts[0].prop;
    this.orderBy = event.sorts[0].dir.toUpperCase();
    this.currPageInfo.offset = 0;
    this.setPage(this.currPageInfo);
  }

  onSelect({ selected }) {}

  getColWidth(colName: any) {
    if (colName === "completionPercentage") {
      return 200;
    }
    return 300;
  }

  enableEdit(row: any, col: any) {
    this.resetEditFlags();
    this.editing[row.id + "-" + col.name] = true;
  }

  resetEditFlags() {
    for (let key in this.editing) {
      if (this.editing.hasOwnProperty(key)) {
        this.editing[key] = false;
      }
    }
  }

  inlineEditHandler(row: any, col: any) {
    this.resetEditFlags();
    this.myrow = row;
    this.mycol = col;

    this.isSeasonSelect = false;
    this.modalTitle = "";

    if (col.name === "seasonName") {
      this.modalTitle = "Edit Season";
      this.selectedSeasonId = row.seasonId;
      this.isSeasonSelect = true;
      this.getSeasons();
    }
    if (this.modalTitle !== "") {
      this.showModal();
    }
  }

  async inlineEditConfirm(row: any, col: any) {
    let shotId = row.id;
    let shotIn: any;
    this.isVisible = false;
    if (col.name === "seasonName") {
      this.isSeasonSelect = false;
      if (this.selectedSeasonId !== row.seasonId) {
        shotIn = {
          type: "seasonId",
          seasonId: row.seasonId,
        };
        await this.updateConfirm(row, col, shotId, shotIn);
        if (this.isEditSuccess) {
          row[col.name] = this.getSeasonNameById(row.seasonId);
        }
      }
    }
  }

  inlineEditCancel(row: any, col: any) {
    this.isVisible = false;
    if (col.name === "seasonName") {
      this.isSeasonSelect = false;
      row.seasonId = this.selectedSeasonId;
    }
  }

  getSeasonNameById(id: any) {
    let matched = this.helperService.findObjectInArrayByKey(
      this.seasons,
      "id",
      id
    );
    if (matched) {
      return matched.seasonName;
    } else {
      return "";
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  async updateValue(row: any, col: any, event: any) {
    if (row[col.name] != event.target.value) {
      let episodeId = row.id;
      let episodeIn = {
        type: col.name,
      };
      episodeIn[col.name] = event.target.value;
      await this.updateConfirm(row, col, episodeId, episodeIn);
    }
    if (this.isEditSuccess) {
      row[col.name] = event.target.value;
    }
    this.editing[row.id + "-" + col.name] = false;
  }

  async updateConfirm(row: any, col: any, episodeId: any, episodeIn: any) {
    this.isEditSuccess = false;
    let errorMessage = "Record update failed.";
    await this.episodeService
      .inlineEdit(episodeId, episodeIn)
      .toPromise()
      .then((resp: any) => {
        this.isEditSuccess = true;
      })
      .catch((error: any) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.isEditSuccess = false;
      });
    if (this.isEditSuccess) {
      this.showNotification({
        type: "success",
        title: "Success",
        content: "Record updated successfully.",
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    } else {
      this.showNotification({
        type: "error",
        title: "Error",
        content: errorMessage,
        duration: AppConstants.NOTIFICATION_DURATION,
      });
    }
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  deleteHandler(row: any) {
    this.isAlertVisible = true;
    this.episodeToDelete = row;
  }

  deleteEpisodeConfirm = async () => {
    let successMessage = "Episode has been successfully deleted.";
    let errorMessage = "Episode deletion failed.";
    this.isAlertVisible = false;
    await this.episodeService
      .deleteEpisode(this.episodeToDelete.id)
      .toPromise()
      .then((resp) => {
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
        if (this.currPageInfo.offset > 0 && this.rows.length == 1) {
          this.currPageInfo.offset = this.currPageInfo.offset - 1;
        }
        this.setPage(this.currPageInfo);
      })
      .catch((error) => {
        let errorDetails = this.helperService.getErrorDetails(error);
        if (errorDetails !== "") {
          errorMessage = `<b>${errorMessage}</b>` + errorDetails;
        }
        this.showNotification({
          type: "error",
          title: "Error",
          content: errorMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
  };

  deleteEpisodeCancel = () => {
    this.isAlertVisible = false;
  };

  async getSeasons() {
    await this.seasonService
      .getSeasonList(this.showId)
      .toPromise()
      .then((resp: any) => {
        this.seasons = resp.entity;
      })
      .catch((error: any) => {
        this.seasons = [];
      });
  }

  setTableHeight() {
    if (!this.isValidArr(this.rows)) {
      this.tableHeight = 150 + "px";
    } else {
      if (this.rows.length <= 10) {
        this.tableHeight = this.rows.length * 50 + 120 + "px";
      } else {
        this.tableHeight = "calc(100vh - 300px)";
      }
    }
  }

  getTableHeight() {
    return this.tableHeight;
  }
}
