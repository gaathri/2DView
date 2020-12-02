import {
  Component,
  OnInit,
  Input,
  ViewChild,
  TemplateRef,
  ElementRef,
} from "@angular/core";
import { NzDrawerRef, NzDrawerService } from "ng-zorro-antd";
import { NotificationService } from "src/app/modules/core/services/notification.service";
import { HelperService } from "src/app/modules/core/services/helper.service";
import { ShowsService } from "../../shows/shows.service";
import { AppConstants } from "src/app/constants/AppConstants";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AssetsService } from "../../shows/assets.service";
import { isSameDay, isAfter } from "date-fns";
import { CustomFieldService } from "../../configs/custom-field.service";
import { CustomFieldComponent } from "../custom-field/custom-field.component";
import { ShotsService } from "../../shows/shots.service";

@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.component.html",
  styleUrls: ["./task-form.component.scss"],
})
export class TaskFormComponent implements OnInit {
  @ViewChild("linkDrawerHeader", { static: false })
  linkDrawerHeader: TemplateRef<{}>;
  @ViewChild("inputElement", { static: false }) inputElement?: ElementRef;
  @Input() taskOut: any;
  @Input() taskOutCopy: any;
  @Input() mode: any;
  @Input() disableShowSelect: boolean;
  @Input() showName: boolean;
  @Input() type: any;
  disableShotSelect: boolean;
  disableAssetSelect: boolean;
  isDataReady: boolean;
  shows: any;
  artists: any;
  supervisors: any;
  shots: any;
  assets: any;
  taskTypes: any;
  taskPriorities: any;
  taskcomplexities: any;
  packingTemplates: any;
  locations: any;
  taskNameMaxLength = AppConstants.MAX_LENGTH_NAME;
  taskDescriptionMaxLength = AppConstants.MAX_LENGTH_DESC;
  taskNotesMaxLength = AppConstants.MAX_LENGTH_DESC;
  mandatoryErrorInfo: any;
  dataForm: FormGroup;
  btnName: any;
  taskCategory = "shot";
  linkInfo = [];
  title: string;
  childDrawerRef: any;
  customFieldsFormData: any;
  isCustomFieldsValid: boolean;
  customFields: any;
  taskColumns: any;
  time = null;

  constructor(
    private drawerRef: NzDrawerRef<string>,
    private notificationService: NotificationService,
    private helperService: HelperService,
    private showsService: ShowsService,
    private shotsService: ShotsService,
    private assetsService: AssetsService,
    private customFieldService: CustomFieldService,
    private fb: FormBuilder,
    private drawerService: NzDrawerService
  ) {}

  ngOnInit() {
    this.btnName = this.mode === "update" ? "Update" : "Add";
    this.prepareData();
  }

  async prepareData() {
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
    if (!this.taskOut) {
      this.taskOut = {
        showId: null,
        taskCategory: this.type ? this.type : "shot",
        shotId: null,
        assetId: null,
        taskName: null,
        description: null,
        notes: null,
        taskTypeId: null,
        accountable: null,
        artistId: null,
        startDate: null,
        endDate: null,
        clientBid: null,
        //artistBid: null,
        bidCost: null,
        biddingUnit: null,
        taskValueCost: null,
        clientEta: null,
        deliveryDate: null,
        deltaEta: null,
        taskPriorityId: null,
        complexity: null,
        referencePath: null,
        anotationPath: null,
        locationId: null,
        isSubTask: false,
      };
    }
    this.taskOutCopy = JSON.parse(JSON.stringify(this.taskOut));
    if (!this.disableShowSelect) {
      await this.getShowList();
    }
    await this.getLocations();
    await this.getTaskColumnList();
    await this.getTaskPriorities();
    if (this.taskOut && this.taskOut.showId) {
      await this.getShotList();
      await this.getAssetList();
      await this.getArtists();
      await this.getPackingTemplates();
      await this.getSupervisors();
      await this.getCustomfieldsByEntityId(this.taskOutCopy.showId);
      /*if (this.taskOut.shotId || this.taskOut.assetId) {        
        await this.getTaskTypes();
      }*/
    }
    this.buildFormData();
    if (this.taskOut && this.taskOut.showId) {
      if (this.taskOut.shotId || this.taskOut.assetId) {
        await this.getTaskTypes();
      }
    }
    this.isDataReady = true;
    /*if (this.clientBidField) {
      this.clientBidField.instance.set(this.taskOutCopy.clientEta);
    }
    setTimeout(() => {
      console.log(this.clientBidField);
      if (this.clientBidField) {
        this.clientBidField.instance.set(this.taskOutCopy.clientEta);
      }
    }, 500);*/
  }

  buildFormData() {
    if (this.taskOut) {
      this.taskCategory = "shot";
      this.taskOutCopy.taskCategory = "shot";
      if (this.taskOutCopy.shotId) {
        this.disableShotSelect = true;
      } else if (this.taskOutCopy.assetId) {
        this.disableAssetSelect = true;
        this.taskCategory = "asset";
        this.taskOutCopy.taskCategory = "asset";
      }
    }
    this.dataForm = this.fb.group({
      showId: [this.taskOutCopy.showId, [Validators.required]],
      taskCategory: [this.taskOutCopy.taskCategory],
      shotId: [this.taskOutCopy.shotId, [Validators.required]],
      assetId: [this.taskOutCopy.assetId],
      taskName: [
        this.taskOutCopy.taskName,
        [Validators.required, Validators.pattern(AppConstants.itemNameRE)],
      ],
      description: [this.taskOutCopy.description],
      notes: [this.taskOutCopy.notes],
      taskTypeId: [this.taskOutCopy.taskTypeId, [Validators.required]],
      accountable: [this.taskOutCopy.accountable],
      artistId: [this.taskOutCopy.artistId],
      startDate: [this.taskOutCopy.startDate],
      endDate: [this.taskOutCopy.endDate],
      clientBid: [this.taskOutCopy.clientBid],
      //artistBid: [this.taskOutCopy.artistBid],
      bidCost: [this.taskOutCopy.bidCost],
      biddingUnit: [this.taskOutCopy.biddingUnit],
      taskValueCost: [this.taskOutCopy.taskValueCost],
      clientEta: [this.taskOutCopy.clientEta],
      deliveryDate: [this.taskOutCopy.deliveryDate],
      deltaEta: [this.taskOutCopy.deltaEta],
      taskPriorityId: [this.taskOutCopy.taskPriorityId],
      complexity: [this.taskOutCopy.complexity],
      referencePath: [this.taskOutCopy.referencePath],
      anotationPath: [this.taskOutCopy.anotationPath],
      locationId: [this.taskOutCopy.locationId],
      isSubTask: [this.taskOutCopy.isSubTask ? true : false],
      packingTemplateId: [this.taskOutCopy.packingTemplateId],
      eta: [this.taskOutCopy.eta],
    });
    if (this.mode === "update") {
      this.customFieldsFormData = this.taskOutCopy.customFields;
      this.isCustomFieldsValid = this.validateCustomFields();
    }

    if (this.taskOutCopy.eta) {
      this.time = new Date();
      let str = this.taskOutCopy.eta.toString();
      if (str.indexOf(":") > -1) {
        let h = str.split(":")[0];
        let m = str.split(":")[1];
        if (h) {
          this.time.setHours(h);
        } else {
          this.time.setHours(0);
        }
        this.time.setMinutes(m);
      } else {
        this.time.setHours(this.taskOutCopy.eta);
        this.time.setMinutes(0);
      }
    }

    this.requiredChange();
  }

  requiredChange(): void {
    this.taskCategory = this.dataForm.controls.taskCategory.value;
    if (this.taskCategory === "shot") {
      this.dataForm.get("shotId")!.setValidators(Validators.required);
      this.dataForm.get("assetId")!.clearValidators();
      this.dataForm.controls.assetId.setValue(null);
    } else {
      this.dataForm.get("shotId")!.clearValidators();
      this.dataForm.get("assetId")!.setValidators(Validators.required);
      this.dataForm.controls.shotId.setValue(null);
    }
    this.type = this.taskCategory;
  }

  onDeltaChange(value: string): void {
    this.updateValue(value);
  }

  value: any = "";

  updateValue(value: string): void {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(+value) && reg.test(value)) || value === "" || value === "-") {
      this.value = value;
    }
    this.inputElement!.nativeElement.value = this.value;
  }

  async getShowList() {
    await this.showsService
      .getShows()
      .toPromise()
      .then((resp: any) => {
        this.shows = resp.entity;
      })
      .catch((error: any) => {
        this.shows = [];
      });
  }

  async getArtists() {
    await this.showsService
      .getArtistsByShowId(this.taskOutCopy.showId)
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
      .getSupervisorsByShowId(this.taskOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.supervisors = resp.entity;
      })
      .catch((error: any) => {
        this.supervisors = [];
      });
  }

  async getTaskTypes() {
    let entityId = null;
    let serviceName = "";
    if (this.type === "shot") {
      entityId = this.taskOutCopy.shotId;
      serviceName = "getTaskTypesByShotId";
    } else if (this.type === "asset") {
      entityId = this.taskOutCopy.assetId;
      serviceName = "getTaskTypesByAssetId";
    }
    if (!entityId) {
      return;
    }

    await this.showsService[serviceName](entityId)
      .toPromise()
      .then((resp: any) => {
        this.taskTypes = resp.entity;
      })
      .catch((error: any) => {
        this.taskTypes = [];
      });
  }

  async getPackingTemplates() {
    await this.showsService
      .getPackingTemplatesNew(this.taskOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        if (resp && resp.entity) {
          this.packingTemplates = resp.entity;
        }
      })
      .catch((error: any) => {
        this.packingTemplates = null;
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

  async getTaskColumnList() {
    let params = `?entityId=${this.taskOutCopy.showId}`;
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

  async getShotList() {
    await this.shotsService
      .getShotsByShowId(this.taskOutCopy.showId)
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
      .getAssetListByShowId(this.taskOutCopy.showId)
      .toPromise()
      .then((resp: any) => {
        this.assets = resp.entity;
      })
      .catch((error: any) => {
        this.assets = [];
      });
  }

  async getCustomfieldsByEntityId(entityId: any) {
    await this.customFieldService
      .getCustomfieldsByEntityId(entityId, "Task")
      .toPromise()
      .then((resp) => {
        this.customFields = resp.entity;
        this.addCustomFieldsLink();
      })
      .catch((e) => {
        this.customFields = null;
      });
  }

  validCustomFieldsForm() {
    if (this.linkInfo && this.linkInfo.length > 0) {
      let isValid =
        this.customFieldsFormData && this.isCustomFieldsValid ? true : false;
      if (!isValid) {
        isValid = this.validateCustomFields();
      }
      this.linkInfo[0].isValid = isValid;
      return isValid;
    }
    return true;
  }

  addCustomFieldsLink() {
    let isMandatoryFieldPresent = this.helperService.isMandatoryFieldPresent(
      this.customFields
    );
    if (this.customFields && this.customFields.length > 0) {
      let customFieldLink = {
        id: 1,
        title: "Custom Fields",
        type: "custom_fields",
        modaltitle: "Custom Fields",
        isValid: true,
        isMandatoryFieldPresent: isMandatoryFieldPresent,
      };
      this.linkInfo[0] = customFieldLink;
    }
  }

  assetChangeHandler() {
    this.taskOutCopy.assetId = this.dataForm.controls.assetId.value;
    this.dataForm.controls.taskTypeId.setValue(null);
    this.taskTypes = [];
    this.getTaskTypes();
  }
  shotChangeHandler() {
    this.taskOutCopy.shotId = this.dataForm.controls.shotId.value;
    this.dataForm.controls.taskTypeId.setValue(null);
    this.taskTypes = [];
    this.getTaskTypes();
  }

  showChangeHandler() {
    this.taskOutCopy.shotId = null;
    this.taskOutCopy.assetId = null;
    this.taskOutCopy.artistId = null;
    this.taskOutCopy.taskTypeId = null;
    this.taskOutCopy.accountable = null;

    this.dataForm.controls.shotId.setValue(null);
    this.dataForm.controls.assetId.setValue(null);
    this.dataForm.controls.artistId.setValue(null);
    this.dataForm.controls.taskTypeId.setValue(null);
    this.dataForm.controls.accountable.setValue(null);
    this.dataForm.controls.packingTemplateId.setValue(null);

    this.shots = [];
    this.assets = [];
    this.artists = [];
    this.taskTypes = [];
    this.supervisors = [];
    this.customFields = [];
    this.packingTemplates = [];

    this.taskOutCopy.showId = this.dataForm.controls.showId.value;

    this.getShotList();
    this.getAssetList();
    this.getArtists();
    this.getSupervisors();
    this.getPackingTemplates();
    this.getCustomfieldsByEntityId(this.taskOutCopy.showId);
  }

  isValidArr(arr: any) {
    return this.helperService.isValidArr(arr);
  }

  onStartDateChange(e: any) {
    this.dataForm.controls.endDate.setValue(null);
    this.dataForm.controls.clientEta.setValue(null);
    this.dataForm.controls.deliveryDate.setValue(null);

  }

  linkClickHandler(link: any) {
    this.title = link.modaltitle;
    link.isValid = true;
    this.openFrom(link.type);
  }

  openFrom(type: string): void {
    if (type === "users") {
    } else if (type === "templates") {
    } else if (type === "custom_fields") {
      this.drawerRef.nzOffsetX = 500;
      this.childDrawerRef = this.drawerService.create<
        CustomFieldComponent,
        { mode: string; parentOutCopy: any; callback: any; customFields?: any },
        string
      >({
        nzTitle: this.linkDrawerHeader,
        nzContent: CustomFieldComponent,
        nzContentParams: {
          mode: this.mode,
          parentOutCopy: this.taskOutCopy,
          callback: this.setCustomFieldsFormData.bind(this),
          customFields: this.customFields,
        },
        nzClosable: false,
        nzWidth: "500px",
        nzWrapClassName: "modal-wrapper",
        nzOnCancel: () =>
          new Promise((resolve, reject) => {
            this.drawerRef.nzOffsetX = 0;
            resolve(true);
            return;
          }),
      });

      this.childDrawerRef.afterOpen.subscribe(() => {});

      this.childDrawerRef.afterClose.subscribe((data) => {
        this.clearErrorInfo();
      });
    } else if (type === "fields") {
    }
  }

  setCustomFieldsFormData(data: any, isValid: boolean) {
    this.customFieldsFormData = data;
    this.isCustomFieldsValid = isValid;
    this.consolidateData();
  }

  consolidateData() {
    let postObj = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.customFieldsFormData) {
      postObj.customFields = this.customFieldsFormData;
    }

    this.taskOutCopy = JSON.parse(JSON.stringify(postObj));
  }

  closeForm(): void {
    this.drawerRef.nzOffsetX = 0;
    this.childDrawerRef.close();
  }

  clearErrorInfo() {
    this.mandatoryErrorInfo = null;
  }

  /*disabledStartDate = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    let today = new Date();
    let yesterday = new Date(today.setDate(today.getDate() - 1));
    return startValue.getTime() < yesterday.getTime();
  };

  disabledClientETA = (startValue: Date): boolean => {
    if (!startValue) {
      return false;
    }
    let today = new Date();
    let yesterday = new Date(today.setDate(today.getDate() - 1));
    return startValue.getTime() < yesterday.getTime();
  };*/

  isEndDateDisabled() {
    let startValue = this.dataForm.controls.startDate.value;
    if (!startValue) {
      return true;
    }
    return false;
  }

  /*disabledEndDate = (endValue: Date): boolean => {    
    let startValue = new Date(this.dataForm.controls.startDate.value);
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.getTime() < startValue.getTime();
  };*/

  disabledEndDate = (endValue: Date): boolean => {
    let startValue = new Date(this.dataForm.controls.startDate.value);
    if (!endValue || !startValue) {
      return false;
    }
    if (isSameDay(startValue, endValue) || isAfter(endValue, startValue)) {
      return false;
    }
    return true;
    //return startValue.getTime() >= endValue.getTime();
  };

  showNotification(info: any) {
    this.notificationService.showNotification(info);
  }

  async submitHandler() {
    let isValidCustomFieldsForm = this.validCustomFieldsForm();

    for (const i in this.dataForm.controls) {
      this.dataForm.controls[i].markAsDirty();
      this.dataForm.controls[i].updateValueAndValidity();
    }
    if (!this.dataForm.valid) {
      return;
    }

    if (!isValidCustomFieldsForm) {
      return;
    }
    this.consolidateData();

    this.transformData();
    let successMessage = AppConstants.TASK_CREATION_SUCCESS;
    let errorMessage = AppConstants.TASK_CREATION_ERROR;
    let serviceName = "createTask";
    let isSuccess = false;
    let postObj = JSON.parse(JSON.stringify(this.taskOutCopy));

    if (postObj.isSubTask) {
      postObj.isSubTask = 1;
    } else {
      postObj.isSubTask = 0;
    }
    if (this.mode === "update") {
      postObj.id = this.taskOut.id;
      successMessage = AppConstants.TASK_MODIFICATION_SUCCESS;
      errorMessage = AppConstants.TASK_MODIFICATION_ERROR;
      serviceName = "updateTask";
    }
    await this.showsService[serviceName](postObj)
      .toPromise()
      .then((resp: any) => {
        isSuccess = true;
        this.showNotification({
          type: "success",
          title: "Success",
          content: successMessage,
          duration: AppConstants.NOTIFICATION_DURATION,
        });
      })
      .catch((error: any) => {
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
    this.close(isSuccess);
  }

  close(isSuccess: any): void {
    this.drawerRef.close(isSuccess);
  }

  transformData() {
    //this.taskOutCopy = JSON.parse(JSON.stringify(this.dataForm.value));
    if (this.taskOutCopy.startDate) {
      this.taskOutCopy.startDate = this.helperService.transformDate(
        new Date(this.taskOutCopy.startDate),
        "yyyy-MM-dd 00:00:00"
      );
    }
    if (this.taskOutCopy.endDate) {
      this.taskOutCopy.endDate = this.helperService.transformDate(
        new Date(this.taskOutCopy.endDate),
        "yyyy-MM-dd 23:59:59"
      );
    }
    if (this.taskOutCopy.clientEta) {
      this.taskOutCopy.clientEta = this.helperService.transformDate(
        new Date(this.taskOutCopy.clientEta),
        "yyyy-MM-dd 23:59:59"
      );
    }
    if (this.taskOutCopy.deliveryDate) {
      this.taskOutCopy.deliveryDate = this.helperService.transformDate(
        new Date(this.taskOutCopy.deliveryDate),
        "yyyy-MM-dd 23:59:59"
      );
    }

    this.taskOutCopy.clientBid = Number(this.taskOutCopy.clientBid);
    this.taskOutCopy.deltaEta = Number(this.taskOutCopy.deltaEta);
    //this.taskOutCopy.artistBid = Number(this.taskOutCopy.artistBid);
    this.taskOutCopy.bidCost = Number(this.taskOutCopy.bidCost);
    this.taskOutCopy.biddingUnit = Number(this.taskOutCopy.biddingUnit);
    this.taskOutCopy.taskValueCost = Number(this.taskOutCopy.taskValueCost);
    delete this.taskOutCopy.taskCategory;
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

  validateCustomFields2() {
    /*let customFields = null;
    let customFieldsNew = null;
    if (this.isValidArr(this.customFieldsFormData)) {
      customFields = JSON.parse(JSON.stringify(this.customFieldsFormData)); //SHOW level custom field values.
    }
    if (this.isValidArr(this.customFields)) {
      customFieldsNew = JSON.parse(JSON.stringify(this.customFields)); //CONFIG level custom fields. Admin may be added or deleted.
    }
    if (!this.isValidArr(customFieldsNew)) {
      //if there is no config level custom fields.
      //no need to have this check.
      return true;
    }

    if (!this.isValidArr(customFields)) {
      //config level custom fields available, but no vaild data in show level.
      return false;
    }

    //below steps : comparing config and show level custom field values.
    let c = customFieldsNew.filter(
      (o: any) => !customFields.find((o2) => o.id === o2.id)
    );
    if (c && c.length > 0) {
      c = JSON.parse(JSON.stringify(c));
      customFieldsNew = customFields.concat(c);
    } else {
      customFieldsNew = customFields;
    }

    //private fb: FormBuilder
    let customFieldForm: FormGroup = this.fb.group({});
    for (let i = 0; i < customFieldsNew.length; i++) {
      let customField = customFieldsNew[i];
      customFieldForm.addControl(
        customField.name,
        this.fb.control(customField.value)
      );
      if (customField.isMandatory) {
        customFieldForm
          .get(customField.name)!
          .setValidators(Validators.required);
      }
    }
    return customFieldForm.valid;*/
  }

  validateCustomFields() {
    let customFields = null;
    let customFieldsNew = null;
    if (this.isValidArr(this.customFieldsFormData)) {
      customFields = JSON.parse(JSON.stringify(this.customFieldsFormData)); //SHOW level custom field values.
    }
    if (this.isValidArr(this.customFields)) {
      customFieldsNew = JSON.parse(JSON.stringify(this.customFields)); //CONFIG level custom fields. Admin may be added or deleted.
    }
    if (!this.isValidArr(customFieldsNew)) {
      //if there is no config level custom fields.
      //no need to have this check.
      return true;
    }

    // if (!this.isValidArr(customFields)) {
    //config level custom fields available, but no vaild data in show level.
    //return false;
    // }

    if (this.isValidArr(customFields)) {
      //below steps : comparing config and show level custom field values.
      let c = customFieldsNew.filter(
        (o: any) => !customFields.find((o2) => o.id === o2.id)
      );
      if (c && c.length > 0) {
        c = JSON.parse(JSON.stringify(c));
        customFieldsNew = customFields.concat(c);
      } else {
        customFieldsNew = customFields;
      }
    }

    //private fb: FormBuilder
    let customFieldForm: FormGroup = this.fb.group({});
    for (let i = 0; i < customFieldsNew.length; i++) {
      let customField = customFieldsNew[i];
      customFieldForm.addControl(
        customField.name,
        this.fb.control(customField.value)
      );
      if (customField.isMandatory) {
        customFieldForm
          .get(customField.name)!
          .setValidators(Validators.required);
      }
    }
    for (const i in customFieldForm.controls) {
      customFieldForm.controls[i].markAsDirty();
      customFieldForm.controls[i].updateValueAndValidity();
    }
    return customFieldForm.valid;
  }

  isWorkStarted() {
    if (this.mode === "create" || this.taskOut.workStatusId == 1) {
      return false;
    }
    return true;
  }

  onTimeChange(e) {
    let eta = this.helperService.transformDate(e, "HH:mm");
    this.dataForm.controls.eta.setValue(eta);
  }

  getDisplayDateFormat() {
    return AppConstants.DISPLAY_DATE_FORMAT;
  }
}
