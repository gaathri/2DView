import { Component, OnInit, Input } from "@angular/core";
import { UploadChangeParam, NzMessageService } from "ng-zorro-antd";
import { NzDrawerRef } from "ng-zorro-antd";
import { ShowsService } from "../../shows/shows.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { AppConstants } from "src/app/constants/AppConstants";

@Component({
  selector: "app-import-csv",
  templateUrl: "./import-csv.component.html",
  styleUrls: ["./import-csv.component.scss"],
})
export class ImportCsvComponent implements OnInit {
  @Input() shotOutCopy: any;
  @Input() mode: any;
  @Input() parentDrawerRef: any;
  headerId: any = null;
  isUploadVisible: boolean;
  isHeaderMapVisible: boolean;
  isReportVisible: boolean;
  isFinalSubmitVisible: boolean;
  rows: any;
  tableColumns: any;
  errorTableColumns: any;
  dbCSVHeaders: any;
  fileCSVHeaders: any;
  processId: any;
  mappingHeader: any;
  editing = {};
  csvUploadValidateResp: any;
  errorRows: any;
  errorInfo = {};
  isEdited = {};
  errEditing = {};
  artists: any;
  supervisors: any;
  taskTypes: any;
  taskPriorities: any;
  taskcomplexities = [
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
  date = null;
  createCount = 0;
  updateCount = 0;

  constructor(
    private msg: NzMessageService,
    private drawerRef: NzDrawerRef<string>,
    private showsService: ShowsService,
    private helperService: HelperService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.prepareData();
    this.isUploadVisible = true;
  }

  enableEdit(colName: any) {
    this.resetEditFlags();
    this.editing[colName] = true;
  }

  isEditing(colName: any) {
    return this.editing[colName];
  }
  onChange(event: any, row: any, col: any) {
    row[col.name] = event;
    this.editing[col.name] = false;
  }
  resetEditFlags() {
    for (let key in this.editing) {
      if (this.editing.hasOwnProperty(key)) {
        this.editing[key] = false;
      }
    }
  }
  setTableColumns() {
    this.tableColumns = [];
    this.mappingHeader = {};
    for (let i = 0; i < this.fileCSVHeaders.length; i++) {
      this.tableColumns.push({
        index: i,
        name: this.fileCSVHeaders[i],
        displayName: this.fileCSVHeaders[i],
        defaultDisplay: true,
        sortable: false,
      });
      this.mappingHeader[this.fileCSVHeaders[i]] = this.findHeader(
        this.fileCSVHeaders[i]
      );
    }
  }

  findHeader(name: any) {
    let headerName = "Map Header";
    this.editing[name] = true;
    if (this.dbCSVHeaders.includes(name)) {
      this.editing[name] = false;
      headerName = name;
    }

    return headerName;
  }

  async prepareData() {
    await this.getCSVHeaders();
  }

  handleChange({ file, fileList }: UploadChangeParam): void {
    const status = file.status;

    if (status !== "uploading") {
    }
    if (status === "done") {
      this.msg.success(`${file.name} file uploaded successfully.`);
      this.drawerRef.nzWidth = "90%";
      this.fileCSVHeaders = file.response.entity.headers;
      this.processId = file.response.entity.processId;
      this.setTableColumns();
      this.rows = [this.mappingHeader, ...file.response.entity.mapping];
      this.isUploadVisible = false;
      this.isHeaderMapVisible = true;
    } else if (status === "error") {
      this.msg.error(`${file.name} file upload failed.`);
      //this.drawerRef.nzWidth = 1280;
    }
  }

  uploadAPI = () => {
    return (
      this.showsService.uploadCSVFileEndPoint() + "/" + this.shotOutCopy.showId
    );
  };

  canValidate() {
    for (let i = 0; i < this.fileCSVHeaders.length; i++) {
      if (
        this.rows &&
        this.rows[0] &&
        this.fileCSVHeaders[i] &&
        this.rows[0][this.fileCSVHeaders[i]] === "Map Header"
      ) {
        return false;
      }
    }
    return true;
  }

  async getCSVHeaders() {
    await this.showsService
      .getCSVHeaders()
      .toPromise()
      .then((resp: any) => {
        this.dbCSVHeaders = resp.entity;
      })
      .catch((error: any) => {
        this.dbCSVHeaders = [];
      });
  }

  async validateHandler() {
    let data = [];
    for (let i in this.rows[0]) {
      data.push(this.rows[0][i]);
    }

    await this.showsService
      .validateCSV(data, this.shotOutCopy.showId, this.processId)
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          if (resp.entity.shots) {
            this.errorRows = resp.entity.shots;
            this.showErrorTable();
          } else {
            if (resp.entity.hasOwnProperty("createCount")) {
              this.createCount = resp.entity.createCount;
            }
            if (resp.entity.hasOwnProperty("updateCount")) {
              this.updateCount = resp.entity.updateCount;
            }
            if (this.createCount > 0 || this.updateCount > 0) {
              this.isFinalSubmitVisible = true;
            }
          }
        }
      })
      .catch((error: any) => {});
  }

  async getArtists() {
    await this.showsService
      .getArtistsByShowId(this.shotOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.artists = resp.entity;
      })
      .catch((error: any) => {
        this.artists = [];
      });
  }

  async getSupervisorList() {
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

  setErrorTableColumns() {
    this.errorTableColumns = [];
    this.mappingHeader = {};
    for (let i = 0; i < this.fileCSVHeaders.length; i++) {
      this.errorTableColumns.push({
        index: i,
        name: this.columnNameMapper(this.fileCSVHeaders[i]),
        displayName: this.fileCSVHeaders[i],
        defaultDisplay: true,
        sortable: false,
      });
      this.mappingHeader[this.fileCSVHeaders[i]] = this.findHeader(
        this.fileCSVHeaders[i]
      );
    }
  }

  columnNameMapper(displayName: any) {
    let colNameMap = {
      Show: "showName",
      Sequence: "sequence",
      "Shot Code": "shotCode",
      "Head In": "headIn",
      "Tail Out": "tailOut",
      "Cut In": "cutIn",
      "Cut Out": "cutOut",
      "Frames Per Second": "framesPerSec",
      "Plate Path": "platePath",
      Task: "taskType",
      "Shot Description Notes": "taskNotes",
      "Task Description": "taskNotes",
      "Client Bid": "clientBid",
      "Client ETA": "clientEta",
      "Artist Bid": "artistBid",
      "Start Date": "startDate",
      "End Date": "endDate",
      "Delivery Date": "deliveryDate",
      Artist: "artistName",
      Accountable: "accountable",
      Priority: "priority",
      "Annotation Path": "annotationPath",
      Complexity: "complexity",
    };
    return colNameMap[displayName];
  }

  showErrorTable() {
    this.isHeaderMapVisible = false;
    this.isReportVisible = true;
    this.setErrorTableColumns();
    this.frameErrorInfo();
  }

  frameErrorInfo() {
    for (let i = 0; i < this.errorRows.length; i++) {
      let row = this.errorRows[i];
      for (let j = 0; j < this.dbCSVHeaders.length; j++) {
        let colName = this.columnNameMapper(this.dbCSVHeaders[j]);
        this.pushError(row, colName, i);
      }
    }
  }

  pushError(row: any, colName: any, rowIndex: any) {
    for (let i = 0; i < row.errors.length; i++) {
      let errInfo = row.errors[i];
      if (colName === this.columnNameMapper(errInfo.key)) {
        this.errorInfo[rowIndex + "-" + colName] = errInfo.value;
      }
    }
  }

  hasError(row: any, col: any, rowIndex: any) {
    if (this.isEdited[rowIndex + "-" + col.name]) {
      return false;
    }
    if (this.errorInfo[rowIndex + "-" + col.name]) {
      return true;
    }
    return false;
  }

  isUpdated(row: any, col: any, rowIndex: any) {
    if (this.isEdited[rowIndex + "-" + col.name]) {
      return true;
    }
    return false;
  }

  getTitle(row: any, col: any, rowIndex: any) {
    if (this.errorInfo[rowIndex + "-" + col.name]) {
      return this.errorInfo[rowIndex + "-" + col.name];
    } else {
      return row[col.name];
    }
  }

  disabledOldDates = (startValue: Date): boolean => {
    //return;
    if (!startValue) {
      return false;
    }
    let today = new Date();
    let yesterday = new Date(today.setDate(today.getDate() - 1));
    return startValue.getTime() < yesterday.getTime();
  };

  dateOpenChange(row: any, col: any, rowIndex: any, isOpen: any) {
    if (!isOpen) {
      this.errEditing[rowIndex + "-" + col.name] = false;
    }
  }

  updateValue(row: any, col: any, rowIndex: any, event: any) {
    this.clearErrorDetails(row, col, rowIndex);
    row[col.name] = Number(event.target.value);
  }

  updateDateValue(row: any, col: any, rowIndex: any, event: any) {
    this.clearErrorDetails(row, col, rowIndex);
    let curr = this.helperService.transformDate(event, "MMMM d,y");
    row[col.name] = curr;
  }

  inlineEditHandler(row: any, col: any, rowIndex: any) {
    this.resetErrorEditFlags();
    this.errEditing[rowIndex + "-" + col.name] = true;
    if (col.name === "artistName") {
      if (!this.isValidArr(this.artists)) {
        this.getArtists();
      }
    } else if (col.name === "accountable") {
      if (!this.isValidArr(this.supervisors)) {
        this.getSupervisorList();
      }
    } else if (col.name === "taskType") {
      if (!this.isValidArr(this.taskTypes)) {
        this.getTaskTypes();
      }
    } else if (col.name === "priority") {
      if (!this.isValidArr(this.taskPriorities)) {
        this.getTaskPriorities();
      }
    } else if (col.name === "complexity") {
    }
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

  onModelChange(row: any, col: any, rowIndex: any, event: any) {
    this.clearErrorDetails(row, col, rowIndex);
  }

  clearErrorDetails(row: any, col: any, rowIndex: any) {
    this.errorInfo[rowIndex + "-" + col.name] = "";
    this.isEdited[rowIndex + "-" + col.name] = true;
    this.errEditing[rowIndex + "-" + col.name] = false;
  }

  resetErrorEditFlags() {
    for (let key in this.errEditing) {
      if (this.errEditing.hasOwnProperty(key)) {
        this.errEditing[key] = false;
      }
    }
  }

  getArtistNameById(id: any) {
    let matched = this.helperService.findObjectInArrayByKey(
      this.artists,
      "id",
      id
    );
    if (matched) {
      return matched.title;
    } else {
      return "";
    }
  }
  canEdit(row: any, col: any, rowIndex: any) {
    if (this.errorInfo[rowIndex + "-" + col.name]) {
      return true;
    }
    return false;
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  canValidateData() {
    for (let key in this.errorInfo) {
      if (this.errorInfo.hasOwnProperty(key)) {
        if (this.errorInfo[key] != "") {
          return false;
        }
      }
    }
    return true;
  }

  async validateDataHandler() {
    let payload = this.errorRows.map((row: any) => {
      const item = { ...row };
      const {
        recordType,
        errors,
        hasError,
        showId,
        valid,
        ...payloadItem
      } = item;
      return payloadItem;
    });

    await this.showsService
      .validateData(payload, this.shotOutCopy.showId, this.processId)
      .toPromise()
      .then((resp: any) => {
        this.createCount = resp.entity.createCount;
        this.updateCount = resp.entity.updateCount;
        this.isFinalSubmitVisible = true;
      })
      .catch((error: any) => {});
  }

  async submitDataHandler() {
    this.isFinalSubmitVisible = false;
    let isSuccess = false;
    await this.showsService
      .submitData(this.shotOutCopy.showId, this.processId)
      .toPromise()
      .then((resp: any) => {
        isSuccess = true;
        this.showNotification({
          type: "success",
          title: "Success",
          content: AppConstants.SHOT_CSV_IMPORT_SUCCESS,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      })
      .catch((error: any) => {
        this.showNotification({
          type: "error",
          title: "Error",
          content: AppConstants.SHOT_CSV_IMPORT_ERROR,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      });
    this.close(isSuccess);
  }

  close(isSuccess): void {
    this.drawerRef.close(isSuccess);
    this.parentDrawerRef.close(isSuccess);
  }

  cancelDataHandler() {
    this.isFinalSubmitVisible = false;
  }

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
